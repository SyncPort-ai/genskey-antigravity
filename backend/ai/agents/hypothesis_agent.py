# backend/ai/agents/hypothesis_agent.py

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))

from backend.services.llm_router_service import LLMRouterService

HYPOTHESIS_PROMPT = """
You are a creative and rigorous research scientist.

Task: Given the following observations, think step-by-step to generate a testable scientific hypothesis.

Observations:
{observations}

Instructions:
Follow this Chain-of-Thought process:
Step 1: Identify patterns, correlations, or anomalies in the observations.
Step 2: Connect these patterns to known biological principles or pathways.
Step 3: Propose a clear, concise, and causal hypothesis that explains the observations.
Step 4: State a specific, predictable outcome that would be true if the hypothesis is correct.
Step 5: Suggest a key experiment that could be performed to test the hypothesis.

Provide your reasoning at each step.

Chain of Thought:
"""

class HypothesisAgent:
    def __init__(self):
        self.llm_router = LLMRouterService()

    def run(self, observations: str):
        """
        Runs the hypothesis generation agent.
        """
        print(f"Hypothesis Agent received observations: '{observations}'")
        
        prompt = HYPOTHESIS_PROMPT.format(observations=observations)
        
        # Using the 'hypothesis_generation' task defined in the llm_config
        response = self.llm_router.route_query(task="hypothesis_generation", prompt=prompt)
        
        return response


if __name__ == '__main__':
    import os
    os.environ['MOCK_LLM'] = 'True'
    agent = HypothesisAgent()
    
    user_observations = (
        "1. In a recent clinical trial for IBD, patients treated with our lead strain GNS0042 showed highly variable responses.\n"
        "2. Post-hoc analysis reveals that responders had significantly higher baseline levels of Akkermansia muciniphila.\n"
        "3. GNS0042 is a butyrate producer, while A. muciniphila is a known mucin degrader.\n"
        "4. In vitro co-culture of GNS0042 and A. muciniphila shows a 3x increase in butyrate production compared to GNS0042 alone."
    )
    
    agent_response = agent.run(user_observations)
    
    print("\n--- Agent Response ---")
    print(agent_response)
