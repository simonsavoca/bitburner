# Bitburner Automation Suite - Quick Reference

## Installation (Choose One)

### Auto-Deploy (Easiest)
```bash
wget https://raw.githubusercontent.com/simonsavoca/bitburner/main/deploy.js deploy.js
run deploy.js
```

### Manual Install
See README.md for detailed instructions

## Basic Commands

### Start Automation
```bash
run /scripts/bootstrap.js
```

### View Dashboard
```bash
run /scripts/dashboard.js
```

### View Help
```bash
run /scripts/help.js
```

### Stop Everything
```bash
killall
```

## Individual Scripts

### Core Scripts
- `run /scripts/core/scanner.js` - Network scanner
- `run /scripts/core/orchestrator.js` - Hacking coordinator
- `run /scripts/core/hacknet-manager.js` - Hacknet automation
- `run /scripts/core/server-manager.js` - Server management
- `run /scripts/core/program-manager.js` - Program tracker

### Optional Scripts
- `run /scripts/dashboard.js` - Statistics dashboard
- `run /scripts/batch-hack.js` - Advanced batching
- `run /scripts/early-hack.js [target]` - Simple hacking

## Viewing Logs

### View Specific Log
```bash
tail /scripts/bootstrap.js
tail /scripts/core/orchestrator.js
tail /scripts/dashboard.js
```

### Or Use Active Scripts
Press `Alt+S` to open Active Scripts page

## Common Tasks

### Check What's Running
```bash
ps home
```

### View Available RAM
```bash
free
```

### Restart Automation
```bash
killall
run /scripts/bootstrap.js
```

## Tips

1. **Home RAM**: Upgrade for more automation (need ~15-20 GB total)
2. **Programs**: Buy from dark web to unlock more servers
3. **TOR Router**: Must be purchased manually ($200k)
4. **Patience**: Income grows exponentially over time
5. **Dashboard**: Best way to monitor progress

## Troubleshooting

### Not Enough RAM
- Upgrade home server
- Use `run /scripts/early-hack.js` instead

### Scripts Not Running
- Check RAM with `free`
- Restart with `killall` then `run /scripts/bootstrap.js`

### Low Income
- Normal in early game
- Gain hacking levels
- Buy more programs
- Let it run continuously

## What Still Needs Manual Input

- Purchasing TOR router
- Joining factions
- Buying augmentations
- Working for companies/factions
- Installing augmentations

## More Info

- Full documentation: README.md
- Repository: https://github.com/simonsavoca/bitburner
- Game docs: https://github.com/bitburner-official/bitburner-src

---
For detailed explanations, run: `run /scripts/help.js`
