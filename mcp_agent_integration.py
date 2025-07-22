#!/usr/bin/env python3
"""
MCP Agent Integration for Fuzzy Disco AI
Connects Python MCP agents to the existing Node.js MCP server
"""

import asyncio
import json
import subprocess
from typing import Dict, Any, List
from dataclasses import dataclass
from mcp_agent import Agent, AugmentedLLM, MCPApp


@dataclass
class PractitionerStyle:
    name: str
    style_id: str
    principles: List[str]
    focus_areas: List[str]


class FuzzyDiscoMCPClient:
    """Client to communicate with the Node.js MCP server"""
    
    def __init__(self, server_path: str = "./mcp-server-standalone.js"):
        self.server_path = server_path
        self.process = None
        
    async def start(self):
        """Start the Node.js MCP server as a subprocess"""
        self.process = await asyncio.create_subprocess_exec(
            'node', self.server_path,
            stdin=asyncio.subprocess.PIPE,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )
        
    async def call_tool(self, tool_name: str, arguments: Dict[str, Any]) -> Dict[str, Any]:
        """Call a tool on the MCP server"""
        if not self.process:
            await self.start()
            
        # Create MCP request
        request = {
            "jsonrpc": "2.0",
            "id": 1,
            "method": "tools/call",
            "params": {
                "name": tool_name,
                "arguments": arguments
            }
        }
        
        # Send request
        request_json = json.dumps(request) + '\n'
        self.process.stdin.write(request_json.encode())
        await self.process.stdin.drain()
        
        # Read response
        response_line = await self.process.stdout.readline()
        response = json.loads(response_line.decode())
        
        if "error" in response:
            raise Exception(f"MCP Error: {response['error']}")
            
        return response.get("result", {})
    
    async def close(self):
        """Close the MCP server process"""
        if self.process:
            self.process.terminate()
            await self.process.wait()


class PractitionerAgent(Agent):
    """Agent representing a specific software engineering practitioner"""
    
    def __init__(self, practitioner_style: PractitionerStyle, mcp_client: FuzzyDiscoMCPClient):
        super().__init__(name=f"{practitioner_style.name}_agent")
        self.style = practitioner_style
        self.mcp_client = mcp_client
        
    async def analyze_code(self, code: str, language: str = "javascript") -> Dict[str, Any]:
        """Analyze code from this practitioner's perspective"""
        result = await self.mcp_client.call_tool(
            "analyze_code_quality",
            {
                "code": code,
                "language": language,
                "focusAreas": self.style.focus_areas
            }
        )
        return result
    
    async def generate_code(self, code_type: str, requirements: str, language: str = "typescript") -> Dict[str, Any]:
        """Generate code following this practitioner's style"""
        result = await self.mcp_client.call_tool(
            "generate_code_with_style",
            {
                "practitioner": self.style.style_id,
                "codeType": code_type,
                "requirements": requirements,
                "language": language
            }
        )
        return result


