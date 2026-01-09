/** @param {NS} ns */
import { scanNetwork } from '/scripts/utils/server-utils.js';

/**
 * Automatically installs backdoors on important faction servers
 * Backdoors are required for some faction invitations
 * 
 * Note: Requires Source-File 4 access
 */
export async function main(ns) {
    ns.disableLog('ALL');
    ns.ui.openTail();
    
    // Important servers that give faction invitations when backdoored
    const FACTION_SERVERS = [
        'CSEC',           // CyberSec
        'avmnite-02h',    // NiteSec
        'I.I.I.I',        // The Black Hand
        'run4theh111z',   // Bitrunners
        'w0r1d_d43m0n'    // Daedalus (endgame)
    ];
    
    while (true) {
        ns.clearLog();
        ns.print('=== Backdoor Installer ===\n');
        
        const player = ns.getPlayer();
        const allServers = scanNetwork(ns);
        
        // Find faction servers we can access
        const targets = [];
        
        for (const server of allServers) {
            if (FACTION_SERVERS.includes(server)) {
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
        }
        
        if (targets.length === 0) {
            ns.print('No faction servers found yet');
        } else {
            for (const target of targets) {
                ns.print(`${target.server}:`);
                
                if (target.hasBackdoor) {
                    ns.print(`  ✓ Backdoor installed`);
                } else if (!target.hasRoot) {
                    ns.print(`  ✗ Need root access`);
                } else if (!target.canHack) {
                    ns.print(`  ✗ Need hacking ${target.reqLevel} (have ${player.skills.hacking})`);
                } else {
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
                }
                
                ns.print('');
            }
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
