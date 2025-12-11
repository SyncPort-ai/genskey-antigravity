"""
Genskey Platform Configuration Management
Centralized configuration using Pydantic Settings
"""

from pydantic_settings import BaseSettings
from functools import lru_cache
from typing import Optional


class Settings(BaseSettings):
    """Application Settings"""
    
    # Application
    APP_NAME: str = "Genskey Enterprise Platform"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    API_PREFIX: str = "/api/v1"
    
    # Security
    SECRET_KEY: str = "genskey-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    
    # PostgreSQL
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_PORT: int = 5432
    POSTGRES_USER: str = "genskey"
    POSTGRES_PASSWORD: str = "genskey123"
    POSTGRES_DB: str = "genskey_db"
    
    @property
    def DATABASE_URL(self) -> str:
        return f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
    
    # Neo4j
    NEO4J_URI: str = "bolt://localhost:7687"
    NEO4J_USER: str = "neo4j"
    NEO4J_PASSWORD: str = "genskey123"
    
    # Redis
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    REDIS_DB: int = 0
    
    # MinIO (S3 Compatible)
    MINIO_ENDPOINT: str = "localhost:9000"
    MINIO_ACCESS_KEY: str = "genskey"
    MINIO_SECRET_KEY: str = "genskey123"
    MINIO_BUCKET: str = "genskey-data"
    MINIO_SECURE: bool = False
    
    # AI Models
    OPENAI_API_KEY: Optional[str] = None
    MODEL_CACHE_DIR: str = "./models"
    
    # File Upload
    MAX_UPLOAD_SIZE: int = 10 * 1024 * 1024 * 1024  # 10GB
    ALLOWED_EXTENSIONS: list = [".fastq", ".fq", ".fastq.gz", ".fq.gz", ".bam", ".fasta"]
    
    # CORS
    CORS_ORIGINS: list = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
    ]
    
    class Config:
        env_file = "../.env"  # Look in parent directory since we run from backend/
        case_sensitive = True


settings = Settings()
