/** @param {NS} ns */
/**
 * Interactive Network Browser
 * Uses AutoLink.exe (when available) to provide clickable server links
 * for easy network navigation and exploration
 * 
 * Usage: run network-browser.js [depth]
 */

export async function main(ns) {
    const args = ns.flags([['help', false]]);
    
    if (args.help) {
        ns.tprint('Network Browser - Interactive network visualization');
        ns.tprint('Usage: run network-browser.js [depth]');
        ns.tprint('');
        ns.tprint('Arguments:');
        ns.tprint('  depth - Maximum depth to scan (default: 3)');
        ns.tprint('');
        ns.tprint('Features:');
        ns.tprint('  - When AutoLink.exe is installed, server names are clickable');
        ns.tprint('  - Shows hacking requirements and server stats');
        ns.tprint('  - Highlights servers you can root');
        return;
    }
    
    const maxDepth = args._[0] || 3;
    const hasAutoLink = ns.fileExists('AutoLink.exe', 'home');
    
    ns.tprint('');
    ns.tprint('╔════════════════════════════════════════╗');
    ns.tprint('║        NETWORK BROWSER v1.0            ║');
    ns.tprint('╚════════════════════════════════════════╝');
    ns.tprint('');
    
    if (hasAutoLink) {
        ns.tprint('✓ AutoLink.exe detected - server names are clickable!');
        ns.tprint('  Click on any server name below to connect to it.');
        ns.tprint('');
        
        // Use scan-analyze which benefits from AutoLink.exe
        ns.tprint('Running scan-analyze for interactive navigation...');
        ns.tprint('');
        ns.run('/bin/scan-analyze.js', 1, maxDepth.toString());
        
    } else {
        ns.tprint('○ AutoLink.exe not found');
        ns.tprint('  Install AutoLink.exe from the dark web to enable clickable server links!');
        ns.tprint('  For now, showing manual network analysis...');
        ns.tprint('');
        
        // Fallback: Display network information manually
        displayNetworkInfo(ns, maxDepth);
    }
}

/**
 * Display network information without AutoLink.exe
 * @param {NS} ns
 * @param {number} maxDepth
 */
function displayNetworkInfo(ns, maxDepth) {
    const visited = new Set();
    const hackingLevel = ns.getHackingLevel();
    
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
                info += `, $${(maxMoney / 1e6).toFixed(1)}m`;
            }
            info += ')';
            
            if (!hasRoot && canHack) {
                info += ' [Can Root!]';
            } else if (!hasRoot && !canHack) {
                info += ' [Need Lvl ' + requiredLevel + ']';
            }
        }
        
        ns.tprint(`${indent}${status} ${info}`);
        
        // Scan connected servers
        const connections = ns.scan(server);
        const children = connections.filter(s => !visited.has(s));
        
        for (let i = 0; i < children.length; i++) {
            const isLast = i === children.length - 1;
            const newPrefix = indent + (isLast ? '  ' : '│ ');
            scanRecursive(children[i], depth + 1, newPrefix);
        }
    }
    
    scanRecursive('home');
    
    ns.tprint('');
    ns.tprint('═════════════════════════════════════════');
    ns.tprint('Tip: Install AutoLink.exe for clickable server navigation!');
    ns.tprint('Purchase it from the dark web for enhanced network browsing.');
    ns.tprint('═════════════════════════════════════════');
}
