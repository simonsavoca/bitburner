/** @param {NS} ns */
import { formatMoney } from '/scripts/utils/format-utils.js';

/**
 * Automatically manage Hacknet nodes for passive income
 */
export async function main(ns) {
    ns.disableLog('ALL');
    ns.tail();
    
    const MAX_NODES = 8; // Maximum nodes to maintain initially
    const UPGRADE_THRESHOLD = 0.1; // Upgrade when cost is less than 10% of current money
    
    while (true) {
        ns.clearLog();
        ns.print('=== Hacknet Manager ===\n');
        
        const currentMoney = ns.getServerMoneyAvailable('home');
        const numNodes = ns.hacknet.numNodes();
        
        ns.print(`Current nodes: ${numNodes}`);
        ns.print(`Available money: ${formatMoney(currentMoney)}\n`);
        
        // Try to buy new nodes if under max
        if (numNodes < MAX_NODES) {
            const cost = ns.hacknet.getPurchaseNodeCost();
            if (cost < currentMoney * UPGRADE_THRESHOLD) {
                const index = ns.hacknet.purchaseNode();
                if (index !== -1) {
                    ns.print(`SUCCESS: Purchased node ${index} for ${formatMoney(cost)}`);
                }
            } else {
                ns.print(`Next node costs ${formatMoney(cost)} (waiting...)`);
            }
        }
        
        // Upgrade existing nodes
        let upgraded = false;
        for (let i = 0; i < numNodes; i++) {
            const node = ns.hacknet.getNodeStats(i);
            
            // Try to upgrade level
            const levelCost = ns.hacknet.getLevelUpgradeCost(i, 1);
            if (levelCost < currentMoney * UPGRADE_THRESHOLD && node.level < 200) {
                if (ns.hacknet.upgradeLevel(i, 1)) {
                    ns.print(`Upgraded node ${i} level to ${node.level + 1}`);
                    upgraded = true;
                }
            }
            
            // Try to upgrade RAM
            const ramCost = ns.hacknet.getRamUpgradeCost(i, 1);
            if (ramCost < currentMoney * UPGRADE_THRESHOLD && node.ram < 64) {
                if (ns.hacknet.upgradeRam(i, 1)) {
                    ns.print(`Upgraded node ${i} RAM to ${node.ram * 2}`);
                    upgraded = true;
                }
            }
            
            // Try to upgrade cores
            const coreCost = ns.hacknet.getCoreUpgradeCost(i, 1);
            if (coreCost < currentMoney * UPGRADE_THRESHOLD && node.cores < 16) {
                if (ns.hacknet.upgradeCore(i, 1)) {
                    ns.print(`Upgraded node ${i} cores to ${node.cores + 1}`);
                    upgraded = true;
                }
            }
        }
        
        if (!upgraded && numNodes >= MAX_NODES) {
            ns.print('All nodes at target levels');
        }
        
        // Calculate total production
        let totalProduction = 0;
        for (let i = 0; i < numNodes; i++) {
            totalProduction += ns.hacknet.getNodeStats(i).production;
        }
        ns.print(`\nTotal production: ${formatMoney(totalProduction)}/sec`);
        
        await ns.sleep(10000); // Check every 10 seconds
    }
}
