# backend/ai/agents/regulatory_agent.py

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))

from backend.services.llm_router_service import LLMRouterService

REGULATORY_AGENT_PROMPT = """
You are an expert in regulatory affairs for Live Biotherapeutic Products (LBP).

Task: Answer the user's question regarding regulatory guidelines.

User Question: {question}

Context (if available):
{context}

Instructions:
1.  Provide a clear and concise answer to the user's question.
2.  If you have knowledge of specific guidelines (e.g., FDA, EMA, NMPA), mention them.
3.  If the question is about a specific document section (e.g., CMC), focus the answer on that.
4.  If you do not have enough information, state that and recommend consulting a regulatory professional.

Answer:
"""

class RegulatoryAgent:
    def __init__(self):
        self.llm_router = LLMRouterService()

    def run(self, question: str, context: str = "No specific context provided."):
        """
        Runs the regulatory agent.
        """
        print(f"Regulatory Agent received question: '{question}'")
        
        prompt = REGULATORY_AGENT_PROMPT.format(
            question=question,
            context=context
        )
        
        # Using the 'regulatory_documents' task defined in the llm_config
        response = self.llm_router.route_query(task="regulatory_documents", prompt=prompt)
        
        return response


if __name__ == '__main__':
    agent = RegulatoryAgent()
    
    user_question = "What are the key considerations for the CMC (Chemistry, Manufacturing, and Controls) section of an IND submission for an LBP?"
    
    agent_response = agent.run(user_question)
    
    print("\n--- Agent Response ---")
    print(agent_response)
