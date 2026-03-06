/**
 * ui.js
 * DOM manipulation layer: renders the reel grid, updates stats cards,
 * shows win banners, and manages the leaderboard list.
 * BOOKOFBO3 - Futuristic Military Slot Engine
 */

import { REEL_COUNT, ROW_COUNT } from './reels.js';
import { animateCounter, glowWinSymbols, clearWinGlows, spawnWinParticles, triggerBigWinEffect, triggerGlitch } from './animations.js';

// ─── Reel Grid ────────────────────────────────────────────────────────────────

/**
 * Builds the 5x3 reel grid inside #reels-grid.
 * Creates .reel-column > .reel-cell elements.
 */
export function buildReelGrid() {
    const grid = document.getElementById('reels-grid');
    if (!grid) return;
    grid.innerHTML = '';

    for (let r = 0; r < REEL_COUNT; r++) {
        const col = document.createElement('div');
        col.className = 'reel-column';
        col.dataset.reel = r;

        for (let row = 0; row < ROW_COUNT; row++) {
            const cell = document.createElement('div');
            cell.className = 'reel-cell';
            cell.dataset.reel = r;
            cell.dataset.row = row;
            col.appendChild(cell);
        }

        grid.appendChild(col);
    }
}

/**
 * Renders a grid outcome (2D array of symbols) into the reel cells.
 * @param {Array} grid - grid[reel][row] of symbol objects
 */
export function renderOutcome(grid) {
    const container = document.getElementById('reels-grid');
    if (!container) return;

    const cells = container.querySelectorAll('.reel-cell');
    for (let reel = 0; reel < REEL_COUNT; reel++) {
        for (let row = 0; row < ROW_COUNT; row++) {
            const index = reel * ROW_COUNT + row;
            const cell = cells[index];
            const symbol = grid[reel][row];
            if (cell && symbol) {
                cell.innerHTML = `
          <div class="symbol-icon" style="color: ${symbol.color};">
            ${symbol.svg}
          </div>
          <span class="symbol-label">${symbol.name}</span>
        `;
                cell.dataset.symbolId = symbol.id;
            }
        }
    }
}

// ─── Stats Card ───────────────────────────────────────────────────────────────

let _previousCredits = 1000;

/**
 * Updates the player stats card (credits, streak, multiplier).
 */
export function updateStatsCard(state) {
    const creditsEl = document.getElementById('stat-credits');
    const streakEl = document.getElementById('stat-streak');
    const multEl = document.getElementById('stat-multiplier');

    if (creditsEl) {
        animateCounter(creditsEl, _previousCredits, state.credits, 600);
        _previousCredits = state.credits;
    }
    if (streakEl) streakEl.textContent = state.winStreak;
    if (multEl) {
        multEl.textContent = `x${state.multiplier}`;
        multEl.classList.toggle('multiplier-active', state.multiplier > 1);
    }
}

// ─── Jackpot Bar ──────────────────────────────────────────────────────────────

export function updateJackpotBar(progress) {
    const bar = document.getElementById('jackpot-fill');
    if (bar) bar.style.width = `${Math.min(100, progress)}%`;
}

// ─── Win Banner ───────────────────────────────────────────────────────────────

let bannerTimeout = null;

/**
 * Displays a win or big-win banner.
 * @param {number} payout - amount won
 * @param {boolean} isBig - trigger big-win styling
 * @param {Array} wins - win objects with positions
 */
