#!/usr/bin/env python3
"""
Railway-compatible MCP Agent integration
Uses HTTP API instead of subprocess for cloud deployment
"""

import asyncio
import aiohttp
import json
import os
from typing import Dict, Any, List
from dataclasses import dataclass


@dataclass
class PractitionerStyle:
    name: str
    style_id: str
    principles: List[str]
    focus_areas: List[str]


# Practitioner definitions (standalone version)
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


class RailwayMCPClient:
    """MCP Client that connects to Railway HTTP API instead of subprocess"""
    
    def __init__(self, base_url: str = None):
        self.base_url = base_url or os.getenv(
            'RAILWAY_API_URL', 
            'https://fuzzy-disco-ai-production.up.railway.app'
        )
        self.session = None
    
    async def start(self):
        """Initialize HTTP session"""
        self.session = aiohttp.ClientSession()
        
        # Test connection
        try:
            async with self.session.get(f"{self.base_url}/health") as response:
                if response.status == 200:
                    print(f"✅ Connected to Railway API: {self.base_url}")
                else:
                    print(f"⚠️ Railway API responded with status {response.status}")
        except Exception as e:
            print(f"❌ Failed to connect to Railway API: {e}")
    
    async def call_tool(self, tool_name: str, arguments: Dict[str, Any]) -> Dict[str, Any]:
        """Call a tool via HTTP API"""
        if not self.session:
            await self.start()
        
        # Map tool names to API endpoints
        endpoint_map = {
            "select_practitioner_style": "/api/select-style",
            "generate_code_with_style": "/api/generate-code",
            "coordinate_team_workflow": "/api/coordinate-team",
            "analyze_code_quality": "/api/analyze-code"
        }
        
        endpoint = endpoint_map.get(tool_name)
        if not endpoint:
            raise Exception(f"Unknown tool: {tool_name}")
        
        url = f"{self.base_url}{endpoint}"
        
        try:
            async with self.session.post(url, json=arguments) as response:
                if response.status == 200:
                    result = await response.json()
                    return result
                else:
                    error_text = await response.text()
                    raise Exception(f"API Error {response.status}: {error_text}")
                    
        except Exception as e:
            raise Exception(f"HTTP request failed: {e}")
    
    async def close(self):
        """Close HTTP session"""
        if self.session:
            await self.session.close()


class RailwayPractitionerAgent:
    """Railway-compatible practitioner agent"""
    
    def __init__(self, practitioner_style: PractitionerStyle, railway_client: RailwayMCPClient):
        self.style = practitioner_style
        self.railway_client = railway_client
        self.name = f"{practitioner_style.name}_agent"
    
    async def analyze_code(self, code: str, language: str = "javascript") -> Dict[str, Any]:
        """Analyze code via Railway API"""
        result = await self.railway_client.call_tool(
            "analyze_code_quality",
            {
                "code": code,
                "language": language,
                "focusAreas": self.style.focus_areas
            }
        )
        return result
    
    async def generate_code(self, code_type: str, requirements: str, language: str = "typescript") -> Dict[str, Any]:
        """Generate code via Railway API"""
        result = await self.railway_client.call_tool(
            "generate_code_with_style",
            {
                "practitioner": self.style.style_id,
                "codeType": code_type,
                "requirements": requirements,
                "language": language
            }
        )
        return result


