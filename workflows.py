#!/usr/bin/env python3
"""
Advanced workflow patterns using MCP agents
"""

import asyncio
from typing import Dict, List, Any
from dataclasses import dataclass
from enum import Enum
from mcp_agent_integration import PractitionerAgent, TeamCoordinatorAgent, FuzzyDiscoMCPClient, PRACTITIONERS


class WorkflowType(Enum):
    PARALLEL_REVIEW = "parallel_review"
    SEQUENTIAL_IMPROVEMENT = "sequential_improvement" 
    CONSENSUS_BUILDING = "consensus_building"
    COLLABORATIVE_DESIGN = "collaborative_design"


@dataclass
class WorkflowResult:
    workflow_type: WorkflowType
    participants: List[str]
    results: Dict[str, Any]
    consensus: Dict[str, Any]
    next_steps: List[str]


class AdvancedWorkflowEngine:
    """Engine for running complex multi-agent workflows"""
    
    def __init__(self, mcp_client: FuzzyDiscoMCPClient):
        self.mcp_client = mcp_client
        self.practitioners = [
            PractitionerAgent(style, mcp_client)
            for style in PRACTITIONERS
        ]
        self.coordinator = TeamCoordinatorAgent(self.practitioners, mcp_client)
    
    async def run_parallel_review_workflow(self, code: str, focus_areas: List[str] = None) -> WorkflowResult:
        """Run parallel code review by all practitioners"""
        
        # All practitioners analyze simultaneously
        tasks = []
        for practitioner in self.practitioners:
            if focus_areas:
                # Override focus areas for this analysis
                original_areas = practitioner.style.focus_areas
                practitioner.style.focus_areas = focus_areas
                
            task = practitioner.analyze_code(code, "javascript")
            tasks.append(task)
            
        results = await asyncio.gather(*tasks)
        
        # Build consensus
        scores = []
        recommendations = set()
        critical_issues = []
        
        for i, result in enumerate(results):
            practitioner_name = self.practitioners[i].style.name
            
            if "overallScore" in result:
                scores.append(result["overallScore"])
                
            if "recommendations" in result:
                for rec in result["recommendations"]:
                    recommendations.add(rec)
                    
            # Identify critical issues (low scores)
            if result.get("overallScore", 100) < 50:
                critical_issues.append(f"{practitioner_name} identified critical issues")
                
        consensus = {
            "average_score": sum(scores) / len(scores) if scores else 0,
            "unanimous_recommendations": list(recommendations),
            "critical_issues": critical_issues,
            "review_complete": True
        }
        
        next_steps = []
        if consensus["average_score"] < 60:
            next_steps.append("Immediate refactoring required")
        if critical_issues:
            next_steps.append("Address critical issues before deployment")
        if not next_steps:
            next_steps.append("Code review passed - ready for testing")
            
        return WorkflowResult(
            workflow_type=WorkflowType.PARALLEL_REVIEW,
            participants=[p.style.name for p in self.practitioners],
            results={p.style.name: results[i] for i, p in enumerate(self.practitioners)},
            consensus=consensus,
            next_steps=next_steps
        )
    
    async def run_sequential_improvement_workflow(self, code: str, target_score: int = 80) -> WorkflowResult:
        """Run sequential code improvement until target score is reached"""
        
        current_code = code
        iterations = []
        max_iterations = 5
        
        for iteration in range(max_iterations):
            # Get current state analysis
            analysis = await self.coordinator.coordinate_code_review(current_code)
            current_score = analysis["consensus"]["average_score"]
            
            print(f"Iteration {iteration + 1}: Score = {current_score}")
            
            if current_score >= target_score:
                break
                
            # Find the practitioner best suited for the main issue
            worst_areas = self._identify_worst_areas(analysis)
            best_practitioner = self._select_improvement_practitioner(worst_areas)
            
            # Generate improved code
            improvement_task = self._determine_improvement_task(worst_areas)
            
            improved = await best_practitioner.generate_code(
                improvement_task["type"],
                improvement_task["requirements"],
                "javascript"
            )
            
            iterations.append({
                "iteration": iteration + 1,
                "score_before": current_score,
                "practitioner": best_practitioner.style.name,
                "improvements": worst_areas,
                "generated_code": improved.get("generatedCode", "")
            })
            
            # For demo purposes, we'll simulate improvement
            # In reality, you'd parse and apply the suggested changes
            current_code = self._simulate_code_improvement(current_code, improved)
            
        final_analysis = await self.coordinator.coordinate_code_review(current_code)
        final_score = final_analysis["consensus"]["average_score"]
        
        return WorkflowResult(
            workflow_type=WorkflowType.SEQUENTIAL_IMPROVEMENT,
            participants=[iter_data["practitioner"] for iter_data in iterations],
            results={
                "iterations": iterations,
                "final_code": current_code,
                "initial_score": analysis["consensus"]["average_score"] if iterations else 0,
                "final_score": final_score,
                "improvement": final_score - (iterations[0]["score_before"] if iterations else 0)
            },
            consensus=final_analysis["consensus"],
            next_steps=["Code improvement complete", f"Final score: {final_score}"]
        )
    
    async def run_consensus_building_workflow(self, design_question: str) -> WorkflowResult:
        """Build consensus on design decisions across practitioners"""
        
        # Each practitioner provides their perspective
        perspectives = {}
        
        for practitioner in self.practitioners:
            # Generate design approach from this practitioner's viewpoint
            design_response = await practitioner.generate_code(
                "DesignPattern",
                f"Design approach for: {design_question}",
                "typescript"
            )
            
            perspectives[practitioner.style.name] = {
                "approach": design_response.get("generatedCode", ""),
                "principles": design_response.get("principles", []),
                "reasoning": f"Based on {practitioner.style.name}'s methodology"
            }
        
        # Find common ground
        all_principles = []
        for perspective in perspectives.values():
            all_principles.extend(perspective.get("principles", []))
            
        common_principles = []
        for principle in set(all_principles):
            count = all_principles.count(principle)
            if count >= 2:  # At least 2 practitioners agree
                common_principles.append((principle, count))
                
        consensus = {
            "common_principles": sorted(common_principles, key=lambda x: x[1], reverse=True),
            "unanimous_agreement": len(common_principles) > 3,
            "design_approaches": len(perspectives),
            "recommendation": self._build_consensus_recommendation(perspectives, common_principles)
        }
        
        return WorkflowResult(
            workflow_type=WorkflowType.CONSENSUS_BUILDING,
            participants=list(perspectives.keys()),
            results=perspectives,
            consensus=consensus,
            next_steps=[
                "Review consensus recommendation",
                "Implement agreed-upon principles",
                "Document design decisions"
            ]
        )
    
    async def run_collaborative_design_workflow(self, project_requirements: str) -> WorkflowResult:
        """Collaborative design session with role-specific contributions"""
        
        # Phase 1: Architecture (Martin Fowler leads)
        fowler_agent = next(p for p in self.practitioners if p.style.name == "Martin Fowler")
        architecture = await fowler_agent.generate_code(
            "SystemArchitecture", 
            f"System architecture for: {project_requirements}",
            "typescript"
        )
        
        # Phase 2: Testing Strategy (Kent Beck leads)
        beck_agent = next(p for p in self.practitioners if p.style.name == "Kent Beck")
        testing_strategy = await beck_agent.generate_code(
            "TestStrategy",
            f"Testing approach for: {project_requirements}",
            "typescript"
        )
        
        # Phase 3: Clean Implementation (Uncle Bob leads)
        bob_agent = next(p for p in self.practitioners if p.style.name == "Uncle Bob")
        clean_implementation = await bob_agent.generate_code(
            "CleanImplementation",
            f"Clean code structure for: {project_requirements}",
            "typescript"
        )
        
        # Phase 4: Operational Excellence (Kelsey leads)
        kelsey_agent = next(p for p in self.practitioners if p.style.name == "Kelsey Hightower")
        operations = await kelsey_agent.generate_code(
            "OperationalSetup",
            f"Production-ready setup for: {project_requirements}",
            "typescript"
        )
        
        # Phase 5: Systems Integration (Jessica leads)
        jessica_agent = next(p for p in self.practitioners if p.style.name == "Jessica Kerr")
        systems_design = await jessica_agent.generate_code(
            "SystemsIntegration",
            f"Systems integration for: {project_requirements}",
            "typescript"
        )
        
        collaborative_result = {
            "architecture": architecture,
            "testing": testing_strategy,
            "implementation": clean_implementation,
            "operations": operations,
            "systems": systems_design
        }
        
        # Final coordination
        coordination_plan = await self.mcp_client.call_tool(
            "coordinate_team_workflow",
            {
                "workflow": "feature-development",
                "teamMembers": [p.style.name for p in self.practitioners],
                "priority": "high"
            }
        )
        
        consensus = {
            "design_complete": True,
            "phases_covered": 5,
            "coordination_plan": coordination_plan,
            "ready_for_implementation": True
        }
        
        return WorkflowResult(
            workflow_type=WorkflowType.COLLABORATIVE_DESIGN,
            participants=[p.style.name for p in self.practitioners],
            results=collaborative_result,
            consensus=consensus,
            next_steps=[
                "Begin implementation following the design",
                "Set up CI/CD pipeline",
                "Create initial test suite",
                "Establish monitoring and observability"
            ]
        )
    
    def _identify_worst_areas(self, analysis: Dict) -> List[str]:
        """Identify areas that need the most improvement"""
        worst_areas = []
        
        # Check practitioner analyses for common issues
        for practitioner, result in analysis["practitioners"].items():
            if result.get("overallScore", 100) < 60:
                worst_areas.extend(result.get("recommendations", []))
                
        return list(set(worst_areas))[:3]  # Top 3 issues
    
    def _select_improvement_practitioner(self, issues: List[str]) -> PractitionerAgent:
        """Select the best practitioner to address the issues"""
        # Simple heuristic: match issues to practitioner strengths
        if any("test" in issue.lower() for issue in issues):
            return next(p for p in self.practitioners if p.style.name == "Kent Beck")
        elif any("complex" in issue.lower() or "refactor" in issue.lower() for issue in issues):
            return next(p for p in self.practitioners if p.style.name == "Martin Fowler")
        elif any("clean" in issue.lower() or "naming" in issue.lower() for issue in issues):
            return next(p for p in self.practitioners if p.style.name == "Uncle Bob")
        else:
            return self.practitioners[0]  # Default to Uncle Bob
    
    def _determine_improvement_task(self, issues: List[str]) -> Dict[str, str]:
        """Determine what type of code to generate for improvement"""
        if any("test" in issue.lower() for issue in issues):
            return {
                "type": "TestSuite",
                "requirements": f"Add comprehensive tests to address: {', '.join(issues)}"
            }
        else:
            return {
                "type": "RefactoredCode",
                "requirements": f"Refactor to improve: {', '.join(issues)}"
            }
    
    def _simulate_code_improvement(self, original_code: str, improvement: Dict) -> str:
        """Simulate code improvement (placeholder for real implementation)"""
        # In a real implementation, you would parse the improvement suggestions
        # and apply them to the code. For demo purposes, we'll add a comment.
        return original_code + f"\n// Improved based on {improvement.get('practitioner', 'unknown')} suggestions"
    
    def _build_consensus_recommendation(self, perspectives: Dict, common_principles: List) -> str:
        """Build a consensus recommendation from multiple perspectives"""
        if not common_principles:
            return "No clear consensus reached. Consider further discussion."
            
        top_principles = [p[0] for p in common_principles[:3]]
        return f"Recommended approach should incorporate: {', '.join(top_principles)}"