class TeamCoordinatorAgent(Agent):
    """Agent that coordinates multiple practitioner agents"""
    
    def __init__(self, practitioners: List[PractitionerAgent], mcp_client: FuzzyDiscoMCPClient):
        super().__init__(name="team_coordinator")
        self.practitioners = practitioners
        self.mcp_client = mcp_client
        
    async def coordinate_code_review(self, code: str, language: str = "javascript") -> Dict[str, Any]:
        """Get parallel code reviews from all practitioners"""
        # Run analyses in parallel
        tasks = [
            practitioner.analyze_code(code, language)
            for practitioner in self.practitioners
        ]
        
        results = await asyncio.gather(*tasks)
        
        # Combine results
        combined_analysis = {
            "practitioners": {},
            "consensus": self._build_consensus(results),
            "action_items": self._extract_action_items(results)
        }
        
        for i, practitioner in enumerate(self.practitioners):
            combined_analysis["practitioners"][practitioner.style.name] = results[i]
            
        return combined_analysis
    
    async def plan_feature_development(self, feature_description: str, team_size: int) -> Dict[str, Any]:
        """Plan feature development with team coordination"""
        # First, select the best practitioner style
        style_result = await self.mcp_client.call_tool(
            "select_practitioner_style",
            {
                "taskType": "feature",
                "context": feature_description,
                "teamSize": team_size
            }
        )
        
        # Then coordinate the workflow
        workflow_result = await self.mcp_client.call_tool(
            "coordinate_team_workflow",
            {
                "workflow": "feature-development",
                "teamMembers": [p.style.name for p in self.practitioners[:team_size]],
                "priority": "medium"
            }
        )
        
        return {
            "recommended_style": style_result,
            "workflow_plan": workflow_result,
            "assigned_practitioners": self.practitioners[:team_size]
        }
    
    def _build_consensus(self, results: List[Dict]) -> Dict[str, Any]:
        """Build consensus from multiple practitioner analyses"""
        scores = []
        all_recommendations = []
        
        for result in results:
            if "overallScore" in result:
                scores.append(result["overallScore"])
            if "recommendations" in result:
                all_recommendations.extend(result["recommendations"])
                
        return {
            "average_score": sum(scores) / len(scores) if scores else 0,
            "top_recommendations": list(set(all_recommendations))[:5]
        }
    
    def _extract_action_items(self, results: List[Dict]) -> List[str]:
        """Extract unique action items from all analyses"""
        action_items = []
        
        for result in results:
            if "actionItems" in result:
                action_items.extend(result["actionItems"])
                
        return list(set(action_items))[:5]


# Practitioner definitions
PRACTITIONERS = [
    PractitionerStyle(
        name="Uncle Bob",
        style_id="uncle-bob",
        principles=["Clean Code", "SOLID", "TDD"],
        focus_areas=["clean-code", "naming", "functions"]
    ),
    PractitionerStyle(
        name="Martin Fowler",
        style_id="martin-fowler",
        principles=["Refactoring", "Patterns", "Architecture"],
        focus_areas=["refactoring", "patterns", "architecture"]
    ),
    PractitionerStyle(
        name="Kent Beck",
        style_id="kent-beck",
        principles=["Test-First", "Simple Design", "XP"],
        focus_areas=["testing", "simplicity", "incremental"]
    ),
    PractitionerStyle(
        name="Jessica Kerr",
        style_id="jessica-kerr",
        principles=["Systems Thinking", "Functional", "Observability"],
        focus_areas=["systems", "functional", "monitoring"]
    ),
    PractitionerStyle(
        name="Kelsey Hightower",
        style_id="kelsey-hightower",
        principles=["Cloud-Native", "Operations", "Automation"],
        focus_areas=["cloud", "operations", "reliability"]
    )
]


async def main():
    """Example usage of the MCP Agent integration"""
    
    # Initialize MCP client
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
        
        # Example 1: Parallel code review
        sample_code = """
        function processData(data) {
            var result = [];
            for (var i = 0; i < data.length; i++) {
                if (data[i] > 0) {
                    result.push(data[i] * 2);
                }
            }
            return result;
        }
        """
        
        print("=== Conducting Multi-Practitioner Code Review ===")
        review_results = await coordinator.coordinate_code_review(sample_code)
        print(json.dumps(review_results, indent=2))
        
        # Example 2: Feature planning
        print("\n=== Planning Feature Development ===")
        feature_plan = await coordinator.plan_feature_development(
            "Add user authentication with OAuth2",
            team_size=3
        )
        print(json.dumps(feature_plan, indent=2))
        
        # Example 3: Generate code with specific style
        print("\n=== Generating Code with Kent Beck's Style ===")
        kent_beck_agent = practitioner_agents[2]  # Kent Beck
        generated_code = await kent_beck_agent.generate_code(
            "UserService",
            "Handle user registration with email validation",
            "typescript"
        )
        print(json.dumps(generated_code, indent=2))
        
    finally:
        await mcp_client.close()


if __name__ == "__main__":
    asyncio.run(main())