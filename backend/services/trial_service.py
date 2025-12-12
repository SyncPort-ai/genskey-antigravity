"""
GenskeyTrial - Clinical & Regulatory Service
Compliance checking, CDx stratification, trial management
"""

from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from datetime import datetime

from backend.database import get_db

router = APIRouter()


# Pydantic models
class RegulatoryCheck(BaseModel):
    """Regulatory compliance check result"""
    check_type: str
    status: str  # "pass", "warning", "fail"
    findings: List[str]
    recommendations: List[str]


class SafetyAssessment(BaseModel):
    """Complete safety assessment"""
    strain_id: str
    strain_name: str
    overall_status: str
    checks: List[RegulatoryCheck]
    regulatory_gaps: List[str]
    documents_required: List[str]


class ClinicalTrial(BaseModel):
    """Clinical trial information"""
    trial_id: str
    title: str
    title_zh: str
    phase: str
    status: str
    enrollment_target: int
    current_enrollment: int
    start_date: datetime
    indication: str


class PatientStratification(BaseModel):
    """CDx-based patient stratification"""
    total_screened: int
    responder_predicted: int
    non_responder_predicted: int
    criteria: Dict[str, Any]
    biomarkers: List[str]


class AuditLogEntry(BaseModel):
    """Audit log entry (21 CFR Part 11)"""
    timestamp: datetime
    user: str
    action: str
    resource: str
    changes: Dict[str, Any]
    ip_address: str


@router.post("/safety/assess/{strain_id}", response_model=SafetyAssessment)
async def assess_strain_safety(strain_id: str, db: Session = Depends(get_db)):
    """
    Comprehensive safety assessment using RAG agent
    Checks against VFDB, CARD, and regulatory guidelines
    """
    # Mock comprehensive safety assessment
    assessment = SafetyAssessment(
        strain_id=strain_id,
        strain_name="Faecalibacterium prausnitzii GK-001",
        overall_status="合格 / Acceptable with Notes",
        checks=[
            RegulatoryCheck(
                check_type="毒力因子检查 / Virulence Factors (VFDB)",
                status="pass",
                findings=["未检测到已知毒力因子 / No known virulence factors detected"],
                recommendations=[]
            ),
            RegulatoryCheck(
                check_type="抗生素耐药基因 / AMR Genes (CARD)",
                status="warning",
                findings=[
                    "检测到tetW基因 / tetW gene detected",
                    "该基因为内源性，染色体编码 / Gene is intrinsic, chromosomally encoded"
                ],
                recommendations=[
                    "需提供可转移性测试数据 / Provide transferability testing data",
                    "参考FDA指南：内源性耐药可接受 / Per FDA guidance: intrinsic resistance acceptable"
                ]
            ),
            RegulatoryCheck(
                check_type="毒素基因 / Toxin Genes",
                status="pass",
                findings=["未检测到毒素基因 / No toxin genes detected"],
                recommendations=[]
            ),
            RegulatoryCheck(
                check_type="NMPA合规性 / NMPA Compliance",
                status="pass",
                findings=["符合《微生态制剂质量控制技术指导原则》 / Complies with NMPA Microecological Guidelines"],
                recommendations=[]
            )
        ],
        regulatory_gaps=[
            "需补充体外转移性实验 / In vitro transferability assay required",
            "需提供临床前毒理学数据 / Preclinical toxicology data needed"
        ],
        documents_required=[
            "菌株鉴定报告 / Strain Identification Report",
            "全基因组测序报告 / Whole Genome Sequencing Report",
            "安全性评价报告 / Safety Evaluation Report",
            "质量标准 / Quality Standards"
        ]
    )
    
    return assessment


@router.get("/regulatory/gaps/{project_id}")
async def analyze_regulatory_gaps(project_id: int, db: Session = Depends(get_db)):
    """
    Analyze regulatory gaps for IND submission
    Uses RAG to query FDA/NMPA guidelines
    """
    # Mock gap analysis
    gap_analysis = {
        "project_id": project_id,
        "target_submission": "NMPA IND",
        "target_date": "2025-Q3",
        "completion_status": "68%",
        "gaps": [
            {
                "category": "CMC (化学、制造和控制)",
                "status": "incomplete",
                "missing": [
                    "稳定性研究（加速和长期）/ Stability studies (accelerated & long-term)",
                    "工艺验证批次（3批次）/ Process validation batches (3 batches)"
                ],
                "timeline": "需要6个月 / Requires 6 months"
            },
            {
                "category": "非临床研究 / Nonclinical",
                "status": "in_progress",
                "missing": [
                    "28天重复给药毒性 / 28-day repeat-dose toxicity"
                ],
                "timeline": "需要3个月 / Requires 3 months"
            },
            {
                "category": "临床方案 / Clinical Protocol",
                "status": "complete",
                "missing": [],
                "timeline": "已完成 / Complete"
            }
        ],
        "recommendations": [
            "优先完成稳定性研究 / Prioritize stability studies",
            "申请Pre-IND meeting / Request Pre-IND meeting",
            "准备英文翻译件 / Prepare English translations"
        ]
    }
    
    return gap_analysis


