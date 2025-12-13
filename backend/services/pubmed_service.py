# backend/services/pubmed_service.py

from Bio import Entrez
import os

class PubMedService:
    def __init__(self, email=None):
        """
        Initializes the PubMed service. An email is required by NCBI for API access.
        """
        self.email = email or os.getenv("PUBMED_EMAIL")
        if not self.email:
            raise ValueError("An email address must be provided for PubMed API access, either directly or via the PUBMED_EMAIL environment variable.")
        Entrez.email = self.email
        # In case of API key, you can set it like this:
        # Entrez.api_key = os.getenv("NCBI_API_KEY")

    def search_articles(self, query: str, max_results=100):
        """
        Searches for articles on PubMed.
        
        Args:
            query: The search query (e.g., "microbiome AND IBD").
            max_results: The maximum number of article IDs to return.
        
        Returns:
            A list of PubMed article IDs.
        """
        try:
            handle = Entrez.esearch(db="pubmed", term=query, retmax=max_results)
            record = Entrez.read(handle)
            handle.close()
            return record["IdList"]
        except Exception as e:
            print(f"Error searching PubMed for query '{query}': {e}")
            return []

    def fetch_article_details(self, pubmed_ids: list):
        """
        Fetches details for a list of PubMed article IDs.
        
        Args:
            pubmed_ids: A list of PubMed IDs.
            
        Returns:
            A list of dictionaries, where each dictionary contains the details of an article.
        """
        if not pubmed_ids:
            return []
            
        try:
            handle = Entrez.efetch(db="pubmed", id=pubmed_ids, rettype="medline", retmode="text")
            # The response is in MEDLINE format, which is not easily parsable with Entrez.read
            # A more robust solution would parse this text, but for now we will use 'abstract' rettype which gives XML
            handle.close()

            # Let's re-fetch with a more structured format
            handle = Entrez.efetch(db="pubmed", id=pubmed_ids, rettype="abstract", retmode="xml")
            records = Entrez.read(handle)
            handle.close()

            articles = []
            for record in records['PubmedArticle']:
                article_info = {
                    "pmid": str(record['MedlineCitation']['PMID']),
                    "title": record['MedlineCitation']['Article']['ArticleTitle'],
                    "abstract": self._get_abstract(record),
                    "journal": record['MedlineCitation']['Article']['Journal']['Title'],
                    "year": record['MedlineCitation']['Article']['Journal']['JournalIssue']['PubDate'].get('Year'),
                    "authors": self._get_authors(record),
                }
                articles.append(article_info)
            return articles

        except Exception as e:
            print(f"Error fetching details for PubMed IDs: {e}")
            return []

    def _get_abstract(self, record):
        """Helper to extract abstract text, handling different structures."""
        abstract_parts = []
        if 'Abstract' in record['MedlineCitation']['Article']:
            for part in record['MedlineCitation']['Article']['Abstract']['AbstractText']:
                abstract_parts.append(str(part))
        return "\n".join(abstract_parts)

    def _get_authors(self, record):
        """Helper to extract author names."""
        authors = []
        if 'AuthorList' in record['MedlineCitation']['Article']:
            for author in record['MedlineCitation']['Article']['AuthorList']:
                if 'LastName' in author and 'ForeName' in author:
                    authors.append(f"{author['ForeName']} {author['LastName']}")
        return authors


# Example Usage:
# if __name__ == '__main__':
#     # This assumes you have PUBMED_EMAIL set in your .env file
#     pubmed_service = PubMedService(email="your.email@example.com")
    
#     # Search for articles
#     search_query = "Fecal microbiota transplantation for C. difficile infection"
#     article_ids = pubmed_service.search_articles(search_query, max_results=5)
#     print(f"Found {len(article_ids)} articles for query: '{search_query}'")
#     print(article_ids)
    
#     # Fetch details
#     if article_ids:
#         articles_details = pubmed_service.fetch_article_details(article_ids)
#         print("\nDetails of first article:")
#         if articles_details:
#             import json
#             print(json.dumps(articles_details[0], indent=2))
