# backend/ai/agents/literature_agent.py

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))

from backend.services.vector_db_service import VectorDBService
from backend.services.llm_router_service import LLMRouterService
from sentence_transformers import SentenceTransformer
import torch

LITERATURE_AGENT_PROMPT = """
You are a scientific literature analyst specializing in microbiome and LBP research.

Task: Analyze the provided literature context to answer the user's query.

User Query: {query}

Context from Literature:
---
{context}
---

Instructions:
1.  Synthesize the key findings from the literature provided in the context.
2.  Directly answer the user's query based on these findings.
3.  If the context is insufficient, state that you could not find enough information in the database.
4.  Cite the sources using their IDs (e.g., [pmid-12345]).

Answer:
"""

class LiteratureAnalysisAgent:
    def __init__(self):
        self.vector_db = VectorDBService()
        self.llm_router = LLMRouterService()
        
        # This model should be consistent with the one used in the embedding pipeline
        self.embedding_model = SentenceTransformer(
            'microsoft/BiomedNLP-PubMedBERT-base-uncased-abstract-fulltext',
            device='cuda' if torch.cuda.is_available() else 'cpu'
        )

    def run(self, query: str):
        """
        Runs the literature analysis agent.
        1.  Generates an embedding for the user's query.
        2.  Queries the vector database to find relevant documents.
        3.  Constructs a prompt with the query and context.
        4.  Sends the prompt to an LLM.
        5.  Returns the LLM's response.
        """
        print(f"Literature Agent received query: '{query}'")

        # 1. Generate query embedding
        query_embedding = self.embedding_model.encode(query, convert_to_tensor=True).tolist()

        # 2. Query vector database
        search_results = self.vector_db.query_index(
            query_vector=query_embedding,
            top_k=5,
            namespace="pubmed-articles"
        )
        
        if not search_results or not search_results['matches']:
            return "I could not find any relevant documents in the vector database."

        # 3. Construct context for the prompt
        context_str = ""
        for match in search_results['matches']:
            context_str += f"Source ID: {match['id']}\n"
            context_str += f"Title: {match['metadata']['title']}\n"
            # In a real scenario, we'd include more of the text. For now, title is a placeholder.
            context_str += "---\n"
            
        prompt = LITERATURE_AGENT_PROMPT.format(query=query, context=context_str)

        # 4. Send to LLM
        # Using the 'literature_search' task defined in the llm_config
        response = self.llm_router.route_query(task="literature_search", prompt=prompt)
        
        return response


if __name__ == '__main__':
    # To run this example, ensure the embedding pipeline has been run at least once in mock mode.
    import os
    os.environ['MOCK_VECTOR_DB'] = 'True'
    
    # We need to run the embedding pipeline first to have some data to query
    from backend.ai.embedding_pipeline import EmbeddingPipeline
    print("Seeding mock database...")
    # Using a smaller number of articles for the example run
    pipeline = EmbeddingPipeline(search_query="IBD", max_articles=10)
    pipeline.run()
    print("Mock database seeded.")
    
    # Now, run the agent
    agent = LiteratureAnalysisAgent()
    
    # A query that should match the data we just seeded
    user_query = "What is the relationship between IBD and the microbiome?"
    
    agent_response = agent.run(user_query)
    
    print("\n--- Agent Response ---")
    print(agent_response)
