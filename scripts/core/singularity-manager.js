/** @param {NS} ns */
import { formatMoney } from '/scripts/utils/format-utils.js';

/**
 * Manages Singularity API functions for full automation
 * Handles TOR purchase, program purchasing/creation, home upgrades
 * 
 * Note: This requires Source-File 4 access. Outside BN4, functions cost 16x RAM.
 */
export async function main(ns) {
    ns.disableLog('ALL');
    ns.tail();
    
    // Programs in priority order (port openers first, then utilities)
    const PRIORITY_PROGRAMS = [
        'BruteSSH.exe',
        'FTPCrack.exe',
        'relaySMTP.exe',
        'HTTPWorm.exe',
        'SQLInject.exe',
        'DeepscanV1.exe',
        'DeepscanV2.exe',
        'AutoLink.exe',
        'ServerProfiler.exe',
        'Formulas.exe'
    ];
    
    // Programs that can be created
    const CREATABLE_PROGRAMS = [
        'BruteSSH.exe',
        'FTPCrack.exe',
        'relaySMTP.exe',
        'HTTPWorm.exe',
        'SQLInject.exe',
        'DeepscanV1.exe',
        'DeepscanV2.exe',
        'AutoLink.exe',
        'ServerProfiler.exe',
        'Formulas.exe'
    ];
    
    while (true) {
        ns.clearLog();
        ns.print('=== Singularity Manager ===\n');
        
        const player = ns.getPlayer();
        const currentMoney = ns.getServerMoneyAvailable('home');
        
        // 1. Purchase TOR router if we don't have it
        if (!ns.hasTorRouter()) {
            const torCost = 200000;
            if (currentMoney >= torCost) {
                if (ns.singularity.purchaseTor()) {
                    ns.print('✓ SUCCESS: Purchased TOR router!');
                } else {
                    ns.print('✗ Failed to purchase TOR router');
                }
            } else {
                ns.print(`Need ${formatMoney(torCost - currentMoney)} more for TOR router`);
            }
        } else {
            ns.print('✓ TOR router owned\n');
            
            // 2. Buy or create programs
            await handlePrograms(ns, PRIORITY_PROGRAMS, CREATABLE_PROGRAMS, currentMoney);
        }
        
        ns.print('');
        
        // 3. Upgrade home computer
        await handleHomeUpgrades(ns, currentMoney);
        
        await ns.sleep(30000); // Check every 30 seconds
    }
}

/**
 * Handle program purchasing and creation
 */
async function handlePrograms(ns, priorityPrograms, creatablePrograms, currentMoney) {
    ns.print('--- Programs ---');
    
    let allOwned = true;
    let currentlyCreating = false;
    
    // Check if we're currently creating a program
    const currentWork = ns.singularity.getCurrentWork();
    if (currentWork && currentWork.type === 'CREATE_PROGRAM') {
        currentlyCreating = true;
        ns.print(`⏳ Creating: ${currentWork.programName}`);
    }
    
    for (const program of priorityPrograms) {
        if (ns.fileExists(program, 'home')) {
            ns.print(`✓ ${program}`);
        } else {
            allOwned = false;
            
            // If not currently creating, try to create or purchase
            if (!currentlyCreating) {
                // Check if we can create it
                if (creatablePrograms.includes(program)) {
                    const hackingReq = ns.singularity.getHackingLevelRequirementOfProgram(program);
                    
                    if (ns.getHackingLevel() >= hackingReq) {
                        ns.print(`🔨 Starting creation: ${program}`);
                        if (ns.singularity.createProgram(program, false)) {
                            currentlyCreating = true;
                            continue;
                        }
                    }
                }
                
                // Try to purchase from darkweb
                const cost = ns.singularity.getDarkwebProgramCost(program);
                if (cost > 0 && currentMoney >= cost) {
                    if (ns.singularity.purchaseProgram(program)) {
                        ns.print(`✓ Purchased ${program} for ${formatMoney(cost)}`);
                    } else {
                        ns.print(`✗ ${program} - Cost: ${formatMoney(cost)}`);
                    }
                } else if (cost > 0) {
                    ns.print(`✗ ${program} - Need: ${formatMoney(cost)}`);
                } else {
                    ns.print(`✗ ${program} - Not available`);
                }
            } else {
                ns.print(`⏸ ${program} - Waiting...`);
            }
        }
    }
    
    if (allOwned) {
        ns.print('\n✓ All priority programs owned!');
    }
}

/**
 * Handle home computer upgrades
 */
async function handleHomeUpgrades(ns, currentMoney) {
    ns.print('--- Home Upgrades ---');
    
    const UPGRADE_THRESHOLD = 0.15; // Upgrade when cost is less than 15% of current money
    
    // Try to upgrade RAM
    const ramCost = ns.singularity.getUpgradeHomeRamCost();
    const currentRAM = ns.getServerMaxRam('home');
    
    if (ramCost > 0 && currentMoney * UPGRADE_THRESHOLD >= ramCost) {
        if (ns.singularity.upgradeHomeRam()) {
            ns.print(`✓ Upgraded home RAM to ${currentRAM * 2} GB for ${formatMoney(ramCost)}`);
        }
    } else if (ramCost > 0) {
        ns.print(`Home RAM upgrade: ${formatMoney(ramCost)} (${(currentRAM * 2).toFixed(0)} GB)`);
    }
    
    // Try to upgrade Cores
    const coreCost = ns.singularity.getUpgradeHomeCoresCost();
    const player = ns.getPlayer();
    
    if (coreCost > 0 && currentMoney * UPGRADE_THRESHOLD >= coreCost) {
        if (ns.singularity.upgradeHomeCores()) {
            ns.print(`✓ Upgraded home cores for ${formatMoney(coreCost)}`);
        }
    } else if (coreCost > 0) {
        ns.print(`Home cores upgrade: ${formatMoney(coreCost)}`);
    }
}
