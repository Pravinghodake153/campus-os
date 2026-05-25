# ============================================================
# CampusOS AI — Environment Check Script
# Validates Python version and dependencies for Phase 4
# ============================================================

import sys
import os
import importlib.util

def check_python_version():
    print("Checking Python version...")
    version = sys.version_info
    if version.major >= 3 and version.minor >= 11:
        print(f"✅ Python {version.major}.{version.minor}.{version.micro} is supported.")
        return True
    else:
        print(f"❌ Python 3.11+ is required. Found {version.major}.{version.minor}.{version.micro}")
        return False

def check_dependencies():
    print("\nChecking required packages...")
    packages = [
        "fastapi",
        "uvicorn",
        "sklearn",
        "pandas",
        "numpy",
        "pydantic",
        "httpx",
        "dotenv",
        "joblib"
    ]
    all_passed = True
    for pkg in packages:
        if importlib.util.find_spec(pkg) is not None:
            print(f"✅ {pkg} is installed.")
        else:
            print(f"❌ {pkg} is MISSING. Install via 'pip install -r requirements.txt'")
            all_passed = False
    return all_passed

def check_directories():
    print("\nChecking directories and env...")
    all_passed = True
    model_dir = os.path.join(os.path.dirname(__file__), "..", "trained_models")
    if not os.path.exists(model_dir):
        os.makedirs(model_dir)
        print(f"✅ Created {model_dir}")
    else:
        print(f"✅ {model_dir} exists.")
        
    env_file = os.path.join(os.path.dirname(__file__), "..", ".env")
    if os.path.exists(env_file):
        print(f"✅ .env file exists.")
    else:
        print(f"❌ .env file is MISSING.")
        all_passed = False
        
    return all_passed

if __name__ == "__main__":
    print("=" * 50)
    print("CampusOS AI — Environment Check")
    print("=" * 50 + "\n")
    
    p_ok = check_python_version()
    d_ok = check_dependencies()
    dir_ok = check_directories()
    
    print("\n" + "=" * 50)
    if p_ok and d_ok and dir_ok:
        print("🎉 All checks passed! The AI Service is ready to start.")
        sys.exit(0)
    else:
        print("⚠️ Some checks failed. Please fix the issues above before starting.")
        sys.exit(1)