class RailwayTeamCoordinator:
    """Railway-compatible team coordinator"""
    
    def __init__(self, practitioners: List[RailwayPractitionerAgent], railway_client: RailwayMCPClient):
        self.practitioners = practitioners
        self.railway_client = railway_client
        self.name = "team_coordinator"
    
    async def coordinate_code_review(self, code: str, language: str = "javascript") -> Dict[str, Any]:
        """Coordinate parallel code review via Railway"""
        # Run analyses in parallel
        tasks = [
            practitioner.analyze_code(code, language)
            for practitioner in self.practitioners
        ]
        
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Handle any exceptions
        valid_results = []
        errors = []
        
        for i, result in enumerate(results):
            if isinstance(result, Exception):
                errors.append(f"{self.practitioners[i].style.name}: {str(result)}")
            else:
                valid_results.append(result)
        
        if not valid_results:
            return {
                "error": "All analyses failed",
                "errors": errors,
                "consensus": {"average_score": 0},
                "practitioners": {}
            }
        
        # Build consensus from valid results
        combined_analysis = {
            "practitioners": {},
            "consensus": self._build_consensus(valid_results),
            "action_items": self._extract_action_items(valid_results),
            "errors": errors if errors else None
        }
        
        for i, result in enumerate(valid_results):
            if i < len(self.practitioners):
                combined_analysis["practitioners"][self.practitioners[i].style.name] = result
        
        return combined_analysis
    
    async def plan_feature_development(self, feature_description: str, team_size: int) -> Dict[str, Any]:
        """Plan feature development via Railway"""
        try:
            # Select style
            style_result = await self.railway_client.call_tool(
                "select_practitioner_style",
                {
                    "taskType": "feature",
                    "context": feature_description,
                    "teamSize": team_size
                }
            )
            
            # Coordinate workflow
            workflow_result = await self.railway_client.call_tool(
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
                "assigned_practitioners": [p.style.name for p in self.practitioners[:team_size]]
            }
            
        except Exception as e:
            return {
                "error": f"Planning failed: {str(e)}",
                "recommended_style": None,
                "workflow_plan": None
            }
    
    def _build_consensus(self, results: List[Dict]) -> Dict[str, Any]:
        """Build consensus from multiple analyses"""
        scores = []
        all_recommendations = []
        
        for result in results:
            if isinstance(result, dict):
                if "overallScore" in result:
                    scores.append(result["overallScore"])
                if "recommendations" in result:
                    all_recommendations.extend(result["recommendations"])
        
        return {
            "average_score": sum(scores) / len(scores) if scores else 0,
            "top_recommendations": list(set(all_recommendations))[:5]
        }
    
    def _extract_action_items(self, results: List[Dict]) -> List[str]:
        """Extract action items from analyses"""
        action_items = []
        
        for result in results:
            if isinstance(result, dict) and "actionItems" in result:
                action_items.extend(result["actionItems"])
        
        return list(set(action_items))[:5]


async def railway_demo():
    """Demo the Railway MCP integration"""
    print("🚂 Railway MCP Agent Demo")
    print("=" * 30)
    
    # Initialize Railway client
    railway_client = RailwayMCPClient()
    await railway_client.start()
    
    try:
        # Test basic API call
        print("\n📡 Testing API Connection...")
        test_result = await railway_client.call_tool(
            "select_practitioner_style",
            {
                "taskType": "feature",
                "context": "Simple API endpoint",
                "teamSize": 2
            }
        )
        print(f"✅ API Test: {test_result.get('recommendation', {}).get('practitioner', 'Success')}")
        
        # Create agents
        railway_agents = [
            RailwayPractitionerAgent(style, railway_client)
            for style in PRACTITIONERS
        ]
        
        # Create coordinator
        coordinator = RailwayTeamCoordinator(railway_agents, railway_client)
        
        # Test code review
        print("\n🔍 Testing Code Review...")
        sample_code = """
        function processUser(user) {
            if (!user) return null;
            return {
                id: user.id,
                name: user.name || 'Anonymous',
                email: user.email
            };
        }
        """
        
        review_result = await coordinator.coordinate_code_review(sample_code)
        print(f"Overall Score: {review_result['consensus']['average_score']:.1f}")
        
        if review_result.get('errors'):
            print(f"⚠️ Some errors occurred: {review_result['errors']}")
        
        # Test feature planning
        print("\n📋 Testing Feature Planning...")
        feature_plan = await coordinator.plan_feature_development(
            "Add user authentication system", 
            team_size=3
        )
        
        if feature_plan.get('error'):
            print(f"❌ Planning error: {feature_plan['error']}")
        else:
            recommended = feature_plan.get('recommended_style', {})
            practitioner = recommended.get('recommendation', {}).get('practitioner', 'Unknown')
            print(f"Recommended Lead: {practitioner}")
        
        print("\n✅ Railway integration working!")
        
    except Exception as e:
        print(f"❌ Demo failed: {e}")
        
    finally:
        await railway_client.close()


if __name__ == "__main__":
    asyncio.run(railway_demo())