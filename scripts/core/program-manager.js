/** @param {NS} ns */
import { formatMoney } from '/scripts/utils/format-utils.js';

/**
 * Automatically purchase programs from the dark web when available
 */
export async function main(ns) {
    ns.disableLog('ALL');
    ns.tail();
    
    // Programs in order of importance
    const PROGRAMS = [
        'BruteSSH.exe',
        'FTPCrack.exe',
        'relaySMTP.exe',
        'HTTPWorm.exe',
        'SQLInject.exe',
        'DeepscanV1.exe',
        'DeepscanV2.exe',
        'AutoLink.exe',
        'ServerProfiler.exe',
        'Formulas.exe'
    ];
    
    while (true) {
        ns.clearLog();
        ns.print('=== Program Manager ===\n');
        
        // Check if we have TOR router
        if (!ns.hasTorRouter()) {
            const cost = 200000; // TOR router costs 200k
            const currentMoney = ns.getServerMoneyAvailable('home');
            
            if (currentMoney >= cost) {
                ns.print('TOR router not found, attempting to purchase...');
                // Note: There's no direct API to buy TOR, player must do this manually
                ns.print('WARNING: Please purchase TOR router manually from City -> Alpha Ent');
            } else {
                ns.print(`Need ${formatMoney(cost)} to purchase TOR router`);
            }
            await ns.sleep(60000);
            continue;
        }
        
        ns.print('TOR router: Available\n');
        
        let allOwned = true;
        for (const program of PROGRAMS) {
            if (ns.fileExists(program, 'home')) {
                ns.print(`✓ ${program}`);
            } else {
                ns.print(`✗ ${program} - checking availability...`);
                allOwned = false;
                
                // Note: Bitburner doesn't have a direct API to purchase programs
                // This would need to be done through singularity functions
                // which require Source-File access
                
                // For now, just display what's needed
                ns.print(`  Action needed: Purchase ${program} from dark web`);
            }
        }
        
        if (allOwned) {
            ns.print('\n✓ All essential programs owned!');
        }
        
        await ns.sleep(60000); // Check every minute
    }
}
