#!/usr/bin/env python3
"""
Test script for MCP Agent integration
"""

import asyncio
import subprocess
import time
import sys
import os

async def test_mcp_server():
    """Test that our Node.js MCP server works"""
    print("Testing Node.js MCP server...")
    
    try:
        # Start the server process
        process = await asyncio.create_subprocess_exec(
            'node', 'mcp-server-standalone.js',
            stdin=asyncio.subprocess.PIPE,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )
        
        # Test initialization
        init_request = {
            "jsonrpc": "2.0",
            "id": 1,
            "method": "initialize",
            "params": {
                "protocolVersion": "2024-11-05",
                "capabilities": {},
                "clientInfo": {"name": "test-client", "version": "1.0.0"}
            }
        }
        
        request_json = f"{init_request}\n".replace("'", '"')
        process.stdin.write(request_json.encode())
        await process.stdin.drain()
        
        # Wait for response
        response = await asyncio.wait_for(process.stdout.readline(), timeout=5.0)
        
        if response:
            print("✅ MCP server responds correctly")
            success = True
        else:
            print("❌ MCP server did not respond")
            success = False
            
        process.terminate()
        await process.wait()
        return success
        
    except Exception as e:
        print(f"❌ MCP server test failed: {e}")
        return False

def test_mcp_agent_import():
    """Test that we can import MCP Agent modules"""
    print("Testing MCP Agent imports...")
    
    try:
        from mcp_agent.app import MCPApp
        from mcp_agent.agents.agent import Agent
        print("✅ MCP Agent imports successful")
        return True
    except ImportError as e:
        print(f"❌ MCP Agent import failed: {e}")
        print("Run: pip install -r requirements.txt")
        return False

def test_config_files():
    """Test that config files exist"""
    print("Testing configuration files...")
    
    required_files = [
        "mcp_agent.config.yaml",
        "mcp-server-standalone.js",
        "fuzzy_disco_agents.py"
    ]
    
    success = True
    for file in required_files:
        if os.path.exists(file):
            print(f"✅ {file} exists")
        else:
            print(f"❌ {file} missing")
            success = False
            
    return success

async def main():
    """Run all tests"""
    print("🧪 Testing MCP Agent Integration")
    print("=" * 40)
    
    tests = [
        ("Configuration Files", test_config_files),
        ("MCP Agent Import", test_mcp_agent_import),
        ("MCP Server", test_mcp_server),
    ]
    
    results = []
    
    for test_name, test_func in tests:
        print(f"\n{test_name}...")
        if asyncio.iscoroutinefunction(test_func):
            result = await test_func()
        else:
            result = test_func()
        results.append(result)
        
    print("\n" + "=" * 40)
    success_count = sum(results)
    total_tests = len(results)
    
    if success_count == total_tests:
        print(f"🎉 All tests passed ({success_count}/{total_tests})")
        print("\nReady to run:")
        print("python fuzzy_disco_agents.py")
    else:
        print(f"⚠️ {success_count}/{total_tests} tests passed")
        print("\nSetup steps needed:")
        if not results[1]:  # MCP Agent import failed
            print("1. Install dependencies: pip install -r requirements.txt")
        if not results[2]:  # MCP server failed  
            print("2. Check Node.js installation: node --version")
        print("3. Copy mcp_agent.secrets.yaml.example to mcp_agent.secrets.yaml and add API keys")

if __name__ == "__main__":
    asyncio.run(main())