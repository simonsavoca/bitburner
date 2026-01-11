/** @param {NS} ns */
import { formatMoney } from '/scripts/utils/format-utils.js';

/**
 * Automatically manages stock market operations for profit optimization
 * Handles WSE account purchase, TIX API access, and automated trading
 * 
 * Note: Requires access to Stock Market (BitNode-8 or Source-File 8)
 */

// Configuration constants
const WSE_ACCOUNT_COST = 200000000; // $200m for WSE account
const TIX_API_COST = 5000000000; // $5b for TIX API
const FOUR_SIGMA_COST = 1000000000; // $1b for 4S Market Data
const FOUR_SIGMA_API_COST = 25000000000; // $25b for 4S Market Data TIX API

// Trading thresholds - more aggressive for better profit visibility
const FORECAST_BUY_THRESHOLD = 0.6; // Buy when forecast >= 60% chance to increase (was 55%)
const FORECAST_SELL_THRESHOLD = 0.5; // Sell when forecast <= 50% chance to increase (was 45%)
const MIN_SHARES_TO_BUY = 100; // Minimum shares to buy per transaction
const MAX_PORTFOLIO_PERCENT = 0.25; // Use max 25% of money for stocks (was 75% - too aggressive)
const COMMISSION = 100000; // $100k commission per transaction

// Purchase thresholds - only buy expensive APIs when we have plenty of money
const TIX_API_PURCHASE_THRESHOLD = 0.1; // Only spend 10% of cash on TIX API
const FOUR_SIGMA_PURCHASE_THRESHOLD = 0.05; // Only spend 5% of cash on 4S Data
const FOUR_SIGMA_API_PURCHASE_THRESHOLD = 0.02; // Only spend 2% of cash on 4S API

export async function main(ns) {
    ns.disableLog('ALL');
    ns.ui.openTail();
    
    while (true) {
        ns.clearLog();
        ns.print('=== Stock Market Manager ===\n');
        
        const currentMoney = ns.getServerMoneyAvailable('home');
        
        // 1. Purchase WSE Account if we don't have it
        if (!ns.stock.hasWSEAccount()) {
            if (currentMoney >= WSE_ACCOUNT_COST) {
                if (ns.stock.purchaseWseAccount()) {
                    ns.print('✓ SUCCESS: Purchased WSE Account!');
                } else {
                    ns.print('✗ Failed to purchase WSE Account');
                }
            } else {
                ns.print(`Need ${formatMoney(WSE_ACCOUNT_COST - currentMoney)} more for WSE Account`);
                ns.print('WSE Account required to start trading stocks');
            }
        } else {
            ns.print('✓ WSE Account owned');
            
            // 2. Purchase TIX API if we don't have it
            if (!ns.stock.hasTIXAPIAccess()) {
                const requiredMoney = TIX_API_COST / TIX_API_PURCHASE_THRESHOLD;
                if (currentMoney >= requiredMoney) {
                    if (ns.stock.purchaseTixApi()) {
                        ns.print('✓ SUCCESS: Purchased TIX API!');
                    } else {
                        ns.print('✗ Failed to purchase TIX API');
                    }
                } else {
                    ns.print(`Need ${formatMoney(requiredMoney)} total cash to afford TIX API (${formatMoney(TIX_API_COST)})`);
                    ns.print('TIX API required for automated trading');
                }
            } else {
                ns.print('✓ TIX API Access owned');
                
                // 3. Purchase 4S Market Data if we don't have it
                if (!ns.stock.has4SData()) {
                    const requiredMoney = FOUR_SIGMA_COST / FOUR_SIGMA_PURCHASE_THRESHOLD;
                    if (currentMoney >= requiredMoney) {
                        if (ns.stock.purchase4SMarketData()) {
                            ns.print('✓ SUCCESS: Purchased 4S Market Data!');
                        } else {
                            ns.print('✗ Failed to purchase 4S Market Data');
                        }
                    } else {
                        ns.print(`Will purchase 4S Market Data when we have ${formatMoney(requiredMoney)} (cost: ${formatMoney(FOUR_SIGMA_COST)})`);
                    }
                } else {
                    ns.print('✓ 4S Market Data owned');
                    
                    // 4. Purchase 4S TIX API if we don't have it
                    if (!ns.stock.has4SDataTIXAPI()) {
                        const requiredMoney = FOUR_SIGMA_API_COST / FOUR_SIGMA_API_PURCHASE_THRESHOLD;
                        if (currentMoney >= requiredMoney) {
                            if (ns.stock.purchase4SMarketDataTixApi()) {
                                ns.print('✓ SUCCESS: Purchased 4S Market Data TIX API!');
                            } else {
                                ns.print('✗ Failed to purchase 4S Market Data TIX API');
                            }
                        } else {
                            ns.print(`Will purchase 4S TIX API when we have ${formatMoney(requiredMoney)} (cost: ${formatMoney(FOUR_SIGMA_API_COST)})`);
                        }
                    } else {
                        ns.print('✓ 4S Market Data TIX API owned');
                    }
                }
                
                ns.print('');
                
                // 5. Perform automated trading if we have TIX API
                if (ns.stock.hasTIXAPIAccess()) {
                    await performTrading(ns, currentMoney);
                }
            }
        }
        
        await ns.sleep(6000); // Check every 6 seconds (stock updates every 4-6 seconds)
    }
}

