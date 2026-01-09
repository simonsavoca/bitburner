/** @param {NS} ns */
import { getRootedServers, getBestTarget, distributeFile } from '/scripts/utils/server-utils.js';
import { formatMoney, formatTime } from '/scripts/utils/format-utils.js';

/**
 * Advanced hacking orchestrator that coordinates hack/grow/weaken operations
 * across all available servers for maximum efficiency
 */

const HACK_SCRIPT = '/scripts/modules/hack.js';
const GROW_SCRIPT = '/scripts/modules/grow.js';
const WEAKEN_SCRIPT = '/scripts/modules/weaken.js';

const SCRIPT_RAM = 1.75; // RAM cost for each basic script

export async function main(ns) {
    ns.disableLog('ALL');
    ns.ui.openTail();
    
    // Distribute scripts to all servers
    ns.print('Distributing scripts to all servers...');
    await distributeFile(ns, HACK_SCRIPT);
    await distributeFile(ns, GROW_SCRIPT);
    await distributeFile(ns, WEAKEN_SCRIPT);
    
    while (true) {
        ns.clearLog();
        ns.print('=== Hacking Orchestrator ===\n');
        
        // Get best target
        const target = getBestTarget(ns);
        ns.print(`Target: ${target}`);
        
        // Get server stats
        const maxMoney = ns.getServerMaxMoney(target);
        const currentMoney = ns.getServerMoneyAvailable(target);
        const minSec = ns.getServerMinSecurityLevel(target);
        const currentSec = ns.getServerSecurityLevel(target);
        const moneyPercent = maxMoney > 0 ? (currentMoney / maxMoney) : 0;
        
        ns.print(`Money: ${formatMoney(currentMoney)} / ${formatMoney(maxMoney)} (${(moneyPercent * 100).toFixed(1)}%)`);
        ns.print(`Security: ${currentSec.toFixed(2)} / ${minSec.toFixed(2)}`);
        
        // Determine action needed
        const securityThreshold = minSec + 5;
        const moneyThreshold = maxMoney * 0.75;
        
        let action = 'hack';
        if (currentSec > securityThreshold) {
            action = 'weaken';
        } else if (currentMoney < moneyThreshold) {
            action = 'grow';
        }
        
        ns.print(`\nAction: ${action.toUpperCase()}`);
        
        // Get all available servers
        const servers = getRootedServers(ns);
        let totalThreads = 0;
        let serversUsed = 0;
        
        // Deploy scripts to all servers
        for (const server of servers) {
            const maxRAM = ns.getServerMaxRam(server);
            const usedRAM = ns.getServerUsedRam(server);
            const availableRAM = maxRAM - usedRAM;
            
            // Calculate threads we can run
            const threads = Math.floor(availableRAM / SCRIPT_RAM);
            
            if (threads > 0) {
                let script;
                if (action === 'weaken') {
                    script = WEAKEN_SCRIPT;
                } else if (action === 'grow') {
                    script = GROW_SCRIPT;
                } else {
                    script = HACK_SCRIPT;
                }
                
                // Kill any existing instances on this server
                ns.scriptKill(HACK_SCRIPT, server);
                ns.scriptKill(GROW_SCRIPT, server);
                ns.scriptKill(WEAKEN_SCRIPT, server);
                
                // Run the script
                const pid = ns.exec(script, server, threads, target);
                if (pid > 0) {
                    totalThreads += threads;
                    serversUsed++;
                }
            }
        }
        
        ns.print(`\nDeployed to ${serversUsed} servers with ${totalThreads} total threads`);
        
        // Calculate expected time
        let expectedTime;
        if (action === 'weaken') {
            expectedTime = ns.getWeakenTime(target);
        } else if (action === 'grow') {
            expectedTime = ns.getGrowTime(target);
        } else {
            expectedTime = ns.getHackTime(target);
        }
        
        ns.print(`Expected completion: ${formatTime(expectedTime)}`);
        
        // Wait for action to complete, plus a buffer
        await ns.sleep(expectedTime + 1000);
    }
}
