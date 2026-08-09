/* ==========================================================================
   EAST GREVIE ADVENTURES - GAME ENGINE, HEROIC ATTRIBUTES & AUDIO SYNTHESIZER
   ========================================================================== */

// --- Modern Web Audio Soundscape & Audio Processing Engine ---
class SoundEffects {
    constructor() {
        this.ctx = null;
        this.enabled = true;
        this.musicEnabled = true;
        this.currentTrack = null;
        this.musicTimer = null;
        this.noteIndex = 0;

        // Modern Volume Gains
        this.masterVolume = 0.8;
        this.musicVolume = 0.6;
        this.sfxVolume = 0.7;
        this.voiceVolume = 1.0;

        this.masterGain = null;
        this.musicGain = null;
        this.sfxGain = null;
        this.voiceGain = null;

        this.duckingActive = false;
    }

    init() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;
            this.ctx = new AudioCtx();

            // Setup Master Bus Architecture
            this.masterGain = this.ctx.createGain();
            this.masterGain.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime);

            this.musicGain = this.ctx.createGain();
            this.musicGain.gain.setValueAtTime(this.musicVolume, this.ctx.currentTime);

            this.sfxGain = this.ctx.createGain();
            this.sfxGain.gain.setValueAtTime(this.sfxVolume, this.ctx.currentTime);

            this.voiceGain = this.ctx.createGain();
            this.voiceGain.gain.setValueAtTime(this.voiceVolume, this.ctx.currentTime);

            this.musicGain.connect(this.masterGain);
            this.sfxGain.connect(this.masterGain);
            this.voiceGain.connect(this.masterGain);
            this.masterGain.connect(this.ctx.destination);
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    setMasterVolume(val) {
        this.masterVolume = Math.max(0, Math.min(1, val));
        if (this.masterGain && this.ctx) {
            this.masterGain.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime);
        }
    }

    setMusicVolume(val) {
        this.musicVolume = Math.max(0, Math.min(1, val));
        if (this.musicGain && this.ctx) {
            const targetGain = this.duckingActive ? this.musicVolume * 0.25 : this.musicVolume;
            this.musicGain.gain.setValueAtTime(targetGain, this.ctx.currentTime);
        }
    }

    setSfxVolume(val) {
        this.sfxVolume = Math.max(0, Math.min(1, val));
        if (this.sfxGain && this.ctx) {
            this.sfxGain.gain.setValueAtTime(this.sfxVolume, this.ctx.currentTime);
        }
    }

    setVoiceVolume(val) {
        this.voiceVolume = Math.max(0, Math.min(1, val));
        if (this.voiceGain && this.ctx) {
            this.voiceGain.gain.setValueAtTime(this.voiceVolume, this.ctx.currentTime);
        }
    }

    setDucking(active) {
        this.duckingActive = active;
        if (!this.ctx || !this.musicGain) return;
        const now = this.ctx.currentTime;
        const target = active ? this.musicVolume * 0.25 : this.musicVolume;
        this.musicGain.gain.cancelScheduledValues(now);
        this.musicGain.gain.linearRampToValueAtTime(target, now + (active ? 0.35 : 0.6));
    }

    playClick() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'sine';
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2400, now);

        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.05);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.12, now + 0.008);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.sfxGain || this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.05);
    }

    playSlash() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const bufferSize = this.ctx.sampleRate * 0.12;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }

        const whiteNoise = this.ctx.createBufferSource();
        whiteNoise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1800, now);
        filter.frequency.exponentialRampToValueAtTime(300, now + 0.12);

        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.001, now);
        noiseGain.gain.linearRampToValueAtTime(0.2, now + 0.02);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

        whiteNoise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(this.sfxGain || this.ctx.destination);

        whiteNoise.start(now);

        const osc = this.ctx.createOscillator();
        const oscGain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(350, now);
        osc.frequency.exponentialRampToValueAtTime(110, now + 0.10);

        oscGain.gain.setValueAtTime(0.001, now);
        oscGain.gain.linearRampToValueAtTime(0.15, now + 0.015);
        oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.10);

        osc.connect(oscGain);
        oscGain.connect(this.sfxGain || this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.10);
    }

    playHeal() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const chord = [523.25, 659.25, 783.99, 1046.50];
        chord.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const filter = this.ctx.createBiquadFilter();

            osc.type = 'sine';
            filter.type = 'lowpass';
            filter.frequency.value = 2200;

            const noteStart = now + idx * 0.07;
            osc.frequency.setValueAtTime(freq, noteStart);

            gain.gain.setValueAtTime(0.001, noteStart);
            gain.gain.linearRampToValueAtTime(0.08, noteStart + 0.03);
            gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.35);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this.sfxGain || this.ctx.destination);

            osc.start(noteStart);
            osc.stop(noteStart + 0.35);
        });
    }

    playItem() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const notes = [587.33, 880.00, 1174.66];
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';

            const noteStart = now + idx * 0.06;
            osc.frequency.setValueAtTime(freq, noteStart);

            gain.gain.setValueAtTime(0.001, noteStart);
            gain.gain.linearRampToValueAtTime(0.09, noteStart + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.22);

            osc.connect(gain);
            gain.connect(this.sfxGain || this.ctx.destination);

            osc.start(noteStart);
            osc.stop(noteStart + 0.22);
        });
    }

    playVictory() {
        if (!this.enabled) return;
        this.init();
        if (!this.ctx) return;

        this.stopMusic();
        const now = this.ctx.currentTime;
        const melody = [
            { f: 523.25, d: 0.18 },
            { f: 659.25, d: 0.18 },
            { f: 783.99, d: 0.18 },
            { f: 1046.50, d: 0.40 },
            { f: 880.00, d: 0.25 },
            { f: 1046.50, d: 0.60 }
        ];

        let timeOffset = 0;
        melody.forEach((note) => {
            const osc = this.ctx.createOscillator();
            const subOsc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'triangle';
            subOsc.type = 'sine';

            const noteStart = now + timeOffset;
            osc.frequency.setValueAtTime(note.f, noteStart);
            subOsc.frequency.setValueAtTime(note.f * 0.5, noteStart);

            gain.gain.setValueAtTime(0.001, noteStart);
            gain.gain.linearRampToValueAtTime(0.12, noteStart + 0.04);
            gain.gain.exponentialRampToValueAtTime(0.001, noteStart + note.d);

            osc.connect(gain);
            subOsc.connect(gain);
            gain.connect(this.sfxGain || this.ctx.destination);

            osc.start(noteStart);
            subOsc.start(noteStart);
            osc.stop(noteStart + note.d);
            subOsc.stop(noteStart + note.d);

            timeOffset += note.d * 0.85;
        });
    }

    // --- Modern Polyphonic Atmospheric Soundtracks ---
    playMusic(trackName) {
        if (this.currentTrack === trackName) return;
        this.stopMusic();
        this.currentTrack = trackName;
        if (!this.musicEnabled) return;

        this.init();
        if (!this.ctx) return;

        const tracks = {
            village: [
                { chord: [261.63, 329.63, 392.00], d: 1.8, type: 'sine' },
                { chord: [293.66, 349.23, 440.00], d: 1.8, type: 'triangle' },
                { chord: [329.63, 392.00, 493.88], d: 2.0, type: 'sine' },
                { chord: [349.23, 440.00, 523.25], d: 2.2, type: 'sine' }
            ],
            forest: [
                { chord: [220.00, 261.63, 329.63], d: 2.2, type: 'sine' },
                { chord: [174.61, 261.63, 349.23], d: 2.2, type: 'triangle' },
                { chord: [196.00, 246.94, 293.66], d: 2.4, type: 'sine' }
            ],
            battle: [
                { chord: [146.83, 220.00, 293.66], d: 1.0, type: 'triangle' },
                { chord: [130.81, 196.00, 261.63], d: 1.0, type: 'triangle' },
                { chord: [116.54, 174.61, 233.08], d: 1.2, type: 'triangle' }
            ],
            fairy: [
                { chord: [349.23, 440.00, 523.25, 659.25], d: 2.0, type: 'sine' },
                { chord: [392.00, 493.88, 587.33, 783.99], d: 2.2, type: 'sine' }
            ]
        };

        const sequence = tracks[trackName] || tracks.village;
        this.noteIndex = 0;

        const step = () => {
            if (!this.musicEnabled || this.currentTrack !== trackName) return;
            const pad = sequence[this.noteIndex];
            const now = this.ctx.currentTime;
            const duration = pad.d;

            try {
                pad.chord.forEach((freq) => {
                    const osc = this.ctx.createOscillator();
                    const gain = this.ctx.createGain();
                    const filter = this.ctx.createBiquadFilter();

                    osc.type = pad.type || 'sine';
                    osc.frequency.setValueAtTime(freq, now);

                    filter.type = 'lowpass';
                    filter.frequency.setValueAtTime(1200, now);

                    gain.gain.setValueAtTime(0.001, now);
                    gain.gain.linearRampToValueAtTime(0.035, now + 0.25);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + duration * 0.95);

                    osc.connect(filter);
                    filter.connect(gain);
                    gain.connect(this.musicGain || this.ctx.destination);

                    osc.start(now);
                    osc.stop(now + duration * 0.95);
                });
            } catch (e) {
                // AudioContext fallback
            }

            this.noteIndex = (this.noteIndex + 1) % sequence.length;
            this.musicTimer = setTimeout(step, pad.d * 920);
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

// --- Modern Neural Speech Synthesis Engine ---
class VoiceNarrator {
    constructor() {
        this.synth = window.speechSynthesis || null;
        this.enabled = true;
        this.selectedVoice = null;
        this.speaking = false;
        this.currentSentenceTimeout = null;
        this.onSentenceStart = null;
        this.onSpeechEnd = null;
        this.initVoices();
    }

    initVoices(onReady) {
        if (!this.synth) return;
        const loadVoices = () => {
            const voices = this.synth.getVoices();
            if (!voices || voices.length === 0) return;

            this.selectedVoice = voices.find(v => v.lang.startsWith('en') && (
                v.name.includes('Natural') || v.name.includes('Neural') || v.name.includes('Online') || v.name.includes('HD')
            ) && (v.name.includes('Guy') || v.name.includes('Christopher') || v.name.includes('Male') || v.name.includes('Sonia') || v.name.includes('Jenny') || v.name.includes('UK')))
                || voices.find(v => v.lang.startsWith('en') && (
                    v.name.includes('Natural') || v.name.includes('Neural') || v.name.includes('Google UK English') || v.name.includes('Oliver') || v.name.includes('Serena') || v.name.includes('Daniel')
                ))
                || voices.find(v => v.lang.startsWith('en'))
                || voices[0];

            if (onReady) onReady();
        };

        loadVoices();
        if (this.synth.onvoiceschanged !== undefined) {
            this.synth.onvoiceschanged = loadVoices;
        }
    }

    getAvailableVoices() {
        if (!this.synth) return [];
        const voices = this.synth.getVoices() || [];
        const englishVoices = voices.filter(v => v.lang.startsWith('en'));
        englishVoices.sort((a, b) => {
            const aNeural = a.name.includes('Natural') || a.name.includes('Neural') || a.name.includes('Online') || a.name.includes('HD');
            const bNeural = b.name.includes('Natural') || b.name.includes('Neural') || b.name.includes('Online') || b.name.includes('HD');
            if (aNeural && !bNeural) return -1;
            if (!aNeural && bNeural) return 1;
            return a.name.localeCompare(b.name);
        });
        return englishVoices.length > 0 ? englishVoices : voices;
    }

    setVoiceByName(name) {
        if (!this.synth) return;
        const voices = this.synth.getVoices();
        const found = voices.find(v => v.name === name || v.voiceURI === name);
        if (found) {
            this.selectedVoice = found;
        }
    }

    speak(text, options = {}) {
        if (!this.enabled || !this.synth) return;
        this.stop();

        this.speaking = true;

        if (typeof sfx !== 'undefined' && sfx.setDucking) {
            sfx.setDucking(true);
        }

        const cleanText = text.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');
        const sentences = cleanText.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 0);

        if (sentences.length === 0) {
            this.finishSpeech(options);
            return;
        }

        let sentenceIndex = 0;

        const speakNextSentence = () => {
            if (!this.speaking || sentenceIndex >= sentences.length) {
                this.finishSpeech(options);
                return;
            }

            const sentenceText = sentences[sentenceIndex];
            const utterance = new SpeechSynthesisUtterance(sentenceText);

            if (this.selectedVoice) {
                utterance.voice = this.selectedVoice;
            }

            utterance.pitch = 0.98;
            utterance.rate = 0.92;
            utterance.volume = 1.0;

            if (options.onSentenceStart) {
                options.onSentenceStart(sentenceIndex, sentences.length, sentenceText);
            }

            utterance.onend = () => {
                sentenceIndex++;
                if (sentenceIndex < sentences.length) {
                    this.currentSentenceTimeout = setTimeout(speakNextSentence, 350);
                } else {
                    this.finishSpeech(options);
                }
            };

            utterance.onerror = (e) => {
                console.warn("SpeechSynthesis sentence error:", e);
                sentenceIndex++;
                this.currentSentenceTimeout = setTimeout(speakNextSentence, 200);
            };

            try {
                this.synth.speak(utterance);
            } catch (e) {
                console.warn("SpeechSynthesis error:", e);
                this.finishSpeech(options);
            }
        };

        speakNextSentence();
    }

    finishSpeech(options = {}) {
        this.speaking = false;
        if (typeof sfx !== 'undefined' && sfx.setDucking) {
            sfx.setDucking(false);
        }
        if (options.onSpeechEnd) {
            options.onSpeechEnd();
        }
    }

    stop() {
        this.speaking = false;
        if (this.currentSentenceTimeout) {
            clearTimeout(this.currentSentenceTimeout);
            this.currentSentenceTimeout = null;
        }
        if (this.synth && (this.synth.speaking || this.synth.pending)) {
            this.synth.cancel();
        }
        if (typeof sfx !== 'undefined' && sfx.setDucking) {
            sfx.setDucking(false);
        }
    }
}

