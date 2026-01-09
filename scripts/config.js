/** @param {NS} ns */
/**
 * Configuration file for Bitburner Automation Suite
 * Modify these values to customize automation behavior
 */

export const CONFIG = {
    // Scanner settings
    scanner: {
        scanInterval: 60000, // How often to scan network (ms)
    },
    
    // Orchestrator settings
    orchestrator: {
        securityThresholdOffset: 5, // How much above min security before weakening
        moneyThresholdPercent: 0.75, // Grow until server has this % of max money
    },
    
    // Hacknet Manager settings
    hacknet: {
        maxNodes: 8, // Maximum nodes to purchase initially
        upgradeThreshold: 0.1, // Upgrade when cost < this % of current money
        maxLevel: 200, // Maximum level for nodes
        maxRam: 64, // Maximum RAM for nodes
        maxCores: 16, // Maximum cores for nodes
    },
    
    // Server Manager settings
    serverManager: {
        serverPrefix: 'pserv-', // Prefix for purchased servers
        minRAM: 8, // Starting RAM for purchased servers
        purchaseThreshold: 0.5, // Purchase when we have this % of the cost
    },
    
    // Dashboard settings
    dashboard: {
        updateInterval: 5000, // How often to update dashboard (ms)
    },
    
    // Script RAM costs (for reference)
    scriptRAM: {
        hack: 1.75,
        grow: 1.75,
        weaken: 1.75,
    },
};

/**
 * Get a configuration value
 * @param {string} category - Category name
 * @param {string} key - Config key
 * @returns {any} Configuration value
 */
export function getConfig(category, key) {
    if (CONFIG[category] && CONFIG[category][key] !== undefined) {
        return CONFIG[category][key];
    }
    return null;
}

/**
 * Export default for easy importing
 */
export default CONFIG;
