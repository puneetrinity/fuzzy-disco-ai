#!/usr/bin/env python3
"""
Team Simulation Example
Simulates a software development team using different practitioner agents
"""

import asyncio
import json
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from workflows import AdvancedWorkflowEngine, WorkflowType
from mcp_agent_integration import FuzzyDiscoMCPClient


class TeamSimulator:
    """Simulates various team scenarios and workflows"""
    
    def __init__(self):
        self.mcp_client = None
        self.workflow_engine = None
    
    async def initialize(self):
        """Initialize the simulation environment"""
        self.mcp_client = FuzzyDiscoMCPClient()
        await self.mcp_client.start()
        self.workflow_engine = AdvancedWorkflowEngine(self.mcp_client)
    
    async def simulate_sprint_planning(self, user_stories: list):
        """Simulate a sprint planning session"""
        print("🏃 Sprint Planning Simulation")
        print("=" * 40)
        
        for i, story in enumerate(user_stories, 1):
            print(f"\nUser Story {i}: {story}")
            
            # Get style recommendation
            style_result = await self.mcp_client.call_tool(
                "select_practitioner_style",
                {
                    "taskType": "feature",
                    "context": story,
                    "teamSize": 3
                }
            )
            
            print(f"Recommended Lead: {style_result['recommendation']['practitioner']}")
            print(f"Approach: {style_result['recommendation']['approach']}")
            
            # Plan the workflow
            workflow_plan = await self.mcp_client.call_tool(
                "coordinate_team_workflow",
                {
                    "workflow": "feature-development",
                    "teamMembers": ["Developer", "Tester", "DevOps"],
                    "priority": "medium"
                }
            )
            
            print(f"Estimated Duration: {workflow_plan['coordination']['estimatedDuration']}")
            print("Key Tasks:")
            for task in workflow_plan['coordination']['tasks'][:3]:
                print(f"  - {task['phase']}: {task['description'][:60]}...")
    
    async def simulate_code_review_meeting(self, code_samples: dict):
        """Simulate a team code review meeting"""
        print("\n👥 Code Review Meeting Simulation")
        print("=" * 40)
        
        for filename, code in code_samples.items():
            print(f"\nReviewing: {filename}")
            
            # Run parallel review
            review_result = await self.workflow_engine.run_parallel_review_workflow(code)
            
            print(f"Overall Score: {review_result.consensus['average_score']:.1f}/100")
            
            if review_result.consensus['critical_issues']:
                print("🚨 Critical Issues Found:")
                for issue in review_result.consensus['critical_issues']:
                    print(f"  - {issue}")
            
            print("Team Consensus:")
            for rec in review_result.consensus['unanimous_recommendations'][:3]:
                print(f"  ✓ {rec}")
                
            print("Next Steps:")
            for step in review_result.next_steps:
                print(f"  → {step}")
    
    async def simulate_architecture_discussion(self, project_description: str):
        """Simulate an architecture design discussion"""
        print("\n🏗️ Architecture Discussion Simulation")
        print("=" * 40)
        
        print(f"Project: {project_description}")
        
        # Run consensus building workflow
        consensus_result = await self.workflow_engine.run_consensus_building_workflow(
            f"Architecture design for: {project_description}"
        )
        
        print("\nPractitioner Perspectives:")
        for practitioner, perspective in consensus_result.results.items():
            print(f"\n{practitioner}:")
            print(f"  Focus: {', '.join(perspective.get('principles', [])[:2])}")
            print(f"  Reasoning: {perspective['reasoning']}")
        
        print(f"\nConsensus Reached: {'Yes' if consensus_result.consensus['unanimous_agreement'] else 'Partial'}")
        print(f"Recommendation: {consensus_result.consensus['recommendation']}")
        
        if consensus_result.consensus['common_principles']:
            print("\nAgreed Principles:")
            for principle, count in consensus_result.consensus['common_principles'][:3]:
                print(f"  - {principle} (agreed by {count} practitioners)")
    
    async def simulate_bug_triage(self, bug_reports: list):
        """Simulate bug triage and assignment"""
        print("\n🐛 Bug Triage Simulation")
        print("=" * 40)
        
        for bug in bug_reports:
            print(f"\nBug: {bug['title']}")
            print(f"Severity: {bug['severity']} | Priority: {bug['priority']}")
            
            # Get practitioner recommendation
            style_result = await self.mcp_client.call_tool(
                "select_practitioner_style",
                {
                    "taskType": "bug-fix",
                    "context": bug['description'],
                    "teamSize": 1
                }
            )
            
            print(f"Assigned to: {style_result['recommendation']['practitioner']}")
            print(f"Approach: {style_result['recommendation']['approach']}")
            
            # Get workflow coordination
            workflow = await self.mcp_client.call_tool(
                "coordinate_team_workflow",
                {
                    "workflow": "bug-fix",
                    "priority": bug['priority']
                }
            )
            
            print(f"Estimated Time: {workflow['coordination']['estimatedDuration']}")
    
    async def cleanup(self):
        """Cleanup simulation resources"""
        if self.mcp_client:
            await self.mcp_client.close()


async def run_team_simulations():
    """Run various team simulation scenarios"""
    
    simulator = TeamSimulator()
    await simulator.initialize()
    
    try:
        # Scenario 1: Sprint Planning
        user_stories = [
            "As a user, I want to reset my password via email",
            "As an admin, I want to view user activity analytics",
            "As a developer, I want API rate limiting to prevent abuse"
        ]
        
        await simulator.simulate_sprint_planning(user_stories)
        
        # Scenario 2: Code Review Meeting
        code_samples = {
            "user_service.js": """
            function createUser(userData) {
                if (!userData.email) return null;
                const user = {
                    id: Date.now(),
                    email: userData.email,
                    created: new Date()
                };
                users.push(user);
                return user;
            }
            """,
            "auth_middleware.js": """
            function authMiddleware(req, res, next) {
                const token = req.headers.authorization;
                if (token && token.startsWith('Bearer ')) {
                    req.user = { id: 1 }; // Simplified
                    next();
                } else {
                    res.status(401).send('Unauthorized');
                }
            }
            """
        }
        
        await simulator.simulate_code_review_meeting(code_samples)
        
        # Scenario 3: Architecture Discussion
        await simulator.simulate_architecture_discussion(
            "E-commerce platform with microservices, real-time inventory, and mobile app support"
        )
        
        # Scenario 4: Bug Triage
        bug_reports = [
            {
                "title": "Memory leak in user session management",
                "description": "Sessions not being cleaned up properly",
                "severity": "High",
                "priority": "critical"
            },
            {
                "title": "UI button not responsive on mobile",
                "description": "Submit button doesn't work on iOS Safari",
                "severity": "Medium", 
                "priority": "medium"
            }
        ]
        
        await simulator.simulate_bug_triage(bug_reports)
        
    finally:
        await simulator.cleanup()


if __name__ == "__main__":
    asyncio.run(run_team_simulations())