"""
===================================================================
 DRAGON'S LAIR: THE QUEST FOR THE PRINCESS (1984 RETRO EDITION)
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

class Player:
    def __init__(self):
        self.name = "Hero"
        self.hp = 100
        self.max_hp = 100
        self.score = 0
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
        self.location = "village"

    def add_score(self, points):
        self.score += points
        print(f"{YELLOW}★ +{points} Points! (Total Score: {self.score}){RESET}")

    def show_status(self):
        print(f"\n{CYAN}{'='*50}")
        print(f" HERO: {self.name} | HP: {self.hp}/{self.max_hp} | SCORE: {self.score} PTS")
        print(f" INVENTORY: {', '.join(self.inventory) if self.inventory else 'Empty'}")
        print(f"{'='*50}{RESET}\n")

    def heal(self, amount):
        self.hp = min(self.max_hp, self.hp + amount)
        print(f"{GREEN}💚 Restored {amount} HP! Current HP: {self.hp}/{self.max_hp}{RESET}")

def print_banner():
    banner = f"""{GREEN}
================================================================================
  ______   _______    ______    ______   ______  .__   __.  ______     
 /  __  \\ /  _____|  /  __  \\  / _____| /  __  \\ |  \\ |  | /  __  \\    
|  |  |  |  |  __   |  |  |  ||  |  __ |  |  |  ||   \\|  ||  |  |  |   
|  |  |  |  | |_ |  |  |  |  ||  | |_ ||  |  |  ||  . `  ||  |  |  |   
|  `--'  |  |__| |  |  `--'  ||  |__| ||  `--'  ||  |\\   ||  `--'  |   
 \\______/ \\______|   \\______/  \\______| \\______/ |__| \\__| \\______/    
                                                                       
                 === DRAGON'S LAIR: THE PRINCESS QUEST ===
                        (C) 1984 RETRO ADVENTURE SOFTWARE
