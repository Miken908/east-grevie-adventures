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
        osc.type = 'square';
        osc.frequency.setValueAtTime(440, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.05);
    }

    playSlash() {
        if (!this.enabled) return;
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(300, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.15);
    }

    playHeal() {
        if (!this.enabled) return;
        this.init();
        const notes = [330, 440, 554, 659];
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.06);
            gain.gain.setValueAtTime(0.15, this.ctx.currentTime + idx * 0.06);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + idx * 0.06 + 0.1);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(this.ctx.currentTime + idx * 0.06);
            osc.stop(this.ctx.currentTime + idx * 0.06 + 0.1);
        });
    }

    playItem() {
        if (!this.enabled) return;
        this.init();
        const notes = [523, 659, 783, 1046];
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'square';
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.05);
            gain.gain.setValueAtTime(0.1, this.ctx.currentTime + idx * 0.05);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + idx * 0.05 + 0.08);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(this.ctx.currentTime + idx * 0.05);
            osc.stop(this.ctx.currentTime + idx * 0.05 + 0.08);
        });
    }

    playVictory() {
        if (!this.enabled) return;
        this.init();
        this.stopMusic();
        const melody = [523, 659, 783, 1046, 880, 1046];
        melody.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'square';
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.12);
            gain.gain.setValueAtTime(0.15, this.ctx.currentTime + idx * 0.12);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + idx * 0.12 + 0.2);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(this.ctx.currentTime + idx * 0.12);
            osc.stop(this.ctx.currentTime + idx * 0.12 + 0.2);
        });
    }

    // --- 8-Bit Chiptune Background Music Sequencer ---
    playMusic(trackName) {
        if (this.currentTrack === trackName) return;
        this.stopMusic();
        this.currentTrack = trackName;
        if (!this.musicEnabled) return;

        this.init();
        const tracks = {
            village: [
                { f: 261.63, d: 0.25 }, { f: 329.63, d: 0.25 }, { f: 392.00, d: 0.25 }, { f: 523.25, d: 0.25 },
                { f: 440.00, d: 0.25 }, { f: 349.23, d: 0.25 }, { f: 392.00, d: 0.50 },
                { f: 293.66, d: 0.25 }, { f: 349.23, d: 0.25 }, { f: 440.00, d: 0.25 }, { f: 493.88, d: 0.25 },
                { f: 523.25, d: 0.50 }, { f: 392.00, d: 0.50 }
            ],
            forest: [
                { f: 220.00, d: 0.35 }, { f: 261.63, d: 0.35 }, { f: 329.63, d: 0.35 }, { f: 246.94, d: 0.35 },
                { f: 220.00, d: 0.50 }, { f: 196.00, d: 0.35 }, { f: 220.00, d: 0.50 }
            ],
            battle: [
                { f: 164.81, d: 0.15 }, { f: 164.81, d: 0.15 }, { f: 196.00, d: 0.15 }, { f: 164.81, d: 0.15 },
                { f: 220.00, d: 0.15 }, { f: 164.81, d: 0.15 }, { f: 233.08, d: 0.15 }, { f: 220.00, d: 0.15 }
            ]
        };

        const notes = tracks[trackName];
        if (!notes) return;

        this.noteIndex = 0;
        const step = () => {
            if (!this.musicEnabled || this.currentTrack !== trackName) return;
            const note = notes[this.noteIndex];
            
            try {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'square';
                osc.frequency.setValueAtTime(note.f, this.ctx.currentTime);
                gain.gain.setValueAtTime(0.035, this.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.005, this.ctx.currentTime + note.d * 0.85);
                
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                
                osc.start();
                osc.stop(this.ctx.currentTime + note.d * 0.85);
            } catch (e) {
                // AudioContext handling
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

// --- Game State ---
const state = {
    name: "Sir Eldrin",
    hp: 100,
    maxHp: 100,
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
    location: "village"
};

// Reduces incoming damage by 5 (min 1) if the player has forged the Iron Shield
function mitigate(damage) {
    return state.hasIronShield ? Math.max(1, damage - 5) : damage;
}

// Image assets mapping
const sceneImages = {
    village: "assets/images/village.png",
    forest: "assets/images/forest.png",
    goblin: "assets/images/goblin.png",
    temple: "assets/images/sunblade.png",
    mountain: "assets/images/mountain.png",
    lair: "assets/images/dragon.png",
    watchtower: "assets/images/mountain.png", // placeholder art, no dedicated asset yet
    blacksmith: "assets/images/village.png", // placeholder art, no dedicated asset yet
    victory: "assets/images/dragon.png" // fallback high resolution scene
};

// UI Elements
const heroNameEl = document.getElementById("hero-name");
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
    updateHUD();
}

function healPlayer(amount) {
    state.hp = Math.min(state.maxHp, state.hp + amount);
    addLog(`💚 Restored ${amount} HP! Current HP: ${state.hp}/${state.maxHp}`, "event");
    sfx.playHeal();
    updateHUD();
}

function updateHUD() {
    heroNameEl.textContent = state.name;
    const hpPct = Math.max(0, (state.hp / state.maxHp) * 100);
    hpBarEl.style.width = `${hpPct}%`;
    hpTextEl.textContent = `${state.hp}/${state.maxHp}`;
    scoreTextEl.textContent = String(state.score).padStart(6, '0');

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
        { text: "2. Enter Whispering Forest (West)", action: goForest },
        { text: "3. Venture to Rocky Mountains (East)", action: goMountain },
        { text: "4. Rest at Tavern (+20 HP)", action: restTavern },
        { text: "5. Visit the Blacksmith", action: goBlacksmith }
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
        addLog("You rest at the tavern and eat a warm meal.");
        healPlayer(20);
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
        { text: "4. Return to Village Square", action: renderVillage }
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
    const dmg = state.hasSword ? Math.floor(Math.random() * 11) + 20 : Math.floor(Math.random() * 8) + 10;
    state.goblinHp -= dmg;
    addLog(`You strike the Goblin for ${dmg} damage!`, "event");

    if (state.goblinHp <= 0) {
        addLog("🎉 You defeated the Goblin Rogue!", "victory");
        state.goblinDefeated = true;
        state.inventory.push("Gold Pouch");
        addScore(150);
        renderChoices([{ text: "Continue through Forest", action: renderForest }]);
        return;
    }

    // Goblin counter attack
    const gDmg = mitigate(Math.floor(Math.random() * 8) + 5);
    state.hp -= gDmg;
    addLog(`The Goblin bites back for ${gDmg} damage!`, "alert");
    updateHUD();

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
        { text: "4. Return to Village Square", action: renderVillage }
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
        addLog("You explore the cave and find an Elixir of Life!");
        state.caveSearched = true;
        state.inventory.push("Elixir of Life");
        healPlayer(50);
        addScore(100);
    } else {
        addLog("The cave has been scavenged.");
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
        dmg = Math.floor(Math.random() * 16) + 35;
        addLog(`💥 The Sunblade cuts through the dragon's scales for ${dmg} CRITICAL DAMAGE!`, "victory");
    } else {
        dmg = Math.floor(Math.random() * 5) + 1;
        addLog(`Your attack bounces harmlessly off the dragon's thick armor for only ${dmg} damage!`, "alert");
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
    addLog("============================================================", "victory");
    addLog("           🎉 VICTORY! THE KINGDOM IS SAVED! 🎉", "victory");
    addLog("============================================================", "victory");
    addLog("You vanquished Ignis the Red Dragon, rescued Princess Aurelia, and saved Oakhaven!", "event");

    if (state.knightFreed) {
        addLog("Sir Cedric rides beside you into the Citadel, his life-debt repaid in blood and fire.", "event");
    }
    if (state.goblinSpared) {
        addLog("Word spreads of the mercy you showed the Goblin Rogue in the Whispering Forest.", "event");
    } else if (state.goblinDefeated) {
        addLog("Tales of the Goblin Rogue you slew in the misty forest travel far and wide.", "event");
    }

    addScore(1000);
    addLog(`FINAL SCORE: ${state.score} PTS | RATING: GRAND HERO OF THE REALM`, "victory");

    renderChoices([
        { text: "🏆 Play Again for High Score", action: restartGame }
    ]);
}

function restartGame() {
    state.hp = 100;
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
    updateHUD();
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

startBtnEl.addEventListener("click", () => {
    state.name = nameInputEl.value.trim() || "Sir Eldrin";
    nameModalEl.classList.add("hidden");
    updateHUD();
    sfx.init();
    renderVillage();
});

if (musicBtnEl) {
    musicBtnEl.addEventListener("click", () => {
        sfx.musicEnabled = !sfx.musicEnabled;
        musicBtnEl.textContent = `🎵 MUSIC: ${sfx.musicEnabled ? "ON" : "OFF"}`;
        if (!sfx.musicEnabled) {
            sfx.stopMusic();
        } else {
            const trackMap = { village: "village", forest: "forest", temple: "forest", mountain: "forest", goblin: "battle", lair: "battle", watchtower: "forest", blacksmith: "village" };
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
