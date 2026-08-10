# East Grevie Adventures

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Tests: 201 Passed](https://img.shields.io/badge/QA%20Tests-201%20Passed-success.svg)](tests/qa_full_game_sweep.js)

An immersive retro Web RPG featuring **25 Vanillaware-style hand-drawn 2D illustrations**, **neural storyteller voice narration**, an interactive **overworld map**, **4 playable hero classes**, **15 unlockable achievement trophies**, and a **headless 200+ automated simulation test suite**.

<p align="center">
  <img src="assets/images/map.jpg" width="49%" alt="Overworld Map" />
  <img src="assets/images/intro.jpg" width="49%" alt="Opening Intro Scene" />
</p>

---

### [Play Game Live in Browser](https://miken908.github.io/east-grevie-adventures/)

---

## Production & Engineering Retrospective

* **Delivery Sprint**: Rapid pre-production & delivery sprint.
* **Production Workflow**: Executed with a Lead Producer & Product Owner mindset, harnessing GenAI tools (Antigravity & Gemini) as an accelerated virtual engineering and art pipeline across 100+ iterative commits.
* **Architecture Strategy**: Zero-dependency vanilla ES6+ stack ensuring instant zero-config browser loading with zero build-step overhead.
* **Scope & Risk Management**: Designed a modular state machine with a fail-proof quest state tree and `localStorage` meta-progression to guarantee zero softlocks or state corruption.

---

## Core Features

### Vanillaware-Style 2D Artworks & Lightbox Gallery
- **25 2D Illustrations**: Custom hand-drawn style artwork (inspired by *Odin Sphere* and *GrimGrimoire*) for every location, character, enemy encounter, boss defeat stage, and key story beat.
- **Dynamic Defeat Cutscene Stage**: When Lord Rodrigues hits 0 HP, scene artwork dynamically transitions to `rodrigues_defeated.jpg`, depicting the Shadow Cat staggering in defeat as holy sunfire embers dissolve his form across a multi-beat narrative finale.
- **Widescreen 1240px Layout**: High-definition display container purged of legacy CRT distortion or pixelation blur.
- **Interactive Lightbox**: Fullscreen artwork modal with arrow key navigation (`◄` / `►`) and active image counter (`1 / 25`).

### Playable Hero Archetypes & Passive Perks
- **Royal Knight**: Starter class featuring the `Bastion Shield` perk (-2 damage taken).
- **Woodland Ranger**: High agility starter class featuring `Eagle Eye` (+10% Crit Chance & +10% Dodge).
- **Royal Alchemist**: Resource master class featuring `Elixir Master` (+60 HP potions & extra merchant gold).
- **Sunblade Paladin**: Exclusive **New Game+** hero unlocked by claiming all 15 Achievement Trophies (`Holy Guard` & `Sunfire Cleave`).

### Dynamic Combat & Real-Time Feedback
- Multi-tiered floating combat text for critical hits, damage mitigation, dodging, and healing.
- Dynamic combat log with real-time class passive perk activation notifications.

### Quest Journal & Non-Blocking Progression Engine
- Fail-proof 3 core long-form quests with explicit milestone tracking:
  1. **MAIN QUEST**: *Rescue Princess Elsa* (4 milestones: Speak with Wise Elder -> Reforge & Consecrate Sunblade -> Vanquish Lord Rodrigues -> Escort Princess Elsa back to East Grevie).
  2. **CELESTIAL SUBQUEST**: *Reforging the Sunblade* (Collect 3 ancient relics across the realm & consecrate at Temple Sanctum).
  3. **BLACKSMITH SUBQUEST**: *Stolen Mastercraft Blueprint* (Locate Goblin Rogue & recover stolen forge blueprint).
- **Independent Blacksmith Reforging**: Players possessing all 3 relics can reforge the Sunblade immediately even if the stolen shop blueprint has not yet been returned.

### Widescreen Modal & HD Typography System
- Redesigned all game dialog popups (Quest Log, Hero Creation, Audio Settings, Hero Stats, Trophies) to 1080px widescreen framing with scaled-up HD typography (`1.05rem - 1.5rem`), padded controls, and high-contrast readability.

### Achievement Trophy Room & Meta-Progression
- **15 Unlockable Trophies**: Persistent progress saved across sessions in browser `localStorage`.
- **Animated Toast Banners**: Real-time sliding notification banners when achievements trigger.
- **New Game+ Unlock**: Reaching 15 trophies awakens the legendary Sunblade Paladin on the hero selection screen.

### Neural Voice Narration & Web Audio Synthesizer
- **Smart Voice Auto-Selection**: Asynchronous Web Speech API integration that automatically detects and locks onto the highest-quality HD/Neural voice on the player's OS without user configuration.
- **Audio Ducking Engine**: Music automatically ducks volume during voiceover lines for cinematic clarity.
- **Audio Control Center**: Independent volume sliders for Master, Music, SFX, and Narration Voice.

---

## Technology Stack

- **Frontend**: Vanilla HTML5, CSS3 (Modern Flexbox & CSS Grid), JavaScript (ES6+).
- **Audio Engine**: Web Audio API Synthesizer & SpeechSynthesis Neural Voice Engine.
- **State Management**: Clean modular JavaScript `state` object with `localStorage` persistence.
- **Testing**: Zero-dependency Headless Node.js DOM Simulation Engine (`qa_simulation_suite.js`).

---

## Automated Testing & QA Suite

This repository includes a comprehensive 2-tier automated testing suite in Node.js:

```bash
# Run full static check + headless dynamic state simulation test suite
node tests/qa_full_game_sweep.js
```

### QA Test Coverage (201/201 Passed - 100.0% Success Rate)
- **177 Static System Checks**: Validates HTML element bindings, CSS layout definitions, function signatures, and event listeners.
- **24 Headless Dynamic Simulations**: Mocks player actions step-by-step in Node.js (game start clean slate, quest discovery, combat rolls, encounter objective progress, and playthrough state resets).

---

## Getting Started Locally

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Miken908/east-grevie-adventures.git
   cd east-grevie-adventures
   ```

2. **Open in Browser**:
   - Double-click `index.html` or serve with Live Server in VS Code.

3. **Run Test Suite**:
   ```bash
   node tests/qa_full_game_sweep.js
   ```

---

## License & Credits

- **Game Creator & Lead Director**: Miken908
- **AI Development Partner**: Antigravity (Google DeepMind)
- **Visual Art & Soundscapes**: Created with Google Gemini AI (Vanillaware 2D Illustration Style) & Web Audio Engine
- **License**: [MIT](LICENSE)
