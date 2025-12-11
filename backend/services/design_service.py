"""
GenskeyDesign - Consortium Engineering Service
GNN-based interaction prediction and metabolic modeling
"""

from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional
from pydantic import BaseModel

from database import get_db

router = APIRouter()


# Pydantic models
class MicrobeNode(BaseModel):
    """Microbe node in interaction network"""
    id: str
    name: str
    name_zh: Optional[str]
    abundance: float
    phylum: str
    safety_level: str


class InteractionEdge(BaseModel):
    """Interaction edge between microbes"""
    source: str
    target: str
    interaction_type: str  # "competition", "mutualism", "commensalism"
    strength: float
    confidence: float


class NetworkGraph(BaseModel):
    """Complete microbiome interaction network"""
    nodes: List[MicrobeNode]
    edges: List[InteractionEdge]
    metadata: Dict[str, Any]


class ConsortiumDesignRequest(BaseModel):
    """Consortium design request"""
    target_disease: str
    target_metabolites: List[str]
    constraints: Dict[str, Any]


class ConsortiumDesignResponse(BaseModel):
    """Consortium design result"""
    design_id: str
    strains: List[Dict[str, Any]]
    ratios: List[float]
    predicted_stability: float
    predicted_efficacy: float
    warnings: List[str]


class MetabolicSimulation(BaseModel):
    """Metabolic simulation result"""
    time_points: List[float]
    biomass: Dict[str, List[float]]  # Strain -> [biomass over time]
    metabolites: Dict[str, List[float]]  # Metabolite -> [concentration over time]
    stability_score: float


@router.post("/network/predict", response_model=NetworkGraph)
async def predict_interaction_network(
    sample_ids: List[str],
    db: Session = Depends(get_db)
):
    """
    Predict microbial interaction network using Graph Attention Networks
    Learns from clinical co-occurrence data
    """
    # Mock GNN prediction - In production, this would call the trained GAT model
    mock_network = NetworkGraph(
        nodes=[
            MicrobeNode(
                id="strain_001",
                name="Bacteroides fragilis",
                name_zh="脆弱拟杆菌",
                abundance=0.35,
                phylum="Bacteroidetes",
                safety_level="BSL-1"
            ),
            MicrobeNode(
                id="strain_002",
                name="Faecalibacterium prausnitzii",
                name_zh="普氏粪杆菌",
                abundance=0.25,
                phylum="Firmicutes",
                safety_level="BSL-1"
            ),
            MicrobeNode(
                id="strain_003",
                name="Akkermansia muciniphila",
                name_zh="嗜黏蛋白阿克曼菌",
                abundance=0.15,
                phylum="Verrucomicrobia",
                safety_level="BSL-1"
            ),
            MicrobeNode(
                id="strain_004",
                name="Roseburia intestinalis",
                name_zh="肠道罗氏菌",
                abundance=0.12,
                phylum="Firmicutes",
                safety_level="BSL-1"
            ),
            MicrobeNode(
                id="pathogen_001",
                name="Klebsiella pneumoniae",
                name_zh="肺炎克雷伯菌",
                abundance=0.08,
                phylum="Proteobacteria",
                safety_level="BSL-2"
            )
        ],
        edges=[
            InteractionEdge(
                source="strain_001",
                target="strain_002",
                interaction_type="mutualism",
                strength=0.85,
                confidence=0.92
            ),
            InteractionEdge(
                source="strain_002",
                target="strain_004",
                interaction_type="mutualism",
                strength=0.78,
                confidence=0.88
            ),
            InteractionEdge(
                source="strain_001",
                target="pathogen_001",
                interaction_type="competition",
                strength=-0.65,
                confidence=0.90
            ),
            InteractionEdge(
                source="strain_003",
                target="pathogen_001",
                interaction_type="competition",
                strength=-0.72,
                confidence=0.85
            ),
            InteractionEdge(
                source="strain_003",
                target="strain_002",
                interaction_type="commensalism",
                strength=0.45,
                confidence=0.75
            )
        ],
        metadata={
            "model": "MicrobeGAT-v1",
            "attention_heads": 8,
            "training_samples": 15000
        }
    )
    
    return mock_network