const narrator = new VoiceNarrator();

// --- Game State ---
const state = {
    name: "Sir Ario",
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
    goblinHp: 70,
    catHp: 480,
    trollHp: 120,
    wilderness: null,
    fairyVisited: false,
    catExposed: false,
    hasRuneScroll: false,
    hasSunCrystal: false,
    hasHiltOfDawn: false,
    hasBlueprint: false,
    hasDormantSunblade: false,
    hasDormantSunblade: false,
    location: "village",
    achievements: {},
    killCounts: {}
};

function getRelicCount() {
    let count = 0;
    if (state.hasSunCrystal) count++;
    if (state.hasHiltOfDawn) count++;
    if (state.hasBlueprint) count++;
    return count;
}

// --- Achievement Trophy System Engine ---
const ACHIEVEMENTS_DATA = [
    { id: "first_blood", icon: "⚔️", title: "First Blood", desc: "Defeat your first enemy in combat." },
    { id: "sunblade_scroll", icon: "📜", title: "Seeker of Lore", desc: "Receive the Sunblade Scroll from the Wise Elder." },
    { id: "merciful_hero", icon: "🍞", title: "Merciful Hero", desc: "Share bread with Grik the Goblin Rogue instead of slaying him." },
    { id: "royal_knight", icon: "🛡️", title: "Brother-in-Arms", desc: "Shatter the blood-iron chains and free Sir Johan." },
    { id: "fairy_blessing", icon: "🧚", title: "Fairy's Grace", desc: "Discover the Secret Fairy Fountain and receive the Queen's blessing." },
    { id: "snake_slayer", icon: "🐍", title: "Cave Explorer", desc: "Claim the Sun Crystal Core from the Mountain Cave." },
    { id: "master_craftsman", icon: "🔨", title: "Master Forger", desc: "Reforge the Dormant Sunblade at the Blacksmith Forge using all 3 relics." },
    { id: "sunfire_awakened", icon: "✨", title: "Sunfire Ascendant", desc: "Consecrate the Dormant Sunblade on the Altar of Dawn." },
    { id: "perfect_guard", icon: "🛡️", title: "Perfect Counter", desc: "Successfully block Lord Rodrigues's Crimson Shadow Pounce." },
    { id: "savior_of_realm", icon: "🏆", title: "Savior of East Grevie", desc: "Vanquish Lord Rodrigues and rescue Princess Elsa." },
    { id: "weasel_hunter", icon: "🦦", title: "Weasel Exterminator", desc: "Defeat 3 Wild Weasels on the Wilderness Trail.", enemyName: "Wild Weasel", targetCount: 3 },
    { id: "owl_hunter", icon: "🦉", title: "Owl Tracker", desc: "Defeat 3 Barn Owls on the Wilderness Trail.", enemyName: "Barn Owl", targetCount: 3 },
    { id: "toad_hunter", icon: "🐸", title: "Toad Vanquisher", desc: "Defeat 3 Giant Garden Toads on the Wilderness Trail.", enemyName: "Giant Garden Toad", targetCount: 3 },
    { id: "rat_hunter", icon: "🐀", title: "Rat Catcher", desc: "Defeat 3 Alley Rat Rogues on the Wilderness Trail.", enemyName: "Alley Rat Rogue", targetCount: 3 },
    { id: "cat_hunter", icon: "🐈", title: "Wilderness Predator", desc: "Defeat 3 Feral Farm Cats on the Wilderness Trail.", enemyName: "Feral Farm Cat", targetCount: 3 }
];

function loadAchievementsFromStorage() {
    try {
        const savedAch = localStorage.getItem("east_grevie_achievements");
        if (savedAch) state.achievements = JSON.parse(savedAch);
        const savedKills = localStorage.getItem("east_grevie_kill_counts");
        if (savedKills) state.killCounts = JSON.parse(savedKills);
    } catch (e) {
        console.warn("Could not load achievements/kills:", e);
    }
}

function saveAchievementsToStorage() {
    try {
        localStorage.setItem("east_grevie_achievements", JSON.stringify(state.achievements || {}));
        localStorage.setItem("east_grevie_kill_counts", JSON.stringify(state.killCounts || {}));
    } catch (e) {
        console.warn("Could not save achievements/kills:", e);
    }
}

function resetAchievementsData() {
    state.achievements = {};
    state.killCounts = {};
    try {
        localStorage.removeItem("east_grevie_achievements");
        localStorage.removeItem("east_grevie_kill_counts");
    } catch (e) {
        console.warn("Could not reset achievements storage:", e);
    }
    updateAchievementsUI();
    addLog("🏆 All trophy and kill count progress has been reset!", "event");
    sfx.playClick();
}

function recordWildernessKill(enemyName) {
    if (!state.killCounts) state.killCounts = {};
    state.killCounts[enemyName] = (state.killCounts[enemyName] || 0) + 1;
    saveAchievementsToStorage();

    const count = state.killCounts[enemyName];
    const ach = ACHIEVEMENTS_DATA.find(a => a.enemyName === enemyName);
    if (ach && count >= ach.targetCount) {
        unlockAchievement(ach.id);
    }

    updateAchievementsUI();
}

function unlockAchievement(id) {
    if (!state.achievements) state.achievements = {};
    if (state.achievements[id] && state.achievements[id].unlocked) return;

    const ach = ACHIEVEMENTS_DATA.find(a => a.id === id);
    if (!ach) return;

    state.achievements[id] = {
        unlocked: true,
        unlockedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    saveAchievementsToStorage();
    updateAchievementsUI();
    showAchievementToast(ach);
    sfx.playVictory();
}

let toastTimeout = null;
function showAchievementToast(ach) {
    const toastEl = document.getElementById("achievement-toast");
    const toastIconEl = document.getElementById("toast-icon");
    const toastTitleEl = document.getElementById("toast-title");
    const toastDescEl = document.getElementById("toast-desc");

    if (toastEl && toastIconEl && toastTitleEl && toastDescEl) {
        toastIconEl.textContent = ach.icon;
        toastTitleEl.textContent = ach.title;
        toastDescEl.textContent = ach.desc;

        toastEl.classList.remove("hidden");

        if (toastTimeout) clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toastEl.classList.add("hidden");
        }, 4200);
    }
}

function updateAchievementsUI() {
    if (!state.achievements) state.achievements = {};
    if (!state.killCounts) state.killCounts = {};

    const unlockedIds = Object.keys(state.achievements).filter(id => state.achievements[id] && state.achievements[id].unlocked);
    const count = unlockedIds.length;
    const total = ACHIEVEMENTS_DATA.length;

    const badgeEl = document.getElementById("achievements-badge");
    if (badgeEl) badgeEl.textContent = `${count}/${total}`;

    const modalCountEl = document.getElementById("achievements-modal-count");
    if (modalCountEl) modalCountEl.textContent = `${count} / ${total}`;

    const barInnerEl = document.getElementById("achievements-bar-inner");
    if (barInnerEl) barInnerEl.style.width = `${(count / total) * 100}%`;

    // Check 15/15 Trophies for NG+ Sunblade Paladin Unlock & Main Menu Button Text
    const menuStartBtnEl = document.getElementById("menu-start-btn");
    if (menuStartBtnEl) {
        menuStartBtnEl.textContent = count >= 15 ? "START NEW GAME+" : "START NEW GAME";
    }

    const paladinCardEl = document.getElementById("paladin-class-card");
    const paladinStatusEl = document.getElementById("paladin-card-status");
    if (paladinCardEl && paladinStatusEl) {
        if (count >= 15) {
            paladinCardEl.classList.remove("locked");
            paladinCardEl.classList.add("unlocked");
            paladinStatusEl.textContent = "Sunfire Sigil (+2 All Stats) | High Defense";
        } else {
            paladinCardEl.classList.add("locked");
            paladinCardEl.classList.remove("unlocked");
            paladinStatusEl.textContent = "🔒 UNLOCK 15/15 TROPHIES";
        }
    }

    const gridEl = document.getElementById("achievements-grid");
    if (gridEl) {
        gridEl.innerHTML = "";
        ACHIEVEMENTS_DATA.forEach(ach => {
            const isUnlocked = state.achievements[ach.id] && state.achievements[ach.id].unlocked;
            const card = document.createElement("div");
            card.className = `achievement-card ${isUnlocked ? 'unlocked' : 'locked'}`;

            let statusText = 'LOCKED';
            if (isUnlocked) {
                const timeStr = state.achievements[ach.id].unlockedAt || 'Unlocked';
                statusText = `UNLOCKED (${timeStr})`;
            } else if (ach.enemyName && ach.targetCount) {
                const currentKills = state.killCounts[ach.enemyName] || 0;
                statusText = `PROGRESS: ${currentKills} / ${ach.targetCount} DEFEATED`;
            }

            card.innerHTML = `
                <div class="achievement-card-icon">${isUnlocked ? ach.icon : '🔒'}</div>
                <div class="achievement-card-body">
                    <div class="achievement-card-title">
                        <span>${ach.title}</span>
                        ${isUnlocked ? '<span style="color:#00ff88;">✔</span>' : ''}
                    </div>
                    <div class="achievement-card-desc">${ach.desc}</div>
                    <div class="achievement-card-status">${statusText}</div>
                </div>
            `;
            gridEl.appendChild(card);
        });
    }
}

// --- Quest Journal System Data & Rendering Engine ---
const QUESTS_DATA = [
    {
        id: "main_elsa",
        title: "Rescue Princess Elsa",
        type: "main",
        discovered: true,
        giver: "Kingdom Legend",
        summary: "Lord Rodrigues the Shadow Cat abducted Princess Elsa. Journey across the realm to Cat's Hall to save her.",
        lore: "\"Shadows fall over the realm. Cat Rodrigues holds Princess Elsa captive in his fortress. Prepare your weapons and bring an end to his terror!\"",
        objectives: [
            { text: "Speak with the Village Elder in East Grevie Square", check: (s) => Boolean(s.elderTalked) },
            { text: "Locate Cat's Hall on the Kingdom World Map", check: (s) => Boolean(s.visitedLocations && s.visitedLocations.includes("lair")) },
            { text: "Vanquish Lord Rodrigues & rescue Princess Elsa", check: (s) => Boolean(s.bossDefeated) }
        ]
    },
    {
        id: "celestial_sunblade",
        title: "Trial of Three Relics",
        type: "subquest",
        discovered: false,
        giver: "Village Elder",
        summary: "Gather the 3 celestial relics scattered across the realm to reforge and consecrate the legendary Sunblade.",
        lore: "\"Only the holy Sunblade can pierce Rodrigues's enchanted cat fur. Find the Sun Crystal, the Hilt of Dawn, and the Forge Blueprint to reforge the blade!\"",
        objectives: [
            { text: "Retrieve Sun Crystal Core from Mountain Cave", check: (s) => Boolean(s.hasSunCrystal) },
            { text: "Retrieve Hilt of Dawn from Secret Fairy Fountain", check: (s) => Boolean(s.hasHiltOfDawn) },
            { text: "Recover Forge Blueprint from Old Watchtower Ruins", check: (s) => Boolean(s.hasBlueprint) },
            { text: "Reforge Dormant Sunblade at Village Blacksmith", check: (s) => Boolean(s.hasDormantSunblade || s.hasSword) },
            { text: "Consecrate blade at Temple Sanctum Altar", check: (s) => Boolean(s.hasSword) }
        ]
    },
    {
        id: "blacksmith_blueprint",
        title: "Stolen Mastercraft Blueprint",
        type: "subquest",
        discovered: false,
        giver: "Village Blacksmith",
        summary: "Track down the Goblin Rogue in the Whispering Forest to recover the Blacksmith's stolen blueprint.",
        lore: "\"A sly Goblin Rogue robbed my forge and fled into the misty forest. Recover my stolen blueprint so I can open my mastercraft shop!\"",
        objectives: [
            { text: "Locate the Goblin Rogue in the Whispering Forest", check: (s) => Boolean(s.goblinEncountered || s.goblinDefeated || s.goblinSpared || s.hasBlueprint || s.blueprintReturned) },
            { text: "Return the Stolen Blueprint to the Village Blacksmith", check: (s) => Boolean(s.blueprintReturned || s.hasBlueprint) }
        ]
    }
];

let selectedQuestId = "main_elsa";

function isQuestDiscovered(q) {
    if (q.discovered) return true;
    if (q.id === "celestial_sunblade" && (state.elderTalked || state.hasRuneScroll || state.hasSunCrystal || state.hasHiltOfDawn || state.hasBlueprint || state.hasDormantSunblade || state.hasSword)) return true;
    if (q.id === "blacksmith_blueprint" && (state.blacksmithTalked || state.blueprintReturned || state.hasBlueprint || state.goblinDefeated || state.goblinSpared || (state.inventory && state.inventory.includes("Stolen Blacksmith Blueprint")))) return true;
    return q.objectives.some(obj => obj.check(state));
}

function isQuestCompleted(q) {
    return q.objectives.every(obj => obj.check(state));
}

