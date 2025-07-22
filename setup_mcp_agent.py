#!/usr/bin/env python3
"""
Setup script for MCP Agent integration
"""

import subprocess
import sys
import os
import json


def install_requirements():
    """Install Python requirements"""
    print("Installing Python requirements...")
    
    try:
        subprocess.check_call([
            sys.executable, "-m", "pip", "install", "-r", "requirements.txt"
        ])
        print("✅ Python requirements installed successfully")
    except subprocess.CalledProcessError as e:
        print(f"❌ Error installing requirements: {e}")
        return False
    
    return True


def test_node_server():
    """Test that the Node.js MCP server works"""
    print("Testing Node.js MCP server...")
    
    try:
        # Test the server by running the test script
        result = subprocess.run([
            "node", "test-mcp.js"
        ], capture_output=True, text=True, timeout=10)
        
        if result.returncode == 0:
            print("✅ Node.js MCP server test passed")
            return True
        else:
            print(f"❌ Node.js MCP server test failed: {result.stderr}")
            return False
            
    except subprocess.TimeoutExpired:
        print("❌ Node.js MCP server test timed out")
        return False
    except FileNotFoundError:
        print("❌ Node.js not found. Please install Node.js first.")
        return False


def create_example_directories():
    """Create necessary directories"""
    directories = ["examples", "logs"]
    
    for directory in directories:
        os.makedirs(directory, exist_ok=True)
        print(f"✅ Created directory: {directory}")


def test_python_integration():
    """Test the Python MCP integration"""
    print("Testing Python MCP integration...")
    
    try:
        # Import our integration module
        import mcp_agent_integration
        print("✅ Python integration module imports successfully")
        
        # Test basic functionality (without actually starting the server)
        from mcp_agent_integration import PRACTITIONERS, PractitionerStyle
        
        assert len(PRACTITIONERS) == 5, "Should have 5 practitioners"
        assert all(isinstance(p, PractitionerStyle) for p in PRACTITIONERS), "All should be PractitionerStyle instances"
        
        print("✅ Python integration basic tests passed")
        return True
        
    except ImportError as e:
        print(f"❌ Import error: {e}")
        return False
    except Exception as e:
        print(f"❌ Test error: {e}")
        return False


def create_demo_script():
    """Create a simple demo script"""
    demo_content = '''#!/usr/bin/env python3
"""
Quick demo of MCP Agent integration
"""

import asyncio
from mcp_agent_integration import FuzzyDiscoMCPClient, PractitionerAgent, PRACTITIONERS

async def quick_demo():
    print("MCP Agent Integration Demo")
    print("=" * 30)
    
    # Show available practitioners
    print("Available Practitioners:")
    for p in PRACTITIONERS:
        print(f"  - {p.name}: {', '.join(p.principles[:2])}")
    
    print("\\nFor full demos, run:")
    print("  python examples/code_review_agent.py")
    print("  python examples/team_simulation.py")
    print("  python workflows.py")

if __name__ == "__main__":
    asyncio.run(quick_demo())
'''
    
    with open("demo_integration.py", "w") as f:
        f.write(demo_content)
    
    print("✅ Created demo_integration.py")


def update_claude_md():
    """Update CLAUDE.md with MCP Agent information"""
    addition = '''

## MCP Agent Integration

### Python MCP Agent Commands:
```bash
# Install Python requirements
python setup_mcp_agent.py

# Quick demo
python demo_integration.py

# Code review with multiple practitioners
python examples/code_review_agent.py <file_path>

# Team simulation scenarios
python examples/team_simulation.py

# Advanced workflow patterns
python workflows.py
```

### Available Workflows:
- **Parallel Review** - All practitioners analyze code simultaneously
- **Sequential Improvement** - Iterative code improvement until target score
- **Consensus Building** - Build agreement on design decisions
- **Collaborative Design** - Role-specific contributions to system design

### Integration Architecture:
- Node.js MCP Server provides tools (existing)
- Python MCP Client connects to Node.js server
- Python Agents orchestrate complex workflows
- Multi-agent patterns enable team simulation
'''
    
    try:
        with open("CLAUDE.md", "r") as f:
            content = f.read()
        
        if "MCP Agent Integration" not in content:
            with open("CLAUDE.md", "a") as f:
                f.write(addition)
            print("✅ Updated CLAUDE.md with MCP Agent integration info")
        else:
            print("✅ CLAUDE.md already contains MCP Agent info")
            
    except FileNotFoundError:
        print("❌ CLAUDE.md not found")


def main():
    """Main setup function"""
    print("Setting up MCP Agent integration for Fuzzy Disco AI")
    print("=" * 50)
    
    steps = [
        ("Creating directories", create_example_directories),
        ("Installing Python requirements", install_requirements),
        ("Testing Node.js server", test_node_server),
        ("Testing Python integration", test_python_integration),
        ("Creating demo script", create_demo_script),
        ("Updating documentation", update_claude_md)
    ]
    
    success_count = 0
    
    for step_name, step_function in steps:
        print(f"\n{step_name}...")
        if step_function():
            success_count += 1
        else:
            print(f"⚠️ {step_name} had issues but continuing...")
    
    print(f"\n{'=' * 50}")
    print(f"Setup completed: {success_count}/{len(steps)} steps successful")
    
    if success_count >= 4:  # Most critical steps
        print("\n🎉 MCP Agent integration is ready!")
        print("\nNext steps:")
        print("1. Run: python demo_integration.py")
        print("2. Try: python examples/code_review_agent.py examples/code_review_agent.py")
        print("3. Explore: python workflows.py")
    else:
        print("\n⚠️ Some setup steps failed. Check the errors above.")
        print("You may need to:")
        print("- Install Node.js and npm")
        print("- Run npm install in this directory")
        print("- Install Python packages manually: pip install -r requirements.txt")


if __name__ == "__main__":
    main()