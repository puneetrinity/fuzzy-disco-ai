#!/usr/bin/env node

// Railway MCP Client - Direct API integration
import fetch from 'node-fetch';
import readline from 'readline';

class RailwayMCPClient {
  constructor() {
    this.apiUrl = 'https://fuzzy-disco-ai-production.up.railway.app';
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  async initialize() {
    console.log('🚀 Railway MCP Client starting...');
    
    try {
      // Test connection
      const response = await fetch(`${this.apiUrl}/health`);
      const data = await response.json();
      console.log(`✅ Connected to Railway server: ${data.status}`);
      
      // Get available tools
      await this.listTools();
      
      // Start interactive session
      this.startInteractiveSession();
      
    } catch (error) {
      console.error('❌ Failed to connect to Railway server:', error.message);
      process.exit(1);
    }
  }

  async listTools() {
    console.log('\n🔧 Available AI Tools:');
    
    const tools = [
      {
        name: 'select_practitioner_style',
        description: 'Auto-select best practitioner style for task',
        usage: 'select-style [feature|bug-fix|refactor|data-processing|infrastructure]'
      },
      {
        name: 'generate_code_with_style', 
        description: 'Generate code following practitioner principles',
        usage: 'generate-code [practitioner] [codeType] [requirements]'
      },
      {
        name: 'coordinate_team_workflow',
        description: 'AI-powered team coordination',
        usage: 'coordinate-team [workflow] [teamMembers...]'
      },
      {
        name: 'analyze_code_quality',
        description: 'Multi-perspective code analysis',
        usage: 'analyze-code [code]'
      }
    ];

    tools.forEach((tool, index) => {
      console.log(`${index + 1}. ${tool.name}: ${tool.description}`);
      console.log(`   Usage: ${tool.usage}`);
    });
  }

  async startInteractiveSession() {
    console.log('\n💡 Interactive Session Started');
    console.log('Commands: select-style, generate-code, coordinate-team, analyze-code, help, exit');
    
    this.prompt();
  }

  prompt() {
    this.rl.question('\n🤖 fuzzy-disco-ai> ', async (input) => {
      await this.handleCommand(input.trim());
      this.prompt();
    });
  }

  async handleCommand(input) {
    const args = input.split(' ');
    const command = args[0].toLowerCase();

    try {
      switch (command) {
        case 'select-style':
          await this.selectStyle(args.slice(1));
          break;
        case 'generate-code':
          await this.generateCode(args.slice(1));
          break;
        case 'coordinate-team':
          await this.coordinateTeam(args.slice(1));
          break;
        case 'analyze-code':
          await this.analyzeCode(args.slice(1));
          break;
        case 'help':
          await this.listTools();
          break;
        case 'exit':
          console.log('👋 Goodbye!');
          process.exit(0);
          break;
        default:
          console.log('❌ Unknown command. Type "help" for available commands.');
      }
    } catch (error) {
      console.error('❌ Error:', error.message);
    }
  }

  async selectStyle(args) {
    const taskType = args[0] || 'feature';
    const context = args.slice(1).join(' ') || 'General task';
    
    console.log(`🎯 Selecting practitioner style for: ${taskType}`);
    
    const message = {
      jsonrpc: "2.0",
      id: Date.now(),
      method: "tools/call",
      params: {
        name: "select_practitioner_style",
        arguments: {
          taskType,
          context,
          teamSize: 2
        }
      }
    };

    const result = await this.sendMCPMessage(message);
    this.displayResult('Style Selection', result);
  }

  async generateCode(args) {
    const practitioner = args[0] || 'uncle-bob';
    const codeType = args[1] || 'Service';
    const requirements = args.slice(2).join(' ') || 'process data';
    
    console.log(`⚡ Generating ${codeType} code in ${practitioner} style...`);
    
    const message = {
      jsonrpc: "2.0",
      id: Date.now(),
      method: "tools/call",
      params: {
        name: "generate_code_with_style",
        arguments: {
          practitioner,
          codeType,
          requirements,
          language: 'typescript'
        }
      }
    };

    const result = await this.sendMCPMessage(message);
    this.displayResult('Code Generation', result);
  }

  async coordinateTeam(args) {
    const workflow = args[0] || 'feature-development';
    const teamMembers = args.slice(1).length > 0 ? args.slice(1) : ['Developer 1', 'Developer 2'];
    
    console.log(`👥 Coordinating ${workflow} workflow...`);
    
    const message = {
      jsonrpc: "2.0",
      id: Date.now(),
      method: "tools/call",
      params: {
        name: "coordinate_team_workflow",
        arguments: {
          workflow,
          teamMembers,
          priority: 'medium'
        }
      }
    };

    const result = await this.sendMCPMessage(message);
    this.displayResult('Team Coordination', result);
  }

  async analyzeCode(args) {
    if (args.length === 0) {
      console.log('❌ Please provide code to analyze');
      return;
    }
    
    const code = args.join(' ');
    console.log(`🔍 Analyzing code quality...`);
    
    const message = {
      jsonrpc: "2.0",
      id: Date.now(),
      method: "tools/call",
      params: {
        name: "analyze_code_quality",
        arguments: {
          code,
          language: 'javascript',
          focusAreas: ['clean-code', 'maintainability', 'performance']
        }
      }
    };

    const result = await this.sendMCPMessage(message);
    this.displayResult('Code Analysis', result);
  }

  async sendMCPMessage(message) {
    const response = await fetch(`${this.apiUrl}/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message)
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  }

  displayResult(title, result) {
    console.log(`\n📊 ${title} Results:`);
    console.log('=' .repeat(50));
    
    if (result.error) {
      console.log(`❌ Error: ${result.error.message}`);
      return;
    }

    if (result.result && result.result.content && result.result.content[0]) {
      const content = JSON.parse(result.result.content[0].text);
      
      // Pretty print based on content type
      if (content.recommendation) {
        console.log(`🎯 Recommended: ${content.recommendation.style || content.recommendation.practitioner}`);
        console.log(`📝 Reasoning: ${content.recommendation.reasoning}`);
        if (content.recommendation.principles) {
          console.log(`🔧 Principles: ${content.recommendation.principles.join(', ')}`);
        }
      }
      
      if (content.generatedCode) {
        console.log(`👨‍💻 Generated by: ${content.practitioner}`);
        console.log(`📋 Code Type: ${content.codeType}`);
        console.log(`🔧 Principles: ${content.principles.join(', ')}`);
        console.log('\n💻 Generated Code:');
        console.log(content.generatedCode);
      }
      
      if (content.coordination) {
        console.log(`📋 Workflow: ${content.workflow}`);
        console.log(`⚡ Priority: ${content.priority}`);
        console.log(`👥 Team: ${content.team?.members?.join(', ') || 'Default team'}`);
        console.log(`📊 Phases: ${content.coordination.phases?.join(' → ') || 'Standard phases'}`);
      }
      
      if (content.score) {
        console.log(`📊 Quality Score: ${content.score}/100`);
        console.log(`📈 Metrics: ${content.metrics?.lines || 0} lines, ${content.metrics?.functions || 0} functions`);
        if (content.recommendations) {
          console.log(`💡 Recommendations: ${content.recommendations.slice(0, 3).join(', ')}`);
        }
      }
    } else {
      console.log(JSON.stringify(result, null, 2));
    }
  }
}

// Start the client
const client = new RailwayMCPClient();
client.initialize();