function updateQuestsUI() {
    const discoveredQuests = QUESTS_DATA.filter(q => isQuestDiscovered(q));
    const activeQuests = discoveredQuests.filter(q => !isQuestCompleted(q));

    const badgeEl = document.getElementById("quests-badge");
    if (badgeEl) {
        badgeEl.textContent = activeQuests.length;
    }

    const listEl = document.getElementById("quests-list");
    if (listEl) {
        listEl.innerHTML = "";
        discoveredQuests.forEach(q => {
            const completed = isQuestCompleted(q);
            const isSelected = q.id === selectedQuestId;
            const card = document.createElement("div");
            card.className = `quest-card ${isSelected ? 'selected' : ''}`;

            let tagClass = "active";
            let tagText = "ACTIVE";
            if (completed) {
                tagClass = "completed";
                tagText = "COMPLETED";
            } else if (q.type === "main") {
                tagClass = "main";
                tagText = "MAIN QUEST";
            }

            card.innerHTML = `
                <div class="quest-card-header">
                    <span class="quest-card-title">${q.title}</span>
                    <span class="quest-tag ${tagClass}">${tagText}</span>
                </div>
                <div class="quest-card-desc">${q.summary}</div>
            `;

            card.addEventListener("click", () => {
                sfx.playClick();
                selectedQuestId = q.id;
                updateQuestsUI();
            });

            listEl.appendChild(card);
        });
    }

    renderQuestDetail();
}

function renderQuestDetail() {
    const detailEl = document.getElementById("quest-detail-content");
    if (!detailEl) return;

    const currentQuest = QUESTS_DATA.find(q => q.id === selectedQuestId) || QUESTS_DATA[0];
    const completed = isQuestCompleted(currentQuest);

    let objectivesHtml = "";
    currentQuest.objectives.forEach(obj => {
        const done = obj.check(state);
        objectivesHtml += `
            <div class="objective-item ${done ? 'done' : ''}">
                <span class="objective-icon">${done ? '✔' : '⚪'}</span>
                <span>${obj.text}</span>
            </div>
        `;
    });

    detailEl.innerHTML = `
        <div class="quest-detail-box">
            <div>
                <h3 class="quest-detail-title">${currentQuest.title}</h3>
                <div class="quest-detail-lore">${currentQuest.lore}</div>
            </div>
            <div>
                <h4 style="font-family:var(--font-display); font-size:0.9rem; color:var(--gold-bright); margin-bottom:6px;">OBJECTIVES:</h4>
                <div class="quest-objectives-list">
                    ${objectivesHtml}
                </div>
            </div>
        </div>
    `;
}

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
    let chance = 5 + (totalLck * 2) + (totalAgi * 1);
    if (state.heroClass === "ranger") chance += 10; // Ranger Perk: Eagle Eye (+10% Crit Chance)
    return Math.min(50, chance);
}

function calculateCritMultiplier() {
    const eq = calculateEquipmentBonuses();
    const totalAgi = state.agi + eq.agi;
    return 1.5 + (totalAgi * 0.05);
}

function calculateDodgeChance() {
    const eq = calculateEquipmentBonuses();
    const totalAgi = state.agi + eq.agi;
    let dodge = Math.min(35, totalAgi * 1.5);
    if (state.heroClass === "ranger") dodge += 10;
    return dodge;
}

function calculateMitigation() {
    const eq = calculateEquipmentBonuses();
    const totalEnd = state.end + eq.end;
    return eq.armor + Math.floor(totalEnd * 0.8);
}

function mitigate(damage) {
    const totalArmor = calculateMitigation();
    let mitigated = Math.max(1, damage - Math.floor(totalArmor * 0.45));
    if (state.heroClass === "knight") {
        mitigated = Math.max(1, mitigated - 2); // Royal Knight Perk: Bastion Shield (-2 Damage Taken)
        spawnFloatingText("🛡️ Bastion Shield (-2)", "event", 40, 50);
        addLog("Bastion Shield Perk mitigates -2 physical damage!", "event");
    } else if (state.heroClass === "paladin") {
        mitigated = Math.max(1, mitigated - 3); // Sunblade Paladin Perk: Sunfire Ascendant (-3 Damage Taken)
        spawnFloatingText("✨ Sunfire Shield (-3)", "event", 40, 50);
        addLog("Sunfire Ascendant Perk mitigates -3 incoming damage!", "event");
    }
    return Math.max(1, mitigated);
}

function rollAttack() {
    const { minDmg, maxDmg } = calculateDamageRange();
    const baseOutput = Math.floor(Math.random() * (maxDmg - minDmg + 1)) + minDmg;
    const critChance = calculateCritChance() / 100;
    const isCrit = Math.random() < critChance;
    let finalDmg = baseOutput;
    if (isCrit) {
        finalDmg = Math.floor(baseOutput * calculateCritMultiplier());
        if (state.heroClass === "ranger") {
            spawnFloatingText("🎯 EAGLE EYE CRIT!", "crit", 50, 24);
            addLog("Eagle Eye Perk strikes critical vulnerability (+10% Crit Rate)!", "victory");
        }
    }
    if (state.heroClass === "paladin" && (state.hasSword || state.hasDormantSunblade)) {
        finalDmg += 10;
        spawnFloatingText("✨ Holy Cleave (+10)", "crit", 50, 28);
        addLog("Sunfire Ascendant Perk ignites blade (+10 Holy Sunfire Cleave)!", "event");
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
        state.hp = Math.min(state.maxHp, state.hp + 25);
        addLog(`LEVEL UP! You reached Level ${state.level}! Granted +3 Attribute Points (+25 HP restored)!`, "event");
    }
    updateHUD();
    updateStatsModalUI();
}

const ENEMY_POOL = [
    { name: "Wild Weasel", hp: 76, dmgLow: 12, dmgHigh: 20, image: "assets/images/wild_weasel.jpg" },
    { name: "Barn Owl", hp: 90, dmgLow: 14, dmgHigh: 24, image: "assets/images/barn_owl.jpg" },
    { name: "Giant Garden Toad", hp: 70, dmgLow: 10, dmgHigh: 18, image: "assets/images/giant_garden_toad.jpg" },
    { name: "Alley Rat Rogue", hp: 100, dmgLow: 15, dmgHigh: 26, image: "assets/images/alley_rat_rogue.jpg" },
    { name: "Feral Farm Cat", hp: 120, dmgLow: 18, dmgHigh: 30, image: "assets/images/feral_farm_cat.jpg" }
];

// Image assets mapping
const sceneImages = {
    village: "assets/images/village.jpg",
    forest: "assets/images/whispering_forest.jpg",
    goblin: "assets/images/goblin.jpg",
    temple: "assets/images/temple_sanctum.jpg",
    mountain: "assets/images/rocky_mountain_pass.jpg",
    lair: "assets/images/final_boss_rodrigues.jpg",
    watchtower: "assets/images/old_watchtower.jpg",
    blacksmith: "assets/images/blacksmith.jpg",
    wilderness: "assets/images/wilderness_trail.jpg",
    troll: "assets/images/snake_cave_treasure_draft.jpg",
    cave: "assets/images/snake_cave_treasure_draft.jpg",
    map: "assets/images/map.jpg",
    fairy: "assets/images/secret_fairy_fountain.jpg",
    victory: "assets/images/final_boss_rodrigues.jpg"
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
    const cleanText = text
        .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F1E6}-\u{1F1FF}]/gu, '')
        .trim();

    const p = document.createElement("p");
    if (type === "dialogue" || type === "event") {
        p.className = "log-dialogue";
    } else if (type === "alert" || type === "enemy" || type === "warning") {
        p.className = "log-alert";
    } else if (type === "victory" || type === "milestone") {
        p.className = "log-victory";
    } else if (type === "action" || type === "player") {
        p.className = "log-action";
    } else {
        p.className = "log-lore";
    }
    p.textContent = cleanText;
    storyLogEl.appendChild(p);
    storyLogEl.scrollTop = storyLogEl.scrollHeight;
}

function clearLog() {
    storyLogEl.innerHTML = "";
}

function addScore(points) {
    state.score += points;
    updateHUD();

    const scoreTextEl = document.getElementById("score-text");
    if (scoreTextEl) {
        scoreTextEl.classList.remove("hud-pulse-score");
        void scoreTextEl.offsetWidth;
        scoreTextEl.classList.add("hud-pulse-score");
    }

    spawnFloatingText(`+${points} PTS`, "score", 68, 12);
    gainExp(points);
}

function spawnFloatingText(text, type = "damage", customX = 50, customY = 45) {
    const container = document.getElementById("floating-text-container");
    if (!container) return;

    const span = document.createElement("span");
    span.className = `floating-text ft-${type}`;
    span.textContent = text;

    const offsetX = (Math.random() * 16 - 8);
    const finalX = Math.min(90, Math.max(10, customX + offsetX));

    span.style.left = `${finalX}%`;
    span.style.top = `${customY}%`;

    container.appendChild(span);

    setTimeout(() => {
        if (span.parentNode) {
            span.parentNode.removeChild(span);
        }
    }, 1400);
}

function healPlayer(amount) {
    state.maxHp = calculateMaxHp();
    state.hp = Math.min(state.maxHp, state.hp + amount);
    if (state.heroClass === "alchemist" && amount >= 60) {
        addLog(`Elixir Master Perk empowers potion (+${amount} HP Restored!)`, "victory");
        spawnFloatingText(`🧪 Elixir Master (+${amount} HP)`, "heal", 50, 45);
    } else {
        addLog(`Restored ${amount} HP! Current HP: ${state.hp}/${state.maxHp}`, "event");
        spawnFloatingText(`+${amount} HP`, "heal", 50, 45);
    }
    sfx.playHeal();
    updateHUD();
}

function getPotionHealAmount() {
    return state.heroClass === "alchemist" ? 60 : 40;
}

