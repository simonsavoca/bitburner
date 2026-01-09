/** @param {NS} ns */
import { getBestTarget, getRootedServers, distributeFile } from '/scripts/utils/server-utils.js';
import { formatMoney, formatTime } from '/scripts/utils/format-utils.js';

/**
 * Advanced batch hacking (HWGW) orchestrator
 * Coordinates timed hack/weaken/grow/weaken batches for maximum profit
 * More efficient than the basic orchestrator but requires more RAM and coordination
 */

const HACK_SCRIPT = '/scripts/modules/hack.js';
const GROW_SCRIPT = '/scripts/modules/grow.js';
const WEAKEN_SCRIPT = '/scripts/modules/weaken.js';
const SCRIPT_RAM = 1.75;

export async function main(ns) {
    ns.disableLog('ALL');
    ns.ui.openTail();
    
    ns.print('═══ BATCH HACKING ORCHESTRATOR ═══\n');
    ns.print('This is an advanced hacking strategy.');
    ns.print('Make sure you have sufficient RAM and rooted servers.\n');
    
    // Distribute scripts
    await distributeFile(ns, HACK_SCRIPT);
    await distributeFile(ns, GROW_SCRIPT);
    await distributeFile(ns, WEAKEN_SCRIPT);
    
    while (true) {
        const target = getBestTarget(ns);
        
        ns.clearLog();
        ns.print('═══ BATCH HACKING ═══');
        ns.print(`Target: ${target}\n`);
        
        // Prepare the server (get to optimal state)
        await prepareServer(ns, target);
        
        // Run batches
        await runBatch(ns, target);
        
        await ns.sleep(1000);
    }
}

/**
 * Prepare a server to optimal state (min security, max money)
 */
async function prepareServer(ns, target) {
    const minSec = ns.getServerMinSecurityLevel(target);
    const maxMoney = ns.getServerMaxMoney(target);
    const currentSec = ns.getServerSecurityLevel(target);
    const currentMoney = ns.getServerMoneyAvailable(target);
    
    // Check if already prepared
    if (currentSec <= minSec + 0.1 && currentMoney >= maxMoney * 0.99) {
        ns.print('✓ Server prepared\n');
        return;
    }
    
    ns.print('Preparing server to optimal state...');
    
    const servers = getRootedServers(ns);
    
    // Weaken to minimum security
    while (ns.getServerSecurityLevel(target) > minSec + 0.1) {
        ns.print(`Security: ${ns.getServerSecurityLevel(target).toFixed(2)} -> ${minSec.toFixed(2)}`);
        
        let totalThreads = 0;
        for (const server of servers) {
            const availableRAM = ns.getServerMaxRam(server) - ns.getServerUsedRam(server);
            const threads = Math.floor(availableRAM / SCRIPT_RAM);
            
            if (threads > 0) {
                ns.exec(WEAKEN_SCRIPT, server, threads, target);
                totalThreads += threads;
            }
        }
        
        await ns.sleep(ns.getWeakenTime(target) + 1000);
        
        // Kill all scripts
        for (const server of servers) {
            ns.scriptKill(WEAKEN_SCRIPT, server);
        }
    }
    
    // Grow to maximum money
    while (ns.getServerMoneyAvailable(target) < maxMoney * 0.99) {
        ns.print(`Money: ${formatMoney(ns.getServerMoneyAvailable(target))} -> ${formatMoney(maxMoney)}`);
        
        let totalThreads = 0;
        for (const server of servers) {
            const availableRAM = ns.getServerMaxRam(server) - ns.getServerUsedRam(server);
            const threads = Math.floor(availableRAM / SCRIPT_RAM);
            
            if (threads > 0) {
                ns.exec(GROW_SCRIPT, server, threads, target);
                totalThreads += threads;
            }
        }
        
        await ns.sleep(ns.getGrowTime(target) + 1000);
        
        // Kill all scripts
        for (const server of servers) {
            ns.scriptKill(GROW_SCRIPT, server);
        }
        
        // Weaken if security increased
        if (ns.getServerSecurityLevel(target) > minSec + 1) {
            for (const server of servers) {
                const availableRAM = ns.getServerMaxRam(server) - ns.getServerUsedRam(server);
                const threads = Math.floor(availableRAM / SCRIPT_RAM);
                
                if (threads > 0) {
                    ns.exec(WEAKEN_SCRIPT, server, threads, target);
                }
            }
            
            await ns.sleep(ns.getWeakenTime(target) + 1000);
            
            for (const server of servers) {
                ns.scriptKill(WEAKEN_SCRIPT, server);
            }
        }
    }
    
    ns.print('✓ Server prepared!\n');
}

/**
 * Run a single HWGW batch
 */
async function runBatch(ns, target) {
    const servers = getRootedServers(ns);
    
    // Calculate available RAM
    let totalRAM = 0;
    for (const server of servers) {
        totalRAM += ns.getServerMaxRam(server) - ns.getServerUsedRam(server);
    }
    
    const availableThreads = Math.floor(totalRAM / SCRIPT_RAM);
    
    if (availableThreads < 4) {
        ns.print('Not enough RAM for batch');
        await ns.sleep(5000);
        return;
    }
    
    // Calculate optimal thread distribution
    // Simple ratio: 1 hack : 2 grow : 2 weaken
    const hackThreads = Math.floor(availableThreads * 0.2);
    const growThreads = Math.floor(availableThreads * 0.4);
    const weaken1Threads = Math.floor(availableThreads * 0.2);
    const weaken2Threads = Math.floor(availableThreads * 0.2);
    
    ns.print(`Batch: H:${hackThreads} W:${weaken1Threads} G:${growThreads} W:${weaken2Threads}`);
    
    // Deploy threads
    let serverIndex = 0;
    const ops = [
        { script: HACK_SCRIPT, threads: hackThreads, label: 'Hack' },
        { script: WEAKEN_SCRIPT, threads: weaken1Threads, label: 'Weaken1' },
        { script: GROW_SCRIPT, threads: growThreads, label: 'Grow' },
        { script: WEAKEN_SCRIPT, threads: weaken2Threads, label: 'Weaken2' },
    ];
    
    for (const op of ops) {
        let threadsLeft = op.threads;
        
        while (threadsLeft > 0 && serverIndex < servers.length) {
            const server = servers[serverIndex];
            const availableRAM = ns.getServerMaxRam(server) - ns.getServerUsedRam(server);
            const maxThreads = Math.floor(availableRAM / SCRIPT_RAM);
            const threads = Math.min(threadsLeft, maxThreads);
            
            if (threads > 0) {
                ns.exec(op.script, server, threads, target);
                threadsLeft -= threads;
            }
            
            serverIndex++;
        }
    }
    
    // Wait for batch to complete
    const hackTime = ns.getHackTime(target);
    await ns.sleep(hackTime + 2000);
    
    // Clean up
    for (const server of servers) {
        ns.scriptKill(HACK_SCRIPT, server);
        ns.scriptKill(GROW_SCRIPT, server);
        ns.scriptKill(WEAKEN_SCRIPT, server);
    }
    
    ns.print(`Batch complete. Profit: ${formatMoney(ns.getScriptIncome()[0])}/sec`);
}
