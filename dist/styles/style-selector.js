/**
 * Intelligent Practitioner Style Selector
 *
 * This module implements the auto-style selection logic from .claude/commands/auto-style.md
 * It intelligently chooses the best practitioner approach based on task context.
 */
export class PractitionerStyleSelector {
    styleRules = new Map();
    constructor() {
        this.initializeStyleRules();
    }
    initializeStyleRules() {
        // Primary style mappings based on task type
        this.styleRules.set('feature:new', {
            practitioner: 'uncle-bob',
            rationale: 'New features benefit from Uncle Bob\'s clean code principles for maintainability',
            keyPrinciples: ['Single Responsibility', 'Open/Closed Principle', 'Clean Architecture'],
            implementationGuidance: 'Focus on clear interfaces, dependency injection, and comprehensive testing',
            confidence: 0.85
        });
        this.styleRules.set('bug-fix:critical', {
            practitioner: 'kent-beck',
            rationale: 'Critical bugs require Kent Beck\'s TDD approach for confidence and regression prevention',
            keyPrinciples: ['Test-Driven Development', 'Simple Design', 'Refactoring'],
            implementationGuidance: 'Write failing tests first, make them pass, then refactor safely',
            confidence: 0.90
        });
        this.styleRules.set('refactor:large', {
            practitioner: 'fowler',
            rationale: 'Large refactorings benefit from Fowler\'s systematic evolutionary approach',
            keyPrinciples: ['Evolutionary Design', 'Continuous Refactoring', 'Code Smells Detection'],
            implementationGuidance: 'Use incremental changes with comprehensive test coverage',
            confidence: 0.95
        });
        this.styleRules.set('data-processing:functional', {
            practitioner: 'jessica-kerr',
            rationale: 'Data processing benefits from functional programming principles for reliability',
            keyPrinciples: ['Pure Functions', 'Immutability', 'Composability'],
            implementationGuidance: 'Use immutable data structures and function composition',
            confidence: 0.88
        });
        this.styleRules.set('infrastructure:cloud', {
            practitioner: 'kelsey',
            rationale: 'Infrastructure work requires cloud-native and production-ready approaches',
            keyPrinciples: ['Cloud-Native Design', 'Operational Excellence', 'Automation'],
            implementationGuidance: 'Focus on scalability, monitoring, and deployment automation',
            confidence: 0.92
        });
    }
    async selectOptimalStyle(context) {
        // Primary decision logic
        const primaryKey = this.buildPrimaryKey(context);
        let recommendation = this.styleRules.get(primaryKey);
        if (recommendation) {
            return this.adjustForContext(recommendation, context);
        }
        // Fallback to task-type based selection
        recommendation = this.selectByTaskType(context);
        return this.adjustForContext(recommendation, context);
    }
    buildPrimaryKey(context) {
        const { taskType, complexity, teamSize } = context;
        // Build composite key based on context
        if (taskType === 'feature') {
            return 'feature:new';
        }
        else if (taskType === 'bug-fix') {
            return complexity === 'high' ? 'bug-fix:critical' : 'bug-fix:normal';
        }
        else if (taskType === 'refactor') {
            return teamSize && teamSize > 3 ? 'refactor:large' : 'refactor:small';
        }
        else if (taskType === 'data-processing') {
            return 'data-processing:functional';
        }
        else if (taskType === 'infrastructure') {
            return 'infrastructure:cloud';
        }
        return `${taskType}:default`;
    }
    selectByTaskType(context) {
        const { taskType } = context;
        switch (taskType) {
            case 'feature':
                return {
                    practitioner: 'uncle-bob',
                    rationale: 'Feature development benefits from clean code principles',
                    keyPrinciples: ['SOLID Principles', 'Clean Architecture'],
                    implementationGuidance: 'Focus on maintainable, testable code',
                    confidence: 0.75
                };
            case 'bug-fix':
                return {
                    practitioner: 'kent-beck',
                    rationale: 'Bug fixes require test-driven approach for confidence',
                    keyPrinciples: ['TDD', 'Simple Design'],
                    implementationGuidance: 'Write tests first, then fix',
                    confidence: 0.80
                };
            case 'refactor':
                return {
                    practitioner: 'fowler',
                    rationale: 'Refactoring requires systematic evolutionary approach',
                    keyPrinciples: ['Evolutionary Design', 'Continuous Refactoring'],
                    implementationGuidance: 'Use small, incremental changes',
                    confidence: 0.85
                };
            case 'data-processing':
                return {
                    practitioner: 'jessica-kerr',
                    rationale: 'Data processing benefits from functional programming',
                    keyPrinciples: ['Pure Functions', 'Immutability'],
                    implementationGuidance: 'Use functional programming patterns',
                    confidence: 0.82
                };
            case 'infrastructure':
                return {
                    practitioner: 'kelsey',
                    rationale: 'Infrastructure requires cloud-native approach',
                    keyPrinciples: ['Cloud-Native', 'Operational Excellence'],
                    implementationGuidance: 'Focus on scalability and automation',
                    confidence: 0.88
                };
            default:
                return {
                    practitioner: 'fowler',
                    rationale: 'Default to evolutionary design for unknown contexts',
                    keyPrinciples: ['Evolutionary Design', 'Continuous Improvement'],
                    implementationGuidance: 'Start simple, evolve based on feedback',
                    confidence: 0.65
                };
        }
    }
    adjustForContext(recommendation, context) {
        const adjusted = { ...recommendation };
        // Adjust confidence based on context completeness
        if (context.teamSize && context.complexity && context.timeline) {
            adjusted.confidence = Math.min(adjusted.confidence + 0.1, 1.0);
        }
        // Team size adjustments
        if (context.teamSize) {
            if (context.teamSize > 5) {
                adjusted.keyPrinciples.push('Team Communication');
                adjusted.implementationGuidance += '. Consider team coordination and clear interfaces.';
            }
            else if (context.teamSize === 1) {
                adjusted.keyPrinciples.push('Rapid Iteration');
                adjusted.implementationGuidance += '. Focus on quick wins and learning.';
            }
        }
        // Complexity adjustments
        if (context.complexity === 'high') {
            adjusted.keyPrinciples.push('Risk Mitigation');
            adjusted.implementationGuidance += '. Use extra caution and comprehensive testing.';
        }
        else if (context.complexity === 'low') {
            adjusted.keyPrinciples.push('Simplicity');
            adjusted.implementationGuidance += '. Keep it simple and avoid over-engineering.';
        }
        return adjusted;
    }
    // Helper method to get all available practitioners
    getAvailablePractitioners() {
        return ['fowler', 'uncle-bob', 'kent-beck', 'jessica-kerr', 'kelsey'];
    }
    // Helper method to get style guide for a specific practitioner
    getStyleGuide(practitioner) {
        const guides = {
            'fowler': 'Focus on evolutionary design and continuous refactoring',
            'uncle-bob': 'Apply SOLID principles and clean architecture',
            'kent-beck': 'Use test-driven development and simple design',
            'jessica-kerr': 'Emphasize functional programming and pure functions',
            'kelsey': 'Implement cloud-native and operational excellence'
        };
        return guides[practitioner] || 'Unknown practitioner';
    }
}
