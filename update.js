/** @param {NS} ns */
/**
 * Update script for Bitburner Automation Suite
 * Downloads the latest versions of all scripts from the GitHub repository
 * 
 * Usage: 
 *   wget https://raw.githubusercontent.com/simonsavoca/bitburner/main/update.js update.js
 *   run update.js
 */

const REPO_BASE = 'https://raw.githubusercontent.com/simonsavoca/bitburner/main';

const FILES = [
    // Bootstrap
    { path: '/scripts/bootstrap.js', url: `${REPO_BASE}/scripts/bootstrap.js` },
    
    // Configuration and help
    { path: '/scripts/config.js', url: `${REPO_BASE}/scripts/config.js` },
    { path: '/scripts/help.js', url: `${REPO_BASE}/scripts/help.js` },
    
    // Documentation
    { path: '/QUICKSTART.txt', url: `${REPO_BASE}/QUICKSTART.md` },
    
    // Early game
    { path: '/scripts/early-hack.js', url: `${REPO_BASE}/scripts/early-hack.js` },
    
    // Optional scripts
    { path: '/scripts/dashboard.js', url: `${REPO_BASE}/scripts/dashboard.js` },
    { path: '/scripts/batch-hack.js', url: `${REPO_BASE}/scripts/batch-hack.js` },
    { path: '/scripts/network-browser.js', url: `${REPO_BASE}/scripts/network-browser.js` },
    
    // Core automation scripts
    { path: '/scripts/core/scanner.js', url: `${REPO_BASE}/scripts/core/scanner.js` },
    { path: '/scripts/core/orchestrator.js', url: `${REPO_BASE}/scripts/core/orchestrator.js` },
    { path: '/scripts/core/hacknet-manager.js', url: `${REPO_BASE}/scripts/core/hacknet-manager.js` },
    { path: '/scripts/core/server-manager.js', url: `${REPO_BASE}/scripts/core/server-manager.js` },
    
    // Advanced automation scripts (Singularity API - requires SF4)
    { path: '/scripts/core/singularity-manager.js', url: `${REPO_BASE}/scripts/core/singularity-manager.js` },
    { path: '/scripts/core/faction-manager.js', url: `${REPO_BASE}/scripts/core/faction-manager.js` },
    { path: '/scripts/core/stat-manager.js', url: `${REPO_BASE}/scripts/core/stat-manager.js` },
    { path: '/scripts/core/backdoor-installer.js', url: `${REPO_BASE}/scripts/core/backdoor-installer.js` },
    { path: '/scripts/core/progression-orchestrator.js', url: `${REPO_BASE}/scripts/core/progression-orchestrator.js` },
    { path: '/scripts/core/contract-solver.js', url: `${REPO_BASE}/scripts/core/contract-solver.js` },
    
    // Utility scripts
    { path: '/scripts/utils/server-utils.js', url: `${REPO_BASE}/scripts/utils/server-utils.js` },
    { path: '/scripts/utils/format-utils.js', url: `${REPO_BASE}/scripts/utils/format-utils.js` },
    
    // Module scripts
    { path: '/scripts/modules/hack.js', url: `${REPO_BASE}/scripts/modules/hack.js` },
    { path: '/scripts/modules/grow.js', url: `${REPO_BASE}/scripts/modules/grow.js` },
    { path: '/scripts/modules/weaken.js', url: `${REPO_BASE}/scripts/modules/weaken.js` },
];

export async function main(ns) {
    ns.disableLog('ALL');
    ns.ui.openTail();
    
    ns.print('╔════════════════════════════════════════════╗');
    ns.print('║  BITBURNER AUTOMATION SUITE v2.0           ║');
    ns.print('║  Update Script                             ║');
    ns.print('╚════════════════════════════════════════════╝\n');
    
    ns.print('This script will update all automation scripts to the latest version.\n');
    
    // Check if automation is running
    const runningScripts = ns.ps('home');
    const automationRunning = runningScripts.some(proc => 
        proc.filename === '/scripts/bootstrap.js'
    );
    
    if (automationRunning) {
        ns.print('⚠ Automation suite is currently running.');
        ns.print('Stopping automation to prevent conflicts...\n');
        
        // Kill the bootstrap script (which should stop everything)
        ns.scriptKill('/scripts/bootstrap.js', 'home');
        await ns.sleep(2000);
        
        // Kill any remaining automation scripts
        const scriptsToKill = [
            '/scripts/core/scanner.js',
            '/scripts/core/orchestrator.js',
            '/scripts/core/hacknet-manager.js',
            '/scripts/core/server-manager.js',
            '/scripts/core/singularity-manager.js',
            '/scripts/core/faction-manager.js',
            '/scripts/core/stat-manager.js',
            '/scripts/core/backdoor-installer.js',
            '/scripts/core/progression-orchestrator.js',
            '/scripts/core/contract-solver.js',
        ];
        
        for (const script of scriptsToKill) {
            ns.scriptKill(script, 'home');
        }
        
        await ns.sleep(1000);
        ns.print('✓ Automation stopped\n');
    }
    
    // Download all files
    ns.print('Downloading latest versions from repository...\n');
    
    let successful = 0;
    let failed = 0;
    const failedFiles = [];
    
    for (const file of FILES) {
        ns.print(`Updating: ${file.path}`);
        
        try {
            const success = await ns.wget(file.url, file.path, 'home');
            
            if (success) {
                ns.print(`  ✓ Updated`);
                successful++;
            } else {
                ns.print(`  ✗ Failed`);
                failed++;
                failedFiles.push(file.path);
            }
        } catch (error) {
            ns.print(`  ✗ Error: ${error}`);
            failed++;
            failedFiles.push(file.path);
        }
        
        await ns.sleep(100); // Small delay between downloads
    }
    
    ns.print('\n════════════════════════════════════════════');
    ns.print(`Updated: ${successful}/${FILES.length} files`);
    
    if (failed > 0) {
        ns.print(`Failed: ${failed} files`);
        ns.print('\nFailed files:');
        for (const file of failedFiles) {
            ns.print(`  - ${file}`);
        }
        ns.print('\nSome files failed to update.');
        ns.print('Please check your internet connection and try again.');
        return;
    }
    
    ns.print('════════════════════════════════════════════\n');
    
    ns.print('✓ Update complete!\n');
    
    // Ask about restarting automation
    if (automationRunning) {
        ns.print('Restarting automation suite...\n');
        await ns.sleep(1000);
        
        // Start the bootstrap script
        const pid = ns.run('/scripts/bootstrap.js');
        
        if (pid > 0) {
            ns.print('✓ Automation suite restarted successfully!');
            ns.print('\nThe updated scripts are now running in the background.');
            ns.print('You can close this window.\n');
            ns.print('Use "tail bootstrap.js" to view the main status.');
        } else {
            ns.print('✗ Failed to restart automation suite');
            ns.print('You may need to run it manually:');
            ns.print('  run /scripts/bootstrap.js');
        }
    } else {
        ns.print('To start the automation suite, run:');
        ns.print('  run /scripts/bootstrap.js');
    }
    
    ns.print('\n════════════════════════════════════════════');
    ns.print('Update complete! All scripts are up to date.');
    ns.print('════════════════════════════════════════════');
}
