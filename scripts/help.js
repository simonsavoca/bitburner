/** @param {NS} ns */
/**
 * Quick start guide and help script
 * Displays useful information for new users
 */
export async function main(ns) {
    ns.tprint('');
    ns.tprint('╔════════════════════════════════════════════════════════════════╗');
    ns.tprint('║        BITBURNER AUTOMATION SUITE - QUICK START GUIDE          ║');
    ns.tprint('╚════════════════════════════════════════════════════════════════╝');
    ns.tprint('');
    
    ns.tprint('═══ INSTALLATION ═══');
    ns.tprint('');
    ns.tprint('Option 1: Auto-Deploy (Recommended)');
    ns.tprint('  wget https://raw.githubusercontent.com/simonsavoca/bitburner/main/deploy.js deploy.js');
    ns.tprint('  run deploy.js');
    ns.tprint('');
    
    ns.tprint('Option 2: Manual Commands');
    ns.tprint('  See README.md for full installation instructions');
    ns.tprint('');
    
    ns.tprint('═══ BASIC USAGE ═══');
    ns.tprint('');
    ns.tprint('Start all automation:');
    ns.tprint('  run /scripts/bootstrap.js');
    ns.tprint('');
    ns.tprint('View dashboard:');
    ns.tprint('  run /scripts/dashboard.js');
    ns.tprint('');
    ns.tprint('Stop all automation:');
    ns.tprint('  killall');
    ns.tprint('');
    
    ns.tprint('═══ INDIVIDUAL SCRIPTS ═══');
    ns.tprint('');
    ns.tprint('Core Scripts:');
    ns.tprint('  run /scripts/core/scanner.js          - Network scanner');
    ns.tprint('  run /scripts/core/orchestrator.js     - Hacking orchestrator');
    ns.tprint('  run /scripts/core/hacknet-manager.js  - Hacknet automation');
    ns.tprint('  run /scripts/core/server-manager.js   - Server management');
    ns.tprint('  run /scripts/core/program-manager.js  - Program tracker');
    ns.tprint('');
    ns.tprint('Optional Scripts:');
    ns.tprint('  run /scripts/dashboard.js             - Statistics dashboard');
    ns.tprint('  run /scripts/network-browser.js       - Interactive network browser (uses AutoLink.exe)');
    ns.tprint('  run /scripts/batch-hack.js            - Advanced batching');
    ns.tprint('  run /scripts/early-hack.js [target]   - Simple hacking');
    ns.tprint('');
    
    ns.tprint('═══ VIEWING LOGS ═══');
    ns.tprint('');
    ns.tprint('View script logs:');
    ns.tprint('  tail /scripts/bootstrap.js');
    ns.tprint('  tail /scripts/core/orchestrator.js');
    ns.tprint('  tail /scripts/dashboard.js');
    ns.tprint('');
    ns.tprint('Or use Active Scripts page: Alt+S');
    ns.tprint('');
    
    ns.tprint('═══ TIPS FOR SUCCESS ═══');
    ns.tprint('');
    ns.tprint('1. Upgrade your home server RAM (allows more automation)');
    ns.tprint('2. Purchase port-opening programs from dark web');
    ns.tprint('3. Let automation run continuously for best results');
    ns.tprint('4. Use dashboard to monitor progress');
    ns.tprint('5. Manual tasks still needed:');
    ns.tprint('   - Purchase TOR router');
    ns.tprint('   - Join factions');
    ns.tprint('   - Buy augmentations');
    ns.tprint('');
    
    ns.tprint('═══ TROUBLESHOOTING ═══');
    ns.tprint('');
    ns.tprint('Not enough RAM:');
    ns.tprint('  - Upgrade home server');
    ns.tprint('  - Run fewer scripts');
    ns.tprint('  - Use early-hack.js instead');
    ns.tprint('');
    ns.tprint('Low income:');
    ns.tprint('  - Normal in early game');
    ns.tprint('  - Gain hacking levels');
    ns.tprint('  - Purchase more servers');
    ns.tprint('');
    
    ns.tprint('═══ MORE INFORMATION ═══');
    ns.tprint('');
    ns.tprint('GitHub: https://github.com/simonsavoca/bitburner');
    ns.tprint('Game Documentation: https://github.com/bitburner-official/bitburner-src');
    ns.tprint('');
    ns.tprint('════════════════════════════════════════════════════════════════');
}