function addGold(baseGold) {
    const lckBonusMult = 1 + (state.lck * 0.08);
    const finalGold = Math.round(baseGold * lckBonusMult);
    state.gold += finalGold;
    sfx.playItem();
    updateHUD();

    const goldTextEl = document.getElementById("gold-text");
    if (goldTextEl) {
        goldTextEl.classList.remove("hud-pulse-gold");
        void goldTextEl.offsetWidth;
        goldTextEl.classList.add("hud-pulse-gold");
    }

    spawnFloatingText(`+💰 ${finalGold}`, "gold", 82, 12);
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

    if (typeof updateQuestsUI === "function") {
        updateQuestsUI();
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

function setScene(imageKey, locationText, customImgPath) {
    if (customImgPath) {
        sceneImgEl.src = customImgPath;
    } else if (sceneImages[imageKey]) {
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
    addLog("You stand in the peaceful sunlit Village Square of East Grevie.");
    addLog("Charming timber-frame cottages enclose the stone fountain, while distant whispers of Cat Rodrigues's shadowy reign echo through the quiet streets.");

    renderChoices([
        { text: "1. Speak to Wise Elder by fountain", action: speakToElder },
        { text: "2. Visit the Blacksmith", action: goBlacksmith },
        { text: "3. Rest at Tavern (Full Rest)", action: restTavern },
        { text: "4. Open World Map", action: renderWorldMap }
    ]);
}

function getClassEquipNames() {
    const cls = state.heroClass || "knight";
    if (cls === "paladin") {
        return {
            weapon: "Sunfire Greatsword",
            shield: "Empyrean Sun Shield",
            armor: "Divine Sunfire Heavy Plate",
            accessory: "Empowered Sunfire Sigil"
        };
    } else if (cls === "ranger") {
        return {
            weapon: "Composite Yew Bow",
            shield: "Reinforced Quiver Guard",
            armor: "Dragon-Scale Scout Leather",
            accessory: "Eagle Eye Talisman"
        };
    } else if (cls === "alchemist") {
        return {
            weapon: "Rune Catalyst Staff",
            shield: "Alchemical Athanor Aegis",
            armor: "Dragon-Scale Scholar Robe",
            accessory: "Philosopher's Stone Fragment"
        };
    }
    return {
        weapon: "Mastercraft Steel Broadsword",
        shield: "Reinforced Tower Shield",
        armor: "Dragon-Scale Plate Mail",
        accessory: "Ring of Power"
    };
}

function goBlacksmith() {
    sfx.playClick();
    renderBlacksmith();
}

function renderBlacksmith() {
    state.location = "blacksmith";
    state.blacksmithTalked = true;
    sfx.playMusic("village");
    setScene("blacksmith", "BLACKSMITH'S FORGE & SHOP");
    clearLog();
    addLog("The intense heat of the forge hearth radiates through the stone smithy.");
    addLog("Racks of polished steel and glowing embers surround the anvil, waiting for the master smith's craft.");

    if (!state.blueprintReturned && !state.inventory.includes("Stolen Blacksmith Blueprint")) {
        addLog("Blacksmith: 'A treacherous Goblin Rogue stole my Mastercraft Blueprint in the Whispering Forest!'", "alert");
        addLog("Blacksmith: 'Track down that rogue, recover my blueprint, and return it to me so I can open my forge and craft equipment for you!'");
        updateHUD();
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
    const equipNames = getClassEquipNames();

    const weaponOwned = state.equipment.weapon && state.equipment.weapon.name === equipNames.weapon;
    const weaponCost = Math.round(110 * (1 - discount));
    choices.push({
        text: weaponOwned ? `1. ⚔️ ${equipNames.weapon} - [ EQUIPPED ]` : `1. ⚔️ Buy ${equipNames.weapon} (+15 Dmg, +2 STR) - 💰 ${weaponCost} Gold`,
        action: weaponOwned ? () => { sfx.playClick(); addLog(`You already own and have equipped the ${equipNames.weapon}!`); } : () => buyEquipment("weapon", { name: equipNames.weapon, bonusStr: 2, bonusMinDmg: 18, bonusMaxDmg: 28 }, weaponCost)
    });

    const shieldOwned = state.equipment.shield && state.equipment.shield.name === equipNames.shield;
    const shieldCost = Math.round(90 * (1 - discount));
    choices.push({
        text: shieldOwned ? `2. 🛡️ ${equipNames.shield} - [ EQUIPPED ]` : `2. 🛡️ Buy ${equipNames.shield} (+10 Armor, +2 END, +20 HP) - 💰 ${shieldCost} Gold`,
        action: shieldOwned ? () => { sfx.playClick(); addLog(`You already own and have equipped the ${equipNames.shield}!`); } : () => buyEquipment("shield", { name: equipNames.shield, bonusArmor: 10, bonusEnd: 2, bonusMaxHp: 20 }, shieldCost)
    });

    const armorOwned = state.equipment.armor && state.equipment.armor.name === equipNames.armor;
    const armorCost = Math.round(100 * (1 - discount));
    choices.push({
        text: armorOwned ? `3. 🥋 ${equipNames.armor} - [ EQUIPPED ]` : `3. 🥋 Buy ${equipNames.armor} (+8 Armor, +2 AGI, +30 HP) - 💰 ${armorCost} Gold`,
        action: armorOwned ? () => { sfx.playClick(); addLog(`You already own and have equipped the ${equipNames.armor}!`); } : () => buyEquipment("armor", { name: equipNames.armor, bonusArmor: 8, bonusAgi: 2, bonusMaxHp: 30 }, armorCost)
    });

    const ringOwned = state.equipment.accessory && state.equipment.accessory.name === equipNames.accessory;
    const ringCost = Math.round(140 * (1 - discount));
    const isPaladinAcc = state.heroClass === "paladin";
    const accDesc = isPaladinAcc ? "(+3 ALL STATS)" : "(+2 LCK, +1 ALL STATS)";
    const accItem = isPaladinAcc
        ? { name: equipNames.accessory, bonusStr: 3, bonusAgi: 3, bonusEnd: 3, bonusLck: 3 }
        : { name: equipNames.accessory, bonusLck: 2, bonusStr: 1, bonusAgi: 1, bonusEnd: 1 };

    choices.push({
        text: ringOwned ? `4. 💍 ${equipNames.accessory} - [ EQUIPPED ]` : `4. 💍 Buy ${equipNames.accessory} ${accDesc} - 💰 ${ringCost} Gold`,
        action: ringOwned ? () => { sfx.playClick(); addLog(`You already own and have equipped the ${equipNames.accessory}!`); } : () => buyEquipment("accessory", accItem, ringCost)
    });

    const hasAllRelics = state.hasSunCrystal && state.hasHiltOfDawn && state.hasBlueprint;
    if (hasAllRelics && !state.hasDormantSunblade && !state.hasSword) {
        choices.unshift({
            text: "🔥 REFORGE THE SUNBLADE (Use 3 Relics)",
            action: reforgeSunblade
        });
    }

    const potionCost = Math.round(35 * (1 - discount));
    choices.push({
        text: `🧪 Buy Healing Potion (+40 HP) - 💰 ${potionCost} Gold`,
        action: () => buyPotion(potionCost)
    });

    choices.push({ text: "Return to Village Square", action: renderVillage });

    renderChoices(choices);
}

function reforgeSunblade() {
    sfx.playClick();
    const removeRelic = (itemName) => {
        const idx = state.inventory.indexOf(itemName);
        if (idx !== -1) state.inventory.splice(idx, 1);
    };
    removeRelic("Sun Crystal Core");
    removeRelic("Hilt of Dawn");
    removeRelic("Forge Blueprint");

    state.hasDormantSunblade = true;
    state.inventory.push("Dormant Sunblade");

    sfx.playItem();
    addScore(250);
    updateHUD();
    renderBlacksmith();

    addLog("THE BLACKSMITH STRIKES HIS HEARTH ANVIL!", "victory");
    addLog("Sparks fly as the Sun Crystal Core fuses with the Hilt of Dawn according to the ancient blueprint!", "event");
    addLog("YOU OBTAINED: Dormant Sunblade (Added to Inventory!)", "victory");
    addLog("Take the Dormant Sunblade to the Temple Sanctum altar to ignite its holy sunfire!", "event");
    unlockAchievement("master_craftsman");
}

function buyEquipment(slot, itemObj, cost) {
    sfx.playClick();
    if (state.gold < cost) {
        addLog(`Blacksmith: 'You don't have enough Gold! You need ${cost} Gold.'`, "alert");
    } else {
        state.gold -= cost;
        state.equipment[slot] = itemObj;
        addLog(`Purchased & equipped ${itemObj.name}!`, "victory");
        sfx.playItem();
        updateHUD();
    }
    renderBlacksmith();
}

function buyPotion(cost) {
    sfx.playClick();
    if (state.gold < cost) {
        addLog(`Blacksmith: 'You don't have enough Gold! You need ${cost} Gold.'`, "alert");
    } else {
        state.gold -= cost;
        state.inventory.push("Healing Potion");
        addLog("Purchased 1 Healing Potion!", "event");
        sfx.playItem();
        updateHUD();
    }
    renderBlacksmith();
}

function speakToElder() {
    sfx.playClick();
    clearLog();
    state.elderTalked = true;
    addLog("Elder: 'Brave adventurer! The Sunblade was shattered into three celestial relics to prevent Lord Rodrigues from stealing it:'", "event");
    addLog("Elder: '1. Sun Crystal Core (Mountain Cave) | 2. Hilt of Dawn (Fairy Fountain) | 3. Forge Blueprint (Old Watchtower)'");

    if (!state.hasRuneScroll) {
        state.hasRuneScroll = true;
        state.inventory.push("Sunblade Rune Scroll");
        state.hasKey = true;
        addLog("Elder: 'Take this Sunblade Rune Scroll! Seek all 3 relics across the realm. Once gathered, bring them to the Village Blacksmith to reforge the blade!'", "victory");

        const count = getRelicCount();
        if (count > 0) {
            addLog(`Elder: 'Ah! I see you already carry ${count}/3 celestial relics in your inventory! Excellent work!'`, "event");
        }
        addScore(100);
        updateHUD();
        unlockAchievement("sunblade_scroll");
    } else {
        const count = getRelicCount();
        if (count === 3) {
            addLog("Elder: 'Magnificent! You carry all 3 celestial relics! Take them to the Village Blacksmith right here in East Grevie to reforge the Sunblade!'", "victory");
        } else {
            addLog(`Elder: 'You carry ${count}/3 relics in your inventory. Find the rest, then bring them to the Village Blacksmith to reforge the blade!'`, "event");
        }
        updateHUD();
    }

    if (storyLogEl) storyLogEl.scrollTop = 0;
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
    addLog("Sunlight pierces the dense emerald canopy of the Whispering Forest.");
    addLog("Ancient mossy monoliths and glowing forest flora line the quiet dirt path leading deep into the ancient woodland.");

    const choices = [
        { text: "1. Investigate glowing tree stump", action: investigateStump },
        { text: "2. Fight Goblin Rogue", action: battleGoblin },
        { text: "3. Open World Map", action: renderWorldMap }
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
    addLog("Golden rays beam through high vaulted arches into the quiet Temple Sanctum.");
    addLog("Massive rune-carved pillars frame the sacred Altar of Dawn.");

    if (state.hasSword) {
        addLog("The altar glows with lingering celestial light. You have already awakened the Legendary Sunblade!");
        renderChoices([
            { text: "Open World Map", action: renderWorldMap }
        ]);
        return;
    }

    if (state.hasDormantSunblade) {
        addLog("The pedestal pulses in resonance with the Dormant Sunblade in your inventory!", "event");
        renderChoices([
            { text: "1. Consecrate Dormant Sunblade on the Altar of Dawn", action: consecrateSunblade },
            { text: "2. Open World Map", action: renderWorldMap }
        ]);
    } else if (state.hasSunCrystal && state.hasHiltOfDawn && state.hasBlueprint) {
        addLog("You have gathered all 3 relics! Take them to the Village Blacksmith to reforge the blade first.", "alert");
        renderChoices([
            { text: "Open World Map", action: renderWorldMap }
        ]);
    } else {
        addLog("The Altar of Dawn awaits the Dormant Sunblade. Speak to the Wise Elder in East Grevie Village to learn of the 3 scattered relics.", "alert");
        renderChoices([
            { text: "Open World Map", action: renderWorldMap }
        ]);
    }
}

function consecrateSunblade() {
    sfx.playClick();
    const idx = state.inventory.indexOf("Dormant Sunblade");
    if (idx !== -1) state.inventory.splice(idx, 1);

    state.hasSword = true;
    state.inventory.push("Legendary Sunblade");
    state.equipment.weapon = { name: "Legendary Sunblade", bonusStr: 25, bonusMinDmg: 35, bonusMaxDmg: 55 };

    sfx.playHeal();
    addScore(300);
    clearLog();
    addLog("A DAZZLING BEAM OF HOLY SUNLIGHT PIERCES THE TEMPLE VAULT!", "event");
    addLog("The Dormant Sunblade ignites with celestial sunfire!", "event");
    addLog("YOU HAVE AWAKENED THE LEGENDARY SUNBLADE! (+25 STR | Holy Sunfire Cleave)", "victory");
    updateHUD();
    updateStatsModalUI();
    unlockAchievement("sunfire_awakened");

    renderChoices([
        { text: "Open World Map", action: renderWorldMap }
    ]);
}

function battleGoblin() {
    sfx.playClick();
    if (state.goblinDefeated) {
        addLog("The Goblin Rogue has already been vanquished. The forest is quiet.");
        return;
    }

    state.location = "goblin";
    state.goblinEncountered = true;
    updateHUD();
    sfx.playMusic("battle");
    setScene("goblin", "GOBLIN ROGUE ENCOUNTER");
    clearLog();
    addLog("A sly, green-skinned Goblin Rogue emerges from the shadows of the brush, clutching stolen scrolls and baring sharp daggers!", "alert");

    renderGoblinTurn();
}

function renderGoblinTurn() {
    addLog(`Goblin HP: ${state.goblinHp} | Your HP: ${state.hp}`);
    renderChoices([
        { text: "1. Attack Goblin with weapon", action: attackGoblin },
        { text: "2. Try to reason with the Goblin (requires Bread)", action: reasonWithGoblin },
        { text: "3. Drink Healing Potion", action: usePotionGoblin },
        { text: "4. Flee to forest path", action: renderForest }
    ]);
}

function attackGoblin() {
    sfx.playSlash();
    const { dmg, crit } = rollAttack();
    state.goblinHp -= dmg;
    if (crit) {
        addLog(`CRITICAL HIT! You strike the Goblin for ${dmg} damage!`, "action");
        spawnFloatingText(`💥 -${dmg} HP`, "crit", 50, 40);
    } else {
        addLog(`You strike the Goblin for ${dmg} damage!`, "action");
        spawnFloatingText(`-${dmg} HP`, "damage", 50, 40);
    }

    if (state.goblinHp <= 0) {
        addLog("You defeated the Goblin Rogue!", "victory");
        addLog("You retrieved the STOLEN BLACKSMITH BLUEPRINT from the Goblin Rogue!", "event");
        state.goblinDefeated = true;
        state.inventory.push("Stolen Blacksmith Blueprint");
        addGold(50);
        addScore(150);
        unlockAchievement("first_blood");
        renderChoices([{ text: "Continue through Forest", action: renderForest }]);
        return;
    }

    // Goblin counter attack with Dodge check
    if (checkDodge()) {
        addLog("DODGED! You leap clear of the Goblin's attack!", "victory");
        spawnFloatingText("💨 DODGE!", "dodge", 30, 50);
    } else {
        const gDmg = mitigate(Math.floor(Math.random() * 8) + 5);
        state.hp -= gDmg;
        addLog(`The Goblin bites back for ${gDmg} damage!`, "alert");
        spawnFloatingText(`-${gDmg} HP`, "damage", 25, 65);
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
    addLog("🍞 You toss the Goblin Rogue your fresh loaf of Bread. Surprised by your unexpected mercy, he lowers his daggers!", "victory");
    addLog("Goblin Rogue: 'You... share food with Grik? No human has ever shown Grik kindness! Take this scroll—I stole it from the forge, but I cannot read it anyway! And take my Lucky Charm!'", "event");
    addLog("📜 You obtained the STOLEN BLACKSMITH BLUEPRINT from the Goblin Rogue!", "event");
    addLog("🍀 You obtained the GOBLIN LUCKY CHARM (+2 LCK)!", "victory");
    state.goblinDefeated = true;
    state.goblinSpared = true;
    unlockAchievement("merciful_hero");
    if (!state.inventory.includes("Stolen Blacksmith Blueprint")) {
        state.inventory.push("Stolen Blacksmith Blueprint");
    }
    state.inventory.push("Goblin Lucky Charm");
    state.lck += 2;
    addScore(150);
    updateHUD();
    updateStatsModalUI();
    renderChoices([{ text: "Continue through Forest", action: renderForest }]);
}

function usePotionGoblin() {
    const idx = state.inventory.indexOf("Healing Potion");
    if (idx !== -1) {
        state.inventory.splice(idx, 1);
        healPlayer(getPotionHealAmount());
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
    addLog("Howling alpine winds echo across the steep, snow-dusted ledges of the Rocky Mountain Pass.");
    addLog("Jagged granite crags tower into the clouds above, marking the perilous path toward Rodrigues's fortress.");

    renderChoices([
        { text: "1. Search Mountain Cave for supplies", action: searchCave },
        { text: "2. Open World Map", action: renderWorldMap }
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
    addLog("An ancient stone watchtower stands guard over the cliffside ravine, its weathered timber gates broken open.");

    if (state.knightFreed) {
        addLog("The watchtower is empty and silent. Sir Johan rides free at your side, ready for the final battle at Cat's Hall.");
        if (!state.hasBlueprint) {
            state.hasBlueprint = true;
            state.inventory.push("Forge Blueprint");
            const count = getRelicCount();
            addLog(`📜 Searching the watchtower tactical desk, you discover the ancient Forge Blueprint! (Sunblade Relic ${count}/3)`, "victory");
            sfx.playItem();
            updateHUD();
        }
        renderChoices([{ text: "Open World Map", action: renderWorldMap }]);
        return;
    }

    addLog("Inside, bound in heavy blood-iron chains against a stone pillar, stands Sir Johan, former Commander of the Royal Guard.", "alert");
    addLog("Sir Johan: 'Greetings, traveler... Cat Rodrigues's shadowy lieutenants ambushed me and bound me here in dark blood-iron chains.'", "event");

    renderChoices([
        { text: "1. Shatter chains & free Sir Johan", action: freeKnight },
        { text: "2. Ask Sir Johan why he was chained", action: askKnightLore },
        { text: "3. Open World Map", action: renderWorldMap }
    ]);
}

function askKnightLore() {
    sfx.playClick();
    clearLog();
    addLog("Sir Johan: 'I stood against Rodrigues when he brought dark shadows to East Grevie and abducted Princess Elsa. His sorcerers bound me in blood-iron.'", "event");
    addLog("Sir Johan reveals a secret tactic: 'Listen carefully! When Rodrigues's eyes glow crimson, raise your shield immediately to deflect his dark pounce!'", "victory");

    renderChoices([
        { text: "1. Shatter chains & free Sir Johan", action: freeKnight },
        { text: "2. Open World Map", action: renderWorldMap }
    ]);
}

function freeKnight() {
    sfx.playSlash();
    addLog("⚔️ With a mighty strike, you shatter the blood-iron link-pin! Sir Johan steps free from the stone pillar!", "victory");
    addLog("Sir Johan: 'My eternal thanks! Take my Royal Guard Crest (+3 Armor) to aid your protection. When you breach Cat's Hall, I shall strike at your side!'", "event");
    state.knightFreed = true;
    state.inventory.push("Royal Guard Crest");
    state.equipment.accessory = { name: "Royal Guard Crest", bonusArmor: 3 };
    unlockAchievement("royal_knight");

    if (!state.hasBlueprint) {
        state.hasBlueprint = true;
        state.inventory.push("Forge Blueprint");
        const count = getRelicCount();
        addLog(`📜 Sir Johan also hands over the ancient Forge Blueprint recovered from Rodrigues's lieutenants! (Sunblade Relic ${count}/3)`, "victory");
    }

    addScore(100);
    updateHUD();
    updateStatsModalUI();
    renderChoices([{ text: "Open World Map", action: renderWorldMap }]);
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
    addLog("Torches illuminate the damp stone cavern, where a massive Giant Mountain Snake coils over piles of glittering gold!", "alert");

    renderChoices([
        { text: "1. Fight the Mountain Snake", action: startTrollFight },
        { text: "2. Sneak past while it's resting", action: sneakPastTroll },
        { text: "3. Open World Map", action: renderWorldMap }
    ]);
}

function sneakPastTroll() {
    sfx.playClick();
    addLog("You slip past the resting Snake and find a sturdy Elven Shield & Elixir of Life!", "event");
    state.caveSearched = true;
    state.inventory.push("Elixir of Life");
    if (!state.hasSunCrystal) {
        state.hasSunCrystal = true;
        state.inventory.push("Sun Crystal Core");
        const count = getRelicCount();
        addLog(`💎 You discover the Sun Crystal Core glowing brilliantly amongst the cave gold! (Sunblade Relic ${count}/3)`, "victory");
    }
    unlockAchievement("snake_slayer");
    healPlayer(50);
    addScore(100);
    updateHUD();
    renderChoices([{ text: "Open World Map", action: renderWorldMap }]);
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
        { text: "3. Open World Map", action: renderWorldMap }
    ]);
}

function attackTroll() {
    sfx.playSlash();
    const [low, high] = state.hasSword ? [15, 25] : [8, 15];
    const { dmg, crit } = rollAttack(low, high);
    state.trollHp -= dmg;
    if (crit) {
        addLog(`CRITICAL HIT! You strike the Mountain Snake for ${dmg} damage!`, "action");
        spawnFloatingText(`💥 -${dmg} HP`, "crit", 50, 40);
    } else {
        addLog(`You strike the Mountain Snake for ${dmg} damage!`, "action");
        spawnFloatingText(`-${dmg} HP`, "damage", 50, 40);
    }

    if (state.trollHp <= 0) {
        addLog("You defeated the Mountain Snake!", "victory");
        state.caveSearched = true;
        state.inventory.push("Elixir of Life");
        if (!state.hasSunCrystal) {
            state.hasSunCrystal = true;
            state.inventory.push("Sun Crystal Core");
            const count = getRelicCount();
            addLog(`You discover the Sun Crystal Core glowing brilliantly amongst the cave gold! (Sunblade Relic ${count}/3)`, "victory");
        }
        healPlayer(50);
        addGold(100);
        addScore(250);
        updateHUD();
        unlockAchievement("first_blood");
        unlockAchievement("snake_slayer");
        renderChoices([{ text: "Open World Map", action: renderWorldMap }]);
        return;
    }

    const tDmg = mitigate(Math.floor(Math.random() * 9) + 10);
    state.hp -= tDmg;
    addLog(`The Mountain Snake bites with venomous fangs for ${tDmg} damage!`, "alert");
    spawnFloatingText(`-${tDmg} HP`, "damage", 25, 65);
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
        healPlayer(getPotionHealAmount());
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
        image: base.image,
        hp: base.hp + levelBonus * 8,
        dmgLow: base.dmgLow + levelBonus * 2,
        dmgHigh: base.dmgHigh + levelBonus * 2,
        reward: 60 + levelBonus * 8,
    };

    setScene("wilderness", `WILDERNESS TRAIL - ${base.name.toUpperCase()}`, base.image);
    sfx.playMusic("battle");
    clearLog();
    addLog(`The wild trail winds through dense brush, where a ferocious ${state.wilderness.name} springs forth!`, "alert");
    renderWildernessTurn();
}

function renderWildernessTurn() {
    const w = state.wilderness;
    addLog(`${w.name} HP: ${w.hp} | Your HP: ${state.hp}`);
    renderChoices([
        { text: "1. Attack with weapon", action: attackWilderness },
        { text: "2. Use Healing Potion", action: usePotionWilderness },
        { text: "3. Open World Map", action: renderWorldMap }
    ]);
}

function attackWilderness() {
    sfx.playSlash();
    const w = state.wilderness;
    const [low, high] = state.hasSword ? [15, 25] : [8, 15];
    const { dmg, crit } = rollAttack(low, high);
    w.hp -= dmg;
    if (crit) {
        addLog(`CRITICAL HIT! You strike the ${w.name} for ${dmg} damage!`, "action");
        spawnFloatingText(`💥 -${dmg} HP`, "crit", 50, 40);
    } else {
        addLog(`You strike the ${w.name} for ${dmg} damage!`, "action");
        spawnFloatingText(`-${dmg} HP`, "damage", 50, 40);
    }

    if (w.hp <= 0) {
        setScene("wilderness", "WILDERNESS TRAIL");
        addLog(`You defeated the ${w.name}!`, "victory");
        addGold(30);
        addScore(w.reward);
        unlockAchievement("first_blood");
        recordWildernessKill(w.name);
        renderChoices([
            { text: "1. Continue deeper on the Trail", action: goWilderness },
            { text: "2. Open World Map", action: renderWorldMap }
        ]);
        return;
    }

    const eDmg = mitigate(Math.floor(Math.random() * (w.dmgHigh - w.dmgLow + 1)) + w.dmgLow);
    state.hp -= eDmg;
    addLog(`The ${w.name} strikes back for ${eDmg} damage!`, "alert");
    spawnFloatingText(`-${eDmg} HP`, "damage", 25, 65);
    updateHUD();

    if (state.hp <= 0) {
        gameOver(`You were slain by a ferocious ${w.name} on the Wilderness Trail.`);
        return;
    }

    renderWildernessTurn();
}

function usePotionWilderness() {
    const idx = state.inventory.indexOf("Healing Potion");
    if (idx !== -1) {
        state.inventory.splice(idx, 1);
        healPlayer(getPotionHealAmount());
        renderWildernessTurn();
    } else {
        addLog("No Healing Potions in inventory!", "alert");
    }
}

function battleCat() {
    sfx.playClick();
    state.location = "lair";
    state.catEyesGlowing = false;
    sfx.playMusic("battle");
    setScene("lair", "CAT'S HALL");
    clearLog();
    addLog("Crimson braziers cast dramatic shadows across the vaulted obsidian hall of Cat's Hall.", "alert");
    addLog("Atop the high cushion throne, Lord Rodrigues the Shadow Cat uncoils his dark fur with a terrifying roar!", "alert");

    if (!state.hasSword) {
        addLog("⚠️ WARNING: You do not possess the Sunblade! Your weapons cannot penetrate Rodrigues's fur!", "alert");
    }

    renderCatTurn();
}

function renderCatTurn() {
    addLog(`🐾 RODRIGUES HP: ${state.catHp} | YOUR HP: ${state.hp}`);
    if (state.catEyesGlowing) {
        addLog("🔴 DANGER! RODRIGUES'S EYES GLOW FIERY CRIMSON! HE IS ABOUT TO EXECUTE A LETHAL SHADOW POUNCE!", "alert");
    }

    const choices = [
        { text: "1. Slash with Weapon", action: attackCat },
        { text: "2. Raise Shield to Defend & Block", action: defendCat },
        { text: "3. Drink Healing Potion", action: useHealCat },
        { text: "4. Retreat to World Map", action: renderWorldMap }
    ];
    if (state.knightFreed && !state.knightAllyUsed) {
        choices.push({ text: "5. Call upon Sir Johan to strike Rodrigues", action: callKnightAlly });
    }
    renderChoices(choices);
}

function triggerBossDefeatSequence() {
    sfx.playVictory();
    renderChoices([
        { text: "[ FINAL SUNBLADE STRIKE... ]", action: () => { } }
    ]);

    spawnFloatingText("FINAL SUNBLADE STRIKE!", "crit", 50, 30);
    addLog("The Legendary Sunblade strikes Lord Rodrigues with overwhelming holy radiance!", "victory");
    addLog("Lord Rodrigues staggers backward, his dark aura flickering violently as holy light surges through Cat's Hall!", "alert");

    // Stage 2: Holy explosion and collapse of shadow matrix (t = 2.5s)
    setTimeout(() => {
        renderChoices([
            { text: "[ SHADOW RECLAMATION... ]", action: () => { } }
        ]);
        spawnFloatingText("SHADOW MATRIX SHATTERING!", "crit", 50, 40);
        addLog("Holy fire erupts from within the Shadow Cat! The vaulted obsidian hall trembles as his power collapses!", "victory");
    }, 2500);

    // Stage 3: Dissolution into celestial embers & Princess Elsa freed (t = 5.5s)
    setTimeout(() => {
        renderChoices([
            { text: "[ PRINCESS ELSA UNCHAINED... ]", action: () => { } }
        ]);
        spawnFloatingText("SHADOW CAT DISSOLVES IN SUNFIRE!", "victory", 50, 48);
        addLog("Lord Rodrigues lets out a final roaring hiss as his shadowy form dissolves into glowing celestial embers!", "victory");
        addLog("Princess Elsa's magical binding chains shatter into golden dust! She steps forward, saved at last!", "victory");
    }, 5500);

    // Stage 4: Realm triumph beat (t = 8.5s)
    setTimeout(() => {
        renderChoices([
            { text: "[ REALM RESTORED... ]", action: () => { } }
        ]);
        spawnFloatingText("TRIUMPH OF EAST GREVIE!", "gold", 50, 35);
        addLog("Peace descends upon the realm of East Grevie. The dark age of the Shadow Cat is brought to an end!", "victory");
    }, 8500);

    // Stage 5: Victory summary screen transition (t = 11.5s)
    setTimeout(() => {
        winGame();
    }, 11500);
}

function callKnightAlly() {
    sfx.playSlash();
    const dmg = Math.floor(Math.random() * 11) + 25;
    state.catHp -= dmg;
    state.knightAllyUsed = true;
    addLog(`Sir Johan charges in and strikes Rodrigues for ${dmg} damage - the cat has no chance to retaliate!`, "victory");

    if (state.catHp <= 0) {
        triggerBossDefeatSequence();
        return;
    }
    renderCatTurn();
}

function attackCat() {
    sfx.playSlash();
    let dmg = 0;
    if (state.hasSword) {
        const rolled = rollAttack();
        dmg = rolled.dmg;
        if (state.catExposed) {
            dmg = Math.floor(dmg * 1.5);
            state.catExposed = false;
            addLog(`WEAK SPOT STRICKEN! You deal ${dmg} EXTRA CRITICAL DAMAGE!`, "victory");
            spawnFloatingText(`🎯 -${dmg} HP!`, "crit", 50, 40);
        } else if (rolled.crit) {
            addLog(`CRITICAL HIT! The Sunblade cleaves through the cat's thick fur for ${dmg} massive damage!`, "victory");
            spawnFloatingText(`💥 -${dmg} HP`, "crit", 50, 40);
        } else {
            addLog(`The Sunblade pierces the cat's thick fur for ${dmg} DAMAGE!`, "victory");
            spawnFloatingText(`-${dmg} HP`, "damage", 50, 40);
        }
        state.catHp -= dmg;
    } else {
        addLog("YOUR WEAPON REBOUNDS HARMLESSLY OFF RODRIGUES'S THICK FUR! (0 Damage)", "alert");
        addLog("Without the Legendary Sunblade, no mortal weapon can pierce the cat's fur!", "alert");
        spawnFloatingText("🛡️ IMMUNE! (0 HP)", "event", 50, 40);
        state.catExposed = false;
    }

    if (state.catHp <= 0) {
        triggerBossDefeatSequence();
        return;
    }

    // Check if Cat was glowing crimson eyes
    if (state.catEyesGlowing) {
        state.catEyesGlowing = false;
        state.hp = 0;
        updateHUD();
        addLog("💥 INSTANT KILL! You failed to raise your shield! Rodrigues leaps through the shadows and slays you instantly with a lethal Crimson Shadow Pounce!", "alert");
        gameOver("You were slain instantly by Lord Rodrigues's unblocked Crimson Shadow Pounce! (Tip: Raise your shield when his eyes glow!)");
        return;
    } else {
        // Cat counter attack or charge crimson eyes
        if (Math.random() < 0.45) {
            state.catEyesGlowing = true;
            addLog("🔴 RODRIGUES CROUCHES LOW! HIS EYES BEGIN TO GLOW FIERY CRIMSON!", "alert");
            spawnFloatingText("🔴 CRIMSON EYES!", "event", 50, 30);
        } else {
            const dDmg = mitigate(Math.floor(Math.random() * 16) + 20);
            state.hp -= dDmg;
            addLog(`Rodrigues slashes with razor claws! You take ${dDmg} damage!`, "alert");
            spawnFloatingText(`-${dDmg} HP`, "damage", 25, 65);
            updateHUD();
            if (state.hp <= 0) {
                gameOver("You fell in battle against Rodrigues the Shadow Cat.");
                return;
            }
        }
    }

    renderCatTurn();
}

function defendCat() {
    sfx.playClick();
    if (state.catEyesGlowing) {
        state.catEyesGlowing = false;
        addLog("🛡️ PERFECT BLOCK! You raise your shield high just as Rodrigues executes his Crimson Shadow Pounce!", "victory");
        addLog("💥 The lethal dark strike shatters harmlessly against your shield guard! Rodrigues is stunned!", "victory");
        addLog("✨ RODRIGUES IS STUNNED & EXPOSES HIS CHEST WEAK SPOT! Your next attack deals +50% BONUS DAMAGE!", "event");
        spawnFloatingText("🛡️ PERFECT BLOCK!", "dodge", 50, 40);
        state.catExposed = true;
        state.hp -= 2; // Minimal chip damage
        unlockAchievement("perfect_guard");
    } else {
        addLog("🛡️ YOU RAISE YOUR SHIELD TO BLOCK RODRIGUES'S RAZOR CLAWS!", "event");
        const rawDmg = Math.floor(Math.random() * 8) + 12;
        const dDmg = Math.max(1, Math.floor(rawDmg * 0.20));
        state.hp -= dDmg;
        addLog(`Your shield absorbs 80% of the cat's strike! You take only ${dDmg} damage!`, "event");
        addLog("✨ RODRIGUES EXPOSES A VULNERABLE WEAK SPOT IN ITS CHEST FUR! Your next attack deals +50% EXTRA DAMAGE!", "victory");
        state.catExposed = true;
    }

    updateHUD();

    if (state.hp <= 0) {
        gameOver("You fell in battle against Rodrigues the Shadow Cat.");
        return;
    }

    renderCatTurn();
}

function useHealCat() {
    let idx = state.inventory.indexOf("Elixir of Life");
    if (idx !== -1) {
        state.inventory.splice(idx, 1);
        healPlayer(60);
    } else {
        idx = state.inventory.indexOf("Healing Potion");
        if (idx !== -1) {
            state.inventory.splice(idx, 1);
            healPlayer(getPotionHealAmount());
        } else {
            addLog("You have no healing items left!", "alert");
            renderCatTurn();
            return;
        }
    }

    // Check if Cat was glowing crimson eyes
    if (state.catEyesGlowing) {
        state.catEyesGlowing = false;
        state.hp = 0;
        updateHUD();
        addLog("💥 INSTANT KILL! While you drank a potion, Rodrigues pounces with lethal unblocked force and slays you instantly!", "alert");
        gameOver("You were slain instantly by Lord Rodrigues's unblocked Crimson Shadow Pounce! (Tip: Raise your shield when his eyes glow!)");
        return;
    }

    renderCatTurn();
}

function gameOver(reason) {
    clearLog();
    sfx.stopMusic();
    addLog("💀 GAME OVER - YOU HAVE FALLEN IN BATTLE", "alert");
    addLog(reason, "alert");
    addLog(`Final Score: ${state.score} PTS`, "event");
    addLog("Select 'Return to Main Menu' below to choose a new hero class and try again.", "event");

    renderChoices([
        { text: "Return to Main Menu", action: exitToMainMenu }
    ]);
}

function getHeroRating(score) {
    if (score >= 1800) return "GRAND HERO OF THE REALM";
    if (score >= 1400) return "MASTER CAT SLAYER";
    if (score >= 1100) return "VALIANT DEFENDER OF THE REALM";
    return "NOVICE ADVENTURER OF THE REALM";
}

function winGame() {
    clearLog();
    sfx.playVictory();
    addScore(1000);

    const rating = getHeroRating(state.score);

    addLog("============================================================", "victory");
    addLog("           VICTORY! THE KINGDOM IS SAVED!", "victory");
    addLog("============================================================", "victory");
    addLog("You vanquished Rodrigues the Shadow Cat, rescued Princess Elsa, and saved the kingdom!", "event");
    unlockAchievement("savior_of_realm");

    let speechText = `Sunlight breaks as ${state.name} returns triumphant! With Princess Elsa rescued and Lord Rodrigues vanquished, peace is restored to the realm.`;
    if (state.knightFreed) {
        speechText += " Sir Johan rides proud at your flank, his sworn oath honored.";
        addLog("Sir Johan rides beside you into the Citadel, his life-debt repaid in blood and fire.", "event");
    }
    if (state.goblinSpared) {
        speechText += " Whispers of your wisdom and mercy echo through the Whispering Forest.";
        addLog("Word spreads of the mercy you showed the Goblin Rogue in the Whispering Forest.", "event");
    } else if (state.goblinDefeated) {
        addLog("Tales of the Goblin Rogue you slew in the misty forest travel far and wide.", "event");
    }
    speechText += " Your courage will echo through legend forever!";

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
        { text: "Return to Main Menu", action: exitToMainMenu }
    ]);
}

function resetAdventureState() {
    state.visitedLocations = ["village"];
    state.elderTalked = false;
    state.blacksmithTalked = false;
    state.hasRuneScroll = false;
    state.hasSunCrystal = false;
    state.hasHiltOfDawn = false;
    state.hasBlueprint = false;
    state.hasDormantSunblade = false;
    state.hasSword = false;
    state.hasKey = false;
    state.blueprintReturned = false;
    state.goblinDefeated = false;
    state.goblinSpared = false;
    state.goblinEncountered = false;
    state.stumpSearched = false;
    state.caveSearched = false;
    state.knightFreed = false;
    state.knightAllyUsed = false;
    state.hasIronShield = false;
    state.fairyVisited = false;
    state.bossDefeated = false;
    state.goblinHp = 35;
    state.catHp = 480;
    state.trollHp = 60;
    state.wilderness = null;
    selectedQuestId = "main_elsa";
}

function exitToMainMenu() {
    narrator.stop();
    resetAdventureState();
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
    state.maxHp = calculateMaxHp();
    state.hp = state.maxHp;
    updateHUD();
    updateStatsModalUI();

    if (typeof statsModalEl !== 'undefined' && statsModalEl) statsModalEl.classList.add("hidden");
    if (typeof mapModalEl !== 'undefined' && mapModalEl) mapModalEl.classList.add("hidden");
    if (typeof galleryModalEl !== 'undefined' && galleryModalEl) galleryModalEl.classList.add("hidden");
    if (typeof creditsModalEl !== 'undefined' && creditsModalEl) creditsModalEl.classList.add("hidden");
    if (typeof nameModalEl !== 'undefined' && nameModalEl) nameModalEl.classList.add("hidden");
    const vModal = document.getElementById("victory-modal");
    if (vModal) vModal.classList.add("hidden");

    const mMenu = document.getElementById("main-menu-modal");
    if (mMenu) mMenu.classList.remove("hidden");
}

function restartGame() {
    resetAdventureState();
    const cls = state.heroClass || "paladin";
    if (cls === "paladin") {
        state.str = 3; state.agi = 3; state.end = 6; state.lck = 3; state.gold = 50;
        state.inventory = ["Bread"];
        state.equipment = {
            weapon: { name: "Wooden Sword", bonusStr: 0, bonusMinDmg: 8, bonusMaxDmg: 15 },
            shield: { name: "Wooden Shield", bonusArmor: 5, bonusEnd: 0 },
            armor: { name: "Traveler's Tunic", bonusArmor: 1, bonusAgi: 0 },
            accessory: null
        };
    } else if (cls === "ranger") {
        state.str = 3; state.agi = 5; state.end = 3; state.lck = 4; state.gold = 50;
        state.inventory = ["Bread"];
        state.equipment = {
            weapon: { name: "Hunter's Shortbow", bonusStr: 0, bonusMinDmg: 8, bonusMaxDmg: 15 },
            shield: { name: "Leather Quiver Guard", bonusArmor: 5, bonusEnd: 0 },
            armor: { name: "Scout's Cloak", bonusArmor: 1, bonusAgi: 0 },
            accessory: null
        };
    } else if (cls === "alchemist") {
        state.str = 4; state.agi = 4; state.end = 4; state.lck = 4; state.gold = 75;
        state.inventory = ["Bread", "Healing Potion", "Healing Potion", "Healing Potion"];
        state.equipment = {
            weapon: { name: "Catalyst Wand", bonusStr: 0, bonusMinDmg: 8, bonusMaxDmg: 15 },
            shield: { name: "Rune Codex", bonusArmor: 5, bonusEnd: 0 },
            armor: { name: "Scholar's Robe", bonusArmor: 1, bonusAgi: 0 },
            accessory: null
        };
    }
    state.ap = 0;
    state.level = 1;
    state.exp = 0;
    state.expToNextLevel = 100;
    state.score = 0;
    state.maxHp = calculateMaxHp();
    state.hp = state.maxHp;
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
const narrateBtnEl = document.getElementById("narrate-btn");
const introLoreCardEl = document.querySelector(".intro-lore-card");

if (narrateBtnEl) {
    narrateBtnEl.addEventListener("click", () => {
        if (introLoreCardEl) introLoreCardEl.classList.add("speaking");
        narrator.speak(`Shadows fall over the Village of East Grevie. The ruthless Cat Rodrigues has abducted Princess Elsa to his cursed lair. Only the Legendary Sunblade can pierce the beast's thick fur. Hero, your quest begins now...`, {
            onSpeechEnd: () => {
                if (introLoreCardEl) introLoreCardEl.classList.remove("speaking");
            }
        });
    });
}

document.querySelectorAll(".class-card").forEach(card => {
    card.addEventListener("click", () => {
        if (card.classList.contains("locked")) {
            sfx.playClick();
            addLog("🔒 Unlock all 15 Trophies to awaken the Sunblade Paladin in New Game+!", "alert");
            return;
        }

        document.querySelectorAll(".class-card").forEach(c => c.classList.remove("selected"));
        card.classList.add("selected");
        sfx.playClick();

        const heroClass = card.getAttribute("data-class") || "knight";
        state.heroClass = heroClass;

        const creationPortraitImgEl = document.getElementById("creation-portrait-img");
        const creationClassBadgeEl = document.getElementById("creation-class-badge");

        if (creationPortraitImgEl && creationClassBadgeEl) {
            if (heroClass === "knight") {
                creationPortraitImgEl.src = "assets/images/portrait_knight.jpg";
                creationClassBadgeEl.textContent = "ROYAL KNIGHT";
            } else if (heroClass === "ranger") {
                creationPortraitImgEl.src = "assets/images/portrait_ranger.jpg";
                creationClassBadgeEl.textContent = "WOODLAND RANGER";
            } else if (heroClass === "alchemist") {
                creationPortraitImgEl.src = "assets/images/portrait_alchemist.jpg";
                creationClassBadgeEl.textContent = "ROYAL ALCHEMIST";
            } else if (heroClass === "paladin") {
                creationPortraitImgEl.src = "assets/images/portrait_paladin.jpg";
                creationClassBadgeEl.textContent = "SUNBLADE PALADIN";
            }
        }
    });
});

const creationPortraitFrameEl = document.getElementById("creation-portrait-frame");
if (creationPortraitFrameEl) {
    creationPortraitFrameEl.addEventListener("click", () => {
        const creationPortraitImgEl = document.getElementById("creation-portrait-img");
        const creationClassBadgeEl = document.getElementById("creation-class-badge");
        if (creationPortraitImgEl) {
            const badgeText = creationClassBadgeEl ? creationClassBadgeEl.textContent : "HERO PORTRAIT";
            openLightbox(creationPortraitImgEl.src, badgeText);
        }
    });
}

startBtnEl.addEventListener("click", () => {
    resetAdventureState();
    state.name = nameInputEl.value.trim() || "Sir Ario";

    const selectedCard = document.querySelector(".class-card.selected");
    const chosenClass = selectedCard ? (selectedCard.getAttribute("data-class") || "knight") : "knight";
    state.heroClass = chosenClass;

    if (chosenClass === "knight") {
        state.end = 5;
        state.str = 4;
        state.agi = 3;
        state.lck = 3;
        state.equipment = {
            weapon: { name: "Steel Longsword", bonusStr: 0, bonusMinDmg: 9, bonusMaxDmg: 16 },
            shield: { name: "Iron Kite Shield", bonusArmor: 4, bonusEnd: 0 },
            armor: { name: "Knight's Chainmail", bonusArmor: 2, bonusAgi: 0 },
            accessory: null
        };
    } else if (chosenClass === "paladin") {
        state.end = 7;
        state.str = 5;
        state.agi = 4;
        state.lck = 4;
        state.gold = 300;
        state.ap = 3;
        state.equipment = {
            weapon: { name: "Sunfire Blade", bonusStr: 2, bonusMinDmg: 16, bonusMaxDmg: 26 },
            shield: { name: "Radiant Aegis", bonusArmor: 6, bonusEnd: 1 },
            armor: { name: "Sunfire Plate Armor", bonusArmor: 4, bonusAgi: 0 },
            accessory: { name: "Sunfire Sigil", bonusStr: 2, bonusAgi: 2, bonusEnd: 2, bonusLck: 2 }
        };
    } else if (chosenClass === "ranger") {
        state.end = 3;
        state.str = 3;
        state.agi = 5;
        state.lck = 4;
        state.equipment = {
            weapon: { name: "Hunter's Shortbow", bonusStr: 0, bonusMinDmg: 8, bonusMaxDmg: 15 },
            shield: { name: "Leather Quiver Guard", bonusArmor: 5, bonusEnd: 0 },
            armor: { name: "Scout's Cloak", bonusArmor: 1, bonusAgi: 0 },
            accessory: null
        };
    } else if (chosenClass === "alchemist") {
        state.str = 4;
        state.agi = 4;
        state.end = 4;
        state.lck = 4;
        state.gold = 75;
        state.inventory = ["Bread", "Healing Potion", "Healing Potion", "Healing Potion"];
        state.equipment = {
            weapon: { name: "Catalyst Wand", bonusStr: 0, bonusMinDmg: 8, bonusMaxDmg: 15 },
            shield: { name: "Rune Codex", bonusArmor: 5, bonusEnd: 0 },
            armor: { name: "Scholar's Robe", bonusArmor: 1, bonusAgi: 0 },
            accessory: null
        };
    }

    state.maxHp = calculateMaxHp();
    state.hp = state.maxHp;

    narrator.stop();
    if (introLoreCardEl) introLoreCardEl.classList.remove("speaking");
    nameModalEl.classList.add("hidden");
    updateHUD();
    updateStatsModalUI();
    sfx.init();
    renderVillage();
});

// --- Main Menu Title Screen Starter Panel Event Handlers ---
const mainMenuModalEl = document.getElementById("main-menu-modal");
const prologueModalEl = document.getElementById("prologue-modal");
const menuStartBtnEl = document.getElementById("menu-start-btn");
const menuGalleryBtnEl = document.getElementById("menu-gallery-btn");
const menuCreditsBtnEl = document.getElementById("menu-credits-btn");
const titleBannerContainerEl = document.getElementById("title-banner-container");
const titleBannerImgEl = document.getElementById("title-banner-img");

const prologueContinueBtnEl = document.getElementById("prologue-continue-btn");
const prologueBackBtnEl = document.getElementById("prologue-back-btn");
const creationBackBtnEl = document.getElementById("creation-back-btn");

const galleryModalEl = document.getElementById("gallery-modal");
const closeGalleryModalBtn = document.getElementById("close-gallery-modal-btn");

const creditsModalEl = document.getElementById("credits-modal");
const closeCreditsModalBtn = document.getElementById("close-credits-modal-btn");

if (menuStartBtnEl) {
    menuStartBtnEl.addEventListener("click", () => {
        if (mainMenuModalEl) mainMenuModalEl.classList.add("hidden");
        if (prologueModalEl) prologueModalEl.classList.remove("hidden");
        sfx.playClick();
    });
}

if (prologueContinueBtnEl) {
    prologueContinueBtnEl.addEventListener("click", () => {
        narrator.stop();
        if (introLoreCardEl) introLoreCardEl.classList.remove("speaking");
        if (prologueModalEl) prologueModalEl.classList.add("hidden");
        if (nameModalEl) nameModalEl.classList.remove("hidden");
        sfx.playClick();
    });
}

if (prologueBackBtnEl) {
    prologueBackBtnEl.addEventListener("click", () => {
        narrator.stop();
        if (introLoreCardEl) introLoreCardEl.classList.remove("speaking");
        if (prologueModalEl) prologueModalEl.classList.add("hidden");
        if (mainMenuModalEl) mainMenuModalEl.classList.remove("hidden");
        sfx.playClick();
    });
}

if (creationBackBtnEl) {
    creationBackBtnEl.addEventListener("click", () => {
        if (nameModalEl) nameModalEl.classList.add("hidden");
        if (prologueModalEl) prologueModalEl.classList.remove("hidden");
        sfx.playClick();
    });
}

if (menuGalleryBtnEl) {
    menuGalleryBtnEl.addEventListener("click", () => {
        if (galleryModalEl) galleryModalEl.classList.remove("hidden");
        sfx.playClick();
    });
}

if (menuCreditsBtnEl) {
    menuCreditsBtnEl.addEventListener("click", () => {
        if (creditsModalEl) creditsModalEl.classList.remove("hidden");
        sfx.playClick();
    });
}

if (closeGalleryModalBtn && galleryModalEl) {
    closeGalleryModalBtn.addEventListener("click", () => {
        galleryModalEl.classList.add("hidden");
    });
}

if (closeCreditsModalBtn && creditsModalEl) {
    closeCreditsModalBtn.addEventListener("click", () => {
        creditsModalEl.classList.add("hidden");
    });
}

if (titleBannerContainerEl && titleBannerImgEl) {
    titleBannerContainerEl.addEventListener("click", () => {
        openLightbox(titleBannerImgEl.src, "EAST GREVIE ADVENTURES - TITLE ARTWORK");
    });
}

document.querySelectorAll(".gallery-item").forEach(item => {
    item.addEventListener("click", () => {
        const src = item.getAttribute("data-src");
        const title = item.getAttribute("data-title");
        if (src) {
            openLightbox(src, title || "GALLERY ARTWORK", true);
        }
    });
});

// --- Fullscreen Artwork Lightbox Modal Handlers & Gallery Navigation ---
const imageFrameEl = document.getElementById("image-frame-container");
const lightboxModalEl = document.getElementById("lightbox-modal");
const lightboxImgEl = document.getElementById("lightbox-img");
const lightboxTitleEl = document.getElementById("lightbox-location-title");
const lightboxCloseBtnEl = document.getElementById("lightbox-close-btn");
const lightboxPrevBtnEl = document.getElementById("lightbox-prev-btn");
const lightboxNextBtnEl = document.getElementById("lightbox-next-btn");
const lightboxCounterEl = document.getElementById("lightbox-counter");

let activeGalleryList = [];
let currentGalleryIdx = 0;
let isLightboxGalleryMode = false;

function getGalleryItemList() {
    const items = [];
    document.querySelectorAll(".gallery-item").forEach(el => {
        const src = el.getAttribute("data-src") || (el.querySelector("img") ? el.querySelector("img").src : "");
        const title = el.getAttribute("data-title") || (el.querySelector(".gallery-item-title") ? el.querySelector(".gallery-item-title").textContent : "REALM ARTWORK");
        if (src) items.push({ src, title });
    });
    return items;
}

function openLightbox(imageSrc, titleText, isGalleryMode = false) {
    if (lightboxImgEl && lightboxModalEl) {
        isLightboxGalleryMode = isGalleryMode;
        const lightboxHintEl = document.querySelector(".lightbox-hint");

        if (isGalleryMode) {
            activeGalleryList = getGalleryItemList();
            const normTarget = imageSrc.split('/').pop().toLowerCase();

            currentGalleryIdx = activeGalleryList.findIndex(item => {
                const normItem = item.src.split('/').pop().toLowerCase();
                return normItem === normTarget;
            });

            if (currentGalleryIdx === -1) {
                activeGalleryList.push({ src: imageSrc, title: titleText || "EAST GREVIE ARTWORK" });
                currentGalleryIdx = activeGalleryList.length - 1;
            }

            if (lightboxPrevBtnEl) lightboxPrevBtnEl.classList.remove("hidden");
            if (lightboxNextBtnEl) lightboxNextBtnEl.classList.remove("hidden");
            if (lightboxCounterEl) lightboxCounterEl.classList.remove("hidden");
            if (lightboxHintEl) lightboxHintEl.textContent = "Use ◄ / ► arrow keys to browse | Click outside or ESC to close";

            updateLightboxDisplay();
        } else {
            activeGalleryList = [{ src: imageSrc, title: titleText || "EAST GREVIE ARTWORK" }];
            currentGalleryIdx = 0;

            if (lightboxImgEl) lightboxImgEl.src = imageSrc;
            if (lightboxTitleEl) lightboxTitleEl.textContent = titleText || "EAST GREVIE ARTWORK";

            if (lightboxPrevBtnEl) lightboxPrevBtnEl.classList.add("hidden");
            if (lightboxNextBtnEl) lightboxNextBtnEl.classList.add("hidden");
            if (lightboxCounterEl) lightboxCounterEl.classList.add("hidden");
            if (lightboxHintEl) lightboxHintEl.textContent = "Click outside or press ESC to close";
        }

        lightboxModalEl.classList.remove("hidden");
    }
}

function updateLightboxDisplay() {
    if (activeGalleryList.length === 0) return;
    const current = activeGalleryList[currentGalleryIdx];
    if (lightboxImgEl) lightboxImgEl.src = current.src;
    if (lightboxTitleEl) lightboxTitleEl.textContent = current.title;

    if (isLightboxGalleryMode && lightboxCounterEl) {
        lightboxCounterEl.textContent = `${currentGalleryIdx + 1} / ${activeGalleryList.length}`;
    }
}

function showNextLightboxImage() {
    if (!isLightboxGalleryMode || activeGalleryList.length <= 1) return;
    currentGalleryIdx = (currentGalleryIdx + 1) % activeGalleryList.length;
    updateLightboxDisplay();
    sfx.playClick();
}

function showPrevLightboxImage() {
    if (!isLightboxGalleryMode || activeGalleryList.length <= 1) return;
    currentGalleryIdx = (currentGalleryIdx - 1 + activeGalleryList.length) % activeGalleryList.length;
    updateLightboxDisplay();
    sfx.playClick();
}

function closeLightbox() {
    if (lightboxModalEl) {
        lightboxModalEl.classList.add("hidden");
    }
}

if (lightboxModalEl) {
    lightboxModalEl.addEventListener("click", (e) => {
        if (e.target === lightboxModalEl) {
            closeLightbox();
        }
    });
}

if (lightboxPrevBtnEl) {
    lightboxPrevBtnEl.addEventListener("click", (e) => {
        e.stopPropagation();
        showPrevLightboxImage();
    });
}

if (lightboxNextBtnEl) {
    lightboxNextBtnEl.addEventListener("click", (e) => {
        e.stopPropagation();
        showNextLightboxImage();
    });
}

if (lightboxCloseBtnEl) {
    lightboxCloseBtnEl.addEventListener("click", (e) => {
        e.stopPropagation();
        closeLightbox();
    });
}

document.addEventListener("keydown", (e) => {
    if (!lightboxModalEl || lightboxModalEl.classList.contains("hidden")) return;

    if (e.key === "Escape") {
        closeLightbox();
    } else if (isLightboxGalleryMode && (e.key === "ArrowRight" || e.key === "KeyD" || e.code === "KeyD")) {
        showNextLightboxImage();
    } else if (isLightboxGalleryMode && (e.key === "ArrowLeft" || e.key === "KeyA" || e.code === "KeyA")) {
        showPrevLightboxImage();
    }
});

// Scene Location Artwork Lightbox Trigger
if (imageFrameEl) {
    imageFrameEl.addEventListener("click", () => {
        if (sceneImgEl) {
            const locTitle = locationNameEl ? locationNameEl.textContent : "LOCATION ARTWORK";
            openLightbox(sceneImgEl.src, locTitle);
        }
    });
}

// Intro Image Frame Lightbox Triggers (Prologue Modal)
const introImgFrameEl = document.getElementById("prologue-image-frame-container");
const introImgEl = document.getElementById("intro-image");

if (introImgFrameEl) {
    introImgFrameEl.addEventListener("click", () => {
        if (introImgEl) {
            openLightbox(introImgEl.src, "THE ABDUCTION OF PRINCESS ELSA");
        }
    });
}

// Victory Image Frame Lightbox Triggers (Victory Modal)
const victoryNarrateBtnEl = document.getElementById("victory-narrate-btn");
const victoryRestartBtnEl = document.getElementById("victory-restart-btn");
const victoryImgFrameEl = document.getElementById("victory-image-frame-container");
const victoryImgEl = document.getElementById("victory-image");
const victoryLoreCardEl = document.querySelector(".victory-lore-card");

if (victoryImgFrameEl) {
    victoryImgFrameEl.addEventListener("click", () => {
        if (victoryImgEl) {
            openLightbox(victoryImgEl.src, "EAST GREVIE VILLAGE - PRINCESS ELSA RESCUED");
        }
    });
}

if (victoryNarrateBtnEl) {
    victoryNarrateBtnEl.addEventListener("click", () => {
        const victoryText = document.getElementById("victory-lore-text") ? document.getElementById("victory-lore-text").textContent : "";
        if (victoryLoreCardEl) victoryLoreCardEl.classList.add("speaking");
        narrator.speak(victoryText, {
            onSpeechEnd: () => {
                if (victoryLoreCardEl) victoryLoreCardEl.classList.remove("speaking");
            }
        });
    });
}

if (victoryRestartBtnEl) {
    victoryRestartBtnEl.addEventListener("click", () => {
        exitToMainMenu();
    });
}

// --- Modern Audio Settings Modal Event Handlers ---
const audioSettingsBtnEl = document.getElementById("audio-settings-btn");
const audioSettingsModalEl = document.getElementById("audio-settings-modal");
const closeAudioSettingsModalBtn = document.getElementById("close-audio-settings-modal-btn");
const voiceSelectEl = document.getElementById("voice-select");
const testVoiceBtnEl = document.getElementById("test-voice-btn");

const masterVolEl = document.getElementById("master-vol");
const musicVolEl = document.getElementById("music-vol");
const sfxVolEl = document.getElementById("sfx-vol");
const voiceVolEl = document.getElementById("voice-vol");

const masterVolValEl = document.getElementById("master-vol-val");
const musicVolValEl = document.getElementById("music-vol-val");
const sfxVolValEl = document.getElementById("sfx-vol-val");
const voiceVolValEl = document.getElementById("voice-vol-val");

function populateVoiceDropdown() {
    if (!voiceSelectEl) return;
    const voices = narrator.getAvailableVoices();
    voiceSelectEl.innerHTML = "";
    voices.forEach(v => {
        const option = document.createElement("option");
        option.value = v.name;
        const isNeural = v.name.includes("Natural") || v.name.includes("Neural") || v.name.includes("Online") || v.name.includes("HD");
        option.textContent = `${v.name} (${v.lang})${isNeural ? " ✨ [HD NEURAL]" : ""}`;
        if (narrator.selectedVoice && (v.name === narrator.selectedVoice.name || v.voiceURI === narrator.selectedVoice.voiceURI)) {
            option.selected = true;
        }
        voiceSelectEl.appendChild(option);
    });
}

if (audioSettingsBtnEl && audioSettingsModalEl) {
    audioSettingsBtnEl.addEventListener("click", () => {
        populateVoiceDropdown();
        audioSettingsModalEl.classList.remove("hidden");
        sfx.playClick();
    });
}

if (closeAudioSettingsModalBtn && audioSettingsModalEl) {
    closeAudioSettingsModalBtn.addEventListener("click", () => {
        audioSettingsModalEl.classList.add("hidden");
        sfx.playClick();
    });
}

if (voiceSelectEl) {
    voiceSelectEl.addEventListener("change", () => {
        narrator.setVoiceByName(voiceSelectEl.value);
    });
}

if (testVoiceBtnEl) {
    testVoiceBtnEl.addEventListener("click", () => {
        narrator.speak("Welcome, brave adventurer! This is your storyteller voice speaking in modern natural audio.");
    });
}

if (masterVolEl && masterVolValEl) {
    masterVolEl.addEventListener("input", (e) => {
        const val = parseInt(e.target.value, 10);
        masterVolValEl.textContent = `${val}%`;
        sfx.setMasterVolume(val / 100);
    });
}

if (musicVolEl && musicVolValEl) {
    musicVolEl.addEventListener("input", (e) => {
        const val = parseInt(e.target.value, 10);
        musicVolValEl.textContent = `${val}%`;
        sfx.setMusicVolume(val / 100);
        sfx.musicEnabled = val > 0;
        if (val === 0) {
            sfx.stopMusic();
        } else if (!sfx.currentTrack && state.location) {
            const trackMap = { village: "village", forest: "forest", temple: "forest", mountain: "forest", goblin: "battle", lair: "battle", watchtower: "forest", blacksmith: "village", cave: "battle" };
            sfx.playMusic(trackMap[state.location] || "village");
        }
    });
}

if (sfxVolEl && sfxVolValEl) {
    sfxVolEl.addEventListener("input", (e) => {
        const val = parseInt(e.target.value, 10);
        sfxVolValEl.textContent = `${val}%`;
        sfx.setSfxVolume(val / 100);
        sfx.enabled = val > 0;
    });
}

if (voiceVolEl && voiceVolValEl) {
    voiceVolEl.addEventListener("input", (e) => {
        const val = parseInt(e.target.value, 10);
        voiceVolValEl.textContent = `${val}%`;
        sfx.setVoiceVolume(val / 100);
        narrator.enabled = val > 0;
        if (val === 0) {
            narrator.stop();
        }
    });
}

if (resetBtnEl) {
    resetBtnEl.addEventListener("click", () => {
        sfx.playClick();
        showCustomConfirmModal(
            "EXIT TO MAIN MENU?",
            "Are you sure you want to exit to the main menu? Progress for your current run will be lost.",
            () => {
                exitToMainMenu();
            },
            "EXIT GAME"
        );
    });
}

const mapModalEl = document.getElementById("map-modal");
const closeMapModalBtn = document.getElementById("close-map-modal-btn");
const heroMapTokenEl = document.getElementById("hero-map-token");

const mapWaypoints = {
    village: { top: "58%", left: "44%" },
    blacksmith: { top: "58%", left: "44%" },
    forest: { top: "26%", left: "58%" },
    goblin: { top: "26%", left: "58%" },
    temple: { top: "8%", left: "38%" },
    wilderness: { top: "88%", left: "76%" },
    mountain: { top: "79%", left: "12%" },
    cave: { top: "79%", left: "12%" },
    watchtower: { top: "80%", left: "34%" },
    lair: { top: "48%", left: "15%" },
    fairy: { top: "29%", left: "88%" }
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
        else if (loc === "lair") battleCat();
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
        addLog("✨ Bioluminescent lotus flowers illuminate the crystalline waters of the Secret Fairy Fountain!", "event");
        addLog("Glowing fairy sprites hover in the tranquility, blessing your quest with health and fairy gold!", "victory");
        healPlayer(50);
        addGold(30);
        addScore(100);

        if (!state.hasHiltOfDawn) {
            state.hasHiltOfDawn = true;
            state.inventory.push("Hilt of Dawn");
            const count = getRelicCount();
            addLog(`🛡️ The Fairy Queen presents you with the radiant Hilt of Dawn! (Sunblade Relic ${count}/3)`, "victory");
            sfx.playItem();
            updateHUD();
        }
        unlockAchievement("fairy_blessing");
    } else {
        addLog("The fairy sprites welcome you warmly.");
        healPlayer(20);
    }
    renderChoices([
        { text: "Open World Map", action: renderWorldMap }
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

document.querySelectorAll(".map-pin").forEach(btn => {
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
    const statHeroClassBadgeEl = document.getElementById("stat-hero-class-badge");
    const statPassivePerkTextEl = document.getElementById("stat-passive-perk-text");
    const portraitImgEl = document.querySelector("#hero-portrait-frame img");

    const heroClass = state.heroClass || "knight";
    if (statHeroClassBadgeEl) {
        if (heroClass === "knight") statHeroClassBadgeEl.textContent = "ROYAL KNIGHT";
        else if (heroClass === "paladin") statHeroClassBadgeEl.textContent = "SUNBLADE PALADIN";
        else if (heroClass === "ranger") statHeroClassBadgeEl.textContent = "WOODLAND RANGER";
        else if (heroClass === "alchemist") statHeroClassBadgeEl.textContent = "ROYAL ALCHEMIST";
    }

    if (statPassivePerkTextEl) {
        if (heroClass === "knight") statPassivePerkTextEl.textContent = "Bastion Shield (-2 Physical Damage Taken)";
        else if (heroClass === "paladin") statPassivePerkTextEl.textContent = "Sunfire Ascendant (-3 Damage, Radiant Sunfire Blade)";
        else if (heroClass === "ranger") statPassivePerkTextEl.textContent = "Eagle Eye (+10% Critical Chance)";
        else if (heroClass === "alchemist") statPassivePerkTextEl.textContent = "Elixir Master (Potions Heal +60 HP & Extra Gold)";
    }

    if (portraitImgEl) {
        if (heroClass === "knight") portraitImgEl.src = "assets/images/portrait_knight.jpg";
        else if (heroClass === "paladin") portraitImgEl.src = "assets/images/portrait_paladin.jpg";
        else if (heroClass === "ranger") portraitImgEl.src = "assets/images/portrait_ranger.jpg";
        else if (heroClass === "alchemist") portraitImgEl.src = "assets/images/portrait_alchemist.jpg";
    }

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

const heroPortraitFrameEl = document.getElementById("hero-portrait-frame");
if (heroPortraitFrameEl) {
    heroPortraitFrameEl.addEventListener("click", () => {
        const portraitImgEl = document.querySelector("#hero-portrait-frame img");
        const currentSrc = portraitImgEl ? portraitImgEl.src : "assets/images/portrait_knight.jpg";
        const className = state.heroClass ? state.heroClass.toUpperCase() : "PALADIN";
        openLightbox(currentSrc, `${state.name} - ${className} PORTRAIT`);
    });
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

// --- Achievement Modal Handlers & Initialization ---
const achievementsBtnEl = document.getElementById("achievements-btn");
const achievementsModalEl = document.getElementById("achievements-modal");
const closeAchievementsModalBtn = document.getElementById("close-achievements-modal-btn");

if (achievementsBtnEl) {
    achievementsBtnEl.addEventListener("click", () => {
        sfx.playClick();
        updateAchievementsUI();
        if (achievementsModalEl) achievementsModalEl.classList.remove("hidden");
    });
}

if (closeAchievementsModalBtn && achievementsModalEl) {
    closeAchievementsModalBtn.addEventListener("click", () => {
        sfx.playClick();
        achievementsModalEl.classList.add("hidden");
    });
}

if (achievementsModalEl) {
    achievementsModalEl.addEventListener("click", (e) => {
        if (e.target === achievementsModalEl) {
            achievementsModalEl.classList.add("hidden");
        }
    });
}

const confirmModalEl = document.getElementById("confirm-modal");
const confirmModalTitleEl = document.getElementById("confirm-modal-title");
const confirmModalTextEl = document.getElementById("confirm-modal-text");
const confirmCancelBtnEl = document.getElementById("confirm-cancel-btn");
const confirmOkBtnEl = document.getElementById("confirm-ok-btn");
let currentConfirmCallback = null;

function showCustomConfirmModal(title, text, onConfirm, okText = "CONFIRM RESET") {
    if (!confirmModalEl) return;
    if (confirmModalTitleEl) confirmModalTitleEl.textContent = title;
    if (confirmModalTextEl) confirmModalTextEl.textContent = text;
    if (confirmOkBtnEl) confirmOkBtnEl.textContent = okText;
    currentConfirmCallback = onConfirm;
    confirmModalEl.classList.remove("hidden");
    sfx.playClick();
}

if (confirmCancelBtnEl && confirmModalEl) {
    confirmCancelBtnEl.addEventListener("click", () => {
        sfx.playClick();
        confirmModalEl.classList.add("hidden");
        currentConfirmCallback = null;
    });
}

if (confirmOkBtnEl && confirmModalEl) {
    confirmOkBtnEl.addEventListener("click", () => {
        sfx.playClick();
        confirmModalEl.classList.add("hidden");
        if (typeof currentConfirmCallback === "function") {
            currentConfirmCallback();
        }
        currentConfirmCallback = null;
    });
}

if (confirmModalEl) {
    confirmModalEl.addEventListener("click", (e) => {
        if (e.target === confirmModalEl) {
            confirmModalEl.classList.add("hidden");
            currentConfirmCallback = null;
        }
    });
}

const resetAchievementsBtnEl = document.getElementById("reset-achievements-btn");
if (resetAchievementsBtnEl) {
    resetAchievementsBtnEl.addEventListener("click", () => {
        showCustomConfirmModal(
            "RESET ALL TROPHIES?",
            "Are you sure you want to reset all 15 trophies, kill records, and hero unlocks? This action cannot be undone.",
            () => {
                resetAchievementsData();
            }
        );
    });
}

// Quest Journal Modal Handlers
const questsBtnEl = document.getElementById("quests-btn");
const questsModalEl = document.getElementById("quests-modal");
const closeQuestsModalBtn = document.getElementById("close-quests-modal-btn");

if (questsBtnEl && questsModalEl) {
    questsBtnEl.addEventListener("click", () => {
        sfx.playClick();
        updateQuestsUI();
        questsModalEl.classList.remove("hidden");
    });
}

if (closeQuestsModalBtn && questsModalEl) {
    closeQuestsModalBtn.addEventListener("click", () => {
        sfx.playClick();
        questsModalEl.classList.add("hidden");
    });
}

if (questsModalEl) {
    questsModalEl.addEventListener("click", (e) => {
        if (e.target === questsModalEl) {
            questsModalEl.classList.add("hidden");
        }
    });
}

// Initial achievements load from browser storage
loadAchievementsFromStorage();
updateAchievementsUI();
updateQuestsUI();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        state,
        QUESTS_DATA,
        speakToElder,
        renderBlacksmith,
        battleGoblin,
        resetAdventureState,
        isQuestDiscovered,
        isQuestCompleted,
        updateQuestsUI,
        getHeroRating
    };
}
