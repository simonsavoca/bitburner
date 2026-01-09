/** @param {NS} ns */
/**
 * Simple early-game hacking script
 * This is a self-contained script that can run on any server
 * Usage: run early-hack.js [target]
 */
export async function main(ns) {
    const target = ns.args[0] || 'n00dles';
    
    // Disable logs to reduce clutter
    ns.disableLog('getServerSecurityLevel');
    ns.disableLog('getServerMoneyAvailable');
    ns.disableLog('sleep');
    
    // Get thresholds
    const moneyThresh = ns.getServerMaxMoney(target) * 0.75;
    const securityThresh = ns.getServerMinSecurityLevel(target) + 5;
    
    ns.print(`Starting hack loop on ${target}`);
    ns.print(`Money threshold: $${moneyThresh.toFixed(0)}`);
    ns.print(`Security threshold: ${securityThresh.toFixed(2)}`);
    
    // Infinite loop
    while (true) {
        const currentSec = ns.getServerSecurityLevel(target);
        const currentMoney = ns.getServerMoneyAvailable(target);
        
        if (currentSec > securityThresh) {
            // Security too high, weaken
            await ns.weaken(target);
        } else if (currentMoney < moneyThresh) {
            // Money too low, grow
            await ns.grow(target);
        } else {
            // Hack the server
            await ns.hack(target);
        }
    }
}
