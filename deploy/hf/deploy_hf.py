import os
import subprocess
from huggingface_hub import HfApi

TOKEN = os.environ.get("HF_TOKEN")
REPO_ID = "ghodakepravin153/campusos-backend"

api = HfApi(token=TOKEN)

print("Creating Hugging Face Space...")
try:
    api.create_repo(repo_id=REPO_ID, repo_type="space", space_sdk="docker", private=False)
    print("Space created.")
except Exception as e:
    print(f"Space might already exist: {e}")

print("Cloning repository...")
if not os.path.exists("campusos-hf"):
    subprocess.run(["git", "clone", f"https://{TOKEN}@huggingface.co/spaces/{REPO_ID}", "campusos-hf"])
print("Ready for file copy.")
