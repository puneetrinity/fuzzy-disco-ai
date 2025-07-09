#!/usr/bin/env node

// Practical Demo: Using Railway API for Development Tasks
import fetch from 'node-fetch';

const RAILWAY_API = 'https://fuzzy-disco-ai-production.up.railway.app';

class RailwayDevAssistant {
  constructor() {
    this.apiUrl = RAILWAY_API;
  }

  async callTool(toolName, args) {
    const message = {
      jsonrpc: "2.0",
      id: Date.now(),
      method: "tools/call",
      params: {
        name: toolName,
        arguments: args
      }
    };

    const response = await fetch(`${this.apiUrl}/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message)
    });

    const result = await response.json();
    return JSON.parse(result.result.content[0].text);
  }

  async developFeature(featureDescription, teamSize = 2) {
    console.log(`🚀 Developing Feature: ${featureDescription}`);
    console.log('=' .repeat(60));

    // Step 1: Select best practitioner approach
    console.log('\n1. 🎯 Selecting Best Practitioner Approach...');
    const styleResult = await this.callTool('select_practitioner_style', {
      taskType: 'feature',
      context: featureDescription,
      teamSize: teamSize
    });

    const practitioner = styleResult.recommendation.practitioner;
    console.log(`   ✅ Recommended: ${practitioner}`);
    console.log(`   📝 Reasoning: ${styleResult.recommendation.reasoning}`);

    // Step 2: Generate core service code
    console.log('\n2. ⚡ Generating Core Service Code...');
    const codeResult = await this.callTool('generate_code_with_style', {
      practitioner: practitioner.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, ''),
      codeType: 'FeatureService',
      requirements: featureDescription,
      language: 'typescript'
    });

    console.log(`   ✅ Generated ${codeResult.codeType} using ${codeResult.practitioner} principles`);
    console.log(`   🔧 Key Principles: ${codeResult.principles.join(', ')}`);

    // Step 3: Plan team workflow
    console.log('\n3. 👥 Planning Team Workflow...');
    const workflowResult = await this.callTool('coordinate_team_workflow', {
      workflow: 'feature-development',
      teamMembers: teamSize > 1 ? ['Lead Dev', 'Developer', 'QA'] : ['Solo Dev'],
      priority: 'medium'
    });

    console.log(`   ✅ Workflow: ${workflowResult.workflow}`);
    console.log(`   📊 Phases: ${workflowResult.coordination.phases.join(' → ')}`);
    console.log(`   ⏱️ Estimated: ${workflowResult.estimatedCompletion || 'TBD'}`);

    // Step 4: Analyze generated code
    console.log('\n4. 🔍 Analyzing Generated Code Quality...');
    const codeSnippet = codeResult.generatedCode.substring(0, 500);
    const analysisResult = await this.callTool('analyze_code_quality', {
      code: codeSnippet,
      language: 'typescript',
      focusAreas: ['clean-code', 'maintainability', 'performance']
    });

    console.log(`   ✅ Quality Score: ${analysisResult.overallScore}/100`);
    console.log(`   📈 Metrics: ${analysisResult.metrics.lines} lines, ${analysisResult.metrics.functions} functions`);
    
    return {
      practitioner,
      code: codeResult.generatedCode,
      workflow: workflowResult,
      quality: analysisResult
    };
  }

  async fixBug(bugDescription, codeToFix) {
    console.log(`🐛 Bug Fix Process: ${bugDescription}`);
    console.log('=' .repeat(60));

    // Step 1: Select bug-fix approach
    console.log('\n1. 🎯 Selecting Bug-Fix Approach...');
    const styleResult = await this.callTool('select_practitioner_style', {
      taskType: 'bug-fix',
      context: bugDescription,
      teamSize: 1
    });

    console.log(`   ✅ Recommended: ${styleResult.recommendation.practitioner}`);
    console.log(`   📝 Approach: ${styleResult.recommendation.approach}`);

    // Step 2: Analyze problematic code
    console.log('\n2. 🔍 Analyzing Problematic Code...');
    const analysisResult = await this.callTool('analyze_code_quality', {
      code: codeToFix,
      language: 'javascript',
      focusAreas: ['clean-code', 'maintainability']
    });

    console.log(`   ✅ Current Quality: ${analysisResult.overallScore}/100`);
    console.log(`   ⚠️ Issues Found: ${analysisResult.recommendations.length}`);
    console.log(`   💡 Top Issues: ${analysisResult.recommendations.slice(0, 2).join(', ')}`);

    // Step 3: Generate fixed code
    console.log('\n3. ⚡ Generating Fixed Code...');
    const fixedCodeResult = await this.callTool('generate_code_with_style', {
      practitioner: 'uncle-bob',
      codeType: 'FixedFunction',
      requirements: `Fix bug: ${bugDescription}`,
      language: 'javascript'
    });

    console.log(`   ✅ Fixed using ${fixedCodeResult.practitioner} principles`);
    console.log(`   🔧 Applied: ${fixedCodeResult.principles.join(', ')}`);

    return {
      analysis: analysisResult,
      fixedCode: fixedCodeResult.generatedCode,
      recommendations: analysisResult.recommendations
    };
  }

  async codeReview(codeToReview) {
    console.log(`📊 Code Review Process`);
    console.log('=' .repeat(60));

    const analysisResult = await this.callTool('analyze_code_quality', {
      code: codeToReview,
      language: 'javascript',
      focusAreas: ['clean-code', 'maintainability', 'performance']
    });

    console.log(`\n📈 Overall Score: ${analysisResult.overallScore}/100`);
    console.log(`📊 Metrics:`);
    console.log(`   Lines: ${analysisResult.metrics.lines}`);
    console.log(`   Functions: ${analysisResult.metrics.functions}`);
    console.log(`   Complexity: ${analysisResult.metrics.complexity}`);

    console.log(`\n👥 Practitioner Perspectives:`);
    Object.entries(analysisResult.practitionerPerspectives).forEach(([name, perspective]) => {
      console.log(`   ${name}: ${perspective}`);
    });

    console.log(`\n💡 Recommendations:`);
    analysisResult.recommendations.forEach((rec, index) => {
      console.log(`   ${index + 1}. ${rec}`);
    });

    return analysisResult;
  }
}

// Demo Usage
async function runDemo() {
  console.log('🎯 Railway API Development Assistant Demo');
  console.log('🌐 Using: https://fuzzy-disco-ai-production.up.railway.app\n');

  const assistant = new RailwayDevAssistant();

  try {
    // Demo 1: Feature Development
    await assistant.developFeature('User authentication with JWT tokens', 3);

    console.log('\n' + '='.repeat(80) + '\n');

    // Demo 2: Bug Fix
    const buggyCode = `
function calculateDiscount(price, discount) {
  return price - (price * discount);
}
`;
    await assistant.fixBug('Discount calculation not handling edge cases', buggyCode);

    console.log('\n' + '='.repeat(80) + '\n');

    // Demo 3: Code Review
    const reviewCode = `
class UserManager {
  constructor() {
    this.users = [];
  }
  
  addUser(user) {
    this.users.push(user);
  }
  
  getUser(id) {
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i].id === id) {
        return this.users[i];
      }
    }
  }
}
`;
    await assistant.codeReview(reviewCode);

    console.log('\n🎉 Demo completed successfully!');
    console.log('💡 The Railway API is ready for your development workflow.');

  } catch (error) {
    console.error('❌ Demo failed:', error.message);
  }
}

// Run the demo
runDemo();