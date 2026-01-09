/** @param {NS} ns */
/**
 * Auto-deployment script for Bitburner Automation Suite
 * Downloads all scripts from the GitHub repository and starts the automation
 * 
 * Usage: 
 *   wget https://raw.githubusercontent.com/simonsavoca/bitburner/main/deploy.js deploy.js
 *   run deploy.js
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
    
    // Core scripts
    { path: '/scripts/core/scanner.js', url: `${REPO_BASE}/scripts/core/scanner.js` },
    { path: '/scripts/core/orchestrator.js', url: `${REPO_BASE}/scripts/core/orchestrator.js` },
    { path: '/scripts/core/hacknet-manager.js', url: `${REPO_BASE}/scripts/core/hacknet-manager.js` },
    { path: '/scripts/core/server-manager.js', url: `${REPO_BASE}/scripts/core/server-manager.js` },
    { path: '/scripts/core/program-manager.js', url: `${REPO_BASE}/scripts/core/program-manager.js` },
    
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
    ns.tail();
    
    ns.print('╔════════════════════════════════════════════╗');
    ns.print('║  BITBURNER AUTOMATION SUITE INSTALLER      ║');
    ns.print('╚════════════════════════════════════════════╝\n');
    
    ns.print('This script will download and install all automation scripts.\n');
    
    // Create directories
    ns.print('Creating directory structure...');
    // Note: Directories are created automatically when files are written
    
    // Download all files
    ns.print('\nDownloading scripts from repository...\n');
    
    let successful = 0;
    let failed = 0;
    
    for (const file of FILES) {
        ns.print(`Downloading: ${file.path}`);
        
        try {
            const success = await ns.wget(file.url, file.path, 'home');
            
            if (success) {
                ns.print(`  ✓ Success`);
                successful++;
            } else {
                ns.print(`  ✗ Failed`);
                failed++;
            }
        } catch (error) {
            ns.print(`  ✗ Error: ${error}`);
            failed++;
        }
        
        await ns.sleep(100); // Small delay between downloads
    }
    
    ns.print('\n════════════════════════════════════════════');
    ns.print(`Downloaded: ${successful}/${FILES.length} files`);
    
    if (failed > 0) {
        ns.print(`Failed: ${failed} files`);
        ns.print('\nSome files failed to download.');
        ns.print('Please check your internet connection and try again.');
        return;
    }
    
    ns.print('════════════════════════════════════════════\n');
    
    ns.print('✓ Installation complete!\n');
    
    // Prompt to start
    ns.print('Starting automation suite...\n');
    await ns.sleep(1000);
    
    // Start the bootstrap script
    const pid = ns.run('/scripts/bootstrap.js');
    
    if (pid > 0) {
        ns.print('✓ Automation suite started successfully!');
        ns.print('\nThe scripts are now running in the background.');
        ns.print('You can close this window.\n');
        ns.print('Use "tail bootstrap.js" to view the main status.');
    } else {
        ns.print('✗ Failed to start automation suite');
        ns.print('You may need to run it manually:');
        ns.print('  run /scripts/bootstrap.js');
    }
    
    ns.print('\n════════════════════════════════════════════');
    ns.print('For help and documentation, see:');
    ns.print('https://github.com/simonsavoca/bitburner');
    ns.print('════════════════════════════════════════════');
}
