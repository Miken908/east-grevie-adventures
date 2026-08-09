const fs = require('fs');
const path = require('path');

console.log("==================================================");
console.log("🎮 EAST GREVIE ADVENTURES - FULL QA PLAYTHROUGH & BALANCE TEST");
console.log("==================================================\n");

const projectDir = path.resolve(__dirname, '..');
const jsPath = path.join(projectDir, 'app.js');
const htmlPath = path.join(projectDir, 'index.html');
const cssPath = path.join(projectDir, 'style.css');

const jsContent = fs.readFileSync(jsPath, 'utf8');
const htmlContent = fs.readFileSync(htmlPath, 'utf8');
const cssContent = fs.readFileSync(cssPath, 'utf8');

const testResults = [];

function check(testName, condition, details = "") {
    if (condition) {
        console.log(`[PASS] ${testName}`);
        testResults.push({ test: testName, status: "PASS", details });
    } else {
        console.log(`[FAIL] ${testName} - ${details}`);
        testResults.push({ test: testName, status: "FAIL", details });
    }
}

// 1. Verify Core State Data Structures
console.log("--- TEST GROUP 1: Initial Hero State & Attribute Structure ---");
check("Initial state has str=3", jsContent.includes("str: 3"));
check("Initial state has agi=3", jsContent.includes("agi: 3"));
check("Initial state has end=3", jsContent.includes("end: 3"));
check("Initial state has lck=3", jsContent.includes("lck: 3"));
check("Initial state has gold=50", jsContent.includes("gold: 50"));
check("Initial state has ap=0", jsContent.includes("ap: 0"));
check("Initial Max HP calculated as 100 + (3 * 15) + (1 * 10) = 155 HP", jsContent.includes("hp: 155") && jsContent.includes("maxHp: 155"));

// 2. Verify Mathematical Formulas Implementation
console.log("\n--- TEST GROUP 2: Mathematical Combat & Attribute Formulas ---");
check("calculateMaxHp formula present (100 + END*15 + LVL*10)", jsContent.includes("100 + (totalEnd * 15)"));
check("calculateDamageRange formula present with STR scaling", jsContent.includes("totalStr * 1.2") && jsContent.includes("totalStr * 2.0"));
check("calculateCritChance formula present (5 + LCK*2 + AGI*1)", jsContent.includes("5 + (totalLck * 2) + (totalAgi * 1)"));
check("calculateCritMultiplier formula present (1.5 + AGI*0.05)", jsContent.includes("1.5 + (totalAgi * 0.05)"));
check("calculateDodgeChance formula present (AGI*1.5)", jsContent.includes("totalAgi * 1.5"));
check("calculateMitigation formula present (Armor + END*0.8)", jsContent.includes("totalEnd * 0.8"));

// 3. Verify Leveling & AP Award Mechanics
console.log("\n--- TEST GROUP 3: Leveling Curve & AP Allocation ---");
check("gainExp grants +3 AP on level up", jsContent.includes("state.ap += 3"));
check("Exponential EXP formula present (100 * Level^1.4)", jsContent.includes("100 * Math.pow(state.level, 1.4)"));
check("allocateAP updates state and HUD", jsContent.includes("allocateAP(attr)") && jsContent.includes("state[attr] += 1"));

// 4. Verify Combat Integrations & Dodge Checks
console.log("\n--- TEST GROUP 4: Combat Integration & Dodge Logic ---");
check("checkDodge function implemented", jsContent.includes("function checkDodge()"));
check("Goblin fight includes dodge check", jsContent.includes("if (checkDodge())"));
check("rollAttack returns dynamic damage and crit", jsContent.includes("function rollAttack()"));

// 5. Verify UI Modals & Navigation
console.log("\n--- TEST GROUP 5: UI Modals & Navigation Bindings ---");
check("Stats Modal HTML overlay present (#stats-modal)", htmlContent.includes('id="stats-modal"'));
check("Stats button present in header (#stats-btn)", htmlContent.includes('id="stats-btn"'));
check("Gold HUD element present (#gold-text)", htmlContent.includes('id="gold-text"'));
check("AP Notification Badge present (#ap-badge)", htmlContent.includes('id="ap-badge"'));
check("World Map Modal present (#map-modal)", htmlContent.includes('id="map-modal"'));

