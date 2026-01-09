/** @param {NS} ns */
import { scanNetwork } from '/scripts/utils/server-utils.js';

/**
 * Automatically finds and solves coding contracts
 * Provides rewards like money, reputation, or faction invites
 */
export async function main(ns) {
    ns.disableLog('ALL');
    ns.tail();
    
    while (true) {
        ns.clearLog();
        ns.print('=== Coding Contract Solver ===\n');
        
        // Find all contracts on the network
        const contracts = findContracts(ns);
        
        if (contracts.length === 0) {
            ns.print('No contracts found on network');
        } else {
            ns.print(`Found ${contracts.length} contract(s):\n`);
            
            for (const contract of contracts) {
                const type = ns.codingcontract.getContractType(contract.file, contract.server);
                const tries = ns.codingcontract.getNumTriesRemaining(contract.file, contract.server);
                
                ns.print(`${contract.server}: ${contract.file}`);
                ns.print(`  Type: ${type}`);
                ns.print(`  Tries remaining: ${tries}`);
                
                // Attempt to solve
                const solution = solveContract(ns, contract.file, contract.server, type);
                
                if (solution !== null) {
                    const result = ns.codingcontract.attempt(solution, contract.file, contract.server);
                    
                    if (result) {
                        ns.print(`  ✓ SOLVED! Reward: ${result}\n`);
                    } else {
                        ns.print(`  ✗ Solution incorrect\n`);
                    }
                } else {
                    ns.print(`  ⚠ No solver for this type\n`);
                }
            }
        }
        
        await ns.sleep(300000); // Check every 5 minutes
    }
}

/**
 * Find all coding contracts on network
 */
function findContracts(ns) {
    const servers = scanNetwork(ns);
    const contracts = [];
    
    for (const server of servers) {
        const files = ns.ls(server, '.cct');
        
        for (const file of files) {
            contracts.push({ server, file });
        }
    }
    
    return contracts;
}

/**
 * Solve a coding contract
 */
function solveContract(ns, file, server, type) {
    const data = ns.codingcontract.getData(file, server);
    
    try {
        switch (type) {
            case 'Find Largest Prime Factor':
                return solveLargestPrimeFactor(data);
            
            case 'Subarray with Maximum Sum':
                return solveMaxSubarraySum(data);
            
            case 'Total Ways to Sum':
                return solveTotalWaysToSum(data);
            
            case 'Spiralize Matrix':
                return solveSpiralizeMatrix(data);
            
            case 'Array Jumping Game':
                return solveArrayJumping(data);
            
            case 'Merge Overlapping Intervals':
                return solveMergeIntervals(data);
            
            case 'Generate IP Addresses':
                return solveGenerateIPs(data);
            
            case 'Algorithmic Stock Trader I':
                return solveStockTrader1(data);
            
            case 'Algorithmic Stock Trader II':
                return solveStockTrader2(data);
            
            case 'Algorithmic Stock Trader III':
                return solveStockTrader3(data);
            
            case 'Algorithmic Stock Trader IV':
                return solveStockTrader4(data);
            
            case 'Minimum Path Sum in a Triangle':
                return solveMinPathTriangle(data);
            
            case 'Unique Paths in a Grid I':
                return solveUniquePaths1(data);
            
            case 'Unique Paths in a Grid II':
                return solveUniquePaths2(data);
            
            case 'Sanitize Parentheses in Expression':
                return solveSanitizeParens(data);
            
            case 'Find All Valid Math Expressions':
                return solveMathExpressions(data);
            
            default:
                return null;
        }
    } catch (e) {
        ns.print(`Error solving: ${e}`);
        return null;
    }
}

// Contract Solvers

function solveLargestPrimeFactor(num) {
    let factor = 2;
    while (num > 1) {
        if (num % factor === 0) {
            num /= factor;
        } else {
            factor++;
        }
    }
    return factor;
}

function solveMaxSubarraySum(arr) {
    let maxSum = arr[0];
    let currentSum = arr[0];
    
    for (let i = 1; i < arr.length; i++) {
        currentSum = Math.max(arr[i], currentSum + arr[i]);
        maxSum = Math.max(maxSum, currentSum);
    }
    
    return maxSum;
}

function solveTotalWaysToSum(n) {
    const ways = new Array(n + 1).fill(0);
    ways[0] = 1;
    
    for (let i = 1; i < n; i++) {
        for (let j = i; j <= n; j++) {
            ways[j] += ways[j - i];
        }
    }
    
    return ways[n];
}

function solveSpiralizeMatrix(matrix) {
    const result = [];
    
    while (matrix.length > 0) {
        // Take first row
        result.push(...matrix.shift());
        
        // Take last column
        for (const row of matrix) {
            if (row.length > 0) {
                result.push(row.pop());
            }
        }
        
        // Take last row in reverse
        if (matrix.length > 0) {
            result.push(...matrix.pop().reverse());
        }
        
        // Take first column in reverse
        for (let i = matrix.length - 1; i >= 0; i--) {
            if (matrix[i].length > 0) {
                result.push(matrix[i].shift());
            }
        }
    }
    
    return result;
}

function solveArrayJumping(arr) {
    let reach = 0;
    for (let i = 0; i < arr.length && i <= reach; i++) {
        reach = Math.max(reach, i + arr[i]);
    }
    return reach >= arr.length - 1 ? 1 : 0;
}

function solveMergeIntervals(intervals) {
    if (intervals.length <= 1) return intervals;
    
    intervals.sort((a, b) => a[0] - b[0]);
    const result = [intervals[0]];
    
    for (let i = 1; i < intervals.length; i++) {
        const last = result[result.length - 1];
        const current = intervals[i];
        
        if (current[0] <= last[1]) {
            last[1] = Math.max(last[1], current[1]);
        } else {
            result.push(current);
        }
    }
    
    return result;
}

