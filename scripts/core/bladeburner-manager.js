/** @param {NS} ns */
import { formatMoney } from '/scripts/utils/format-utils.js';

/**
 * Automatically manages Bladeburner operations for optimal progression
 * Handles division joining, skill upgrades, and action automation
 * 
 * Note: Requires access to Bladeburner (BitNode-7 or Source-File 7)
 */

// Configuration constants
const STAMINA_THRESHOLD = 0.5; // Start recovery when stamina drops below 50%
const SUCCESS_CHANCE_THRESHOLD = 0.75; // Minimum 75% success chance for operations
const CONTRACT_SUCCESS_THRESHOLD = 0.6; // Minimum 60% success chance for contracts
const MIN_CHAOS_FOR_CONTRACTS = 50; // Don't do contracts if chaos is too high

// Skill upgrade priorities
const SKILL_PRIORITIES = [
    'Blade\'s Intuition', // Increases success chance
    'Cloak', // Increases success chance
    'Overclock', // Increases stamina gain from recovery
    'Reaper', // Increases money and exp gain
    'Evasive System', // Increases dexterity and agility
    'Tracer', // Increases contract count detection
    'Digital Observer', // Increases success chance
    'Short-Circuit', // Increases intelligence gain
    'Datamancer', // Increases hacking and intelligence exp
    'Cyber\'s Edge', // Increases hacking level for Bladeburner
    'Hands of Midas', // Increases money gain
    'Hyperdrive' // Increases exp gain
];

// Action types in priority order
const ACTION_TYPES = {
    CONTRACTS: 'Contracts',
    OPERATIONS: 'Operations',
    BLACK_OPS: 'BlackOps',
    GENERAL: 'General actions'
};

export async function main(ns) {
    ns.disableLog('ALL');
    ns.ui.openTail();
    
    while (true) {
        ns.clearLog();
        ns.print('=== Bladeburner Manager ===\n');
        
        // 1. Check if we're in Bladeburner
        if (!ns.bladeburner.inBladeburner()) {
            ns.print('Not in Bladeburner division');
            ns.print('Attempting to join...');
            
            if (ns.bladeburner.joinBladeburnerDivision()) {
                ns.print('✓ SUCCESS: Joined Bladeburner division!');
            } else {
                ns.print('✗ Cannot join Bladeburner yet');
                ns.print('Requirements: 100+ combat stats or special conditions');
            }
            await ns.sleep(60000); // Check every minute if not in Bladeburner
            continue;
        }
        
        ns.print('✓ Member of Bladeburner division\n');
        
        // 2. Display current stats
        const rank = ns.bladeburner.getRank();
        const [currentStamina, maxStamina] = ns.bladeburner.getStamina();
        const skillPoints = ns.bladeburner.getSkillPoints();
        const currentCity = ns.bladeburner.getCity();
        const chaos = ns.bladeburner.getCityChaos(currentCity);
        
        ns.print(`Rank: ${Math.floor(rank)}`);
        ns.print(`Stamina: ${Math.floor(currentStamina)}/${Math.floor(maxStamina)} (${(currentStamina/maxStamina*100).toFixed(1)}%)`);
        ns.print(`Skill Points: ${skillPoints}`);
        ns.print(`City: ${currentCity}`);
        ns.print(`Chaos: ${chaos.toFixed(2)}\n`);
        
        // 3. Upgrade skills if we have points
        if (skillPoints > 0) {
            await upgradeSkills(ns, skillPoints);
            ns.print('');
        }
        
        // 4. Check current action
        const currentAction = ns.bladeburner.getCurrentAction();
        if (currentAction && currentAction.type !== 'Idle') {
            ns.print(`⏳ Current Action: ${currentAction.type} - ${currentAction.name}`);
            
            // Check if we should stop current action
            if (currentAction.type === 'General' && currentAction.name === 'Hyperbolic Regeneration Chamber') {
                // Stop recovery when stamina is full
                if (currentStamina >= maxStamina * 0.95) {
                    ns.bladeburner.stopBladeburnerAction();
                    ns.print('✓ Stamina recovered, stopping regeneration');
                }
            }
        } else {
            // 5. Select and start next action
            const staminaPercent = currentStamina / maxStamina;
            
            if (staminaPercent < STAMINA_THRESHOLD) {
                ns.print('⚠ Low stamina, starting recovery...');
                if (ns.bladeburner.startAction('General', 'Hyperbolic Regeneration Chamber')) {
                    ns.print('✓ Started Hyperbolic Regeneration Chamber');
                }
            } else {
                await selectAndStartAction(ns, rank, chaos);
            }
        }
        
        ns.print('');
        
        // 6. Display action summary
        displayActionSummary(ns);
        
        await ns.sleep(10000); // Check every 10 seconds
    }
}

/**
 * Upgrade skills based on priority list
 */
async function upgradeSkills(ns, skillPoints) {
    ns.print('--- Skill Upgrades ---');
    
    let pointsSpent = 0;
    
    for (const skillName of SKILL_PRIORITIES) {
        if (skillPoints - pointsSpent <= 0) break;
        
        const currentLevel = ns.bladeburner.getSkillLevel(skillName);
        const upgradeCost = ns.bladeburner.getSkillUpgradeCost(skillName);
        
        if (upgradeCost <= skillPoints - pointsSpent) {
            if (ns.bladeburner.upgradeSkill(skillName)) {
                ns.print(`✓ Upgraded ${skillName} to level ${currentLevel + 1} (cost: ${upgradeCost})`);
                pointsSpent += upgradeCost;
            }
        }
    }
    
    if (pointsSpent === 0) {
        ns.print('No affordable skill upgrades');
    }
}

