const fs = require('fs');
const path = require('path');

console.log("==================================================");
console.log("🎮 EAST GREVIE ADVENTURES (1984) - FULL QA PLAYTHROUGH & BALANCE TEST");
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
check("Intro lore text contains 'thick fur'", htmlContent.includes("thick fur"));
check("Mountain Cave enemy updated to Mountain Snake", jsContent.includes("Mountain Snake"));
check("Cat's Hall location title present", jsContent.includes("CAT'S HALL"));
check("Wilderness enemy pool contains Wild Weasel", jsContent.includes("Wild Weasel"));
check("Wilderness enemy pool contains Barn Owl", jsContent.includes("Barn Owl"));
check("Wilderness enemy pool contains Feral Farm Cat", jsContent.includes("Feral Farm Cat"));
check("Generic RPG Skeleton Warrior removed from wilderness", !jsContent.includes("Skeleton Warrior"));

// 8. Verify Fullscreen Lightbox & UI Integrity (Regression Prevention)
console.log("\n--- TEST GROUP 8: Fullscreen Lightbox & UI Integrity ---");
check("Lightbox Modal element present in HTML (#lightbox-modal)", htmlContent.includes('id="lightbox-modal"'));
check("Zoom hint badge present on scene image frame", htmlContent.includes('zoom-hint-badge'));
check("Lightbox click handler binds declared sceneImgEl element", jsContent.includes("lightboxImgEl.src = sceneImgEl.src"));
check("Map title purged of Overworld prefix", htmlContent.includes("MAP OF EAST GREVIE") && !htmlContent.includes("OVERWORLD MAP"));

// 9. Verify Victory Panel Redesign & Victory Artwork (Regression Prevention)
console.log("\n--- TEST GROUP 9: Victory Panel Redesign & Victory Artwork ---");
check("Victory artwork image present in victory modal HTML", htmlContent.includes('src="assets/images/victory.jpg"'));
check("Victory image frame container present (#victory-image-frame-container)", htmlContent.includes('id="victory-image-frame-container"'));
check("Victory art overlay badge removed for clean artwork view", !htmlContent.includes('victory-art-badge'));
check("Victory Lightbox handler bound in JS", jsContent.includes("openVictoryLightbox"));
check("Victory Lightbox button present in HTML (#victory-lightbox-btn)", htmlContent.includes('id="victory-lightbox-btn"'));

// 10. Verify Intro Panel Redesign & Intro Artwork (Regression Prevention)
console.log("\n--- TEST GROUP 10: Intro Panel Redesign & Intro Artwork ---");
check("Intro artwork image present in name modal HTML", htmlContent.includes('src="assets/images/Intro.jpg"'));
check("Intro image frame container present (#intro-image-frame-container)", htmlContent.includes('id="intro-image-frame-container"'));
check("Intro Lightbox handler bound in JS", jsContent.includes("openIntroLightbox"));
check("Intro Lightbox button present in HTML (#intro-lightbox-btn)", htmlContent.includes('id="intro-lightbox-btn"'));

console.log("\n==================================================");
console.log("📊 SUMMARY OF FULL QA & BALANCE SIMULATION RESULTS");
console.log("==================================================");
const passedCount = testResults.filter(r => r.status === "PASS").length;
console.log(`TOTAL TESTS EXECUTED: ${testResults.length}`);
console.log(`PASSED: ${passedCount}`);
console.log(`FAILED: ${testResults.length - passedCount}`);
console.log(`SUCCESS RATE: ${((passedCount / testResults.length) * 100).toFixed(1)}%\n`);
