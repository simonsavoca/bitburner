/** @param {NS} ns */
/**
 * Utility functions for server management and operations
 */

/**
 * Check if AutoLink.exe is available
 * AutoLink.exe enables clickable server links in scan-analyze output
 * @param {NS} ns
 * @returns {boolean} True if AutoLink.exe is installed
 */
export function hasAutoLink(ns) {
    return ns.fileExists('AutoLink.exe', 'home');
}

/**
 * Recursively scan the network and return all servers
 * @param {NS} ns
 * @param {string} currentServer - Server to scan from
 * @param {Set<string>} visited - Set of already visited servers
 * @returns {string[]} Array of all server hostnames
 */
export function scanNetwork(ns, currentServer = 'home', visited = new Set()) {
    visited.add(currentServer);
    const neighbors = ns.scan(currentServer);
    
    for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
            scanNetwork(ns, neighbor, visited);
        }
    }
    
    return Array.from(visited);
}

/**
 * Get all servers that can be hacked with current skill
 * @param {NS} ns
 * @returns {string[]} Array of hackable server hostnames
 */
export function getHackableServers(ns) {
    const servers = scanNetwork(ns);
    const hackingLevel = ns.getHackingLevel();
    
    return servers.filter(server => {
        const requiredLevel = ns.getServerRequiredHackingLevel(server);
        const hasRoot = ns.hasRootAccess(server);
        const maxMoney = ns.getServerMaxMoney(server);
        
        return server !== 'home' && 
               requiredLevel <= hackingLevel && 
               hasRoot && 
               maxMoney > 0;
    });
}

/**
 * Get all servers where we can run scripts (have root access)
 * @param {NS} ns
 * @returns {string[]} Array of server hostnames with root access
 */
export function getRootedServers(ns) {
    const servers = scanNetwork(ns);
    return servers.filter(server => ns.hasRootAccess(server));
}

/**
 * Try to gain root access on a server
 * @param {NS} ns
 * @param {string} server - Server hostname
 * @returns {boolean} True if root access obtained
 */
export function tryNuke(ns, server) {
    if (ns.hasRootAccess(server)) {
        return true;
    }
    
    const portsRequired = ns.getServerNumPortsRequired(server);
    let portsOpened = 0;
    
    // Try to open ports
    if (ns.fileExists('BruteSSH.exe', 'home')) {
        ns.brutessh(server);
        portsOpened++;
    }
    if (ns.fileExists('FTPCrack.exe', 'home')) {
        ns.ftpcrack(server);
        portsOpened++;
    }
    if (ns.fileExists('relaySMTP.exe', 'home')) {
        ns.relaysmtp(server);
        portsOpened++;
    }
    if (ns.fileExists('HTTPWorm.exe', 'home')) {
        ns.httpworm(server);
        portsOpened++;
    }
    if (ns.fileExists('SQLInject.exe', 'home')) {
        ns.sqlinject(server);
        portsOpened++;
    }
    
    // Try to nuke if we have enough ports
    if (portsOpened >= portsRequired) {
        try {
            ns.nuke(server);
            return true;
        } catch (e) {
            return false;
        }
    }
    
    return false;
}

/**
 * Get the best target server to hack based on profitability
 * @param {NS} ns
 * @returns {string} Hostname of best target server
 */
export function getBestTarget(ns) {
    const servers = getHackableServers(ns);
    
    if (servers.length === 0) {
        return 'n00dles'; // Fallback to n00dles
    }
    
    let bestServer = servers[0];
    let bestValue = 0;
    
    for (const server of servers) {
        const maxMoney = ns.getServerMaxMoney(server);
        const minSec = ns.getServerMinSecurityLevel(server);
        const hackTime = ns.getHackTime(server);
        const hackChance = ns.hackAnalyzeChance(server);
        
        // Calculate value: money per second weighted by chance
        const value = (maxMoney / hackTime) * hackChance / (minSec + 1);
        
        if (value > bestValue) {
            bestValue = value;
            bestServer = server;
        }
    }
    
    return bestServer;
}

/**
 * Get total available RAM across all rooted servers
 * @param {NS} ns
 * @returns {number} Total available RAM in GB
 */
export function getTotalAvailableRAM(ns) {
    const servers = getRootedServers(ns);
    let totalRAM = 0;
    
    for (const server of servers) {
        const maxRAM = ns.getServerMaxRam(server);
        const usedRAM = ns.getServerUsedRam(server);
        totalRAM += (maxRAM - usedRAM);
    }
    
    return totalRAM;
}

/**
 * Copy a file to all rooted servers
 * @param {NS} ns
 * @param {string} file - File to copy
 */
export async function distributeFile(ns, file) {
    const servers = getRootedServers(ns);
    
    for (const server of servers) {
        if (server !== 'home') {
            await ns.scp(file, server, 'home');
        }
    }
}
