#!/usr/bin/env python3
"""
Fuzzy Disco AI Agents using real MCP Agent framework
"""

import asyncio
import time
from typing import List, Dict, Any

from mcp_agent.app import MCPApp
from mcp_agent.agents.agent import Agent
from mcp_agent.workflows.llm.augmented_llm_anthropic import AnthropicAugmentedLLM
from mcp_agent.workflows.llm.augmented_llm_openai import OpenAIAugmentedLLM
from mcp_agent.workflows.parallel.parallel_llm import ParallelLLM


class PractitionerAgent:
    """Agent representing a software engineering practitioner"""
    
    def __init__(self, name: str, style_id: str, principles: List[str], focus_areas: List[str]):
        self.name = name
        self.style_id = style_id
        self.principles = principles
        self.focus_areas = focus_areas
        self.agent = None
        
    async def initialize(self, agent_app) -> Agent:
        """Initialize the MCP agent"""
        instruction = f"""You are {self.name}, a software engineering expert.
        
Your core principles: {', '.join(self.principles)}
Your focus areas: {', '.join(self.focus_areas)}

You have access to fuzzy_disco MCP server which provides these tools:
- select_practitioner_style: Choose the best approach for a task
- generate_code_with_style: Generate code following your specific style
- coordinate_team_workflow: Plan team coordination
- analyze_code_quality: Analyze code from your perspective

Always apply your expertise and principles when using these tools or providing advice.
Use the tools when appropriate to demonstrate your methodology."""

        self.agent = Agent(
            name=f"{self.name.lower().replace(' ', '_')}_agent",
            instruction=instruction,
            server_names=["fuzzy_disco"],
        )
        
        return self.agent
        
    async def analyze_code(self, code: str, language: str = "javascript") -> str:
        """Analyze code from this practitioner's perspective"""
        if not self.agent:
            raise RuntimeError("Agent not initialized")
            
        llm = await self.agent.attach_llm(AnthropicAugmentedLLM)
        
        prompt = f"""Analyze this {language} code from {self.name}'s perspective:

```{language}
{code}
```

Focus on: {', '.join(self.focus_areas)}
Apply principles: {', '.join(self.principles)}

Use the analyze_code_quality tool if helpful, then provide your expert analysis."""
        
        return await llm.generate_str(message=prompt)
        
    async def generate_code_solution(self, requirements: str, code_type: str = "function") -> str:
        """Generate code following this practitioner's style"""
        if not self.agent:
            raise RuntimeError("Agent not initialized")
            
        llm = await self.agent.attach_llm(AnthropicAugmentedLLM)
        
        prompt = f"""Generate a {code_type} that meets these requirements:
{requirements}

Apply {self.name}'s methodology:
- Principles: {', '.join(self.principles)}
- Focus on: {', '.join(self.focus_areas)}

Use the generate_code_with_style tool with practitioner="{self.style_id}" to get a foundation,
then enhance it with your expertise and explain your design decisions."""
        
        return await llm.generate_str(message=prompt)


