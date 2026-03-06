/**
 * app.js
 * Application entry point. Loads HTML components, wires all modules together,
 * and boots the game on DOMContentLoaded.
 * BOOKOFBO3 - Futuristic Military Slot Engine
 */

import { GameEngine } from './gameEngine.js';
import { MultiplayerManager } from './multiplayer.js';
import {
    buildReelGrid, renderOutcome, updateStatsCard, updateJackpotBar,
    showWinBanner, setSpinButtonState, renderLeaderboard,
    updateMultiplayerCard, showMpNotification, hideLoadingScreen
} from './ui.js';
import { spinReels } from './animations.js';

// ── Bootstrap ────────────────────────────────────────────────────────────────

const COMPONENTS = [
    { id: 'slot-header', file: 'src/components/header-card.html' },
    { id: 'slot-game', file: 'src/components/game-card.html' },
    { id: 'slot-leaderboard', file: 'src/components/leaderboard-card.html' },
    { id: 'slot-multiplayer', file: 'src/components/multiplayer-card.html' },
    { id: 'slot-controls', file: 'src/components/controls-card.html' },
];

/**
 * Loads all HTML component files into their placeholder divs.
 */
async function loadComponents() {
    await Promise.all(
        COMPONENTS.map(async ({ id, file }) => {
            const el = document.getElementById(id);
            if (!el) return;
            try {
                const res = await fetch(file);
                el.innerHTML = await res.text();
            } catch (e) {
                console.warn(`Could not load component: ${file}`, e);
            }
        })
    );
}

// ── Main Init ────────────────────────────────────────────────────────────────

