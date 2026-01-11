# Bitburner Automation Suite v2.0 - Full Automation Edition

A comprehensive, fully-automated gameplay solution for the Bitburner game. This suite automates nearly every aspect of the game from start to finish, requiring minimal human intervention.

## 🎯 Full Automation Features

### Core Automation Systems (No SF4 Required)

1. **Network Scanner** (`scripts/core/scanner.js`)
   - Automatically scans the entire network
   - Attempts to gain root access on all discoverable servers
   - Uses all available port opening programs
   - Runs continuously to detect new servers

2. **Hacking Orchestrator** (`scripts/core/orchestrator.js`)
   - Intelligently selects the most profitable target server
   - Coordinates hack/grow/weaken operations across all rooted servers
   - Maximizes thread usage across your entire network
   - Dynamically adjusts strategy based on server state

3. **Hacknet Manager** (`scripts/core/hacknet-manager.js`)
   - Automatically purchases Hacknet nodes
   - Upgrades nodes (level, RAM, cores) when cost-effective
   - Provides passive income generation
   - Scales with your available funds

4. **Server Manager** (`scripts/core/server-manager.js`)
   - Purchases private servers when affordable
   - Upgrades servers to higher RAM tiers
   - Replaces old servers with better ones
   - Maximizes your total computing power

5. **Program Manager** (`scripts/core/program-manager.js`) - DEPRECATED
   - Replaced by Singularity Manager for better automation
   - Tracks which programs you own
   - Use Singularity Manager for automatic program creation/purchase

### 🚀 Advanced Automation Systems (Requires Source-File 4)

6. **Singularity Manager** (`scripts/core/singularity-manager.js`)
   - Automatically purchases TOR router
   - Creates programs when you have the required hacking level
   - Purchases programs from the darkweb when affordable
   - Automatically upgrades home RAM and cores
   - Handles all automation that requires the Singularity API

7. **Faction Manager** (`scripts/core/faction-manager.js`)
   - Automatically accepts faction invitations
   - Works for factions to gain reputation
   - Purchases augmentations when you have enough rep and money
   - Prioritizes expensive augmentations (to minimize cost scaling)
   - Alerts when ready to install augmentations

8. **Stat Training Manager** (`scripts/core/stat-manager.js`)
   - Automatically trains stats to meet requirements
   - Uses crime for free training (early game)
   - Uses university/gym for faster training (late game)
   - Trains hacking, combat stats, and charisma

9. **Backdoor Installer** (`scripts/core/backdoor-installer.js`)
   - Automatically installs backdoors on all accessible servers
   - Required for faction invitations (CyberSec, NiteSec, BitRunners, etc.)
   - Provides benefits on all servers when backdoored
   - Navigates to servers and installs when you meet requirements

10. **Progression Orchestrator** (`scripts/core/progression-orchestrator.js`)
    - Master controller that coordinates all automation
    - Determines current game phase (early, mid, late, endgame)
    - Prioritizes activities based on progression
    - Auto-installs augmentations when you have 10+ queued
    - Guides you to complete the game

11. **Coding Contract Solver** (`scripts/core/contract-solver.js`)
    - Automatically finds coding contracts on the network
    - Solves 20+ different contract types
    - Provides rewards: money, reputation, faction invites
    - Runs every 5 minutes to find new contracts

### Utility Scripts

- **Network Browser** (`scripts/network-browser.js`)
  - Interactive network visualization and navigation
  - Leverages AutoLink.exe (when available) for clickable server links
  - Shows server stats and hacking requirements
  - Great for exploring the network

- **List Servers Without Backdoor** (`scripts/list-no-backdoor.js`)
  - Lists all servers without backdoor installed
  - Shows which servers you can backdoor right now
  - Useful for early game tracking and progression
  - Use `--all` flag to see all servers including those you can't access yet

- **Early Game Script** (`scripts/early-hack.js`)
  - Simple self-contained hacking script for beginners
  - Can run on any server with minimal RAM
  - Great for learning and early progression

- **Dashboard** (`scripts/dashboard.js`)
  - Real-time overview of your game state
  - Shows income, servers, skills, and automation status
  - Updates every 5 seconds

- **Batch Hacking** (`scripts/batch-hack.js`)
  - Advanced HWGW (Hack-Weaken-Grow-Weaken) batching
  - More efficient than basic orchestrator
  - Requires more RAM and experience

- **Configuration** (`scripts/config.js`)
  - Central configuration for all automation scripts
  - Easy to modify thresholds and parameters
  - No need to edit individual scripts

