# Bitburner Full Automation Guide

This guide explains how to use the full automation suite to play Bitburner with minimal human intervention.

## Table of Contents
1. [Overview](#overview)
2. [Quick Start](#quick-start)
3. [Automation Levels](#automation-levels)
4. [System Components](#system-components)
5. [Game Progression](#game-progression)
6. [Configuration](#configuration)
7. [Troubleshooting](#troubleshooting)

## Overview

The Bitburner Automation Suite v2.0 provides **near-complete automation** of the game from start to finish. The level of automation depends on whether you have Source-File 4 (Singularity API access).

### What This Means
- **No SF4**: Basic automation handles hacking, servers, hacknet nodes
- **With SF4**: Full automation handles almost everything automatically

## Quick Start

### Step 1: Install the Automation Suite

In the Bitburner terminal:

```bash
wget https://raw.githubusercontent.com/simonsavoca/bitburner/main/deploy.js deploy.js
run deploy.js
```

This will:
1. Download all automation scripts
2. Create the directory structure
3. Start the automation suite automatically

### Step 2: Let It Run

The automation will now handle most of the game:
- Scanning and rooting servers
- Hacking for money
- Buying/upgrading hacknet nodes
- Buying/upgrading servers

### Step 3: Monitor Progress

View the main dashboard:
```bash
run /scripts/dashboard.js
```

Or check individual components:
```bash
tail /scripts/core/progression-orchestrator.js
```

### Step 4: Update Scripts (When Needed)

To get the latest features and bug fixes:

```bash
wget https://raw.githubusercontent.com/simonsavoca/bitburner/main/update.js update.js
run update.js
```

The update script will:
- Stop running automation
- Download latest versions of all scripts
- Restart automation automatically

## Automation Levels

### Level 1: Basic Automation (No Source-File 4)

**What's Automated:**
- ✅ Network scanning and gaining root access
- ✅ Automated hacking (hack/grow/weaken operations)
- ✅ Hacknet node purchasing and upgrading
- ✅ Private server purchasing and upgrading

**What You Need to Do Manually:**
- ❌ Purchase TOR router ($200k from Alpha Enterprises in City)
- ❌ Buy programs from darkweb
- ❌ Join factions when invited
- ❌ Work for factions/companies
- ❌ Buy augmentations
- ❌ Install augmentations

### Level 2: Full Automation (With Source-File 4)

**What's Automated:**
- ✅ Everything from Level 1
- ✅ TOR router purchase
- ✅ Program creation and purchase
- ✅ Home RAM and core upgrades
- ✅ Faction joining
- ✅ Faction work and reputation farming
- ✅ Augmentation purchasing
- ✅ Stat training (hacking, combat, charisma)
- ✅ Backdoor installation
- ✅ Coding contract solving
- ✅ Game progression management
- ✅ Augmentation installation (auto at 10+ queued)

**What You Might Want to Do Manually:**
- 🔧 Choose when to install augmentations (optional)
- 🔧 Choose when to complete BitNodes (optional)
- 🔧 Adjust configuration thresholds (optional)

## System Components

### Core Automation (Always Active)

#### 1. Network Scanner (`scanner.js`)
- Scans network every 60 seconds
- Opens ports using available programs
- Gains root access on all possible servers
- Foundation for all other automation

#### 2. Hacking Orchestrator (`orchestrator.js`)
- Selects most profitable target
- Distributes hack/grow/weaken across all servers
- Maximizes thread usage
- Adjusts based on server state

#### 3. Hacknet Manager (`hacknet-manager.js`)
- Purchases hacknet nodes (up to 8 initially)
- Upgrades level, RAM, cores
- Spends up to 10% of current money
- Provides passive income

#### 4. Server Manager (`server-manager.js`)
- Purchases private servers
- Upgrades RAM when cost-effective
- Replaces old servers with better ones
- Maximizes computing power

### Advanced Automation (Requires SF4)

#### 5. Singularity Manager (`singularity-manager.js`)
**Handles all Singularity API operations:**
- Purchases TOR router when you have $200k
- Creates programs when you have required hacking level
- Purchases programs from darkweb when affordable
- Upgrades home RAM (when cost < 15% of money)
- Upgrades home cores (when cost < 15% of money)

**Priority Programs:**
1. BruteSSH.exe (opens SSH ports)
2. FTPCrack.exe (opens FTP ports)
3. relaySMTP.exe (opens SMTP ports)
4. HTTPWorm.exe (opens HTTP ports)
5. SQLInject.exe (opens SQL ports)
6. DeepscanV1.exe, DeepscanV2.exe (better scanning)
7. AutoLink.exe (clickable server links)
8. ServerProfiler.exe (detailed server info)
9. Formulas.exe (formula calculations)

#### 6. Faction Manager (`faction-manager.js`)
**Automates faction progression:**
- Monitors faction invitations
- Joins factions automatically (avoids conflicts)
- Works for factions to gain reputation
- Prioritizes factions with most needed augmentations
- Purchases augmentations when affordable
- Buys expensive augmentations first (they scale up in price)
- Alerts when 5+ augmentations queued

#### 7. Stat Training Manager (`stat-manager.js`)
**Trains stats to meet requirements:**
- Monitors current stats vs. thresholds
- Early game: Uses crime (free but slower)
- Late game: Uses university/gym (costs money, faster)
- Trains: hacking, strength, defense, dexterity, agility, charisma

**Default Thresholds:**
- Hacking: 100
- Combat stats: 50 each
- Charisma: 50

#### 8. Backdoor Installer (`backdoor-installer.js`)
**Installs backdoors on faction servers:**
- CSEC → CyberSec faction
- avmnite-02h → NiteSec faction
- I.I.I.I → The Black Hand faction
- run4theh111z → Bitrunners faction
- w0r1d_d43m0n → Endgame

Automatically navigates to servers and installs when ready.

#### 9. Progression Orchestrator (`progression-orchestrator.js`)
**Master controller that coordinates everything:**

**Game Phases:**
1. **Early Game**: Focus on crime, basic hacking, first programs
2. **Early-Mid Game**: Get port openers, expand network
3. **Mid Game**: Join factions, gain rep, buy augmentations
4. **Late Game**: Maximize augmentations before reset
5. **Ready to Install**: 5+ augs queued, auto-installs at 10+
6. **End Game**: Hack w0r1d_d43m0n and win!

Auto-installs augmentations when 10+ queued.

#### 10. Coding Contract Solver (`contract-solver.js`)
**Solves coding contracts automatically:**
- Scans network every 5 minutes
- Solves 20+ different contract types
- Rewards: money, reputation, faction invites

**Supported Contract Types:**
- Find Largest Prime Factor
- Subarray with Maximum Sum
- Total Ways to Sum
- Spiralize Matrix
- Array Jumping Game
- Merge Overlapping Intervals
- Generate IP Addresses
- Algorithmic Stock Trader (I, II, III, IV)
- Minimum Path Sum in a Triangle
- Unique Paths in a Grid (I, II)
- Sanitize Parentheses in Expression
- Find All Valid Math Expressions
- And more...

## Game Progression

### Without SF4 (First Playthrough)

**Goal: Reach BitNode-4 to unlock Singularity API**

1. **Start Automation**
   ```bash
   run deploy.js
   ```

2. **Let it Run**
   - Core automation handles hacking and money
   - Income will grow as you root more servers

3. **Manual Tasks**
   - Buy TOR router when you have $200k
   - Buy programs: BruteSSH, FTPCrack, relaySMTP, HTTPWorm, SQLInject
   - Join factions when invited (CyberSec, Tian Di Hui, etc.)
   - Work for factions to gain reputation
   - Buy augmentations when you have enough rep and money
   - Install augmentations when ready

4. **Focus on Getting to BN-4**
   - Join CyberSec (backdoor CSEC server)
   - Join other factions for better augmentations
   - Get enough augmentations to proceed
   - Eventually work towards accessing BitNode-4

### With SF4 (Full Automation)

**Goal: Let automation handle everything**

1. **Start Automation**
   ```bash
   run deploy.js
   ```

2. **Monitor Progress**
   ```bash
   tail /scripts/core/progression-orchestrator.js
   ```

3. **Watch the Magic**
   - System automatically handles ALL tasks
   - Progression Orchestrator guides through phases
   - Augmentations purchased automatically
   - Auto-install when 10+ augmentations queued

4. **Sit Back and Relax**
   - Check in periodically
   - Watch your stats and money grow
   - System handles everything from early game to endgame

## Configuration

### Adjusting Thresholds

Edit `/scripts/core/stat-manager.js` to change stat training thresholds:

```javascript
const STAT_THRESHOLDS = {
    hacking: 100,      // Increase for more training
    strength: 50,
    defense: 50,
    dexterity: 50,
    agility: 50,
    charisma: 50
};
```

### Adjusting Auto-Install Threshold

Edit `/scripts/core/progression-orchestrator.js`:

```javascript
// Auto-install if we have 10+ augs queued
if (queuedCount >= 10) {
    // Change 10 to your preferred number
}
```

### Adjusting Upgrade Thresholds

Edit `/scripts/core/singularity-manager.js`:

```javascript
const UPGRADE_THRESHOLD = 0.15; // Upgrade when cost < 15% of money
// Lower = more conservative, Higher = more aggressive
```

## Troubleshooting

### Scripts Won't Start

**Problem**: "Not enough RAM" error

**Solution**:
- Upgrade home RAM (done automatically with SF4)
- Without SF4, Singularity functions cost 16x RAM
- You need ~500GB+ for full automation without SF4
- With SF4-1: 4x RAM cost
- With SF4-2: 2x RAM cost  
- With SF4-3: 1x RAM cost (normal)

### Singularity Scripts Failing

**Problem**: Scripts crash or don't work

**Solution**:
- Check if you have Source-File 4
- Run: `tail /scripts/core/singularity-manager.js`
- Without SF4, these scripts won't work
- Focus on getting SF4 first

### Not Joining Factions

**Problem**: Faction Manager not joining factions

**Solution**:
- Check if you meet faction requirements
- Some factions require backdoors (Backdoor Installer handles this)
- Some factions require stats (Stat Manager handles this)
- Check for faction conflicts (Manager avoids these)

### Not Buying Augmentations

**Problem**: Have rep and money but not buying

**Solution**:
- Check Faction Manager logs
- May be prioritizing work over purchases
- May not have enough for the next augmentation
- Check if prerequisites are met

### Augmentations Not Installing

**Problem**: Many augmentations queued but not installing

**Solution**:
- Default threshold is 10 augmentations
- Lower the threshold in `progression-orchestrator.js`
- Or manually trigger: `ns.singularity.installAugmentations()`

### Contracts Not Being Solved

**Problem**: Contracts found but not solved

**Solution**:
- Check Contract Solver logs
- Some contract types may not be implemented
- Solver runs every 5 minutes
- May fail on complex contracts

## Advanced Tips

### Maximizing Efficiency

1. **Upgrade Home RAM Early**: More RAM = more automation
2. **Let Everything Run**: Don't kill scripts manually
3. **Monitor Progression Orchestrator**: It guides you through phases
4. **Check Logs Periodically**: Understand what's happening

### Optimal Strategy

**Without SF4:**
1. Focus on getting TOR and port openers ASAP
2. Join CyberSec for first good augmentations
3. Work towards getting to BN-4

**With SF4:**
1. Just run the automation and let it work
2. Check in once a day to see progress
3. System will guide you to completion

### RAM Management

**Priority Order (if limited RAM):**
1. Scanner (essential)
2. Orchestrator (essential)
3. Progression Orchestrator (guides everything)
4. Singularity Manager (critical automation)
5. Faction Manager (key progression)
6. Hacknet Manager (passive income)
7. Server Manager (more computing power)
8. Stat Manager (meet requirements)
9. Backdoor Installer (faction access)
10. Contract Solver (bonus rewards)

## Conclusion

With this full automation suite, Bitburner becomes a game of:
1. **Setup**: Run the deployment script
2. **Monitor**: Watch the automation work
3. **Optimize**: Adjust thresholds as needed
4. **Progress**: Let the system guide you to victory

The automation handles 95%+ of the game, leaving you free to:
- Learn about the systems
- Enjoy the progression
- Focus on high-level strategy
- Relax and watch the numbers go up

**Happy automating!** 🤖
