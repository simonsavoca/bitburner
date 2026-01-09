/** @param {NS} ns */
/**
 * Master bootstrap script - starts all automation systems
 * This is the main entry point for the automation suite
 * 
 * Usage: run bootstrap.js
 */

import { formatMoney, formatRAM } from '/scripts/utils/format-utils.js';

const SCRIPTS = {
    scanner: '/scripts/core/scanner.js',
    orchestrator: '/scripts/core/orchestrator.js',
    hacknetManager: '/scripts/core/hacknet-manager.js',
    serverManager: '/scripts/core/server-manager.js',
    programManager: '/scripts/core/program-manager.js',
};

export async function main(ns) {
    ns.disableLog('ALL');
    ns.tail();
    
    ns.print('╔════════════════════════════════════════╗');
    ns.print('║   BITBURNER AUTOMATION SUITE v1.0      ║');
    ns.print('╚════════════════════════════════════════╝\n');
    
    // Kill any existing instances of our scripts
    ns.print('Stopping any existing automation scripts...');
    for (const script of Object.values(SCRIPTS)) {
        ns.scriptKill(script, 'home');
    }
    await ns.sleep(1000);
    
    // Check available RAM
    const maxRAM = ns.getServerMaxRam('home');
    const usedRAM = ns.getServerUsedRam('home');
    const availableRAM = maxRAM - usedRAM;
    
    ns.print(`\nHome server RAM: ${formatRAM(availableRAM)} available of ${formatRAM(maxRAM)}\n`);
    
    // Calculate RAM needed for each script
    const ramNeeded = {};
    let totalNeeded = 0;
    for (const [name, script] of Object.entries(SCRIPTS)) {
        const ram = ns.getScriptRam(script);
        ramNeeded[name] = ram;
        totalNeeded += ram;
    }
    
    ns.print('Script RAM requirements:');
    for (const [name, ram] of Object.entries(ramNeeded)) {
        ns.print(`  ${name}: ${formatRAM(ram)}`);
    }
    ns.print(`Total needed: ${formatRAM(totalNeeded)}\n`);
    
    if (totalNeeded > availableRAM) {
        ns.print('WARNING: Not enough RAM to run all scripts!');
        ns.print('Will start essential scripts only.\n');
    }
    
    // Start core scripts
    const started = [];
    const failed = [];
    
    ns.print('Starting automation scripts...\n');
    
    // Start scanner (essential)
    if (ns.getScriptRam(SCRIPTS.scanner) <= availableRAM) {
        const pid = ns.run(SCRIPTS.scanner);
        if (pid > 0) {
            started.push('scanner');
            ns.print('✓ Network scanner started');
        } else {
            failed.push('scanner');
            ns.print('✗ Failed to start scanner');
        }
    }
    
    await ns.sleep(500);
    
    // Start orchestrator (essential)
    if (ns.getScriptRam(SCRIPTS.orchestrator) <= availableRAM - ns.getServerUsedRam('home')) {
        const pid = ns.run(SCRIPTS.orchestrator);
        if (pid > 0) {
            started.push('orchestrator');
            ns.print('✓ Hacking orchestrator started');
        } else {
            failed.push('orchestrator');
            ns.print('✗ Failed to start orchestrator');
        }
    }
    
    await ns.sleep(500);
    
    // Start hacknet manager (optional but recommended)
    if (ns.getScriptRam(SCRIPTS.hacknetManager) <= availableRAM - ns.getServerUsedRam('home')) {
        const pid = ns.run(SCRIPTS.hacknetManager);
        if (pid > 0) {
            started.push('hacknetManager');
            ns.print('✓ Hacknet manager started');
        } else {
            failed.push('hacknetManager');
        }
    }
    
    await ns.sleep(500);
    
    // Start server manager (optional)
    if (ns.getScriptRam(SCRIPTS.serverManager) <= availableRAM - ns.getServerUsedRam('home')) {
        const pid = ns.run(SCRIPTS.serverManager);
        if (pid > 0) {
            started.push('serverManager');
            ns.print('✓ Server manager started');
        } else {
            failed.push('serverManager');
        }
    }
    
    await ns.sleep(500);
    
    // Start program manager (optional)
    if (ns.getScriptRam(SCRIPTS.programManager) <= availableRAM - ns.getServerUsedRam('home')) {
        const pid = ns.run(SCRIPTS.programManager);
        if (pid > 0) {
            started.push('programManager');
            ns.print('✓ Program manager started');
        } else {
            failed.push('programManager');
        }
    }
    
    ns.print('\n════════════════════════════════════════');
    ns.print(`Started: ${started.length} scripts`);
    if (failed.length > 0) {
        ns.print(`Failed: ${failed.length} scripts`);
        ns.print('Consider upgrading home RAM for full automation');
    }
    ns.print('════════════════════════════════════════\n');
    
    ns.print('✓ Automation suite is now running!');
    ns.print('You can close this window. Scripts will continue running.');
    ns.print('\nTo view individual script logs, use the Active Scripts page (Alt+S)');
    
    // Display helpful commands
    ns.print('\nUseful commands:');
    ns.print('  tail bootstrap.js - View this log again');
    ns.print('  tail scanner.js - View network scanner');
    ns.print('  tail orchestrator.js - View hacking operations');
    ns.print('  killall - Stop all scripts');
}
