# backend/ai/agents/data_insight_agent.py

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))

from backend.services.llm_router_service import LLMRouterService
import json

DATA_INSIGHT_PROMPT = """
You are a data scientist specializing in pharmaceutical and biotech data.

Task: Analyze the provided data to answer the user's question.

User Question: {question}

Data:
```json
{data}
```

Instructions:
1.  Carefully examine the data and the user's question.
2.  Perform a high-level analysis to identify trends, correlations, or anomalies.
3.  Formulate a concise insight that directly answers the question.
4.  If the data is insufficient to answer the question, state that clearly.

Insight:
"""

class DataInsightAgent:
    def __init__(self):
        self.llm_router = LLMRouterService()

    def run(self, question: str, data: dict):
        """
        Runs the data insight agent.
        """
        print(f"Data Insight Agent received question: '{question}'")
        
        # Convert dict to a pretty-printed JSON string for the prompt
        data_str = json.dumps(data, indent=2)
        
        prompt = DATA_INSIGHT_PROMPT.format(
            question=question,
            data=data_str
        )
        
        # Using the 'data_analysis' task defined in the llm_config
        response = self.llm_router.route_query(task="data_analysis", prompt=prompt)
        
        return response


if __name__ == '__main__':
    import os
    os.environ['MOCK_LLM'] = 'True'
    agent = DataInsightAgent()
    
    user_question = "Are there any manufacturing parameters that correlate with batch viability?"
    
    mock_data = {
        "batch_records": [
            {"batch_id": "B001", "fermentation_temp_c": 37.0, "final_viability_percent": 95.2},
            {"batch_id": "B002", "fermentation_temp_c": 37.1, "final_viability_percent": 94.8},
            {"batch_id": "B003", "fermentation_temp_c": 37.5, "final_viability_percent": 88.1},
            {"batch_id": "B004", "fermentation_temp_c": 37.6, "final_viability_percent": 87.5},
            {"batch_id": "B005", "fermentation_temp_c": 37.0, "final_viability_percent": 96.1}
        ],
        "notes": "A temperature excursion occurred in batches B003 and B004."
    }
    
    agent_response = agent.run(user_question, mock_data)
    
    print("\n--- Agent Response ---")
    print(agent_response)
