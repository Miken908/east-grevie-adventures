/* ==========================================================================
   DRAGON'S LAIR (1984) - RETRO GAME ENGINE & WEB AUDIO SYNTHESIZER
   ========================================================================== */

// --- Web Audio 8-bit Sound Synthesizer ---
class SoundEffects {
    constructor() {
        this.ctx = null;
        this.enabled = true;
        this.musicEnabled = true;
        this.currentTrack = null;
        this.musicTimer = null;
        this.noteIndex = 0;
    }

    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    playClick() {
        if (!this.enabled) return;
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();
        
        osc.type = 'sine';
        filter.type = 'lowpass';
        filter.frequency.value = 1200;
        
        osc.frequency.setValueAtTime(523.25, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(783.99, this.ctx.currentTime + 0.04);
        
        gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
        
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.start();
        osc.stop(this.ctx.currentTime + 0.04);
    }

    playSlash() {
        if (!this.enabled) return;
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();
        
        osc.type = 'triangle';
        filter.type = 'lowpass';
        filter.frequency.value = 900;
        
        osc.frequency.setValueAtTime(280, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(90, this.ctx.currentTime + 0.12);
        
        gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);
        
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.start();
        osc.stop(this.ctx.currentTime + 0.12);
    }

    playHeal() {
        if (!this.enabled) return;
        this.init();
        const notes = [329.63, 392.00, 493.88, 659.25];
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const filter = this.ctx.createBiquadFilter();
            
            osc.type = 'sine';
            filter.type = 'lowpass';
            filter.frequency.value = 1500;
            
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.08);
            
            gain.gain.setValueAtTime(0.01, this.ctx.currentTime + idx * 0.08);
            gain.gain.linearRampToValueAtTime(0.08, this.ctx.currentTime + idx * 0.08 + 0.03);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.08 + 0.25);
            
            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);
            
            osc.start(this.ctx.currentTime + idx * 0.08);
            osc.stop(this.ctx.currentTime + idx * 0.08 + 0.25);
        });
    }

    playItem() {
        if (!this.enabled) return;
        this.init();
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.06);
            
            gain.gain.setValueAtTime(0.01, this.ctx.currentTime + idx * 0.06);
            gain.gain.linearRampToValueAtTime(0.06, this.ctx.currentTime + idx * 0.06 + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.06 + 0.15);
            
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            
            osc.start(this.ctx.currentTime + idx * 0.06);
            osc.stop(this.ctx.currentTime + idx * 0.06 + 0.15);
        });
    }

    playVictory() {
        if (!this.enabled) return;
        this.init();
        this.stopMusic();
        const melody = [523.25, 659.25, 783.99, 1046.50, 880.00, 1046.50];
        melody.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.16);
            
            gain.gain.setValueAtTime(0.01, this.ctx.currentTime + idx * 0.16);
            gain.gain.linearRampToValueAtTime(0.09, this.ctx.currentTime + idx * 0.16 + 0.04);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.16 + 0.35);
            
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            
            osc.start(this.ctx.currentTime + idx * 0.16);
            osc.stop(this.ctx.currentTime + idx * 0.16 + 0.35);
        });
    }

    // --- Soothing, Low-Stress Ambient Synthesizer Suite ---
    playMusic(trackName) {
        if (this.currentTrack === trackName) return;
        this.stopMusic();
        this.currentTrack = trackName;
        if (!this.musicEnabled) return;

        this.init();

        // Soothing 16-bit Fantasy Scales (Gentle tempo, soft warm tones)
        const tracks = {
            // 🏰 Peaceful Village Theme (Warm C Major Pastoral Lullaby)
            village: [
                { f: 261.63, d: 0.65, type: 'triangle' }, // C4
                { f: 329.63, d: 0.65, type: 'sine' },     // E4
                { f: 392.00, d: 0.65, type: 'triangle' }, // G4
                { f: 523.25, d: 0.85, type: 'sine' },     // C5
                { f: 440.00, d: 0.65, type: 'triangle' }, // A4
                { f: 392.00, d: 0.65, type: 'sine' },     // G4
                { f: 329.63, d: 0.85, type: 'triangle' }, // E4
                { f: 293.66, d: 0.65, type: 'sine' },     // D4
                { f: 349.23, d: 0.65, type: 'triangle' }, // F4
                { f: 392.00, d: 0.85, type: 'sine' }      // G4
            ],
            // 🌲 Whispering Forest Theme (Tranquil A Minor Ambient Breeze)
            forest: [
                { f: 220.00, d: 0.80, type: 'sine' },     // A3
                { f: 261.63, d: 0.80, type: 'triangle' }, // C4
                { f: 329.63, d: 0.95, type: 'sine' },     // E4
                { f: 293.66, d: 0.80, type: 'triangle' }, // D4
                { f: 246.94, d: 0.80, type: 'sine' },     // B3
                { f: 220.00, d: 1.10, type: 'triangle' }  // A3
            ],
            // ⚔️ Heroic Combat Theme (Noble, Balanced D Minor Harmony - Low Stress)
            battle: [
                { f: 146.83, d: 0.45, type: 'triangle' }, // D3
                { f: 220.00, d: 0.45, type: 'sine' },     // A3
                { f: 293.66, d: 0.45, type: 'triangle' }, // D4
                { f: 349.23, d: 0.55, type: 'sine' },     // F4
                { f: 329.63, d: 0.45, type: 'triangle' }, // E4
                { f: 293.66, d: 0.45, type: 'sine' },     // D4
                { f: 220.00, d: 0.65, type: 'triangle' }  // A3
            ],
            // ✨ Fairy Sanctuary Theme (Radiant Ambient Chimes)
            fairy: [
                { f: 349.23, d: 0.70, type: 'sine' },     // F4
                { f: 440.00, d: 0.70, type: 'sine' },     // A4
                { f: 523.25, d: 0.70, type: 'sine' },     // C5
                { f: 659.25, d: 0.90, type: 'sine' },     // E5
                { f: 523.25, d: 0.70, type: 'sine' },     // C5
                { f: 440.00, d: 0.90, type: 'sine' }      // A4
            ]
        };

        const notes = tracks[trackName] || tracks.village;
        this.noteIndex = 0;

        const step = () => {
            if (!this.musicEnabled || this.currentTrack !== trackName) return;
            const note = notes[this.noteIndex];

            try {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                const filter = this.ctx.createBiquadFilter();

                osc.type = note.type || 'triangle';
                osc.frequency.setValueAtTime(note.f, this.ctx.currentTime);

                // Low-pass filter rolls off harsh frequencies for warm ambient sound
                filter.type = 'lowpass';
                filter.frequency.value = 1100;

                // Soft attack and smooth release envelope (No harsh pops or clicks!)
                const now = this.ctx.currentTime;
                const duration = note.d;
                gain.gain.setValueAtTime(0.001, now);
                gain.gain.linearRampToValueAtTime(0.025, now + 0.05); // Soft 50ms attack
                gain.gain.exponentialRampToValueAtTime(0.001, now + duration * 0.92);

                osc.connect(filter);
                filter.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start(now);
                osc.stop(now + duration * 0.92);
            } catch (e) {
                // AudioContext fallback handling
            }

            this.noteIndex = (this.noteIndex + 1) % notes.length;
            this.musicTimer = setTimeout(step, note.d * 1000);
        };

        step();
    }

    stopMusic() {
        if (this.musicTimer) {
            clearTimeout(this.musicTimer);
            this.musicTimer = null;
        }
        this.currentTrack = null;
    }
}

