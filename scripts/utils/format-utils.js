/** @param {NS} ns */
/**
 * Formatting and display utilities
 */

/**
 * Format money amount with proper suffix
 * @param {number} amount
 * @returns {string}
 */
export function formatMoney(amount) {
    const absAmount = Math.abs(amount);
    if (absAmount >= 1e12) return `$${(amount / 1e12).toFixed(2)}T`;
    if (absAmount >= 1e9) return `$${(amount / 1e9).toFixed(2)}B`;
    if (absAmount >= 1e6) return `$${(amount / 1e6).toFixed(2)}M`;
    if (absAmount >= 1e3) return `$${(amount / 1e3).toFixed(2)}K`;
    return `$${amount.toFixed(2)}`;
}

/**
 * Format RAM amount with proper suffix
 * @param {number} gb
 * @returns {string}
 */
export function formatRAM(gb) {
    if (gb >= 1024) return `${(gb / 1024).toFixed(2)}TB`;
    return `${gb.toFixed(2)}GB`;
}

/**
 * Format time in milliseconds to readable string
 * @param {number} ms
 * @returns {string}
 */
export function formatTime(ms) {
    const seconds = ms / 1000;
    const minutes = seconds / 60;
    const hours = minutes / 60;
    const days = hours / 24;
    
    if (days >= 1) return `${days.toFixed(1)}d`;
    if (hours >= 1) return `${hours.toFixed(1)}h`;
    if (minutes >= 1) return `${minutes.toFixed(1)}m`;
    return `${seconds.toFixed(1)}s`;
}

/**
 * Format percentage
 * @param {number} value
 * @param {number} decimals
 * @returns {string}
 */
export function formatPercent(value, decimals = 2) {
    return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Format number with suffix
 * @param {number} num
 * @returns {string}
 */
export function formatNumber(num) {
    const absNum = Math.abs(num);
    if (absNum >= 1e12) return `${(num / 1e12).toFixed(2)}T`;
    if (absNum >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
    if (absNum >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
    if (absNum >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
    return `${num.toFixed(0)}`;
}
