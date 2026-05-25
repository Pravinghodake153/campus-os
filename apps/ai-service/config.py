# ============================================================
# CampusOS AI — AI Service Configuration
# ============================================================

import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    PORT = int(os.getenv("PORT", "8000"))
    MODEL_DIR = os.getenv("MODEL_DIR", "./trained_models")
    NODE_BACKEND_URL = os.getenv("NODE_BACKEND_URL", "http://localhost:4000/api")
    GEMINI_API_KEYS = [
        os.getenv("GEMINI_API_KEY_1"),
        os.getenv("GEMINI_API_KEY_2"),
        os.getenv("GEMINI_API_KEY_3")
    ]
    # Filter out None values in case some keys are missing
    GEMINI_API_KEYS = [k for k in GEMINI_API_KEYS if k]

config = Config()