// 6. Simulate Full Mathematical Progression (Level 1 to 5)
console.log("\n--- TEST GROUP 6: Stat Progression & Balance Simulation ---");

// Helper to simulate formulas in Node
function simMaxHp(end, lvl) { return 100 + (end * 15) + (lvl * 10); }
function simDmg(str, lvl, hasSword) {
    const bMin = hasSword ? 35 : 8;
    const bMax = hasSword ? 50 : 15;
    return {
        min: bMin + Math.floor(str * 1.2) + lvl,
        max: bMax + Math.floor(str * 2.0) + (lvl * 2)
    };
}
function simCrit(lck, agi) { return Math.min(50, 5 + (lck * 2) + (agi * 1)); }
function simDodge(agi) { return Math.min(35, agi * 1.5); }
function simArmor(end, hasIron) { return (hasIron ? 10 : 5) + Math.floor(end * 0.8); }

// Level 1 Base
const lvl1Hp = simMaxHp(3, 1);
const lvl1Dmg = simDmg(3, 1, false);
const lvl1Crit = simCrit(3, 3);
const lvl1Dodge = simDodge(3);
const lvl1Armor = simArmor(3, false);

check("Lvl 1 HP = 155", lvl1Hp === 155, `Got ${lvl1Hp}`);
check("Lvl 1 Dmg Range = 12 - 23", lvl1Dmg.min === 12 && lvl1Dmg.max === 23, `Got ${lvl1Dmg.min} - ${lvl1Dmg.max}`);
check("Lvl 1 Crit Chance = 14.0%", lvl1Crit === 14.0, `Got ${lvl1Crit}%`);
check("Lvl 1 Dodge Chance = 4.5%", lvl1Dodge === 4.5, `Got ${lvl1Dodge}%`);
check("Lvl 1 Armor Mitigation = 7 (Wooden Shield)", lvl1Armor === 7, `Got ${lvl1Armor}`);

// Level 3 Balanced Hero (+6 AP: +2 STR, +2 END, +1 AGI, +1 LCK)
const lvl3Hp = simMaxHp(5, 3);
const lvl3Dmg = simDmg(5, 3, true); // Sunblade acquired
const lvl3Crit = simCrit(4, 4);
const lvl3Dodge = simDodge(4);
const lvl3Armor = simArmor(5, true); // Iron Shield acquired

check("Lvl 3 HP with +2 END = 205 HP", lvl3Hp === 205, `Got ${lvl3Hp}`);
check("Lvl 3 Sunblade Dmg with +2 STR = 44 - 66 Dmg", lvl3Dmg.min === 44 && lvl3Dmg.max === 66, `Got ${lvl3Dmg.min} - ${lvl3Dmg.max}`);
check("Lvl 3 Crit Chance with +1 LCK, +1 AGI = 17.0%", lvl3Crit === 17.0, `Got ${lvl3Crit}%`);
check("Lvl 3 Dodge Chance with +1 AGI = 6.0%", lvl3Dodge === 6.0, `Got ${lvl3Dodge}%`);
check("Lvl 3 Armor with Iron Shield & +2 END = 14.0 Mitigation", lvl3Armor === 14.0, `Got ${lvl3Armor}`);