const sfx = new SoundEffects();

// --- Web Speech API Voice Narrator (Gandalf / Ian McKellen Style) ---
class VoiceNarrator {
    constructor() {
        this.synth = window.speechSynthesis || null;
        this.enabled = true;
        this.selectedVoice = null;
        this.initVoices();
    }

    initVoices() {
        if (!this.synth) return;
        const loadVoices = () => {
            const voices = this.synth.getVoices();
            if (!voices || voices.length === 0) return;
            // Prefer deep English male voices (e.g. Google UK English Male, Daniel, George, Microsoft David/Mark)
            this.selectedVoice = voices.find(v => v.lang.startsWith('en') && (
                v.name.includes('Male') || v.name.includes('David') || v.name.includes('Daniel') || v.name.includes('George') || v.name.includes('Ian') || v.name.includes('UK')
            )) || voices.find(v => v.lang.startsWith('en')) || voices[0];
        };

        loadVoices();
        if (this.synth.onvoiceschanged !== undefined) {
            this.synth.onvoiceschanged = loadVoices;
        }
    }

    speak(text) {
        if (!this.enabled || !this.synth) return;
        this.stop();

        const cleanText = text.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');
        const utterance = new SpeechSynthesisUtterance(cleanText);
        if (this.selectedVoice) {
            utterance.voice = this.selectedVoice;
        }
        utterance.pitch = 0.72; // Deep voice pitch
        utterance.rate = 0.83;  // Slower, majestic cadence
        utterance.volume = 1.0;

        try {
            this.synth.speak(utterance);
        } catch (e) {
            console.warn("SpeechSynthesis error:", e);
        }
    }

    stop() {
        if (this.synth && (this.synth.speaking || this.synth.pending)) {
            this.synth.cancel();
        }
    }
}

const narrator = new VoiceNarrator();

// --- Game State ---
const state = {
    name: "Sir Eldrin",
    hp: 155, // 100 + (END 3 * 15) + (LVL 1 * 10)
    maxHp: 155,
    level: 1,
    exp: 0,
    expToNextLevel: 100,
    ap: 0,
    str: 3,
    agi: 3,
    end: 3,
    lck: 3,
    score: 0,
    inventory: ["Bread", "Wooden Shield"],
    hasSword: false,
    hasKey: false,
    goblinDefeated: false,
    stumpSearched: false,
    caveSearched: false,
    goblinSpared: false,
    knightFreed: false,
    knightAllyUsed: false,
    hasIronShield: false,
    goblinHp: 35,
    dragonHp: 120,
    trollHp: 60,
    wilderness: null,
    fairyVisited: false,
    location: "village"
};

// --- Proposal 1: Heroic Attribute & Combat Formulas ---

function calculateMaxHp() {
    return 100 + (state.end * 15) + (state.level * 10);
}

function calculateDamageRange() {
    const baseMin = state.hasSword ? 35 : 8;
    const baseMax = state.hasSword ? 50 : 15;
    const minDmg = baseMin + Math.floor(state.str * 1.2) + state.level;
    const maxDmg = baseMax + Math.floor(state.str * 2.0) + (state.level * 2);
    return { minDmg, maxDmg };
}

function calculateCritChance() {
    return Math.min(50, 5 + (state.lck * 2) + (state.agi * 1));
}

function calculateCritMultiplier() {
    return 1.5 + (state.agi * 0.05);
}

function calculateDodgeChance() {
    return Math.min(35, state.agi * 1.5);
}

function calculateMitigation() {
    let shieldBase = state.hasIronShield ? 10 : (state.inventory.includes("Wooden Shield") ? 5 : 0);
    return shieldBase + Math.floor(state.end * 0.8);
}

function mitigate(damage) {
    const armor = calculateMitigation();
    return Math.max(1, Math.round(damage - armor));
}

function rollAttack() {
    const { minDmg, maxDmg } = calculateDamageRange();
    const baseOutput = Math.floor(Math.random() * (maxDmg - minDmg + 1)) + minDmg;
    const critChance = calculateCritChance() / 100;
    const isCrit = Math.random() < critChance;
    let finalDmg = baseOutput;
    if (isCrit) {
        finalDmg = Math.floor(baseOutput * calculateCritMultiplier());
    }
    return { dmg: finalDmg, crit: isCrit };
}

function checkDodge() {
    const dodgeChance = calculateDodgeChance() / 100;
    return Math.random() < dodgeChance;
}

function gainExp(amount) {
    state.exp += amount;
    while (state.exp >= state.expToNextLevel) {
        state.exp -= state.expToNextLevel;
        state.level += 1;
        state.ap += 3; // +3 AP granted per level!
        state.expToNextLevel = Math.floor(100 * Math.pow(state.level, 1.4));
        state.maxHp = calculateMaxHp();
        state.hp = state.maxHp;
        addLog(`⭐ LEVEL UP! You reached Level ${state.level}! Granted +3 Attribute Points!`, "event");
    }
    updateHUD();
    updateStatsModalUI();
}

const ENEMY_POOL = [
    { name: "Bandit", hp: 30, dmgLow: 6, dmgHigh: 12 },
    { name: "Dire Wolf", hp: 25, dmgLow: 8, dmgHigh: 14 },
    { name: "Skeleton Warrior", hp: 40, dmgLow: 5, dmgHigh: 10 },
    { name: "Orc Marauder", hp: 50, dmgLow: 9, dmgHigh: 15 },
];

// Image assets mapping
const sceneImages = {
    village: "assets/images/village.png",
    forest: "assets/images/forest.png",
    goblin: "assets/images/goblin.png",
    temple: "assets/images/sunblade.png",
    mountain: "assets/images/mountain.png",
    lair: "assets/images/dragon.png",
    watchtower: "assets/images/watchtower.png",
    blacksmith: "assets/images/blacksmith.png",
    wilderness: "assets/images/wilderness.png",
    troll: "assets/images/troll.png",
    cave: "assets/images/troll.png",
    map: "assets/images/worldmap.png",
    fairy: "assets/images/fairy.png",
    victory: "assets/images/dragon.png" // fallback high resolution scene
};

