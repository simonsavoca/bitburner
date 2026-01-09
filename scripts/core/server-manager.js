/** @param {NS} ns */
import { formatMoney, formatRAM } from '/scripts/utils/format-utils.js';

/**
 * Automatically purchase and upgrade servers for more computing power
 */
export async function main(ns) {
    ns.disableLog('ALL');
    ns.ui.openTail();
    
    const SERVER_PREFIX = 'pserv-';
    const MIN_RAM = 8; // Start with 8GB servers
    const PURCHASE_THRESHOLD = 0.5; // Purchase when we have 50% of the cost
    
    while (true) {
        ns.clearLog();
        ns.print('=== Server Manager ===\n');
        
        const currentMoney = ns.getServerMoneyAvailable('home');
        const maxServers = ns.getPurchasedServerLimit();
        const currentServers = ns.getPurchasedServers();
        const maxRam = ns.getPurchasedServerMaxRam();
        
        ns.print(`Servers: ${currentServers.length} / ${maxServers}`);
        ns.print(`Available money: ${formatMoney(currentMoney)}\n`);
        
        // Determine target RAM (start small, double as we get richer)
        let targetRAM = MIN_RAM;
        while (targetRAM < maxRam && currentMoney > ns.getPurchasedServerCost(targetRAM * 2) * 2) {
            targetRAM *= 2;
        }
        
        ns.print(`Target RAM: ${formatRAM(targetRAM)}`);
        
        // Purchase new servers if we're under the limit
        if (currentServers.length < maxServers) {
            const cost = ns.getPurchasedServerCost(targetRAM);
            
            if (currentMoney >= cost / PURCHASE_THRESHOLD) {
                const hostname = `${SERVER_PREFIX}${currentServers.length}`;
                const server = ns.purchaseServer(hostname, targetRAM);
                
                if (server !== '') {
                    ns.print(`SUCCESS: Purchased ${server} with ${formatRAM(targetRAM)} for ${formatMoney(cost)}`);
                }
            } else {
                ns.print(`Need ${formatMoney(cost)} to purchase next server`);
            }
        } else {
            ns.print('At max server count\n');
            
            // Try to upgrade existing servers
            let upgraded = false;
            for (const server of currentServers) {
                const currentRAM = ns.getServerMaxRam(server);
                const nextRAM = currentRAM * 2;
                
                if (nextRAM <= maxRam && nextRAM <= targetRAM) {
                    const upgradeCost = ns.getPurchasedServerUpgradeCost(server, nextRAM);
                    
                    if (upgradeCost > 0 && currentMoney >= upgradeCost / PURCHASE_THRESHOLD) {
                        if (ns.upgradePurchasedServer(server, nextRAM)) {
                            ns.print(`SUCCESS: Upgraded ${server} to ${formatRAM(nextRAM)}`);
                            upgraded = true;
                            break; // Upgrade one at a time
                        }
                    }
                }
            }
            
            if (!upgraded) {
                // Check if we should delete old servers and buy new ones with more RAM
                const minServerRAM = Math.min(...currentServers.map(s => ns.getServerMaxRam(s)));
                
                if (minServerRAM < targetRAM) {
                    const cost = ns.getPurchasedServerCost(targetRAM);
                    
                    if (currentMoney >= cost / PURCHASE_THRESHOLD) {
                        // Find the smallest server
                        const smallestServer = currentServers.find(s => ns.getServerMaxRam(s) === minServerRAM);
                        
                        if (smallestServer) {
                            ns.killall(smallestServer);
                            ns.deleteServer(smallestServer);
                            
                            const newServer = ns.purchaseServer(smallestServer, targetRAM);
                            if (newServer !== '') {
                                ns.print(`SUCCESS: Replaced ${smallestServer} with ${formatRAM(targetRAM)} server`);
                            }
                        }
                    }
                } else {
                    ns.print('All servers at target RAM');
                }
            }
        }
        
        // Display current servers
        ns.print('\nCurrent Servers:');
        let totalRAM = 0;
        for (const server of currentServers) {
            const ram = ns.getServerMaxRam(server);
            totalRAM += ram;
            ns.print(`  ${server}: ${formatRAM(ram)}`);
        }
        ns.print(`\nTotal purchased RAM: ${formatRAM(totalRAM)}`);
        
        await ns.sleep(30000); // Check every 30 seconds
    }
}
