#!/usr/bin/env python3
"""Quick test script for Bazi API endpoint"""
import requests
import json

url = "http://127.0.0.1:8000/bazi"
payload = {
    "birth_date": "1990-01-01",
    "birth_time": None
}

print(f"Testing Bazi API at {url}")
print(f"Payload: {json.dumps(payload, indent=2)}")

try:
    response = requests.post(url, json=payload)
    print(f"\nStatus Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")
except requests.exceptions.ConnectionError:
    print("\n❌ Error: Cannot connect to backend server.")
    print("   Make sure the backend is running on http://127.0.0.1:8000")
except Exception as e:
    print(f"\n❌ Error: {e}")
    if hasattr(e, 'response'):
        print(f"Response: {e.response.text}")