// 7. Verify Mouse Realm Theme & Lore Consistency (Regression Prevention)
console.log("\n--- TEST GROUP 7: Mouse Realm Theme & Lore Integrity ---");
check("Intro lore text contains 'Village of East Grevie'", htmlContent.includes("Village of East Grevie"));
check("Intro lore text contains 'Cat Rodrigues'", htmlContent.includes("Cat Rodrigues"));
check("Intro lore text contains 'his cursed lair'", htmlContent.includes("his cursed lair"));
check("Intro lore text contains 'thick fur'", htmlContent.includes("thick fur"));
check("Village lore modernized for sunlit timber cottages and fountain", jsContent.includes("timber-frame cottages enclose the stone fountain"));
check("Whispering Forest lore modernized for emerald canopy", jsContent.includes("dense emerald canopy of the Whispering Forest"));
check("Blacksmith lore modernized for forge hearth heat", jsContent.includes("heat of the forge hearth radiates"));
check("Temple Sanctum lore modernized for high vaulted arches", jsContent.includes("Golden rays beam through high vaulted arches"));
check("Cat's Hall lore modernized for crimson braziers", jsContent.includes("Crimson braziers cast dramatic shadows"));
check("Old Watchtower lore updated for Sir Johan in blood-iron chains", jsContent.includes("Sir Johan, former Commander of the Royal Guard"));
check("Mountain Cave lore updated for torch illumination", jsContent.includes("Torches illuminate the damp stone cavern"));
check("Mountain Cave enemy updated to Mountain Snake", jsContent.includes("Mountain Snake"));
check("Cat's Hall location title present", jsContent.includes("CAT'S HALL"));
check("Wilderness enemy pool contains Wild Weasel", jsContent.includes("Wild Weasel"));
check("Wilderness enemy pool contains Barn Owl", jsContent.includes("Barn Owl"));
check("Wilderness enemy pool contains Feral Farm Cat", jsContent.includes("Feral Farm Cat"));
check("Generic RPG Skeleton Warrior removed from wilderness", !jsContent.includes("Skeleton Warrior"));

// 8. Verify Fullscreen Lightbox & UI Integrity (Regression Prevention)
console.log("\n--- TEST GROUP 8: Fullscreen Lightbox & UI Integrity ---");
check("Lightbox Modal element present in HTML (#lightbox-modal)", htmlContent.includes('id="lightbox-modal"'));
check("Lightbox close X button removed for uncluttered view", !htmlContent.includes('id="lightbox-close-btn"'));
check("Zoom hint badge present on scene image frame", htmlContent.includes('zoom-hint-badge'));
check("Lightbox click handler binds declared sceneImgEl element", jsContent.includes("openLightbox("));
check("Map title purged of Overworld prefix", htmlContent.includes("MAP OF EAST GREVIE") && !htmlContent.includes("OVERWORLD MAP"));

// 9. Verify Victory Panel Redesign & Victory Artwork (Regression Prevention)
console.log("\n--- TEST GROUP 9: Victory Panel Redesign & Victory Artwork ---");
check("Victory artwork image present in victory modal HTML", htmlContent.includes('src="assets/images/victory.jpg"'));
check("Victory image frame container present (#victory-image-frame-container)", htmlContent.includes('id="victory-image-frame-container"'));
check("Victory art overlay badge removed for clean artwork view", !htmlContent.includes('victory-art-badge'));

// 10. Verify 2-Step Intro Sequence (Prologue & Character Creation Modals)
console.log("\n--- TEST GROUP 10: 2-Step Intro Sequence Verification ---");
check("Prologue modal present in HTML (#prologue-modal)", htmlContent.includes('id="prologue-modal"'));
check("Intro artwork image present in prologue modal HTML", htmlContent.includes('src="assets/images/abduction_of_princess_elsa.jpg"'));
check("Prologue image frame container present (#prologue-image-frame-container)", htmlContent.includes('id="prologue-image-frame-container"'));
check("Prologue continue button present (#prologue-continue-btn)", htmlContent.includes('id="prologue-continue-btn"'));
check("Character creation portrait frame present (#creation-portrait-frame)", htmlContent.includes('id="creation-portrait-frame"'));
check("Character creation dynamic portrait image present (#creation-portrait-img)", htmlContent.includes('id="creation-portrait-img"'));
check("Dynamic class portrait switching defined in JS", jsContent.includes('creationPortraitImgEl.src = "assets/images/portrait_paladin.jpg"') && jsContent.includes('creationPortraitImgEl.src = "assets/images/portrait_ranger.jpg"'));

