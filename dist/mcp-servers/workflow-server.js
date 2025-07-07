import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ErrorCode, ListToolsRequestSchema, McpError, } from "@modelcontextprotocol/sdk/types.js";
// Import our style modules
import { PractitionerStyleSelector } from "../styles/style-selector.js";
import { WorkflowEngine } from "../workflow/workflow-engine.js";
import { TeamCoordinator } from "../team/team-coordinator.js";
/**
 * MCP Server for AI-Enhanced Engineering Workflow
 *
 * This server provides intelligent tools for:
 * - Auto-style selection based on task context
 * - Team coordination and collaboration workflows
 * - Multi-practitioner engineering approaches
 * - Intelligent code generation and refactoring
 */
export class WorkflowMCPServer {
    server;
    styleSelector;
    workflowEngine;
    teamCoordinator;
    constructor() {
        this.server = new Server({
            name: "ai-workflow-server",
            version: "1.0.0",
            description: "AI-Enhanced Engineering Workflow Server",
        });
        this.styleSelector = new PractitionerStyleSelector();
        this.workflowEngine = new WorkflowEngine();
        this.teamCoordinator = new TeamCoordinator();
        this.setupTools();
    }
    setupTools() {
        // Tool: Auto-select practitioner style
        this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
            tools: [
                {
                    name: "select_practitioner_style",
                    description: "Automatically select the best practitioner style based on task context",
                    inputSchema: {
                        type: "object",
                        properties: {
                            taskType: {
                                type: "string",
                                description: "Type of task: feature, bug-fix, refactor, data-processing, infrastructure",
                                enum: ["feature", "bug-fix", "refactor", "data-processing", "infrastructure"]
                            },
                            context: {
                                type: "string",
                                description: "Additional context about the task"
                            },
                            teamSize: {
                                type: "number",
                                description: "Number of team members working on this task"
                            }
                        },
                        required: ["taskType"]
                    }
                },
                {
                    name: "generate_code_with_style",
                    description: "Generate code following a specific practitioner's style",
                    inputSchema: {
                        type: "object",
                        properties: {
                            practitioner: {
                                type: "string",
                                description: "Practitioner to emulate",
                                enum: ["fowler", "uncle-bob", "kent-beck", "jessica-kerr", "kelsey"]
                            },
                            codeType: {
                                type: "string",
                                description: "Type of code to generate"
                            },
                            requirements: {
                                type: "string",
                                description: "Specific requirements for the code"
                            },
                            language: {
                                type: "string",
                                description: "Programming language"
                            }
                        },
                        required: ["practitioner", "codeType", "requirements"]
                    }
                },
                {
                    name: "coordinate_team_workflow",
                    description: "Coordinate team workflows and task distribution",
                    inputSchema: {
                        type: "object",
                        properties: {
                            workflow: {
                                type: "string",
                                description: "Type of workflow to coordinate",
                                enum: ["feature-development", "bug-triage", "code-review", "deployment", "refactoring"]
                            },
                            teamMembers: {
                                type: "array",
                                items: { type: "string" },
                                description: "List of team members involved"
                            },
                            priority: {
                                type: "string",
                                enum: ["low", "medium", "high", "critical"],
                                description: "Priority level"
                            }
                        },
                        required: ["workflow"]
                    }
                },
                {
                    name: "analyze_code_quality",
                    description: "Analyze code quality using multiple practitioner perspectives",
                    inputSchema: {
                        type: "object",
                        properties: {
                            code: {
                                type: "string",
                                description: "Code to analyze"
                            },
                            language: {
                                type: "string",
                                description: "Programming language"
                            },
                            focusAreas: {
                                type: "array",
                                items: { type: "string" },
                                description: "Areas to focus on: clean-code, testing, design, performance, security"
                            }
                        },
                        required: ["code"]
                    }
                },
                {
                    name: "suggest_refactoring",
                    description: "Suggest refactoring improvements based on practitioner wisdom",
                    inputSchema: {
                        type: "object",
                        properties: {
                            code: {
                                type: "string",
                                description: "Code to refactor"
                            },
                            language: {
                                type: "string",
                                description: "Programming language"
                            },
                            goals: {
                                type: "array",
                                items: { type: "string" },
                                description: "Refactoring goals: maintainability, performance, readability, testability"
                            }
                        },
                        required: ["code"]
                    }
                }
            ]
        }));
        // Tool implementations
        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            const { name, arguments: args } = request.params;
            try {
                switch (name) {
                    case "select_practitioner_style":
                        return await this.handleStyleSelection(args);
                    case "generate_code_with_style":
                        return await this.handleCodeGeneration(args);
                    case "coordinate_team_workflow":
                        return await this.handleTeamCoordination(args);
                    case "analyze_code_quality":
                        return await this.handleCodeAnalysis(args);
                    case "suggest_refactoring":
                        return await this.handleRefactoringSuggestion(args);
                    default:
                        throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
                }
            }
            catch (error) {
                if (error instanceof McpError) {
                    throw error;
                }
                throw new McpError(ErrorCode.InternalError, `Tool execution failed: ${error}`);
            }
        });
    }
    async handleStyleSelection(args) {
        const { taskType, context, teamSize } = args;
        const selectedStyle = await this.styleSelector.selectOptimalStyle({
            taskType,
            context,
            teamSize
        });
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        recommendedPractitioner: selectedStyle.practitioner,
                        rationale: selectedStyle.rationale,
                        keyPrinciples: selectedStyle.keyPrinciples,
                        implementationGuidance: selectedStyle.implementationGuidance
                    }, null, 2)
                }
            ]
        };
    }
    async handleCodeGeneration(args) {
        const { practitioner, codeType, requirements, language } = args;
        const generatedCode = await this.workflowEngine.generateCodeWithStyle({
            practitioner,
            codeType,
            requirements,
            language
        });
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        code: generatedCode.code,
                        explanation: generatedCode.explanation,
                        practitionerPrinciples: generatedCode.appliedPrinciples,
                        testSuggestions: generatedCode.testSuggestions
                    }, null, 2)
                }
            ]
        };
    }
    async handleTeamCoordination(args) {
        const { workflow, teamMembers, priority } = args;
        const coordinationPlan = await this.teamCoordinator.coordinateWorkflow({
            workflow,
            teamMembers,
            priority
        });
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        workflowPlan: coordinationPlan.plan,
                        taskDistribution: coordinationPlan.taskDistribution,
                        timeline: coordinationPlan.timeline,
                        communicationPlan: coordinationPlan.communicationPlan
                    }, null, 2)
                }
            ]
        };
    }
    async handleCodeAnalysis(args) {
        const { code, language, focusAreas } = args;
        const analysis = await this.workflowEngine.analyzeCodeQuality({
            code,
            language,
            focusAreas
        });
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        overallScore: analysis.overallScore,
                        practitionerFeedback: analysis.practitionerFeedback,
                        improvements: analysis.improvements,
                        strengths: analysis.strengths,
                        warnings: analysis.warnings
                    }, null, 2)
                }
            ]
        };
    }
    async handleRefactoringSuggestion(args) {
        const { code, language, goals } = args;
        const suggestions = await this.workflowEngine.suggestRefactoring({
            code,
            language,
            goals
        });
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        refactoredCode: suggestions.refactoredCode,
                        changes: suggestions.changes,
                        rationale: suggestions.rationale,
                        practitionerWisdom: suggestions.practitionerWisdom,
                        testImpact: suggestions.testImpact
                    }, null, 2)
                }
            ]
        };
    }
    async run() {
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
        console.error("AI Workflow MCP Server running on stdio");
        // Keep the process alive
        process.on('SIGINT', async () => {
            console.error("Shutting down MCP server...");
            await this.server.close();
            process.exit(0);
        });
        process.on('SIGTERM', async () => {
            console.error("Shutting down MCP server...");
            await this.server.close();
            process.exit(0);
        });
    }
}
// Run the server if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    const server = new WorkflowMCPServer();
    server.run().catch(console.error);
}