// UI Elements
const heroNameEl = document.getElementById("hero-name");
const levelTextEl = document.getElementById("level-text");
const hpBarEl = document.getElementById("hp-bar-inner");
const hpTextEl = document.getElementById("hp-text");
const scoreTextEl = document.getElementById("score-text");
const sceneImgEl = document.getElementById("scene-image");
const locationNameEl = document.getElementById("location-name");
const storyLogEl = document.getElementById("story-log");
const inventoryListEl = document.getElementById("inventory-list");
const actionsPanelEl = document.getElementById("actions-panel");

const nameModalEl = document.getElementById("name-modal");
const nameInputEl = document.getElementById("name-input");
const startBtnEl = document.getElementById("start-btn");
const soundBtnEl = document.getElementById("sound-btn");
const resetBtnEl = document.getElementById("reset-btn");

// Helper Functions
function addLog(text, type = "normal") {
    const p = document.createElement("p");
    if (type === "event") p.className = "log-event";
    if (type === "alert") p.className = "log-alert";
    if (type === "victory") p.className = "log-victory";
    p.textContent = text;
    storyLogEl.appendChild(p);
    storyLogEl.scrollTop = storyLogEl.scrollHeight;
}

function clearLog() {
    storyLogEl.innerHTML = "";
}

function addScore(points) {
    state.score += points;
    addLog(`★ +${points} Points! (Total: ${state.score} PTS)`, "event");
    sfx.playItem();
    gainExp(points);
}

function healPlayer(amount) {
    state.maxHp = calculateMaxHp();
    state.hp = Math.min(state.maxHp, state.hp + amount);
    addLog(`💚 Restored ${amount} HP! Current HP: ${state.hp}/${state.maxHp}`, "event");
    sfx.playHeal();
    updateHUD();
}

function updateHUD() {
    state.maxHp = calculateMaxHp();
    heroNameEl.textContent = state.name;
    if (levelTextEl) levelTextEl.textContent = state.level;
    const hpPct = Math.max(0, (state.hp / state.maxHp) * 100);
    hpBarEl.style.width = `${hpPct}%`;
    hpTextEl.textContent = `${state.hp}/${state.maxHp}`;
    scoreTextEl.textContent = String(state.score).padStart(6, '0');

    const apBadgeEl = document.getElementById("ap-badge");
    if (apBadgeEl) {
        if (state.ap > 0) {
            apBadgeEl.textContent = state.ap;
            apBadgeEl.classList.remove("hidden");
        } else {
            apBadgeEl.classList.add("hidden");
        }
    }

    inventoryListEl.innerHTML = "";
    state.inventory.forEach(item => {
        const span = document.createElement("span");
        span.className = "item-pill";
        span.textContent = item;
        inventoryListEl.appendChild(span);
    });
}

function setScene(imageKey, locationText) {
    if (sceneImages[imageKey]) {
        sceneImgEl.src = sceneImages[imageKey];
    }
    locationNameEl.textContent = locationText;
    const mapPinsOverlayEl = document.getElementById("map-pins-overlay");
    if (mapPinsOverlayEl) {
        if (imageKey === "map") {
            mapPinsOverlayEl.classList.remove("hidden");
        } else {
            mapPinsOverlayEl.classList.add("hidden");
        }
    }
}

// --- Location Controllers ---

function renderVillage() {
    state.location = "village";
    sfx.playMusic("village");
    setScene("village", "🏰 VILLAGE SQUARE");
    clearLog();
    addLog("You are at the Village Square of Oakhaven.");
    addLog("Townspeople gather around whispering in panic. Cobblestone paths lead in three directions.");

    renderChoices([
        { text: "1. Speak to Wise Elder by fountain", action: speakToElder },
        { text: "2. Visit the Blacksmith", action: goBlacksmith },
        { text: "3. Rest at Tavern (Full Rest)", action: restTavern },
        { text: "4. Venture into the Wilderness Trail", action: goWilderness },
        { text: "5. 🗺️ Open World Map (Travel Oakhaven)", action: renderWorldMap }
    ]);
}

function goBlacksmith() {
    sfx.playClick();
    renderBlacksmith();
}

function renderBlacksmith() {
    state.location = "blacksmith";
    sfx.playMusic("village");
    setScene("blacksmith", "🔨 BLACKSMITH'S FORGE");
    clearLog();
    addLog("Sparks fly as the burly blacksmith hammers away at glowing steel.");

    if (state.hasIronShield) {
        addLog("Blacksmith: 'That Iron Shield I forged you should still serve you well!'");
        renderChoices([{ text: "Return to Village Square", action: renderVillage }]);
    } else if (state.inventory.includes("Gold Pouch")) {
        addLog("Blacksmith: 'A Gold Pouch, eh? I can forge that Wooden Shield of yours into something sturdier.'");
        renderChoices([
            { text: "Forge Iron Shield (uses Gold Pouch)", action: forgeIronShield },
            { text: "Not now, return to Village Square", action: renderVillage }
        ]);
    } else {
        addLog("Blacksmith: 'Come back with some coin and I'll forge you something worthwhile.'");
        renderChoices([{ text: "Return to Village Square", action: renderVillage }]);
    }
}

function forgeIronShield() {
    sfx.playClick();
    const idx = state.inventory.indexOf("Gold Pouch");
    if (idx !== -1) {
        state.inventory.splice(idx, 1);
        state.hasIronShield = true;
        addLog("🛡️ Your Wooden Shield is reforged into a gleaming IRON SHIELD!", "event");
        addLog("It will reduce the damage you take when defending or taking a counterattack.");
        addScore(50);
    }
    renderChoices([{ text: "Return to Village Square", action: renderVillage }]);
}

function speakToElder() {
    sfx.playClick();
    addLog("Elder: 'Brave adventurer! The Sunblade lies hidden inside the Sunken Temple across the Whispering Forest.'");
    addLog("Elder: 'Take this Silver Key. It unlocks the inner sanctum!'");

    if (!state.inventory.includes("Silver Key")) {
        state.inventory.push("Silver Key");
        state.hasKey = true;
        addScore(100);
    } else {
        addLog("Elder: 'You already possess the Silver Key! Now seek the temple in the Forest.'");
    }
}

function restTavern() {
    sfx.playClick();
    if (state.hp < state.maxHp) {
        state.hp = state.maxHp;
        addLog("🍺 You enjoy a warm meal and a full night's rest at the tavern. Health fully restored!", "event");
        sfx.playHeal();
        updateHUD();
    } else {
        addLog("Your health is already full!");
    }
}

