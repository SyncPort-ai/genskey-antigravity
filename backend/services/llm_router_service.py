# backend/services/llm_router_service.py

import json
from pathlib import Path
import os
import openai
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

CONFIG_PATH = Path(__file__).parent.parent / "config" / "llm_config.json"

class LLMRouterService:
    def __init__(self):
        self.config = self._load_config()
        self.mock_llm = os.getenv("MOCK_LLM", "False").lower() == 'true'
        if not self.mock_llm:
            openai.api_key = os.getenv("OPENAI_API_KEY")

    def _load_config(self):
        with open(CONFIG_PATH, 'r') as f:
            return json.load(f)

    def _get_model_for_task(self, task: str):
        task_routing = self.config.get('task_routing', {})
        task_config = task_routing.get(task)
        if not task_config:
            raise ValueError(f"Task '{task}' not found in LLM configuration.")
        
        return task_config.get('primary')

    def route_query(self, task: str, prompt: str):
        model_id = self._get_model_for_task(task)
        
        if not model_id:
            raise ValueError(f"No primary model configured for task '{task}'.")

        if self.mock_llm:
            return f"Mock response for model '{model_id}' with prompt: '{prompt[:100]}...'"

        if model_id.startswith('openai-'):
            return self._call_openai(model_id, prompt)
        elif model_id.startswith('anthropic-'):
            return self._call_anthropic(model_id, prompt)
        elif model_id.startswith('meta-'):
            return self._call_meta(model_id, prompt)
        else:
            raise NotImplementedError(f"Provider for model '{model_id}' is not implemented.")

    def _call_openai(self, model_id: str, prompt: str):
        model_mapping = {
            "openai-gpt4": "gpt-4-turbo",
            "openai-gpt35": "gpt-3.5-turbo"
        }
        openai_model = model_mapping.get(model_id)

        if not openai_model:
            raise ValueError(f"Unknown OpenAI model ID: {model_id}")

        try:
            response = openai.chat.completions.create(
                model=openai_model,
                messages=[
                    {"role": "system", "content": "You are a helpful assistant."},
                    {"role": "user", "content": prompt}
                ]
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"Error calling OpenAI API: {e}")
            return f"Error communicating with OpenAI: {e}"

    def _call_anthropic(self, model_id: str, prompt: str):
        return f"Response from mock Anthropic model {model_id} for prompt: '{prompt}'"

    def _call_meta(self, model_id: str, prompt: str):
        return f"Response from mock Meta model {model_id} for prompt: '{prompt}'"
