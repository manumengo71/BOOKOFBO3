/**
 * reels.js
 * Core reel mechanic for the 5x3 slot grid.
 * Handles spin simulation, outcome generation, and win-line checking.
 * BOOKOFBO3 - Futuristic Military Slot Engine
 */

import { getRandomSymbol } from './symbols.js';

export const REEL_COUNT = 5;
export const ROW_COUNT = 3;

// All active win lines (row-based + diagonal patterns)
export const WIN_LINES = [
    [0, 0, 0, 0, 0], // top row
    [1, 1, 1, 1, 1], // middle row
    [2, 2, 2, 2, 2], // bottom row
    [0, 1, 2, 1, 0], // V shape
    [2, 1, 0, 1, 2], // inverted V
    [0, 0, 1, 2, 2], // diagonal down
    [2, 2, 1, 0, 0], // diagonal up
    [1, 0, 1, 2, 1], // zigzag
];

/**
 * Generates a full 5x3 grid of random symbols.
 * Returns a 2D array: grid[reel][row]
 */
export function generateOutcome() {
    const grid = [];
    for (let reel = 0; reel < REEL_COUNT; reel++) {
        const column = [];
        for (let row = 0; row < ROW_COUNT; row++) {
            column.push(getRandomSymbol());
        }
        grid.push(column);
    }
    return grid;
}

/**
 * Evaluates win lines on a given grid outcome.
 * @param {Array} grid - 2D array of symbol objects
 * @returns {Array} wins - array of { lineIndex, symbolId, count, payout }
 */
export function evaluateWins(grid) {
    const wins = [];

    for (let lineIdx = 0; lineIdx < WIN_LINES.length; lineIdx++) {
        const line = WIN_LINES[lineIdx];
        const symbolsOnLine = line.map((row, reel) => grid[reel][row]);

        // Count consecutive matching symbols from left
        const firstSymbol = symbolsOnLine[0];
        let count = 1;
        for (let i = 1; i < symbolsOnLine.length; i++) {
            if (symbolsOnLine[i].id === firstSymbol.id) {
                count++;
            } else {
                break;
            }
        }

        var minC = firstSymbol.payouts && firstSymbol.payouts[2] ? 2 : 3;
        if (count >= minC) {
            const payout = firstSymbol.payouts[count] || 0;
            wins.push({
                lineIndex: lineIdx,
                symbolId: firstSymbol.id,
                symbol: firstSymbol,
                count,
                payout,
                positions: line.slice(0, count).map((row, reel) => ({ reel, row }))
            });
        }
    }

    return wins;
}

/**
 * Calculates total payout from a win set, applying multiplier.
 * @param {Array} wins
 * @param {number} multiplier
 * @returns {number} totalPayout
 */
export function calculateTotalPayout(wins, multiplier = 1) {
    const base = wins.reduce((sum, w) => sum + w.payout, 0);
    return Math.floor(base * multiplier);
}

/**
 * Checks if a win qualifies as a "big win" (any single line >= 500)
 */
export function isBigWin(wins) {
    return wins.some(w => w.payout >= 500);
}