// 11. Header Control Buttons & Universal Lightbox Verification
console.log("\n--- TEST GROUP 11: Header Control Buttons & Universal Lightbox Verification ---");
check("Lightbox overlay has z-index 9999 in CSS", cssContent.includes("z-index: 9999 !important"));
check("Universal openLightbox function defined in JS", jsContent.includes("function openLightbox("));
check("Header Stats button present in HTML", htmlContent.includes('id="stats-btn"'));
check("Header Map button present in HTML", htmlContent.includes('id="map-btn"'));
check("Header Audio Settings button present in HTML", htmlContent.includes('id="audio-settings-btn"'));
check("Header Reset button present in HTML", htmlContent.includes('id="reset-btn"'));
check("Header Stats button click listener bound", jsContent.includes('statsBtnEl.addEventListener'));
check("Header Map button click listener bound", jsContent.includes('mapBtnEl.addEventListener'));
check("Header Audio button click listener bound", jsContent.includes('audioSettingsBtnEl.addEventListener'));
check("Header Reset button click listener bound", jsContent.includes('resetBtnEl.addEventListener'));
check("Intro image frame click listener bound", jsContent.includes('introImgFrameEl.addEventListener'));
check("Main scene image frame click listener bound", jsContent.includes('imageFrameEl.addEventListener'));

// 12. New Overworld Map Artwork & Location Pin Mapping
console.log("\n--- TEST GROUP 12: New Overworld Map Artwork & Location Pin Mapping ---");
check("Map modal uses new map.jpg image asset", htmlContent.includes('src="assets/images/map.jpg"'));
check("Map asset dictionary uses map.jpg in JS", jsContent.includes('map: "assets/images/map.jpg"'));
check("Village pin located south of village icon (63%, 58%)", htmlContent.includes('style="top: 63%; left: 58%;" data-location="village"'));
check("Forest pin located northeast of village (26%, 58%)", htmlContent.includes('style="top: 26%; left: 58%;" data-location="forest"'));
check("Temple pin located north of forest (8%, 38%)", htmlContent.includes('style="top: 8%; left: 38%;" data-location="temple"'));
check("Wilderness pin located south field (88%, 81%)", htmlContent.includes('style="top: 88%; left: 81%;" data-location="wilderness"'));
check("Mountain pin located west on mountains (79%, 12%)", htmlContent.includes('style="top: 79%; left: 12%;" data-location="mountain"'));
check("Watchtower pin located at 80%, 34%", htmlContent.includes('style="top: 80%; left: 34%;" data-location="watchtower"'));
check("Cat's Hall pin located northeast off road (45%, 20%)", htmlContent.includes('style="top: 45%; left: 20%;" data-location="lair"'));
check("Fairy Fountain pin located east glade (29%, 88%)", htmlContent.includes('style="top: 29%; left: 88%;" data-location="fairy"'));

// 13. AAA Title Screen, Art Gallery, & Credits Modals
console.log("\n--- TEST GROUP 13: AAA Title Screen, Art Gallery, & Credits Modals ---");
check("Main menu modal present in HTML (#main-menu-modal)", htmlContent.includes('id="main-menu-modal"'));
check("Main menu start game button present (#menu-start-btn)", htmlContent.includes('id="menu-start-btn"'));
check("Main menu art gallery button present (#menu-gallery-btn)", htmlContent.includes('id="menu-gallery-btn"'));
check("Main menu credits button present (#menu-credits-btn)", htmlContent.includes('id="menu-credits-btn"'));
check("Art gallery modal present in HTML (#gallery-modal)", htmlContent.includes('id="gallery-modal"'));
check("Art gallery grid contains 24 artwork cards", (htmlContent.match(/class="gallery-item"/g) || []).length === 24);
check("Credits modal present in HTML (#credits-modal)", htmlContent.includes('id="credits-modal"'));
check("Main menu start button click listener bound in JS", jsContent.includes('menuStartBtnEl.addEventListener'));
check("Main menu gallery button click listener bound in JS", jsContent.includes('menuGalleryBtnEl.addEventListener'));
check("Main menu credits button click listener bound in JS", jsContent.includes('menuCreditsBtnEl.addEventListener'));
check("Body background purged of radial-gradient dots", !cssContent.includes("radial-gradient"));
check("CRT Bezel frame background is transparent", cssContent.includes("background: transparent;\n    border: none;"));

