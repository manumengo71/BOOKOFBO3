/**
 * animations.js
 * JS-driven animation helpers for reel spins, win effects, and glitch FX.
 * BOOKOFBO3 - Futuristic Military Slot Engine
 */

/**
 * Triggers the spinning animation on reel columns.
 * Each reel starts and stops with a staggered delay.
 * @param {NodeList} reelEls - Array of reel DOM elements
 * @param {number} duration - total spin duration in ms
 * @returns {Promise} resolves when all reels have stopped
 */
export function spinReels(reelEls, duration = 2500) {
    return new Promise((resolve) => {
        const promises = Array.from(reelEls).map((reel, i) => {
            return new Promise((res) => {
                const delay = i * 150;
                const stopDelay = duration + i * 200;

                setTimeout(() => {
                    reel.classList.add('spinning');
                }, delay);

                setTimeout(() => {
                    reel.classList.remove('spinning');
                    reel.classList.add('stopping');
                    setTimeout(() => {
                        reel.classList.remove('stopping');
                        res();
                    }, 300);
                }, stopDelay);
            });
        });

        Promise.all(promises).then(resolve);
    });
}

/**
 * Flashes a win glow on winning symbol cells.
 * @param {Array} positions - Array of { reel, row }
 * @param {string} color - CSS color string
 * @param {string} gridId - ID of the grid container
 */
export function glowWinSymbols(positions, color, gridId = 'reels-grid') {
    const grid = document.getElementById(gridId);
    if (!grid) return;

    const cells = grid.querySelectorAll('.reel-cell');
    // Clear previous glows
    cells.forEach(c => {
        c.classList.remove('cell-win');
        c.style.removeProperty('--win-color');
    });

    positions.forEach(({ reel, row }) => {
        const index = reel * 3 + row;
        const cell = cells[index];
        if (cell) {
            cell.style.setProperty('--win-color', color);
            cell.classList.add('cell-win');
        }
    });
}

/**
 * Clears all win glows from the grid.
 */
export function clearWinGlows(gridId = 'reels-grid') {
    const grid = document.getElementById(gridId);
    if (!grid) return;
    grid.querySelectorAll('.cell-win').forEach(c => {
        c.classList.remove('cell-win');
        c.style.removeProperty('--win-color');
    });
}

/**
 * Triggers the digital glitch / explosion animation for big wins.
 * @param {HTMLElement} container
 */
export function triggerBigWinEffect(container) {
    if (!container) return;
    container.classList.add('big-win-active');
    setTimeout(() => {
        container.classList.remove('big-win-active');
    }, 3000);
}

/**
 * Triggers a screen glitch flash effect.
 */
export function triggerGlitch() {
    const overlay = document.getElementById('glitch-overlay');
    if (!overlay) return;
    overlay.classList.add('glitch-active');
    setTimeout(() => overlay.classList.remove('glitch-active'), 600);
}

/**
 * Animates a credit counter incrementing from current to target.
 * @param {HTMLElement} el - element to update
 * @param {number} from - starting value
 * @param {number} to - target value
 * @param {number} duration - animation length in ms
 */
export function animateCounter(el, from, to, duration = 800) {
    if (!el) return;
    const start = performance.now();
    const delta = to - from;

    function step(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        el.textContent = Math.round(from + delta * eased);
        if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
}

/**
 * Spawns floating +PAYOUT particles on win.
 * @param {number} amount - the payout value
 * @param {HTMLElement} anchor - element to spawn near
 */
export function spawnWinParticles(amount, anchor) {
    if (!anchor) return;
    const rect = anchor.getBoundingClientRect();
    const count = Math.min(8, Math.ceil(amount / 50));

    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'win-particle';
        particle.textContent = `+${amount}`;
        particle.style.left = `${rect.left + rect.width / 2 + (Math.random() - 0.5) * 120}px`;
        particle.style.top = `${rect.top + rect.height / 2}px`;
        particle.style.setProperty('--dx', `${(Math.random() - 0.5) * 80}px`);
        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), 1200);
    }
}
