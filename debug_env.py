#!/usr/bin/env python3
"""
Debug script to test environment variable loading and API key validation
"""

import requests
import json
import os

def test_env_loading():
    """Test if environment variables are loaded correctly in the API"""
    print("=== Testing Environment Variable Loading ===")
    
    # Create a simple test endpoint to check env vars
    test_payload = {
        'agentId': 'resume',
        'input': 'test input',
        'userId': 'debug_user'
    }
    
    try:
        response = requests.post(
            'http://localhost:3000/api/ai-agents',
            json=test_payload,
            headers={'Content-Type': 'application/json'},
            timeout=30
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 500:
            error_data = response.json()
            error_msg = error_data.get('error', '')
            
            if 'Invalid API Key' in error_msg:
                print("❌ Groq API key is not being loaded correctly in the API route")
            elif 'PERMISSION_DENIED' in error_msg:
                print("❌ Firebase permissions issue")
            else:
                print(f"❌ Other error: {error_msg}")
        
    except Exception as e:
        print(f"Error: {e}")

def test_direct_groq():
    """Test Groq API directly with the key from .env"""
    print("\n=== Testing Direct Groq API Call ===")
    
    # Read API key from .env
    with open('/app/.env', 'r') as f:
        env_content = f.read()
    
    api_key = None
    for line in env_content.split('\n'):
        if line.startswith('GROQ_API_KEY='):
            api_key = line.split('=', 1)[1]
            break
    
    if not api_key:
        print("❌ GROQ_API_KEY not found in .env")
        return
    
    print(f"Using API key: {api_key[:20]}...")
    
    try:
        response = requests.post(
            'https://api.groq.com/openai/v1/chat/completions',
            headers={
                'Authorization': f'Bearer {api_key}',
                'Content-Type': 'application/json'
            },
            json={
                'messages': [{'role': 'user', 'content': 'Hello, test message'}],
                'model': 'llama3-70b-8192',
                'max_tokens': 50
            },
            timeout=30
        )
        
        print(f"Direct Groq API Status: {response.status_code}")
        if response.status_code == 200:
            print("✅ Direct Groq API call successful")
        else:
            print(f"❌ Direct Groq API failed: {response.text}")
            
    except Exception as e:
        print(f"❌ Direct Groq API error: {e}")

if __name__ == "__main__":
    test_env_loading()
    test_direct_groq()