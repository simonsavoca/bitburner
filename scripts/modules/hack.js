/** @param {NS} ns */

/**
 * Simple hack script - can be run with multiple threads
 * Usage: run hack.js [target]
 */
export async function main(ns) {
    const target = ns.args[0] || 'n00dles';
    await ns.hack(target);
}
