# backend/services/knowledge_graph_service.py

import os
from neo4j import GraphDatabase
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class KnowledgeGraphService:
    def __init__(self):
        uri = os.getenv("NEO4J_URI")
        user = os.getenv("NEO4J_USER")
        password = os.getenv("NEO4J_PASSWORD")

        if not all([uri, user, password]):
            raise ValueError("NEO4J_URI, NEO4J_USER, and NEO4J_PASSWORD must be set in the environment.")

        self._driver = GraphDatabase.driver(uri, auth=(user, password))
        self._create_constraints()

    def close(self):
        self._driver.close()

    def _create_constraints(self):
        """
        Creates unique constraints on nodes to prevent duplicates.
        This is idempotent and only needs to be run once.
        """
        with self._driver.session() as session:
            session.run("CREATE CONSTRAINT ON (p:Paper) ASSERT p.pmid IS UNIQUE")
            session.run("CREATE CONSTRAINT ON (s:Strain) ASSERT s.id IS UNIQUE")
            session.run("CREATE CONSTRAINT ON (d:Disease) ASSERT d.name IS UNIQUE")
            session.run("CREATE CONSTRAINT ON (g:Gene) ASSERT g.name IS UNIQUE")
            session.run("CREATE CONSTRAINT ON (t:Clinical_Trial) ASSERT t.nct_id IS UNIQUE")
            session.run("CREATE CONSTRAINT ON (c:Company) ASSERT c.name IS UNIQUE")
        print("Neo4j constraints created (or already exist).")


    def add_paper(self, pmid: str, title: str, abstract: str, year: int):
        with self._driver.session() as session:
            session.run(
                "MERGE (p:Paper {pmid: $pmid}) SET p.title = $title, p.abstract = $abstract, p.year = $year",
                pmid=pmid, title=title, abstract=abstract, year=year
            )

    def add_strain(self, strain_id: str, species: str):
        with self._driver.session() as session:
            session.run(
                "MERGE (s:Strain {id: $strain_id}) SET s.species = $species",
                strain_id=strain_id, species=species
            )

    def add_disease(self, name: str):
        with self._driver.session() as session:
            session.run("MERGE (d:Disease {name: $name})", name=name)

    def link_paper_to_disease(self, pmid: str, disease_name: str):
        with self._driver.session() as session:
            session.run(
                "MATCH (p:Paper {pmid: $pmid}), (d:Disease {name: $disease_name}) "
                "MERGE (p)-[:INVESTIGATES]->(d)",
                pmid=pmid, disease_name=disease_name
            )

    def link_paper_to_strain(self, pmid: str, strain_id: str):
        with self._driver.session() as session:
            session.run(
                "MATCH (p:Paper {pmid: $pmid}), (s:Strain {id: $strain_id}) "
                "MERGE (p)-[:STUDIES]->(s)",
                pmid=pmid, strain_id=strain_id
            )

    def link_strain_to_disease(self, strain_id: str, disease_name: str, treatment_effect: str = "treats"):
        with self._driver.session() as session:
            # Using a dynamic relationship type can be tricky, ensure it's from a controlled vocabulary.
            # For now, hardcoding to TREATS, but could be parameterized.
            session.run(
                "MATCH (s:Strain {id: $strain_id}), (d:Disease {name: $disease_name}) "
                "MERGE (s)-[:TREATS]->(d)",
                strain_id=strain_id, disease_name=disease_name
            )
    
    def find_papers_about_disease(self, disease_name: str):
        with self._driver.session() as session:
            result = session.run(
                "MATCH (p:Paper)-[:INVESTIGATES]->(d:Disease {name: $disease_name}) "
                "RETURN p.pmid as pmid, p.title as title",
                disease_name=disease_name
            )
            return [{"pmid": record["pmid"], "title": record["title"]} for record in result]

# Example Usage:
# if __name__ == '__main__':
#     kg_service = KnowledgeGraphService()
    
#     # Add some nodes
#     kg_service.add_paper("12345", "A paper about something", "Abstract...", 2023)
#     kg_service.add_disease("IBD")
#     kg_service.add_strain("GNS001", "F. prausnitzii")
    
#     # Add some relationships
#     kg_service.link_paper_to_disease("12345", "IBD")
#     kg_service.link_paper_to_strain("12345", "GNS001")
#     kg_service.link_strain_to_disease("GNS001", "IBD")
    
#     print("Added sample data to Neo4j.")

#     # Find data
#     papers = kg_service.find_papers_about_disease("IBD")
#     print("\nPapers about IBD:")
#     for paper in papers:
#         print(f" - {paper['title']} (PMID: {paper['pmid']})")

#     kg_service.close()