function goForest() {
    sfx.playClick();
    renderForest();
}

function renderForest() {
    state.location = "forest";
    sfx.playMusic("forest");
    setScene("forest", "🌲 WHISPERING FOREST");
    clearLog();
    addLog("Ancient trees blot out the sky. Twisted roots line the misty trail.");

    const choices = [
        { text: "1. Explore Sunken Temple ruins", action: goTemple },
        { text: "2. Investigate glowing tree stump", action: investigateStump },
        { text: "3. Fight Goblin Rogue", action: battleGoblin },
        { text: "4. 🗺️ Open World Map", action: renderWorldMap }
    ];

    renderChoices(choices);
}

function investigateStump() {
    sfx.playClick();
    if (!state.stumpSearched) {
        addLog("You examine the glowing stump and find a shimmering Healing Potion!");
        state.stumpSearched = true;
        state.inventory.push("Healing Potion");
        addScore(75);
    } else {
        addLog("The stump is empty now.");
    }
}

function goTemple() {
    sfx.playClick();
    renderTemple();
}

function renderTemple() {
    state.location = "temple";
    sfx.playMusic("forest");
    setScene("temple", "🏛️ SUNKEN TEMPLE SANCTUM");
    clearLog();
    addLog("Massive stone pillars support an ancient vault. In the center stands a glowing pedestal.");

    if (state.hasSword) {
        addLog("The pedestal is empty. You have already claimed the Sunblade!");
        renderChoices([
            { text: "Return to Whispering Forest", action: renderForest }
        ]);
        return;
    }

    renderChoices([
        { text: "1. Insert Silver Key into Pedestal Lock", action: useKeyTemple },
        { text: "2. Attempt Riddle of Sun Altar", action: solveRiddleTemple },
        { text: "3. Return to Whispering Forest", action: renderForest }
    ]);
}

function claimSunblade() {
    state.hasSword = true;
    state.inventory.push("Legendary Sunblade");
    addLog("✨ A blinding flash of golden light illuminates the temple!", "event");
    addLog("YOU HAVE FOUND THE LEGENDARY SUNBLADE!", "victory");
    addScore(300);

    renderChoices([
        { text: "Exit Temple with Sunblade", action: renderForest }
    ]);
}

function useKeyTemple() {
    sfx.playClick();
    if (state.inventory.includes("Silver Key")) {
        addLog("🗝️ The Silver Key fits perfectly into the ancient mechanism!");
        claimSunblade();
    } else {
        addLog("The pedestal lock requires a key! Speak to the Elder in Oakhaven Village.", "alert");
    }
}

function solveRiddleTemple() {
    sfx.playClick();
    const answer = prompt("📜 RIDDLE: 'I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?'");
    if (answer && answer.toLowerCase().includes("echo")) {
        addLog("Correct! The stone pedestal slides open!", "event");
        claimSunblade();
    } else {
        addLog("Incorrect! A trap fires poison darts!", "alert");
        state.hp -= 20;
        updateHUD();
        if (state.hp <= 0) gameOver("The temple's deadly poison darts ended your quest.");
    }
}

function battleGoblin() {
    sfx.playClick();
    if (state.goblinDefeated) {
        addLog("The Goblin Rogue has already been vanquished. The forest is quiet.");
        return;
    }

    state.location = "goblin";
    sfx.playMusic("battle");
    setScene("goblin", "⚔️ GOBLIN ROGUE ENCOUNTER");
    clearLog();
    addLog("⚔️ A Goblin Rogue leaps out with drawn daggers!", "alert");

    renderGoblinTurn();
}

function renderGoblinTurn() {
    addLog(`Goblin HP: ${state.goblinHp} | Your HP: ${state.hp}`);
    renderChoices([
        { text: "1. Attack Goblin with weapon", action: attackGoblin },
        { text: "2. Drink Healing Potion", action: usePotionGoblin },
        { text: "3. Flee to forest path", action: renderForest },
        { text: "4. Try to reason with the Goblin (requires Bread)", action: reasonWithGoblin }
    ]);
}

function attackGoblin() {
    sfx.playSlash();
    const { dmg, crit } = rollAttack();
    state.goblinHp -= dmg;
    if (crit) {
        addLog(`💥 CRITICAL HIT! You strike the Goblin for ${dmg} damage!`, "victory");
    } else {
        addLog(`You strike the Goblin for ${dmg} damage!`, "event");
    }

    if (state.goblinHp <= 0) {
        addLog("🎉 You defeated the Goblin Rogue!", "victory");
        state.goblinDefeated = true;
        state.inventory.push("Gold Pouch");
        addScore(150);
        renderChoices([{ text: "Continue through Forest", action: renderForest }]);
        return;
    }

    // Goblin counter attack with Dodge check
    if (checkDodge()) {
        addLog("💨 DODGED! You leap clear of the Goblin's attack!", "victory");
    } else {
        const gDmg = mitigate(Math.floor(Math.random() * 8) + 5);
        state.hp -= gDmg;
        addLog(`The Goblin bites back for ${gDmg} damage!`, "alert");
        updateHUD();
    }

    if (state.hp <= 0) {
        gameOver("You were slain by the Goblin Rogue in the misty forest.");
        return;
    }

    renderGoblinTurn();
}

function reasonWithGoblin() {
    sfx.playClick();
    const idx = state.inventory.indexOf("Bread");
    if (idx === -1) {
        addLog("You have no Bread to offer as a peace gesture!", "alert");
        renderGoblinTurn();
        return;
    }
    state.inventory.splice(idx, 1);
    addLog("You toss the Goblin your loaf of Bread. It snatches it and bolts into the trees!", "event");
    state.goblinDefeated = true;
    state.goblinSpared = true;
    addScore(100);
    updateHUD();
    renderChoices([{ text: "Continue through Forest", action: renderForest }]);
}

function usePotionGoblin() {
    const idx = state.inventory.indexOf("Healing Potion");
    if (idx !== -1) {
        state.inventory.splice(idx, 1);
        healPlayer(40);
        renderGoblinTurn();
    } else {
        addLog("No Healing Potions in inventory!", "alert");
    }
}

function goMountain() {
    sfx.playClick();
    renderMountain();
}

function renderMountain() {
    state.location = "mountain";
    sfx.playMusic("forest");
    setScene("mountain", "⛰️ ROCKY MOUNTAIN PASS");
    clearLog();
    addLog("Howling winds blow across narrow ledges. High above, smoke rises from Peak Doom.");

    renderChoices([
        { text: "1. Ascend to Peak Doom (Dragon Lair)", action: battleDragon },
        { text: "2. Search Mountain Cave for supplies", action: searchCave },
        { text: "3. Explore the Old Watchtower ruins", action: goWatchtower },
        { text: "4. 🗺️ Open World Map", action: renderWorldMap }
    ]);
}