/**
 * Perform automated stock trading based on forecasts
 */
async function performTrading(ns, initialMoney) {
    ns.print('--- Trading Operations ---');
    
    const symbols = ns.stock.getSymbols();
    const has4SData = ns.stock.has4SDataTIXAPI();
    
    let totalValue = initialMoney;
    let totalProfit = 0;
    let totalInvested = 0;
    
    // Calculate total portfolio value and investment
    for (const sym of symbols) {
        const position = ns.stock.getPosition(sym);
        const [longShares, longAvgPrice, shortShares, shortAvgPrice] = position;
        const currentPrice = ns.stock.getPrice(sym);
        
        if (longShares > 0) {
            const invested = longShares * longAvgPrice;
            const currentValue = longShares * currentPrice;
            totalInvested += invested;
            totalValue += currentValue;
            totalProfit += (currentPrice - longAvgPrice) * longShares;
        }
        if (shortShares > 0) {
            const invested = shortShares * shortAvgPrice;
            const currentValue = shortShares * currentPrice;
            totalInvested += invested;
            totalValue += currentValue;
            totalProfit += (shortAvgPrice - currentPrice) * shortShares;
        }
    }
    
    ns.print(`Cash: ${formatMoney(initialMoney)}`);
    ns.print(`Stock Value: ${formatMoney(totalInvested + totalProfit)}`);
    ns.print(`Portfolio Value: ${formatMoney(totalValue)}`);
    
    if (totalInvested > 0) {
        const profitPercent = (totalProfit / totalInvested) * 100;
        const profitStr = totalProfit >= 0 ? `+${formatMoney(totalProfit)}` : formatMoney(totalProfit);
        ns.print(`Total Profit: ${profitStr} (${profitPercent >= 0 ? '+' : ''}${profitPercent.toFixed(2)}%)`);
    } else {
        ns.print(`Total Profit: $0 (no positions)`);
    }
    ns.print('');
    
    // Process each stock
    for (const sym of symbols) {
        // Get current money from server (updated after each transaction)
        const currentMoney = ns.getServerMoneyAvailable('home');
        const tradingMoney = currentMoney * MAX_PORTFOLIO_PERCENT;
        
        const position = ns.stock.getPosition(sym);
        const [longShares, longAvgPrice] = position;
        const currentPrice = ns.stock.getPrice(sym);
        const forecast = has4SData ? ns.stock.getForecast(sym) : 0.5;
        const maxShares = ns.stock.getMaxShares(sym);
        
        // Sell logic: if we have shares and forecast is bad
        if (longShares > 0) {
            if (forecast <= FORECAST_SELL_THRESHOLD) {
                const saleGain = ns.stock.getSaleGain(sym, longShares, 'Long');
                const profit = saleGain - (longShares * longAvgPrice);
                
                if (ns.stock.sellStock(sym, longShares)) {
                    ns.print(`📉 SELL ${sym}: ${longShares} shares for ${formatMoney(saleGain)} (profit: ${formatMoney(profit)})`);
                }
            }
        }
        
        // Buy logic: if forecast is good and we have money
        if (forecast >= FORECAST_BUY_THRESHOLD && tradingMoney > COMMISSION) {
            // Calculate how many shares we can afford
            const moneyForStock = Math.min(tradingMoney * 0.1, currentMoney - COMMISSION); // Max 10% per stock
            const sharesToBuy = Math.floor(moneyForStock / currentPrice);
            
            // Only buy if we can afford minimum shares and haven't maxed out
            if (sharesToBuy >= MIN_SHARES_TO_BUY && longShares < maxShares * 0.9) {
                const actualShares = Math.min(sharesToBuy, maxShares - longShares);
                const cost = ns.stock.getPurchaseCost(sym, actualShares, 'Long');
                
                if (cost <= currentMoney && actualShares > 0) {
                    if (ns.stock.buyStock(sym, actualShares)) {
                        ns.print(`📈 BUY ${sym}: ${actualShares} shares for ${formatMoney(cost)} (forecast: ${(forecast * 100).toFixed(1)}%)`);
                    }
                }
            }
        }
    }
    
    // Show current positions
    ns.print('\n--- Current Positions ---');
    let hasPositions = false;
    for (const sym of symbols) {
        const position = ns.stock.getPosition(sym);
        const [longShares, longAvgPrice] = position;
        
        if (longShares > 0) {
            hasPositions = true;
            const currentPrice = ns.stock.getPrice(sym);
            const invested = longShares * longAvgPrice;
            const currentValue = longShares * currentPrice;
            const profit = currentValue - invested;
            const profitPercent = (profit / invested) * 100;
            const forecast = has4SData ? ns.stock.getForecast(sym) : 0.5;
            
            const profitStr = profit >= 0 ? `+${formatMoney(profit)}` : formatMoney(profit);
            const percentStr = profitPercent >= 0 ? `+${profitPercent.toFixed(2)}%` : `${profitPercent.toFixed(2)}%`;
            ns.print(`${sym}: ${longShares.toLocaleString()} shares @ ${formatMoney(longAvgPrice)} | Now: ${formatMoney(currentPrice)} | P/L: ${profitStr} (${percentStr}) | Forecast: ${(forecast * 100).toFixed(1)}%`);
        }
    }
    
    if (!hasPositions) {
        ns.print('No positions held - looking for opportunities...');
    }
}
