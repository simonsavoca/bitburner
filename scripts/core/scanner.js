/** @param {NS} ns */
import { scanNetwork, tryNuke, hasAutoLink } from '/scripts/utils/server-utils.js';

/**
 * Automatically scan network and gain root access to all possible servers
 */
export async function main(ns) {
    ns.disableLog('ALL');
    ns.ui.openTail();
    
    let lastScanTime = 0;
    const SCAN_INTERVAL = 60000; // Scan every 60 seconds
    
    while (true) {
        const now = Date.now();
        
        if (now - lastScanTime >= SCAN_INTERVAL) {
            ns.clearLog();
            ns.print('=== Network Scanner ===');
            
            // Check for AutoLink.exe
            if (hasAutoLink(ns)) {
                ns.print('✓ AutoLink.exe available - Use network-browser.js for interactive navigation');
            }
            
            ns.print('Scanning network for new servers...\n');
            
            const servers = scanNetwork(ns);
            let nuked = 0;
            let alreadyRooted = 0;
            let cannotNuke = 0;
            
            for (const server of servers) {
                if (server === 'home') continue;
                
                if (ns.hasRootAccess(server)) {
                    alreadyRooted++;
                } else {
                    const success = tryNuke(ns, server);
                    if (success) {
                        ns.print(`SUCCESS: Gained root on ${server}`);
                        nuked++;
                    } else {
                        cannotNuke++;
                    }
                }
            }
            
            ns.print(`\nScan Results:`);
            ns.print(`Total servers found: ${servers.length - 1}`); // -1 for home
            ns.print(`Already rooted: ${alreadyRooted}`);
            ns.print(`Newly rooted: ${nuked}`);
            ns.print(`Cannot root yet: ${cannotNuke}`);
            ns.print(`\nNext scan in ${SCAN_INTERVAL / 1000}s...`);
            
            lastScanTime = now;
        }
        
        await ns.sleep(5000);
    }
}
