"""
GenskeyMine - Discovery Service
Phage and BGC detection from metagenomic data
"""

from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from pydantic import BaseModel
import json

from database import get_db
from database.models import Strain, Sample

router = APIRouter()


# Pydantic models for request/response
class PhageDetectionResult(BaseModel):
    """Phage detection result model"""
    contig_id: str
    start: int
    end: int
    length: int
    confidence: float
    predicted_host: str
    genes: List[Dict[str, Any]]


class BGCDetectionResult(BaseModel):
    """BGC detection result model"""
    bgc_id: str
    type: str
    start: int
    end: int
    product: str
    confidence: float
    genes: List[str]


class DiscoveryJobResponse(BaseModel):
    """Discovery job response"""
    job_id: str
    status: str
    message: str


class GenomeBrowserData(BaseModel):
    """Genome browser visualization data"""
    tracks: List[Dict[str, Any]]
    annotations: List[Dict[str, Any]]


@router.post("/upload", response_model=DiscoveryJobResponse)
async def upload_sequencing_data(
    files: List[UploadFile] = File(...),
    project_id: int = None,
    db: Session = Depends(get_db)
):
    """
    Upload FASTQ/FASTA files for analysis
    Supports batch upload and multipart for large files
    """
    job_ids = []
    
    for file in files:
        # Validate file extension
        if not any(file.filename.endswith(ext) for ext in ['.fastq', '.fq', '.fastq.gz', '.fasta', '.fa']):
            raise HTTPException(status_code=400, detail=f"Invalid file type: {file.filename}")
        
        # Generate job ID
        import uuid
        job_id = str(uuid.uuid4())
        
        # In production, this would:
        # 1. Stream to MinIO
        # 2. Trigger async Celery task for QC
        # 3. Run host depletion
        # 4. Start assembly pipeline
        
        job_ids.append(job_id)
    
    return DiscoveryJobResponse(
        job_id=",".join(job_ids),
        status="submitted",
        message=f"已提交 {len(files)} 个文件进行分析 / {len(files)} files submitted for analysis"
    )


@router.get("/phage/detect/{sample_id}", response_model=List[PhageDetectionResult])
async def detect_phages(sample_id: str, db: Session = Depends(get_db)):
    """
    Detect bacteriophages using PhageBERT
    Returns predicted phage regions with host predictions
    """
    # Mock data - In production, this would call the PhageBERT model
    mock_results = [
        PhageDetectionResult(
            contig_id="contig_0001",
            start=1500,
            end=45000,
            length=43500,
            confidence=0.95,
            predicted_host="Klebsiella pneumoniae",
            genes=[
                {"name": "major_capsid_protein", "start": 2000, "end": 3200, "function": "Structural"},
                {"name": "terminase_large", "start": 5000, "end": 6800, "function": "DNA Packaging"},
                {"name": "tail_fiber", "start": 8000, "end": 10000, "function": "Host Recognition"}
            ]
        ),
        PhageDetectionResult(
            contig_id="contig_0003",
            start=100,
            end=38000,
            length=37900,
            confidence=0.87,
            predicted_host="Escherichia coli",
            genes=[
                {"name": "portal_protein", "start": 500, "end": 1200, "function": "DNA Entry"},
                {"name": "head_protein", "start": 2000, "end": 2800, "function": "Structural"}
            ]
        )
    ]
    
    return mock_results


@router.get("/bgc/detect/{sample_id}", response_model=List[BGCDetectionResult])
async def detect_bgcs(sample_id: str, db: Session = Depends(get_db)):
    """
    Detect Biosynthetic Gene Clusters using DeepBGC
    Returns predicted BGC regions with product types
    """
    # Mock data - In production, this would call DeepBGC/HyenaDNA
    mock_results = [
        BGCDetectionResult(
            bgc_id="BGC_001",
            type="NRPS",
            start=150000,
            end=195000,
            product="Bacteriocin",
            confidence=0.92,
            genes=["nrpsA", "nrpsB", "nrpsC", "transport_ABC"]
        ),
        BGCDetectionResult(
            bgc_id="BGC_002",
            type="Terpene",
            start=300000,
            end=330000,
            product="Butyrate synthesis",
            confidence=0.78,
            genes=["butyryl-CoA_dehydrogenase", "butyrate_kinase"]
        )
    ]
    
    return mock_results


@router.get("/genome-browser/{strain_id}")
async def get_genome_browser_data(strain_id: str, db: Session = Depends(get_db)):
    """
    Get genome browser visualization data
    Returns tracks for genes, phages, BGCs, etc.
    """
    # Mock genome browser data
    data = {
        "genome_length": 4500000,
        "tracks": [
            {
                "name": "基因 / Genes",
                "type": "gene",
                "features": [
                    {"id": "gene_0001", "start": 1000, "end": 2500, "strand": "+", "name": "recA"},
                    {"id": "gene_0002", "start": 3000, "end": 4200, "strand": "+", "name": "dnaK"},
                    {"id": "gene_0003", "start": 5000, "end": 6800, "strand": "-", "name": "groEL"}
                ]
            },
            {
                "name": "噬菌体 / Prophages",
                "type": "phage",
                "features": [
                    {"id": "phage_001", "start": 1500, "end": 45000, "confidence": 0.95, "host": "K. pneumoniae"}
                ]
            },
            {
                "name": "生物合成基因簇 / BGCs",
                "type": "bgc",
                "features": [
                    {"id": "bgc_001", "start": 150000, "end": 195000, "product": "Bacteriocin", "confidence": 0.92}
                ]
            }
        ]
    }
    
    return data


@router.get("/strains")
async def list_strains(
    skip: int = 0,
    limit: int = 50,
    safety_level: str = None,
    db: Session = Depends(get_db)
):
    """
    List all discovered strains in the digital asset library
    Supports filtering by safety level, taxonomy, etc.
    """
    query = db.query(Strain)
    
    if safety_level:
        query = query.filter(Strain.safety_level == safety_level)
    
    strains = query.offset(skip).limit(limit).all()
    
    return {
        "total": query.count(),
        "items": strains
    }


@router.post("/strains/analyze")
async def analyze_strain_safety(strain_id: int, db: Session = Depends(get_db)):
    """
    Run safety analysis on strain
    Checks VFDB (virulence factors) and CARD (AMR genes)
    """
    strain = db.query(Strain).filter(Strain.id == strain_id).first()
    
    if not strain:
        raise HTTPException(status_code=404, detail="Strain not found")
    
    # Mock safety check
    safety_report = {
        "strain_id": strain_id,
        "strain_name": strain.name,
        "checks": {
            "virulence_factors": {
                "status": "pass",
                "found": [],
                "message": "未检测到毒力因子 / No virulence factors detected"
            },
            "amr_genes": {
                "status": "warning",
                "found": ["tetW"],
                "message": "检测到内源性四环素抗性基因（不可转移）/ Intrinsic tetracycline resistance (non-transferable)"
            },
            "toxins": {
                "status": "pass",
                "found": [],
                "message": "未检测到毒素 / No toxins detected"
            }
        },
        "overall_status": "acceptable",
        "safety_level": "BSL-1",
        "recommendation": "适合进一步开发 / Suitable for further development"
    }
    
    return safety_report