class TeamCoordinatorAgent:
    """Agent that coordinates multiple practitioner perspectives"""
    
    def __init__(self, practitioners: List[PractitionerAgent]):
        self.practitioners = practitioners
        self.agent = None
        
    async def initialize(self, agent_app) -> Agent:
        """Initialize the team coordinator agent"""
        practitioner_names = [p.name for p in self.practitioners]
        
        instruction = f"""You are a Technical Team Lead coordinating multiple software engineering experts:
{', '.join(practitioner_names)}

Your role is to:
1. Orchestrate multi-practitioner code reviews
2. Build consensus on design decisions  
3. Plan feature development with optimal team assignments
4. Resolve conflicts between different approaches

You have access to fuzzy_disco MCP server tools and can coordinate with team members
to get their perspectives and build comprehensive solutions."""

        self.agent = Agent(
            name="team_coordinator",
            instruction=instruction,
            server_names=["fuzzy_disco"],
        )
        
        return self.agent
        
    async def coordinate_code_review(self, code: str, language: str = "javascript") -> str:
        """Get comprehensive code review from all practitioners"""
        if not self.agent:
            raise RuntimeError("Agent not initialized")
            
        # Get all practitioner analyses in parallel
        analysis_tasks = [
            p.analyze_code(code, language) for p in self.practitioners
        ]
        
        analyses = await asyncio.gather(*analysis_tasks)
        
        # Combine perspectives
        llm = await self.agent.attach_llm(AnthropicAugmentedLLM)
        
        combined_analysis = "\n\n".join([
            f"=== {p.name} Analysis ===\n{analysis}"
            for p, analysis in zip(self.practitioners, analyses)
        ])
        
        prompt = f"""Here are the individual analyses from our team of experts:

{combined_analysis}

As the team lead, synthesize these perspectives into:
1. Overall code quality score (1-10)
2. Top 3 consensus recommendations  
3. Any conflicting opinions and how to resolve them
4. Prioritized action plan

Use the analyze_code_quality tool for additional insight, then provide your team synthesis."""
        
        return await llm.generate_str(message=prompt)
        
    async def plan_feature_development(self, feature_description: str, team_size: int = 3) -> str:
        """Plan feature development with team coordination"""
        if not self.agent:
            raise RuntimeError("Agent not initialized")
            
        llm = await self.agent.attach_llm(AnthropicAugmentedLLM)
        
        prompt = f"""Plan the development of this feature:
{feature_description}

Team size: {team_size}
Available practitioners: {', '.join([p.name for p in self.practitioners])}

Use the fuzzy_disco tools to:
1. select_practitioner_style to choose the best lead approach
2. coordinate_team_workflow to plan the execution

Then provide:
- Recommended team lead and approach
- Phase-by-phase development plan
- Risk assessment and mitigation
- Definition of done criteria"""
        
        return await llm.generate_str(message=prompt)


class ParallelWorkflowEngine:
    """Engine for running parallel multi-agent workflows"""
    
    def __init__(self, practitioners: List[PractitionerAgent]):
        self.practitioners = practitioners
        self.agent = None
        
    async def initialize(self, agent_app) -> Agent:
        """Initialize the workflow engine"""
        self.agent = Agent(
            name="workflow_engine",
            instruction="""You are a Workflow Orchestrator for software engineering tasks.
            You coordinate complex multi-agent workflows and synthesize results.""",
            server_names=["fuzzy_disco"],
        )
        return self.agent
        
    async def run_design_consensus_workflow(self, design_question: str) -> str:
        """Run parallel design consensus workflow"""
        if not self.agent:
            raise RuntimeError("Agent not initialized")
            
        # Get design perspectives from all practitioners in parallel  
        design_tasks = []
        for practitioner in self.practitioners:
            if practitioner.agent:
                llm = await practitioner.agent.attach_llm(AnthropicAugmentedLLM)
                task = llm.generate_str(
                    message=f"""From {practitioner.name}'s perspective, how would you approach this design challenge?

{design_question}

Consider your principles: {', '.join(practitioner.principles)}
Focus on: {', '.join(practitioner.focus_areas)}

Provide specific design recommendations."""
                )
                design_tasks.append(task)
        
        perspectives = await asyncio.gather(*design_tasks)
        
        # Build consensus
        llm = await self.agent.attach_llm(AnthropicAugmentedLLM)
        
        all_perspectives = "\n\n".join([
            f"=== {p.name} Perspective ===\n{perspective}"
            for p, perspective in zip(self.practitioners, perspectives)
        ])
        
        consensus_prompt = f"""Design Question: {design_question}

Here are the perspectives from our engineering team:

{all_perspectives}

As the workflow orchestrator, build consensus by:
1. Identifying common principles and approaches
2. Highlighting unique valuable insights
3. Resolving any conflicting recommendations  
4. Proposing a unified design approach that incorporates the best ideas
5. Creating an implementation roadmap

Provide a comprehensive design consensus document."""
        
        return await llm.generate_str(message=consensus_prompt)


