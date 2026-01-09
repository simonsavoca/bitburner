/** @param {NS} ns */
import { formatMoney, formatTime, formatRAM } from '/scripts/utils/format-utils.js';
import { getRootedServers, getHackableServers } from '/scripts/utils/server-utils.js';

/**
 * Dashboard script that displays overall game statistics
 * Shows income, servers, skills, and automation status
 */
export async function main(ns) {
    ns.disableLog('ALL');
    ns.ui.openTail();
    
    const UPDATE_INTERVAL = 5000; // Update every 5 seconds
    
    while (true) {
        ns.clearLog();
        
        // Header
        ns.print('╔════════════════════════════════════════════════════════════╗');
        ns.print('║             BITBURNER AUTOMATION DASHBOARD                 ║');
        ns.print('╚════════════════════════════════════════════════════════════╝\n');
        
        // Player Stats
        const player = ns.getPlayer();
        ns.print('═══ PLAYER STATS ═══');
        ns.print(`Hacking Level: ${player.skills.hacking}`);
        ns.print(`Money: ${formatMoney(player.money)}`);
        
        // Calculate income
        const scriptIncome = ns.getTotalScriptIncome()[0];
        ns.print(`Script Income: ${formatMoney(scriptIncome)}/sec`);
        
        // Hacknet income
        let hacknetIncome = 0;
        const numNodes = ns.hacknet.numNodes();
        for (let i = 0; i < numNodes; i++) {
            hacknetIncome += ns.hacknet.getNodeStats(i).production;
        }
        ns.print(`Hacknet Income: ${formatMoney(hacknetIncome)}/sec`);
        ns.print(`Total Income: ${formatMoney(scriptIncome + hacknetIncome)}/sec\n`);
        
        // Network Stats
        ns.print('═══ NETWORK ═══');
        const rootedServers = getRootedServers(ns);
        const hackableServers = getHackableServers(ns);
        ns.print(`Rooted Servers: ${rootedServers.length}`);
        ns.print(`Hackable Servers: ${hackableServers.length}`);
        
        // Calculate total RAM
        let totalRAM = 0;
        let usedRAM = 0;
        for (const server of rootedServers) {
            totalRAM += ns.getServerMaxRam(server);
            usedRAM += ns.getServerUsedRam(server);
        }
        const ramUtilization = totalRAM > 0 ? (usedRAM / totalRAM) * 100 : 0;
        ns.print(`Total RAM: ${formatRAM(totalRAM)}`);
        ns.print(`Used RAM: ${formatRAM(usedRAM)} (${ramUtilization.toFixed(1)}%)\n`);
        
        // Purchased Servers
        const purchasedServers = ns.getPurchasedServers();
        if (purchasedServers.length > 0) {
            ns.print('═══ PURCHASED SERVERS ═══');
            ns.print(`Count: ${purchasedServers.length} / ${ns.getPurchasedServerLimit()}`);
            let pServerRAM = 0;
            for (const server of purchasedServers) {
                pServerRAM += ns.getServerMaxRam(server);
            }
            ns.print(`Total RAM: ${formatRAM(pServerRAM)}\n`);
        }
        
        // Hacknet Stats
        if (numNodes > 0) {
            ns.print('═══ HACKNET ═══');
            ns.print(`Nodes: ${numNodes}`);
            ns.print(`Production: ${formatMoney(hacknetIncome)}/sec\n`);
        }
        
        // Running Scripts
        ns.print('═══ AUTOMATION STATUS ═══');
        const scripts = [
            { name: 'Scanner', path: '/scripts/core/scanner.js' },
            { name: 'Orchestrator', path: '/scripts/core/orchestrator.js' },
            { name: 'Hacknet Manager', path: '/scripts/core/hacknet-manager.js' },
            { name: 'Server Manager', path: '/scripts/core/server-manager.js' },
            { name: 'Program Manager', path: '/scripts/core/program-manager.js' },
        ];
        
        for (const script of scripts) {
            const running = ns.scriptRunning(script.path, 'home');
            const status = running ? '✓ Running' : '✗ Stopped';
            ns.print(`${script.name}: ${status}`);
        }
        
        // Experience gain
        ns.print('\n═══ EXPERIENCE ═══');
        const expGain = ns.getTotalScriptExpGain();
        ns.print(`Hacking XP: ${expGain.toFixed(2)}/sec`);
        
        // Time played
        const timeSinceAug = ns.getTimeSinceLastAug();
        ns.print(`Time since last aug: ${formatTime(timeSinceAug)}`);
        
        ns.print('\n════════════════════════════════════════════════════════════');
        ns.print(`Last updated: ${new Date().toLocaleTimeString()}`);
        
        await ns.sleep(UPDATE_INTERVAL);
    }
}
