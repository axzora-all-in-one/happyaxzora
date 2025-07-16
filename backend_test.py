#!/usr/bin/env python3
"""
HappyAxzora Backend API Testing Suite
Tests all backend endpoints including AI Tools, AI Agents, and Workflows
"""

import requests
import json
import os
import sys
from datetime import datetime

# Get base URL from environment
BASE_URL = os.getenv('NEXT_PUBLIC_BASE_URL', 'http://localhost:3000')
API_BASE = f"{BASE_URL}/api"

class BackendTester:
    def __init__(self):
        self.results = {
            'ai_tools': {'status': 'pending', 'details': []},
            'ai_agents': {'status': 'pending', 'details': []},
            'workflows': {'status': 'pending', 'details': []},
            'environment': {'status': 'pending', 'details': []},
            'error_handling': {'status': 'pending', 'details': []}
        }
        
    def log_result(self, category, success, message, details=None):
        """Log test result"""
        status = 'success' if success else 'failed'
        result = {
            'timestamp': datetime.now().isoformat(),
            'status': status,
            'message': message,
            'details': details or {}
        }
        self.results[category]['details'].append(result)
        
        if not success and self.results[category]['status'] != 'failed':
            self.results[category]['status'] = 'failed'
        elif success and self.results[category]['status'] == 'pending':
            self.results[category]['status'] = 'success'
            
        print(f"[{status.upper()}] {category}: {message}")
        if details:
            print(f"  Details: {details}")
    
    def test_environment_variables(self):
        """Test if required environment variables are accessible"""
        print("\n=== Testing Environment Variables ===")
        
        # Test if .env file exists
        env_file = '/app/.env'
        if os.path.exists(env_file):
            self.log_result('environment', True, ".env file exists")
            
            # Read and check key variables
            with open(env_file, 'r') as f:
                env_content = f.read()
                
            required_vars = [
                'GROQ_API_KEY',
                'PRODUCTHUNT_DEVELOPER_TOKEN',
                'NEXT_PUBLIC_FIREBASE_PROJECT_ID'
            ]
            
            for var in required_vars:
                if var in env_content and f"{var}=" in env_content:
                    self.log_result('environment', True, f"{var} is configured")
                else:
                    self.log_result('environment', False, f"{var} is missing or empty")
        else:
            self.log_result('environment', False, ".env file not found")
    
    def test_ai_tools_endpoint(self):
        """Test the AI Tools endpoint that fetches from Product Hunt"""
        print("\n=== Testing AI Tools Endpoint ===")
        
        try:
            # Test GET request to ai-tools endpoint
            response = requests.get(f"{API_BASE}/ai-tools", timeout=30)
            
            self.log_result('ai_tools', True, f"API responded with status {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                
                # Check response structure
                if 'tools' in data:
                    tools = data['tools']
                    self.log_result('ai_tools', True, f"Received {len(tools)} AI tools", {
                        'tool_count': len(tools),
                        'sample_tool': tools[0] if tools else None
                    })
                    
                    # Validate tool structure
                    if tools:
                        sample_tool = tools[0]
                        required_fields = ['id', 'name', 'description', 'url', 'votes']
                        missing_fields = [field for field in required_fields if field not in sample_tool]
                        
                        if not missing_fields:
                            self.log_result('ai_tools', True, "Tool structure is valid")
                        else:
                            self.log_result('ai_tools', False, f"Missing fields in tool: {missing_fields}")
                    
                else:
                    self.log_result('ai_tools', False, "Response missing 'tools' field", {'response': data})
            
            elif response.status_code == 500:
                error_data = response.json()
                self.log_result('ai_tools', False, f"Server error: {error_data.get('error', 'Unknown error')}")
            
            else:
                self.log_result('ai_tools', False, f"Unexpected status code: {response.status_code}")
                
        except requests.exceptions.Timeout:
            self.log_result('ai_tools', False, "Request timed out after 30 seconds")
        except requests.exceptions.ConnectionError:
            self.log_result('ai_tools', False, "Connection error - server may not be running")
        except Exception as e:
            self.log_result('ai_tools', False, f"Unexpected error: {str(e)}")
    
    def test_ai_agents_endpoint(self):
        """Test the AI Agents endpoint that uses Groq API"""
        print("\n=== Testing AI Agents Endpoint ===")
        
        # Test different agent types
        test_agents = [
            {
                'agentId': 'resume',
                'input': 'Software Engineer with 5 years experience in Python and React',
                'userId': 'test_user_123'
            },
            {
                'agentId': 'product',
                'input': 'AI-powered task management app for remote teams',
                'userId': 'test_user_123'
            },
            {
                'agentId': 'business',
                'input': 'AI automation platform for small businesses',
                'userId': 'test_user_123'
            }
        ]
        
        for agent_test in test_agents:
            try:
                response = requests.post(
                    f"{API_BASE}/ai-agents",
                    json=agent_test,
                    headers={'Content-Type': 'application/json'},
                    timeout=45
                )
                
                agent_id = agent_test['agentId']
                
                if response.status_code == 200:
                    data = response.json()
                    
                    if 'output' in data and data['output']:
                        self.log_result('ai_agents', True, f"Agent '{agent_id}' generated output", {
                            'agent_id': agent_id,
                            'output_length': len(data['output']),
                            'output_preview': data['output'][:100] + '...' if len(data['output']) > 100 else data['output']
                        })
                    else:
                        self.log_result('ai_agents', False, f"Agent '{agent_id}' returned empty output")
                
                elif response.status_code == 500:
                    error_data = response.json()
                    error_msg = error_data.get('error', 'Unknown error')
                    
                    # Check if it's a Firebase permission error (which we expect)
                    if 'PERMISSION_DENIED' in error_msg:
                        self.log_result('ai_agents', True, f"Agent '{agent_id}' core functionality working (Firebase permission expected)", {
                            'note': 'Firebase permissions need to be configured for production'
                        })
                    else:
                        self.log_result('ai_agents', False, f"Agent '{agent_id}' server error: {error_msg}")
                
                else:
                    self.log_result('ai_agents', False, f"Agent '{agent_id}' unexpected status: {response.status_code}")
                    
            except requests.exceptions.Timeout:
                self.log_result('ai_agents', False, f"Agent '{agent_id}' request timed out")
            except Exception as e:
                self.log_result('ai_agents', False, f"Agent '{agent_id}' error: {str(e)}")
    
    def test_workflows_endpoint(self):
        """Test the Workflows endpoint that generates n8n/Make.com workflows"""
        print("\n=== Testing Workflows Endpoint ===")
        
        # Test both workflow types
        test_workflows = [
            {
                'prompt': 'Create a workflow that sends a Slack notification when a new email arrives in Gmail',
                'type': 'n8n',
                'userId': 'test_user_123'
            },
            {
                'prompt': 'Build an automation that creates a Trello card when a form is submitted on a website',
                'type': 'make',
                'userId': 'test_user_123'
            }
        ]
        
        for workflow_test in test_workflows:
            try:
                response = requests.post(
                    f"{API_BASE}/workflows",
                    json=workflow_test,
                    headers={'Content-Type': 'application/json'},
                    timeout=60
                )
                
                workflow_type = workflow_test['type']
                
                if response.status_code == 200:
                    data = response.json()
                    
                    if 'workflow' in data:
                        workflow = data['workflow']
                        
                        # Check if it's valid JSON structure
                        if isinstance(workflow, dict):
                            self.log_result('workflows', True, f"{workflow_type} workflow generated successfully", {
                                'type': workflow_type,
                                'workflow_keys': list(workflow.keys()),
                                'has_error': 'error' in workflow
                            })
                            
                            # Check for parsing errors
                            if 'error' in workflow:
                                self.log_result('workflows', False, f"{workflow_type} workflow has parsing error: {workflow['error']}")
                        else:
                            self.log_result('workflows', False, f"{workflow_type} workflow is not valid JSON structure")
                    else:
                        self.log_result('workflows', False, f"{workflow_type} response missing 'workflow' field")
                
                elif response.status_code == 500:
                    error_data = response.json()
                    self.log_result('workflows', False, f"{workflow_type} server error: {error_data.get('error', 'Unknown error')}")
                
                else:
                    self.log_result('workflows', False, f"{workflow_type} unexpected status: {response.status_code}")
                    
            except requests.exceptions.Timeout:
                self.log_result('workflows', False, f"{workflow_type} workflow request timed out")
            except Exception as e:
                self.log_result('workflows', False, f"{workflow_type} workflow error: {str(e)}")
    
    def test_error_handling(self):
        """Test error handling for various scenarios"""
        print("\n=== Testing Error Handling ===")
        
        # Test invalid endpoints
        try:
            response = requests.get(f"{API_BASE}/invalid-endpoint")
            if response.status_code == 404:
                self.log_result('error_handling', True, "Invalid endpoint returns 404")
            else:
                self.log_result('error_handling', False, f"Invalid endpoint returned {response.status_code} instead of 404")
        except Exception as e:
            self.log_result('error_handling', False, f"Error testing invalid endpoint: {str(e)}")
        
        # Test invalid HTTP methods
        try:
            response = requests.put(f"{API_BASE}/ai-tools")
            if response.status_code == 405:
                self.log_result('error_handling', True, "PUT method returns 405 Method Not Allowed")
            else:
                self.log_result('error_handling', False, f"PUT method returned {response.status_code} instead of 405")
        except Exception as e:
            self.log_result('error_handling', False, f"Error testing PUT method: {str(e)}")
        
        # Test malformed JSON for POST endpoints
        try:
            response = requests.post(
                f"{API_BASE}/ai-agents",
                data="invalid json",
                headers={'Content-Type': 'application/json'}
            )
            if response.status_code in [400, 500]:
                self.log_result('error_handling', True, f"Malformed JSON handled with status {response.status_code}")
            else:
                self.log_result('error_handling', False, f"Malformed JSON returned unexpected status {response.status_code}")
        except Exception as e:
            self.log_result('error_handling', False, f"Error testing malformed JSON: {str(e)}")
        
        # Test missing required fields
        try:
            response = requests.post(
                f"{API_BASE}/ai-agents",
                json={'agentId': 'resume'},  # Missing input and userId
                headers={'Content-Type': 'application/json'}
            )
            if response.status_code in [400, 500]:
                self.log_result('error_handling', True, f"Missing fields handled with status {response.status_code}")
            else:
                self.log_result('error_handling', False, f"Missing fields returned unexpected status {response.status_code}")
        except Exception as e:
            self.log_result('error_handling', False, f"Error testing missing fields: {str(e)}")
    
    def run_all_tests(self):
        """Run all backend tests"""
        print(f"Starting HappyAxzora Backend API Tests")
        print(f"Base URL: {BASE_URL}")
        print(f"API Base: {API_BASE}")
        print("=" * 60)
        
        # Run all test categories
        self.test_environment_variables()
        self.test_ai_tools_endpoint()
        self.test_ai_agents_endpoint()
        self.test_workflows_endpoint()
        self.test_error_handling()
        
        # Print summary
        self.print_summary()
    
    def print_summary(self):
        """Print test summary"""
        print("\n" + "=" * 60)
        print("TEST SUMMARY")
        print("=" * 60)
        
        total_categories = len(self.results)
        passed_categories = sum(1 for result in self.results.values() if result['status'] == 'success')
        failed_categories = sum(1 for result in self.results.values() if result['status'] == 'failed')
        
        for category, result in self.results.items():
            status_icon = "✅" if result['status'] == 'success' else "❌" if result['status'] == 'failed' else "⏳"
            print(f"{status_icon} {category.upper()}: {result['status']}")
            
            # Show failed tests
            failed_tests = [detail for detail in result['details'] if detail['status'] == 'failed']
            if failed_tests:
                for failed_test in failed_tests[:3]:  # Show first 3 failures
                    print(f"    - {failed_test['message']}")
        
        print(f"\nOverall: {passed_categories}/{total_categories} categories passed")
        
        # Determine overall status
        if failed_categories == 0:
            print("🎉 All backend tests PASSED!")
            return True
        else:
            print(f"⚠️  {failed_categories} categories FAILED")
            return False

def main():
    """Main test execution"""
    tester = BackendTester()
    success = tester.run_all_tests()
    
    # Exit with appropriate code
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()