function goWatchtower() {
    sfx.playClick();
    renderWatchtower();
}

function renderWatchtower() {
    state.location = "watchtower";
    sfx.playMusic("forest");
    setScene("watchtower", "🗼 OLD WATCHTOWER");
    clearLog();
    addLog("A crumbling stone tower leans over the cliffside, its door hanging off its hinges.");

    if (state.knightFreed) {
        addLog("The watchtower is empty and silent. Sir Cedric already rides free.");
        renderChoices([{ text: "Return to Mountain Pass", action: renderMountain }]);
        return;
    }

    addLog("Inside, chained to a support beam, lies a wounded Knight - Sir Cedric.");
    renderChoices([
        { text: "1. Free the Knight", action: freeKnight },
        { text: "2. Leave him chained and go", action: renderMountain }
    ]);
}

function freeKnight() {
    sfx.playClick();
    addLog("Sir Cedric: 'My thanks, friend! I owe you a life-debt. If ever you face Ignis, call for me!'", "event");
    state.knightFreed = true;
    addScore(75);
    renderChoices([{ text: "Return to Mountain Pass", action: renderMountain }]);
}

function searchCave() {
    sfx.playClick();
    if (!state.caveSearched) {
        renderMountainCave();
    } else {
        addLog("The cave has been scavenged.");
    }
}

function renderMountainCave() {
    state.location = "cave";
    setScene("troll", "🕳️ MOUNTAIN CAVE");
    clearLog();
    addLog("A Cave Troll blocks the entrance, guarding a chest of glittering treasure!", "alert");

    renderChoices([
        { text: "1. Fight the Cave Troll", action: startTrollFight },
        { text: "2. Sneak past while it's distracted", action: sneakPastTroll },
        { text: "3. Retreat to the Mountain Pass", action: renderMountain }
    ]);
}

function sneakPastTroll() {
    sfx.playClick();
    addLog("You slip past the dozing Troll and find a sturdy Elven Shield & Elixir of Life!", "event");
    state.caveSearched = true;
    state.inventory.push("Elixir of Life");
    healPlayer(50);
    addScore(100);
    renderChoices([{ text: "Return to Mountain Pass", action: renderMountain }]);
}

function startTrollFight() {
    sfx.playClick();
    sfx.playMusic("battle");
    addLog("The Cave Troll roars and swings its massive club!", "alert");
    state.trollHp = 60;
    renderTrollTurn();
}

function renderTrollTurn() {
    addLog(`Troll HP: ${state.trollHp} | Your HP: ${state.hp}`);
    renderChoices([
        { text: "1. Attack Troll with weapon", action: attackTroll },
        { text: "2. Drink Healing Potion", action: usePotionTroll },
        { text: "3. Flee to Mountain Pass", action: renderMountain }
    ]);
}

function attackTroll() {
    sfx.playSlash();
    const [low, high] = state.hasSword ? [15, 25] : [8, 15];
    const { dmg, crit } = rollAttack(low, high);
    state.trollHp -= dmg;
    if (crit) {
        addLog(`💥 CRITICAL HIT! You strike the Troll for ${dmg} damage!`, "victory");
    } else {
        addLog(`You strike the Troll for ${dmg} damage!`, "event");
    }

    if (state.trollHp <= 0) {
        addLog("🎉 You defeated the Cave Troll!", "victory");
        state.caveSearched = true;
        state.inventory.push("Elixir of Life");
        healPlayer(50);
        addScore(250);
        renderChoices([{ text: "Return to Mountain Pass", action: renderMountain }]);
        return;
    }

    const tDmg = mitigate(Math.floor(Math.random() * 9) + 10);
    state.hp -= tDmg;
    addLog(`The Troll clubs you for ${tDmg} damage!`, "alert");
    updateHUD();

    if (state.hp <= 0) {
        gameOver("You were crushed by the Cave Troll in the mountain cave.");
        return;
    }

    renderTrollTurn();
}

function usePotionTroll() {
    const idx = state.inventory.indexOf("Healing Potion");
    if (idx !== -1) {
        state.inventory.splice(idx, 1);
        healPlayer(40);
        renderTrollTurn();
    } else {
        addLog("No Healing Potions in inventory!", "alert");
    }
}

function goWilderness() {
    sfx.playClick();
    state.location = "wilderness";
    const base = ENEMY_POOL[Math.floor(Math.random() * ENEMY_POOL.length)];
    const levelBonus = state.level - 1;
    state.wilderness = {
        name: base.name,
        hp: base.hp + levelBonus * 6,
        dmgLow: base.dmgLow + levelBonus,
        dmgHigh: base.dmgHigh + levelBonus,
        reward: 60 + levelBonus * 8,
    };

    setScene("wilderness", "🌾 WILDERNESS TRAIL");
    sfx.playMusic("battle");
    clearLog();
    addLog(`A ${state.wilderness.name} emerges from the tall grass, ready to fight!`, "alert");
    renderWildernessTurn();
}

function renderWildernessTurn() {
    const w = state.wilderness;
    addLog(`${w.name} HP: ${w.hp} | Your HP: ${state.hp}`);
    renderChoices([
        { text: "1. Attack with weapon", action: attackWilderness },
        { text: "2. Use Healing Potion", action: usePotionWilderness },
        { text: "3. Flee back to the Village", action: renderVillage }
    ]);
}

function attackWilderness() {
    sfx.playSlash();
    const w = state.wilderness;
    const [low, high] = state.hasSword ? [15, 25] : [8, 15];
    const { dmg, crit } = rollAttack(low, high);
    w.hp -= dmg;
    if (crit) {
        addLog(`💥 CRITICAL HIT! You strike the ${w.name} for ${dmg} damage!`, "victory");
    } else {
        addLog(`You strike the ${w.name} for ${dmg} damage!`, "event");
    }

    if (w.hp <= 0) {
        addLog(`🎉 You defeated the ${w.name}!`, "victory");
        addScore(w.reward);
        renderChoices([
            { text: "1. Continue deeper on the Trail", action: goWilderness },
            { text: "2. Return to Village Square", action: renderVillage }
        ]);
        return;
    }

    const eDmg = mitigate(Math.floor(Math.random() * (w.dmgHigh - w.dmgLow + 1)) + w.dmgLow);
    state.hp -= eDmg;
    addLog(`The ${w.name} strikes back for ${eDmg} damage!`, "alert");
    updateHUD();

    if (state.hp <= 0) {
        addLog(`💥 You were knocked unconscious by the ${w.name}!`, "alert");
        addLog("🏥 Kind townspeople found you on the trail and brought you back to Oakhaven Village to recover.", "event");
        state.hp = Math.max(10, Math.floor(state.maxHp * 0.25));
        updateHUD();
        renderChoices([{ text: "Recover in Village Square", action: renderVillage }]);
        return;
    }

    renderWildernessTurn();
}

