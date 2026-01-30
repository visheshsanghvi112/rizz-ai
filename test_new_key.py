import requests
import json

api_key = "AIzaSyAVRdP1wriC6oJRbrUs-xpDDHqXk7YlFQg"

print("="*70)
print("🔑 TESTING NEW API KEY")
print("="*70)
print(f"Key: {api_key[:15]}...{api_key[-4:]}")
print(f"Length: {len(api_key)} chars\n")

# Test 1: gemini-2.0-flash (FAST mode - default)
print("🚀 Test 1: gemini-2.0-flash (FAST mode - your default)")
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
        print("✅ SUCCESS!")
        print(f"Response: {text}")
    else:
        print(f"❌ FAILED: HTTP {response.status_code}")
        print(f"Error: {response.text}")
except Exception as e:
    print(f"❌ ERROR: {e}")

print("\n" + "="*70 + "\n")

# Test 2: gemini-2.5-flash (lighter pro model)
print("⚡ Test 2: gemini-2.5-flash (lighter model)")
print("-"*70)
try:
    payload = {
        "contents": [{
            "parts": [{"text": "Say hello"}]
        }]
    }
    
    response = requests.post(
        f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}",
        headers={"Content-Type": "application/json"},
        data=json.dumps(payload),
        timeout=10
    )
    
    if response.status_code == 200:
        result = response.json()
        text = result['candidates'][0]['content']['parts'][0]['text']
        print("✅ SUCCESS!")
        print(f"Response: {text}")
    else:
        print(f"❌ FAILED: HTTP {response.status_code}")
        print(f"Error: {response.text}")
except Exception as e:
    print(f"❌ ERROR: {e}")

print("\n" + "="*70 + "\n")

# Test 3: gemini-2.5-pro (DEEP mode)
print("🧠 Test 3: gemini-2.5-pro (DEEP mode - might have quota limits)")
print("-"*70)
try:
    payload = {
        "contents": [{
            "parts": [{"text": "Hi"}]
        }]
    }
    
    response = requests.post(
        f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key={api_key}",
        headers={"Content-Type": "application/json"},
        data=json.dumps(payload),
        timeout=10
    )
    
    if response.status_code == 200:
        result = response.json()
        text = result['candidates'][0]['content']['parts'][0]['text']
        print("✅ SUCCESS!")
        print(f"Response: {text}")
    elif response.status_code == 429:
        print("⚠️  QUOTA LIMIT (This is normal on free tier)")
        print("   Use FAST mode (gemini-2.0-flash) instead")
    else:
        print(f"❌ FAILED: HTTP {response.status_code}")
        print(f"Error: {response.text}")
except Exception as e:
    print(f"❌ ERROR: {e}")

print("\n" + "="*70)
print("🎯 FINAL VERDICT:")
print("="*70)
print("If Test 1 (gemini-2.0-flash) PASSED ✅")
print("  → Your app will work! Use this key in .env file")
print("\nIf Test 1 FAILED ❌")
print("  → Key might be invalid or restricted")
print("="*70)