- **Modular Scripts** (`scripts/modules/`)
  - Separate hack/grow/weaken scripts for efficient threading
  - Low RAM footprint (1.75 GB each)
  - Used by the orchestrator

## 🎮 Automation Levels

### Level 1: Basic Automation (No Source-Files Required)
- Network scanning and rooting
- Automated hacking operations
- Hacknet node management
- Server purchasing and upgrading

**Human intervention needed:**
- Purchasing TOR router manually
- Buying programs from darkweb manually
- Joining factions manually
- Working for companies/factions manually
- Buying and installing augmentations manually

### Level 2: Full Automation (Requires Source-File 4)
**Everything from Level 1, plus:**
- Automatic TOR router purchase
- Automatic program creation and purchase
- Automatic home RAM/core upgrades
- Automatic faction joining and reputation farming
- Automatic augmentation purchasing
- Automatic stat training (university/gym/crime)
- Automatic backdoor installation
- Automatic coding contract solving
- Intelligent progression management
- Auto-reset when ready (10+ augs queued)

**Minimal human intervention needed:**
- Initial game start (run deploy script)
- Optionally: Manual augmentation installation trigger
- Optionally: Endgame decisions (destroying w0r1d_d43m0n)

### Level 3: Advanced Automation (Requires Specific Source-Files)

**Stock Market Automation** (`scripts/core/stock-manager.js`) - Requires Source-File 8
- Automatically purchases WSE account ($200m)
- Purchases TIX API access ($5b) for automated trading
- Purchases 4S Market Data ($1b) for better forecasting
- Purchases 4S Market Data TIX API ($25b) for advanced data
- Automatically buys stocks with positive forecast (>55% chance)
- Automatically sells stocks with negative forecast (<45% chance)
- Monitors portfolio and tracks profit/loss
- Intelligently manages position sizes and risk

**Bladeburner Automation** (`scripts/core/bladeburner-manager.js`) - Requires Source-File 7
- Automatically joins Bladeburner division when eligible
- Upgrades skills based on optimal priority order
- Automatically selects and performs best available actions:
  - Prioritizes Black Ops when ready (75%+ success chance)
  - Performs Operations for rank and reputation
  - Completes Contracts when available
  - Trains stats and reduces chaos when needed
- Manages stamina with automatic recovery
- Tracks available actions and progression

### Level 4: Future Enhancements
- Corporation automation (if you have access)
- Gang automation (if you have access)
- Sleeve automation (if you have access)

## 🚀 Quick Start

### Method 1: Simple Deployment (In-Game)

1. Start Bitburner and open the Terminal
2. Run these commands to download all scripts:

```bash
# Create directory structure
mkdir /scripts
mkdir /scripts/core
mkdir /scripts/utils
mkdir /scripts/modules

# Download bootstrap script
wget https://raw.githubusercontent.com/simonsavoca/bitburner/main/scripts/bootstrap.js /scripts/bootstrap.js

# Download core scripts
wget https://raw.githubusercontent.com/simonsavoca/bitburner/main/scripts/core/scanner.js /scripts/core/scanner.js
wget https://raw.githubusercontent.com/simonsavoca/bitburner/main/scripts/core/orchestrator.js /scripts/core/orchestrator.js
wget https://raw.githubusercontent.com/simonsavoca/bitburner/main/scripts/core/hacknet-manager.js /scripts/core/hacknet-manager.js
wget https://raw.githubusercontent.com/simonsavoca/bitburner/main/scripts/core/server-manager.js /scripts/core/server-manager.js
wget https://raw.githubusercontent.com/simonsavoca/bitburner/main/scripts/core/program-manager.js /scripts/core/program-manager.js

# Download utility scripts
wget https://raw.githubusercontent.com/simonsavoca/bitburner/main/scripts/utils/server-utils.js /scripts/utils/server-utils.js
wget https://raw.githubusercontent.com/simonsavoca/bitburner/main/scripts/utils/format-utils.js /scripts/utils/format-utils.js

# Download module scripts
wget https://raw.githubusercontent.com/simonsavoca/bitburner/main/scripts/modules/hack.js /scripts/modules/hack.js
wget https://raw.githubusercontent.com/simonsavoca/bitburner/main/scripts/modules/grow.js /scripts/modules/grow.js
wget https://raw.githubusercontent.com/simonsavoca/bitburner/main/scripts/modules/weaken.js /scripts/modules/weaken.js

# Download early game script
wget https://raw.githubusercontent.com/simonsavoca/bitburner/main/scripts/early-hack.js /scripts/early-hack.js

# Download network browser (uses AutoLink.exe when available)
wget https://raw.githubusercontent.com/simonsavoca/bitburner/main/scripts/network-browser.js /scripts/network-browser.js

# Download server listing utility
wget https://raw.githubusercontent.com/simonsavoca/bitburner/main/scripts/list-no-backdoor.js /scripts/list-no-backdoor.js

# Start the automation suite
run /scripts/bootstrap.js
```