function usePotionWilderness() {
    const idx = state.inventory.indexOf("Healing Potion");
    if (idx !== -1) {
        state.inventory.splice(idx, 1);
        healPlayer(40);
        renderWildernessTurn();
    } else {
        addLog("No Healing Potions in inventory!", "alert");
    }
}

function battleDragon() {
    sfx.playClick();
    state.location = "lair";
    sfx.playMusic("battle");
    setScene("lair", "🐉 PEAK DOOM: DRAGON LAIR");
    clearLog();
    addLog("Molten lava streams down cavern walls. Atop a mountain of gold lies Princess Aurelia in chains!", "alert");
    addLog("Mighty Red Dragon Ignis awakens with a terrifying roar!", "alert");

    if (!state.hasSword) {
        addLog("⚠️ WARNING: You do not possess the Sunblade! Your weapons cannot penetrate Ignis's scales!", "alert");
    }

    renderDragonTurn();
}

function renderDragonTurn() {
    addLog(`🐉 IGNIS HP: ${state.dragonHp} | YOUR HP: ${state.hp}`);
    const choices = [
        { text: "1. Slash with Weapon", action: attackDragon },
        { text: "2. Raise Shield to Defend", action: defendDragon },
        { text: "3. Drink Elixir / Potion", action: useHealDragon },
        { text: "4. Flee down mountain", action: renderMountain }
    ];
    if (state.knightFreed && !state.knightAllyUsed) {
        choices.push({ text: "5. Call upon Sir Cedric to strike Ignis", action: callKnightAlly });
    }
    renderChoices(choices);
}

function callKnightAlly() {
    sfx.playSlash();
    const dmg = Math.floor(Math.random() * 11) + 25;
    state.dragonHp -= dmg;
    state.knightAllyUsed = true;
    addLog(`⚔️ Sir Cedric charges in and strikes Ignis for ${dmg} damage - the dragon has no chance to retaliate!`, "victory");

    if (state.dragonHp <= 0) {
        winGame();
        return;
    }
    renderDragonTurn();
}

function attackDragon() {
    sfx.playSlash();
    let dmg = 0;
    if (state.hasSword) {
        const rolled = rollAttack(35, 50);
        dmg = rolled.dmg;
        if (rolled.crit) {
            addLog(`💥⚔️ CRITICAL HIT! The Sunblade cleaves through the dragon's scales for ${dmg} massive damage!`, "victory");
        } else {
            addLog(`💥 The Sunblade cuts through the dragon's scales for ${dmg} CRITICAL DAMAGE!`, "victory");
        }
    } else {
        const rolled = rollAttack(1, 5);
        dmg = rolled.dmg;
        if (rolled.crit) {
            addLog(`💥 CRITICAL HIT! Your attack finds a chink in the dragon's armor for ${dmg} damage!`, "victory");
        } else {
            addLog(`Your attack bounces harmlessly off the dragon's thick armor for only ${dmg} damage!`, "alert");
        }
    }

    state.dragonHp -= dmg;

    if (state.dragonHp <= 0) {
        winGame();
        return;
    }

    // Dragon counter flame attack
    const dDmg = mitigate(Math.floor(Math.random() * 16) + 20);
    state.hp -= dDmg;
    addLog(`Ignis breathes a torrent of fire! You take ${dDmg} fire damage!`, "alert");
    updateHUD();

    if (state.hp <= 0) {
        gameOver("You fell in battle against Ignis the Red Dragon.");
        return;
    }

    renderDragonTurn();
}

function defendDragon() {
    sfx.playClick();
    addLog("You raise your shield! The dragon's fire breath is partially blocked.");
    const dDmg = mitigate(Math.floor(Math.random() * 8) + 8);
    state.hp -= dDmg;
    addLog(`You take reduced damage (${dDmg} HP).`, "event");
    updateHUD();

    if (state.hp <= 0) {
        gameOver("You fell in battle against Ignis the Red Dragon.");
        return;
    }

    renderDragonTurn();
}

function useHealDragon() {
    let idx = state.inventory.indexOf("Elixir of Life");
    if (idx !== -1) {
        state.inventory.splice(idx, 1);
        healPlayer(60);
        renderDragonTurn();
        return;
    }
    idx = state.inventory.indexOf("Healing Potion");
    if (idx !== -1) {
        state.inventory.splice(idx, 1);
        healPlayer(40);
        renderDragonTurn();
        return;
    }
    addLog("You have no healing items left!", "alert");
}

function gameOver(reason) {
    clearLog();
    sfx.stopMusic();
    addLog("==========================================", "alert");
    addLog("               GAME OVER", "alert");
    addLog("==========================================", "alert");
    addLog(reason, "alert");
    addLog(`Final Score: ${state.score} PTS`, "event");

    renderChoices([
        { text: "🔄 Play Again", action: restartGame }
    ]);
}

function winGame() {
    clearLog();
    sfx.playVictory();
    addScore(1000);

    addLog("============================================================", "victory");
    addLog("           🎉 VICTORY! THE KINGDOM IS SAVED! 🎉", "victory");
    addLog("============================================================", "victory");
    addLog("You vanquished Ignis the Red Dragon, rescued Princess Aurelia, and saved Oakhaven!", "event");

    let speechText = `Victory! Hear ye, people of Oakhaven! The hero ${state.name} has vanquished Ignis the Red Dragon and rescued Princess Aurelia from Peak Doom!`;
    if (state.knightFreed) {
        speechText += " Sir Cedric rides beside you into the Citadel, his life-debt repaid in honor!";
        addLog("Sir Cedric rides beside you into the Citadel, his life-debt repaid in blood and fire.", "event");
    }
    if (state.goblinSpared) {
        speechText += " Word spreads of the noble mercy you showed the Goblin Rogue.";
        addLog("Word spreads of the mercy you showed the Goblin Rogue in the Whispering Forest.", "event");
    } else if (state.goblinDefeated) {
        addLog("Tales of the Goblin Rogue you slew in the misty forest travel far and wide.", "event");
    }
    speechText += ` Peace has returned to the Realm, and ${state.name} shall be remembered forever as Grand Hero of Oakhaven!`;

    addLog(`FINAL SCORE: ${state.score} PTS | RATING: GRAND HERO OF THE REALM`, "victory");

    // Populate and display Victory Modal End Screen
    const victoryModalEl = document.getElementById("victory-modal");
    const victoryLoreTextEl = document.getElementById("victory-lore-text");
    const victoryScoreEl = document.getElementById("victory-score");
    const victoryLevelEl = document.getElementById("victory-level");

    if (victoryLoreTextEl) victoryLoreTextEl.innerHTML = `📜 <em>"${speechText}"</em>`;
    if (victoryScoreEl) victoryScoreEl.textContent = String(state.score).padStart(6, '0');
    if (victoryLevelEl) victoryLevelEl.textContent = `LVL ${state.level}`;

    if (victoryModalEl) victoryModalEl.classList.remove("hidden");

    renderChoices([
        { text: "🏆 Play Again for High Score", action: () => {
            if (victoryModalEl) victoryModalEl.classList.add("hidden");
            narrator.stop();
            restartGame();
        }}
    ]);
}

