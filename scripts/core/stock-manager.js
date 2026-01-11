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

const FORECAST_BUY_THRESHOLD = 0.55; // Buy when forecast >= 55% chance to increase
const FORECAST_SELL_THRESHOLD = 0.45; // Sell when forecast <= 45% chance to increase
const MIN_SHARES_TO_BUY = 100; // Minimum shares to buy per transaction
const MAX_PORTFOLIO_PERCENT = 0.75; // Use max 75% of money for stocks
const COMMISSION = 100000; // $100k commission per transaction

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
                if (currentMoney >= TIX_API_COST) {
                    if (ns.stock.purchaseTixApi()) {
                        ns.print('✓ SUCCESS: Purchased TIX API!');
                    } else {
                        ns.print('✗ Failed to purchase TIX API');
                    }
                } else {
                    ns.print(`Need ${formatMoney(TIX_API_COST - currentMoney)} more for TIX API`);
                    ns.print('TIX API required for automated trading');
                }
            } else {
                ns.print('✓ TIX API Access owned');
                
                // 3. Purchase 4S Market Data if we don't have it
                if (!ns.stock.has4SData()) {
                    if (currentMoney >= FOUR_SIGMA_COST * 2) { // Only buy when we have 2x the cost
                        if (ns.stock.purchase4SMarketData()) {
                            ns.print('✓ SUCCESS: Purchased 4S Market Data!');
                        } else {
                            ns.print('✗ Failed to purchase 4S Market Data');
                        }
                    } else {
                        ns.print(`Will purchase 4S Market Data when we have ${formatMoney(FOUR_SIGMA_COST * 2)}`);
                    }
                } else {
                    ns.print('✓ 4S Market Data owned');
                    
                    // 4. Purchase 4S TIX API if we don't have it
                    if (!ns.stock.has4SDataTIXAPI()) {
                        if (currentMoney >= FOUR_SIGMA_API_COST * 2) { // Only buy when we have 2x the cost
                            if (ns.stock.purchase4SMarketDataTixApi()) {
                                ns.print('✓ SUCCESS: Purchased 4S Market Data TIX API!');
                            } else {
                                ns.print('✗ Failed to purchase 4S Market Data TIX API');
                            }
                        } else {
                            ns.print(`Will purchase 4S TIX API when we have ${formatMoney(FOUR_SIGMA_API_COST * 2)}`);
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
async function performTrading(ns, currentMoney) {
    ns.print('--- Trading Operations ---');
    
    const symbols = ns.stock.getSymbols();
    const has4SData = ns.stock.has4SDataTIXAPI();
    
    let totalValue = currentMoney;
    let totalProfit = 0;
    
    // Calculate total portfolio value
    for (const sym of symbols) {
        const position = ns.stock.getPosition(sym);
        const [longShares, longAvgPrice, shortShares, shortAvgPrice] = position;
        const currentPrice = ns.stock.getPrice(sym);
        
        if (longShares > 0) {
            totalValue += longShares * currentPrice;
            totalProfit += (currentPrice - longAvgPrice) * longShares;
        }
        if (shortShares > 0) {
            totalValue += shortShares * currentPrice;
            totalProfit += (shortAvgPrice - currentPrice) * shortShares;
        }
    }
    
    ns.print(`Portfolio Value: ${formatMoney(totalValue)}`);
    ns.print(`Total Profit: ${formatMoney(totalProfit)}\n`);
    
    // Money available for trading (keep 25% in cash)
    const tradingMoney = currentMoney * MAX_PORTFOLIO_PERCENT;
    
    // Process each stock
    for (const sym of symbols) {
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
                        currentMoney -= cost;
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
            const value = longShares * currentPrice;
            const profit = (currentPrice - longAvgPrice) * longShares;
            const forecast = has4SData ? ns.stock.getForecast(sym) : 0.5;
            
            const profitStr = profit >= 0 ? `+${formatMoney(profit)}` : formatMoney(profit);
            ns.print(`${sym}: ${longShares} shares @ ${formatMoney(longAvgPrice)} | Current: ${formatMoney(currentPrice)} | P/L: ${profitStr} | Forecast: ${(forecast * 100).toFixed(1)}%`);
        }
    }
    
    if (!hasPositions) {
        ns.print('No positions held');
    }
}
