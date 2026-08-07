"""
===================================================================
 EAST GREVIE ADVENTURES: THE QUEST FOR THE PRINCESS
===================================================================
 A classic 1980s style interactive text adventure RPG.
"""

import sys
import time
import random
import os

# ANSI color codes for 80s CRT terminal vibe
GREEN = "\033[92m"
YELLOW = "\033[93m"
CYAN = "\033[96m"
RED = "\033[91m"
MAGENTA = "\033[95m"
BOLD = "\033[1m"
RESET = "\033[0m"

# Enable ANSI codes on Windows terminal
os.system('')

def slow_print(text, delay=0.015, newline=True):
    """Prints text with a subtle retro CRT typewriter effect."""
    for char in text:
        sys.stdout.write(char)
        sys.stdout.flush()
        time.sleep(delay)
    if newline:
        print()

def clear_screen():
    os.system('cls' if os.name == 'nt' else 'clear')

def mitigate(damage, player):
    """Reduces incoming damage by 5 (min 1) if the player has forged the Iron Shield."""
    if player.has_iron_shield:
        return max(1, damage - 5)
    return damage

LEVEL_SCORE_STEP = 200
CRIT_CHANCE = 0.15

def check_level_up(player):
    """Levels up the player (score-derived) and grows max HP to match."""
    new_level = 1 + player.score // LEVEL_SCORE_STEP
    while player.level < new_level:
        player.level += 1
        player.max_hp += 10
        player.hp += 10
        print(f"{YELLOW}⭐ LEVEL UP! You are now Level {player.level}! (Max HP +10 -> {player.max_hp}){RESET}")

def roll_attack(low, high, player):
    """Rolls player weapon damage: base roll + level bonus, with a chance to crit."""
    damage = random.randint(low, high) + (player.level - 1) * 2
    crit = random.random() < CRIT_CHANCE
    if crit:
        damage *= 2
    return damage, crit

ENEMY_POOL = [
    {"name": "Wild Weasel", "hp": 28, "dmg_low": 6, "dmg_high": 12},
    {"name": "Barn Owl", "hp": 35, "dmg_low": 8, "dmg_high": 14},
    {"name": "Giant Garden Toad", "hp": 24, "dmg_low": 4, "dmg_high": 9},
    {"name": "Alley Rat Rogue", "hp": 38, "dmg_low": 7, "dmg_high": 13},
    {"name": "Feral Farm Cat", "hp": 45, "dmg_low": 9, "dmg_high": 15},
]