function restartGame() {
    state.str = 3;
    state.agi = 3;
    state.end = 3;
    state.lck = 3;
    state.ap = 0;
    state.level = 1;
    state.exp = 0;
    state.expToNextLevel = 100;
    state.maxHp = calculateMaxHp();
    state.hp = state.maxHp;
    state.score = 0;
    state.inventory = ["Bread", "Wooden Shield"];
    state.hasSword = false;
    state.hasKey = false;
    state.goblinDefeated = false;
    state.stumpSearched = false;
    state.caveSearched = false;
    state.goblinSpared = false;
    state.knightFreed = false;
    state.knightAllyUsed = false;
    state.hasIronShield = false;
    state.goblinHp = 35;
    state.dragonHp = 120;
    state.trollHp = 60;
    state.wilderness = null;
    state.fairyVisited = false;
    updateHUD();
    updateStatsModalUI();
    renderVillage();
}

function renderChoices(choices) {
    actionsPanelEl.innerHTML = "";
    choices.forEach(c => {
        const btn = document.createElement("button");
        btn.className = "arcade-btn";
        btn.textContent = c.text;
        btn.onclick = c.action;
        actionsPanelEl.appendChild(btn);
    });
}

// Event Listeners
const musicBtnEl = document.getElementById("music-btn");
const voiceBtnEl = document.getElementById("voice-btn");

const narrateBtnEl = document.getElementById("narrate-btn");
const introLoreCardEl = document.querySelector(".intro-lore-card");

if (narrateBtnEl) {
    narrateBtnEl.addEventListener("click", () => {
        const heroName = nameInputEl.value.trim() || "Sir Eldrin";
        state.name = heroName;
        if (introLoreCardEl) introLoreCardEl.classList.add("speaking");
        narrator.speak(`Welcome, ${heroName}! The Kingdom of Oakhaven is in shadow. The dreaded Red Dragon Ignis has captured Princess Aurelia and fled to Peak Doom. Without the Legendary Sunblade, no mortal weapon can pierce the beast's scales...`);
    });
}

startBtnEl.addEventListener("click", () => {
    state.name = nameInputEl.value.trim() || "Sir Eldrin";
    narrator.stop();
    if (introLoreCardEl) introLoreCardEl.classList.remove("speaking");
    nameModalEl.classList.add("hidden");
    updateHUD();
    sfx.init();
    renderVillage();
});

const victoryNarrateBtnEl = document.getElementById("victory-narrate-btn");
const victoryRestartBtnEl = document.getElementById("victory-restart-btn");
const victoryLoreCardEl = document.querySelector(".victory-lore-card");

if (victoryNarrateBtnEl) {
    victoryNarrateBtnEl.addEventListener("click", () => {
        const victoryText = document.getElementById("victory-lore-text") ? document.getElementById("victory-lore-text").textContent : "";
        if (victoryLoreCardEl) victoryLoreCardEl.classList.add("speaking");
        narrator.speak(victoryText);
    });
}

if (victoryRestartBtnEl) {
    victoryRestartBtnEl.addEventListener("click", () => {
        const vModal = document.getElementById("victory-modal");
        if (vModal) vModal.classList.add("hidden");
        if (victoryLoreCardEl) victoryLoreCardEl.classList.remove("speaking");
        narrator.stop();
        restartGame();
    });
}

if (voiceBtnEl) {
    voiceBtnEl.addEventListener("click", () => {
        narrator.enabled = !narrator.enabled;
        voiceBtnEl.textContent = `🎙️ VOICE: ${narrator.enabled ? "ON" : "OFF"}`;
        if (!narrator.enabled) {
            narrator.stop();
        }
    });
}

if (musicBtnEl) {
    musicBtnEl.addEventListener("click", () => {
        sfx.musicEnabled = !sfx.musicEnabled;
        musicBtnEl.textContent = `🎵 MUSIC: ${sfx.musicEnabled ? "ON" : "OFF"}`;
        if (!sfx.musicEnabled) {
            sfx.stopMusic();
        } else {
            const trackMap = { village: "village", forest: "forest", temple: "forest", mountain: "forest", goblin: "battle", lair: "battle", watchtower: "forest", blacksmith: "village", cave: "battle" };
            sfx.playMusic(trackMap[state.location] || "village");
        }
    });
}

soundBtnEl.addEventListener("click", () => {
    sfx.enabled = !sfx.enabled;
    soundBtnEl.textContent = `🔊 SFX: ${sfx.enabled ? "ON" : "OFF"}`;
});

resetBtnEl.addEventListener("click", () => {
    if (confirm("Restart game from beginning?")) {
        restartGame();
    }
});

const mapModalEl = document.getElementById("map-modal");
const closeMapModalBtn = document.getElementById("close-map-modal-btn");
const heroMapTokenEl = document.getElementById("hero-map-token");

const mapWaypoints = {
    village: { top: "74%", left: "22%" },
    blacksmith: { top: "74%", left: "22%" },
    forest: { top: "55%", left: "16%" },
    goblin: { top: "55%", left: "16%" },
    temple: { top: "32%", left: "24%" },
    wilderness: { top: "75%", left: "46%" },
    mountain: { top: "58%", left: "74%" },
    cave: { top: "58%", left: "74%" },
    watchtower: { top: "38%", left: "80%" },
    lair: { top: "18%", left: "50%" },
    fairy: { top: "40%", left: "46%" }
};

let isTravelling = false;

function setHeroTokenPosition(loc, animate = true) {
    if (!heroMapTokenEl) return;
    const wp = mapWaypoints[loc] || mapWaypoints.village;
    if (!animate) {
        heroMapTokenEl.style.transition = "none";
        heroMapTokenEl.style.top = wp.top;
        heroMapTokenEl.style.left = wp.left;
        heroMapTokenEl.offsetHeight; // Force reflow
        heroMapTokenEl.style.transition = "top 0.4s cubic-bezier(0.25, 1, 0.5, 1), left 0.4s cubic-bezier(0.25, 1, 0.5, 1)";
    } else {
        heroMapTokenEl.style.top = wp.top;
        heroMapTokenEl.style.left = wp.left;
    }
}

