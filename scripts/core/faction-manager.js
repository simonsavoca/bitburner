/** @param {NS} ns */
import { formatMoney } from '/scripts/utils/format-utils.js';

/**
 * Manages factions, reputation, and augmentation purchases
 * Automates joining factions, working for them, and buying augmentations
 * 
 * Note: Requires Source-File 4 access
 */

// Configuration constants
const NEUROFLUX_GOVERNOR = 'NeuroFlux Governor'; // Special augmentation
const INSTALL_WARNING_THRESHOLD = 5; // Warn when this many augs queued

// Early game factions (accessible without requirements)
const EARLY_FACTIONS = [
    'CyberSec',
    'Tian Di Hui',
    'Netburners'
];

// City factions
const CITY_FACTIONS = [
    'Sector-12',
    'Aevum',
    'Chongqing',
    'New Tokyo',
    'Ishima',
    'Volhaven'
];

export async function main(ns) {
    ns.disableLog('ALL');
    ns.tail();
    
    while (true) {
        ns.clearLog();
        ns.print('=== Faction Manager ===\n');
        
        const player = ns.getPlayer();
        const currentMoney = ns.getServerMoneyAvailable('home');
        
        // 1. Check for and join faction invitations
        await handleFactionInvitations(ns);
        
        ns.print('');
        
        // 2. Work for factions to gain reputation
        await handleFactionWork(ns);
        
        ns.print('');
        
        // 3. Purchase augmentations when we have enough rep and money
        await handleAugmentations(ns, currentMoney);
        
        await ns.sleep(60000); // Check every minute
    }
}

/**
 * Accept pending faction invitations
 */
async function handleFactionInvitations(ns) {
    ns.print('--- Faction Invitations ---');
    
    const invitations = ns.singularity.checkFactionInvitations();
    
    if (invitations.length === 0) {
        ns.print('No pending invitations');
        return;
    }
    
    for (const faction of invitations) {
        // Check if joining would conflict with other factions
        const enemies = ns.singularity.getFactionEnemies(faction);
        const player = ns.getPlayer();
        
        let hasEnemy = false;
        for (const enemy of enemies) {
            if (player.factions.includes(enemy)) {
                hasEnemy = true;
                break;
            }
        }
        
        if (!hasEnemy) {
            if (ns.singularity.joinFaction(faction)) {
                ns.print(`✓ Joined faction: ${faction}`);
            }
        } else {
            ns.print(`⏸ Skipping ${faction} (conflicts with existing faction)`);
        }
    }
}

/**
 * Work for factions to gain reputation
 */
async function handleFactionWork(ns) {
    ns.print('--- Faction Work ---');
    
    const player = ns.getPlayer();
    const currentWork = ns.singularity.getCurrentWork();
    
    // If already working, show status
    if (currentWork && currentWork.type === 'FACTION') {
        ns.print(`⏳ Working for: ${currentWork.factionName}`);
        const rep = ns.singularity.getFactionRep(currentWork.factionName);
        ns.print(`   Reputation: ${rep.toFixed(0)}`);
        return;
    }
    
    // Find best faction to work for
    if (player.factions.length === 0) {
        ns.print('Not in any factions yet');
        return;
    }
    
    // Work for the faction with the most available augmentations we don't have
    let bestFaction = null;
    let bestScore = 0;
    
    for (const faction of player.factions) {
        const augs = ns.singularity.getAugmentationsFromFaction(faction);
        const ownedAugs = ns.singularity.getOwnedAugmentations(true);
        
        const neededAugs = augs.filter(aug => !ownedAugs.includes(aug));
        const score = neededAugs.length;
        
        if (score > bestScore) {
            bestScore = score;
            bestFaction = faction;
        }
    }
    
    if (bestFaction) {
        // Try to work for this faction
        const workTypes = ns.singularity.getFactionWorkTypes(bestFaction);
        
        // Prefer hacking work if available
        const preferredOrder = ['hacking', 'field', 'security'];
        
        for (const workType of preferredOrder) {
            if (workTypes.includes(workType)) {
                if (ns.singularity.workForFaction(bestFaction, workType, false)) {
                    ns.print(`✓ Started working for ${bestFaction} (${workType})`);
                    break;
                }
            }
        }
    }
}

/**
 * Purchase augmentations when possible
 */
async function handleAugmentations(ns, currentMoney) {
    ns.print('--- Augmentations ---');
    
    const player = ns.getPlayer();
    const ownedAugs = ns.singularity.getOwnedAugmentations(true);
    
    ns.print(`Owned/queued: ${ownedAugs.length}`);
    
    if (player.factions.length === 0) {
        return;
    }
    
    // Collect all available augmentations from all factions
    const availableAugs = [];
    
    for (const faction of player.factions) {
        const factionAugs = ns.singularity.getAugmentationsFromFaction(faction);
        
        for (const aug of factionAugs) {
            if (!ownedAugs.includes(aug) && aug !== NEUROFLUX_GOVERNOR) {
                const repReq = ns.singularity.getAugmentationRepReq(aug);
                const price = ns.singularity.getAugmentationPrice(aug);
                const currentRep = ns.singularity.getFactionRep(faction);
                
                if (currentRep >= repReq && currentMoney >= price) {
                    availableAugs.push({
                        name: aug,
                        faction: faction,
                        price: price,
                        repReq: repReq
                    });
                }
            }
        }
    }
    
    // Sort by price (buy expensive ones first to minimize cost increase)
    availableAugs.sort((a, b) => b.price - a.price);
    
    if (availableAugs.length > 0) {
        ns.print(`\n${availableAugs.length} augmentations available to purchase:`);
        
        for (const aug of availableAugs.slice(0, 5)) { // Show top 5
            ns.print(`  ${aug.name} - ${formatMoney(aug.price)}`);
        }
        
        // Purchase the most expensive one we can afford
        const toBuy = availableAugs[0];
        if (ns.singularity.purchaseAugmentation(toBuy.faction, toBuy.name)) {
            ns.print(`\n✓ Purchased ${toBuy.name} from ${toBuy.faction} for ${formatMoney(toBuy.price)}`);
        }
    } else {
        ns.print('No augmentations available to purchase yet');
    }
    
    // Check if we should install augmentations
    const queuedAugs = ns.singularity.getOwnedAugmentations(true)
        .filter(aug => !ns.singularity.getOwnedAugmentations(false).includes(aug));
    
    if (queuedAugs.length >= INSTALL_WARNING_THRESHOLD) {
        ns.print(`\n⚠ ${queuedAugs.length} augmentations queued - consider installing!`);
        ns.print('Run: ns.singularity.installAugmentations() when ready');
    }
}
