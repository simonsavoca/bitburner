/** @param {NS} ns */
import { formatMoney, formatRAM } from '/scripts/utils/format-utils.js';

/**
 * Master Progression Orchestrator
 * Coordinates all automation scripts and manages game progression
 * Decides when to focus on different activities based on game state
 */

// Configuration constants
const EARLY_GAME_COMBAT_THRESHOLD = 10; // Min strength for effective crime
const AUTO_INSTALL_THRESHOLD = 10; // Auto-install when this many augs queued

// Crime choices for early game
const EARLY_CRIMES = {
    HIGH_COMBAT: 'Homicide',  // Best money with combat stats
    LOW_COMBAT: 'Mug'         // Safer choice for low stats
};

export async function main(ns) {
    ns.disableLog('ALL');
    ns.tail();
    
    ns.print('╔════════════════════════════════════════╗');
    ns.print('║  PROGRESSION ORCHESTRATOR v2.0         ║');
    ns.print('║  Full Automation Mode                  ║');
    ns.print('╚════════════════════════════════════════╝\n');
    
    while (true) {
        ns.clearLog();
        ns.print('=== Progression Orchestrator ===\n');
        
        const player = ns.getPlayer();
        const currentMoney = ns.getServerMoneyAvailable('home');
        
        // Display current state
        ns.print('--- Player Stats ---');
        ns.print(`Hacking: ${player.skills.hacking}`);
        ns.print(`Money: ${formatMoney(currentMoney)}`);
        ns.print(`Karma: ${ns.heart.break()}`);
        
        const currentWork = ns.singularity.getCurrentWork();
        if (currentWork) {
            ns.print(`Current Activity: ${currentWork.type}`);
        }
        ns.print('');
        
        // Determine game phase and priorities
        const phase = determineGamePhase(ns, player, currentMoney);
        ns.print(`--- Game Phase: ${phase} ---\n`);
        
        // Manage activities based on phase
        await manageActivities(ns, phase, player, currentMoney);
        
        await ns.sleep(60000); // Check every minute
    }
}

/**
 * Determine what phase of the game we're in
 */
function determineGamePhase(ns, player, money) {
    const ownedAugs = ns.singularity.getOwnedAugmentations(false);
    const queuedAugs = ns.singularity.getOwnedAugmentations(true);
    
    // Phase 1: Very early game (< $1m, low hacking)
    if (money < 1000000 && player.skills.hacking < 50) {
        return 'EARLY_GAME';
    }
    
    // Phase 2: Early-Mid game (building up, getting programs)
    if (money < 10000000 && player.skills.hacking < 200) {
        return 'EARLY_MID_GAME';
    }
    
    // Phase 3: Mid game (getting factions, first augs)
    if (ownedAugs.length < 5 && player.skills.hacking < 500) {
        return 'MID_GAME';
    }
    
    // Phase 4: Late game (many augs, preparing for next reset)
    if (queuedAugs.length - ownedAugs.length >= 5) {
        return 'READY_TO_INSTALL';
    }
    
    // Phase 5: Endgame (high stats, working towards w0r1d_d43m0n)
    if (player.skills.hacking >= 2500) {
        return 'END_GAME';
    }
    
    return 'LATE_GAME';
}

/**
 * Manage activities based on current game phase
 */
async function manageActivities(ns, phase, player, money) {
    const currentWork = ns.singularity.getCurrentWork();
    
    switch (phase) {
        case 'EARLY_GAME':
            ns.print('Priority: Build hacking skill and money');
            ns.print('Actions:');
            ns.print('  - Crime for stats and money');
            ns.print('  - Simple hacking scripts');
            ns.print('  - Get first programs (BruteSSH)');
            
            // If not busy, do crime for money/stats
            if (!currentWork || currentWork.type !== 'CRIME') {
                // Choose crime based on combat stats
                const crimeChoice = (player.skills.strength >= EARLY_GAME_COMBAT_THRESHOLD) 
                    ? EARLY_CRIMES.HIGH_COMBAT 
                    : EARLY_CRIMES.LOW_COMBAT;
                ns.singularity.commitCrime(crimeChoice, false);
            }
            break;
            
        case 'EARLY_MID_GAME':
            ns.print('Priority: Get programs, expand network access');
            ns.print('Actions:');
            ns.print('  - Create/buy port opener programs');
            ns.print('  - Expand server network');
            ns.print('  - Build hacking stats');
            
            // Let singularity-manager and stat-manager handle this
            break;
            
        case 'MID_GAME':
            ns.print('Priority: Join factions, gain reputation');
            ns.print('Actions:');
            ns.print('  - Install backdoors on faction servers');
            ns.print('  - Join factions when invited');
            ns.print('  - Work for factions');
            ns.print('  - Buy augmentations');
            
            // Let faction-manager handle this
            break;
            
        case 'LATE_GAME':
            ns.print('Priority: Maximize augmentations');
            ns.print('Actions:');
            ns.print('  - Work for high-tier factions');
            ns.print('  - Purchase expensive augmentations');
            ns.print('  - Maximize money/rep before reset');
            
            // Let faction-manager handle this
            break;
            
        case 'READY_TO_INSTALL':
            ns.print('Priority: Install augmentations and reset');
            ns.print('Actions:');
            ns.print('  - Final money grinding');
            ns.print('  - Buy remaining affordable augs');
            ns.print('  - READY TO INSTALL AUGMENTATIONS');
            ns.print('');
            ns.print('⚠ WARNING: Ready to reset! ⚠');
            ns.print('Consider running:');
            ns.print('  ns.singularity.installAugmentations()');
            
            // Auto-install if we have enough augs queued
            const queuedCount = ns.singularity.getOwnedAugmentations(true).length - 
                               ns.singularity.getOwnedAugmentations(false).length;
            
            if (queuedCount >= AUTO_INSTALL_THRESHOLD) {
                ns.print('\n🔄 Auto-installing augmentations...');
                await ns.sleep(5000); // Give player time to see message
                ns.singularity.installAugmentations('/scripts/bootstrap.js');
            }
            break;
            
        case 'END_GAME':
            ns.print('Priority: Complete the game');
            ns.print('Actions:');
            ns.print('  - Hack w0r1d_d43m0n (requires hack 3000)');
            ns.print('  - Install backdoor on w0r1d_d43m0n');
            ns.print('  - Destroy w0r1d_d43m0n to win!');
            
            // Check if we can hack w0r1d_d43m0n
            if (player.skills.hacking >= 3000) {
                ns.print('\n✓ Ready to hack w0r1d_d43m0n!');
                ns.print('Attempting to install backdoor...');
                
                // Try to connect and backdoor
                const servers = ['run4theh111z', 'w0r1d_d43m0n'];
                for (const server of servers) {
                    ns.singularity.connect(server);
                }
                
                // Check if we can install backdoor
                try {
                    await ns.singularity.installBackdoor();
                    ns.print('✓ Backdoor installed on w0r1d_d43m0n!');
                } catch (e) {
                    ns.print('✗ Could not install backdoor yet');
                }
                
                ns.singularity.connect('home');
            }
            break;
    }
}