/**
 * Select and start the most appropriate action
 */
async function selectAndStartAction(ns, rank, chaos) {
    ns.print('--- Selecting Action ---');
    
    // Check for available Black Ops
    const nextBlackOp = ns.bladeburner.getNextBlackOp();
    if (nextBlackOp && rank >= nextBlackOp.rank) {
        const successChance = ns.bladeburner.getActionEstimatedSuccessChance('BlackOps', nextBlackOp.name);
        const minChance = successChance[0];
        
        ns.print(`Black Op available: ${nextBlackOp.name} (${(minChance * 100).toFixed(1)}% success)`);
        
        if (minChance >= SUCCESS_CHANCE_THRESHOLD) {
            if (ns.bladeburner.startAction('BlackOps', nextBlackOp.name)) {
                ns.print(`✓ Started Black Op: ${nextBlackOp.name}`);
                return;
            }
        } else {
            ns.print('⚠ Success chance too low, training first');
        }
    }
    
    // Try to find best operation
    const operations = ns.bladeburner.getOperationNames();
    let bestOperation = null;
    let bestOpScore = 0;
    
    for (const op of operations) {
        const count = ns.bladeburner.getActionCountRemaining('Operations', op);
        if (count <= 0) continue;
        
        const successChance = ns.bladeburner.getActionEstimatedSuccessChance('Operations', op);
        const minChance = successChance[0];
        
        if (minChance >= SUCCESS_CHANCE_THRESHOLD) {
            const repGain = ns.bladeburner.getActionRepGain('Operations', op, 1);
            const score = repGain * minChance;
            
            if (score > bestOpScore) {
                bestOpScore = score;
                bestOperation = op;
            }
        }
    }
    
    if (bestOperation) {
        if (ns.bladeburner.startAction('Operations', bestOperation)) {
            const successChance = ns.bladeburner.getActionEstimatedSuccessChance('Operations', bestOperation);
            ns.print(`✓ Started Operation: ${bestOperation} (${(successChance[0] * 100).toFixed(1)}% success)`);
            return;
        }
    }
    
    // Try to find best contract
    if (chaos < MIN_CHAOS_FOR_CONTRACTS) {
        const contracts = ns.bladeburner.getContractNames();
        let bestContract = null;
        let bestContractScore = 0;
        
        for (const contract of contracts) {
            const count = ns.bladeburner.getActionCountRemaining('Contracts', contract);
            if (count <= 0) continue;
            
            const successChance = ns.bladeburner.getActionEstimatedSuccessChance('Contracts', contract);
            const minChance = successChance[0];
            
            if (minChance >= CONTRACT_SUCCESS_THRESHOLD) {
                const repGain = ns.bladeburner.getActionRepGain('Contracts', contract, 1);
                const score = repGain * minChance;
                
                if (score > bestContractScore) {
                    bestContractScore = score;
                    bestContract = contract;
                }
            }
        }
        
        if (bestContract) {
            if (ns.bladeburner.startAction('Contracts', bestContract)) {
                const successChance = ns.bladeburner.getActionEstimatedSuccessChance('Contracts', bestContract);
                ns.print(`✓ Started Contract: ${bestContract} (${(successChance[0] * 100).toFixed(1)}% success)`);
                return;
            }
        }
    }
    
    // If no good actions, do training
    const generalActions = ns.bladeburner.getGeneralActionNames();
    
    // Prioritize Field Analysis if chaos is high
    if (chaos >= MIN_CHAOS_FOR_CONTRACTS && generalActions.includes('Field Analysis')) {
        if (ns.bladeburner.startAction('General', 'Field Analysis')) {
            ns.print('✓ Started Field Analysis (reducing chaos)');
            return;
        }
    }
    
    // Default to training
    if (generalActions.includes('Training')) {
        if (ns.bladeburner.startAction('General', 'Training')) {
            ns.print('✓ Started Training (improving stats)');
            return;
        }
    }
    
    ns.print('⚠ No suitable action found');
}

/**
 * Display summary of available actions
 */
function displayActionSummary(ns) {
    ns.print('--- Available Actions ---');
    
    // Show next Black Op
    const nextBlackOp = ns.bladeburner.getNextBlackOp();
    if (nextBlackOp) {
        const rank = ns.bladeburner.getRank();
        const successChance = ns.bladeburner.getActionEstimatedSuccessChance('BlackOps', nextBlackOp.name);
        const status = rank >= nextBlackOp.rank ? `${(successChance[0] * 100).toFixed(1)}% success` : `Need rank ${nextBlackOp.rank}`;
        ns.print(`Next Black Op: ${nextBlackOp.name} (${status})`);
    }
    
    // Count available contracts and operations
    const contracts = ns.bladeburner.getContractNames();
    let contractCount = 0;
    for (const contract of contracts) {
        contractCount += ns.bladeburner.getActionCountRemaining('Contracts', contract);
    }
    
    const operations = ns.bladeburner.getOperationNames();
    let operationCount = 0;
    for (const op of operations) {
        operationCount += ns.bladeburner.getActionCountRemaining('Operations', op);
    }
    
    ns.print(`Contracts available: ${contractCount}`);
    ns.print(`Operations available: ${operationCount}`);
}
