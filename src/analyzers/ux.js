/**
 * Game UX Analyzer
 * Validates game UX patterns: tutorial clarity, menu navigation, accessibility
 */

class UXAnalyzer {
  /**
   * Analyze game UX from test session observations
   * @param {Object} data - UX test data
   * @param {Array} data.tutorialSteps - Tutorial step completion data
   * @param {Array} data.menuInteractions - Menu navigation paths
   * @param {Object} data.accessibility - Accessibility feature flags
   * @param {Array} data.bugs - UX-related bugs found
   * @returns {Object} UX report
   */
  analyze(data) {
    const tutorialReport = this._analyzeTutorial(data.tutorialSteps || []);
    const menuReport = this._analyzeMenu(data.menuInteractions || []);
    const a11yReport = this._analyzeAccessibility(data.accessibility || {});
    const bugReport = this._analyzeBugs(data.bugs || []);

    const score = Math.round(
      (tutorialReport.score + menuReport.score + a11yReport.score + bugReport.score) / 4
    );

    return {
      score,
      tutorial: tutorialReport,
      menu: menuReport,
      accessibility: a11yReport,
      bugs: bugReport,
      recommendations: this._recommendations(tutorialReport, menuReport, a11yReport, bugReport)
    };
  }

  _analyzeTutorial(steps) {
    if (steps.length === 0) return { score: 50, completion: 0, message: 'No tutorial data' };

    const completed = steps.filter(s => s.completed).length;
    const completion = Math.round((completed / steps.length) * 100);

    let score = completion;
    // Penalize steps that take too long (confusing)
    const avgTime = steps.reduce((a, s) => a + (s.timeSec || 0), 0) / steps.length;
    if (avgTime > 120) score -= 15;

    return {
      score: Math.max(0, score),
      completion,
      avgTimeSec: Math.round(avgTime),
      message: `${completion}% tutorial completion, avg ${Math.round(avgTime)}s/step`
    };
  }

  _analyzeMenu(interactions) {
    if (interactions.length === 0) return { score: 50, message: 'No menu data' };

    const deadEnds = interactions.filter(i => i.deadEnd).length;
    const avgClicks = interactions.reduce((a, i) => a + (i.clicks || 0), 0) / interactions.length;

    let score = 100;
    if (deadEnds > 0) score -= Math.min(40, deadEnds * 10);
    if (avgClicks > 5) score -= 20;

    return {
      score: Math.max(0, score),
      deadEnds,
      avgClicks: Math.round(avgClicks * 10) / 10,
      message: `${deadEnds} dead-end screens, avg ${Math.round(avgClicks * 10) / 10} clicks to target`
    };
  }

  _analyzeAccessibility(flags) {
    const features = ['subtitles', 'colorblindMode', 'remappableControls', 'textSize', 'audioCues'];
    const present = features.filter(f => flags[f]);
    const score = Math.round((present.length / features.length) * 100);

    return {
      score,
      present,
      missing: features.filter(f => !flags[f]),
      message: `${present.length}/${features.length} accessibility features present`
    };
  }

  _analyzeBugs(bugs) {
    if (bugs.length === 0) return { score: 100, count: 0, message: 'No UX bugs found' };

    const critical = bugs.filter(b => b.severity === 'critical').length;
    const major = bugs.filter(b => b.severity === 'major').length;
    const minor = bugs.filter(b => b.severity === 'minor').length;

    let score = 100;
    score -= critical * 25;
    score -= major * 10;
    score -= minor * 3;

    return {
      score: Math.max(0, score),
      count: bugs.length,
      critical,
      major,
      minor,
      message: `${bugs.length} UX bug(s): ${critical} critical, ${major} major, ${minor} minor`
    };
  }

  _recommendations(tutorial, menu, a11y, bugs) {
    const recs = [];
    if (tutorial.completion < 80) recs.push('Improve tutorial clarity — completion below 80%');
    if (menu.deadEnds > 0) recs.push('Fix menu dead-ends — players get stuck');
    if (a11y.missing.length > 0) recs.push(`Add missing a11y: ${a11y.missing.join(', ')}`);
    if (bugs.critical > 0) recs.push('Block release — critical UX bugs present');
    return recs;
  }
}

module.exports = { UXAnalyzer };