# Bitburner Automation Suite

A comprehensive set of automation scripts for the Bitburner game that provides a fully automated gameplay experience.

## Features

### Core Automation Systems

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

5. **Program Manager** (`scripts/core/program-manager.js`)
   - Tracks which programs you own
   - Reminds you to purchase essential programs from the dark web
   - Prioritizes port-opening programs

### Utility Scripts

- **Network Browser** (`scripts/network-browser.js`)
  - Interactive network visualization and navigation
  - Leverages AutoLink.exe (when available) for clickable server links
  - Shows server stats and hacking requirements
  - Great for exploring the network

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

## Quick Start

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

## RAM Requirements

The automation suite requires approximately **15-20 GB** of RAM on your home server to run all components. Here's the breakdown:

- Scanner: ~2.5 GB
- Orchestrator: ~6.0 GB
- Hacknet Manager: ~4.0 GB
- Server Manager: ~4.5 GB
- Program Manager: ~2.5 GB

If you don't have enough RAM, the bootstrap script will start only the essential components (scanner and orchestrator).

## Usage

### Starting the Automation

```bash
run /scripts/bootstrap.js
```

### Viewing Individual Script Logs

```bash
tail /scripts/core/scanner.js
tail /scripts/core/orchestrator.js
tail /scripts/core/hacknet-manager.js
tail /scripts/core/server-manager.js
tail /scripts/core/program-manager.js
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

## Tips for Best Results

1. **Let it run**: The automation works best when left running continuously
2. **Upgrade home RAM**: More home RAM = more automation scripts running
3. **Buy programs**: Purchase port-opening programs from the dark web to unlock more servers
4. **Manual tasks**: Some things still need manual intervention:
   - Purchasing the TOR router
   - Buying programs from the dark web (initially)
   - Joining factions and buying augmentations
   - Working for companies or factions for reputation

## Advanced Usage

### Customization

You can modify the scripts to adjust behavior:

- `scripts/core/hacknet-manager.js`: Change `MAX_NODES` or `UPGRADE_THRESHOLD`
- `scripts/core/server-manager.js`: Adjust `PURCHASE_THRESHOLD` or `MIN_RAM`
- `scripts/core/orchestrator.js`: Modify security/money thresholds

### Running Individual Components

You can run components separately if needed:

```bash
# Just run the network scanner
run /scripts/core/scanner.js

# Just run the orchestrator
run /scripts/core/orchestrator.js

# Just manage hacknet nodes
run /scripts/core/hacknet-manager.js

# View the dashboard
run /scripts/dashboard.js

# Browse network interactively (uses AutoLink.exe when available)
run /scripts/network-browser.js

# Use advanced batch hacking (for experienced players)
run /scripts/batch-hack.js
```

## Troubleshooting

### "Not enough RAM" error
- Upgrade your home server RAM
- Run fewer components
- Use the early-game script instead

### Scripts not finding target servers
- Wait for the scanner to run (60 second intervals)
- Make sure you have port-opening programs
- Check if you have enough hacking level

### Low income generation
- Normal in early game
- Income increases as you:
  - Gain hacking levels
  - Purchase more servers
  - Unlock more hacknet nodes
  - Root more servers in the network

## File Structure

```
scripts/
├── bootstrap.js              # Main entry point
├── config.js                # Configuration file
├── early-hack.js            # Simple early-game script
├── dashboard.js             # Real-time statistics dashboard
├── network-browser.js       # Interactive network browser (uses AutoLink.exe)
├── batch-hack.js            # Advanced batch hacking
├── core/
│   ├── scanner.js           # Network scanner & rooter
│   ├── orchestrator.js      # Main hacking coordinator
│   ├── hacknet-manager.js   # Hacknet automation
│   ├── server-manager.js    # Server purchase/upgrade
│   └── program-manager.js   # Program tracking
├── utils/
│   ├── server-utils.js      # Server helper functions
│   └── format-utils.js      # Formatting functions
└── modules/
    ├── hack.js              # Hack module
    ├── grow.js              # Grow module
    └── weaken.js            # Weaken module
```

## Contributing

Feel free to submit issues, fork the repository, and create pull requests for any improvements.

## License

MIT License - Feel free to use and modify as needed.

## Credits

Created for the Bitburner game: https://github.com/bitburner-official/bitburner-src