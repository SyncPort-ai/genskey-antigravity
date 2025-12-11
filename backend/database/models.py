"""
SQLAlchemy ORM Models for Genskey Platform
Core entities: Users, Projects, Strains, Samples, Experiments
"""

from sqlalchemy import Column, Integer, String, DateTime, Float, Boolean, ForeignKey, Text, Enum as SQLEnum, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime
import enum

Base = declarative_base()


class UserRole(str, enum.Enum):
    """User role enumeration"""
    ADMIN = "admin"
    SCIENTIST = "scientist"
    ENGINEER = "engineer"
    REGULATOR = "regulator"


class SafetyLevel(str, enum.Enum):
    """Biosafety level enumeration"""
    BSL1 = "BSL-1"
    BSL2 = "BSL-2"
    BSL3 = "BSL-3"


class ProjectStatus(str, enum.Enum):
    """Project status enumeration"""
    PLANNING = "planning"
    DISCOVERY = "discovery"
    DESIGN = "design"
    MANUFACTURING = "manufacturing"
    TRIAL = "trial"
    COMPLETED = "completed"


class User(Base):
    """User entity with RBAC"""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, nullable=False, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255))
    role = Column(SQLEnum(UserRole), default=UserRole.SCIENTIST)
    is_active = Column(Boolean, default=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    projects = relationship("Project", back_populates="owner")
    experiments = relationship("Experiment", back_populates="researcher")


class Project(Base):
    """Research project entity"""
    __tablename__ = "projects"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    name_zh = Column(String(255))  # Chinese name
    description = Column(Text)
    status = Column(SQLEnum(ProjectStatus), default=ProjectStatus.PLANNING)
    
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    target_disease = Column(String(255))
    target_indication = Column(Text)
    
    # Metadata (flexible JSONB field)
    project_metadata = Column(JSON)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    owner = relationship("User", back_populates="projects")
    strains = relationship("Strain", back_populates="project")
    samples = relationship("Sample", back_populates="project")


class Strain(Base):
    """Bacterial strain entity - the core asset"""
    __tablename__ = "strains"
    
    id = Column(Integer, primary_key=True, index=True)
    strain_id = Column(String(100), unique=True, nullable=False, index=True)
    name = Column(String(255), nullable=False)
    
    # Taxonomy
    taxonomy_id = Column(Integer)  # NCBI Taxonomy ID
    genus = Column(String(100))
    species = Column(String(100))
    strain = Column(String(100))
    
    # Source
    isolation_source = Column(String(255))
    isolation_date = Column(DateTime)
    geographic_origin = Column(String(255))
    
    # Safety
    safety_level = Column(SQLEnum(SafetyLevel), default=SafetyLevel.BSL1)
    has_amr_genes = Column(Boolean, default=False)
    has_virulence_factors = Column(Boolean, default=False)
    safety_notes = Column(Text)
    
    # Genomics
    genome_path = Column(String(500))  # Path in MinIO
    genome_size = Column(Integer)  # Base pairs
    gc_content = Column(Float)
    
    # Functional annotations
    bgc_count = Column(Integer, default=0)
    prophage_count = Column(Integer, default=0)
    
    # Phenotype (JSONB for flexibility)
    growth_conditions = Column(JSON)  # {"temp": 37, "pH": 7.0, "oxygen": "anaerobic"}
    metabolic_profile = Column(JSON)
    
    # Relationships
    project_id = Column(Integer, ForeignKey("projects.id"))
    project = relationship("Project", back_populates="strains")
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class Sample(Base):
    """Clinical sample entity"""
    __tablename__ = "samples"
    
    id = Column(Integer, primary_key=True, index=True)
    sample_id = Column(String(100), unique=True, nullable=False, index=True)
    
    # Patient metadata (de-identified)
    patient_id = Column(String(100))  # Hashed ID
    age = Column(Integer)
    gender = Column(String(10))
    diagnosis = Column(String(255))
    phenotype = Column(Text)
    
    # Sample details
    sample_type = Column(String(100))  # Stool, Sputum, etc.
    collection_date = Column(DateTime)
    
    # Sequencing
    sequencing_platform = Column(String(100))
    raw_reads_path = Column(String(500))  # Path in MinIO
    total_reads = Column(Integer)
    
    # Analysis results (JSONB)
    taxonomic_profile = Column(JSON)  # {"Bacteroides": 0.35, "Firmicutes": 0.45, ...}
    diversity_metrics = Column(JSON)  # {"shannon": 3.2, "simpson": 0.85}
    
    # Relationships
    project_id = Column(Integer, ForeignKey("projects.id"))
    project = relationship("Project", back_populates="samples")
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Experiment(Base):
    """Wet-lab experiment entity"""
    __tablename__ = "experiments"
    
    id = Column(Integer, primary_key=True, index=True)
    experiment_id = Column(String(100), unique=True, nullable=False, index=True)
    name = Column(String(255), nullable=False)
    experiment_type = Column(String(100))  # "co-culture", "growth_curve", "metabolomics"
    
    # Protocol
    protocol = Column(JSON)  # Structured experimental steps
    
    # Results
    results = Column(JSON)
    success = Column(Boolean)
    notes = Column(Text)
    
    # Researcher
    researcher_id = Column(Integer, ForeignKey("users.id"))
    researcher = relationship("User", back_populates="experiments")
    
    # Date
    experiment_date = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class AuditLog(Base):
    """Audit trail for 21 CFR Part 11 compliance"""
    __tablename__ = "audit_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    action = Column(String(50), nullable=False)  # CREATE, UPDATE, DELETE
    resource_type = Column(String(50), nullable=False)  # "strain", "project", etc.
    resource_id = Column(Integer, nullable=False)
    
    old_value = Column(JSON)
    new_value = Column(JSON)
    
    ip_address = Column(String(50))
    reason = Column(Text)
