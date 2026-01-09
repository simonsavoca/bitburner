/** @param {NS} ns */
/**
 * Manages stat training through university, gym, and crime
 * Trains stats to meet faction requirements and improve performance
 * 
 * Note: Requires Source-File 4 access
 */

// Configuration constants
const STAT_THRESHOLDS = {
    hacking: 100,      // Target hacking level for early game
    strength: 50,      // Combat stats for faction requirements
    defense: 50,
    dexterity: 50,
    agility: 50,
    charisma: 50       // For company/faction work
};

const EARLY_GAME_MONEY_THRESHOLD = 100000; // Use crime if below this amount

export async function main(ns) {
    ns.disableLog('ALL');
    ns.tail();
    
    while (true) {
        ns.clearLog();
        ns.print('=== Stat Training Manager ===\n');
        
        const player = ns.getPlayer();
        const currentWork = ns.singularity.getCurrentWork();
        
        // Check current stats
        ns.print('--- Current Stats ---');
        ns.print(`Hacking:   ${player.skills.hacking}`);
        ns.print(`Strength:  ${player.skills.strength}`);
        ns.print(`Defense:   ${player.skills.defense}`);
        ns.print(`Dexterity: ${player.skills.dexterity}`);
        ns.print(`Agility:   ${player.skills.agility}`);
        ns.print(`Charisma:  ${player.skills.charisma}\n`);
        
        // If already training, show status
        if (currentWork) {
            if (currentWork.type === 'CLASS') {
                ns.print(`⏳ Currently training: ${currentWork.classType}`);
            } else if (currentWork.type === 'CRIME') {
                ns.print(`⏳ Currently doing crime: ${currentWork.crimeType}`);
            } else {
                ns.print(`⏳ Currently busy with: ${currentWork.type}`);
            }
        } else {
            // Determine what stat to train
            const statToTrain = determineStatToTrain(ns, player, STAT_THRESHOLDS);
            
            if (statToTrain) {
                ns.print(`Target stat: ${statToTrain}`);
                
                // Early game: use crime for free training
                if (player.money < EARLY_GAME_MONEY_THRESHOLD) {
                    startCrimeTraining(ns, statToTrain);
                } else {
                    // Later: use university/gym (faster)
                    startFacilityTraining(ns, statToTrain, player.city);
                }
            } else {
                ns.print('All target stats reached!');
                ns.print('Consider increasing thresholds in config.');
            }
        }
        
        await ns.sleep(60000); // Check every minute
    }
}

/**
 * Determine which stat needs training most
 */
function determineStatToTrain(ns, player, thresholds) {
    const stats = {
        hacking: player.skills.hacking,
        strength: player.skills.strength,
        defense: player.skills.defense,
        dexterity: player.skills.dexterity,
        agility: player.skills.agility,
        charisma: player.skills.charisma
    };
    
    // Find stat furthest below threshold
    let lowestRatio = 1.0;
    let targetStat = null;
    
    for (const [stat, current] of Object.entries(stats)) {
        const threshold = thresholds[stat] || 0;
        if (threshold > 0 && current < threshold) {
            const ratio = current / threshold;
            if (ratio < lowestRatio) {
                lowestRatio = ratio;
                targetStat = stat;
            }
        }
    }
    
    return targetStat;
}

/**
 * Start crime-based training (free but slower)
 */
function startCrimeTraining(ns, stat) {
    // Map stats to best crimes
    const crimeMap = {
        hacking: 'Shoplift',      // Some hacking exp
        strength: 'Mug',          // Strength + combat
        defense: 'Mug',           // Defense + combat
        dexterity: 'Rob Store',   // Dex + combat
        agility: 'Larceny',       // Agility
        charisma: 'Shoplift'      // Charisma
    };
    
    const crime = crimeMap[stat] || 'Shoplift';
    
    if (ns.singularity.commitCrime(crime, false)) {
        ns.print(`✓ Started crime: ${crime} (training ${stat})`);
    } else {
        ns.print(`✗ Failed to start crime: ${crime}`);
    }
}

/**
 * Start university or gym training (costs money but faster)
 */
function startFacilityTraining(ns, stat, city) {
    // Universities in each city
    const universities = {
        'Aevum': 'Summit University',
        'Sector-12': 'Rothman University',
        'Volhaven': 'ZB Institute of Technology'
    };
    
    // Gyms in each city
    const gyms = {
        'Aevum': 'Snap Fitness Gym',
        'Sector-12': 'Powerhouse Gym',
        'Volhaven': 'Millenium Fitness Gym'
    };
    
    if (stat === 'hacking') {
        // Take computer science course at university
        const university = universities[city] || 'Rothman University';
        
        if (ns.singularity.universityCourse(university, 'Algorithms', false)) {
            ns.print(`✓ Started studying at ${university}`);
        } else {
            // Fallback to crime if can't attend university
            startCrimeTraining(ns, stat);
        }
    } else if (stat === 'charisma') {
        // Take leadership course
        const university = universities[city] || 'Rothman University';
        
        if (ns.singularity.universityCourse(university, 'Leadership', false)) {
            ns.print(`✓ Started studying leadership at ${university}`);
        } else {
            startCrimeTraining(ns, stat);
        }
    } else {
        // Train combat stat at gym
        const gym = gyms[city] || 'Powerhouse Gym';
        const statMap = {
            'strength': 'str',
            'defense': 'def',
            'dexterity': 'dex',
            'agility': 'agi'
        };
        
        const gymStat = statMap[stat];
        
        if (ns.singularity.gymWorkout(gym, gymStat, false)) {
            ns.print(`✓ Started training ${stat} at ${gym}`);
        } else {
            startCrimeTraining(ns, stat);
        }
    }
}