================================================================================
{RESET}"""
    print(banner)

def game_over(reason, player):
    print(f"\n{RED}{'='*50}")
    print("                 GAME OVER")
    print(f"{'='*50}{RESET}")
    slow_print(f"{RED}{reason}{RESET}")
    print(f"\n{YELLOW}Final Score: {player.score} Points{RESET}")
    print(f"{CYAN}Thank you for playing Dragon's Lair (1984)!{RESET}")
    sys.exit()

def victory(player):
    print(f"\n{MAGENTA}{'='*60}")
    print("           🎉 VICTORY! THE KINGDOM IS SAVED! 🎉")
    print(f"{'='*60}{RESET}")
    slow_print(f"{GREEN}You vanquished the terror of the realm, rescued Princess Aurelia,")
    slow_print(f"and returned to the Citadel to live in legend forever!{RESET}\n")

    if player.knight_freed:
        slow_print(f"{CYAN}Sir Cedric rides beside you into the Citadel, his life-debt repaid in blood and fire.{RESET}")
    if player.goblin_spared:
        slow_print(f"{CYAN}Word spreads of the mercy you showed the Goblin Rogue in the Whispering Forest.{RESET}")
    elif player.goblin_defeated:
        slow_print(f"{CYAN}Tales of the Goblin Rogue you slew in the misty forest travel far and wide.{RESET}")

    player.add_score(1000)
    print(f"\n{YELLOW}==========================================")
    print(f"       FINAL SCORE: {player.score} PTS")
    print(f"       RATING: GRAND HERO OF THE REALM")
    print(f"=========================================={RESET}\n")
    sys.exit()

def intro(player):
    clear_screen()
    print_banner()
    slow_print("The Kingdom of Oakhaven is in shadow.")
    slow_print("The dreaded Red Dragon Ignis has captured Princess Aurelia and fled to Peak Doom.")
    slow_print("Without the Legendary Sunblade, no mortal weapon can pierce the beast's scales.")
    slow_print("Your quest begins at the crossroad outside the quiet Village of Oakhaven...\n")
    
    player.name = input("Enter your hero's name: ").strip() or "Sir Eldrin"
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
    print("2. Enter the Whispering Forest (To the West)")
    print("3. Venture towards the Rocky Mountains (To the East)")
    print("4. Rest at the Tavern (+20 HP)")
    print("5. Visit the Blacksmith")

    choice = input("\nSelect choice (1-5): ").strip()
    if choice == "1":
        slow_print("\nElder: 'Brave adventurer! The Sunblade lies hidden inside the Sunken Temple across the Whispering Forest.")
        slow_print("Take this Silver Key. It unlocks the inner sanctum!'")
        if "Silver Key" not in player.inventory:
            player.inventory.append("Silver Key")
            player.has_key = True
            player.add_score(100)
        else:
            slow_print("Elder: 'You already possess the Silver Key! Now seek the temple in the Forest.'")
    elif choice == "2":
        whispering_forest(player)
    elif choice == "3":
        mountain_pass(player)
    elif choice == "4":
        if player.hp < player.max_hp:
            slow_print("\nYou rest at the tavern and eat a warm meal.")
            player.heal(20)
        else:
            slow_print("\nYour health is already full!")
    elif choice == "5":
        blacksmith(player)
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
    print("1. Explore the Sunken Temple ruins")
    print("2. Investigate a strange glowing tree stump")
    print("3. Fight the Goblin Rogue lurking in the shadows")
    print("4. Return to the Village Square")
    
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
        village_square(player)
    else:
        print("Invalid option!")

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
            damage = random.randint(15, 25) if player.has_sword else random.randint(8, 15)
            goblin_hp -= damage
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
        game_over("You were slain by the Goblin Rogue in the misty forest...", player)
    else:
        slow_print(f"\n{GREEN} You defeated the Goblin Rogue!{RESET}")
        player.goblin_defeated = True
        player.add_score(150)
        if "Gold Pouch" not in player.inventory:
            player.inventory.append("Gold Pouch")

def sunken_temple(player):
    player.location = "temple"
    player.show_status()
    slow_print("🏛️ SUNKEN TEMPLE SANCTUM")
    slow_print("Massive stone pillars support an ancient vault. In the center stands a glowing pedestal.")
    
    if player.has_sword:
        slow_print("The pedestal is empty. You have already claimed the Sunblade!")
        slow_print("You exit the temple back to the Whispering Forest.")
        player.location = "forest"
        input("Press Enter to return...")
        return

    print("\nWhat do you do?")
    print("1. Insert the Silver Key into the Pedestal Lock")
    print("2. Attempt the Riddle of the Sun Altar")
    print("3. Return to Whispering Forest")
    
    choice = input("\nSelect choice (1-3): ").strip()
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
            slow_print("\nThe pedestal lock requires a key! Seek the Elder in Oakhaven Village.")
    elif choice == "2":
        slow_print("\n📜 An inscription speaks: 'I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?'")
        ans = input("Your answer: ").strip().lower()
        if "echo" in ans:
            slow_print(f"\n{GREEN}Correct! The stone pedestal slides open!{RESET}")
            slow_print(f"{BOLD}{YELLOW}YOU HAVE FOUND THE LEGENDARY SUNBLADE!{RESET}")
            player.has_sword = True
            player.inventory.append("Legendary Sunblade")
            player.add_score(300)
            slow_print("\nWith the Sunblade in hand, you exit the temple back to the Whispering Forest.")
            player.location = "forest"
            input("Press Enter to continue...")
        else:
            slow_print(f"\n{RED}Incorrect! A trap fires poison darts!{RESET}")
            player.hp -= 20
            if player.hp <= 0:
                game_over("The temple's deadly poison darts ended your quest.", player)
    elif choice == "3":
        player.location = "forest"

def mountain_pass(player):
    player.location = "mountain"
    player.show_status()
    slow_print("⛰️ ROCKY MOUNTAIN PASS")
    slow_print("Howling winds blow across narrow ledges. High above, smoke rises from Peak Doom.")
    print("\nWhat do you do?")
    print("1. Ascend to Peak Doom (Dragon's Lair)")
    print("2. Search the Mountain Cave for supplies")
    print("3. Explore the Old Watchtower ruins")
    print("4. Return to Village Square")

    choice = input("\nSelect choice (1-4): ").strip()
    if choice == "1":
        dragons_lair(player)
    elif choice == "2":
        if not player.cave_searched:
            slow_print("\nYou explore the cave and find a sturdy Elven Shield & Elixir of Life!")
            player.cave_searched = True
            player.inventory.append("Elixir of Life")
            player.heal(50)
            player.add_score(100)
        else:
            slow_print("The cave has been scavenged.")
    elif choice == "3":
        old_watchtower(player)
    elif choice == "4":
        village_square(player)

def old_watchtower(player):
    slow_print("\n🗼 OLD WATCHTOWER")
    slow_print("A crumbling stone tower leans over the cliffside, its door hanging off its hinges.")
    if player.knight_freed:
        slow_print("The watchtower is empty and silent. Sir Cedric already rides free.")
        input("Press Enter to return...")
        return

    slow_print("Inside, chained to a support beam, lies a wounded Knight - Sir Cedric.")
    print("\nWhat do you do?")
    print("1. Free the Knight")
    print("2. Leave him chained and go")

    choice = input("\nSelect choice (1-2): ").strip()
    if choice == "1":
        slow_print(f"\n{GREEN}Sir Cedric: 'My thanks, friend! I owe you a life-debt. If ever you face Ignis, call for me!'{RESET}")
        player.knight_freed = True
        player.add_score(75)
    else:
        slow_print("\nYou leave the Knight chained and head back down the mountain path.")
    input("Press Enter to return...")

def dragons_lair(player):
    player.location = "lair"
    player.show_status()
    slow_print("🐉 PEAK DOOM: THE DRAGON'S LAIR")
    slow_print("Molten lava streams down dark cavern walls. Atop a mountain of gold lies Princess Aurelia in chains.")
    slow_print(f"{RED}The mighty Red Dragon Ignis awakens with a terrifying roar!{RESET}")
    
    if not player.has_sword:
        slow_print(f"\n{RED}⚠️ WARNING: You do not possess the Legendary Sunblade! Your mundane attacks cannot harm Ignis!{RESET}")

    dragon_hp = 120
    while dragon_hp > 0 and player.hp > 0:
        knight_available = player.knight_freed and not player.knight_ally_used
        print(f"\n{RED}DRAGON IGNIS HP: {dragon_hp}{RESET} | {GREEN}YOUR HP: {player.hp}{RESET}")
        print("1. Slash with weapon")
        print("2. Raise Shield to Defend")
        print("3. Use Elixir / Potion")
        print("4. Attempt to rescue Princess and run")
        if knight_available:
            print("5. Call upon Sir Cedric to strike Ignis")

        c = input(f"Action (1-{'5' if knight_available else '4'}): ").strip()
        if c == "1":
            if player.has_sword:
                damage = random.randint(35, 50)
                dragon_hp -= damage
                slow_print(f"{YELLOW}💥 The Sunblade cuts through the dragon's scales for {damage} CRITICAL DAMAGE!{RESET}")
            else:
                damage = random.randint(1, 5)
                dragon_hp -= damage
                slow_print(f"{RED}Your attack bounces harmlessly off the dragon's thick armor for only {damage} damage!{RESET}")

            if dragon_hp > 0:
                d_dmg = mitigate(random.randint(20, 35), player)
                player.hp -= d_dmg
                slow_print(f"{RED}Ignis breathes a torrent of fire! You take {d_dmg} fire damage!{RESET}")
        elif c == "2":
            slow_print("You raise your shield! The fire breath is partially blocked.")
            d_dmg = mitigate(random.randint(8, 15), player)
            player.hp -= d_dmg
            slow_print(f"You take reduced damage ({d_dmg} HP).")
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
                game_over("Ignis swept down and engulfed you in flames as you tried to flee!", player)
            else:
                slow_print("Ignis blocks the exit! You must finish the battle!")
        elif c == "5" and knight_available:
            dmg = random.randint(25, 35)
            dragon_hp -= dmg
            player.knight_ally_used = True
            slow_print(f"{YELLOW}⚔️ Sir Cedric charges in and strikes Ignis for {dmg} damage - the dragon has no chance to retaliate!{RESET}")
        else:
            print("Invalid option!")

    if player.hp <= 0:
        game_over("You fell in battle against Ignis the Red Dragon.", player)
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
