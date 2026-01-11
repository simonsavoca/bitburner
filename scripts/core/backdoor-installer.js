/** @param {NS} ns */
import { scanNetwork } from '/scripts/utils/server-utils.js';

/**
 * Automatically installs backdoors on all accessible servers
 * Backdoors are required for some faction invitations and provide benefits
 * 
 * Note: Requires Source-File 4 access
 */
export async function main(ns) {
    ns.disableLog('ALL');
    ns.ui.openTail();
    
    while (true) {
        ns.clearLog();
        ns.print('=== Backdoor Installer ===\n');
        
        const player = ns.getPlayer();
        const allServers = scanNetwork(ns);
        
        // Find all servers we can backdoor
        const targets = [];
        
        for (const server of allServers) {
            // Skip home server
            if (server === 'home') continue;
            
            const hasRoot = ns.hasRootAccess(server);
            const reqLevel = ns.getServerRequiredHackingLevel(server);
            const canHack = player.skills.hacking >= reqLevel;
            const hasBackdoor = ns.getServer(server).backdoorInstalled;
            
            targets.push({
                server,
                hasRoot,
                canHack,
                hasBackdoor,
                reqLevel
            });
        }
        
        // Separate servers by status for organized display
        const backdoored = [];
        const canBackdoor = [];
        const needRoot = [];
        const needLevel = [];
        
        for (const target of targets) {
            if (target.hasBackdoor) {
                backdoored.push(target);
            } else if (!target.hasRoot) {
                needRoot.push(target);
            } else if (!target.canHack) {
                needLevel.push(target);
            } else {
                canBackdoor.push(target);
            }
        }
        
        ns.print(`Total Servers: ${targets.length}`);
        ns.print(`Backdoored: ${backdoored.length}`);
        ns.print(`Can Backdoor Now: ${canBackdoor.length}`);
        ns.print(`Need Root: ${needRoot.length}`);
        ns.print(`Need Hacking Level: ${needLevel.length}\n`);
        
        // Install backdoors on servers we can access
        if (canBackdoor.length > 0) {
            ns.print('=== Installing Backdoors ===\n');
            
            // Sort by required level (easiest first)
            canBackdoor.sort((a, b) => a.reqLevel - b.reqLevel);
            
            for (const target of canBackdoor) {
                ns.print(`${target.server} (Lvl ${target.reqLevel}):`);
                ns.print(`  ⏳ Installing backdoor...`);
                
                // Connect to the server and install backdoor
                const path = findPath(ns, 'home', target.server);
                
                if (path) {
                    // Navigate to server
                    for (const hop of path) {
                        ns.singularity.connect(hop);
                    }
                    
                    // Install backdoor
                    await ns.singularity.installBackdoor();
                    
                    // Return home
                    ns.singularity.connect('home');
                    
                    ns.print(`  ✓ Backdoor installed!`);
                } else {
                    ns.print(`  ✗ Cannot find path to server`);
                }
                
                ns.print('');
            }
        } else {
            ns.print('✓ All accessible servers have backdoors installed!\n');
        }
        
        await ns.sleep(300000); // Check every 5 minutes
    }
}

/**
 * Find path from start to target server
 */
function findPath(ns, start, target) {
    const queue = [[start]];
    const visited = new Set([start]);
    
    while (queue.length > 0) {
        const path = queue.shift();
        const current = path[path.length - 1];
        
        if (current === target) {
            return path.slice(1); // Remove 'home' from path
        }
        
        const neighbors = ns.scan(current);
        
        for (const neighbor of neighbors) {
            if (!visited.has(neighbor)) {
                visited.add(neighbor);
                queue.push([...path, neighbor]);
            }
        }
    }
    
    return null;
}
