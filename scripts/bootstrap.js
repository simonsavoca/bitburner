/** @param {NS} ns */
/**
 * Master bootstrap script - starts all automation systems
 * This is the main entry point for the automation suite
 * 
 * Usage: run bootstrap.js
 */

import { formatMoney, formatRAM } from '/scripts/utils/format-utils.js';

const SCRIPTS = {
    // Core automation (always run)
    scanner: '/scripts/core/scanner.js',
    orchestrator: '/scripts/core/orchestrator.js',
    hacknetManager: '/scripts/core/hacknet-manager.js',
    serverManager: '/scripts/core/server-manager.js',
    
    // Singularity-based automation (requires SF4, 16x RAM cost without it)
    singularityManager: '/scripts/core/singularity-manager.js',
    factionManager: '/scripts/core/faction-manager.js',
    statManager: '/scripts/core/stat-manager.js',
    backdoorInstaller: '/scripts/core/backdoor-installer.js',
    progressionOrchestrator: '/scripts/core/progression-orchestrator.js',
    
    // Utility automation
    contractSolver: '/scripts/core/contract-solver.js',
};

export async function main(ns) {
    ns.disableLog('ALL');
    ns.tail();
    
    ns.print('╔════════════════════════════════════════╗');
    ns.print('║   BITBURNER AUTOMATION SUITE v2.0      ║');
    ns.print('║   Full Automation Edition              ║');
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
    
    // Start singularity manager (optional but highly recommended)
    if (ns.getScriptRam(SCRIPTS.singularityManager) <= availableRAM - ns.getServerUsedRam('home')) {
        const pid = ns.run(SCRIPTS.singularityManager);
        if (pid > 0) {
            started.push('singularityManager');
            ns.print('✓ Singularity manager started');
        } else {
            failed.push('singularityManager');
        }
    }
    
    await ns.sleep(500);
    
    // Start faction manager (optional)
    if (ns.getScriptRam(SCRIPTS.factionManager) <= availableRAM - ns.getServerUsedRam('home')) {
        const pid = ns.run(SCRIPTS.factionManager);
        if (pid > 0) {
            started.push('factionManager');
            ns.print('✓ Faction manager started');
        } else {
            failed.push('factionManager');
        }
    }
    
    await ns.sleep(500);
    
    // Start stat manager (optional)
    if (ns.getScriptRam(SCRIPTS.statManager) <= availableRAM - ns.getServerUsedRam('home')) {
        const pid = ns.run(SCRIPTS.statManager);
        if (pid > 0) {
            started.push('statManager');
            ns.print('✓ Stat manager started');
        } else {
            failed.push('statManager');
        }
    }
    
    await ns.sleep(500);
    
    // Start backdoor installer (optional)
    if (ns.getScriptRam(SCRIPTS.backdoorInstaller) <= availableRAM - ns.getServerUsedRam('home')) {
        const pid = ns.run(SCRIPTS.backdoorInstaller);
        if (pid > 0) {
            started.push('backdoorInstaller');
            ns.print('✓ Backdoor installer started');
        } else {
            failed.push('backdoorInstaller');
        }
    }
    
    await ns.sleep(500);
    
    // Start progression orchestrator (optional but recommended)
    if (ns.getScriptRam(SCRIPTS.progressionOrchestrator) <= availableRAM - ns.getServerUsedRam('home')) {
        const pid = ns.run(SCRIPTS.progressionOrchestrator);
        if (pid > 0) {
            started.push('progressionOrchestrator');
            ns.print('✓ Progression orchestrator started');
        } else {
            failed.push('progressionOrchestrator');
        }
    }
    
    await ns.sleep(500);
    
    // Start contract solver (optional)
    if (ns.getScriptRam(SCRIPTS.contractSolver) <= availableRAM - ns.getServerUsedRam('home')) {
        const pid = ns.run(SCRIPTS.contractSolver);
        if (pid > 0) {
            started.push('contractSolver');
            ns.print('✓ Contract solver started');
        } else {
            failed.push('contractSolver');
        }
    }
    
    ns.print('\n════════════════════════════════════════');
    ns.print(`Started: ${started.length}/${Object.keys(SCRIPTS).length} scripts`);
    if (failed.length > 0) {
        ns.print(`Failed: ${failed.length} scripts: ${failed.join(', ')}`);
        ns.print('Consider upgrading home RAM for full automation');
        ns.print('\nNote: Singularity functions require Source-File 4');
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
