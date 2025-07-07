#!/usr/bin/env node

async function vibeCheck() {
  console.log('🎵 Vibe Check: What\'s Your Coding Mood Today?');
  console.log('==============================================\n');

  console.log('🌟 Answer these questions to find your coding vibe:\n');

  const vibeQuestions = [
    {
      question: '🤔 What are you feeling like doing?',
      options: {
        A: 'Building something new and awesome',
        B: 'Fixing problems and making things work',
        C: 'Cleaning up and organizing existing code', 
        D: 'Processing data and finding patterns',
        E: 'Getting stuff deployed and live'
      }
    },
    {
      question: '⚡ What\'s your energy level?',
      options: {
        A: 'High - ready to create something from scratch',
        B: 'Focused - need to solve specific problems',
        C: 'Methodical - want to improve what exists',
        D: 'Analytical - love working with data flows',
        E: 'Action-oriented - want to ship and deploy'
      }
    },
    {
      question: '🎯 What outcome do you want?',
      options: {
        A: 'A solid, professional feature that works perfectly',
        B: 'A reliable fix that won\'t break again',
        C: 'Cleaner, more maintainable code',
        D: 'Elegant data transformations and insights',
        E: 'Production-ready deployment with monitoring'
      }
    }
  ];

  vibeQuestions.forEach((q, index) => {
    console.log(`${index + 1}. ${q.question}`);
    Object.entries(q.options).forEach(([key, value]) => {
      console.log(`   ${key}. ${value}`);
    });
    console.log('');
  });

  console.log('🎨 Vibe Guide Based on Your Answers');
  console.log('===================================\n');

  const vibeGuide = [
    {
      answers: 'Mostly A\'s',
      vibe: '🏗️ Building Mode (Uncle Bob Vibes)',
      description: 'You\'re in creative architect mode',
      aiStyle: 'Clean Code principles',
      perfectFor: 'New features, system design, solid foundations',
      tellClaude: '"I want to build..." or "I need to implement..."',
      youGet: 'SOLID architecture, dependency injection, clean interfaces'
    },
    {
      answers: 'Mostly B\'s', 
      vibe: '🔧 Fix-It Mode (Kent Beck Vibes)',
      description: 'You\'re in problem-solver mode',
      aiStyle: 'Test-Driven Development',
      perfectFor: 'Bug fixes, debugging, ensuring reliability',
      tellClaude: '"There\'s a bug..." or "This isn\'t working..."',
      youGet: 'Tests first, minimal fixes, rock-solid solutions'
    },
    {
      answers: 'Mostly C\'s',
      vibe: '🧹 Cleanup Mode (Martin Fowler Vibes)', 
      description: 'You\'re in refactoring zen mode',
      aiStyle: 'Evolutionary Design',
      perfectFor: 'Code cleanup, refactoring, improving structure',
      tellClaude: '"This code is messy..." or "Let\'s refactor..."',
      youGet: 'Elegant improvements, extracted methods, better readability'
    },
    {
      answers: 'Mostly D\'s',
      vibe: '📊 Data Flow Mode (Jessica Kerr Vibes)',
      description: 'You\'re in functional programming flow',
      aiStyle: 'Functional Programming',
      perfectFor: 'Data processing, transformations, analytics',
      tellClaude: '"I need to process..." or "Transform this data..."',
      youGet: 'Pure functions, immutable data, elegant transformations'
    },
    {
      answers: 'Mostly E\'s',
      vibe: '☁️ Ship-It Mode (Kelsey Hightower Vibes)',
      description: 'You\'re in deployment warrior mode',
      aiStyle: 'Cloud-Native',
      perfectFor: 'Deployment, infrastructure, production readiness',
      tellClaude: '"Let\'s deploy..." or "Make this production-ready..."',
      youGet: 'Kubernetes configs, monitoring, scalable architecture'
    }
  ];

  vibeGuide.forEach(vibe => {
    console.log(`${vibe.vibe}`);
    console.log(`  ${vibe.description}`);
    console.log(`  🎨 AI Style: ${vibe.aiStyle}`);
    console.log(`  💫 Perfect for: ${vibe.perfectFor}`);
    console.log(`  💬 Tell Claude: ${vibe.tellClaude}`);
    console.log(`  ✨ You get: ${vibe.youGet}`);
    console.log('');
  });

  console.log('🌈 Mixed Vibes? No Problem!');
  console.log('============================\n');

  const mixedVibes = [
    {
      combo: '🏗️ + 🧹 Building + Cleanup',
      example: '"Build a clean user service by refactoring the existing one"',
      result: 'Uncle Bob clean code + Fowler refactoring patterns'
    },
    {
      combo: '🔧 + 📊 Fix-It + Data Flow', 
      example: '"Fix this data processing bug with functional approach"',
      result: 'Kent Beck TDD + Jessica Kerr functional programming'
    },
    {
      combo: '🧹 + ☁️ Cleanup + Ship-It',
      example: '"Refactor this for production deployment"',
      result: 'Fowler refactoring + Kelsey cloud-native practices'
    }
  ];

  mixedVibes.forEach(mix => {
    console.log(`${mix.combo}`);
    console.log(`  Example: ${mix.example}`);
    console.log(`  Result: ${mix.result}`);
    console.log('');
  });

  console.log('🎵 Your Vibe Coding Playlist');
  console.log('============================\n');

  const playlist = [
    '🏗️ Building beats - when you\'re architecting something new',
    '🔧 Debugging rhythms - when you\'re hunting down problems',
    '🧹 Refactoring flow - when you\'re cleaning and organizing',
    '📊 Data jazz - when you\'re processing and transforming',
    '☁️ Deployment anthems - when you\'re shipping to production'
  ];

  playlist.forEach(track => console.log(`  ${track}`));

  console.log('\n🚀 Ready to Code with Your Vibe?');
  console.log('================================\n');

  console.log('1. 🎯 Identify your current vibe from above');
  console.log('2. 🤖 Start the AI assistant: node mcp-server.js');
  console.log('3. 💻 Open Claude Code in VS Code');
  console.log('4. 🗣️ Tell Claude your vibe: "I want to build..." or "This is buggy..."');
  console.log('5. ✨ Let AI apply the perfect style for your mood');
  console.log('6. 🌊 Stay in flow and create amazing code');

  console.log('\n🎵 Remember: There\'s no wrong vibe, only different coding moods!');
  console.log('Each style has its perfect moment. Trust your instincts! 🌟');

  console.log('\n🎉 Happy vibe coding! May your code flow like music! 🎼✨');
}

vibeCheck().catch(console.error);
