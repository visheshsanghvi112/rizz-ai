import os
import requests
import json

# Read API key from .env file
with open('.env', 'r') as f:
    for line in f:
        if line.startswith('VITE_GEMINI_API_KEY='):
            api_key = line.strip().split('=', 1)[1]
            break

print(f"🔑 Testing API Key: {api_key[:10]}...{api_key[-4:]}")
print(f"   Length: {len(api_key)} chars\n")

# Test 1: List available models
print("📋 Test 1: Listing available models...")
try:
    response = requests.get(
        f"https://generativelanguage.googleapis.com/v1beta/models?key={api_key}"
    )
    if response.status_code == 200:
        models = response.json()['models']
        print(f"✅ SUCCESS! Found {len(models)} models:")
        for model in models[:5]:
            print(f"   - {model['name']}")
    else:
        print(f"❌ FAILED: {response.status_code}")
        print(f"   Error: {response.text}")
except Exception as e:
    print(f"❌ ERROR: {e}")

print("\n" + "="*60 + "\n")

# Test 2: Generate content with gemini-2.0-flash
print("🤖 Test 2: Testing gemini-2.0-flash model...")
try:
    payload = {
        "contents": [{
            "parts": [{"text": "Say hello in one sentence"}]
        }]
    }
    
    response = requests.post(
        f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={api_key}",
        headers={"Content-Type": "application/json"},
        data=json.dumps(payload)
    )
    
    if response.status_code == 200:
        result = response.json()
        text = result['candidates'][0]['content']['parts'][0]['text']
        print(f"✅ SUCCESS! Response:")
        print(f"   {text}")
    else:
        print(f"❌ FAILED: {response.status_code}")
        print(f"   Error: {response.text}")
except Exception as e:
    print(f"❌ ERROR: {e}")

print("\n" + "="*60 + "\n")

# Test 3: Test gemini-2.5-pro
print("🤖 Test 3: Testing gemini-2.5-pro model...")
try:
    payload = {
        "contents": [{
            "parts": [{"text": "Say hello in one sentence"}]
        }]
    }
    
    response = requests.post(
        f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key={api_key}",
        headers={"Content-Type": "application/json"},
        data=json.dumps(payload)
    )
    
    if response.status_code == 200:
        result = response.json()
        text = result['candidates'][0]['content']['parts'][0]['text']
        print(f"✅ SUCCESS! Response:")
        print(f"   {text}")
    else:
        print(f"❌ FAILED: {response.status_code}")
        print(f"   Error: {response.text}")
except Exception as e:
    print(f"❌ ERROR: {e}")

print("\n" + "="*60)
print("🎯 CONCLUSION:")
print("   If all tests passed, your API key is working correctly!")
print("   You can now use it in your Rizz AI app.")