async def demo_advanced_workflows():
    """Demonstrate advanced workflow patterns"""
    
    mcp_client = FuzzyDiscoMCPClient()
    await mcp_client.start()
    
    try:
        engine = AdvancedWorkflowEngine(mcp_client)
        
        # Demo code for analysis
        demo_code = """
        var users = [];
        function addUser(name, email) {
            if (name && email) {
                users.push({name: name, email: email, id: users.length + 1});
                return true;
            }
            return false;
        }
        
        function getUser(id) {
            for (var i = 0; i < users.length; i++) {
                if (users[i].id == id) {
                    return users[i];
                }
            }
            return null;
        }
        """
        
        print("=== Demo 1: Parallel Review Workflow ===")
        parallel_result = await engine.run_parallel_review_workflow(demo_code)
        print(f"Consensus Score: {parallel_result.consensus['average_score']}")
        print(f"Next Steps: {parallel_result.next_steps}")
        
        print("\n=== Demo 2: Sequential Improvement Workflow ===")
        sequential_result = await engine.run_sequential_improvement_workflow(demo_code, target_score=75)
        print(f"Improvement: {sequential_result.results.get('improvement', 0)} points")
        print(f"Final Score: {sequential_result.results.get('final_score', 0)}")
        
        print("\n=== Demo 3: Consensus Building Workflow ===")
        consensus_result = await engine.run_consensus_building_workflow(
            "How should we handle user authentication in a microservices architecture?"
        )
        print(f"Common Principles: {[p[0] for p in consensus_result.consensus['common_principles'][:3]]}")
        
        print("\n=== Demo 4: Collaborative Design Workflow ===")
        design_result = await engine.run_collaborative_design_workflow(
            "Build a real-time chat application with user presence, message history, and file sharing"
        )
        print(f"Design Phases: {design_result.consensus['phases_covered']}")
        print(f"Ready for Implementation: {design_result.consensus['ready_for_implementation']}")
        
    finally:
        await mcp_client.close()


if __name__ == "__main__":
    asyncio.run(demo_advanced_workflows())