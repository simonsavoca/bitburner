/** @param {NS} ns */
import { scanNetwork } from '/scripts/utils/server-utils.js';

/**
 * List all servers without backdoor
 * Useful for early game to track which servers still need backdoors
 * 
 * Usage: run list-no-backdoor.js [--all]
 * 
 * By default, only shows servers you can backdoor now (have root + required hacking level)
 * Use --all flag to show all servers without backdoor
 */
export async function main(ns) {
    const args = ns.flags([
        ['help', false],
        ['all', false]
    ]);
    
    if (args.help) {
        ns.tprint('');
        ns.tprint('List Servers Without Backdoor - Early Game Helper');
        ns.tprint('Usage: run list-no-backdoor.js [--all]');
        ns.tprint('');
        ns.tprint('Options:');
        ns.tprint('  --all   Show all servers without backdoor (including ones you cannot access yet)');
        ns.tprint('');
        ns.tprint('By default, only shows servers you can backdoor right now.');
        ns.tprint('');
        return;
    }
    
    const showAll = args.all;
    
    ns.tprint('');
    ns.tprint('╔════════════════════════════════════════════════════════════════╗');
    ns.tprint('║          SERVERS WITHOUT BACKDOOR - STATUS REPORT              ║');
    ns.tprint('╚════════════════════════════════════════════════════════════════╝');
    ns.tprint('');
    
    const player = ns.getPlayer();
    const allServers = scanNetwork(ns);
    
    // Categorize servers
    const canBackdoorNow = [];
    const needRoot = [];
    const needHackingLevel = [];
    const hasBackdoor = [];
    
    for (const serverName of allServers) {
        if (serverName === 'home') continue; // Skip home server
        
        const server = ns.getServer(serverName);
        const hasRoot = server.hasAdminRights;
        const reqLevel = server.requiredHackingSkill;
        const canHack = player.skills.hacking >= reqLevel;
        const backdoorInstalled = server.backdoorInstalled;
        
        if (backdoorInstalled) {
            hasBackdoor.push({
                name: serverName,
                reqLevel
            });
        } else if (!hasRoot) {
            needRoot.push({
                name: serverName,
                reqLevel,
                canHack
            });
        } else if (!canHack) {
            needHackingLevel.push({
                name: serverName,
                reqLevel,
                currentLevel: player.skills.hacking
            });
        } else {
            canBackdoorNow.push({
                name: serverName,
                reqLevel
            });
        }
    }
    
    // Display summary
    ns.tprint(`Your Hacking Level: ${player.skills.hacking}`);
    ns.tprint(`Total Servers: ${allServers.length - 1}`); // -1 for home
    ns.tprint(`Backdoor Installed: ${hasBackdoor.length}`);
    ns.tprint(`Without Backdoor: ${canBackdoorNow.length + needRoot.length + needHackingLevel.length}`);
    ns.tprint('');
    
    // Show servers that can be backdoored now
    if (canBackdoorNow.length > 0) {
        ns.tprint('═══ CAN BACKDOOR NOW ═══');
        ns.tprint('');
        
        // Sort by required hacking level
        canBackdoorNow.sort((a, b) => a.reqLevel - b.reqLevel);
        
        for (const server of canBackdoorNow) {
            ns.tprint(`✓ ${server.name.padEnd(20)} (Lvl: ${server.reqLevel})`);
        }
        ns.tprint('');
        ns.tprint(`Total: ${canBackdoorNow.length} server(s) ready for backdoor installation`);
        ns.tprint('');
    } else {
        ns.tprint('✓ No servers available for backdoor installation right now');
        ns.tprint('');
    }
    
    // Show servers that need hacking level (if --all flag is used or there are any)
    if (showAll && needHackingLevel.length > 0) {
        ns.tprint('═══ NEED HIGHER HACKING LEVEL ═══');
        ns.tprint('');
        
        // Sort by required hacking level
        needHackingLevel.sort((a, b) => a.reqLevel - b.reqLevel);
        
        for (const server of needHackingLevel) {
            const levelNeeded = server.reqLevel - server.currentLevel;
            ns.tprint(`○ ${server.name.padEnd(20)} (Lvl: ${server.reqLevel}, Need +${levelNeeded})`);
        }
        ns.tprint('');
        ns.tprint(`Total: ${needHackingLevel.length} server(s) need higher hacking level`);
        ns.tprint('');
    }
    
    // Show servers that need root access (if --all flag is used or there are any)
    if (showAll && needRoot.length > 0) {
        ns.tprint('═══ NEED ROOT ACCESS ═══');
        ns.tprint('');
        
        // Sort by required hacking level
        needRoot.sort((a, b) => a.reqLevel - b.reqLevel);
        
        for (const server of needRoot) {
            const status = server.canHack ? '(Can Hack)' : '(Cannot Hack Yet)';
            ns.tprint(`✗ ${server.name.padEnd(20)} (Lvl: ${server.reqLevel}) ${status}`);
        }
        ns.tprint('');
        ns.tprint(`Total: ${needRoot.length} server(s) need root access`);
        ns.tprint('');
    }
    
    // Show tip about installing backdoors
    ns.tprint('═══ TIPS ═══');
    ns.tprint('');
    ns.tprint('To install a backdoor manually:');
    ns.tprint('  1. Connect to the server: connect [server-name]');
    ns.tprint('  2. Run: backdoor');
    ns.tprint('  3. Wait for completion');
    ns.tprint('  4. Return home: home');
    ns.tprint('');
    
    // Check if Singularity API is available (requires Source-File 4)
    let hasSingularity = false;
    try {
        // Try to call a Singularity function - it will throw if not available
        ns.singularity.getOwnedAugmentations();
        hasSingularity = true;
    } catch {
        hasSingularity = false;
    }
    
    if (hasSingularity) {
        ns.tprint('✓ You have Singularity API access!');
        ns.tprint('  Consider using: /scripts/core/backdoor-installer.js');
        ns.tprint('  for automatic backdoor installation on faction servers.');
    } else {
        ns.tprint('○ Singularity API not available (requires Source-File 4)');
        ns.tprint('  Manual backdoor installation required for now.');
    }
    ns.tprint('');
    
    if (!showAll && (needRoot.length > 0 || needHackingLevel.length > 0)) {
        ns.tprint('Tip: Use --all flag to see servers you cannot backdoor yet');
        ns.tprint('');
    }
    
    ns.tprint('════════════════════════════════════════════════════════════════');
}