def wilderness_trail(player):
    enemy = random.choice(ENEMY_POOL)
    level_bonus = player.level - 1
    enemy_hp = enemy["hp"] + level_bonus * 6
    dmg_low = enemy["dmg_low"] + level_bonus
    dmg_high = enemy["dmg_high"] + level_bonus
    reward = 60 + level_bonus * 8

    slow_print(f"\nWILDERNESS TRAIL")
    slow_print(f"A {enemy['name']} emerges from the tall grass, ready to fight!")

    while enemy_hp > 0 and player.hp > 0:
        print(f"\n{enemy['name']} HP: {enemy_hp} | Your HP: {player.hp}")
        print("1. Attack with weapon")
        print("2. Use Healing Potion")
        print("3. Flee back to the Village")

        c = input("Action (1-3): ").strip()
        if c == "1":
            low, high = (15, 25) if player.has_sword else (8, 15)
            damage, crit = roll_attack(low, high, player)
            enemy_hp -= damage
            if crit:
                print(f"{YELLOW}💥 CRITICAL HIT!{RESET} You strike the {enemy['name']} for {damage} damage!")
            else:
                print(f"You strike the {enemy['name']} for {damage} damage!")
            if enemy_hp > 0:
                e_dmg = mitigate(random.randint(dmg_low, dmg_high), player)
                player.hp -= e_dmg
                print(f"The {enemy['name']} strikes back for {e_dmg} damage!")
        elif c == "2":
            if "Healing Potion" in player.inventory:
                player.inventory.remove("Healing Potion")
                player.heal(40)
            else:
                print("No Healing Potions in inventory!")
        elif c == "3":
            slow_print("You flee back to the safety of the Village.")
            return
        else:
            print("Invalid option!")

    if player.hp <= 0:
        slow_print(f"\n{RED}💥 You were knocked unconscious by the {enemy['name']}!{RESET}")
        slow_print(f"{CYAN}🏥 Kind townspeople found you on the trail and brought you back to East Grevie Village to recover.{RESET}")
        player.hp = max(10, player.max_hp // 4)
        input("\nPress Enter to recover in the Village Square...")
        return
    else:
        slow_print(f"\n{GREEN}You defeated the {enemy['name']}!{RESET}")
        player.add_score(reward)
        print("\nWhat do you do next?")
        print("1. Continue deeper on the Wilderness Trail")
        print("2. Return to the Village Square")
        nc = input("Choice (1-2): ").strip()
        if nc == "1":
            wilderness_trail(player)

class Player:
    def __init__(self):
        self.name = "Hero"
        self.hp = 100
        self.max_hp = 100
        self.score = 0
        self.gold = 50
        self.inventory = ["Bread", "Wooden Shield"]
        self.has_sword = False
        self.has_key = False
        self.has_shield = True
        self.goblin_defeated = False
        self.stump_searched = False
        self.cave_searched = False
        self.goblin_spared = False
        self.knight_freed = False
        self.knight_ally_used = False
        self.has_iron_shield = False
        self.level = 1
        self.fairy_visited = False
        self.location = "village"

    def add_score(self, points):
        self.score += points
        print(f"{YELLOW}★ +{points} Points! (Total Score: {self.score}){RESET}")
        check_level_up(self)

    def add_gold(self, amount):
        self.gold += amount
        print(f"{YELLOW}💰 +{amount} Gold! (Total Gold: 💰 {self.gold}){RESET}")

    def show_status(self):
        print(f"\n{CYAN}{'='*50}")
        print(f" HERO: {self.name} | LVL: {self.level} | HP: {self.hp}/{self.max_hp} | SCORE: {self.score} | GOLD: 💰 {self.gold}")
        print(f" INVENTORY: {', '.join(self.inventory) if self.inventory else 'Empty'}")
        print(f"{'='*50}{RESET}\n")

    def heal(self, amount):
        self.hp = min(self.max_hp, self.hp + amount)
        print(f"{GREEN}💚 Restored {amount} HP! Current HP: {self.hp}/{self.max_hp}{RESET}")

def print_banner():
    print(f"{BOLD}{YELLOW}")
    print("============================================================================")
    print("                 === EAST GREVIE ADVENTURES: THE PRINCESS QUEST ===")
    print("============================================================================")
    print(f"{RESET}")

def game_over(player, reason="You have fallen in battle."):
    clear_screen()
    slow_print(f"\n{RED}💀 GAME OVER 💀{RESET}")
    slow_print(f"{RED}{reason}{RESET}")
    slow_print(f"\nFINAL SCORE: {player.score} PTS")
    print(f"\n{CYAN}Thank you for playing East Grevie Adventures!{RESET}")
    sys.exit()

def get_hero_rating(score):
    if score >= 1000:
        return "GRAND HERO OF EAST GREVIE"
    elif score >= 700:
        return "MASTER DRAGON SLAYER"
    elif score >= 400:
        return "VALIANT DEFENDER OF THE REALM"
    else:
        return "NOVICE ADVENTURER OF EAST GREVIE"

def victory(player):
    player.add_score(1000)
    rating = get_hero_rating(player.score)
    print(f"\n{MAGENTA}{'='*60}")
    print("           VICTORY! THE KINGDOM IS SAVED!")
    print(f"{'='*60}{RESET}")
    slow_print(f"{GREEN}You vanquished the terror of the realm, rescued Princess Elsa,")
    slow_print(f"and returned to the Citadel to live in legend forever!{RESET}\n")

    if player.knight_freed:
        slow_print(f"{CYAN}Sir Johan rides beside you into the Citadel, his life-debt repaid in blood and fire.{RESET}")
    if player.goblin_spared:
        slow_print(f"{CYAN}Word spreads of the mercy you showed the Goblin Rogue in the Whispering Forest.{RESET}")
    elif player.goblin_defeated:
        slow_print(f"{CYAN}Tales of the Goblin Rogue you slew in the misty forest travel far and wide.{RESET}")

    print(f"\n{YELLOW}==========================================")
    print(f"       FINAL SCORE: {player.score} PTS")
    print(f"       RATING: {rating}")
    print(f"=========================================={RESET}\n")
    sys.exit()

def intro(player):
    clear_screen()
    print_banner()
    slow_print("The Village of East Grevie is in shadow.")
    slow_print("The dreaded Cat Rodrigues has captured Princess Elsa and fled to Cat's Hall.")
    slow_print("Without the Legendary Sunblade, no mortal weapon can pierce the beast's fur.")
    slow_print("Your quest begins at the crossroad outside the quiet Village of East Grevie...\n")
    
    player.name = input("Enter your hero's name: ").strip() or "Sir Ario"
    print(f"\nWelcome, {BOLD}{player.name}{RESET}! Your journey begins now.")
    player.add_score(50)
    time.sleep(1)

def village_square(player):
    player.location = "village"
    player.show_status()
    slow_print("🏰 VILLAGE SQUARE")
    slow_print("Townspeople gather around whispering in panic. Cobblestone paths lead in three directions.")
    print("\nWhere will you go?")
    print("1. Speak to the Wise Elder by the fountain")
    print("2. Visit the Blacksmith")
    print("3. Rest at the Tavern (Full Rest)")
    print("4. Venture into the Wilderness Trail")
    print("5. 🗺️ Open Overworld Map (Travel East Grevie)")

    choice = input("\nSelect choice (1-5): ").strip()
    if choice == "1":
        slow_print("\nElder: 'Brave adventurer! The Sunblade was broken into 3 celestial relics during the First Shadow War:")
        slow_print("1. Sun Crystal Core (Mountain Cave)")
        slow_print("2. Hilt of Dawn (Fairy Fountain)")
        slow_print("3. Forge Blueprint (Old Watchtower)")
        slow_print("Recover all 3 relics, reforge the blade at the Blacksmith, and consecrate it at the Temple Sanctum!'")
        if "Sunblade Rune Scroll" not in player.inventory:
            player.inventory.append("Sunblade Rune Scroll")
            player.has_key = True
            player.add_score(100)
        else:
            slow_print("Elder: 'Recover the 3 relics, reforge them at the Blacksmith, and consecrate the blade at the Temple!'")
    elif choice == "2":
        blacksmith(player)
    elif choice == "3":
        if player.hp < player.max_hp:
            player.hp = player.max_hp
            slow_print(f"\n{GREEN}🍺 You enjoy a warm meal and a full night's rest at the tavern. Health fully restored! ({player.hp}/{player.max_hp} HP){RESET}")
        else:
            slow_print("\nYour health is already full!")
    elif choice == "4":
        wilderness_trail(player)
    elif choice == "5":
        worldmap_menu(player)
    else:
        print("Invalid option!")

def blacksmith(player):
    player.show_status()
    slow_print("🔨 BLACKSMITH'S FORGE")
    slow_print("Sparks fly as the burly blacksmith hammers away at glowing steel.")
    if player.has_iron_shield:
        slow_print("Blacksmith: 'That Iron Shield I forged you should still serve you well!'")
    elif "Gold Pouch" in player.inventory:
        slow_print("Blacksmith: 'A Gold Pouch, eh? I can forge that Wooden Shield of yours into something sturdier.'")
        choice = input("Forge the Wooden Shield into an Iron Shield? (y/n): ").strip().lower()
        if choice == "y":
            player.inventory.remove("Gold Pouch")
            player.has_iron_shield = True
            slow_print(f"{YELLOW}🛡️ Your Wooden Shield is reforged into a gleaming IRON SHIELD!{RESET}")
            slow_print("It will reduce the damage you take when defending or taking a counterattack.")
            player.add_score(50)
        else:
            slow_print("Blacksmith: 'Suit yourself. The offer stands.'")
    else:
        slow_print("Blacksmith: 'Come back with some coin and I'll forge you something worthwhile.'")
    input("\nPress Enter to return to the Village Square...")

def whispering_forest(player):
    player.location = "forest"
    player.show_status()
    slow_print("🌲 WHISPERING FOREST")
    slow_print("Ancient trees blot out the sky. Twisted roots line the misty trail.")
    print("\nWhat do you do?")
    print("1. Explore The Temple Sanctum")
    print("2. Investigate a strange glowing tree stump")
    print("3. Fight the Goblin Rogue lurking in the shadows")
    print("4. Open World Map")
    
    choice = input("\nSelect choice (1-4): ").strip()
    if choice == "1":
        sunken_temple(player)
    elif choice == "2":
        if not player.stump_searched:
            slow_print("\nYou examine the glowing stump and find a shimmering Healing Potion!")
            player.stump_searched = True
            player.inventory.append("Healing Potion")
            player.add_score(75)
        else:
            slow_print("\nThe stump is empty now.")
    elif choice == "3":
        goblin_fight(player)
    elif choice == "4":
        worldmap_menu(player)
    else:
        print("Invalid option!")

def worldmap_menu(player):
    player.location = "map"
    player.show_status()
    slow_print("MAP OF EAST GREVIE")
    slow_print("You unroll the ancient cartography map of East Grevie.")
    print("\nSelect a destination on the map:")
    print("1. East Grevie Village")
    print("2. Whispering Forest")
    print("3. The Temple Sanctum")
    print("4. Wilderness Trail")
    print("5. Rocky Mountain Pass")
    print("6. Old Watchtower")
    print("7. Cat's Hall")
    print("8. Secret Fairy Fountain")

    choice = input("\nSelect destination (1-8): ").strip()
    if choice == "1":
        village_square(player)
    elif choice == "2":
        whispering_forest(player)
    elif choice == "3":
        sunken_temple(player)
    elif choice == "4":
        wilderness_trail(player)
    elif choice == "5":
        mountain_pass(player)
    elif choice == "6":
        old_watchtower(player)
    elif choice == "7":
        dragons_lair(player)
    elif choice == "8":
        fairy_fountain(player)
    else:
        print("Invalid destination!")

def fairy_fountain(player):
    player.location = "fairy"
    player.show_status()
    slow_print("✨ SECRET FAIRY FOUNTAIN")
    if not player.fairy_visited:
        player.fairy_visited = True
        slow_print("✨ You discover a hidden, shimmering Fairy Fountain in a tranquil glade!")
        slow_print(f"{GREEN}Glowing sprites bless your journey. Your health is restored by +50 HP!{RESET}")
        player.heal(50)
        player.add_score(25)
    else:
        slow_print("The Fairy Fountain is quiet and peaceful. Sprites dance gently over the water.")
    print("\n1. Return to Overworld Map")
    print("2. Return to Village Square")
    choice = input("\nSelect choice (1-2): ").strip()
    if choice == "2":
        village_square(player)
    else:
        worldmap_menu(player)

def goblin_fight(player):
    if player.goblin_defeated:
        slow_print("\nThe Goblin Rogue has already been vanquished. The forest clearing is quiet.")
        input("Press Enter to continue...")
        return

    slow_print("\n⚔️ A Goblin Rogue leaps out with drawn daggers!")
    goblin_hp = 35
    while goblin_hp > 0 and player.hp > 0:
        print(f"\nGoblin HP: {goblin_hp} | Your HP: {player.hp}")
        print("1. Attack with weapon")
        print("2. Use Healing Potion")
        print("3. Flee back to forest path")
        print("4. Try to reason with the Goblin (requires Bread)")

        c = input("Action (1-4): ").strip()
        if c == "1":
            low, high = (15, 25) if player.has_sword else (8, 15)
            damage, crit = roll_attack(low, high, player)
            goblin_hp -= damage
            if crit:
                print(f"{YELLOW}💥 CRITICAL HIT!{RESET} You strike the Goblin for {damage} damage!")
            else:
                print(f"You strike the Goblin for {damage} damage!")
            if goblin_hp > 0:
                g_dmg = mitigate(random.randint(5, 12), player)
                player.hp -= g_dmg
                print(f"The Goblin bites back for {g_dmg} damage!")
        elif c == "2":
            if "Healing Potion" in player.inventory:
                player.inventory.remove("Healing Potion")
                player.heal(40)
            else:
                print("No Healing Potions in inventory!")
        elif c == "3":
            slow_print("You flee from battle safely!")
            return
        elif c == "4":
            if "Bread" in player.inventory:
                player.inventory.remove("Bread")
                slow_print(f"\n{GREEN}You toss the Goblin your loaf of Bread. It snatches it and bolts into the trees!{RESET}")
                player.goblin_defeated = True
                player.goblin_spared = True
                player.add_score(100)
                return
            else:
                print("You have no Bread to offer as a peace gesture!")
        else:
            print("Invalid option!")

    if player.hp <= 0:
        game_over(player, "You were slain by the Goblin Rogue in the misty forest...")
    else:
        slow_print(f"\n{GREEN} You defeated the Goblin Rogue!{RESET}")
        player.goblin_defeated = True
        player.add_score(150)
        if "Gold Pouch" not in player.inventory:
            player.inventory.append("Gold Pouch")

def sunken_temple(player):
    player.location = "temple"
    player.show_status()
    slow_print("🏛️ THE TEMPLE SANCTUM")
    slow_print("Massive stone pillars support an ancient vault. In the center stands a glowing pedestal.")
    
    if player.has_sword:
        slow_print("The pedestal is empty. You have already claimed the Sunblade!")
        slow_print("You exit the temple back to the Whispering Forest.")
        player.location = "forest"
        input("Press Enter to return...")
        return

    print("\nWhat do you do?")
    print("1. Insert the Silver Key into the Pedestal Lock")
    print("2. Return to Whispering Forest")
    
    choice = input("\nSelect choice (1-2): ").strip()
    if choice == "1":
        if "Silver Key" in player.inventory:
            slow_print("\n🗝️ The Silver Key fits perfectly into the ancient mechanism!")
            slow_print(f"{YELLOW}✨ A blinding flash of golden light illuminates the temple...{RESET}")
            slow_print(f"{BOLD}{YELLOW}YOU HAVE FOUND THE LEGENDARY SUNBLADE!{RESET}")
            player.has_sword = True
            player.inventory.append("Legendary Sunblade")
            player.add_score(300)
            slow_print("\nWith the Sunblade in hand, you exit the temple back to the Whispering Forest.")
            player.location = "forest"
            input("Press Enter to continue...")
        else:
            slow_print("\nThe pedestal lock requires a key! Seek the Elder in East Grevie Village.")
    elif choice == "2":
        player.location = "forest"

def mountain_pass(player):
    player.location = "mountain"
    player.show_status()
    slow_print("⛰️ ROCKY MOUNTAIN PASS")
    slow_print("Howling winds blow across narrow ledges. High above lies Cat's Hall.")
    print("\nWhat do you do?")
    print("1. Ascend to Cat's Hall")
    print("2. Search the Mountain Cave for supplies")
    print("3. Explore the Old Watchtower ruins")
    print("4. Open World Map")

    choice = input("\nSelect choice (1-4): ").strip()
    if choice == "1":
        dragons_lair(player)
    elif choice == "2":
        if not player.cave_searched:
            mountain_cave(player)
        else:
            slow_print("The cave has been scavenged.")
    elif choice == "3":
        old_watchtower(player)
    elif choice == "4":
        worldmap_menu(player)

def mountain_cave(player):
    slow_print("\n🕳️ MOUNTAIN CAVE")
    slow_print("A Giant Mountain Snake coils in the shadows, guarding a chest of glittering treasure!")
    print("\nWhat do you do?")
    print("1. Fight the Mountain Snake")
    print("2. Sneak past while it's resting")
    print("3. Retreat to the Mountain Pass")

    choice = input("\nSelect choice (1-3): ").strip()
    if choice == "2":
        slow_print("\nYou slip past the resting Snake and find a sturdy Elven Shield & Elixir of Life!")
        player.cave_searched = True
        player.inventory.append("Elixir of Life")
        player.heal(50)
        player.add_score(100)
        return
    elif choice == "3":
        slow_print("\nYou back away carefully. The Snake doesn't notice.")
        return
    elif choice != "1":
        print("Invalid option!")
        return

    slow_print(f"\n{RED}The Mountain Snake rattles its tail and strikes forward!{RESET}")
    troll_hp = 60
    while troll_hp > 0 and player.hp > 0:
        print(f"\nMountain Snake HP: {troll_hp} | Your HP: {player.hp}")
        print("1. Attack Snake with weapon")
        print("2. Use Healing Potion")
        print("3. Flee back to the Mountain Pass")

        c = input("Action (1-3): ").strip()
        if c == "1":
            low, high = (15, 25) if player.has_sword else (8, 15)
            damage, crit = roll_attack(low, high, player)
            troll_hp -= damage
            if crit:
                print(f"{YELLOW}💥 CRITICAL HIT!{RESET} You strike the Mountain Snake for {damage} damage!")
            else:
                print(f"You strike the Mountain Snake for {damage} damage!")
            if troll_hp > 0:
                t_dmg = mitigate(random.randint(10, 18), player)
                player.hp -= t_dmg
                print(f"The Mountain Snake bites with venomous fangs for {t_dmg} damage!")
        elif c == "2":
            if "Healing Potion" in player.inventory:
                player.inventory.remove("Healing Potion")
                player.heal(40)
            else:
                print("No Healing Potions in inventory!")
        elif c == "3":
            slow_print("You flee from the Snake safely!")
            return
        else:
            print("Invalid option!")

    if player.hp <= 0:
        game_over("You were defeated by the Mountain Snake in the cave...", player)
    else:
        slow_print(f"\n{GREEN}You defeated the Mountain Snake!{RESET}")
        player.cave_searched = True
        player.inventory.append("Elixir of Life")
        player.heal(50)
        player.add_score(250)

def old_watchtower(player):
    slow_print("\n🗼 OLD WATCHTOWER")
    slow_print("A crumbling stone tower leans over the cliffside, its door hanging off its hinges.")
    if player.knight_freed:
        slow_print("The watchtower is empty and silent. Sir Johan already rides free.")
        input("Press Enter to return...")
        return

    slow_print("Inside, chained to a support beam, lies a wounded Knight - Sir Johan.")
    print("\nWhat do you do?")
    print("1. Free the Knight")
    print("2. Leave him chained and go")

    choice = input("\nSelect choice (1-2): ").strip()
    if choice == "1":
        slow_print(f"\n{GREEN}Sir Johan: 'My thanks, friend! I owe you a life-debt. If ever you face Rodrigues, call for me!'{RESET}")
        player.knight_freed = True
        player.add_score(75)
    else:
        slow_print("\nYou leave the Knight chained and head back down the mountain path.")
    input("Press Enter to return...")

def dragons_lair(player):
    player.location = "lair"
    player.show_status()
    slow_print("🐾 CAT'S HALL")
    slow_print("Shadows stretch across the grand stone hall. Atop a velvet cushion throne lies Princess Elsa in chains.")
    slow_print(f"{RED}Lord Rodrigues the Vile Shadow Cat uncoils with an intimidating hiss!{RESET}")
    
    if not player.has_sword:
        slow_print(f"\n{RED}⚠️ WARNING: You do not possess the Legendary Sunblade! Your mundane attacks cannot harm Rodrigues!{RESET}")

    dragon_hp = 120
    while dragon_hp > 0 and player.hp > 0:
        knight_available = player.knight_freed and not player.knight_ally_used
        print(f"\n{RED}SHADOW CAT RODRIGUES HP: {dragon_hp}{RESET} | {GREEN}YOUR HP: {player.hp}{RESET}")
        print("1. Slash with weapon")
        print("2. Raise Shield to Defend & Charge")
        print("3. Drink Healing Potion")
        print("4. Attempt to rescue Princess and run")
        if knight_available:
            print("5. Call upon Sir Johan to strike Rodrigues")

        c = input(f"Action (1-{'5' if knight_available else '4'}): ").strip()
        if c == "1":
            if player.has_sword:
                damage, crit = roll_attack(35, 50, player)
                dragon_hp -= damage
                if crit:
                    slow_print(f"{YELLOW}💥⚔️ CRITICAL HIT! The Sunblade cleaves through the cat's thick fur for {damage} massive damage!{RESET}")
                else:
                    slow_print(f"{YELLOW}💥 The Sunblade pierces the cat's thick fur for {damage} DAMAGE!{RESET}")
            else:
                slow_print(f"{RED}🛡️ YOUR WEAPON REBOUNDS HARMLESSLY OFF RODRIGUES'S THICK FUR! (0 Damage){RESET}")
                slow_print(f"{RED}Without the Legendary Sunblade, no mortal weapon can pierce the cat's fur!{RESET}")

            if dragon_hp > 0:
                d_dmg = mitigate(random.randint(20, 35), player)
                player.hp -= d_dmg
                slow_print(f"{RED}Rodrigues slashes with razor claws! You take {d_dmg} damage!{RESET}")
        elif c == "2":
            slow_print("🛡️ YOU RAISE YOUR SHIELD TO BLOCK RODRIGUES'S RAZOR CLAWS!")
            d_dmg = max(1, random.randint(2, 4))
            player.hp -= d_dmg
            slow_print(f"Your shield absorbs 80% of the cat's strike! You take only {d_dmg} damage!")
            slow_print("✨ RODRIGUES EXPOSES A VULNERABLE WEAK SPOT IN ITS CHEST FUR!")
        elif c == "3":
            if "Elixir of Life" in player.inventory:
                player.inventory.remove("Elixir of Life")
                player.heal(60)
            elif "Healing Potion" in player.inventory:
                player.inventory.remove("Healing Potion")
                player.heal(40)
            else:
                slow_print("You have no healing items left!")
        elif c == "4":
            if not player.has_sword:
                game_over("Rodrigues pounced and struck you down as you tried to flee!", player)
            else:
                slow_print("Rodrigues blocks the exit! You must finish the battle!")
        elif c == "5" and knight_available:
            dmg = random.randint(25, 35)
            dragon_hp -= dmg
            player.knight_ally_used = True
            slow_print(f"{YELLOW}⚔️ Sir Johan charges in and strikes Rodrigues for {dmg} damage - the cat has no chance to retaliate!{RESET}")
        else:
            print("Invalid option!")

    if player.hp <= 0:
        game_over("You fell in battle against Rodrigues the Shadow Cat.", player)
    else:
        victory(player)

def main():
    player = Player()
    intro(player)
    while True:
        if player.location == "village":
            village_square(player)
        elif player.location == "forest":
            whispering_forest(player)
        elif player.location == "temple":
            sunken_temple(player)
        elif player.location == "mountain":
            mountain_pass(player)
        elif player.location == "lair":
            dragons_lair(player)

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\nGame interrupted. Farewell, Adventurer!")
