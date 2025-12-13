# backend/ai/agents/experimental_design_agent.py

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))

from backend.services.llm_router_service import LLMRouterService

EXPERIMENTAL_DESIGN_PROMPT = """
You are an expert in experimental design for microbiome research.

Task: Generate a high-level experimental protocol based on the user's objective.

User Objective: {objective}

Constraints (if any):
{constraints}

Instructions:
1.  Outline the key steps of the experiment.
2.  Suggest appropriate controls (positive, negative, etc.).
3.  List the primary materials and equipment needed.
4.  Define the key readouts and measurements.
5.  Provide the response in a clear, well-structured markdown format.

Experimental Protocol:
"""

class ExperimentalDesignAgent:
    def __init__(self):
        self.llm_router = LLMRouterService()

    def run(self, objective: str, constraints: dict = None):
        """
        Runs the experimental design agent.
        """
        print(f"Experimental Design Agent received objective: '{objective}'")
        
        constraints_str = "\n".join([f"- {k}: {v}" for k, v in constraints.items()]) if constraints else "None"
        
        prompt = EXPERIMENTAL_DESIGN_PROMPT.format(
            objective=objective,
            constraints=constraints_str
        )
        
        # Using the 'experimental_design' task defined in the llm_config
        response = self.llm_router.route_query(task="experimental_design", prompt=prompt)
        
        return response


if __name__ == '__main__':
    agent = ExperimentalDesignAgent()
    
    user_objective = "Design an in vitro SCFA (Short-Chain Fatty Acid) production assay for 3 candidate strains to assess their butyrate production capabilities."
    
    agent_response = agent.run(user_objective)
    
    print("\n--- Agent Response ---")
    print(agent_response)