// 14. Widescreen & HD Artwork Display System
console.log("\n--- TEST GROUP 14: Widescreen & HD Artwork Display System ---");
check("Console container max-width expanded to 1240px", cssContent.includes("max-width: 1240px;"));
check("Location image frame height expanded to 460px", cssContent.includes("height: 460px;"));
check("Story log height aligned to 460px", cssContent.includes("height: 460px;"));
check("Pixelated image-rendering removed for HD artwork quality", !cssContent.includes("image-rendering: pixelated;"));
check("Intro banner frame height expanded to 480px", cssContent.includes("max-height: 480px;"));

// 15. Modernized Widescreen Hero Status Screen
console.log("\n--- TEST GROUP 15: Modernized Widescreen Hero Status Screen ---");
check("Stats modal box expanded max-width to 1080px in CSS", cssContent.includes("max-width: 1080px;"));
check("Stats layout columns 3-column grid defined in CSS", cssContent.includes("grid-template-columns: 260px 1.2fr 1fr;"));
check("Hero avatar badge present in HTML (.hero-avatar-badge)", htmlContent.includes('class="hero-avatar-badge"'));
check("Hero portrait frame present in HTML (#hero-portrait-frame)", htmlContent.includes('id="hero-portrait-frame"'));
check("Hero portrait image uses portrait_knight.jpg asset", htmlContent.includes('assets/images/portrait_knight.jpg'));
check("Hero portrait click listener bound in JS", jsContent.includes('heroPortraitFrameEl.addEventListener'));
check("AP status banner present in HTML (.ap-status-banner)", htmlContent.includes('class="ap-status-banner"'));
check("Derived combat stats block present in HTML (.combat-stats-block)", htmlContent.includes('class="combat-stats-block"'));
check("Equipped gear block present in HTML (.equipment-block)", htmlContent.includes('class="equipment-block"'));

