"""
Genskey Platform - FastAPI Main Application
Enterprise LBP Discovery Platform
"""

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import time

from config import settings
from database import init_db

# Import routers
from services.discovery_service import router as discovery_router
from services.design_service import router as design_router
from services.twin_service import router as twin_router
from services.trial_service import router as trial_router
from routes.llm_config import router as llm_config_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    # Startup
    print("🧬 Initializing Genskey Platform...")
    init_db()
    print("✅ Database initialized")
    yield
    # Shutdown
    print("👋 Shutting down Genskey Platform")


# Create FastAPI application
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Enterprise Live Biotherapeutic Product Discovery Platform",
    lifespan=lifespan,
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Request timing middleware
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    """Add processing time to response headers"""
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response


# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Global exception handler"""
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": str(exc),
            "message": "Internal server error"
        }
    )


# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION
    }


# Root endpoint
@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "message": "基因康企业平台 - Genskey Enterprise Platform",
        "message_en": "Live Biotherapeutic Product Discovery Engine",
        "docs": "/api/docs"
    }


# Register service routers
app.include_router(
    discovery_router,
    prefix=f"{settings.API_PREFIX}/discovery",
    tags=["GenskeyMine - Discovery"]
)

app.include_router(
    design_router,
    prefix=f"{settings.API_PREFIX}/design",
    tags=["GenskeyDesign - Consortium Engineering"]
)

app.include_router(
    twin_router,
    prefix=f"{settings.API_PREFIX}/twin",
    tags=["GenskeyTwin - Digital Manufacturing"]
)

app.include_router(
    trial_router,
    prefix=f"{settings.API_PREFIX}/trial",
    tags=["GenskeyTrial - Clinical & Regulatory"]
)

app.include_router(
    llm_config_router,
    tags=["AI Copilot - LLM Configuration"]
)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG
    )
