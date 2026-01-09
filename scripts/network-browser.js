/**
 * Interactive Network Browser
 * Complements AutoLink.exe by providing detailed server information
 * and guiding users to use scan-analyze for clickable navigation
 * 
 * Usage: run network-browser.js [depth]
 * 
 * @param {NS} ns
 */

import { hasAutoLink } from '/scripts/utils/server-utils.js';

export async function main(ns) {
    const args = ns.flags([['help', false]]);
    
    if (args.help) {
        ns.tprint('Network Browser - Detailed network visualization');
        ns.tprint('Usage: run network-browser.js [depth]');
        ns.tprint('');
        ns.tprint('Arguments:');
        ns.tprint('  depth - Maximum depth to scan (default: 3)');
        ns.tprint('');
        ns.tprint('Features:');
        ns.tprint('  - Shows hacking requirements and server stats');
        ns.tprint('  - Highlights servers you can root');
        ns.tprint('  - Guides you to use AutoLink.exe when available');
        return;
    }
    
    const maxDepth = args._[0] || 3;
    const autoLinkAvailable = hasAutoLink(ns);
    
    ns.tprint('');
    ns.tprint('╔════════════════════════════════════════╗');
    ns.tprint('║        NETWORK BROWSER v1.0            ║');
    ns.tprint('╚════════════════════════════════════════╝');
    ns.tprint('');
    
    if (autoLinkAvailable) {
        ns.tprint('✓ AutoLink.exe is installed!');
        ns.tprint('');
        ns.tprint('TIP: For clickable server navigation, use the terminal command:');
        ns.tprint(`     scan-analyze ${maxDepth}`);
        ns.tprint('');
        ns.tprint('     Then click any server name to automatically connect to it!');
        ns.tprint('');
        ns.tprint('═════════════════════════════════════════');
        ns.tprint('');
    } else {
        ns.tprint('○ AutoLink.exe not installed');
        ns.tprint('');
        ns.tprint('TIP: Purchase AutoLink.exe from the dark web to enable');
        ns.tprint('     clickable server links in scan-analyze output!');
        ns.tprint('');
        ns.tprint('═════════════════════════════════════════');
        ns.tprint('');
    }
    
    ns.tprint('Detailed Network Analysis:');
    ns.tprint('');
    
    // Display detailed network information
    displayNetworkInfo(ns, maxDepth, autoLinkAvailable);
}

/**
 * Display detailed network information
 * @param {NS} ns
 * @param {number} maxDepth
 * @param {boolean} autoLinkAvailable
 */
function displayNetworkInfo(ns, maxDepth, autoLinkAvailable) {
    const visited = new Set();
    const hackingLevel = ns.getHackingLevel();
    
    // Tree drawing constants
    const TREE_BRANCH = '│ ';
    const TREE_LAST = '  ';
    const MILLION = 1e6;
    
    function scanRecursive(server, depth = 0, prefix = '') {
        if (depth > maxDepth || visited.has(server)) return;
        visited.add(server);
        
        const indent = prefix;
        const hasRoot = ns.hasRootAccess(server);
        const requiredLevel = ns.getServerRequiredHackingLevel(server);
        const canHack = requiredLevel <= hackingLevel;
        const maxMoney = ns.getServerMaxMoney(server);
        const portsNeeded = ns.getServerNumPortsRequired(server);
        
        // Build status indicator
        let status = hasRoot ? '✓' : '✗';
        let info = `${server}`;
        
        if (server !== 'home') {
            info += ` (Lvl:${requiredLevel}, Ports:${portsNeeded}`;
            if (maxMoney > 0) {
                info += `, $${(maxMoney / MILLION).toFixed(1)}m`;
            }
            info += ')';
            
            if (!hasRoot && canHack) {
                info += ' [Can Root!]';
            } else if (!hasRoot && !canHack) {
                info += ` [Need Lvl ${requiredLevel}]`;
            }
        }
        
        ns.tprint(`${indent}${status} ${info}`);
        
        // Scan connected servers
        const connections = ns.scan(server);
        const children = connections.filter(s => !visited.has(s));
        
        children.forEach((child, index) => {
            const isLast = index === children.length - 1;
            const newPrefix = indent + (isLast ? TREE_LAST : TREE_BRANCH);
            scanRecursive(child, depth + 1, newPrefix);
        });
    }
    
    scanRecursive('home');
    
    ns.tprint('');
    ns.tprint('═════════════════════════════════════════');
    if (autoLinkAvailable) {
        ns.tprint(`Remember: Use "scan-analyze ${maxDepth}" for clickable navigation!`);
    } else {
        ns.tprint('Tip: Install AutoLink.exe for clickable server navigation!');
    }
    ns.tprint('═════════════════════════════════════════');
}
