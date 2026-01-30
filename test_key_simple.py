import requests
import json

api_key = "AIzaSyAVRdP1wriC6oJRbrUs-xpDDHqXk7YlFQg"

print("="*70)
print("TESTING NEW API KEY")
print("="*70)
print(f"Key: {api_key[:15]}...{api_key[-4:]}")
print(f"Length: {len(api_key)} chars")
print()

# Test gemini-2.0-flash (FAST mode - default)
print("Test: gemini-2.0-flash (FAST mode - your default)")
print("-"*70)
try:
    payload = {
        "contents": [{
            "parts": [{"text": "Say hello in one short sentence"}]
        }]
    }
    
    response = requests.post(
        f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={api_key}",
        headers={"Content-Type": "application/json"},
        data=json.dumps(payload),
        timeout=10
    )
    
    if response.status_code == 200:
        result = response.json()
        text = result['candidates'][0]['content']['parts'][0]['text']
        print("[SUCCESS] API KEY WORKS!")
        print(f"Response: {text}")
    else:
        print(f"[FAILED] HTTP {response.status_code}")
        print(f"Error: {response.text[:200]}")
except Exception as e:
    print(f"[ERROR] {e}")

print()
print("="*70)
print("VERDICT: If you see [SUCCESS] above, update your .env file with this key")
print("="*70)
