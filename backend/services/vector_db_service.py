import os
from pinecone import Pinecone, ServerlessSpec
from dotenv import load_dotenv
import numpy as np

# Load environment variables
load_dotenv()

class VectorDBService:
    def __init__(self, index_name="genskey-research"):
        self.mock_mode = os.getenv("MOCK_VECTOR_DB", "False").lower() == 'true'
        
        if self.mock_mode:
            print("Running VectorDBService in MOCK mode.")
            self.in_memory_db = {}
            self.index = self._get_or_create_index()
        else:
            self.pinecone_api_key = os.getenv("PINECONE_API_KEY")
            if not self.pinecone_api_key or self.pinecone_api_key == "your-pinecone-api-key":
                raise ValueError(
                    "PINECONE_API_KEY is not set or is a placeholder. "
                    "Please set a valid Pinecone API key in your .env file."
                )
            self.pinecone = Pinecone(api_key=self.pinecone_api_key)
            self.index = self._get_or_create_index()

    def _get_or_create_index(self):
        """
        Gets a Pinecone index or creates it if it doesn't exist.
        In mock mode, it simulates this by returning a mock index object.
        """
        if self.mock_mode:
            return self # Return self to act as the index
        
        if index_name not in self.pinecone.list_indexes().names():
            print(f"Creating Pinecone index '{self.index_name}'...")
            self.pinecone.create_index(
                name=self.index_name,
                dimension=768,  # Based on PubMedBERT embedding dimension
                metric='cosine',
                spec=ServerlessSpec(
                    cloud='aws',
                    region='us-west-2' # Or another supported region
                )
            )
            print(f"Index '{self.index_name}' created successfully.")
        
        return self.pinecone.Index(self.index_name)

    def upsert_vectors(self, vectors, namespace="default"):
        """
        Upserts vectors into the Pinecone index.
        In mock mode, it stores them in an in-memory dictionary.
        """
        if not vectors:
            return
        
        if self.mock_mode:
            if namespace not in self.in_memory_db:
                self.in_memory_db[namespace] = []
            # Assuming vectors are in the format pinecone expects: list of dicts with id, values, metadata
            self.in_memory_db[namespace].extend(vectors)
            print(f"Mock upserted {len(vectors)} vectors into namespace '{namespace}'.")
            return

        try:
            self.index.upsert(vectors=vectors, namespace=namespace)
        except Exception as e:
            print(f"Error upserting vectors to Pinecone: {e}")
            raise

    def query_index(self, query_vector, top_k=10, namespace="default", filter_criteria=None):
        """
        Queries the Pinecone index.
        In mock mode, it performs a cosine similarity search on the in-memory data.
        """
        if self.mock_mode:
            if namespace not in self.in_memory_db or not self.in_memory_db[namespace]:
                return {"matches": []}

            # Simple cosine similarity implementation
            query_vector_np = np.array(query_vector)
            
            all_vectors = self.in_memory_db[namespace]
            
            # Note: This is a very inefficient search, for mock purposes only.
            results = []
            for vec_data in all_vectors:
                db_vector_np = np.array(vec_data['values'])
                similarity = np.dot(query_vector_np, db_vector_np) / (np.linalg.norm(query_vector_np) * np.linalg.norm(db_vector_np))
                results.append({
                    "id": vec_data['id'],
                    "score": similarity,
                    "metadata": vec_data['metadata']
                })
            
            results.sort(key=lambda x: x['score'], reverse=True)
            
            return {"matches": results[:top_k]}

        try:
            return self.index.query(
                vector=query_vector,
                top_k=top_k,
                namespace=namespace,
                filter=filter_criteria,
                include_metadata=True
            )
        except Exception as e:
            print(f"Error querying Pinecone index: {e}")
            raise

# Example Usage:
# if __name__ == '__main__':
#     # To run in mock mode, set MOCK_VECTOR_DB=True in your environment
#     os.environ['MOCK_VECTOR_DB'] = 'True'
    
#     vector_db = VectorDBService()
    
#     mock_vectors = [
#         {"id": "doc1", "values": [0.1] * 768, "metadata": {"title": "Paper A", "year": 2022}},
#         {"id": "doc2", "values": [0.2] * 768, "metadata": {"title": "Paper B", "year": 2023}},
#     ]
    
#     vector_db.upsert_vectors(mock_vectors, namespace="pubmed-abstracts")
    
#     query_vec = [0.15] * 768
#     results = vector_db.query_index(query_vec, top_k=2, namespace="pubmed-abstracts")
    
#     print("Query results:")
#     for match in results['matches']:
#         print(f"  - ID: {match['id']}, Score: {match['score']:.4f}, Metadata: {match['metadata']}")


