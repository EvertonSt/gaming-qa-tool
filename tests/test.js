const { GamingQATool } = require('../index');
const { CompatibilityAnalyzer } = require('../src/analyzers/compatibility');
const { PerformanceAnalyzer } = require('../src/analyzers/performance');
const { UXAnalyzer } = require('../src/analyzers/ux');

let passed = 0, failed = 0;
function assert(cond, name) {
  if (cond) { console.log(`  ✅ ${name}`); passed++; }
  else { console.log(`  ❌ ${name}`); failed++; }
}

console.log('🎮 Gaming QA Tool Tests\n');

// Test CompatibilityAnalyzer
console.log('💻 Compatibility:');
const comp = new CompatibilityAnalyzer();
const compResult = comp.analyze(
  { os: 'Windows 10', cpu: '4 cores', gpu: 'GTX 1060', ram: 8, storage: 50, directx: 11 },
  { os: 'Windows 11', cpu: '8 cores', gpu: 'RTX 3070', ram: 16, storage: 200, directx: 12 }
);
assert(compResult.level === 'recommended', 'High-end system = recommended');
assert(compResult.score === 100, 'Perfect score for over-spec');

const lowResult = comp.analyze(
  { os: 'Windows 10', cpu: '4 cores', gpu: 'GTX 1060', ram: 8, storage: 50, directx: 11 },
  { os: 'Windows 7', cpu: '2 cores', gpu: 'GT 730', ram: 4, storage: 20, directx: 10 }
);
assert(lowResult.level === 'incompatible', 'Low-end system = incompatible');
assert(lowResult.checks.ram.status === 'fail', 'Insufficient RAM flagged');

// Test PerformanceAnalyzer
console.log('\n⚡ Performance:');
const perf = new PerformanceAnalyzer();
const perfResult = perf.analyze({
  fpsSamples: [60, 58, 61, 59, 62, 57, 60, 144, 144, 144],
  loadTimes: [8, 12, 10, 9, 11],
  crashEvents: [],
  targets: { fps: 60, loadTime: 15 }
});
assert(perfResult.score >= 90, 'Smooth session scores high');
assert(perfResult.grade === 'S' || perfResult.grade === 'A', 'Grade S or A');
assert(perfResult.stability.crashes === 0, 'No crashes detected');

const badPerf = perf.analyze({
  fpsSamples: [25, 30, 20, 28, 22, 19, 31, 24],
  loadTimes: [45, 50, 40, 55],
  crashEvents: [{ t: 100 }, { t: 200 }],
  targets: {}
});
assert(badPerf.score < 60, 'Poor session scores low');
assert(badPerf.stability.crashes === 2, 'Crashes counted');

// Test UXAnalyzer
console.log('\n🎨 UX:');
const ux = new UXAnalyzer();
const uxResult = ux.analyze({
  tutorialSteps: [
    { completed: true, timeSec: 30 },
    { completed: true, timeSec: 45 },
    { completed: true, timeSec: 40 }
  ],
  menuInteractions: [
    { deadEnd: false, clicks: 3 },
    { deadEnd: false, clicks: 2 }
  ],
  accessibility: { subtitles: true, colorblindMode: true, remappableControls: true, textSize: true, audioCues: true },
  bugs: []
});
assert(uxResult.score >= 90, 'Good UX scores high');
assert(uxResult.tutorial.completion === 100, 'Tutorial 100% complete');

const badUX = ux.analyze({
  tutorialSteps: [{ completed: false, timeSec: 300 }],
  menuInteractions: [{ deadEnd: true, clicks: 10 }],
  accessibility: { subtitles: false },
  bugs: [{ severity: 'critical', desc: 'Softlock in menu' }]
});
assert(badUX.score < 60, 'Bad UX scores low');
assert(badUX.bugs.critical === 1, 'Critical bug detected');

// Test full integration
console.log('\n🔧 Integration:');
const tool = new GamingQATool();
const report = tool.analyzeBuild({
  game: { name: 'Test Game', os: 'Windows 10', cpu: '4 cores', gpu: 'GTX 1060', ram: 8, storage: 50 },
  system: { os: 'Windows 11', cpu: '8 cores', gpu: 'RTX 3070', ram: 16, storage: 200 },
  perf: { fpsSamples: [60, 60, 59, 61], loadTimes: [10], crashEvents: [] },
  ux: {
    tutorialSteps: [{ completed: true, timeSec: 30 }],
    menuInteractions: [{ deadEnd: false, clicks: 2 }],
    accessibility: { subtitles: true, colorblindMode: true, remappableControls: true, textSize: true, audioCues: true },
    bugs: []
  }
});
assert(report.overallScore > 80, 'Full report generates high score');
assert(report.verdict.includes('PASS'), 'Verdict is PASS for good build');
assert(report.blocking.length === 0, 'No blocking issues for good build');

console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);