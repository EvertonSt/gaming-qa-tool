/**
 * Gaming QA Tool - Main Entry Point
 * Orchestrates compatibility, performance, and UX analysis for game QA
 */

const { CompatibilityAnalyzer } = require('./src/analyzers/compatibility');
const { PerformanceAnalyzer } = require('./src/analyzers/performance');
const { UXAnalyzer } = require('./src/analyzers/ux');

class GamingQATool {
  constructor() {
    this.compatibility = new CompatibilityAnalyzer();
    this.performance = new PerformanceAnalyzer();
    this.ux = new UXAnalyzer();
  }

  /**
   * Run full QA analysis on a game build
   * @param {Object} config
   * @param {Object} config.game - Game requirements
   * @param {Object} config.system - Test system specs
   * @param {Object} config.perf - Performance test data
   * @param {Object} config.ux - UX test data
   * @returns {Object} Complete QA report
   */
  analyzeBuild(config) {
    const compatibilityReport = this.compatibility.analyze(config.game, config.system);
    const performanceReport = this.performance.analyze(config.perf);
    const uxReport = this.ux.analyze(config.ux);

    const overallScore = Math.round(
      (compatibilityReport.score + performanceReport.score + uxReport.score) / 3
    );

    return {
      timestamp: new Date().toISOString(),
      game: config.game.name || 'Unnamed Build',
      overallScore,
      verdict: this._verdict(overallScore, compatibilityReport, performanceReport, uxReport),
      compatibility: compatibilityReport,
      performance: performanceReport,
      ux: uxReport,
      blocking: this._blockingIssues(compatibilityReport, performanceReport, uxReport)
    };
  }

  _verdict(score, comp, perf, ux) {
    if (comp.level === 'incompatible') return 'BLOCKED: System incompatible';
    if (perf.stability.crashes > 0) return 'BLOCKED: Stability issues';
    if (ux.bugs.critical > 0) return 'BLOCKED: Critical UX bugs';
    if (score >= 85) return 'PASS: Ship-ready';
    if (score >= 70) return 'PASS: Minor fixes recommended';
    return 'FAIL: Needs significant work';
  }

  _blockingIssues(comp, perf, ux) {
    const issues = [];
    if (comp.level === 'incompatible') {
      issues.push(...Object.values(comp.checks)
        .filter(c => c.status === 'fail')
        .map(c => `Compatibility: ${c.message}`));
    }
    if (perf.stability.crashes > 0) {
      issues.push(`Stability: ${perf.stability.crashes} crash(es) detected`);
    }
    if (ux.bugs.critical > 0) {
      issues.push(`UX: ${ux.bugs.critical} critical bug(s)`);
    }
    return issues;
  }
}

module.exports = { GamingQATool };

// CLI usage
if (require.main === module) {
  const tool = new GamingQATool();
  console.log('🎮 Gaming QA Tool ready. Use analyzeBuild() with your test data.');
}