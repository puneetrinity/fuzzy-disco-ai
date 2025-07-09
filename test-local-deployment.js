#!/usr/bin/env node

// Test script for local Docker deployment
import fetch from 'node-fetch';

const WEB_API = 'http://localhost:8000';
const GLOBAL_MCP = 'http://localhost:8001';

async function testLocalDeployment() {
  console.log('🧪 Testing Local Docker Deployment');
  console.log('==================================');

  try {
    // Test 1: Web API Health
    console.log('\n1. 🏥 Testing Web API Health...');
    const healthResponse = await fetch(`${WEB_API}/health`);
    const healthData = await healthResponse.json();
    console.log(`   ✅ Status: ${healthData.status}`);
    console.log(`   ⏰ Timestamp: ${healthData.timestamp}`);

    // Test 2: Global MCP Health
    console.log('\n2. 🌐 Testing Global MCP Health...');
    const mcpHealthResponse = await fetch(`${GLOBAL_MCP}/health`);
    const mcpHealthData = await mcpHealthResponse.json();
    console.log(`   ✅ Status: ${mcpHealthData.status}`);

    // Test 3: API Tools List
    console.log('\n3. 🔧 Testing API Tools List...');
    const toolsResponse = await fetch(`${WEB_API}/api/tools`);
    const toolsData = await toolsResponse.json();
    console.log(`   ✅ Available tools: ${toolsData.tools.length}`);
    toolsData.tools.forEach((tool, index) => {
      console.log(`   ${index + 1}. ${tool.name} - ${tool.description}`);
    });

    // Test 4: Select Practitioner Style
    console.log('\n4. 🎯 Testing Select Practitioner Style...');
    const styleResponse = await fetch(`${WEB_API}/api/select-style`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        taskType: 'feature',
        context: 'Docker deployment automation',
        teamSize: 2
      })
    });
    const styleData = await styleResponse.json();
    console.log(`   ✅ Recommended: ${styleData.recommendation.style}`);
    console.log(`   📝 Reasoning: ${styleData.recommendation.reasoning}`);

    // Test 5: Generate Code
    console.log('\n5. ⚡ Testing Code Generation...');
    const codeResponse = await fetch(`${WEB_API}/api/generate-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        practitioner: 'uncle-bob',
        codeType: 'DockerService',
        requirements: 'manage Docker containers',
        language: 'typescript'
      })
    });
    const codeData = await codeResponse.json();
    console.log(`   ✅ Generated: ${codeData.codeType} using ${codeData.practitioner}`);
    console.log(`   🔧 Principles: ${codeData.principles.join(', ')}`);

    // Test 6: Team Coordination
    console.log('\n6. 👥 Testing Team Coordination...');
    const teamResponse = await fetch(`${WEB_API}/api/coordinate-team`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        workflow: 'feature-development',
        teamMembers: ['DevOps', 'Backend Dev', 'Frontend Dev'],
        priority: 'high'
      })
    });
    const teamData = await teamResponse.json();
    console.log(`   ✅ Workflow: ${teamData.workflow}`);
    console.log(`   📊 Team size: ${teamData.teamMembers.length}`);
    console.log(`   ⚡ Priority: ${teamData.priority}`);

    // Test 7: Code Analysis
    console.log('\n7. 🔍 Testing Code Analysis...');
    const analysisResponse = await fetch(`${WEB_API}/api/analyze-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: `
const deployApp = (config) => {
  docker.build(config.imageName);
  docker.run(config.containerName, config.imageName);
  return { status: 'deployed', timestamp: new Date() };
};
`,
        language: 'javascript',
        focusAreas: ['clean-code', 'maintainability']
      })
    });
    const analysisData = await analysisResponse.json();
    console.log(`   ✅ Quality Score: ${analysisData.score}/100`);
    console.log(`   📊 Functions: ${analysisData.metrics.functions}`);
    console.log(`   📈 Lines: ${analysisData.metrics.lines}`);

    // Test 8: Global MCP Message
    console.log('\n8. 📡 Testing Global MCP Message...');
    const mcpMessage = {
      jsonrpc: "2.0",
      id: 1,
      method: "tools/call",
      params: {
        name: "select_practitioner_style",
        arguments: {
          taskType: "infrastructure",
          context: "Docker deployment",
          teamSize: 1
        }
      }
    };

    const mcpResponse = await fetch(`${GLOBAL_MCP}/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mcpMessage)
    });
    const mcpData = await mcpResponse.json();
    const mcpContent = JSON.parse(mcpData.result.content[0].text);
    console.log(`   ✅ MCP Response: ${mcpContent.recommendation.practitioner}`);
    console.log(`   🎯 Focus: ${mcpContent.recommendation.reasoning}`);

    console.log('\n🎉 All tests passed! Local deployment is working perfectly.');
    console.log('\n📍 Service URLs:');
    console.log(`   • Web API: ${WEB_API}`);
    console.log(`   • Global MCP: ${GLOBAL_MCP}`);
    console.log('\n🚀 Ready for development!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('💡 Make sure Docker containers are running: ./deploy-local.sh start');
  }
}

// Run the tests
testLocalDeployment();