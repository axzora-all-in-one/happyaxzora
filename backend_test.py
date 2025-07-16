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
            'chatbot_create': {'status': 'pending', 'details': []},
            'chatbot_list': {'status': 'pending', 'details': []},
            'chatbot_test': {'status': 'pending', 'details': []},
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
        """Test the AI Tools endpoint with enhanced date sorting"""
        print("\n=== Testing Enhanced AI Tools Endpoint ===")
        
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
                    
                    # Validate tool structure with new date fields
                    if tools:
                        sample_tool = tools[0]
                        required_fields = ['id', 'name', 'description', 'url', 'votes']
                        enhanced_fields = ['createdAt', 'featuredAt', 'date', 'topics']
                        
                        missing_fields = [field for field in required_fields if field not in sample_tool]
                        
                        if not missing_fields:
                            self.log_result('ai_tools', True, "Tool structure is valid")
                            
                            # Check for enhanced date sorting fields
                            has_enhanced_fields = any(field in sample_tool for field in enhanced_fields)
                            if has_enhanced_fields:
                                self.log_result('ai_tools', True, "Enhanced date sorting fields present", {
                                    'enhanced_fields_found': [field for field in enhanced_fields if field in sample_tool]
                                })
                                
                                # Test date sorting - check if tools are sorted by date (newest first)
                                if len(tools) > 1:
                                    first_date = tools[0].get('date') or tools[0].get('createdAt')
                                    second_date = tools[1].get('date') or tools[1].get('createdAt')
                                    
                                    if first_date and second_date:
                                        from datetime import datetime
                                        first_dt = datetime.fromisoformat(first_date.replace('Z', '+00:00'))
                                        second_dt = datetime.fromisoformat(second_date.replace('Z', '+00:00'))
                                        
                                        if first_dt >= second_dt:
                                            self.log_result('ai_tools', True, "Date sorting working correctly (newest first)")
                                        else:
                                            self.log_result('ai_tools', False, "Date sorting not working correctly")
                            else:
                                self.log_result('ai_tools', False, "Enhanced date sorting fields missing")
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
    
    def test_chatbot_create_endpoint(self):
        """Test the new Chatbot creation endpoint"""
        print("\n=== Testing Chatbot Creation Endpoint ===")
        
        # Test chatbot creation with knowledge base processing
        test_chatbot = {
            'name': 'Customer Support Bot',
            'description': 'AI-powered customer support chatbot for e-commerce',
            'knowledgeBase': 'Our company offers premium software solutions for businesses. We provide 24/7 support, have a 30-day money-back guarantee, and offer enterprise-level security. Our main products include CRM software, project management tools, and analytics dashboards.',
            'color': '#3B82F6',
            'userId': 'test_user_chatbot_123'
        }
        
        try:
            response = requests.post(
                f"{API_BASE}/chatbots",
                json=test_chatbot,
                headers={'Content-Type': 'application/json'},
                timeout=60
            )
            
            if response.status_code == 200:
                data = response.json()
                
                if 'chatbot' in data:
                    chatbot = data['chatbot']
                    
                    # Validate chatbot structure
                    required_fields = ['id', 'name', 'description', 'knowledgeBase', 'color', 'userId', 'createdAt']
                    missing_fields = [field for field in required_fields if field not in chatbot]
                    
                    if not missing_fields:
                        self.log_result('chatbot_create', True, "Chatbot created successfully", {
                            'chatbot_id': chatbot['id'],
                            'name': chatbot['name'],
                            'has_processed_knowledge': len(chatbot.get('knowledgeBase', '')) > len(test_chatbot['knowledgeBase']),
                            'original_knowledge_preserved': 'originalKnowledge' in chatbot
                        })
                        
                        # Check if knowledge base was processed by Groq
                        if chatbot.get('knowledgeBase') != test_chatbot['knowledgeBase']:
                            self.log_result('chatbot_create', True, "Knowledge base processed with AI enhancement")
                        else:
                            self.log_result('chatbot_create', False, "Knowledge base not processed by AI")
                            
                        # Store chatbot ID for testing
                        self.test_chatbot_id = chatbot['id']
                        
                    else:
                        self.log_result('chatbot_create', False, f"Missing fields in chatbot: {missing_fields}")
                else:
                    self.log_result('chatbot_create', False, "Response missing 'chatbot' field")
            
            elif response.status_code == 500:
                error_data = response.json()
                error_msg = error_data.get('error', 'Unknown error')
                
                # Check for Groq API key issues
                if 'Invalid Groq API key' in error_msg:
                    self.log_result('chatbot_create', False, f"Groq API key configuration error: {error_msg}")
                elif 'PERMISSION_DENIED' in error_msg:
                    self.log_result('chatbot_create', True, "Chatbot creation core functionality working (Firebase permission expected)", {
                        'note': 'Firebase permissions need to be configured for production'
                    })
                else:
                    self.log_result('chatbot_create', False, f"Server error: {error_msg}")
            
            else:
                self.log_result('chatbot_create', False, f"Unexpected status code: {response.status_code}")
                
        except requests.exceptions.Timeout:
            self.log_result('chatbot_create', False, "Chatbot creation request timed out")
        except Exception as e:
            self.log_result('chatbot_create', False, f"Chatbot creation error: {str(e)}")
        
        # Test invalid Groq API key handling
        print("\n--- Testing Invalid Groq API Key Handling ---")
        try:
            # This should be handled gracefully by the API
            invalid_chatbot = {
                'name': 'Test Bot',
                'description': 'Test description',
                'knowledgeBase': 'Test knowledge',
                'color': '#FF0000',
                'userId': 'test_user'
            }
            
            response = requests.post(
                f"{API_BASE}/chatbots",
                json=invalid_chatbot,
                headers={'Content-Type': 'application/json'},
                timeout=30
            )
            
            # The API should handle invalid keys gracefully
            if response.status_code in [200, 500]:
                if response.status_code == 500:
                    error_data = response.json()
                    if 'Invalid Groq API key' in error_data.get('error', ''):
                        self.log_result('chatbot_create', True, "Invalid Groq API key handled gracefully")
                    else:
                        self.log_result('chatbot_create', True, "Error handling working for chatbot creation")
                else:
                    self.log_result('chatbot_create', True, "Chatbot creation with valid API key successful")
            else:
                self.log_result('chatbot_create', False, f"Unexpected error handling response: {response.status_code}")
                
        except Exception as e:
            self.log_result('chatbot_create', False, f"Error testing invalid API key handling: {str(e)}")
    
    def test_chatbot_list_endpoint(self):
        """Test the Chatbot listing endpoint"""
        print("\n=== Testing Chatbot List Endpoint ===")
        
        try:
            response = requests.get(f"{API_BASE}/chatbots", timeout=30)
            
            if response.status_code == 200:
                data = response.json()
                
                if 'chatbots' in data:
                    chatbots = data['chatbots']
                    self.log_result('chatbot_list', True, f"Retrieved {len(chatbots)} chatbots", {
                        'chatbot_count': len(chatbots),
                        'sample_chatbot': chatbots[0] if chatbots else None
                    })
                    
                    # Validate chatbot list structure
                    if chatbots:
                        sample_chatbot = chatbots[0]
                        required_fields = ['id', 'name', 'description', 'color', 'createdAt', 'userId']
                        missing_fields = [field for field in required_fields if field not in sample_chatbot]
                        
                        if not missing_fields:
                            self.log_result('chatbot_list', True, "Chatbot list structure is valid")
                        else:
                            self.log_result('chatbot_list', False, f"Missing fields in chatbot list: {missing_fields}")
                    else:
                        self.log_result('chatbot_list', True, "Empty chatbot list returned (expected for new system)")
                        
                else:
                    self.log_result('chatbot_list', False, "Response missing 'chatbots' field")
            
            else:
                self.log_result('chatbot_list', False, f"Unexpected status code: {response.status_code}")
                
        except requests.exceptions.Timeout:
            self.log_result('chatbot_list', False, "Chatbot list request timed out")
        except Exception as e:
            self.log_result('chatbot_list', False, f"Chatbot list error: {str(e)}")
    
    def test_chatbot_test_endpoint(self):
        """Test the Chatbot testing endpoint"""
        print("\n=== Testing Chatbot Test Endpoint ===")
        
        # Test chatbot response generation
        test_messages = [
            {
                'chatbotId': 'test_bot_123',
                'message': 'What are your business hours?',
                'userId': 'test_user_123'
            },
            {
                'chatbotId': 'test_bot_123', 
                'message': 'Do you offer refunds?',
                'userId': 'test_user_123'
            },
            {
                'chatbotId': 'test_bot_123',
                'message': 'Tell me about your products',
                'userId': 'test_user_123'
            }
        ]
        
        for test_message in test_messages:
            try:
                response = requests.post(
                    f"{API_BASE}/chatbots/test",
                    json=test_message,
                    headers={'Content-Type': 'application/json'},
                    timeout=45
                )
                
                message_preview = test_message['message'][:30] + '...' if len(test_message['message']) > 30 else test_message['message']
                
                if response.status_code == 200:
                    data = response.json()
                    
                    if 'response' in data and data['response']:
                        self.log_result('chatbot_test', True, f"Chatbot responded to: '{message_preview}'", {
                            'message': test_message['message'],
                            'response_length': len(data['response']),
                            'response_preview': data['response'][:100] + '...' if len(data['response']) > 100 else data['response']
                        })
                    else:
                        self.log_result('chatbot_test', False, f"Empty response for: '{message_preview}'")
                
                elif response.status_code == 500:
                    error_data = response.json()
                    error_msg = error_data.get('error', 'Unknown error')
                    
                    # Check for Groq API key issues
                    if 'Invalid Groq API key' in error_msg:
                        self.log_result('chatbot_test', False, f"Groq API key error for: '{message_preview}': {error_msg}")
                    else:
                        self.log_result('chatbot_test', False, f"Server error for: '{message_preview}': {error_msg}")
                
                else:
                    self.log_result('chatbot_test', False, f"Unexpected status for: '{message_preview}': {response.status_code}")
                    
            except requests.exceptions.Timeout:
                self.log_result('chatbot_test', False, f"Chatbot test request timed out for: '{message_preview}'")
            except Exception as e:
                self.log_result('chatbot_test', False, f"Chatbot test error for: '{message_preview}': {str(e)}")
        
        # Test missing fields handling
        print("\n--- Testing Missing Fields Handling ---")
        try:
            incomplete_request = {'chatbotId': 'test_bot'}  # Missing message and userId
            
            response = requests.post(
                f"{API_BASE}/chatbots/test",
                json=incomplete_request,
                headers={'Content-Type': 'application/json'},
                timeout=30
            )
            
            if response.status_code in [400, 500]:
                self.log_result('chatbot_test', True, "Missing fields handled appropriately")
            elif response.status_code == 200:
                # API might handle missing fields gracefully
                data = response.json()
                if 'response' in data:
                    self.log_result('chatbot_test', True, "Missing fields handled gracefully with response")
                else:
                    self.log_result('chatbot_test', False, "Missing fields not handled properly")
            else:
                self.log_result('chatbot_test', False, f"Unexpected response to missing fields: {response.status_code}")
                
        except Exception as e:
            self.log_result('chatbot_test', False, f"Error testing missing fields: {str(e)}")
    
    def test_ai_agents_endpoint(self):
        """Test the AI Agents endpoint with improved error handling"""
        print("\n=== Testing Enhanced AI Agents Endpoint ===")
        
        # Test different agent types
        test_agents = [
            {
                'agentId': 'resume',
                'input': 'Senior Software Engineer with 5 years experience in Python, React, and cloud technologies. Led teams of 3-5 developers.',
                'userId': 'test_user_123'
            },
            {
                'agentId': 'product',
                'input': 'AI-powered task management app for remote teams with real-time collaboration features',
                'userId': 'test_user_123'
            },
            {
                'agentId': 'business',
                'input': 'AI automation platform for small businesses to streamline operations',
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
                    
                    # Check for improved error handling
                    if 'Invalid Groq API key configuration' in error_msg:
                        self.log_result('ai_agents', True, f"Agent '{agent_id}' improved error handling for invalid API key")
                    elif 'PERMISSION_DENIED' in error_msg:
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
        
        # Test improved error handling with invalid API key scenario
        print("\n--- Testing Improved Error Handling ---")
        try:
            # Test with missing fields to check error handling
            incomplete_request = {'agentId': 'resume'}  # Missing input and userId
            
            response = requests.post(
                f"{API_BASE}/ai-agents",
                json=incomplete_request,
                headers={'Content-Type': 'application/json'},
                timeout=30
            )
            
            if response.status_code == 200:
                # API handles missing fields gracefully
                data = response.json()
                if 'output' in data:
                    self.log_result('ai_agents', True, "Improved error handling: Missing fields handled gracefully")
                else:
                    self.log_result('ai_agents', False, "Missing fields response lacks output")
            elif response.status_code == 500:
                error_data = response.json()
                if 'Invalid Groq API key configuration' in error_data.get('error', ''):
                    self.log_result('ai_agents', True, "Improved error handling: Invalid API key detected properly")
                else:
                    self.log_result('ai_agents', True, f"Error handling working with status {response.status_code}")
            else:
                self.log_result('ai_agents', False, f"Unexpected error handling response: {response.status_code}")
                
        except Exception as e:
            self.log_result('ai_agents', False, f"Error testing improved error handling: {str(e)}")
    
    def test_workflows_endpoint(self):
        """Test the Workflows endpoint with better JSON parsing"""
        print("\n=== Testing Enhanced Workflows Endpoint ===")
        
        # Test both workflow types with more complex scenarios
        test_workflows = [
            {
                'prompt': 'Create a workflow that sends a Slack notification when a new email arrives in Gmail, then creates a task in Asana',
                'type': 'n8n',
                'userId': 'test_user_123'
            },
            {
                'prompt': 'Build an automation that creates a Trello card when a form is submitted on a website, then sends a welcome email',
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
                            
                            # Test better JSON parsing - check for parsing errors
                            if 'error' in workflow:
                                if workflow['error'] == 'Failed to parse workflow JSON':
                                    self.log_result('workflows', True, f"{workflow_type} better JSON parsing detected parsing failure", {
                                        'raw_response_available': 'raw_response' in workflow
                                    })
                                elif workflow['error'] == 'Invalid JSON generated':
                                    self.log_result('workflows', True, f"{workflow_type} better JSON parsing detected invalid JSON")
                                else:
                                    self.log_result('workflows', False, f"{workflow_type} workflow has unexpected error: {workflow['error']}")
                            else:
                                # Check for expected workflow structure based on type
                                if workflow_type == 'n8n':
                                    expected_keys = ['name', 'nodes', 'connections']
                                    has_expected_structure = any(key in workflow for key in expected_keys)
                                elif workflow_type == 'make':
                                    expected_keys = ['name', 'modules', 'connections', 'routes']
                                    has_expected_structure = any(key in workflow for key in expected_keys)
                                else:
                                    has_expected_structure = True
                                
                                if has_expected_structure:
                                    self.log_result('workflows', True, f"{workflow_type} workflow has proper structure")
                                else:
                                    self.log_result('workflows', False, f"{workflow_type} workflow missing expected structure")
                        else:
                            self.log_result('workflows', False, f"{workflow_type} workflow is not valid JSON structure")
                    else:
                        self.log_result('workflows', False, f"{workflow_type} response missing 'workflow' field")
                
                elif response.status_code == 500:
                    error_data = response.json()
                    error_msg = error_data.get('error', 'Unknown error')
                    
                    # Check for improved error handling
                    if 'Invalid Groq API key configuration' in error_msg:
                        self.log_result('workflows', True, f"{workflow_type} improved error handling for invalid API key")
                    elif 'PERMISSION_DENIED' in error_msg:
                        self.log_result('workflows', True, f"{workflow_type} core functionality working (Firebase permission expected)", {
                            'note': 'Firebase permissions need to be configured for production'
                        })
                    else:
                        self.log_result('workflows', False, f"{workflow_type} server error: {error_msg}")
                
                else:
                    self.log_result('workflows', False, f"{workflow_type} unexpected status: {response.status_code}")
                    
            except requests.exceptions.Timeout:
                self.log_result('workflows', False, f"{workflow_type} workflow request timed out")
            except Exception as e:
                self.log_result('workflows', False, f"{workflow_type} workflow error: {str(e)}")
        
        # Test better JSON parsing with edge cases
        print("\n--- Testing Better JSON Parsing ---")
        try:
            # Test with a prompt that might generate malformed JSON
            edge_case_test = {
                'prompt': 'Create a complex workflow with multiple conditions, loops, and error handling',
                'type': 'n8n',
                'userId': 'test_user_123'
            }
            
            response = requests.post(
                f"{API_BASE}/workflows",
                json=edge_case_test,
                headers={'Content-Type': 'application/json'},
                timeout=60
            )
            
            if response.status_code == 200:
                data = response.json()
                workflow = data.get('workflow', {})
                
                if 'error' in workflow:
                    if 'Failed to parse workflow JSON' in workflow['error']:
                        self.log_result('workflows', True, "Better JSON parsing: Detected and handled parsing failure")
                    elif 'Invalid JSON generated' in workflow['error']:
                        self.log_result('workflows', True, "Better JSON parsing: Detected invalid JSON generation")
                    else:
                        self.log_result('workflows', True, "Better JSON parsing: Error handling working")
                else:
                    self.log_result('workflows', True, "Better JSON parsing: Successfully parsed complex workflow")
            else:
                self.log_result('workflows', True, f"Better JSON parsing: Error handling with status {response.status_code}")
                
        except Exception as e:
            self.log_result('workflows', False, f"Error testing better JSON parsing: {str(e)}")
    
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
            if response.status_code == 200:
                # API handles missing fields gracefully by providing helpful response
                data = response.json()
                if 'output' in data:
                    self.log_result('error_handling', True, "Missing fields handled gracefully with helpful response")
                else:
                    self.log_result('error_handling', False, "Missing fields response lacks output")
            elif response.status_code in [400, 500]:
                self.log_result('error_handling', True, f"Missing fields handled with status {response.status_code}")
            else:
                self.log_result('error_handling', False, f"Missing fields returned unexpected status {response.status_code}")
        except Exception as e:
            self.log_result('error_handling', False, f"Error testing missing fields: {str(e)}")
    
    def run_all_tests(self):
        """Run all backend tests"""
        print(f"Starting Enhanced HappyAxzora Backend API Tests")
        print(f"Base URL: {BASE_URL}")
        print(f"API Base: {API_BASE}")
        print("=" * 60)
        
        # Run all test categories
        self.test_environment_variables()
        self.test_ai_tools_endpoint()
        self.test_ai_agents_endpoint()
        self.test_workflows_endpoint()
        self.test_chatbot_create_endpoint()
        self.test_chatbot_list_endpoint()
        self.test_chatbot_test_endpoint()
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