async function init() {
    // 1. Load HTML component cards
    await loadComponents();

    // 2. Build the reel grid
    buildReelGrid();

    // 3. Instantiate engine and multiplayer
    const engine = new GameEngine();
    const mp = new MultiplayerManager();
    let isSpinning = false;

    // 4. Initial UI render
    updateStatsCard(engine.getState());
    renderLeaderboard(engine.leaderboard);
    updateJackpotBar(0);
    updateMultiplayerCard(mp.getState());

    // ── Engine Events ──────────────────────────────────────────────────────────

    engine.on('credits', ({ credits }) => {
        updateStatsCard(engine.getState());
        // Sync credits to multiplayer opponent
        mp.syncCredits(credits);
    });

    engine.on('streak', () => updateStatsCard(engine.getState()));

    engine.on('jackpot', ({ progress }) => updateJackpotBar(progress));

    engine.on('win', ({ wins, payout, outcome }) => {
        renderOutcome(outcome);
        showWinBanner(payout, false, wins);
        playSound('win');
        mp.syncCredits(engine.credits, payout);
    });

    engine.on('bigwin', ({ wins, payout, outcome }) => {
        renderOutcome(outcome);
        showWinBanner(payout, true, wins);
        playSound('bigwin');
        mp.syncCredits(engine.credits, payout);
    });

    engine.on('lose', ({ outcome }) => {
        renderOutcome(outcome);
    });

    engine.on('insufficient', () => {
        showMpNotification('INSUFFICIENT CREDITS — RESET REQUIRED');
    });

    // ── Spin Button ───────────────────────────────────────────────────────────

    document.addEventListener('click', async (e) => {
        if (!e.target.matches('#spin-btn') && !e.target.closest('#spin-btn')) return;
        if (isSpinning) return;
        isSpinning = true;
        setSpinButtonState(true);
        playSound('spin');

        const reelCols = document.querySelectorAll('.reel-column');
        await spinReels(reelCols, 2400);

        engine.spin();

        setSpinButtonState(false);
        isSpinning = false;
    });

    // ── Controls Card ─────────────────────────────────────────────────────────

    // Reset credits button
    document.addEventListener('click', (e) => {
        if (!e.target.matches('#btn-reset')) return;
        engine.reset();
        updateStatsCard(engine.getState());
        updateJackpotBar(0);
        showMpNotification('CREDITS RESET TO 1000');
    });

    // Save score button
    document.addEventListener('click', (e) => {
        if (!e.target.matches('#btn-save-score')) return;
        const nameInput = document.getElementById('player-name-input');
        const name = nameInput ? nameInput.value.trim().toUpperCase() || 'GHOST' : 'GHOST';
        const lb = engine.saveScore(name);
        renderLeaderboard(lb);
        showMpNotification(`SCORE SAVED: ${name}`);
    });

    // Sound toggle
    let soundEnabled = true;
    document.addEventListener('click', (e) => {
        if (!e.target.matches('#btn-sound')) return;
        soundEnabled = !soundEnabled;
        e.target.textContent = soundEnabled ? '🔊 SOUND ON' : '🔇 SOUND OFF';
        e.target.classList.toggle('btn-muted', !soundEnabled);
        window._soundEnabled = soundEnabled;
    });

    // ── Multiplayer Controls ──────────────────────────────────────────────────

    document.addEventListener('click', async (e) => {
        if (!e.target.matches('#btn-create-room')) return;
        const btn = e.target;
        btn.disabled = true;
        btn.textContent = '[ CREATING... ]';
        try {
            const code = await mp.createRoom();
            const display = document.getElementById('mp-room-code-display');
            if (display) display.textContent = code;
            showMpNotification(`ROOM CREATED: ${code}`);
        } catch (err) {
            showMpNotification('ROOM CREATION FAILED — CHECK NETWORK');
        }
        btn.disabled = false;
        btn.textContent = '[ CREATE ROOM ]';
    });

    document.addEventListener('click', async (e) => {
        if (!e.target.matches('#btn-join-room')) return;
        const codeInput = document.getElementById('mp-join-code-input');
        const code = codeInput ? codeInput.value.trim().toUpperCase() : '';
        if (!code) { showMpNotification('ENTER A ROOM CODE'); return; }

        e.target.disabled = true;
        e.target.textContent = '[ JOINING... ]';
        try {
            await mp.joinRoom(code);
            showMpNotification(`JOINED ROOM: ${code}`);
        } catch (err) {
            showMpNotification('JOIN FAILED — INVALID ROOM CODE');
        }
        e.target.disabled = false;
        e.target.textContent = '[ JOIN ROOM ]';
    });

    document.addEventListener('click', (e) => {
        if (!e.target.matches('#btn-copy-code')) return;
        const code = document.getElementById('mp-room-code-display')?.textContent;
        if (code && code !== '---') {
            navigator.clipboard.writeText(code).then(() => showMpNotification('CODE COPIED'));
        }
    });

    // ── Multiplayer Events ────────────────────────────────────────────────────

    mp.on('connected', () => updateMultiplayerCard(mp.getState()));
    mp.on('disconnected', () => {
        updateMultiplayerCard(mp.getState());
        showMpNotification('OPPONENT DISCONNECTED');
    });
    mp.on('opponent-joined', (data) => {
        updateMultiplayerCard(mp.getState());
        showMpNotification(`${data.name} ENTERED THE FIELD`);
    });
    mp.on('score-update', () => updateMultiplayerCard(mp.getState()));
    mp.on('timer-update', () => updateMultiplayerCard(mp.getState()));
    mp.on('win-notification', ({ name, amount }) => {
        showMpNotification(`${name} WON +${amount} CR`);
    });
    mp.on('match-end', (data) => {
        const msg = data.result === 'win' ? '🏆 MISSION COMPLETE — YOU WIN!' : '💀 MISSION FAILED — OPPONENT WINS';
        showMpNotification(msg);
        updateMultiplayerCard(mp.getState());
    });
    mp.on('error', ({ message }) => showMpNotification(`ERROR: ${message}`));

    // ── Loading Screen ────────────────────────────────────────────────────────
    setTimeout(hideLoadingScreen, 2000);
}

// ── Sound System ─────────────────────────────────────────────────────────────

const SOUNDS = {};
window._soundEnabled = true;

function loadSounds() {
    // Sounds are placeholders — add .mp3 files to src/assets/sounds/ to enable
    const files = { spin: 'spin.mp3', win: 'win.mp3', bigwin: 'bigwin.mp3' };
    for (const [key, file] of Object.entries(files)) {
        const audio = new Audio(`src/assets/sounds/${file}`);
        audio.preload = 'auto';
        audio.volume = 0.5;
        SOUNDS[key] = audio;
    }
}

function playSound(name) {
    if (!window._soundEnabled) return;
    const sound = SOUNDS[name];
    if (!sound) return;
    sound.currentTime = 0;
    sound.play().catch(() => { }); // ignore autoplay policy errors
}

// ── Start ────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
    loadSounds();
    init();
});
