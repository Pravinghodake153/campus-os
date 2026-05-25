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

config = Config()