export function showWinBanner(payout, isBig, wins) {
    const banner = document.getElementById('win-banner');
    const bannerText = document.getElementById('win-banner-text');
    const gameCard = document.getElementById('game-card');

    if (!banner || !bannerText) return;

    clearTimeout(bannerTimeout);

    bannerText.textContent = isBig
        ? `⚡ BIG WIN! +${payout} CREDITS ⚡`
        : `WIN! +${payout} CREDITS`;

    banner.className = 'win-banner ' + (isBig ? 'big-win-banner' : 'small-win-banner');
    banner.classList.remove('hidden');

    // Glow winning symbols
    if (wins && wins.length > 0) {
        const allPositions = wins.flatMap(w => w.positions);
        const color = wins[0].symbol?.color || '#00ff9d';
        glowWinSymbols(allPositions, color);
    }

    // Big win screen effect
    if (isBig) {
        triggerBigWinEffect(gameCard);
        triggerGlitch();
    }

    // Spawn floating credit particles near spin button
    const spinBtn = document.getElementById('spin-btn');
    spawnWinParticles(payout, spinBtn);

    bannerTimeout = setTimeout(() => {
        banner.classList.add('hidden');
        clearWinGlows();
    }, isBig ? 4000 : 2500);
}

export function hideWinBanner() {
    const banner = document.getElementById('win-banner');
    if (banner) banner.classList.add('hidden');
    clearWinGlows();
}

// ─── Spin Button ──────────────────────────────────────────────────────────────

export function setSpinButtonState(spinning) {
    const btn = document.getElementById('spin-btn');
    if (!btn) return;
    btn.disabled = spinning;
    btn.classList.toggle('spinning-btn', spinning);
    btn.textContent = spinning ? '[ EXECUTING... ]' : '[ DEPLOY SPIN ]';
}

// ─── Leaderboard ──────────────────────────────────────────────────────────────

export function renderLeaderboard(entries) {
    const list = document.getElementById('leaderboard-list');
    if (!list) return;

    if (!entries || entries.length === 0) {
        list.innerHTML = '<li class="lb-empty">NO RECORDS ON FILE</li>';
        return;
    }

    list.innerHTML = entries.map((e, i) => `
    <li class="lb-entry ${i === 0 ? 'lb-top' : ''}">
      <span class="lb-rank">#${i + 1}</span>
      <span class="lb-name">${e.name}</span>
      <span class="lb-score">${e.credits} CR</span>
      <span class="lb-date">${e.date}</span>
    </li>
  `).join('');
}

// ─── Multiplayer UI ───────────────────────────────────────────────────────────

export function updateMultiplayerCard(data) {
    const { myName, myCredits, oppName, oppCredits, timeLeft, connected, roomCode } = data;

    const myNameEl = document.getElementById('mp-my-name');
    const myCredEl = document.getElementById('mp-my-credits');
    const oppNameEl = document.getElementById('mp-opp-name');
    const oppCredEl = document.getElementById('mp-opp-credits');
    const timerEl = document.getElementById('mp-timer');
    const roomEl = document.getElementById('mp-room-code-display');
    const statusEl = document.getElementById('mp-status');

    if (myNameEl) myNameEl.textContent = myName || 'YOU';
    if (myCredEl) myCredEl.textContent = `${myCredits} CR`;
    if (oppNameEl) oppNameEl.textContent = oppName || '---';
    if (oppCredEl) oppCredEl.textContent = oppCredits !== null ? `${oppCredits} CR` : '---';
    if (timerEl && timeLeft !== undefined) {
        const m = Math.floor(timeLeft / 60);
        const s = String(timeLeft % 60).padStart(2, '0');
        timerEl.textContent = `${m}:${s}`;
    }
    if (roomEl && roomCode) roomEl.textContent = roomCode;
    if (statusEl) {
        statusEl.textContent = connected ? 'LINKED' : 'OFFLINE';
        statusEl.className = 'mp-status-badge ' + (connected ? 'status-online' : 'status-offline');
    }
}

export function showMpNotification(message) {
    const notif = document.getElementById('mp-notification');
    if (!notif) return;
    notif.textContent = message;
    notif.classList.remove('hidden');
    setTimeout(() => notif.classList.add('hidden'), 3000);
}

// ─── Loading Screen ───────────────────────────────────────────────────────────

export function hideLoadingScreen() {
    const screen = document.getElementById('loading-screen');
    if (!screen) return;
    screen.classList.add('fade-out');
    setTimeout(() => screen.remove(), 800);
}