function solveGenerateIPs(s) {
    const result = [];
    
    function isValid(segment) {
        if (segment.length > 3) return false;
        if (segment[0] === '0' && segment.length > 1) return false;
        const num = parseInt(segment);
        return num >= 0 && num <= 255;
    }
    
    for (let i = 1; i < 4 && i < s.length; i++) {
        for (let j = i + 1; j < i + 4 && j < s.length; j++) {
            for (let k = j + 1; k < j + 4 && k < s.length; k++) {
                const s1 = s.slice(0, i);
                const s2 = s.slice(i, j);
                const s3 = s.slice(j, k);
                const s4 = s.slice(k);
                
                if (isValid(s1) && isValid(s2) && isValid(s3) && isValid(s4)) {
                    result.push(`${s1}.${s2}.${s3}.${s4}`);
                }
            }
        }
    }
    
    return result;
}

function solveStockTrader1(prices) {
    let maxProfit = 0;
    let minPrice = prices[0];
    
    for (let i = 1; i < prices.length; i++) {
        maxProfit = Math.max(maxProfit, prices[i] - minPrice);
        minPrice = Math.min(minPrice, prices[i]);
    }
    
    return maxProfit;
}

function solveStockTrader2(prices) {
    let profit = 0;
    for (let i = 1; i < prices.length; i++) {
        profit += Math.max(0, prices[i] - prices[i - 1]);
    }
    return profit;
}

function solveStockTrader3(prices) {
    let buy1 = -Infinity, sell1 = 0;
    let buy2 = -Infinity, sell2 = 0;
    
    for (const price of prices) {
        buy1 = Math.max(buy1, -price);
        sell1 = Math.max(sell1, buy1 + price);
        buy2 = Math.max(buy2, sell1 - price);
        sell2 = Math.max(sell2, buy2 + price);
    }
    
    return sell2;
}

function solveStockTrader4(data) {
    const [k, prices] = data;
    
    if (k >= prices.length / 2) {
        return solveStockTrader2(prices);
    }
    
    const buy = new Array(k + 1).fill(-Infinity);
    const sell = new Array(k + 1).fill(0);
    
    for (const price of prices) {
        for (let i = k; i >= 1; i--) {
            sell[i] = Math.max(sell[i], buy[i] + price);
            buy[i] = Math.max(buy[i], sell[i - 1] - price);
        }
    }
    
    return sell[k];
}

function solveMinPathTriangle(triangle) {
    for (let i = triangle.length - 2; i >= 0; i--) {
        for (let j = 0; j < triangle[i].length; j++) {
            triangle[i][j] += Math.min(triangle[i + 1][j], triangle[i + 1][j + 1]);
        }
    }
    return triangle[0][0];
}

function solveUniquePaths1(grid) {
    const [rows, cols] = grid;
    const dp = Array(rows).fill(1);
    
    for (let i = 1; i < cols; i++) {
        for (let j = 1; j < rows; j++) {
            dp[j] += dp[j - 1];
        }
    }
    
    return dp[rows - 1];
}

function solveUniquePaths2(grid) {
    const rows = grid.length;
    const cols = grid[0].length;
    const dp = Array(rows).fill(0).map(() => Array(cols).fill(0));
    
    dp[0][0] = grid[0][0] === 0 ? 1 : 0;
    
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (grid[i][j] === 1) {
                dp[i][j] = 0;
            } else {
                if (i > 0) dp[i][j] += dp[i - 1][j];
                if (j > 0) dp[i][j] += dp[i][j - 1];
            }
        }
    }
    
    return dp[rows - 1][cols - 1];
}

function solveSanitizeParens(s) {
    const result = [];
    const visited = new Set();
    
    function isValid(str) {
        let count = 0;
        for (const char of str) {
            if (char === '(') count++;
            else if (char === ')') count--;
            if (count < 0) return false;
        }
        return count === 0;
    }
    
    function bfs() {
        const queue = [s];
        visited.add(s);
        let found = false;
        
        while (queue.length > 0 && !found) {
            const size = queue.length;
            
            for (let i = 0; i < size; i++) {
                const current = queue.shift();
                
                if (isValid(current)) {
                    result.push(current);
                    found = true;
                } else if (!found) {
                    for (let j = 0; j < current.length; j++) {
                        if (current[j] === '(' || current[j] === ')') {
                            const next = current.slice(0, j) + current.slice(j + 1);
                            if (!visited.has(next)) {
                                visited.add(next);
                                queue.push(next);
                            }
                        }
                    }
                }
            }
        }
    }
    
    bfs();
    return result.length > 0 ? result : [''];
}

function solveMathExpressions(data) {
    const [num, target] = [data.slice(0, -1), parseInt(data.slice(-1))];
    const result = [];
    
    function helper(index, expr, value, prev, current) {
        if (index === num.length) {
            if (value === target && current === 0) {
                result.push(expr);
            }
            return;
        }
        
        current = current * 10 + parseInt(num[index]);
        const str = current.toString();
        
        if (current > 0) {
            helper(index + 1, expr, value, prev, current);
        }
        
        if (expr.length > 0) {
            helper(index + 1, expr + '+' + str, value + current, current, 0);
            helper(index + 1, expr + '-' + str, value - current, -current, 0);
            helper(index + 1, expr + '*' + str, value - prev + prev * current, prev * current, 0);
        } else {
            helper(index + 1, str, current, current, 0);
        }
    }
    
    helper(0, '', 0, 0, 0);
    return result;
}
