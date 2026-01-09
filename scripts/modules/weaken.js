/** @param {NS} ns */

/**
 * Simple weaken script - can be run with multiple threads
 * Usage: run weaken.js [target]
 */
export async function main(ns) {
    const target = ns.args[0] || 'n00dles';
    await ns.weaken(target);
}
