const fs = require('fs');
const path = require('path');

console.log("==================================================");
console.log("🎮 EAST GREVIE ADVENTURES - HEADLESS DYNAMIC STATE SIMULATOR");
console.log("==================================================\n");

// Lightweight Vanilla DOM Mock Environment
const domElements = {};

function createMockElement(id = "", tagName = "DIV") {
    return {
        id,
        tagName,
        textContent: "",
        innerHTML: "",
        className: "",
        classList: {
            add: function(c) { this[c] = true; },
            remove: function(c) { delete this[c]; },
            contains: function(c) { return Boolean(this[c]); }
        },
        children: [],
        appendChild: function(child) {
            this.children.push(child);
            return child;
        },
        addEventListener: function() {},
        setAttribute: function() {},
        getAttribute: function() { return ""; },
        style: {}
    };
}

global.window = global;
global.document = {
    getElementById: function(id) {
        if (!domElements[id]) {
            domElements[id] = createMockElement(id);
        }
        return domElements[id];
    },
    querySelector: function() { return createMockElement(); },
    querySelectorAll: function() { return []; },
    createElement: function(tag) { return createMockElement("", tag); },
    addEventListener: function() {},
    body: createMockElement("body")
};

global.localStorage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {}
};

global.navigator = { userAgent: "NodeTest" };
global.Audio = function() {
    return { play: () => Promise.resolve(), pause: () => {}, volume: 1 };
};

// Require app.js exported module
const {
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
} = require('../app.js');

const testResults = [];

function checkSim(testName, condition, details = "") {
    if (condition) {
        console.log(`[PASS] ${testName}`);
        testResults.push({ test: testName, status: "PASS", details });
    } else {
        console.log(`[FAIL] ${testName} - ${details}`);
        testResults.push({ test: testName, status: "FAIL", details });
    }
}

console.log("--- SIMULATION STEP 1: Game Start Clean Slate Verification ---");
checkSim("Initial state has 0 active subquests discovered", QUESTS_DATA.filter(q => isQuestDiscovered(q)).length === 1);
checkSim("Initial active quests badge count is 1", document.getElementById("quests-badge").textContent == "1");
checkSim("Main quest is discovered at game start", isQuestDiscovered(QUESTS_DATA[0]));
checkSim("Celestial subquest undiscovered at game start", !isQuestDiscovered(QUESTS_DATA[1]));
checkSim("Blacksmith subquest undiscovered at game start", !isQuestDiscovered(QUESTS_DATA[2]));

console.log("\n--- SIMULATION STEP 2: Elder Interaction & Celestial Subquest Discovery ---");
speakToElder();
checkSim("state.elderTalked is true after speakToElder()", state.elderTalked === true);
checkSim("Celestial subquest is discovered after speakToElder()", isQuestDiscovered(QUESTS_DATA[1]));
checkSim("Active quests badge updated to 2", document.getElementById("quests-badge").textContent == "2");

console.log("\n--- SIMULATION STEP 3: Blacksmith Interaction & Blueprint Subquest Discovery ---");
renderBlacksmith();
checkSim("state.blacksmithTalked is true after renderBlacksmith()", state.blacksmithTalked === true);
checkSim("Blacksmith subquest is discovered after renderBlacksmith()", isQuestDiscovered(QUESTS_DATA[2]));
checkSim("Active quests badge updated to 3", document.getElementById("quests-badge").textContent == "3");

console.log("\n--- SIMULATION STEP 4: Goblin Encounter & Objective 1 Progress ---");
const bsQuest = QUESTS_DATA[2];
checkSim("Blacksmith objective 1 (locate goblin) initially false", bsQuest.objectives[0].check(state) === false);
battleGoblin();
checkSim("state.goblinEncountered is true after battleGoblin()", state.goblinEncountered === true);
checkSim("Blacksmith objective 1 (locate goblin) evaluates to TRUE on encounter", bsQuest.objectives[0].check(state) === true);

console.log("\n--- SIMULATION STEP 5: Playthrough Reset Verification ---");
resetAdventureState();
updateQuestsUI();
checkSim("resetAdventureState clears state.elderTalked to false", state.elderTalked === false);
checkSim("resetAdventureState clears state.blacksmithTalked to false", state.blacksmithTalked === false);
checkSim("resetAdventureState clears state.goblinEncountered to false", state.goblinEncountered === false);
checkSim("Celestial subquest returns to undiscovered after reset", !isQuestDiscovered(QUESTS_DATA[1]));
checkSim("Blacksmith subquest returns to undiscovered after reset", !isQuestDiscovered(QUESTS_DATA[2]));
checkSim("Active quests badge resets back to 1", document.getElementById("quests-badge").textContent == "1");

console.log("\n--- SIMULATION STEP 6: Hero Rating Thresholds & MASTER CAT SLAYER ---");
checkSim("Score 1850 grants GRAND HERO OF THE REALM", getHeroRating(1850) === "GRAND HERO OF THE REALM");
checkSim("Score 1500 grants MASTER CAT SLAYER", getHeroRating(1500) === "MASTER CAT SLAYER");
checkSim("Score 1200 grants VALIANT DEFENDER OF THE REALM", getHeroRating(1200) === "VALIANT DEFENDER OF THE REALM");
checkSim("Score 900 grants NOVICE ADVENTURER OF THE REALM", getHeroRating(900) === "NOVICE ADVENTURER OF THE REALM");

console.log("\n==================================================");
console.log("📊 SUMMARY OF DYNAMIC SIMULATION RESULTS");
console.log("==================================================");
const passedCount = testResults.filter(r => r.status === "PASS").length;
console.log(`TOTAL SIMULATIONS EXECUTED: ${testResults.length}`);
console.log(`PASSED: ${passedCount}`);
console.log(`FAILED: ${testResults.length - passedCount}`);
console.log(`SUCCESS RATE: ${((passedCount / testResults.length) * 100).toFixed(1)}%\n`);

if (testResults.length - passedCount > 0) {
    process.exit(1);
}