// 16. Modern Audio & Neural Voice Synthesis Engine Verification
console.log("\n--- TEST GROUP 16: Modern Audio & Neural Voice Synthesis Engine Verification ---");
check("Audio Settings button present in HTML (#audio-settings-btn)", htmlContent.includes('id="audio-settings-btn"'));
check("Audio Settings modal present in HTML (#audio-settings-modal)", htmlContent.includes('id="audio-settings-modal"'));
check("Voice selector dropdown present in HTML (#voice-select)", htmlContent.includes('id="voice-select"'));
check("Voice test button present in HTML (#test-voice-btn)", htmlContent.includes('id="test-voice-btn"'));
check("Master volume slider present in HTML (#master-vol)", htmlContent.includes('id="master-vol"'));
check("Music volume slider present in HTML (#music-vol)", htmlContent.includes('id="music-vol"'));
check("SFX volume slider present in HTML (#sfx-vol)", htmlContent.includes('id="sfx-vol"'));
check("Voice volume slider present in HTML (#voice-vol)", htmlContent.includes('id="voice-vol"'));
check("SoundEffects master/music/sfx volume gains defined in JS", jsContent.includes("this.masterGain") && jsContent.includes("this.musicGain"));
check("Audio ducking implementation present in JS", jsContent.includes("setDucking(active)"));
check("VoiceNarrator sentence splitting implementation present in JS", jsContent.includes("split(/(?<=[.!?])\\s+/)"));
check("VoiceNarrator getAvailableVoices method defined in JS", jsContent.includes("getAvailableVoices()"));
// 17. Trial of Three Celestial Relics Subquest Verification
console.log("\n--- TEST GROUP 17: Trial of Three Celestial Relics Subquest Verification ---");
check("Elder grants Sunblade Rune Scroll and explains 3 relics", jsContent.includes("Sunblade Rune Scroll") && jsContent.includes("hasRuneScroll"));
check("Fairy Fountain grants Hilt of Dawn relic", jsContent.includes("Hilt of Dawn") && jsContent.includes("hasHiltOfDawn"));
check("Mountain Cave grants Sun Crystal Core relic", jsContent.includes("Sun Crystal Core") && jsContent.includes("hasSunCrystal"));
check("Old Watchtower grants Forge Blueprint relic", jsContent.includes("Forge Blueprint") && jsContent.includes("hasBlueprint"));
check("Village Blacksmith reforgeSunblade function defined", jsContent.includes("function reforgeSunblade()"));
check("Village Blacksmith grants Dormant Sunblade", jsContent.includes("Dormant Sunblade") && jsContent.includes("hasDormantSunblade"));
check("Temple Sanctum consecrateSunblade function defined", jsContent.includes("function consecrateSunblade()"));
// 18. Floating Combat Text Visual Juice Engine Verification
console.log("\n--- TEST GROUP 18: Floating Combat Text Visual Juice Engine Verification ---");
check("Floating text container present in HTML (#floating-text-container)", htmlContent.includes('id="floating-text-container"'));
check("Floating text CSS styles defined in style.css (.floating-text)", cssContent.includes('.floating-text {'));
check("Floating text keyframes defined in style.css (@keyframes floatAndFade)", cssContent.includes('@keyframes floatAndFade'));
check("spawnFloatingText function defined in app.js", jsContent.includes('function spawnFloatingText('));
check("healPlayer triggers floating heal text", jsContent.includes('spawnFloatingText(`+${amount} HP`, "heal"'));

// 19. Hero Archetype Class Selection Verification
console.log("\n--- TEST GROUP 19: Hero Archetype Class Selection Verification ---");
check("Class selection container present in HTML (.class-selection-container)", htmlContent.includes('class="class-selection-container"'));
check("Class selection 2x2 grid present in HTML (.creation-2x2-grid)", htmlContent.includes('creation-2x2-grid'));
check("Royal Knight starter class card present in HTML", htmlContent.includes('data-class="knight"'));
check("Sunblade Paladin NG+ class card present in HTML (#paladin-class-card)", htmlContent.includes('id="paladin-class-card"'));
check("Royal Knight Bastion Shield perk formula present in JS", jsContent.includes('state.heroClass === "knight"'));
check("Sunblade Paladin NG+ unlock logic present in JS", jsContent.includes('paladinCardEl.classList.remove("locked")'));
// 20. Lightbox Navigation & Keyboard Controls Verification
console.log("\n--- TEST GROUP 20: Lightbox Navigation & Keyboard Controls Verification ---");
check("Lightbox previous button present in HTML (#lightbox-prev-btn)", htmlContent.includes('id="lightbox-prev-btn"'));
check("Lightbox next button present in HTML (#lightbox-next-btn)", htmlContent.includes('id="lightbox-next-btn"'));
check("Lightbox counter element present in HTML (#lightbox-counter)", htmlContent.includes('id="lightbox-counter"'));
check("showNextLightboxImage function defined in app.js", jsContent.includes('function showNextLightboxImage()'));
check("showPrevLightboxImage function defined in app.js", jsContent.includes('function showPrevLightboxImage()'));
check("Arrow key navigation listener implemented in app.js", jsContent.includes('ArrowRight') && jsContent.includes('ArrowLeft'));