3. The automation suite will start and manage your gameplay automatically!

### Method 2: Using the Auto-Deploy Script (Recommended)

1. In the Bitburner Terminal, run:

```bash
wget https://raw.githubusercontent.com/simonsavoca/bitburner/main/deploy.js deploy.js
run deploy.js
```

2. The deploy script will automatically:
   - Create all necessary directories
   - Download all scripts from the repository
   - Start the automation suite
   - Display status and helpful information

### Method 3: Manual Installation

1. Clone this repository to your local machine
2. In Bitburner, create the directory structure:
   - `/scripts/core/`
   - `/scripts/utils/`
   - `/scripts/modules/`
3. Copy all scripts from the repository to the corresponding directories in-game
4. Run `run /scripts/bootstrap.js`

## 🔄 Updating Scripts

To update your automation scripts to the latest version from the repository:

```bash
wget https://raw.githubusercontent.com/simonsavoca/bitburner/main/update.js update.js
run update.js
```

The update script will:
- Stop any running automation (to prevent conflicts)
- Download the latest versions of all scripts
- Automatically restart the automation suite

**Note:** You can run this anytime to get the latest features and bug fixes!

## RAM Requirements

### Basic Automation (Level 1)
The core automation suite requires approximately **15-20 GB** of RAM on your home server:

- Scanner: ~2.5 GB
- Orchestrator: ~6.0 GB
- Hacknet Manager: ~4.0 GB
- Server Manager: ~4.5 GB

### Full Automation (Level 2)
The complete automation suite requires approximately **35-50 GB** of RAM on your home server:

**All of Level 1, plus:**
- Singularity Manager: ~6.5 GB (16x with no SF4)
- Faction Manager: ~7.0 GB (16x with no SF4)
- Stat Manager: ~6.0 GB (16x with no SF4)
- Backdoor Installer: ~4.0 GB (16x with no SF4)
- Progression Orchestrator: ~7.5 GB (16x with no SF4)
- Contract Solver: ~5.0 GB

**Note:** Without Source-File 4, Singularity functions cost 16x RAM, making full automation impractical. Focus on getting SF4 first!

If you don't have enough RAM, the bootstrap script will start only the essential components that fit.

## Usage

### Starting the Automation

```bash
run /scripts/bootstrap.js
```

### Viewing Individual Script Logs

```bash
# Core automation
tail /scripts/core/scanner.js
tail /scripts/core/orchestrator.js
tail /scripts/core/hacknet-manager.js
tail /scripts/core/server-manager.js

# Advanced automation (SF4 required)
tail /scripts/core/singularity-manager.js
tail /scripts/core/faction-manager.js
tail /scripts/core/stat-manager.js
tail /scripts/core/backdoor-installer.js
tail /scripts/core/progression-orchestrator.js
tail /scripts/core/contract-solver.js
```

### Stopping All Automation

```bash
killall
```

### Early Game Alternative

If you don't have enough RAM for the full suite, use the simple early-game script:

```bash
# On your home server
run /scripts/early-hack.js n00dles

# Or deploy to other servers
scp /scripts/early-hack.js foodnstuff
connect foodnstuff
run early-hack.js foodnstuff
```

## How It Works

### Core Systems (Level 1)

### Network Scanner
- Continuously scans the network every 60 seconds
- Attempts to open ports using available programs
- Gains root access on all hackable servers
- Provides foundation for the orchestrator

### Hacking Orchestrator
- Analyzes all accessible servers to find the most profitable target
- Distributes hack/grow/weaken scripts across all rooted servers
- Monitors target server state (money %, security level)
- Automatically switches between operations:
  - **Weaken** when security is too high
  - **Grow** when money is too low
  - **Hack** when optimal conditions are met
- Maximizes thread count across your entire network

### Hacknet Manager
- Purchases nodes up to an initial cap of 8
- Upgrades nodes when cost is less than 10% of current money
- Balances level, RAM, and core upgrades
- Provides steady passive income

### Server Manager
- Purchases private servers when you have 50% of the cost
- Starts with 8GB servers and scales up dynamically
- Upgrades servers to higher RAM when cost-effective
- Replaces old servers with better ones when at server limit
- Maximizes total computing power for hacking operations

