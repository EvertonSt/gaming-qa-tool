/**
 * Game Performance Analyzer
 * Measures FPS, load times, and stability metrics from test sessions
 */

class PerformanceAnalyzer {
  /**
   * Analyze game performance from test session data
   * @param {Object} data - Performance test data
   * @param {Array} data.fpsSamples - FPS measurements over time
   * @param {Array} data.loadTimes - Level/area load times (seconds)
   * @param {Array} data.crashEvents - Crash timestamps
   * @param {Object} data.targets - Performance targets to validate against
   * @returns {Object} Performance report
   */
  analyze(data) {
    const fpsReport = this._analyzeFPS(data.fpsSamples || []);
    const loadReport = this._analyzeLoadTimes(data.loadTimes || []);
    const stabilityReport = this._analyzeStability(data.crashEvents || []);

    const score = Math.round(
      (fpsReport.score + loadReport.score + stabilityReport.score) / 3
    );

    return {
      score,
      fps: fpsReport,
      loadTimes: loadReport,
      stability: stabilityReport,
      grade: this._grade(score),
      recommendations: this._recommendations(fpsReport, loadReport, stabilityReport)
    };
  }

  _analyzeFPS(samples) {
    if (samples.length === 0) {
      return { score: 0, avg: 0, min: 0, max: 0, p1: 0, dropped: 0, message: 'No FPS data' };
    }

    const sorted = [...samples].sort((a, b) => a - b);
    const avg = samples.reduce((a, b) => a + b, 0) / samples.length;
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    const p1 = sorted[Math.floor(sorted.length * 0.01)]; // 1st percentile (worst 1%)
    const dropped = samples.filter(f => f < 30).length; // frames below 30fps

    let score = 100;
    if (avg < 30) score -= 40;
    else if (avg < 45) score -= 20;
    else if (avg < 60) score -= 10;
    if (p1 < 20) score -= 20;
    if (dropped > samples.length * 0.05) score -= 15;

    return {
      score: Math.max(0, score),
      avg: Math.round(avg),
      min,
      max,
      p1,
      dropped,
      message: `Avg ${Math.round(avg)} FPS, min ${min}, worst 1%: ${p1}`
    };
  }

  _analyzeLoadTimes(times) {
    if (times.length === 0) {
      return { score: 0, avg: 0, max: 0, message: 'No load time data' };
    }

    const avg = times.reduce((a, b) => a + b, 0) / times.length;
    const max = Math.max(...times);

    let score = 100;
    if (avg > 30) score -= 30;
    else if (avg > 20) score -= 20;
    else if (avg > 10) score -= 10;
    if (max > 60) score -= 20;
    else if (max > 45) score -= 10;

    return {
      score: Math.max(0, score),
      avg: Math.round(avg * 10) / 10,
      max: Math.round(max * 10) / 10,
      message: `Avg load ${Math.round(avg * 10) / 10}s, worst ${Math.round(max * 10) / 10}s`
    };
  }

  _analyzeStability(crashes) {
    const crashCount = crashes.length;
    let score = 100;
    if (crashCount > 0) score -= Math.min(50, crashCount * 10);

    return {
      score: Math.max(0, score),
      crashes: crashCount,
      message: crashCount === 0 ? 'No crashes detected' : `${crashCount} crash(es) in session`
    };
  }

  _grade(score) {
    if (score >= 90) return 'S';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    if (score >= 50) return 'D';
    return 'F';
  }

  _recommendations(fps, load, stability) {
    const recs = [];
    if (fps.avg < 60) recs.push('Optimize rendering pipeline — avg FPS below 60');
    if (fps.p1 < 30) recs.push('Investigate frame drops — worst 1% below 30 FPS');
    if (load.avg > 15) recs.push('Reduce loading times — average exceeds 15s');
    if (stability.crashes > 0) recs.push('Fix crash paths — stability below 100%');
    return recs;
  }
}

module.exports = { PerformanceAnalyzer };