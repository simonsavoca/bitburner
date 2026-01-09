# Bitburner Automation Suite v2.0 - Quick Reference

## 🚀 Installation (Easiest Method)

### Auto-Deploy
```bash
wget https://raw.githubusercontent.com/simonsavoca/bitburner/main/deploy.js deploy.js
run deploy.js
```

**That's it!** The automation will now run and handle most of the game automatically.

## 📊 View Progress

### Dashboard (Real-time Stats)
```bash
run /scripts/dashboard.js
```

### Progression Guide (Master Controller)
```bash
tail /scripts/core/progression-orchestrator.js
```

### Individual Components
```bash
tail /scripts/core/scanner.js          # Network scanning
tail /scripts/core/orchestrator.js     # Hacking operations
tail /scripts/core/singularity-manager.js  # TOR, programs, upgrades
tail /scripts/core/faction-manager.js  # Factions & augmentations
```

## ⚡ Automation Levels

### Without Source-File 4 (Basic Automation)
**Automated:**
- ✅ Network scanning and rooting
- ✅ Hacking operations (hack/grow/weaken)
- ✅ Hacknet nodes
- ✅ Server purchasing

**Manual:**
- ❌ TOR router ($200k)
- ❌ Programs from darkweb
- ❌ Joining factions
- ❌ Working for factions
- ❌ Buying/installing augmentations

### With Source-File 4 (Full Automation)
**Everything automated including:**
- ✅ TOR router purchase
- ✅ Program creation/purchase
- ✅ Home upgrades (RAM/cores)
- ✅ Faction joining & work
- ✅ Augmentation purchasing
- ✅ Stat training
- ✅ Backdoor installation
- ✅ Coding contract solving
- ✅ Auto-install augmentations (10+ queued)

**Just run and watch!** 🎮

## 🎯 What to Expect

### Early Game (Minutes 1-30)
- Scanner roots servers
- Orchestrator starts hacking
- Money grows from $0 to $1M+
- Hacknet nodes purchased

### Mid Game (Hours 1-5)
- **Without SF4**: Manually buy TOR, programs, join factions
- **With SF4**: Everything happens automatically
- Money grows to $100M+
- Home RAM upgrades
- Faction reputation gains

### Late Game (Hours 5+)
- Augmentations purchased automatically (with SF4)
- Stats trained automatically
- Backdoors installed automatically
- Ready to complete BitNode

## 🛠 Common Commands

### Update Scripts (Get Latest Version)
```bash
wget https://raw.githubusercontent.com/simonsavoca/bitburner/main/update.js update.js
run update.js
```

### Restart Automation
```bash
killall
run /scripts/bootstrap.js
```

### Check Running Scripts
```bash
ps home
```

### View Available RAM
```bash
free
```

### Stop Everything
```bash
killall
```

## 💡 Tips

1. **Patience**: Income grows exponentially, give it time
2. **Don't Interfere**: Let the automation run continuously
3. **Monitor Progress**: Check Progression Orchestrator periodically
4. **Upgrade RAM**: More home RAM = more automation (done automatically with SF4)
5. **Get SF4**: Unlock full automation by completing BitNode-4

## ⚠ Troubleshooting

### Not Enough RAM
- Upgrade home server (automatic with SF4)
- Without SF4: Need ~500GB+ for full automation
- With SF4-3: Need ~50GB for full automation

### Scripts Not Working
- Check if you have Source-File 4 for advanced features
- Without SF4, only basic automation works
- Check logs with `tail` command

### Low Income
- Normal in early game
- Grows exponentially over time
- Let it run for at least 30 minutes

## 📚 More Information

- **Full Guide**: See `AUTOMATION_GUIDE.md` for complete details
- **README**: See `README.md` for technical documentation
- **Repository**: https://github.com/simonsavoca/bitburner
- **Game Docs**: https://github.com/bitburner-official/bitburner-src

---

**Need Help?** Check the Progression Orchestrator log:
```bash
tail /scripts/core/progression-orchestrator.js
```

It will guide you through each phase of the game! 🎮
