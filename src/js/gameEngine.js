/**
 * gameEngine.js
 * Core game state management: credits, spin logic, streak, multiplier, leaderboard.
 * BOOKOFBO3 - Futuristic Military Slot Engine
 */

import { generateOutcome, evaluateWins, calculateTotalPayout, isBigWin } from './reels.js';

export const SPIN_COST = 50;
export const STARTING_CREDITS = 1000;
export const MAX_MULTIPLIER = 5;
export const JACKPOT_TARGET = 10000; // visual only

export class GameEngine {
    constructor() {
        this.credits = STARTING_CREDITS;
        this.winStreak = 0;
        this.multiplier = 1;
        this.totalWon = 0;
        this.totalSpins = 0;
        this.jackpotProgress = 0; // 0-100 visual only
        this.leaderboard = this._loadLeaderboard();
        this.listeners = {};
    }

    /**
     * Registers an event listener for game events.
     * Events: 'spin', 'win', 'bigwin', 'lose', 'credits', 'streak', 'jackpot'
     */
    on(event, callback) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(callback);
    }

    _emit(event, data) {
        (this.listeners[event] || []).forEach(cb => cb(data));
    }

    /**
     * Performs a spin. Returns { outcome, wins, payout, bigWin } or null if insufficient credits.
     */
    spin() {
        if (this.credits < SPIN_COST) {
            this._emit('insufficient', { credits: this.credits });
            return null;
        }

        this.credits -= SPIN_COST;
        this.totalSpins++;
        this._emit('spin', { credits: this.credits });

        // Slowly grow jackpot bar
        this.jackpotProgress = Math.min(100, this.jackpotProgress + Math.random() * 3 + 1);
        this._emit('jackpot', { progress: this.jackpotProgress });

        const outcome = generateOutcome();
        const wins = evaluateWins(outcome);

        if (wins.length > 0) {
            const payout = calculateTotalPayout(wins, this.multiplier);
            this.credits += payout;
            this.totalWon += payout;
            this.winStreak++;

            // Update multiplier (caps at MAX_MULTIPLIER)
            this.multiplier = Math.min(MAX_MULTIPLIER, 1 + Math.floor(this.winStreak / 3));

            const bigWin = isBigWin(wins);

            this._emit('credits', { credits: this.credits });
            this._emit('streak', { streak: this.winStreak, multiplier: this.multiplier });

            if (bigWin) {
                this._emit('bigwin', { wins, payout, outcome });
            } else {
                this._emit('win', { wins, payout, outcome });
            }

            return { outcome, wins, payout, bigWin };
        } else {
            // Loss: reset streak and multiplier
            this.winStreak = 0;
            this.multiplier = 1;

            this._emit('credits', { credits: this.credits });
            this._emit('streak', { streak: 0, multiplier: 1 });
            this._emit('lose', { outcome });

            return { outcome, wins: [], payout: 0, bigWin: false };
        }
    }

    /**
     * Resets the game to default state.
     */
    reset() {
        this.credits = STARTING_CREDITS;
        this.winStreak = 0;
        this.multiplier = 1;
        this.totalWon = 0;
        this.totalSpins = 0;
        this.jackpotProgress = 0;
        this._emit('credits', { credits: this.credits });
        this._emit('streak', { streak: 0, multiplier: 1 });
        this._emit('jackpot', { progress: 0 });
    }

    /**
     * Saves score to local leaderboard (top 10).
     */
    saveScore(playerName) {
        const entry = {
            name: playerName || 'GHOST',
            credits: this.credits,
            streak: this.winStreak,
            date: new Date().toLocaleDateString()
        };
        this.leaderboard.push(entry);
        this.leaderboard.sort((a, b) => b.credits - a.credits);
        this.leaderboard = this.leaderboard.slice(0, 10);
        localStorage.setItem('bookofbo3_lb', JSON.stringify(this.leaderboard));
        return this.leaderboard;
    }

    _loadLeaderboard() {
        try {
            return JSON.parse(localStorage.getItem('bookofbo3_lb')) || [];
        } catch {
            return [];
        }
    }

    getState() {
        return {
            credits: this.credits,
            winStreak: this.winStreak,
            multiplier: this.multiplier,
            totalWon: this.totalWon,
            totalSpins: this.totalSpins,
            jackpotProgress: this.jackpotProgress
        };
    }
}
