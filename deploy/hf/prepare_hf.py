import os
import shutil

src_dir = os.path.abspath("../../")
dst_dir = os.path.abspath("campusos-hf")

def copytree_custom(src, dst):
    if not os.path.exists(dst):
        os.makedirs(dst)
        
    for item in os.listdir(src):
        if item in [".git", "node_modules", ".next", "dist", ".turbo", "deploy", "apps", "docs"]:
            continue
            
        s = os.path.join(src, item)
        d = os.path.join(dst, item)
        if os.path.isdir(s):
            shutil.copytree(s, d, dirs_exist_ok=True)
        else:
            shutil.copy2(s, d)

print("Copying base files...")
copytree_custom(src_dir, dst_dir)

# Specifically copy apps/api and apps/ai-service
print("Copying apps...")
os.makedirs(os.path.join(dst_dir, "apps"), exist_ok=True)

for app in ["api", "ai-service"]:
    src_app = os.path.join(src_dir, "apps", app)
    dst_app = os.path.join(dst_dir, "apps", app)
    shutil.copytree(src_app, dst_app, dirs_exist_ok=True, ignore=shutil.ignore_patterns("node_modules", "dist", ".venv", "__pycache__", ".env"))

print("Done preparing HF files.")