# Practitioner definitions
PRACTITIONERS_CONFIG = [
    {
        "name": "Uncle Bob",
        "style_id": "uncle-bob", 
        "principles": ["Clean Code", "SOLID Principles", "Test-Driven Development"],
        "focus_areas": ["clean-code", "naming", "functions", "testing"]
    },
    {
        "name": "Martin Fowler",
        "style_id": "martin-fowler",
        "principles": ["Refactoring", "Enterprise Patterns", "Evolutionary Architecture"],  
        "focus_areas": ["refactoring", "patterns", "architecture", "maintainability"]
    },
    {
        "name": "Kent Beck",
        "style_id": "kent-beck",
        "principles": ["Test-First", "Simple Design", "Extreme Programming"],
        "focus_areas": ["testing", "simplicity", "incremental", "feedback"]
    },
    {
        "name": "Jessica Kerr",
        "style_id": "jessica-kerr", 
        "principles": ["Systems Thinking", "Functional Programming", "Observability"],
        "focus_areas": ["systems", "functional", "monitoring", "emergence"]
    },
    {
        "name": "Kelsey Hightower", 
        "style_id": "kelsey-hightower",
        "principles": ["Cloud-Native", "Operational Excellence", "Automation"],
        "focus_areas": ["cloud", "operations", "reliability", "scalability"]
    }
]


async def demo_fuzzy_disco_agents():
    """Demo the Fuzzy Disco AI agents using real MCP Agent framework"""
    
    print("🚀 Fuzzy Disco AI - MCP Agent Integration Demo")
    print("=" * 50)
    
    # Initialize MCP App
    app = MCPApp(name="fuzzy_disco_ai")
    
    async with app.run() as agent_app:
        logger = agent_app.logger
        
        # Create practitioner agents
        practitioners = [
            PractitionerAgent(**config) for config in PRACTITIONERS_CONFIG
        ]
        
        # Initialize all agents
        for practitioner in practitioners:
            await practitioner.initialize(agent_app)
            
        # Create team coordinator
        coordinator = TeamCoordinatorAgent(practitioners)
        await coordinator.initialize(agent_app)
        
        # Create workflow engine
        workflow_engine = ParallelWorkflowEngine(practitioners)
        await workflow_engine.initialize(agent_app)
        
        logger.info("All agents initialized successfully")
        
        # Demo 1: Single practitioner code generation
        print("\n=== Demo 1: Uncle Bob Code Generation ===")
        uncle_bob = practitioners[0]
        
        async with uncle_bob.agent:
            result = await uncle_bob.generate_code_solution(
                "Create a user service that handles registration with email validation",
                "class"
            )
            print("Uncle Bob's Solution:")
            print(result[:500] + "..." if len(result) > 500 else result)
        
        # Demo 2: Team code review
        print("\n=== Demo 2: Team Code Review ===")
        sample_code = """
function processUsers(users) {
    var results = [];
    for (var i = 0; i < users.length; i++) {
        if (users[i].age > 18 && users[i].active) {
            results.push({
                id: users[i].id,
                name: users[i].name,
                email: users[i].email,
                status: 'processed'
            });
        }
    }
    return results;
}
        """
        
        # Initialize all practitioner agents
        for practitioner in practitioners:
            async with practitioner.agent:
                pass  # Just initialize connections
        
        async with coordinator.agent:
            review_result = await coordinator.coordinate_code_review(sample_code)
            print("Team Review Result:")
            print(review_result[:500] + "..." if len(review_result) > 500 else review_result)
            
        # Demo 3: Design consensus workflow
        print("\n=== Demo 3: Design Consensus Workflow ===")
        async with workflow_engine.agent:
            consensus_result = await workflow_engine.run_design_consensus_workflow(
                "How should we design a real-time chat system with presence indicators, message persistence, and horizontal scalability?"
            )
            print("Design Consensus:")
            print(consensus_result[:500] + "..." if len(consensus_result) > 500 else consensus_result)


if __name__ == "__main__":
    start = time.time()
    asyncio.run(demo_fuzzy_disco_agents())
    end = time.time()
    print(f"\nTotal runtime: {end - start:.2f}s")