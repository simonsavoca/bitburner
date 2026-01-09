/** @param {NS} ns */

/**
 * Simple grow script - can be run with multiple threads
 * Usage: run grow.js [target]
 */
export async function main(ns) {
    const target = ns.args[0] || 'n00dles';
    await ns.grow(target);
}