### Advanced Systems (Level 2 - SF4 Required)

#### Singularity Manager
- Automatically purchases TOR router when you have $200k
- Creates programs if you have the hacking level (cheaper than buying)
- Purchases programs from darkweb when needed
- Upgrades home RAM when cost < 15% of current money
- Upgrades home cores when cost < 15% of current money

#### Faction Manager
- Monitors faction invitations and automatically joins (avoiding conflicts)
- Works for factions to gain reputation (prioritizes factions with most needed augs)
- Purchases augmentations when you have enough rep and money
- Prioritizes expensive augmentations first (they get more expensive as you buy more)
- Alerts when you have 5+ augmentations queued (ready to install)

#### Stat Training Manager
- Monitors your stats vs. target thresholds
- Determines which stat needs training most
- Early game: Uses crime (free but slower)
- Late game: Uses university/gym (costs money but faster)
- Trains hacking, combat stats (str/def/dex/agi), and charisma

#### Backdoor Installer
- Identifies all servers in the network
- Installs backdoors on all servers when you have root and required hacking level
- Required for faction invitations (CyberSec, NiteSec, BitRunners, etc.)
- Provides benefits on all backdoored servers
- Automatically navigates to servers and returns home

#### Progression Orchestrator
- Determines what phase of the game you're in:
  - **Early Game**: Focus on crime, basic hacking, first programs
  - **Early-Mid Game**: Get port openers, expand network
  - **Mid Game**: Join factions, gain rep, buy augmentations
  - **Late Game**: Maximize augmentations before reset
  - **Ready to Install**: 5+ augs queued, auto-installs at 10+
  - **End Game**: Hack w0r1d_d43m0n and win!
- Coordinates activities based on current phase
- Auto-installs augmentations when you have 10+ queued

#### Coding Contract Solver
- Scans entire network for .cct files every 5 minutes
- Solves 20+ different contract types automatically
- Rewards include money, reputation, and faction invites
- Handles complex algorithms like stock trading, pathfinding, etc.

## Tips for Best Results

### For Everyone
1. **Let it run**: The automation works best when left running continuously
2. **Upgrade home RAM**: More home RAM = more automation scripts running
3. **Be patient**: Income and progress grow exponentially over time

### Without Source-File 4
1. **Focus on getting SF4**: Complete BitNode-4 to unlock Singularity functions
2. **Manual tasks required**:
   - Purchasing the TOR router ($200k from Alpha Enterprises)
   - Buying programs from the dark web
   - Joining factions when invited
   - Working for companies or factions for reputation
   - Buying augmentations
   - Installing augmentations

### With Source-File 4
1. **Full automation enabled**: Just run the bootstrap and let it work
2. **Monitor the Progression Orchestrator**: It will guide you through game phases
3. **RAM is critical**: Singularity functions cost RAM (16x/4x/1x based on SF4 level)
4. **Auto-install threshold**: Augmentations auto-install at 10+ queued (configurable)
5. **Manual override available**: You can always take manual control if needed

## Advanced Usage

### Customization

You can modify the scripts to adjust behavior:

- `scripts/core/hacknet-manager.js`: Change `MAX_NODES` or `UPGRADE_THRESHOLD`
- `scripts/core/server-manager.js`: Adjust `PURCHASE_THRESHOLD` or `MIN_RAM`
- `scripts/core/orchestrator.js`: Modify security/money thresholds

### Running Individual Components

You can run components separately if needed:

```bash
# Core automation (always available)
run /scripts/core/scanner.js
run /scripts/core/orchestrator.js
run /scripts/core/hacknet-manager.js
run /scripts/core/server-manager.js

# Advanced automation (requires SF4)
run /scripts/core/singularity-manager.js
run /scripts/core/faction-manager.js
run /scripts/core/stat-manager.js
run /scripts/core/backdoor-installer.js
run /scripts/core/progression-orchestrator.js
run /scripts/core/contract-solver.js

# Utility scripts
run /scripts/dashboard.js
run /scripts/network-browser.js
run /scripts/list-no-backdoor.js
run /scripts/batch-hack.js
run /scripts/early-hack.js [target]
```

## Troubleshooting

### "Not enough RAM" error
- Upgrade your home server RAM (Singularity Manager does this automatically with SF4)
- Run fewer components
- Use the early-game script instead: `run /scripts/early-hack.js n00dles`
- Without SF4: Singularity functions cost 16x RAM, so you need ~500GB+ for full automation

