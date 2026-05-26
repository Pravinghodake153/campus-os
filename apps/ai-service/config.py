# ============================================================
# CampusOS AI — AI Service Configuration
# ============================================================

import os
from dotenv import load_dotenv
from typing import List

load_dotenv()

class Config:
    PORT = int(os.getenv("PORT", "8000"))
    MODEL_DIR = os.getenv("MODEL_DIR", "./trained_models")
    NODE_BACKEND_URL = os.getenv("NODE_BACKEND_URL", "http://localhost:4000/api")
    GEMINI_API_KEYS: List[str] = os.environ.get("GEMINI_API_KEYS", "AIzaSyDlvdGwHNXxgenY0fRNB31FYo4OBdboohs,AIzaSyBBPSAFR3mukBb_hPLUEy5GABK_lpp54vg,AIzaSyBPayW16bB-zgr1wUJYX6qCmuEAA5EpkTU,AIzaSyDCfPpunkXlQmB_lFA5ddaZMNYZ1aNvYYU,AIzaSyAYW3jJpsYJZrxi8ikTdzbXbR-fcz9oRpE,AIzaSyCTg1zDM2ZpHQTDllLC5B8xm1YFVgA8Uyc").split(",")
    # Filter out None values in case some keys are missing
    GEMINI_API_KEYS = [k for k in GEMINI_API_KEYS if k]

config = Config()
