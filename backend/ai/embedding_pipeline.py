# backend/ai/embedding_pipeline.py

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))


from backend.services.pubmed_service import PubMedService
from backend.services.vector_db_service import VectorDBService
from sentence_transformers import SentenceTransformer
import torch

class EmbeddingPipeline:
    def __init__(self, search_query: str, max_articles: int = 100):
        self.search_query = search_query
        self.max_articles = max_articles
        
        # Initialize services
        self.pubmed_service = PubMedService()
        self.vector_db_service = VectorDBService()
        
        # Initialize embedding model
        # Using a model compatible with the 768 dimension set in pinecone
        self.device = 'cuda' if torch.cuda.is_available() else 'cpu'
        print(f"Using device: {self.device}")
        self.embedding_model = SentenceTransformer(
            'microsoft/BiomedNLP-PubMedBERT-base-uncased-abstract-fulltext',
            device=self.device
        )

    def run(self):
        """
        Runs the full embedding pipeline.
        1. Searches for articles on PubMed.
        2. Fetches article details.
        3. Generates embeddings for title and abstract.
        4. Upserts the embeddings into the vector database.
        """
        print(f"Starting embedding pipeline for query: '{self.search_query}'")
        
        # 1. Search for articles
        article_ids = self.pubmed_service.search_articles(
            query=self.search_query,
            max_results=self.max_articles
        )
        if not article_ids:
            print("No articles found for the query.")
            return
            
        print(f"Found {len(article_ids)} articles.")

        # 2. Fetch article details
        articles = self.pubmed_service.fetch_article_details(article_ids)
        if not articles:
            print("Could not fetch article details.")
            return

        print(f"Successfully fetched details for {len(articles)} articles.")

        # 3. Generate embeddings
        print("Generating embeddings...")
        texts_to_embed = [
            f"{article['title']}. {article['abstract']}" for article in articles
            if article['abstract']
        ]
        
        # Filter out articles that had no abstract
        articles_with_text = [
            article for article in articles if article['abstract']
        ]

        embeddings = self.embedding_model.encode(
            texts_to_embed,
            show_progress_bar=True,
            convert_to_tensor=True
        )
        print(f"Generated {len(embeddings)} embeddings.")

        # 4. Prepare and upsert vectors
        vectors_to_upsert = []
        for i, article in enumerate(articles_with_text):
            vector = {
                "id": f"pmid-{article['pmid']}",
                "values": embeddings[i].tolist(),
                "metadata": {
                    "title": article['title'],
                    "journal": article['journal'],
                    "year": article.get('year'),
                    "authors": ", ".join(article.get('authors', [])[:3]), # Store first 3 authors
                    "source": "PubMed"
                }
            }
            vectors_to_upsert.append(vector)
            
        if not vectors_to_upsert:
            print("No vectors to upsert.")
            return

        print(f"Preparing to upsert {len(vectors_to_upsert)} vectors to Pinecone...")
        
        # Upsert in batches to avoid overwhelming the API
        batch_size = 100
        for i in range(0, len(vectors_to_upsert), batch_size):
            batch = vectors_to_upsert[i:i + batch_size]
            self.vector_db_service.upsert_vectors(batch, namespace="pubmed-articles")
            print(f"Upserted batch {i//batch_size + 1}")

        print("Embedding pipeline completed successfully! 🎉")


if __name__ == '__main__':
    # This is an example of how to run the pipeline.
    # It requires PUBMED_EMAIL and PINECONE_API_KEY to be set in the environment.
    
    # The user wants to "Upload seed data (1000 papers)"
    # We can use this script to do that.
    
    # For demonstration purposes, we will run in mock mode.
    import os
    os.environ['MOCK_VECTOR_DB'] = 'True'
    
    # Let's define a relevant search query for the Genskey Bio Platform.
    LBP_QUERY = (
        "((live biotherapeutic product) OR (LBP) OR (microbiome) OR "
        "(Faecalibacterium prausnitzii) OR (Akkermansia muciniphila)) AND "
        "((irritable bowel syndrome) OR (IBD) OR (Crohn's disease) OR (ulcerative colitis))"
    )

    pipeline = EmbeddingPipeline(search_query=LBP_QUERY, max_articles=1000)
    pipeline.run()