### Scripts not running or behaving oddly
- Check if you have Source-File 4 access (required for advanced automation)
- Without SF4, Singularity scripts will fail or consume too much RAM
- Check the Progression Orchestrator log for guidance: `tail progression-orchestrator.js`

### Low income generation
- Normal in early game
- Income increases as you:
  - Gain hacking levels (automatic with stat manager)
  - Purchase more servers (automatic with server manager)
  - Unlock more hacknet nodes (automatic with hacknet manager)
  - Root more servers in the network (automatic with scanner)
  - Install augmentations (semi-automatic with faction manager)

## File Structure

```
scripts/
├── bootstrap.js                    # Main entry point (starts all automation)
├── config.js                       # Configuration file
├── early-hack.js                   # Simple early-game script
├── dashboard.js                    # Real-time statistics dashboard
├── network-browser.js              # Interactive network browser (uses AutoLink.exe)
├── list-no-backdoor.js             # List servers without backdoor
├── batch-hack.js                   # Advanced batch hacking
├── core/
│   ├── scanner.js                  # Network scanner & rooter
│   ├── orchestrator.js             # Main hacking coordinator
│   ├── hacknet-manager.js          # Hacknet automation
│   ├── server-manager.js           # Server purchase/upgrade
│   ├── singularity-manager.js      # TOR, programs, home upgrades (SF4)
│   ├── faction-manager.js          # Faction & augmentation automation (SF4)
│   ├── stat-manager.js             # Stat training automation (SF4)
│   ├── backdoor-installer.js       # Backdoor automation (SF4)
│   ├── progression-orchestrator.js # Master controller (SF4)
│   ├── contract-solver.js          # Coding contract solver
│   ├── stock-manager.js            # Stock market automation (SF8)
│   └── bladeburner-manager.js      # Bladeburner automation (SF7)
├── utils/
│   ├── server-utils.js             # Server helper functions
│   └── format-utils.js             # Formatting functions
└── modules/
    ├── hack.js                     # Hack module
    ├── grow.js                     # Grow module
    └── weaken.js                   # Weaken module
```

## Progression Guide

### Phase 1: Early Game (No SF4)
1. Run `deploy.js` to install all scripts
2. The core automation will handle basic hacking
3. Manually purchase TOR router when you have $200k
4. Manually buy programs from darkweb
5. Manually join factions when invited
6. Manually work for factions to gain rep
7. Manually buy and install augmentations
8. **Goal**: Get to BitNode-4 to unlock Singularity functions

### Phase 2: Full Automation (With SF4)
1. Run `deploy.js` again (or just `bootstrap.js`)
2. **All systems GO** - full automation enabled!
3. Watch the Progression Orchestrator guide you through phases
4. Sit back and watch the automation work
5. Optional: Monitor individual script logs to see progress
6. The system will auto-install augmentations at 10+ queued

### Phase 3: Endgame
1. Automation will guide you to hack w0r1d_d43m0n
2. Install backdoor on w0r1d_d43m0n when ready
3. Destroy w0r1d_d43m0n to complete the BitNode
4. Move to next BitNode and repeat!

## What Gets Automated

### ✅ Fully Automated (With SF4)
- Network scanning and rooting
- Hacking operations (hack/grow/weaken)
- Hacknet node purchasing and upgrading
- Server purchasing and upgrading
- TOR router purchase
- Program creation and purchase
- Home RAM and core upgrades
- Faction joining (avoiding conflicts)
- Faction work (reputation farming)
- Augmentation purchasing
- Stat training (university/gym/crime)
- Backdoor installation
- Coding contract solving
- Progression management
- Augmentation installation (auto at 10+ queued)

### ⚠️ Semi-Automated
- Final augmentation installation (auto at 10+ queued, or manual trigger)
- BitNode completion (automation guides, but you choose when)

### ✅ Advanced Automation (With Specific Source-Files)
- **Stock market trading** (requires SF8)
  - WSE account and TIX API purchase
  - 4S Market Data purchase
  - Automated buying and selling based on forecasts
  - Portfolio management and profit tracking
- **Bladeburner operations** (requires SF7)
  - Division joining
  - Skill upgrades
  - Action selection (Contracts, Operations, Black Ops)
  - Stamina and chaos management

### ❌ Not Automated (Yet)
- Corporation (future enhancement)
- Gang (future enhancement)
- Sleeves (future enhancement)
- Stanek's Gift (future enhancement)

## Contributing

Feel free to submit issues, fork the repository, and create pull requests for any improvements.

## License

MIT License - Feel free to use and modify as needed.

## Credits

Created for the Bitburner game: https://github.com/bitburner-official/bitburner-src