@router.get("/trials", response_model=List[ClinicalTrial])
async def list_clinical_trials(db: Session = Depends(get_db)):
    """List all clinical trials"""
    # Mock trials
    trials = [
        ClinicalTrial(
            trial_id="GK-COPD-2025-01",
            title="Phase I/II Study of GK-Consortium in COPD",
            title_zh="GK微生物组合剂治疗慢性阻塞性肺疾病的I/II期临床研究",
            phase="Phase I/II",
            status="招募中 / Recruiting",
            enrollment_target=60,
            current_enrollment=23,
            start_date=datetime(2025, 3, 15),
            indication="COPD"
        ),
        ClinicalTrial(
            trial_id="GK-CDI-2025-02",
            title="Phase II Study of Phage Therapy for C. difficile Infection",
            title_zh="噬菌体疗法治疗艰难梭菌感染的II期临床研究",
            phase="Phase II",
            status="筹备中 / Planning",
            enrollment_target=40,
            current_enrollment=0,
            start_date=datetime(2025, 6, 1),
            indication="CDI"
        )
    ]
    
    return trials


@router.post("/cdx/stratify", response_model=PatientStratification)
async def stratify_patients(
    trial_id: str,
    patient_samples: List[str],
    db: Session = Depends(get_db)
):
    """
    Stratify patients using companion diagnostics
    ML model predicts responders based on baseline microbiome
    """
    # Mock CDx stratification using Random Forest
    stratification = PatientStratification(
        total_screened=len(patient_samples),
        responder_predicted=int(len(patient_samples) * 0.45),
        non_responder_predicted=int(len(patient_samples) * 0.55),
        criteria={
            "high_akkermansia": ">1% abundance",
            "low_crp": "<5 mg/L",
            "butyrate_producers": ">15% combined abundance"
        },
        biomarkers=[
            "Akkermansia muciniphila 丰度 / abundance",
            "Faecalibacterium prausnitzii 丰度 / abundance",
            "Shannon多样性指数 / Shannon diversity",
            "CRP水平 / CRP levels"
        ]
    )
    
    return stratification


@router.get("/audit/logs", response_model=List[AuditLogEntry])
async def get_audit_logs(
    resource_type: Optional[str] = None,
    user: Optional[str] = None,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """
    Retrieve audit logs for compliance
    21 CFR Part 11 compliant audit trail
    """
    # Mock audit logs
    logs = [
        AuditLogEntry(
            timestamp=datetime.now(),
            user="zhang.min@genskey.bio",
            action="UPDATE",
            resource="strain/GK-001",
            changes={
                "safety_level": {"old": "BSL-2", "new": "BSL-1"},
                "reason": "Re-assessment based on genomic analysis"
            },
            ip_address="10.0.1.45"
        ),
        AuditLogEntry(
            timestamp=datetime.now(),
            user="li.wei@genskey.bio",
            action="CREATE",
            resource="project/GK-COPD-2025",
            changes={
                "name": "COPD Consortium Development",
                "status": "planning"
            },
            ip_address="10.0.1.32"
        )
    ]
    
    return logs[:limit]


@router.post("/documents/generate")
async def generate_regulatory_document(
    document_type: str,
    project_id: int,
    db: Session = Depends(get_db)
):
    """
    Auto-generate regulatory documents
    E.g., Investigator's Brochure, IND sections
    """
    # Mock document generation
    if document_type == "investigator_brochure":
        return {
            "document_type": "研究者手册 / Investigator's Brochure",
            "status": "generated",
            "sections": [
                "1. 产品概述 / Product Overview",
                "2. 质量信息 / Quality Information",
                "3. 非临床研究 / Nonclinical Studies",
                "4. 临床经验 / Clinical Experience",
                "5. 安全性评价 / Safety Assessment"
            ],
            "download_url": "/documents/IB-GK-COPD-2025.pdf",
            "message": "文档已生成，请审阅 / Document generated, please review"
        }
    
    return {
        "status": "error",
        "message": f"Unsupported document type: {document_type}"
    }
