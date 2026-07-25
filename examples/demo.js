const { GamingQATool } = require('../index');

const tool = new GamingQATool();

// Simulate a real game QA session for "Cyberpunk-style" RPG
const report = tool.analyzeBuild({
  game: {
    name: 'Neon Drifter 2077',
    os: 'Windows 10',
    cpu: '4 cores',
    gpu: 'GTX 1060 6GB',
    ram: 8,
    storage: 70,
    directx: 12
  },
  system: {
    os: 'Windows 11',
    cpu: '8 cores (Ryzen 7)',
    gpu: 'RTX 3070',
    ram: 16,
    storage: 500,
    directx: 12
  },
  perf: {
    fpsSamples: [72, 68, 75, 71, 69, 144, 144, 142, 70, 68, 73, 67],
    loadTimes: [12, 15, 11, 13, 14],
    crashEvents: [],
    targets: { fps: 60, loadTime: 15 }
  },
  ux: {
    tutorialSteps: [
      { completed: true, timeSec: 45 },
      { completed: true, timeSec: 60 },
      { completed: true, timeSec: 50 },
      { completed: false, timeSec: 180 } // One confusing step
    ],
    menuInteractions: [
      { deadEnd: false, clicks: 3 },
      { deadEnd: false, clicks: 2 },
      { deadEnd: true, clicks: 8 } // Dead-end found
    ],
    accessibility: {
      subtitles: true,
      colorblindMode: true,
      remappableControls: true,
      textSize: true,
      audioCues: false // Missing
    },
    bugs: [
      { severity: 'minor', desc: 'Subtitle timing off by 0.5s' }
    ]
  }
});

console.log('🎮 GAMING QA REPORT: ' + report.game);
console.log('='.repeat(60));
console.log(`Overall Score: ${report.overallScore}/100`);
console.log(`Verdict: ${report.verdict}`);
console.log('='.repeat(60));

console.log('\n💻 COMPATIBILITY');
console.log(`  Level: ${report.compatibility.level}`);
console.log(`  Score: ${report.compatibility.score}/100`);
console.log(`  ${report.compatibility.summary}`);

console.log('\n⚡ PERFORMANCE');
console.log(`  Score: ${report.performance.score}/100 (Grade ${report.performance.grade})`);
console.log(`  FPS: ${report.performance.fps.message}`);
console.log(`  Load: ${report.performance.loadTimes.message}`);
console.log(`  Stability: ${report.performance.stability.message}`);

console.log('\n🎨 UX');
console.log(`  Score: ${report.ux.score}/100`);
console.log(`  Tutorial: ${report.ux.tutorial.message}`);
console.log(`  Menu: ${report.ux.menu.message}`);
console.log(`  Accessibility: ${report.ux.accessibility.message}`);

if (report.blocking.length > 0) {
  console.log('\n🚫 BLOCKING ISSUES:');
  report.blocking.forEach(b => console.log(`  • ${b}`));
}

console.log('\n💡 RECOMMENDATIONS:');
const allRecs = [
  ...report.performance.recommendations,
  ...report.ux.recommendations
];
allRecs.forEach(r => console.log(`  • ${r}`));