function openMapModal() {
    if (mapModalEl) {
        sfx.playClick();
        setHeroTokenPosition(state.location || "village", false);
        mapModalEl.classList.remove("hidden");
    }
}

function closeMapModal() {
    if (mapModalEl) {
        mapModalEl.classList.add("hidden");
    }
}

function renderWorldMap() {
    openMapModal();
}

function travelTo(loc) {
    if (isTravelling) return;
    isTravelling = true;
    sfx.playClick();
    setHeroTokenPosition(loc, true);

    setTimeout(() => {
        isTravelling = false;
        closeMapModal();
        if (loc === "village") renderVillage();
        else if (loc === "forest") goForest();
        else if (loc === "temple") goTemple();
        else if (loc === "wilderness") goWilderness();
        else if (loc === "mountain") goMountain();
        else if (loc === "watchtower") goWatchtower();
        else if (loc === "lair") battleDragon();
        else if (loc === "fairy") visitFairyFountain();
    }, 420);
}

function visitFairyFountain() {
    sfx.playClick();
    state.location = "fairy";
    setScene("fairy", "✨ SECRET FAIRY FOUNTAIN");
    clearLog();
    if (!state.fairyVisited) {
        state.fairyVisited = true;
        addLog("✨ You discover a hidden, shimmering Fairy Fountain in a tranquil glade!", "event");
        addLog("Glowing sprites bless your journey. Your health is restored by +50 HP!", "victory");
        healPlayer(50);
        addScore(25);
    } else {
        addLog("The Fairy Fountain is quiet and peaceful. Sprites dance gently over the water.");
    }
    renderChoices([
        { text: "Return to Overworld Map", action: renderWorldMap },
        { text: "Return to Village Square", action: renderVillage }
    ]);
}

// Map Button and Modal Event Handlers
const mapBtnEl = document.getElementById("map-btn");
if (mapBtnEl) {
    mapBtnEl.addEventListener("click", () => {
        openMapModal();
    });
}

if (closeMapModalBtn) {
    closeMapModalBtn.addEventListener("click", closeMapModal);
}

if (mapModalEl) {
    mapModalEl.addEventListener("click", (e) => {
        if (e.target === mapModalEl) {
            closeMapModal();
        }
    });
}

document.querySelectorAll(".map-pin, .map-dest-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const loc = btn.getAttribute("data-location");
        if (loc) {
            travelTo(loc);
        }
    });
});

// --- Hero Status Screen Modal Handlers ---

const statsModalEl = document.getElementById("stats-modal");
const statsBtnEl = document.getElementById("stats-btn");
const closeStatsModalBtn = document.getElementById("close-stats-modal-btn");

function updateStatsModalUI() {
    const statHeroNameEl = document.getElementById("stat-hero-name");
    const statHeroLvlEl = document.getElementById("stat-hero-lvl");
    const statHeroExpEl = document.getElementById("stat-hero-exp");
    const statAvailableApEl = document.getElementById("stat-available-ap");

    if (statHeroNameEl) statHeroNameEl.textContent = state.name;
    if (statHeroLvlEl) statHeroLvlEl.textContent = state.level;
    if (statHeroExpEl) statHeroExpEl.textContent = `${state.exp} / ${state.expToNextLevel}`;
    if (statAvailableApEl) statAvailableApEl.textContent = state.ap;

    const attrStrValEl = document.getElementById("attr-str-val");
    const attrAgiValEl = document.getElementById("attr-agi-val");
    const attrEndValEl = document.getElementById("attr-end-val");
    const attrLckValEl = document.getElementById("attr-lck-val");

    if (attrStrValEl) attrStrValEl.textContent = state.str;
    if (attrAgiValEl) attrAgiValEl.textContent = state.agi;
    if (attrEndValEl) attrEndValEl.textContent = state.end;
    if (attrLckValEl) attrLckValEl.textContent = state.lck;

    const { minDmg, maxDmg } = calculateDamageRange();
    const derivedDmgValEl = document.getElementById("derived-dmg-val");
    const derivedCritValEl = document.getElementById("derived-crit-val");
    const derivedDodgeValEl = document.getElementById("derived-dodge-val");
    const derivedArmorValEl = document.getElementById("derived-armor-val");

    if (derivedDmgValEl) derivedDmgValEl.textContent = `${minDmg} - ${maxDmg}`;
    if (derivedCritValEl) derivedCritValEl.textContent = `${calculateCritChance().toFixed(1)}%`;
    if (derivedDodgeValEl) derivedDodgeValEl.textContent = `${calculateDodgeChance().toFixed(1)}%`;
    if (derivedArmorValEl) derivedArmorValEl.textContent = `${calculateMitigation().toFixed(1)}`;

    document.querySelectorAll(".add-ap-btn").forEach(btn => {
        if (state.ap <= 0) {
            btn.style.opacity = "0.5";
            btn.style.cursor = "not-allowed";
        } else {
            btn.style.opacity = "1";
            btn.style.cursor = "pointer";
        }
    });
}

function openStatsModal() {
    if (statsModalEl) {
        sfx.playClick();
        updateStatsModalUI();
        statsModalEl.classList.remove("hidden");
    }
}

function closeStatsModal() {
    if (statsModalEl) {
        statsModalEl.classList.add("hidden");
    }
}

function allocateAP(attr) {
    if (state.ap <= 0) {
        addLog("No Attribute Points (AP) available! Level up to earn more.", "alert");
        return;
    }
    state.ap -= 1;
    state[attr] += 1;
    if (attr === "end") {
        const oldMax = state.maxHp;
        state.maxHp = calculateMaxHp();
        state.hp += (state.maxHp - oldMax);
    }
    sfx.playItem();
    updateHUD();
    updateStatsModalUI();
    addLog(`💪 Allocated +1 to ${attr.toUpperCase()}! (Current ${attr.toUpperCase()}: ${state[attr]})`, "event");
}

if (statsBtnEl) {
    statsBtnEl.addEventListener("click", openStatsModal);
}

if (closeStatsModalBtn) {
    closeStatsModalBtn.addEventListener("click", closeStatsModal);
}

if (statsModalEl) {
    statsModalEl.addEventListener("click", (e) => {
        if (e.target === statsModalEl) {
            closeStatsModal();
        }
    });
}

document.querySelectorAll(".add-ap-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const attr = btn.getAttribute("data-attr");
        if (attr) {
            allocateAP(attr);
        }
    });
});
