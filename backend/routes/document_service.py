# backend/routes/document_service.py

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any
from backend.services.document_generator_service import DocumentGeneratorService

router = APIRouter(prefix="/api/documents", tags=["documents"])
doc_service = DocumentGeneratorService()

class GenerateRequest(BaseModel):
    template_type: str
    data: Dict[str, Any]
    export_format: str = "markdown"

@router.post("/generate")
async def generate_document(request: GenerateRequest):
    """
    Generates a document based on a template and data.
    """
    try:
        if request.template_type == "research_report":
            content = doc_service.generate_research_report(request.data)
        elif request.template_type == "protocol_sop":
            content = doc_service.generate_protocol_sop(request.data)
        elif request.template_type == "ind_cta":
            content = doc_service.generate_ind_cta(request.data)
        else:
            raise HTTPException(status_code=400, detail="Invalid template type")

        exported_content = doc_service.export_document(content, format=request.export_format)
        
        return {"content": exported_content, "format": request.export_format}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
