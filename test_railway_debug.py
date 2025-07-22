#!/usr/bin/env python3
"""
Test Railway deployment with debug endpoints
"""

import asyncio
import aiohttp
import json
import time
from typing import Dict, Any


async def test_railway_endpoints():
    """Test all Railway debug endpoints"""
    
    base_url = "https://fuzzy-disco-ai-production.up.railway.app"
    # base_url = "http://localhost:8000"  # For local testing
    
    print(f"🧪 Testing Railway Deployment: {base_url}")
    print("=" * 60)
    
    async with aiohttp.ClientSession() as session:
        
        # Test 1: Basic service info
        print("\n1. Testing Service Information...")
        try:
            async with session.get(f"{base_url}/") as response:
                if response.status == 200:
                    data = await response.json()
                    print("✅ Service Info:")
                    print(f"   Name: {data.get('name')}")
                    print(f"   Version: {data.get('version')}")
                    print(f"   MCP Integration: {data.get('mcpAgentIntegration', {}).get('status')}")
                    print(f"   Practitioners: {len(data.get('mcpAgentIntegration', {}).get('practitioners', []))}")
                else:
                    print(f"❌ Service info failed: {response.status}")
        except Exception as e:
            print(f"❌ Service info error: {e}")
        
        # Test 2: Health check
        print("\n2. Testing Health Check...")
        try:
            async with session.get(f"{base_url}/health") as response:
                if response.status == 200:
                    data = await response.json()
                    print(f"✅ Health: {data.get('status')} at {data.get('timestamp')}")
                else:
                    print(f"❌ Health check failed: {response.status}")
        except Exception as e:
            print(f"❌ Health check error: {e}")
        
        # Test 3: Debug information
        print("\n3. Testing Debug Information...")
        try:
            async with session.get(f"{base_url}/debug") as response:
                if response.status == 200:
                    data = await response.json()
                    print("✅ Debug Info:")
                    print(f"   Platform: {data.get('system', {}).get('platform')}")
                    print(f"   Node Version: {data.get('system', {}).get('nodeVersion')}")
                    print(f"   Uptime: {data.get('server', {}).get('uptime'):.2f}s")
                    print(f"   Railway Deployed: {data.get('railway', {}).get('deployed')}")
                    print(f"   MCP Tools: {data.get('mcp', {}).get('toolsCount')}")
                    print(f"   Practitioners Available: {len(data.get('mcp', {}).get('practitioners', []))}")
                else:
                    print(f"❌ Debug info failed: {response.status}")
        except Exception as e:
            print(f"❌ Debug info error: {e}")
        
        # Test 4: Integration tests
        print("\n4. Testing Integration Tests...")
        try:
            async with session.get(f"{base_url}/debug/test") as response:
                if response.status == 200:
                    data = await response.json()
                    summary = data.get('summary', {})
                    print("✅ Integration Tests:")
                    print(f"   Total Tests: {summary.get('total')}")
                    print(f"   Passed: {summary.get('passed')}")
                    print(f"   Failed: {summary.get('failed')}")
                    print(f"   Success: {'✅' if summary.get('success') else '❌'}")
                    
                    # Show individual test results
                    for test in data.get('tests', []):
                        status_icon = "✅" if test.get('status') == 'passed' else "❌"
                        print(f"   {status_icon} {test.get('name')}")
                else:
                    print(f"❌ Integration tests failed: {response.status}")
        except Exception as e:
            print(f"❌ Integration tests error: {e}")
        
        # Test 5: MCP Tools endpoint
        print("\n5. Testing MCP Tools...")
        try:
            async with session.get(f"{base_url}/api/tools") as response:
                if response.status == 200:
                    data = await response.json()
                    tools = data.get('tools', [])
                    print(f"✅ MCP Tools ({len(tools)} available):")
                    for tool in tools:
                        print(f"   • {tool.get('name')}: {tool.get('description')}")
                else:
                    print(f"❌ MCP tools failed: {response.status}")
        except Exception as e:
            print(f"❌ MCP tools error: {e}")
        
        # Test 6: Sample API calls
        print("\n6. Testing Sample API Calls...")
        
        # Test select-style API
        try:
            payload = {
                "taskType": "feature",
                "context": "user authentication system",
                "teamSize": 3
            }
            async with session.post(f"{base_url}/api/select-style", json=payload) as response:
                if response.status == 200:
                    data = await response.json()
                    print("✅ Style Selection API:")
                    print(f"   Recommended: {data.get('recommendation', {}).get('practitioner')}")
                    print(f"   Reasoning: {data.get('recommendation', {}).get('reasoning', 'N/A')[:60]}...")
                else:
                    text = await response.text()
                    print(f"❌ Style selection failed: {response.status} - {text[:100]}")
        except Exception as e:
            print(f"❌ Style selection error: {e}")
        
        # Test code generation API
        try:
            payload = {
                "practitioner": "uncle-bob",
                "codeType": "function",
                "requirements": "validate email format",
                "language": "javascript"
            }
            async with session.post(f"{base_url}/api/generate-code", json=payload) as response:
                if response.status == 200:
                    data = await response.json()
                    print("✅ Code Generation API:")
                    print(f"   Practitioner: {data.get('practitioner')}")
                    code = data.get('generatedCode', '')
                    print(f"   Code Length: {len(code)} characters")
                    print(f"   Principles: {', '.join(data.get('principles', []))}")
                else:
                    text = await response.text()
                    print(f"❌ Code generation failed: {response.status} - {text[:100]}")
        except Exception as e:
            print(f"❌ Code generation error: {e}")


async def test_mcp_agent_connection():
    """Test MCP Agent can connect to Railway"""
    print("\n7. Testing MCP Agent Connection to Railway...")
    
    try:
        # Import our Railway MCP client
        import sys
        import os
        sys.path.append(os.path.dirname(__file__))
        
        from railway_mcp_agent import RailwayMCPClient
        
        # Test connection
        railway_client = RailwayMCPClient()
        await railway_client.start()
        
        # Test a simple call
        result = await railway_client.call_tool(
            "select_practitioner_style",
            {
                "taskType": "feature",
                "context": "Railway deployment test",
                "teamSize": 2
            }
        )
        
        print("✅ MCP Agent → Railway Connection:")
        print(f"   Practitioner: {result.get('recommendation', {}).get('practitioner', 'Unknown')}")
        print(f"   Integration: Working")
        
        await railway_client.close()
        
    except ImportError:
        print("⚠️ MCP Agent modules not available (expected in Railway environment)")
    except Exception as e:
        print(f"❌ MCP Agent connection error: {e}")


async def main():
    """Run all tests"""
    start_time = time.time()
    
    await test_railway_endpoints()
    await test_mcp_agent_connection()
    
    end_time = time.time()
    print(f"\n{'='*60}")
    print(f"🎯 Test completed in {end_time - start_time:.2f}s")
    print(f"🚀 Railway URL: https://fuzzy-disco-ai-production.up.railway.app")
    print(f"🔍 Debug URL: https://fuzzy-disco-ai-production.up.railway.app/debug")
    print(f"🧪 Test URL: https://fuzzy-disco-ai-production.up.railway.app/debug/test")


if __name__ == "__main__":
    asyncio.run(main())