@router.post("/consortium/design", response_model=ConsortiumDesignResponse)
async def design_consortium(
    request: ConsortiumDesignRequest,
    db: Session = Depends(get_db)
):
    """
    Design optimal consortium using RL agent
    Maximizes target metabolite while ensuring stability
    """
    import uuid
    
    # Mock RL-optimized design
    design = ConsortiumDesignResponse(
        design_id=str(uuid.uuid4()),
        strains=[
            {
                "strain_id": "strain_002",
                "name": "Faecalibacterium prausnitzii",
                "name_zh": "普氏粪杆菌",
                "role": "丁酸生产 / Butyrate producer",
                "key_genes": ["butyryl-CoA transferase", "butyrate kinase"]
            },
            {
                "strain_id": "strain_003",
                "name": "Akkermansia muciniphila",
                "name_zh": "嗜黏蛋白阿克曼菌",
                "role": "黏膜屏障调节 / Mucin layer regulation",
                "key_genes": ["mucin degradation enzymes"]
            },
            {
                "strain_id": "strain_001",
                "name": "Bacteroides fragilis",
                "name_zh": "脆弱拟杆菌",
                "role": "免疫调节 / Immune modulation (PSA production)",
                "key_genes": ["psa gene cluster"]
            }
        ],
        ratios=[0.4, 0.35, 0.25],
        predicted_stability=0.89,
        predicted_efficacy=0.85,
        warnings=[
            "建议在pH 6.5-7.5范围内培养 / Recommend pH 6.5-7.5 for cultivation",
            "需要严格厌氧条件 / Strict anaerobic conditions required"
        ]
    )
    
    return design


@router.post("/consortium/simulate", response_model=MetabolicSimulation)
async def simulate_consortium(
    strain_ids: List[str],
    ratios: List[float],
    duration_hours: float = 48.0,
    db: Session = Depends(get_db)
):
    """
    Simulate consortium using dynamic FBA (COBRApy)
    Predicts growth dynamics and metabolite production
    """
    import numpy as np
    
    # Mock dFBA simulation
    time_points = list(np.linspace(0, duration_hours, 100))
    
    simulation = MetabolicSimulation(
        time_points=time_points,
        biomass={
            "Faecalibacterium": [0.4 * (1 + 2.5 * t / duration_hours) for t in time_points],
            "Akkermansia": [0.35 * (1 + 2.0 * t / duration_hours) for t in time_points],
            "Bacteroides": [0.25 * (1 + 2.2 * t / duration_hours) for t in time_points]
        },
        metabolites={
            "Butyrate (mM)": [0.5 + 8.5 * t / duration_hours for t in time_points],
            "Acetate (mM)": [1.0 + 12.0 * t / duration_hours for t in time_points],
            "Propionate (mM)": [0.3 + 4.7 * t / duration_hours for t in time_points]
        },
        stability_score=0.87
    )
    
    return simulation


@router.get("/keystone-species/{disease}")
async def identify_keystone_species(disease: str, db: Session = Depends(get_db)):
    """
    Identify keystone species for a disease from clinical data
    Uses GNN attention weights to find influential microbes
    """
    # Mock keystone identification
    keystone_species = {
        "disease": disease,
        "disease_zh": "慢性阻塞性肺疾病" if disease == "COPD" else disease,
        "keystone_microbes": [
            {
                "name": "Faecalibacterium prausnitzii",
                "name_zh": "普氏粪杆菌",
                "centrality_score": 0.92,
                "reason": "高丁酸生产能力，抗炎作用 / High butyrate production, anti-inflammatory",
                "patients_with_high_abundance": "85% of responders"
            },
            {
                "name": "Akkermansia muciniphila",
                "name_zh": "嗜黏蛋白阿克曼菌",
                "centrality_score": 0.88,
                "reason": "黏膜屏障增强 / Mucus barrier enhancement",
                "patients_with_high_abundance": "78% of responders"
            }
        ],
        "depleted_in_disease": [
            {
                "name": "Roseburia intestinalis",
                "name_zh": "肠道罗氏菌",
                "depletion_score": -0.75
            }
        ]
    }
    
    return keystone_species
