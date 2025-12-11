"""
GenskeyTwin - Digital Twin Service
Real-time fermentation monitoring and process optimization
"""

from fastapi import APIRouter, HTTPException, WebSocket, WebSocketDisconnect
from typing import List, Dict, Any
from pydantic import BaseModel
import asyncio
import random
import time

router = APIRouter()


# Pydantic models
class SensorReading(BaseModel):
    """Real-time sensor data"""
    timestamp: float
    temperature: float  # Celsius
    ph: float
    dissolved_oxygen: float  # %
    agitation_speed: float  # RPM
    off_gas_co2: float  # %


class SoftSensorPrediction(BaseModel):
    """LSTM-based soft sensor prediction"""
    timestamp: float
    biomass_g_l: float
    product_titer_g_l: float
    cell_viability: float  # %
    confidence: float


class FermentationBatch(BaseModel):
    """Fermentation batch information"""
    batch_id: str
    strain_name: str
    start_time: float
    current_phase: str
    duration_hours: float
    target_density: float


class ScenarioAnalysis(BaseModel):
    """What-if scenario analysis"""
    scenario_name: str
    parameter_changes: Dict[str, float]
    predicted_outcome: Dict[str, Any]
    risk_assessment: str


@router.get("/batches/active")
async def get_active_batches():
    """Get all active fermentation batches"""
    # Mock active batches
    batches = [
        FermentationBatch(
            batch_id="BATCH-2025-001",
            strain_name="Faecalibacterium prausnitzii GK-001",
            start_time=time.time() - 3600 * 12,  # Started 12 hours ago
            current_phase="指数生长期 / Exponential Phase",
            duration_hours=12.0,
            target_density=10.0
        ),
        FermentationBatch(
            batch_id="BATCH-2025-002",
            strain_name="Akkermansia muciniphila GK-003",
            start_time=time.time() - 3600 * 24,  # Started 24 hours ago
            current_phase="稳定期 / Stationary Phase",
            duration_hours=24.0,
            target_density=8.5
        )
    ]
    
    return {"batches": batches, "total": len(batches)}


@router.get("/sensors/current/{batch_id}")
async def get_current_sensor_data(batch_id: str):
    """Get current sensor readings for a batch"""
    # Mock current sensor data
    current_data = SensorReading(
        timestamp=time.time(),
        temperature=37.0 + random.uniform(-0.2, 0.2),
        ph=6.8 + random.uniform(-0.1, 0.1),
        dissolved_oxygen=0.5 + random.uniform(-0.1, 0.1),
        agitation_speed=150.0,
        off_gas_co2=3.5 + random.uniform(-0.3, 0.3)
    )
    
    return current_data


@router.get("/soft-sensor/predict/{batch_id}")
async def get_soft_sensor_prediction(batch_id: str):
    """Get LSTM-based soft sensor predictions"""
    # Mock LSTM prediction
    prediction = SoftSensorPrediction(
        timestamp=time.time(),
        biomass_g_l=7.5 + random.uniform(-0.5, 0.5),
        product_titer_g_l=12.3 + random.uniform(-1.0, 1.0),
        cell_viability=92.5 + random.uniform(-2.0, 2.0),
        confidence=0.89
    )
    
    return prediction


@router.post("/scenario/analyze")
async def analyze_scenario(scenario: Dict[str, Any]):
    """
    Run what-if scenario using Neural ODE
    E.g., "What if we lower temperature by 2°C at hour 10?"
    """
    # Mock scenario analysis
    analysis = ScenarioAnalysis(
        scenario_name=scenario.get("name", "Temperature Reduction Test"),
        parameter_changes=scenario.get("changes", {"temperature": -2.0}),
        predicted_outcome={
            "growth_rate_change": "-15%",
            "final_biomass": "8.2 g/L (vs 9.5 g/L baseline)",
            "product_titer": "11.8 g/L (vs 12.3 g/L baseline)",
            "time_to_target": "+6 hours",
            "message": "降温会减缓生长但提高产物质量 / Lower temp slows growth but improves product quality"
        },
        risk_assessment="低风险 / Low Risk - Within normal operating range"
    )
    
    return analysis


@router.get("/process/optimize/{batch_id}")
async def optimize_process(batch_id: str):
    """
    Suggest optimal feeding strategy
    Based on digital twin simulation
    """
    # Mock optimization recommendation
    recommendations = {
        "batch_id": batch_id,
        "current_status": "次优 / Sub-optimal",
        "recommendations": [
            {
                "action": "添加葡萄糖 / Add Glucose",
                "amount": "50 g/L",
                "timing": "立即 / Immediate",
                "reason": "碳源即将耗尽 / Carbon source depleting",
                "expected_improvement": "+18% biomass yield"
            },
            {
                "action": "降低搅拌速度 / Reduce Agitation",
                "amount": "150 → 120 RPM",
                "timing": "2小时后 / In 2 hours",
                "reason": "减少剪切应力 / Reduce shear stress",
                "expected_improvement": "+5% viability"
            }
        ],
        "predicted_final_titer": "14.2 g/L (vs 12.3 g/L current trajectory)"
    }
    
    return recommendations


@router.websocket("/ws/realtime/{batch_id}")
async def websocket_realtime_data(websocket: WebSocket, batch_id: str):
    """
    WebSocket for real-time sensor data streaming
    Sends updates every 5 seconds
    """
    await websocket.accept()
    
    try:
        while True:
            # Simulate real-time data
            sensor_data = {
                "timestamp": time.time(),
                "physical": {
                    "temperature": 37.0 + random.uniform(-0.2, 0.2),
                    "ph": 6.8 + random.uniform(-0.1, 0.1),
                    "do": 0.5 + random.uniform(-0.1, 0.1),
                    "rpm": 150.0,
                    "co2": 3.5 + random.uniform(-0.3, 0.3)
                },
                "predicted": {
                    "biomass": 7.5 + random.uniform(-0.3, 0.3),
                    "titer": 12.3 + random.uniform(-0.5, 0.5),
                    "viability": 92.5 + random.uniform(-1.0, 1.0)
                },
                "alerts": []
            }
            
            # Add random alerts
            if sensor_data["physical"]["ph"] < 6.7:
                sensor_data["alerts"].append({
                    "level": "warning",
                    "message": "pH偏低，建议添加缓冲液 / pH low, add buffer recommended"
                })
            
            await websocket.send_json(sensor_data)
            await asyncio.sleep(5)  # Send every 5 seconds
            
    except WebSocketDisconnect:
        print(f"WebSocket disconnected for batch {batch_id}")


@router.get("/history/{batch_id}")
async def get_batch_history(batch_id: str, hours: int = 24):
    """
    Get historical data for a batch
    For plotting trends
    """
    import numpy as np
    
    # Generate mock historical data
    time_points = list(np.linspace(0, hours, 100))
    
    history = {
        "batch_id": batch_id,
        "time_hours": time_points,
        "data": {
            "temperature": [37.0 + 0.1 * np.sin(t/2) + random.uniform(-0.1, 0.1) for t in time_points],
            "ph": [7.0 - 0.2 * (t/hours) + random.uniform(-0.05, 0.05) for t in time_points],
            "biomass": [0.5 * (1 + 15 * (t/hours)) for t in time_points],
            "product": [0.2 * (1 + 60 * (t/hours)) for t in time_points]
        }
    }
    
    return history