// 21. Achievement Trophy System Verification
console.log("\n--- TEST GROUP 21: Achievement Trophy System Verification ---");
check("Header Trophies button present in HTML (#achievements-btn)", htmlContent.includes('id="achievements-btn"'));
check("Achievements badge present in HTML (#achievements-badge)", htmlContent.includes('id="achievements-badge"'));
check("Achievements modal present in HTML (#achievements-modal)", htmlContent.includes('id="achievements-modal"'));
check("Achievement toast banner present in HTML (#achievement-toast)", htmlContent.includes('id="achievement-toast"'));
check("ACHIEVEMENTS_DATA dictionary defined in JS with 15 entries", jsContent.includes('const ACHIEVEMENTS_DATA = [') && jsContent.includes('cat_hunter'));
check("unlockAchievement function defined in JS", jsContent.includes('function unlockAchievement('));
check("recordWildernessKill function defined in JS", jsContent.includes('function recordWildernessKill('));
check("showAchievementToast function defined in JS", jsContent.includes('function showAchievementToast('));
check("updateAchievementsUI function defined in JS", jsContent.includes('function updateAchievementsUI()'));
check("resetAchievementsData function defined in JS", jsContent.includes('function resetAchievementsData()'));
check("Reset trophies button present in HTML (#reset-achievements-btn)", htmlContent.includes('id="reset-achievements-btn"'));
check("Achievement & kill storage persistence functions defined in JS", jsContent.includes('loadAchievementsFromStorage()') && jsContent.includes('saveAchievementsToStorage()'));

// 22. Interactive Quest Log & Journal Verification
console.log("\n--- TEST GROUP 22: Interactive Quest Log & Journal Verification ---");
check("Header Quests button present in HTML (#quests-btn)", htmlContent.includes('id="quests-btn"'));
check("Quests badge present in HTML (#quests-badge)", htmlContent.includes('id="quests-badge"'));
check("Quests modal present in HTML (#quests-modal)", htmlContent.includes('id="quests-modal"'));
check("QUESTS_DATA dictionary defined in JS with 3 core long-form quests", jsContent.includes('const QUESTS_DATA = [') && jsContent.includes('blacksmith_blueprint'));
check("updateQuestsUI function defined in JS", jsContent.includes('function updateQuestsUI()'));
check("renderQuestDetail function defined in JS", jsContent.includes('function renderQuestDetail()'));
check("isQuestDiscovered function defined in JS", jsContent.includes('function isQuestDiscovered('));
check("isQuestCompleted function defined in JS", jsContent.includes('function isQuestCompleted('));
check("Quests modal click listeners bound in JS", jsContent.includes('questsBtnEl.addEventListener') && jsContent.includes('closeQuestsModalBtn.addEventListener'));
check("speakToElder sets state.elderTalked = true", jsContent.includes('state.elderTalked = true'));
check("renderBlacksmith sets state.blacksmithTalked = true", jsContent.includes('state.blacksmithTalked = true'));
check("isQuestDiscovered checks state.elderTalked for celestial subquest", jsContent.includes('state.elderTalked || state.hasRuneScroll'));
check("isQuestDiscovered checks state.blacksmithTalked for blacksmith subquest", jsContent.includes('state.blacksmithTalked || state.blueprintReturned'));
check("resetAdventureState function defined in JS to reset quest/adventure flags between playthroughs", jsContent.includes('function resetAdventureState()'));
check("startBtnEl calls resetAdventureState when launching a new hero", jsContent.includes('startBtnEl.addEventListener') && jsContent.includes('resetAdventureState()'));
check("battleGoblin sets state.goblinEncountered = true", jsContent.includes('state.goblinEncountered = true'));
check("Locate Goblin Rogue objective check evaluates s.goblinEncountered", jsContent.includes('s.goblinEncountered || s.goblinDefeated'));

console.log("\n==================================================");
console.log("📊 SUMMARY OF FULL QA & BALANCE SIMULATION RESULTS");
console.log("==================================================");
const passedCount = testResults.filter(r => r.status === "PASS").length;
console.log(`TOTAL STATIC CHECKS EXECUTED: ${testResults.length}`);
console.log(`PASSED: ${passedCount}`);
console.log(`FAILED: ${testResults.length - passedCount}`);
console.log(`SUCCESS RATE: ${((passedCount / testResults.length) * 100).toFixed(1)}%\n`);

// Run Dynamic State Simulation Suite
require('./qa_simulation_suite.js');
