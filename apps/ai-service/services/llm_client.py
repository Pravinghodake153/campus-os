import google.generativeai as genai
from google.generativeai.types import generation_types
from config import config
import time

class LLMManager:
    def __init__(self):
        self.api_keys = config.GEMINI_API_KEYS
        if not self.api_keys:
            print("WARNING: No Gemini API keys found in configuration.")
            
        self.current_key_index = 0
        self.models = ["gemini-2.5-flash"]
        self._configure_current_key()
        
    def _configure_current_key(self):
        if not self.api_keys:
            return
            
        key = self.api_keys[self.current_key_index]
        genai.configure(api_key=key)
        print(f"[LLMManager] Configured to use API Key index: {self.current_key_index}")
        
    def _rotate_key(self) -> bool:
        """Rotate to the next API key. Returns False if we've tried all keys."""
        if not self.api_keys:
            return False
            
        self.current_key_index = (self.current_key_index + 1) % len(self.api_keys)
        self._configure_current_key()
        
        # If we wrapped around to 0, it means we tried all keys
        return self.current_key_index != 0

    def generate_content(self, prompt: str, system_instruction: str = None, force_json: bool = False) -> str:
        """
        Attempts to generate content with fallback logic.
        1. Try gemini-3.0-pro with current key.
        2. If quota exceeded, rotate key.
        3. If all keys exhausted on pro, fallback to gemini-2.5-flash.
        """
        if not self.api_keys:
            raise Exception("No Gemini API keys configured.")
            
        generation_config = genai.types.GenerationConfig()
        if force_json:
            generation_config.response_mime_type = "application/json"

        last_error = None
        
        # Outer loop: Try different models
        for model_name in self.models:
            print(f"[LLMManager] Attempting with model: {model_name}")
            
            # Inner loop: Try different API keys
            start_key_index = self.current_key_index
            while True:
                try:
                    model = genai.GenerativeModel(
                        model_name=model_name,
                        system_instruction=system_instruction
                    )
                    
                    response = model.generate_content(
                        prompt, 
                        generation_config=generation_config
                    )
                    
                    return response.text
                    
                except Exception as e:
                    error_str = str(e).lower()
                    last_error = e
                    
                    # Check if it's a quota / rate limit / authentication error
                    if "429" in error_str or "quota" in error_str or "exhausted" in error_str or "auth" in error_str:
                        print(f"[LLMManager] Error with key index {self.current_key_index}: {error_str}")
                        
                        # Rotate key
                        has_more_keys = self._rotate_key()
                        
                        if not has_more_keys or self.current_key_index == start_key_index:
                            print(f"[LLMManager] Exhausted all keys for model {model_name}.")
                            break # Break inner loop, try next model
                    elif "404" in error_str or "not found" in error_str or "not supported" in error_str:
                        print(f"[LLMManager] Model {model_name} not found or unsupported. Trying next model.")
                        break # Break inner loop, try next model
                    else:
                        # If it's a different error (e.g. invalid prompt, safety filter), raise immediately
                        raise e
                        
        raise Exception(f"All models and keys exhausted. Last error: {last_error}")

llm_manager = LLMManager()
