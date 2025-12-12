"""
Genskey Literature Service - RAG Pipeline for Scientific Literature
- PubMed Integration
- Pinecone Vector Store
- LLM-based Analysis
"""
import os
from fastapi import APIRouter, Depends, HTTPException, Body
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

from backend.config import settings
from Bio import Entrez
from pinecone import Pinecone
from transformers import AutoTokenizer, AutoModel
import torch
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain.schema.output_parser import StrOutputParser

# --- Router Setup ---
router = APIRouter()

# --- Initialize External Services ---
# Pinecone
pc = None
index = None
if settings.PINECONE_API_KEY and settings.PINECONE_ENVIRONMENT:
    try:
        pc = Pinecone(api_key=settings.PINECONE_API_KEY)
        if settings.PINECONE_INDEX_NAME in pc.list_indexes().names():
            index = pc.Index(settings.PINECONE_INDEX_NAME)
        else:
            # For this example, we're not creating an index here to keep it simple.
            # In a real app, you'd have an admin endpoint or a setup script to create it.
            print(f"Warning: Pinecone index '{settings.PINECONE_INDEX_NAME}' not found.")
    except Exception as e:
        print(f"Error initializing Pinecone: {e}")

# PubMed
if settings.PUBMED_EMAIL:
    Entrez.email = settings.PUBMED_EMAIL
else:
    print("Warning: PUBMED_EMAIL not set. NCBI may block requests.")
    Entrez.email = "default_email@example.com" # Provide a default

# Sentence Transformer for Embeddings
tokenizer = AutoTokenizer.from_pretrained('sentence-transformers/all-MiniLM-L6-v2')
embedding_model = AutoModel.from_pretrained('sentence-transformers/all-MiniLM-L6-v2')

# LangChain LLM Setup
llm = None
if settings.OPENAI_API_KEY:
    llm = ChatOpenAI(openai_api_key=settings.OPENAI_API_KEY, model_name="gpt-4")
else:
    print("Warning: OPENAI_API_KEY not set. RAG query functionality will be limited.")

# --- Pydantic Models ---
class PubMedSearchRequest(BaseModel):
    query: str = Field(..., description="The search query for PubMed.", example="CRISPR gene editing in microglia")
    max_results: int = Field(10, gt=0, le=100, description="Maximum number of articles to retrieve.")

class Article(BaseModel):
    id: str
    title: str
    abstract: str
    url: str
    metadata: Dict[str, Any] = {}

class RagQueryRequest(BaseModel):
    query: str = Field(..., description="The question to ask the RAG system.")
    top_k: int = Field(3, gt=0, le=10, description="Number of relevant documents to retrieve.")

class RagQueryResponse(BaseModel):
    answer: str
    retrieved_articles: List[Article]

# --- Helper Functions ---
def get_embeddings(texts: List[str]) -> List[List[float]]:
    """Generates embeddings for a list of texts."""
    encoded_input = tokenizer(texts, padding=True, truncation=True, return_tensors='pt')
    with torch.no_grad():
        model_output = embedding_model(**encoded_input)
    
    # Perform pooling (mean pooling)
    token_embeddings = model_output.last_hidden_state
    input_mask_expanded = encoded_input['attention_mask'].unsqueeze(-1).expand(token_embeddings.size()).float()
    sum_embeddings = torch.sum(token_embeddings * input_mask_expanded, 1)
    sum_mask = torch.clamp(input_mask_expanded.sum(1), min=1e-9)
    return (sum_embeddings / sum_mask).tolist()

# --- API Endpoints ---
@router.post("/literature/search-and-ingest", response_model=List[Article])
async def search_and_ingest_pubmed(request: PubMedSearchRequest):
    """
    Searches PubMed for articles and ingests them into the vector store.
    """
    if not index:
        raise HTTPException(status_code=500, detail="Pinecone index is not available.")

    try:
        # Search PubMed
        handle = Entrez.esearch(db="pubmed", term=request.query, retmax=request.max_results)
        record = Entrez.read(handle)
        handle.close()
        id_list = record["IdList"]

        # Fetch details
        handle = Entrez.efetch(db="pubmed", id=id_list, rettype="abstract", retmode="xml")
        papers = Entrez.read(handle)["PubmedArticle"]
        handle.close()
        
        articles_to_ingest = []
        for paper in papers:
            article_info = paper['MedlineCitation']['Article']
            pmid = str(paper['MedlineCitation']['PMID'])
            title = article_info.get('ArticleTitle', 'No Title Available')
            
            abstract_parts = article_info.get('Abstract', {}).get('AbstractText', [])
            abstract = " ".join(abstract_parts) if abstract_parts else "No Abstract Available"
            
            if not abstract or abstract == "No Abstract Available":
                continue

            articles_to_ingest.append(Article(
                id=pmid,
                title=title,
                abstract=abstract,
                url=f"https://pubmed.ncbi.nlm.nih.gov/{pmid}/",
                metadata={
                    "journal": article_info.get('Journal', {}).get('Title', 'N/A'),
                    "pub_year": article_info.get('Journal', {}).get('JournalIssue', {}).get('PubDate', {}).get('Year', 'N/A')
                }
            ))

        if not articles_to_ingest:
            return []

        # Generate embeddings
        abstracts = [article.abstract for article in articles_to_ingest]
        embeddings = get_embeddings(abstracts)

        # Upsert to Pinecone
        vectors_to_upsert = []
        for article, embedding in zip(articles_to_ingest, embeddings):
            vectors_to_upsert.append({
                "id": article.id,
                "values": embedding,
                "metadata": {
                    "title": article.title,
                    "abstract": article.abstract,
                    "url": article.url,
                    **article.metadata
                }
            })
        
        index.upsert(vectors=vectors_to_upsert)

        return articles_to_ingest

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")


@router.post("/literature/query", response_model=RagQueryResponse)
async def query_literature_rag(request: RagQueryRequest):
    """
    Queries the literature RAG system to get an answer to a question.
    """
    if not index:
        raise HTTPException(status_code=500, detail="Pinecone index is not available.")

    # 1. Get embedding for the query
    query_embedding = get_embeddings([request.query])[0]

    # 2. Query Pinecone
    try:
        query_result = index.query(
            vector=query_embedding,
            top_k=request.top_k,
            include_metadata=True
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to query Pinecone: {str(e)}")

    retrieved_docs = query_result.get('matches', [])
    if not retrieved_docs:
        return RagQueryResponse(answer="Could not find relevant articles.", retrieved_articles=[])

    # 3. Formulate a prompt and invoke the LLM
    prompt_template = """
    Based *only* on the following scientific abstracts, synthesize an answer to the user's question.
    Cite the PubMed IDs (PMID) of the articles that support your answer. The PMID is the 'id' field of each article.
    If the answer cannot be found in the provided abstracts, state that clearly.

    Context from abstracts:
    {context}

    User's Question: {question}

    Synthesized Answer:
    """
    prompt = ChatPromptTemplate.from_template(prompt_template)
    
    chain = prompt | llm | StrOutputParser()
    
    answer = chain.invoke({
        "context": context,
        "question": request.query
    })

    return RagQueryResponse(
        answer=answer,
        retrieved_articles=retrieved_articles
    )
