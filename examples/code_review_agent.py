#!/usr/bin/env python3
"""
Code Review Agent Example
Demonstrates using multiple practitioner agents for comprehensive code review
"""

import asyncio
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from mcp_agent_integration import FuzzyDiscoMCPClient, PractitionerAgent, TeamCoordinatorAgent, PRACTITIONERS


async def review_code_file(file_path: str):
    """Review a code file using multiple practitioner perspectives"""
    
    # Read the code file
    try:
        with open(file_path, 'r') as f:
            code_content = f.read()
    except FileNotFoundError:
        print(f"Error: File {file_path} not found")
        return
    
    # Determine language from file extension
    language_map = {
        '.js': 'javascript',
        '.ts': 'typescript',
        '.py': 'python',
        '.java': 'java',
        '.cpp': 'cpp',
        '.c': 'c'
    }
    
    file_ext = os.path.splitext(file_path)[1]
    language = language_map.get(file_ext, 'javascript')
    
    print(f"Reviewing {file_path} ({language})")
    print("=" * 50)
    
    # Initialize MCP client and agents
    mcp_client = FuzzyDiscoMCPClient()
    await mcp_client.start()
    
    try:
        # Create practitioner agents
        practitioner_agents = [
            PractitionerAgent(style, mcp_client)
            for style in PRACTITIONERS
        ]
        
        # Create team coordinator
        coordinator = TeamCoordinatorAgent(practitioner_agents, mcp_client)
        
        # Run comprehensive review
        review_results = await coordinator.coordinate_code_review(code_content, language)
        
        # Display results
        print(f"Overall Score: {review_results['consensus']['average_score']}/100")
        print(f"Top Recommendations: {review_results['consensus']['top_recommendations']}")
        print("\nPer-Practitioner Analysis:")
        
        for practitioner_name, analysis in review_results['practitioners'].items():
            print(f"\n{practitioner_name}:")
            print(f"  Score: {analysis.get('overallScore', 'N/A')}")
            
            if 'recommendations' in analysis:
                print(f"  Recommendations: {analysis['recommendations'][:2]}")
            
            if 'actionItems' in analysis:
                print(f"  Action Items: {analysis['actionItems'][:2]}")
        
        print("\nNext Steps:")
        for step in review_results.get('action_items', []):
            print(f"  - {step}")
            
    finally:
        await mcp_client.close()


async def compare_implementations():
    """Compare different implementation approaches from various practitioners"""
    
    mcp_client = FuzzyDiscoMCPClient()
    await mcp_client.start()
    
    try:
        practitioner_agents = [
            PractitionerAgent(style, mcp_client)
            for style in PRACTITIONERS[:3]  # Use first 3 for comparison
        ]
        
        requirement = "Create a user authentication service with login, logout, and session management"
        
        print("Comparing Implementation Approaches")
        print("=" * 50)
        
        for agent in practitioner_agents:
            print(f"\n{agent.style.name}'s Approach:")
            result = await agent.generate_code("AuthService", requirement, "typescript")
            
            print(f"Principles: {', '.join(result.get('principles', []))}")
            print(f"Usage: {result.get('usage', 'N/A')}")
            print("Code Sample:")
            print(result.get('generatedCode', 'N/A')[:200] + "...")
            
    finally:
        await mcp_client.close()


if __name__ == "__main__":
    if len(sys.argv) > 1:
        # Review specific file
        file_path = sys.argv[1]
        asyncio.run(review_code_file(file_path))
    else:
        # Demo comparison
        asyncio.run(compare_implementations())