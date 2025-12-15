#!/usr/bin/env python3
"""
Simplified backend start script that does not require a database.
Run directly: python start_simple.py
"""
import sys
import os

# Add current directory to sys.path so that local imports work
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

if __name__ == "__main__":
    import uvicorn
    print("=" * 50)
    print("Starting Fortune Telling Backend Server")
    print("=" * 50)
    print("Server will run on: http://127.0.0.1:8000")
    print("API docs: http://127.0.0.1:8000/docs")
    print("Health check: http://127.0.0.1:8000/health")
    print("=" * 50)
    print("Press Ctrl+C to stop")
    print("")
    
    try:
        uvicorn.run(
            "main:app",
            host="127.0.0.1",
            port=8000,
            reload=True,
            log_level="info"
        )
    except KeyboardInterrupt:
        print("\n\nServer stopped by user")
    except Exception as e:
        print(f"\n\nError starting server: {e}")
        print("\nMake sure you have installed dependencies:")
        print("  pip install -r requirements.txt")
        sys.exit(1)



