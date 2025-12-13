# backend/routes/agent_router.py

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any

# Import agents
from backend.ai.agents.literature_agent import LiteratureAnalysisAgent
from backend.ai.agents.experimental_design_agent import ExperimentalDesignAgent
from backend.ai.agents.regulatory_agent import RegulatoryAgent
from backend.ai.agents.hypothesis_agent import HypothesisAgent
from backend.ai.agents.data_insight_agent import DataInsightAgent

router = APIRouter(prefix="/api/agent", tags=["agent-router"])

# Initialize agents
agents = {
    "literature_search": LiteratureAnalysisAgent(),
    "experimental_design": ExperimentalDesignAgent(),
    "regulatory_documents": RegulatoryAgent(),
    "hypothesis_generation": HypothesisAgent(),
    "data_analysis": DataInsightAgent(),
}

class AgentRequest(BaseModel):
    task: str
    prompt: str
    data: Dict[str, Any] = None

@router.post("/run")
async def run_agent(request: AgentRequest):
    """
    Routes a request to the appropriate agent based on the task.
    """
    agent = agents.get(request.task)
    if not agent:
        raise HTTPException(status_code=400, detail=f"Invalid task: {request.task}")

    try:
        if request.task == "data_analysis":
            if not request.data:
                raise HTTPException(status_code=400, detail="Data is required for data_analysis task")
            response = agent.run(question=request.prompt, data=request.data)
        else:
            response = agent.run(request.prompt)
            
        return {"response": response, "agent": agent.__class__.__name__}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))