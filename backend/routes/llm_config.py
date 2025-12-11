from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, List, Optional
import json
from pathlib import Path

router = APIRouter(prefix="/api/llm-config", tags=["llm-config"])

# Load configuration
CONFIG_PATH = Path(__file__).parent.parent / "config" / "llm_config.json"

def load_config():
    with open(CONFIG_PATH, 'r') as f:
        return json.load(f)

def save_config(config):
    with open(CONFIG_PATH, 'w') as f:
        json.dump(config, f, indent=2)

class ProfileRequest(BaseModel):
    profile: str

class TaskRoutingUpdate(BaseModel):
    task: str
    model_id: str

@router.get("")
async def get_llm_config():
    """
    Get current LLM configuration including providers, profiles, and task routing
    """
    try:
        config = load_config()
        return config
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load configuration: {str(e)}")

@router.post("/apply")
async def apply_profile(request: ProfileRequest):
    """
    Apply a preset profile configuration
    """
    try:
        config = load_config()
        
        # Validate profile exists
        if request.profile not in config['user_preferences']['profiles']:
            raise HTTPException(status_code=400, detail=f"Profile '{request.profile}' not found")
        
        # Update current profile
        config['user_preferences']['default_profile'] = request.profile
        
        # Apply profile-specific model selections to task routing
        profile_data = config['user_preferences']['profiles'][request.profile]
        primary_models = profile_data['primary_models']
        
        # Update task routing to use profile's primary models
        for task in config['task_routing']:
            # Use first primary model as default for all tasks
            config['task_routing'][task]['primary'] = primary_models[0]
        
        save_config(config)
        
        return {
            "success": True,
            "message": f"Profile '{request.profile}' applied successfully",
            "profile": profile_data
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to apply profile: {str(e)}")

@router.post("/task-routing")
async def update_task_routing(request: TaskRoutingUpdate):
    """
    Update model selection for a specific task type
    """
    try:
        config = load_config()
        
        # Validate task exists
        if request.task not in config['task_routing']:
            raise HTTPException(status_code=400, detail=f"Task '{request.task}' not found")
        
        # Validate model exists
        model_exists = any(m['id'] == request.model_id for m in config['llm_providers'])
        if not model_exists:
            raise HTTPException(status_code=400, detail=f"Model '{request.model_id}' not found")
        
        # Update task routing
        config['task_routing'][request.task]['primary'] = request.model_id
        
        save_config(config)
        
        return {
            "success": True,
            "message": f"Task '{request.task}' routing updated to '{request.model_id}'",
            "task_routing": config['task_routing'][request.task]
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update task routing: {str(e)}")

@router.get("/models/{model_id}")
async def get_model_details(model_id: str):
    """
    Get detailed information about a specific LLM model
    """
    try:
        config = load_config()
        
        model = next((m for m in config['llm_providers'] if m['id'] == model_id), None)
        if not model:
            raise HTTPException(status_code=404, detail=f"Model '{model_id}' not found")
        
        return model
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get model details: {str(e)}")

@router.get("/usage-stats")
async def get_usage_stats():
    """
    Get LLM usage statistics (placeholder for future implementation)
    """
    return {
        "current_month": {
            "total_requests": 12450,
            "total_tokens": 3250000,
            "estimated_cost": 487.50,
            "by_model": {
                "openai-gpt4": {"requests": 3200, "cost": 320.00},
                "openai-gpt35": {"requests": 8100, "cost": 81.50},
                "anthropic-claude3-sonnet": {"requests": 1150, "cost": 86.00}
            }
        },
        "last_7_days": {
            "avg_daily_requests": 1780,
            "avg_daily_cost": 69.64
        }
    }
