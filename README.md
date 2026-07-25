# 🎮 Gaming QA Tool

A comprehensive QA testing toolkit for games — validates **compatibility**, **performance**, and **UX** across PC/console/mobile builds. Built for QA testers who know the gaming market.

## ✨ Features

| Analyzer | What it checks |
|----------|----------------|
| **Compatibility** | OS, CPU, GPU, RAM, storage, DirectX vs game requirements |
| **Performance** | FPS (avg/min/worst-1%), load times, crash/stability tracking |
| **UX** | Tutorial completion, menu navigation, accessibility, UX bugs |

## 🚀 Quick Start

```bash
npm install
npm test      # Run 16 unit tests
npm run demo   # See a full QA report on a sample game
```

## 📊 Sample Output

```
🎮 GAMING QA REPORT: Neon Drifter 2077
============================================================
Overall Score: 82/100
Verdict: PASS: Minor fixes recommended
============================================================

💻 COMPATIBILITY
  Level: recommended
  Score: 100/100
  Fully compatible at recommended settings

⚡ PERFORMANCE
  Score: 95/100 (Grade A)
  FPS: Avg 88 FPS, min 67, worst 1%: 67
  Load: Avg load 13s, worst 15s
  Stability: No crashes detected

🎨 UX
  Score: 62/100
  Tutorial: 75% tutorial completion, avg 84s/step
  Menu: 1 dead-end screens, avg 4.3 clicks to target
  Accessibility: 4/5 accessibility features present

💡 RECOMMENDATIONS:
  • Fix menu dead-ends — players get stuck
  • Add missing a11y: audioCues
```

## 🛠️ Tech Stack

- Node.js (zero dependencies — pure JS)
- Modular analyzer architecture
- 16 passing unit tests (built-in `node:assert`)

## 📁 Structure

```
gaming-qa-tool/
├── src/analyzers/
│   ├── compatibility.js   # Hardware/requirement matching
│   ├── performance.js     # FPS, load times, stability
│   └── ux.js              # Tutorial, menu, accessibility
├── tests/test.js          # 16 unit tests
├── examples/demo.js       # Full QA report demo
└── index.js               # GamingQATool orchestrator
```

## 💼 Why This Matters for Your Job Search

This tool proves you understand:
- **Game QA workflows** — what actually gets tested in game studios
- **Market knowledge** — GPU tiers, DirectX, accessibility standards
- **Structured reporting** — pass/fail/blocking verdicts like real QA
- **Zero-dependency code** — clean, readable, no bloat

Perfect for **Game QA Tester**, **QA Engineer (Gaming)**, or **Technical QA** roles at studios like Ubisoft, EA, Riot, or indie teams.

---

⭐ Built by [Everton St](https://github.com/EvertonSt) — QA Engineer & AI Specialist
