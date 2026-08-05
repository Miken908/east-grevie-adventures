/* ==========================================================================
   EAST GREVIE ADVENTURES (1984) - RETRO GAME ENGINE, HEROIC ATTRIBUTES & AUDIO SYNTHESIZER
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
    gold: 50,
    score: 0,
    inventory: ["Bread"],
    equipment: {
        weapon: { name: "Wooden Sword", bonusStr: 0, bonusMinDmg: 8, bonusMaxDmg: 15 },
        shield: { name: "Wooden Shield", bonusArmor: 5, bonusEnd: 0 },
        armor: { name: "Traveler's Tunic", bonusArmor: 1, bonusAgi: 0 },
        accessory: null
    },
    blueprintReturned: false,
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
    dragonExposed: false,
    location: "village"
};

// --- Proposal 1: Heroic Attribute, Equipment & Combat Formulas ---

function calculateEquipmentBonuses() {
    let str = 0, agi = 0, end = 0, lck = 0, armor = 0, hp = 0;
    if (state.equipment) {
        Object.values(state.equipment).forEach(item => {
            if (item) {
                if (item.bonusStr) str += item.bonusStr;
                if (item.bonusAgi) agi += item.bonusAgi;
                if (item.bonusEnd) end += item.bonusEnd;
                if (item.bonusLck) lck += item.bonusLck;
                if (item.bonusArmor) armor += item.bonusArmor;
                if (item.bonusMaxHp) hp += item.bonusMaxHp;
            }
        });
    }
    return { str, agi, end, lck, armor, hp };
}

function calculateMaxHp() {
    const eq = calculateEquipmentBonuses();
    const totalEnd = state.end + eq.end;
    return 100 + (totalEnd * 15) + (state.level * 10) + eq.hp;
}

function calculateDamageRange() {
    const eq = calculateEquipmentBonuses();
    const totalStr = state.str + eq.str;
    let baseMin = 8, baseMax = 15;
    if (state.equipment && state.equipment.weapon) {
        baseMin = state.equipment.weapon.bonusMinDmg || 8;
        baseMax = state.equipment.weapon.bonusMaxDmg || 15;
    }
    if (state.hasSword) {
        baseMin = 35;
        baseMax = 50;
    }
    const minDmg = baseMin + Math.floor(totalStr * 1.2) + state.level;
    const maxDmg = baseMax + Math.floor(totalStr * 2.0) + (state.level * 2);
    return { minDmg, maxDmg };
}

function calculateCritChance() {
    const eq = calculateEquipmentBonuses();
    const totalLck = state.lck + eq.lck;
    const totalAgi = state.agi + eq.agi;
    return Math.min(50, 5 + (totalLck * 2) + (totalAgi * 1));
}

function calculateCritMultiplier() {
    const eq = calculateEquipmentBonuses();
    const totalAgi = state.agi + eq.agi;
    return 1.5 + (totalAgi * 0.05);
}

function calculateDodgeChance() {
    const eq = calculateEquipmentBonuses();
    const totalAgi = state.agi + eq.agi;
    return Math.min(35, totalAgi * 1.5);
}

function calculateMitigation() {
    const eq = calculateEquipmentBonuses();
    const totalEnd = state.end + eq.end;
    return eq.armor + Math.floor(totalEnd * 0.8);
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
    { name: "Wild Weasel", hp: 28, dmgLow: 6, dmgHigh: 12 },
    { name: "Barn Owl", hp: 35, dmgLow: 8, dmgHigh: 14 },
    { name: "Giant Garden Toad", hp: 24, dmgLow: 4, dmgHigh: 9 },
    { name: "Alley Rat Rogue", hp: 38, dmgLow: 7, dmgHigh: 13 },
    { name: "Feral Farm Cat", hp: 45, dmgLow: 9, dmgHigh: 15 }
];

// Image assets mapping
const sceneImages = {
    village: "assets/images/village.jpg",
    forest: "assets/images/Whispering forest.jpg",
    goblin: "assets/images/goblin.jpg",
    temple: "assets/images/temple_sanctum.jpg",
    mountain: "assets/images/rocky_mountain_pass.jpg",
    lair: "assets/images/final_boss_rodrigues_solo_1785946852711.jpg",
    watchtower: "assets/images/old_watchtower.jpg",
    blacksmith: "assets/images/Blacksmith.jpg",
    wilderness: "assets/images/wilderness_trail.jpg",
    troll: "assets/images/snake_cave_treasure_draft.jpg",
    cave: "assets/images/snake_cave_treasure_draft.jpg",
    map: "assets/images/worldmap.png",
    fairy: "assets/images/secret_fairy_fountain.jpg",
    victory: "assets/images/final_boss_rodrigues_solo_1785946852711.jpg"
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

function addGold(baseGold) {
    const lckBonusMult = 1 + (state.lck * 0.08);
    const finalGold = Math.round(baseGold * lckBonusMult);
    state.gold += finalGold;
    addLog(`💰 Received +${finalGold} Gold! [Total: 💰 ${state.gold}]`, "event");
    sfx.playItem();
    updateHUD();
    return finalGold;
}

function updateHUD() {
    state.maxHp = calculateMaxHp();
    heroNameEl.textContent = state.name;
    if (levelTextEl) levelTextEl.textContent = state.level;
    const hpPct = Math.max(0, (state.hp / state.maxHp) * 100);
    hpBarEl.style.width = `${hpPct}%`;
    hpTextEl.textContent = `${state.hp}/${state.maxHp}`;
    scoreTextEl.textContent = String(state.score).padStart(6, '0');

    const goldTextEl = document.getElementById("gold-text");
    if (goldTextEl) goldTextEl.textContent = `💰 ${state.gold}`;

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
    if (state.equipment) {
        if (state.equipment.weapon) {
            const span = document.createElement("span");
            span.className = "item-pill equipment";
            span.textContent = `⚔️ ${state.equipment.weapon.name}`;
            inventoryListEl.appendChild(span);
        }
        if (state.equipment.shield) {
            const span = document.createElement("span");
            span.className = "item-pill equipment";
            span.textContent = `🛡️ ${state.equipment.shield.name}`;
            inventoryListEl.appendChild(span);
        }
        if (state.equipment.armor) {
            const span = document.createElement("span");
            span.className = "item-pill equipment";
            span.textContent = `🥋 ${state.equipment.armor.name}`;
            inventoryListEl.appendChild(span);
        }
        if (state.equipment.accessory) {
            const span = document.createElement("span");
            span.className = "item-pill equipment";
            span.textContent = `💍 ${state.equipment.accessory.name}`;
            inventoryListEl.appendChild(span);
        }
    }
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
    setScene("village", "VILLAGE SQUARE");
    clearLog();
    addLog("You are at the Village Square of East Grevie.");
    addLog("Townspeople gather around whispering in panic. Cobblestone paths lead in three directions.");

    renderChoices([
        { text: "1. Speak to Wise Elder by fountain", action: speakToElder },
        { text: "2. Visit the Blacksmith", action: goBlacksmith },
        { text: "3. Rest at Tavern (Full Rest)", action: restTavern },
        { text: "4. Venture into the Wilderness Trail", action: goWilderness },
        { text: "5. Open World Map", action: renderWorldMap }
    ]);
}

function goBlacksmith() {
    sfx.playClick();
    renderBlacksmith();
}

function renderBlacksmith() {
    state.location = "blacksmith";
    sfx.playMusic("village");
    setScene("blacksmith", "BLACKSMITH'S FORGE & SHOP");
    clearLog();
    addLog("Sparks fly as the burly blacksmith hammers away at glowing steel.");

    if (!state.blueprintReturned && !state.inventory.includes("Stolen Blacksmith Blueprint")) {
        addLog("Blacksmith: 'A treacherous Goblin Rogue stole my Mastercraft Blueprint in the Whispering Forest!'", "alert");
        addLog("Blacksmith: 'Track down that rogue, recover my blueprint, and return it to me so I can open my forge and craft equipment for you!'");
        renderChoices([{ text: "Return to Village Square", action: renderVillage }]);
        return;
    }

    if (state.inventory.includes("Stolen Blacksmith Blueprint")) {
        addLog("Blacksmith: 'By the gods! You recovered my Stolen Mastercraft Blueprint!'", "victory");
        addLog("Blacksmith: 'Here is 100 Gold for your bravery! My Mastercraft Forge is now open to you.'", "event");
        const idx = state.inventory.indexOf("Stolen Blacksmith Blueprint");
        if (idx !== -1) state.inventory.splice(idx, 1);
        state.blueprintReturned = true;
        addGold(100);
        addScore(100);
    }

    addLog(`💰 Current Gold: ${state.gold} | Merchant Discount: -${Math.min(30, state.lck * 2)}%`);

    const choices = [];
    const discount = Math.min(0.30, state.lck * 0.02);

    const broadswordOwned = state.equipment.weapon && state.equipment.weapon.name === "Iron Broadsword";
    const broadswordCost = Math.round(110 * (1 - discount));
    choices.push({
        text: broadswordOwned ? `1. ⚔️ Iron Broadsword - [ EQUIPPED ]` : `1. ⚔️ Buy Iron Broadsword (+15 Dmg, +2 STR) - 💰 ${broadswordCost} Gold`,
        action: broadswordOwned ? () => { sfx.playClick(); addLog("You already own and have equipped the Iron Broadsword!"); } : () => buyEquipment("weapon", { name: "Iron Broadsword", bonusStr: 2, bonusMinDmg: 18, bonusMaxDmg: 28 }, broadswordCost)
    });

    const ironShieldOwned = state.equipment.shield && state.equipment.shield.name === "Reinforced Tower Shield";
    const ironShieldCost = Math.round(90 * (1 - discount));
    choices.push({
        text: ironShieldOwned ? `2. 🛡️ Reinforced Tower Shield - [ EQUIPPED ]` : `2. 🛡️ Buy Reinforced Tower Shield (+10 Armor, +2 END, +20 HP) - 💰 ${ironShieldCost} Gold`,
        action: ironShieldOwned ? () => { sfx.playClick(); addLog("You already own and have equipped the Reinforced Tower Shield!"); } : () => buyEquipment("shield", { name: "Reinforced Tower Shield", bonusArmor: 10, bonusEnd: 2, bonusMaxHp: 20 }, ironShieldCost)
    });

    const armorOwned = state.equipment.armor && state.equipment.armor.name === "Dragon-Scale Armor";
    const armorCost = Math.round(100 * (1 - discount));
    choices.push({
        text: armorOwned ? `3. 🥋 Dragon-Scale Armor - [ EQUIPPED ]` : `3. 🥋 Buy Dragon-Scale Armor (+8 Armor, +2 AGI, +30 HP) - 💰 ${armorCost} Gold`,
        action: armorOwned ? () => { sfx.playClick(); addLog("You already own and have equipped the Dragon-Scale Armor!"); } : () => buyEquipment("armor", { name: "Dragon-Scale Armor", bonusArmor: 8, bonusAgi: 2, bonusMaxHp: 30 }, armorCost)
    });

    const ringOwned = state.equipment.accessory && state.equipment.accessory.name === "Ring of Power";
    const ringCost = Math.round(130 * (1 - discount));
    choices.push({
        text: ringOwned ? `4. 💍 Ring of Power - [ EQUIPPED ]` : `4. 💍 Buy Ring of Power (+2 LCK, +1 ALL STATS) - 💰 ${ringCost} Gold`,
        action: ringOwned ? () => { sfx.playClick(); addLog("You already own and have equipped the Ring of Power!"); } : () => buyEquipment("accessory", { name: "Ring of Power", bonusLck: 2, bonusStr: 1, bonusAgi: 1, bonusEnd: 1 }, ringCost)
    });

    const potionCost = Math.round(35 * (1 - discount));
    choices.push({
        text: `5. 🧪 Buy Healing Potion (+40 HP) - 💰 ${potionCost} Gold`,
        action: () => buyPotion(potionCost)
    });

    choices.push({ text: "6. Return to Village Square", action: renderVillage });

    renderChoices(choices);
}

function buyEquipment(slot, itemObj, cost) {
    sfx.playClick();
    if (state.gold < cost) {
        addLog(`Blacksmith: 'You don't have enough Gold! You need 💰 ${cost} Gold.'`, "alert");
    } else {
        state.gold -= cost;
        state.equipment[slot] = itemObj;
        addLog(`✨ Purchased & equipped ${itemObj.name}!`, "victory");
        sfx.playItem();
        updateHUD();
    }
    renderBlacksmith();
}

function buyPotion(cost) {
    sfx.playClick();
    if (state.gold < cost) {
        addLog(`Blacksmith: 'You don't have enough Gold! You need 💰 ${cost} Gold.'`, "alert");
    } else {
        state.gold -= cost;
        state.inventory.push("Healing Potion");
        addLog("🧪 Purchased 1 Healing Potion!", "event");
        sfx.playItem();
        updateHUD();
    }
    renderBlacksmith();
}

function speakToElder() {
    sfx.playClick();
    addLog("Elder: 'Brave adventurer! The Sunblade lies hidden inside The Temple Sanctum across the Whispering Forest.'");
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
    setScene("forest", "WHISPERING FOREST");
    clearLog();
    addLog("Ancient trees blot out the sky. Twisted roots line the misty trail.");

    const choices = [
        { text: "1. Explore The Temple Sanctum", action: goTemple },
        { text: "2. Investigate glowing tree stump", action: investigateStump },
        { text: "3. Fight Goblin Rogue", action: battleGoblin },
        { text: "4. Open World Map", action: renderWorldMap }
    ];

    renderChoices(choices);
}

function investigateStump() {
    sfx.playClick();
    if (!state.stumpSearched) {
        addLog("You examine the glowing stump and find a shimmering Healing Potion and hidden coins!", "event");
        state.stumpSearched = true;
        state.inventory.push("Healing Potion");
        addGold(25);
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
    setScene("temple", "THE TEMPLE SANCTUM");
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
        { text: "2. Return to Whispering Forest", action: renderForest }
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
        addLog("The pedestal lock requires a key! Speak to the Elder in East Grevie Village.", "alert");
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
    setScene("goblin", "GOBLIN ROGUE ENCOUNTER");
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
        addLog("📜 You retrieved the STOLEN BLACKSMITH BLUEPRINT from the Goblin Rogue!", "event");
        state.goblinDefeated = true;
        state.inventory.push("Stolen Blacksmith Blueprint");
        addGold(50);
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
    setScene("mountain", "ROCKY MOUNTAIN PASS");
    clearLog();
    addLog("Howling winds blow across narrow ledges. High above lies Cat's Hall.");

    renderChoices([
        { text: "1. Ascend to Cat's Hall", action: battleDragon },
        { text: "2. Search Mountain Cave for supplies", action: searchCave },
        { text: "3. Explore the Old Watchtower ruins", action: goWatchtower },
        { text: "4. Open World Map", action: renderWorldMap }
    ]);
}

function goWatchtower() {
    sfx.playClick();
    renderWatchtower();
}

function renderWatchtower() {
    state.location = "watchtower";
    sfx.playMusic("forest");
    setScene("watchtower", "OLD WATCHTOWER");
    clearLog();
    addLog("A crumbling stone tower leans over the cliffside, its door hanging off its hinges.");

    if (state.knightFreed) {
        addLog("The watchtower is empty and silent. Sir Johan already rides free.");
        renderChoices([{ text: "Return to Mountain Pass", action: renderMountain }]);
        return;
    }

    addLog("Inside, chained to a support beam, lies a wounded Knight - Sir Johan.");
    renderChoices([
        { text: "1. Free the Knight", action: freeKnight },
        { text: "2. Leave him chained and go", action: renderMountain }
    ]);
}

function freeKnight() {
    sfx.playClick();
    addLog("Sir Johan: 'My thanks, friend! I owe you a life-debt. If ever you face Rodrigues, call for me!'", "event");
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
    setScene("troll", "MOUNTAIN CAVE");
    clearLog();
    addLog("A Giant Mountain Snake coils in the shadows, guarding a chest of glittering treasure!", "alert");

    renderChoices([
        { text: "1. Fight the Mountain Snake", action: startTrollFight },
        { text: "2. Sneak past while it's resting", action: sneakPastTroll },
        { text: "3. Retreat to the Mountain Pass", action: renderMountain }
    ]);
}

function sneakPastTroll() {
    sfx.playClick();
    addLog("You slip past the resting Snake and find a sturdy Elven Shield & Elixir of Life!", "event");
    state.caveSearched = true;
    state.inventory.push("Elixir of Life");
    healPlayer(50);
    addScore(100);
    renderChoices([{ text: "Return to Mountain Pass", action: renderMountain }]);
}

function startTrollFight() {
    sfx.playClick();
    sfx.playMusic("battle");
    addLog("The Mountain Snake rattles its tail and strikes forward!", "alert");
    state.trollHp = 60;
    renderTrollTurn();
}

function renderTrollTurn() {
    addLog(`Mountain Snake HP: ${state.trollHp} | Your HP: ${state.hp}`);
    renderChoices([
        { text: "1. Attack Snake with weapon", action: attackTroll },
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
        addLog(`💥 CRITICAL HIT! You strike the Mountain Snake for ${dmg} damage!`, "victory");
    } else {
        addLog(`You strike the Mountain Snake for ${dmg} damage!`, "event");
    }

    if (state.trollHp <= 0) {
        addLog("🎉 You defeated the Mountain Snake!", "victory");
        state.caveSearched = true;
        state.inventory.push("Elixir of Life");
        healPlayer(50);
        addGold(100);
        addScore(250);
        renderChoices([{ text: "Return to Mountain Pass", action: renderMountain }]);
        return;
    }

    const tDmg = mitigate(Math.floor(Math.random() * 9) + 10);
    state.hp -= tDmg;
    addLog(`The Mountain Snake bites with venomous fangs for ${tDmg} damage!`, "alert");
    updateHUD();

    if (state.hp <= 0) {
        gameOver("You were defeated by the Mountain Snake in the cave.");
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

    setScene("wilderness", "WILDERNESS TRAIL");
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
        addGold(30);
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
        addLog("🏥 Kind townspeople found you on the trail and brought you back to East Grevie Village to recover.", "event");
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
    setScene("lair", "CAT'S HALL");
    clearLog();
    addLog("Shadows stretch across the grand stone hall. Atop a velvet cushion throne lies Princess Anna in chains!", "alert");
    addLog("Lord Rodrigues the Vile Shadow Cat uncoils with an intimidating hiss!", "alert");

    if (!state.hasSword) {
        addLog("⚠️ WARNING: You do not possess the Sunblade! Your weapons cannot penetrate Rodrigues's fur!", "alert");
    }

    renderDragonTurn();
}

function renderDragonTurn() {
    addLog(`🐾 RODRIGUES HP: ${state.dragonHp} | YOUR HP: ${state.hp}`);
    const choices = [
        { text: "1. Slash with Weapon", action: attackDragon },
        { text: "2. Raise Shield to Defend & Charge", action: defendDragon },
        { text: "3. Drink Healing Potion", action: useHealDragon },
        { text: "4. Flee to Mountain Pass", action: renderMountain }
    ];
    if (state.knightFreed && !state.knightAllyUsed) {
        choices.push({ text: "5. Call upon Sir Johan to strike Rodrigues", action: callKnightAlly });
    }
    renderChoices(choices);
}

function callKnightAlly() {
    sfx.playSlash();
    const dmg = Math.floor(Math.random() * 11) + 25;
    state.dragonHp -= dmg;
    state.knightAllyUsed = true;
    addLog(`⚔️ Sir Johan charges in and strikes Rodrigues for ${dmg} damage - the cat has no chance to retaliate!`, "victory");

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
        const rolled = rollAttack();
        dmg = rolled.dmg;
        if (state.dragonExposed) {
            dmg = Math.floor(dmg * 1.5);
            state.dragonExposed = false;
            addLog(`🎯 WEAK SPOT STRICKEN! You deal ${dmg} EXTRA CRITICAL DAMAGE!`, "victory");
        } else if (rolled.crit) {
            addLog(`💥⚔️ CRITICAL HIT! The Sunblade cleaves through the cat's thick fur for ${dmg} massive damage!`, "victory");
        } else {
            addLog(`💥 The Sunblade pierces the cat's thick fur for ${dmg} DAMAGE!`, "victory");
        }
        state.dragonHp -= dmg;
    } else {
        addLog("🛡️ YOUR WEAPON REBOUNDS HARMLESSLY OFF RODRIGUES'S THICK FUR! (0 Damage)", "alert");
        addLog("Without the Legendary Sunblade, no mortal weapon can pierce the cat's fur!", "alert");
        state.dragonExposed = false;
    }

    if (state.dragonHp <= 0) {
        winGame();
        return;
    }

    // Cat counter attack
    const dDmg = mitigate(Math.floor(Math.random() * 16) + 20);
    state.hp -= dDmg;
    addLog(`Rodrigues slashes with razor claws! You take ${dDmg} damage!`, "alert");
    updateHUD();

    if (state.hp <= 0) {
        gameOver("You fell in battle against Rodrigues the Shadow Cat.");
        return;
    }

    renderDragonTurn();
}

function defendDragon() {
    sfx.playClick();
    addLog("🛡️ YOU RAISE YOUR SHIELD TO BLOCK RODRIGUES'S RAZOR CLAWS!", "event");
    const rawDmg = Math.floor(Math.random() * 8) + 12;
    const dDmg = Math.max(1, Math.floor(rawDmg * 0.20));
    state.hp -= dDmg;
    addLog(`Your shield absorbs 80% of the cat's strike! You take only ${dDmg} damage!`, "event");
    addLog("✨ RODRIGUES EXPOSES A VULNERABLE WEAK SPOT IN ITS CHEST FUR! Your next attack will deal +50% EXTRA DAMAGE!", "victory");
    state.dragonExposed = true;
    updateHUD();

    if (state.hp <= 0) {
        gameOver("You fell in battle against Rodrigues the Shadow Cat.");
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

function getHeroRating(score) {
    if (score >= 1000) return "GRAND HERO OF EAST GREVIE";
    if (score >= 700) return "MASTER DRAGON SLAYER";
    if (score >= 400) return "VALIANT DEFENDER OF THE REALM";
    return "NOVICE ADVENTURER OF EAST GREVIE";
}

function winGame() {
    clearLog();
    sfx.playVictory();
    addScore(1000);

    const rating = getHeroRating(state.score);

    addLog("============================================================", "victory");
    addLog("           VICTORY! THE KINGDOM IS SAVED!", "victory");
    addLog("============================================================", "victory");
    addLog("You vanquished Rodrigues the Shadow Cat, rescued Princess Anna, and saved East Grevie!", "event");

    let speechText = `Victory! Hear ye, people of East Grevie! The hero ${state.name} has vanquished Rodrigues the Shadow Cat and rescued Princess Anna from Cat's Hall!`;
    if (state.knightFreed) {
        speechText += " Sir Johan rides beside you into the Citadel, his life-debt repaid in honor!";
        addLog("Sir Johan rides beside you into the Citadel, his life-debt repaid in blood and fire.", "event");
    }
    if (state.goblinSpared) {
        speechText += " Word spreads of the noble mercy you showed the Goblin Rogue.";
        addLog("Word spreads of the mercy you showed the Goblin Rogue in the Whispering Forest.", "event");
    } else if (state.goblinDefeated) {
        addLog("Tales of the Goblin Rogue you slew in the misty forest travel far and wide.", "event");
    }
    speechText += ` Peace has returned to the Realm, and ${state.name} shall be remembered forever as ${rating}!`;

    addLog(`FINAL SCORE: ${state.score} PTS | RATING: ${rating}`, "victory");

    // Populate and display Victory Modal End Screen
    const victoryModalEl = document.getElementById("victory-modal");
    const victoryLoreTextEl = document.getElementById("victory-lore-text");
    const victoryScoreEl = document.getElementById("victory-score");
    const victoryLevelEl = document.getElementById("victory-level");
    const victoryRatingEl = document.getElementById("victory-rating");

    if (victoryRatingEl) victoryRatingEl.textContent = `RATING: ${rating}`;
    if (victoryLoreTextEl) victoryLoreTextEl.innerHTML = `<em>"${speechText}"</em>`;
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
    state.gold = 50;
    state.ap = 0;
    state.level = 1;
    state.exp = 0;
    state.expToNextLevel = 100;
    state.score = 0;
    state.inventory = ["Bread"];
    state.equipment = {
        weapon: { name: "Wooden Sword", bonusStr: 0, bonusMinDmg: 8, bonusMaxDmg: 15 },
        shield: { name: "Wooden Shield", bonusArmor: 5, bonusEnd: 0 },
        armor: { name: "Traveler's Tunic", bonusArmor: 1, bonusAgi: 0 },
        accessory: null
    };
    state.blueprintReturned = false;
    state.maxHp = calculateMaxHp();
    state.hp = state.maxHp;
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
        narrator.speak(`Welcome, ${heroName}! The Village of East Grevie is in shadow. The dreaded Cat Rodrigues has captured Princess Anna and fled to Cat's Hall. Without the Legendary Sunblade, no mortal weapon can pierce the beast's fur...`);
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

// Fullscreen Artwork Lightbox Modal Handlers
const imageFrameEl = document.getElementById("image-frame-container");
const lightboxModalEl = document.getElementById("lightbox-modal");
const lightboxImgEl = document.getElementById("lightbox-img");
const lightboxTitleEl = document.getElementById("lightbox-location-title");
const lightboxCloseBtnEl = document.getElementById("lightbox-close-btn");

if (imageFrameEl && lightboxModalEl) {
    imageFrameEl.addEventListener("click", () => {
        if (sceneImgEl && lightboxImgEl) {
            lightboxImgEl.src = sceneImgEl.src;
            if (lightboxTitleEl && locationNameEl) {
                lightboxTitleEl.textContent = locationNameEl.textContent;
            }
            lightboxModalEl.classList.remove("hidden");
        }
    });
    lightboxModalEl.addEventListener("click", () => {
        lightboxModalEl.classList.add("hidden");
    });
    if (lightboxCloseBtnEl) {
        lightboxCloseBtnEl.addEventListener("click", (e) => {
            e.stopPropagation();
            lightboxModalEl.classList.add("hidden");
        });
    }
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && !lightboxModalEl.classList.contains("hidden")) {
            lightboxModalEl.classList.add("hidden");
        }
    });
}

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
        voiceBtnEl.textContent = `VOICE: ${narrator.enabled ? "ON" : "OFF"}`;
        if (!narrator.enabled) {
            narrator.stop();
        }
    });
}

if (musicBtnEl) {
    musicBtnEl.addEventListener("click", () => {
        sfx.musicEnabled = !sfx.musicEnabled;
        musicBtnEl.textContent = `MUSIC: ${sfx.musicEnabled ? "ON" : "OFF"}`;
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
    soundBtnEl.textContent = `SFX: ${sfx.enabled ? "ON" : "OFF"}`;
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
    setScene("fairy", "SECRET FAIRY FOUNTAIN");
    clearLog();
    if (!state.fairyVisited) {
        state.fairyVisited = true;
        addLog("✨ You discover a hidden, shimmering Fairy Fountain in a tranquil glade!", "event");
        addLog("Glowing sprites bless your journey with health and fairy gold!", "victory");
        healPlayer(50);
        addGold(30);
        addScore(100);
    } else {
        addLog("The fairy sprites welcome you warmly.");
        healPlayer(20);
    }
    renderChoices([
        { text: "Return to World Map", action: renderWorldMap },
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

    const eq = calculateEquipmentBonuses();

    if (attrStrValEl) attrStrValEl.textContent = eq.str > 0 ? `${state.str} (+${eq.str})` : state.str;
    if (attrAgiValEl) attrAgiValEl.textContent = eq.agi > 0 ? `${state.agi} (+${eq.agi})` : state.agi;
    if (attrEndValEl) attrEndValEl.textContent = eq.end > 0 ? `${state.end} (+${eq.end})` : state.end;
    if (attrLckValEl) attrLckValEl.textContent = eq.lck > 0 ? `${state.lck} (+${eq.lck})` : state.lck;

    const { minDmg, maxDmg } = calculateDamageRange();
    const derivedDmgValEl = document.getElementById("derived-dmg-val");
    const derivedCritValEl = document.getElementById("derived-crit-val");
    const derivedDodgeValEl = document.getElementById("derived-dodge-val");
    const derivedArmorValEl = document.getElementById("derived-armor-val");

    if (derivedDmgValEl) derivedDmgValEl.textContent = `${minDmg} - ${maxDmg}`;
    if (derivedCritValEl) derivedCritValEl.textContent = `${calculateCritChance().toFixed(1)}%`;
    if (derivedDodgeValEl) derivedDodgeValEl.textContent = `${calculateDodgeChance().toFixed(1)}%`;
    if (derivedArmorValEl) derivedArmorValEl.textContent = `${calculateMitigation().toFixed(1)}`;

    const equipWeaponValEl = document.getElementById("equip-weapon-val");
    const equipShieldValEl = document.getElementById("equip-shield-val");
    const equipArmorValEl = document.getElementById("equip-armor-val");
    const equipAccessoryValEl = document.getElementById("equip-accessory-val");

    if (equipWeaponValEl) equipWeaponValEl.textContent = state.equipment.weapon ? state.equipment.weapon.name : "None";
    if (equipShieldValEl) equipShieldValEl.textContent = state.equipment.shield ? state.equipment.shield.name : "None";
    if (equipArmorValEl) equipArmorValEl.textContent = state.equipment.armor ? state.equipment.armor.name : "None";
    if (equipAccessoryValEl) equipAccessoryValEl.textContent = state.equipment.accessory ? state.equipment.accessory.name : "None";

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

document.querySelectorAll(".info-icon-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const targetId = btn.getAttribute("data-info");
        if (targetId) {
            const targetEl = document.getElementById(targetId);
            if (targetEl) {
                targetEl.classList.toggle("hidden");
                sfx.playClick();
            }
        }
    });
});
