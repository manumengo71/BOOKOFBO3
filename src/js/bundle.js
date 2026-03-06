/* ============================================================
   BOOKOFBO3 — bundle.js
   Single IIFE — no ES modules — works with file://
   BO3 Theme | Liquid Divinium Jackpot | Real-time Animations
   ============================================================ */
(function () {
    'use strict';

    // ── CONFIG ──────────────────────────────────────────────────
    var SPIN_COST = 50;
    var STARTING_CREDITS = 1000;
    var RC = 5, RW = 3; // reel count, row count
    var FS_BY_SCATTER = { 3: 10, 4: 15, 5: 20 };
    var FS_MULTIPLIER = 3;
    var MAX_MULT = 5;

    // ── SVG SYMBOLS ──────────────────────────────────────────────
    var SVG = {
        divinium: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M25 10h14M26 14h12M26 14v22q0 18 6 18t6-18V14"/><ellipse cx="32" cy="44" rx="5" ry="8" fill="currentColor" opacity=".35"/><circle cx="29" cy="41" r="2" fill="currentColor" opacity=".65"/><circle cx="35" cy="36" r="1.5" fill="currentColor" opacity=".5"/><circle cx="30" cy="48" r="1" fill="currentColor" opacity=".75"/></svg>',
        gobblegum: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="32" cy="38" r="18"/><path d="M32 20l2 -7 3 7 6-2-3.5 5 2.5 6-6.5-4L32 31l-2.5-6-6.5 4 2.5-6L22 18z" fill="currentColor" opacity=".9" stroke="none"/><circle cx="26" cy="36" r="3" fill="currentColor" opacity=".25"/><circle cx="38" cy="43" r="2" fill="currentColor" opacity=".2"/></svg>',
        raygun: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="22" y="22" width="30" height="14" rx="4"/><path d="M22 26l-14 4 4 6h10"/><circle cx="44" cy="29" r="5"/><circle cx="44" cy="29" r="2" fill="currentColor" opacity=".8"/><line x1="49" y1="29" x2="58" y2="29"/><rect x="28" y="36" width="10" height="8" rx="2"/></svg>',
        monkey_bomb: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="32" cy="36" r="18"/><path d="M20 22q-8-10 0-14q-2 8 6 10"/><path d="M44 22q8-10 0-14q2 8-6 10"/><ellipse cx="25" cy="34" rx="4" ry="5" fill="currentColor" opacity=".85"/><ellipse cx="39" cy="34" rx="4" ry="5" fill="currentColor" opacity=".85"/><circle cx="25" cy="32" r="1.5" fill="white" opacity=".7"/><circle cx="39" cy="32" r="1.5" fill="white" opacity=".7"/><ellipse cx="32" cy="44" rx="7" ry="3.5"/><line x1="32" y1="18" x2="32" y2="11"/><circle cx="32" cy="9" r="3" fill="currentColor"/></svg>',
        zombie: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><ellipse cx="32" cy="26" rx="18" ry="20"/><rect x="21" y="42" width="22" height="12" rx="2"/><line x1="28" y1="42" x2="28" y2="54"/><line x1="36" y1="42" x2="36" y2="54"/><path d="M22 24l4-4 4 4M34 24l4-4 4 4" stroke-width="1.5"/><ellipse cx="26" cy="29" rx="4" ry="5" fill="currentColor" opacity=".85"/><ellipse cx="38" cy="29" rx="4" ry="5" fill="currentColor" opacity=".85"/><path d="M28 38q4-5 8 0"/><path d="M32 10l-1 6 2 5-2 5" stroke-width="1.5" opacity=".5"/></svg>',
        power_core: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polygon points="32,6 54,22 54,42 32,58 10,42 10,22"/><polygon points="32,18 46,28 46,36 32,46 18,36 18,28" opacity=".45"/><circle cx="32" cy="32" r="8"/><circle cx="32" cy="32" r="3" fill="currentColor" opacity=".9"/><line x1="32" y1="18" x2="32" y2="24"/><line x1="32" y1="40" x2="32" y2="46"/><line x1="18" y1="32" x2="24" y2="32"/><line x1="40" y1="32" x2="46" y2="32"/></svg>'
    };

    var SYMBOLS = [
        { id: 'divinium', name: 'DIVINIUM', weight: 3, isWild: true, isScatter: true, payouts: { 2: 50, 3: 500, 4: 2000, 5: 5000 }, color: '#bf5fff', svg: SVG.divinium },
        { id: 'gobblegum', name: 'GOBBLE GUM', weight: 6, payouts: { 3: 200, 4: 500, 5: 1500 }, color: '#ff69d4', svg: SVG.gobblegum },
        { id: 'raygun', name: 'RAY GUN', weight: 12, payouts: { 3: 100, 4: 250, 5: 600 }, color: '#00cfff', svg: SVG.raygun },
        { id: 'monkey_bomb', name: 'MONKEY BOMB', weight: 20, payouts: { 3: 50, 4: 120, 5: 300 }, color: '#f5a623', svg: SVG.monkey_bomb },
        { id: 'zombie', name: 'ZOMBIE', weight: 28, payouts: { 3: 25, 4: 75, 5: 200 }, color: '#39ff14', svg: SVG.zombie },
        { id: 'power_core', name: 'POWER CORE', weight: 31, payouts: { 3: 10, 4: 30, 5: 80 }, color: '#8ab8d0', svg: SVG.power_core }
    ];

    var TOTAL_W = SYMBOLS.reduce(function (s, x) { return s + x.weight; }, 0);

    function rndSym() {
        var r = Math.random() * TOTAL_W;
        for (var i = 0; i < SYMBOLS.length; i++) { r -= SYMBOLS[i].weight; if (r <= 0) return SYMBOLS[i]; }
        return SYMBOLS[SYMBOLS.length - 1];
    }

    var WIN_LINES = [
        [1, 1, 1, 1, 1], [0, 0, 0, 0, 0], [2, 2, 2, 2, 2],
        [0, 1, 2, 1, 0], [2, 1, 0, 1, 2],
        [0, 0, 1, 2, 2], [2, 2, 1, 0, 0], [1, 0, 0, 0, 1]
    ];

    // ── STATE ───────────────────────────────────────────────────
    var G = {
        credits: STARTING_CREDITS, winStreak: 0, multiplier: 1,
        totalWins: 0, totalSpins: 0, jackpotPct: 0,
        freeLeft: 0, freeTotal: 0, expandSym: null, freeWon: 0,
        leaderboard: (function () { try { return JSON.parse(localStorage.getItem('bo3_lb')) || []; } catch (e) { return []; } })()
    };

    function genGrid() {
        return Array.from({ length: RC }, function () {
            return Array.from({ length: RW }, function () { return rndSym(); });
        });
    }

    function countScatter(grid) {
        var n = 0;
        for (var r = 0; r < RC; r++) for (var row = 0; row < RW; row++) if (grid[r][row].isScatter) n++;
        return n;
    }

    function applyExpand(grid, sym) {
        return grid.map(function (reel) {
            var has = reel.some(function (s) { return s.id === sym.id || s.isWild; });
            return has ? [sym, sym, sym] : reel;
        });
    }

    function evalWins(grid, mult) {
        var wins = [];
        for (var li = 0; li < WIN_LINES.length; li++) {
            var line = WIN_LINES[li];
            var syms = line.map(function (row, r) { return grid[r][row]; });
            var base = syms.find(function (s) { return !s.isWild; }) || syms[0];
            var count = 0, pos = [];
            for (var i = 0; i < syms.length; i++) {
                if (syms[i].id === base.id || syms[i].isWild) { count++; pos.push({ reel: i, row: line[i] }); } else break;
            }
            var minC = base.isScatter ? 2 : 3;
            if (count >= minC) {
                var pay = (base.payouts[count] || 0) * mult;
                if (pay > 0) wins.push({ lineIndex: li, symbol: base, count: count, payout: pay, positions: pos });
            }
        }
        return wins;
    }

    function pickExpandSym() {
        var ns = SYMBOLS.filter(function (s) { return !s.isScatter; });
        return ns[Math.floor(Math.random() * ns.length)];
    }

    function doSpin(isFree) {
        if (!isFree) { G.credits -= SPIN_COST; G.totalSpins++; G.jackpotPct = Math.min(100, G.jackpotPct + Math.random() * 3 + 0.5); }
        else { G.freeLeft--; }

        var grid = genGrid();
        var mult = isFree ? FS_MULTIPLIER : G.multiplier;
        var expandedReels = [];

        if (isFree && G.expandSym) {
            grid = applyExpand(grid, G.expandSym);
            grid.forEach(function (reel, i) {
                if (reel[0].id === G.expandSym.id) expandedReels.push(i);
            });
        }

        var sc = countScatter(grid);
        var wins = evalWins(grid, mult);
        var payout = wins.reduce(function (s, w) { return s + w.payout; }, 0);
        G.credits += payout; G.totalWins += payout;

        if (!isFree) {
            if (payout > 0) { G.winStreak++; G.multiplier = Math.min(MAX_MULT, 1 + Math.floor(G.winStreak / 3)); }
            else { G.winStreak = 0; G.multiplier = 1; }
        } else {
            G.freeWon += payout;
            if (sc >= 3) { var bonus = FS_BY_SCATTER[Math.min(sc, 5)] || 10; G.freeLeft += bonus; G.freeTotal += bonus; showNotif('🔁 RETRIGGER! +' + bonus + ' FREE SPINS'); }
        }

        var triggered = false;
        if (!isFree && sc >= 3) {
            G.freeLeft = FS_BY_SCATTER[Math.min(sc, 5)] || 10;
            G.freeTotal = G.freeLeft; G.freeWon = 0;
            G.expandSym = pickExpandSym();
            triggered = true;
        }

        return { grid: grid, wins: wins, payout: payout, sc: sc, triggered: triggered, expandedReels: expandedReels, isFree: isFree };
    }

    // ── SOUND ────────────────────────────────────────────────────
    var audioCtx = null;
    var soundOn = true;

    function getCtx() { if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)(); return audioCtx; }

    function beep(freq, dur, vol, type, delay) {
        if (!soundOn) return;
        try {
            var ctx = getCtx(), o = ctx.createOscillator(), g = ctx.createGain();
            o.connect(g); g.connect(ctx.destination);
            o.type = type || 'sine'; o.frequency.value = freq;
            var t = ctx.currentTime + (delay || 0);
            g.gain.setValueAtTime(vol || 0.3, t);
            g.gain.exponentialRampToValueAtTime(0.001, t + dur);
            o.start(t); o.stop(t + dur);
        } catch (e) { }
    }

    function playSound(name) {
        if (name === 'spin') { for (var i = 0; i < 3; i++) beep(120 + i * 40, 0.08, 0.15, 'sawtooth', i * 0.05); }
        if (name === 'tick') { beep(300, 0.04, 0.1, 'square'); }
        if (name === 'win') { beep(440, 0.1, 0.3, 'sine'); setTimeout(function () { beep(550, 0.15, 0.3, 'sine'); }, 100); setTimeout(function () { beep(660, 0.2, 0.3, 'sine'); }, 200); }
        if (name === 'bigwin') {
            [440, 550, 660, 880].forEach(function (f, i) { beep(f, 0.2, 0.4, 'sine', i * 0.1); });
            setTimeout(function () { [880, 1100, 1320].forEach(function (f, i) { beep(f, 0.3, 0.35, 'sine', i * 0.08); }); }, 500);
        }
        if (name === 'freespin') { [300, 400, 500, 600, 700].forEach(function (f, i) { beep(f, 0.15, 0.35, 'triangle', i * 0.07); }); }
    }

    // ── DOM HELPERS ──────────────────────────────────────────────
    function qs(id) { return document.getElementById(id); }

    function setCell(cell, sym, expanded) {
        cell.innerHTML = '<div class="symbol-icon" style="color:' + sym.color + '">' + sym.svg + '</div><span class="symbol-label" style="color:' + sym.color + '">' + sym.name + '</span>';
        cell.dataset.symId = sym.id;
        if (expanded) cell.classList.add('cell-expanded');
        else cell.classList.remove('cell-expanded');
    }

    function buildGrid() {
        var c = qs('reels-grid'); if (!c) return;
        c.innerHTML = '';
        for (var r = 0; r < RC; r++) {
            var col = document.createElement('div');
            col.className = 'reel-column'; col.dataset.reel = r;
            for (var row = 0; row < RW; row++) {
                var cell = document.createElement('div');
                cell.className = 'reel-cell'; cell.dataset.reel = r; cell.dataset.row = row;
                col.appendChild(cell);
            }
            c.appendChild(col);
        }
    }

    // ── REEL ANIMATION ───────────────────────────────────────────
    // Credits deduct instantly. Reels cycle random symbols then snap to final.
    function runSpin(finalResult, onDone) {
        var cols = Array.from(document.querySelectorAll('.reel-column'));
        var intervals = [];
        var stopped = 0;
        var STOP_BASE = 1000, STAGGER = 320;

        cols.forEach(function (col, ri) {
            var cells = Array.from(col.querySelectorAll('.reel-cell'));
            col.classList.add('spinning');
            var iv = setInterval(function () {
                playSound('tick');
                cells.forEach(function (cell) { setCell(cell, rndSym()); });
            }, 90);
            intervals.push(iv);

            setTimeout(function () {
                clearInterval(intervals[ri]);
                col.classList.remove('spinning');
                col.classList.add('stopping');

                var isExpanded = finalResult.expandedReels.indexOf(ri) > -1;
                var reelSyms = finalResult.grid[ri];
                cells.forEach(function (cell, row) {
                    setCell(cell, reelSyms[row], isExpanded);
                });
                if (isExpanded) col.classList.add('reel-expanded');
                else col.classList.remove('reel-expanded');

                setTimeout(function () { col.classList.remove('stopping'); }, 380);
                stopped++;
                if (stopped === cols.length) setTimeout(onDone, 150);
            }, STOP_BASE + ri * STAGGER);
        });
    }

    // ── UI UPDATES ───────────────────────────────────────────────
    function animCount(el, from, to) {
        if (!el) return;
        var diff = to - from, start = performance.now(), dur = 600;
        function step(now) {
            var p = Math.min((now - start) / dur, 1), ease = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(from + diff * ease);
            if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }

    var prevCredits = STARTING_CREDITS;
    function updateStats() {
        var credEl = qs('stat-credits');
        if (credEl) { animCount(credEl, prevCredits, G.credits); prevCredits = G.credits; }
        var stEl = qs('stat-streak'); if (stEl) stEl.textContent = G.winStreak;
        var mEl = qs('stat-multiplier');
        if (mEl) { mEl.textContent = 'x' + G.multiplier; mEl.className = 'value-md' + (G.multiplier > 1 ? ' mult-active' : ''); }
        var jEl = qs('jackpot-fill'); if (jEl) jEl.style.width = G.jackpotPct + '%';
        var fsEl = qs('fs-counter'); if (fsEl) fsEl.textContent = G.freeLeft > 0 ? G.freeLeft + ' FREE SPINS' : '';
    }

    function showWin(payout, wins, isBig) {
        var banner = qs('win-banner'), txt = qs('win-banner-text'); if (!banner || !txt) return;
        clearTimeout(banner._t);
        txt.textContent = isBig ? '⚡ MEGA WIN! +' + payout + ' CREDITS ⚡' : 'WIN! +' + payout + ' CREDENTIALS';
        banner.className = 'win-banner ' + (isBig ? 'big-win-banner' : 'small-win-banner');
        banner.classList.remove('hidden');
        // Glow winning cells
        clearWinGlow();
        if (wins) wins.forEach(function (w) {
            w.positions.forEach(function (p) {
                var idx = p.reel * RW + p.row;
                var cells = document.querySelectorAll('.reel-cell');
                if (cells[idx]) { cells[idx].style.setProperty('--wc', w.symbol.color); cells[idx].classList.add('cell-win'); }
            });
        });
        if (isBig) trigGlitch();
        banner._t = setTimeout(function () { banner.classList.add('hidden'); clearWinGlow(); }, isBig ? 4500 : 2500);
    }

    function clearWinGlow() {
        document.querySelectorAll('.cell-win').forEach(function (c) { c.classList.remove('cell-win'); c.style.removeProperty('--wc'); });
    }

    function trigGlitch() {
        var o = qs('glitch-overlay'); if (!o) return;
        o.classList.add('glitch-active');
        setTimeout(function () { o.classList.remove('glitch-active'); }, 700);
    }

    function showNotif(msg) {
        var n = qs('mp-notification'); if (!n) return;
        n.textContent = msg; n.classList.remove('hidden');
        clearTimeout(n._t);
        n._t = setTimeout(function () { n.classList.add('hidden'); }, 3200);
    }

    function spawnParticles(amount, anchor) {
        if (!anchor) return;
        var rect = anchor.getBoundingClientRect();
        for (var i = 0; i < Math.min(6, Math.ceil(amount / 80)); i++) {
            var p = document.createElement('div');
            p.className = 'win-particle';
            p.textContent = '+' + amount;
            p.style.left = (rect.left + rect.width / 2 + (Math.random() - .5) * 100) + 'px';
            p.style.top = (rect.top + rect.height / 2) + 'px';
            p.style.setProperty('--dx', (Math.random() - .5) * 80 + 'px');
            document.body.appendChild(p);
            setTimeout(function () { p.remove(); }, 1300);
        }
    }

    // ── LEADERBOARD ──────────────────────────────────────────────
    function saveLB(name) {
        var entry = { name: name || 'GHOST', credits: G.credits, streak: G.winStreak, date: new Date().toLocaleDateString() };
        G.leaderboard.push(entry);
        G.leaderboard.sort(function (a, b) { return b.credits - a.credits; });
        G.leaderboard = G.leaderboard.slice(0, 10);
        try { localStorage.setItem('bo3_lb', JSON.stringify(G.leaderboard)); } catch (e) { }
        renderLB();
    }

    function renderLB() {
        var list = qs('leaderboard-list'); if (!list) return;
        if (!G.leaderboard.length) { list.innerHTML = '<li class="lb-empty">NO DATA ON FILE</li>'; return; }
        list.innerHTML = G.leaderboard.map(function (e, i) {
            return '<li class="lb-entry' + (i === 0 ? ' lb-top' : '') + '"><span class="lb-rank">#' + (i + 1) + '</span><span class="lb-name">' + e.name + '</span><span class="lb-score">' + e.credits + ' CR</span><span class="lb-date">' + e.date + '</span></li>';
        }).join('');
    }

    // ── FREE SPINS OVERLAY ───────────────────────────────────────
    function showFSIntro(sym, count, onStart) {
        var ov = qs('fs-overlay'); if (!ov) return;
        qs('fs-sym-preview').innerHTML = '<div class="symbol-icon" style="color:' + sym.color + ';width:80px;height:80px;">' + sym.svg + '</div>';
        qs('fs-sym-name').textContent = sym.name;
        qs('fs-count-text').textContent = count + ' FREE SPINS';
        ov.classList.remove('hidden');
        playSound('freespin');
        qs('fs-start-btn').onclick = function () {
            ov.classList.add('hidden');
            onStart();
        };
    }

    function showFSEnd(totalWon) {
        showNotif('🏆 FREE SPINS ENDED — WON ' + totalWon + ' CREDITS!');
        updateStats();
    }

    // ── MULTIPLAYER ──────────────────────────────────────────────
    var mp = {
        peer: null, conn: null, isHost: false, roomCode: null,
        myName: 'GHOST_' + Math.floor(Math.random() * 9000 + 1000),
        myCredits: STARTING_CREDITS, oppCredits: null, oppName: null,
        timeLeft: 180, timerInt: null, connected: false,

        send: function (data) { if (this.conn && this.conn.open) this.conn.send(data); },

        updateUI: function () {
            var myN = qs('mp-my-name'), myC = qs('mp-my-credits'), oppN = qs('mp-opp-name'), oppC = qs('mp-opp-credits'), tim = qs('mp-timer'), st = qs('mp-status');
            if (myN) myN.textContent = this.myName;
            if (myC) myC.textContent = this.myCredits + ' CR';
            if (oppN) oppN.textContent = this.oppName || '---';
            if (oppC) oppC.textContent = this.oppCredits !== null ? this.oppCredits + ' CR' : '---';
            if (tim) { var m = Math.floor(this.timeLeft / 60), s = String(this.timeLeft % 60).padStart(2, '0'); tim.textContent = m + ':' + s; }
            if (st) { st.textContent = this.connected ? 'LINKED' : 'OFFLINE'; st.className = 'mp-status-badge ' + (this.connected ? 'status-online' : 'status-offline'); }
        },

        sync: function (credits, wonAmt) {
            this.myCredits = credits;
            this.send({ type: 'score', credits: credits });
            if (wonAmt) this.send({ type: 'win', amount: wonAmt });
        },

        createRoom: function (cb) {
            var self = this;
            if (typeof Peer === 'undefined') { showNotif('PEERJS NOT AVAILABLE'); return; }
            this.isHost = true;
            this.roomCode = 'BO3-' + Math.random().toString(36).substring(2, 8).toUpperCase();
            this.peer = new Peer(this.roomCode);
            this.peer.on('open', function (id) { var d = qs('mp-room-code-display'); if (d) d.textContent = id; cb && cb(id); });
            this.peer.on('connection', function (conn) { self.conn = conn; self._setup(conn); });
            this.peer.on('error', function (e) { showNotif('PEER ERROR: ' + e.message); });
        },

        joinRoom: function (code, cb) {
            var self = this;
            if (typeof Peer === 'undefined') { showNotif('PEERJS NOT AVAILABLE'); return; }
            this.isHost = false; this.roomCode = code;
            this.peer = new Peer(null);
            this.peer.on('open', function () {
                var conn = self.peer.connect(code);
                self.conn = conn; self._setup(conn);
                conn.on('open', function () { cb && cb(code); });
                conn.on('error', function (e) { showNotif('JOIN FAILED: ' + e.message); });
            });
            this.peer.on('error', function (e) { showNotif('PEER ERROR: ' + e.message); });
        },

        _setup: function (conn) {
            var self = this;
            conn.on('open', function () {
                self.connected = true;
                self.send({ type: 'hello', name: self.myName, credits: self.myCredits });
                self.updateUI();
                if (self.isHost) self._startTimer();
            });
            conn.on('data', function (d) {
                if (d.type === 'hello') { self.oppName = d.name; self.oppCredits = d.credits; showNotif(d.name + ' CONNECTED'); }
                if (d.type === 'score') { self.oppCredits = d.credits; }
                if (d.type === 'win') { showNotif((self.oppName || 'OPPONENT') + ' WON +' + d.amount + ' CR'); }
                if (d.type === 'tick') { if (!self.isHost) { self.timeLeft = d.t; } }
                if (d.type === 'end') { clearInterval(self.timerInt); showNotif(d.winner + ' WINS THE MATCH!'); }
                self.updateUI();
            });
            conn.on('close', function () { self.connected = false; self.updateUI(); showNotif('OPPONENT DISCONNECTED'); });
        },

        _startTimer: function () {
            var self = this;
            self.timeLeft = 180;
            self.timerInt = setInterval(function () {
                self.timeLeft--;
                self.send({ type: 'tick', t: self.timeLeft });
                self.updateUI();
                if (self.timeLeft <= 0) {
                    clearInterval(self.timerInt);
                    var winner = self.myCredits > (self.oppCredits || 0) ? self.myName : (self.oppName || 'OPPONENT');
                    self.send({ type: 'end', winner: winner });
                    showNotif('MATCH OVER — ' + winner + ' WINS!');
                }
            }, 1000);
        }
    };

    // ── MAIN SPIN FLOW ───────────────────────────────────────────
    var spinning = false;

    function executeSpin(isFree) {
        if (spinning) return;
        if (!isFree && G.credits < SPIN_COST) { showNotif('INSUFFICIENT CREDITS'); return; }
        spinning = true;
        clearWinGlow();
        var ban = qs('win-banner'); if (ban) ban.classList.add('hidden');

        // Deduct immediately
        if (!isFree) { G.credits -= SPIN_COST; updateStats(); }

        var spinBtn = qs('spin-btn');
        if (spinBtn) { spinBtn.disabled = true; spinBtn.textContent = '[ DEPLOYING... ]'; }
        playSound('spin');

        var result = doSpin(isFree);

        runSpin(result, function () {
            // All reels stopped — now show results
            updateStats();

            var isBig = result.wins.some(function (w) { return w.payout >= 500; });
            if (result.payout > 0) {
                playSound(isBig ? 'bigwin' : 'win');
                showWin(result.payout, result.wins, isBig);
                spawnParticles(result.payout, spinBtn);
                mp.sync(G.credits, result.payout);
            } else {
                mp.sync(G.credits, null);
            }

            if (spinBtn) { spinBtn.disabled = false; spinBtn.textContent = G.freeLeft > 0 ? '[ FREE SPIN ]' : '[ DEPLOY SPIN ]'; }
            spinning = false;

            // Trigger free spins intro
            if (result.triggered) {
                playSound('freespin');
                showNotif('⚡ LIQUID DIVINIUM ACTIVATED — FREE SPINS!');
                setTimeout(function () {
                    showFSIntro(G.expandSym, G.freeLeft, function () { runFreeSpins(); });
                }, 1800);
            } else if (isFree && G.freeLeft > 0) {
                // Continue free spins automatically
                setTimeout(function () { executeSpin(true); }, 1200);
            } else if (isFree && G.freeLeft === 0) {
                showFSEnd(G.freeWon);
            }
        });
    }

    function runFreeSpins() {
        if (G.freeLeft > 0) executeSpin(true);
    }

    // ── INIT ─────────────────────────────────────────────────────
    document.addEventListener('DOMContentLoaded', function () {
        buildGrid();
        updateStats();
        renderLB();
        mp.updateUI();

        // Hide loading screen
        setTimeout(function () {
            var ls = qs('loading-screen');
            if (ls) { ls.classList.add('fade-out'); setTimeout(function () { ls.style.display = 'none'; }, 800); }
        }, 2200);

        // Spin button
        document.addEventListener('click', function (e) {
            var btn = e.target.closest('#spin-btn');
            if (!btn) return;
            executeSpin(G.freeLeft > 0);
        });

        // Reset
        document.addEventListener('click', function (e) {
            if (!e.target.matches('#btn-reset')) return;
            G.credits = STARTING_CREDITS; G.winStreak = 0; G.multiplier = 1;
            G.totalWins = 0; G.totalSpins = 0; G.jackpotPct = 0;
            G.freeLeft = 0; G.freeTotal = 0; G.expandSym = null;
            prevCredits = STARTING_CREDITS;
            updateStats(); showNotif('CREDITS RESTORED TO 1000');
        });

        // Sound toggle
        document.addEventListener('click', function (e) {
            if (!e.target.matches('#btn-sound')) return;
            soundOn = !soundOn;
            e.target.textContent = soundOn ? '🔊 AUDIO ON' : '🔇 AUDIO OFF';
        });

        // Save score
        document.addEventListener('click', function (e) {
            if (!e.target.matches('#btn-save-score')) return;
            var inp = qs('player-name-input');
            var name = (inp ? inp.value.trim().toUpperCase() : '') || 'GHOST';
            saveLB(name);
            showNotif('SCORE SAVED: ' + name);
        });

        // Create room
        document.addEventListener('click', function (e) {
            if (!e.target.matches('#btn-create-room')) return;
            mp.createRoom(function (code) { showNotif('ROOM CREATED: ' + code); mp.updateUI(); });
        });

        // Join room
        document.addEventListener('click', function (e) {
            if (!e.target.matches('#btn-join-room')) return;
            var inp = qs('mp-join-code-input'), code = inp ? inp.value.trim().toUpperCase() : '';
            if (!code) { showNotif('ENTER A ROOM CODE'); return; }
            mp.joinRoom(code, function (c) { showNotif('JOINED: ' + c); mp.updateUI(); });
        });

        // Copy room code
        document.addEventListener('click', function (e) {
            if (!e.target.matches('#btn-copy-code')) return;
            var code = qs('mp-room-code-display'); if (!code || code.textContent === '---') return;
            navigator.clipboard.writeText(code.textContent).then(function () { showNotif('CODE COPIED'); }).catch(function () { });
        });
    });

})(); // end IIFE
