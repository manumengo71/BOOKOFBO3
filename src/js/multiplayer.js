/**
 * multiplayer.js
 * PeerJS-based multiplayer: room creation, joining, score sync, and timer.
 * BOOKOFBO3 - Futuristic Military Slot Engine
 */

const MATCH_DURATION = 180; // 3 minutes in seconds
const PEER_CONFIG = {
    // Uses free PeerJS cloud server (no server setup needed)
    debug: 0
};

export class MultiplayerManager {
    constructor() {
        this.peer = null;
        this.conn = null;
        this.roomCode = null;
        this.isHost = false;
        this.myName = 'GHOST_' + Math.floor(Math.random() * 9000 + 1000);
        this.myCredits = 1000;
        this.oppCredits = null;
        this.oppName = null;
        this.timeLeft = MATCH_DURATION;
        this.timerInterval = null;
        this.connected = false;
        this.listeners = {};
    }

    on(event, cb) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(cb);
    }

    _emit(event, data) {
        (this.listeners[event] || []).forEach(cb => cb(data));
    }

    /**
     * Generates a 6-character alphanumeric room code.
     */
    _generateRoomCode() {
        return 'BO3-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    }

    /**
     * Creates a new room (host side).
     * @returns {Promise<string>} room code
     */
    createRoom() {
        return new Promise((resolve, reject) => {
            this.isHost = true;
            this.roomCode = this._generateRoomCode();

            try {
                this.peer = new Peer(this.roomCode, PEER_CONFIG);
            } catch (e) {
                reject(new Error('PeerJS not available. Check network connection.'));
                return;
            }

            this.peer.on('open', (id) => {
                this._emit('room-created', { roomCode: id });
                resolve(id);
            });

            this.peer.on('connection', (conn) => {
                this.conn = conn;
                this._setupConnection(conn);
            });

            this.peer.on('error', (err) => {
                this._emit('error', { message: err.message });
                reject(err);
            });
        });
    }

    /**
     * Joins an existing room by code.
     * @param {string} roomCode
     */
    joinRoom(roomCode) {
        return new Promise((resolve, reject) => {
            this.isHost = false;
            this.roomCode = roomCode;

            try {
                this.peer = new Peer(null, PEER_CONFIG);
            } catch (e) {
                reject(new Error('PeerJS not available.'));
                return;
            }

            this.peer.on('open', () => {
                const conn = this.peer.connect(roomCode);
                this.conn = conn;
                this._setupConnection(conn);

                conn.on('open', () => {
                    this._emit('connected', { roomCode });
                    resolve(roomCode);
                });

                conn.on('error', (err) => {
                    reject(err);
                });
            });

            this.peer.on('error', (err) => {
                this._emit('error', { message: err.message });
                reject(err);
            });
        });
    }

    _setupConnection(conn) {
        conn.on('open', () => {
            this.connected = true;
            // Send initial hello with name and credits
            this._send({ type: 'hello', name: this.myName, credits: this.myCredits });
            this._emit('connected', { roomCode: this.roomCode });

            // Host starts the match timer
            if (this.isHost) {
                this._startTimer();
            }
        });

        conn.on('data', (data) => {
            this._handleMessage(data);
        });

        conn.on('close', () => {
            this.connected = false;
            clearInterval(this.timerInterval);
            this._emit('disconnected', {});
        });
    }

    _handleMessage(data) {
        switch (data.type) {
            case 'hello':
                this.oppName = data.name;
                this.oppCredits = data.credits;
                this._emit('opponent-joined', { name: data.name, credits: data.credits });
                // Guest receives the timer sync from host
                break;

            case 'score-update':
                this.oppCredits = data.credits;
                this._emit('score-update', { oppCredits: data.credits });
                break;

            case 'timer-sync':
                if (!this.isHost) {
                    this.timeLeft = data.timeLeft;
                    this._emit('timer-update', { timeLeft: data.timeLeft });
                }
                break;

            case 'match-end':
                clearInterval(this.timerInterval);
                this._emit('match-end', data);
                break;

            case 'win-notification':
                this._emit('win-notification', { name: this.oppName, amount: data.amount });
                break;
        }
    }

    _send(data) {
        if (this.conn && this.conn.open) {
            this.conn.send(data);
        }
    }

    /**
     * Syncs local credits to opponent after a spin.
     * @param {number} credits
     * @param {number|null} winAmount - if won, the amount
     */
    syncCredits(credits, winAmount = null) {
        this.myCredits = credits;
        this._send({ type: 'score-update', credits });
        if (winAmount) {
            this._send({ type: 'win-notification', amount: winAmount });
        }
    }

    _startTimer() {
        this.timeLeft = MATCH_DURATION;
        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            this._send({ type: 'timer-sync', timeLeft: this.timeLeft });
            this._emit('timer-update', { timeLeft: this.timeLeft });

            if (this.timeLeft <= 0) {
                clearInterval(this.timerInterval);
                const result = this.myCredits > (this.oppCredits || 0) ? 'win' : 'lose';
                const endData = {
                    result,
                    myCredits: this.myCredits,
                    oppCredits: this.oppCredits,
                    winner: result === 'win' ? this.myName : this.oppName
                };
                this._send({ type: 'match-end', ...endData });
                this._emit('match-end', endData);
            }
        }, 1000);
    }

    disconnect() {
        clearInterval(this.timerInterval);
        if (this.conn) this.conn.close();
        if (this.peer) this.peer.destroy();
        this.connected = false;
        this.conn = null;
        this.peer = null;
    }

    getState() {
        return {
            connected: this.connected,
            roomCode: this.roomCode,
            myName: this.myName,
            myCredits: this.myCredits,
            oppName: this.oppName,
            oppCredits: this.oppCredits,
            timeLeft: this.timeLeft
        };
    }
}
