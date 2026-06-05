/* ============================================
   신나는 게임월드 - 메인 스크립트
   Mobile-First Game Collection
   ============================================ */

// ============================================
// Game Registry
// ============================================
const GAMES = [
    {
        id: 'whack-mole',
        title: '두더지 잡기',
        emoji: '🔨',
        desc: '두더지를 망치로 잡아요!',
        badge: '🔥 인기',
        color: '#FF6B8A',
        module: 'WhackMole'
    },
    {
        id: 'memory',
        title: '카드 짝맞추기',
        emoji: '🃏',
        desc: '같은 그림을 찾아보세요!',
        badge: '🧠 두뇌',
        color: '#4DD0B7',
        module: 'MemoryGame'
    },
    {
        id: 'catch-star',
        title: '별 받기',
        emoji: '⭐',
        desc: '떨어지는 별을 바구니로 받아요!',
        badge: '✨ 신규',
        color: '#64B5F6',
        module: 'CatchStar'
    },
    {
        id: 'rps',
        title: '가위바위보',
        emoji: '✌️',
        desc: '컴퓨터와 가위바위보 대결!',
        badge: '🤝 대결',
        color: '#BA68C8',
        module: 'RPSGame'
    },
    {
        id: 'snake',
        title: '스네이크',
        emoji: '🐍',
        desc: '뱀을 키워서 최고 점수를 노려요!',
        badge: '🏆 도전',
        color: '#FFB74D',
        module: 'SnakeGame'
    },
    {
        id: 'math-quiz',
        title: '수학 퀴즈',
        emoji: '🔢',
        desc: '덧셈 뺄셈 문제를 풀어보세요!',
        badge: '📚 공부',
        color: '#FFD54F',
        module: 'MathQuiz'
    },
    {
        id: 'game2048',
        title: '2048 퍼즐',
        emoji: '🧩',
        desc: '타일을 합쳐서 2048을 만들어요!',
        badge: '✨ 신규',
        color: '#81C784',
        module: 'Game2048'
    },
    {
        id: 'bug-catch',
        title: '벌레 잡기',
        emoji: '🐛',
        desc: '도망가는 벌레를 터치해서 잡아요!',
        badge: '👆 빠른게임',
        color: '#F48FB1',
        module: 'BugCatch'
    },
    {
        id: 'tictactoe',
        title: '틱택토',
        emoji: '⭕',
        desc: '컴퓨터와 삼목 대결을 해요!',
        badge: '🧠 전략',
        color: '#FF8A65',
        module: 'TicTacToe'
    },
    {
        id: 'reaction',
        title: '반응 속도',
        emoji: '⚡',
        desc: '초록색이 되면 재빨리 눌러요!',
        badge: '🏃 순발력',
        color: '#4FC3F7',
        module: 'ReactionTime'
    },
    {
        id: 'number-baseball',
        title: '숫자 야구',
        emoji: '⚾',
        desc: '세 자리 숫자를 맞춰보세요!',
        badge: '🤔 추리',
        color: '#AED581',
        module: 'NumberBaseball'
    },
    {
        id: 'color-word',
        title: '색깔 맞추기',
        emoji: '🎨',
        desc: '글자색을 보고 맞춰요!',
        badge: '👀 집중력',
        color: '#EF5350',
        module: 'ColorWord'
    },
    {
        id: 'bubble-pop',
        title: '버블 팝',
        emoji: '🫧',
        desc: '올라오는 비눗방울을 터뜨려요!',
        badge: '👆 중독성',
        color: '#7E57C2',
        module: 'BubblePop'
    },
    {
        id: 'slide-puzzle',
        title: '슬라이드 퍼즐',
        emoji: '🧩',
        desc: '숫자를 순서대로 배열해요!',
        badge: '🤯 퍼즐',
        color: '#FFB74D',
        module: 'SlidePuzzle'
    },
    {
        id: 'speed-tap',
        title: '순발력 탭',
        emoji: '👆',
        desc: '나타나는 과녁을 최대한 빨리 터치!',
        badge: '💪 속도',
        color: '#E57373',
        module: 'SpeedTap'
    },
    {
        id: 'simon-says',
        title: '사이먼 기억력',
        emoji: '🧠',
        desc: '불빛 순서를 기억해서 따라해요!',
        badge: '🔔 기억력',
        color: '#5C6BC0',
        module: 'SimonSays'
    }
];

// ============================================
// Main Application Controller
// ============================================
const App = {
    currentGame: null,
    gameModule: null,

    init() {
        this.renderGameCards();
        this.bindEvents();
    },

    renderGameCards() {
        const grid = document.getElementById('gamesGrid');
        grid.innerHTML = GAMES.map((g, i) => `
            <div class="game-card" data-game-id="${g.id}" style="animation-delay: ${i * 0.05}s">
                <span class="game-card-badge">${g.badge}</span>
                <span class="game-card-emoji">${g.emoji}</span>
                <div class="game-card-title">${g.title}</div>
                <div class="game-card-desc">${g.desc}</div>
            </div>
        `).join('');
    },

    bindEvents() {
        // Game card clicks
        document.getElementById('gamesGrid').addEventListener('click', (e) => {
            const card = e.target.closest('.game-card');
            if (!card) return;
            const gameId = card.dataset.gameId;
            this.startGame(gameId);
        });

        // Back button
        document.getElementById('btnBack').addEventListener('click', () => {
            this.destroyGame();
            this.showMenu();
        });

        // Modal buttons
        document.getElementById('btnRetry').addEventListener('click', () => {
            this.hideModal();
            if (this.currentGame) {
                this.startGame(this.currentGame, true);
            }
        });

        document.getElementById('btnMenu').addEventListener('click', () => {
            this.hideModal();
            this.destroyGame();
            this.showMenu();
        });

        // Close modal on overlay click
        document.getElementById('modalOverlay').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                this.hideModal();
            }
        });

        // Keyboard: Esc to go back
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (document.getElementById('modalOverlay').classList.contains('active')) {
                    this.hideModal();
                } else if (document.getElementById('gameScreen').classList.contains('active')) {
                    this.destroyGame();
                    this.showMenu();
                }
            }
        });
    },

    startGame(gameId, isRetry = false) {
        const game = GAMES.find(g => g.id === gameId);
        if (!game) return;

        this.currentGame = gameId;
        const container = document.getElementById('gameContainer');
        const titleDisplay = document.getElementById('gameTitleDisplay');
        const scoreDisplay = document.getElementById('gameScoreDisplay');

        titleDisplay.textContent = `${game.emoji} ${game.title}`;
        scoreDisplay.textContent = '';
        container.innerHTML = '';

        // Show game screen
        document.getElementById('mainMenu').classList.add('hidden');
        document.getElementById('gameScreen').classList.add('active');

        // Create game instance
        switch (game.module) {
            case 'WhackMole': this.gameModule = new WhackMole(container, scoreDisplay); break;
            case 'MemoryGame': this.gameModule = new MemoryGame(container, scoreDisplay); break;
            case 'CatchStar': this.gameModule = new CatchStar(container, scoreDisplay); break;
            case 'RPSGame': this.gameModule = new RPSGame(container, scoreDisplay); break;
            case 'SnakeGame': this.gameModule = new SnakeGame(container, scoreDisplay); break;
            case 'MathQuiz': this.gameModule = new MathQuiz(container, scoreDisplay); break;
            case 'Game2048': this.gameModule = new Game2048(container, scoreDisplay); break;
            case 'BugCatch': this.gameModule = new BugCatch(container, scoreDisplay); break;
            case 'TicTacToe': this.gameModule = new TicTacToe(container, scoreDisplay); break;
            case 'ReactionTime': this.gameModule = new ReactionTime(container, scoreDisplay); break;
            case 'NumberBaseball': this.gameModule = new NumberBaseball(container, scoreDisplay); break;
            case 'ColorWord': this.gameModule = new ColorWord(container, scoreDisplay); break;
            case 'BubblePop': this.gameModule = new BubblePop(container, scoreDisplay); break;
            case 'SlidePuzzle': this.gameModule = new SlidePuzzle(container, scoreDisplay); break;
            case 'SpeedTap': this.gameModule = new SpeedTap(container, scoreDisplay); break;
            case 'SimonSays': this.gameModule = new SimonSays(container, scoreDisplay); break;
        }

        if (this.gameModule) {
            this.gameModule.onGameOver = (score, message) => {
                this.showGameOver(score, message, game);
            };
            this.gameModule.init();
        }
    },

    destroyGame() {
        if (this.gameModule && this.gameModule.destroy) {
            this.gameModule.destroy();
        }
        this.gameModule = null;
        this.currentGame = null;
    },

    showMenu() {
        document.getElementById('gameScreen').classList.remove('active');
        document.getElementById('mainMenu').classList.remove('hidden');
        document.getElementById('gameContainer').innerHTML = '';
    },

    showGameOver(score, message, game) {
        document.getElementById('modalEmoji').textContent = game.emoji;
        document.getElementById('modalTitle').textContent = game.title;
        document.getElementById('modalMessage').textContent = message || '수고했어요! 👏';
        document.getElementById('modalScore').textContent = score !== null ? `${score}점` : '';
        document.getElementById('modalOverlay').classList.add('active');
    },

    hideModal() {
        document.getElementById('modalOverlay').classList.remove('active');
    }
};

// ============================================
// Game: 두더지 잡기 (Whack-a-Mole)
// ============================================
class WhackMole {
    constructor(container, scoreDisplay) {
        this.container = container;
        this.scoreDisplay = scoreDisplay;
        this.score = 0;
        this.timeLeft = 30;
        this.isPlaying = false;
        this.activeHole = null;
        this.timerInterval = null;
        this.moleInterval = null;
        this.onGameOver = null;
        this.holes = [];
    }

    init() {
        this.container.innerHTML = `
            <div class="text-center" style="width:100%;max-width:360px;">
                <div class="whack-info">
                    <div class="whack-timer">⏱ <span id="whackTimer">30</span>초</div>
                </div>
                <div class="whack-board" id="whackBoard"></div>
                <p class="text-center mt-12" style="font-size:0.85rem;color:#757575;">
                    점수: <span id="whackScore">0</span>점
                </p>
            </div>
        `;
        this.scoreDisplay.textContent = '⭐ 0점';

        const board = document.getElementById('whackBoard');
        for (let i = 0; i < 9; i++) {
            const hole = document.createElement('div');
            hole.className = 'whack-hole';
            hole.innerHTML = '<span class="whack-mole">🐹</span>';
            hole.addEventListener('pointerdown', (e) => {
                e.preventDefault();
                this.whack(i);
            });
            board.appendChild(hole);
            this.holes.push(hole);
        }

        this.start();
    }

    start() {
        this.score = 0;
        this.timeLeft = 30;
        this.isPlaying = true;
        this.updateScore();

        this.moleInterval = setInterval(() => this.popMole(), 700);
        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            document.getElementById('whackTimer').textContent = this.timeLeft;
            if (this.timeLeft <= 5) {
                document.getElementById('whackTimer').style.color = '#FF5252';
            }
            if (this.timeLeft <= 0) {
                this.endGame();
            }
        }, 1000);
    }

    popMole() {
        // Hide all moles
        this.holes.forEach(h => h.querySelector('.whack-mole').classList.remove('show'));

        // Show random mole
        const idx = Math.floor(Math.random() * 9);
        this.holes[idx].querySelector('.whack-mole').classList.add('show');
        this.activeHole = idx;

        // Auto hide after a bit
        setTimeout(() => {
            this.holes[idx].querySelector('.whack-mole').classList.remove('show');
        }, 500 + Math.random() * 300);
    }

    whack(idx) {
        if (!this.isPlaying) return;
        const mole = this.holes[idx].querySelector('.whack-mole');
        if (mole.classList.contains('show')) {
            this.score += 10;
            mole.classList.remove('show');
            this.holes[idx].classList.add('hit');
            // Show hit effect
            const emoji = ['💥', '⭐', '✨'][Math.floor(Math.random() * 3)];
            mole.textContent = emoji;
            setTimeout(() => {
                this.holes[idx].classList.remove('hit');
                mole.textContent = '🐹';
            }, 200);
        } else {
            // Miss - small penalty
            this.score = Math.max(0, this.score - 2);
            this.holes[idx].style.background = 'linear-gradient(180deg, #FF5252 0%, #8B0000 50%, #4A0000 100%)';
            setTimeout(() => {
                this.holes[idx].style.background = '';
            }, 150);
        }
        this.updateScore();
    }

    updateScore() {
        document.getElementById('whackScore').textContent = this.score;
        this.scoreDisplay.textContent = `⭐ ${this.score}점`;
    }

    endGame() {
        this.isPlaying = false;
        clearInterval(this.moleInterval);
        clearInterval(this.timerInterval);
        this.holes.forEach(h => h.querySelector('.whack-mole').classList.remove('show'));

        const msg = this.score >= 200 ? '와! 두더지 박사! 🎓' :
                    this.score >= 100 ? '잘했어요! 👍' :
                    this.score >= 50 ? '좀 더 해볼까요? 💪' : '다음엔 더 잘할 수 있어요! 🌟';

        if (this.onGameOver) this.onGameOver(this.score, msg);
    }

    destroy() {
        clearInterval(this.moleInterval);
        clearInterval(this.timerInterval);
        this.isPlaying = false;
    }
}

// ============================================
// Game: 카드 짝맞추기 (Memory)
// ============================================
class MemoryGame {
    constructor(container, scoreDisplay) {
        this.container = container;
        this.scoreDisplay = scoreDisplay;
        this.cards = [];
        this.flipped = [];
        this.matched = [];
        this.moves = 0;
        this.isLocked = false;
        this.onGameOver = null;
    }

    init() {
        const emojis = ['🐶', '🐱', '🐰', '🐼', '🐨', '🐸', '🦊', '🐯'];
        const pairs = [...emojis, ...emojis];
        // Shuffle
        for (let i = pairs.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
        }

        this.container.innerHTML = `
            <div style="width:100%;max-width:360px;">
                <div class="memory-info">
                    <span>🃏 시도: <span id="memMoves">0</span>회</span>
                    <span>✅ 맞춤: <span id="memMatched">0</span>/8</span>
                </div>
                <div class="memory-board" id="memBoard"></div>
            </div>
        `;
        this.scoreDisplay.textContent = '🃏 0회';

        const board = document.getElementById('memBoard');
        this.cards = pairs.map((emoji, i) => {
            const card = document.createElement('div');
            card.className = 'memory-card';
            card.innerHTML = `
                <div class="memory-card-inner">
                    <div class="memory-card-face memory-card-back"></div>
                    <div class="memory-card-face memory-card-front">${emoji}</div>
                </div>
            `;
            card.addEventListener('click', () => this.flipCard(i, emoji, card));
            board.appendChild(card);
            return { el: card, emoji, index: i };
        });

        this.flipped = [];
        this.matched = [];
        this.moves = 0;
    }

    flipCard(index, emoji, cardEl) {
        if (!this.isLocked &&
            !this.matched.includes(index) &&
            !this.flipped.find(f => f.index === index) &&
            this.flipped.length < 2) {

            cardEl.classList.add('flipped');
            this.flipped.push({ index, emoji, el: cardEl });

            if (this.flipped.length === 2) {
                this.moves++;
                document.getElementById('memMoves').textContent = this.moves;
                this.scoreDisplay.textContent = `🃏 ${this.moves}회`;
                this.checkMatch();
            }
        }
    }

    checkMatch() {
        this.isLocked = true;
        const [a, b] = this.flipped;

        if (a.emoji === b.emoji) {
            // Match!
            this.matched.push(a.index, b.index);
            a.el.classList.add('matched');
            b.el.classList.add('matched');
            document.getElementById('memMatched').textContent = this.matched.length / 2;
            this.flipped = [];
            this.isLocked = false;

            if (this.matched.length === 16) {
                setTimeout(() => this.endGame(), 500);
            }
        } else {
            // No match - flip back
            setTimeout(() => {
                a.el.classList.remove('flipped');
                b.el.classList.remove('flipped');
                this.flipped = [];
                this.isLocked = false;
            }, 600);
        }
    }

    endGame() {
        const score = Math.max(0, 100 - (this.moves - 8) * 5);
        const msg = this.moves <= 10 ? '완벽해요! 기억력 천재! 🧠✨' :
                    this.moves <= 15 ? '훌륭해요! 👍' :
                    this.moves <= 20 ? '잘했어요! 😊' : '좋은 시도였어요! 🌟';
        if (this.onGameOver) this.onGameOver(score, msg);
    }

    destroy() {}
}

// ============================================
// Game: 별 받기 (Catch Star)
// ============================================
class CatchStar {
    constructor(container, scoreDisplay) {
        this.container = container;
        this.scoreDisplay = scoreDisplay;
        this.score = 0;
        this.missed = 0;
        this.maxMissed = 5;
        this.isPlaying = false;
        this.basketX = 200;
        this.stars = [];
        this.animFrame = null;
        this.starInterval = null;
        this.onGameOver = null;
        this.areaWidth = 0;
    }

    init() {
        this.container.innerHTML = `
            <div style="width:100%;max-width:400px;">
                <div class="catch-hud">
                    <span>⭐ 점수: <span id="catchScore">0</span></span>
                    <span class="catch-miss">💔 <span id="catchMiss">0</span>/${this.maxMissed}</span>
                </div>
                <div class="catch-game-area" id="catchArea">
                    <div class="catch-basket" id="catchBasket">🧺</div>
                </div>
                <p class="text-center mt-8" style="font-size:0.8rem;color:#757575;">
                    화면을 좌우로 움직여서 별을 받으세요!
                </p>
            </div>
        `;
        this.scoreDisplay.textContent = '⭐ 0점';

        const area = document.getElementById('catchArea');
        this.areaWidth = area.clientWidth;

        // Touch/mouse tracking
        area.addEventListener('pointermove', (e) => {
            if (!this.isPlaying) return;
            const rect = area.getBoundingClientRect();
            this.basketX = e.clientX - rect.left;
            this.updateBasket();
        });

        area.addEventListener('pointerdown', (e) => {
            if (!this.isPlaying) return;
            const rect = area.getBoundingClientRect();
            this.basketX = e.clientX - rect.left;
            this.updateBasket();
        });

        // Resize handler
        window.addEventListener('resize', () => {
            const area2 = document.getElementById('catchArea');
            if (area2) this.areaWidth = area2.clientWidth;
        });

        this.start();
    }

    start() {
        this.score = 0;
        this.missed = 0;
        this.isPlaying = true;
        this.stars = [];
        this.updateScore();

        this.starInterval = setInterval(() => this.spawnStar(), 400);
        this.gameLoop();
    }

    spawnStar() {
        if (!this.isPlaying) return;
        const star = document.createElement('div');
        star.className = 'catch-star';
        const emojis = ['⭐', '🌟', '✨', '💫', '🎀'];
        star.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        star.style.left = Math.random() * (this.areaWidth - 30) + 'px';
        star.style.top = '-40px';
        const duration = 2 + Math.random() * 2;
        star.style.animationDuration = duration + 's';

        const area = document.getElementById('catchArea');
        area.appendChild(star);
        this.stars.push({ el: star, y: 0, caught: false, duration: duration * 1000 });
    }

    updateBasket() {
        const basket = document.getElementById('catchBasket');
        if (!basket) return;
        const x = Math.max(20, Math.min(this.areaWidth - 20, this.basketX));
        basket.style.left = x + 'px';
    }

    gameLoop() {
        if (!this.isPlaying) return;

        const basket = document.getElementById('catchBasket');
        if (!basket) return;
        const basketRect = basket.getBoundingClientRect();
        const area = document.getElementById('catchArea');
        const areaRect = area.getBoundingClientRect();

        this.stars = this.stars.filter(s => {
            if (s.caught) {
                s.el.remove();
                return false;
            }
            const starRect = s.el.getBoundingClientRect();
            const starCY = starRect.top + starRect.height / 2;
            const starCX = starRect.left + starRect.width / 2;

            // Check collision
            if (starCY >= basketRect.top - 10 &&
                starCY <= basketRect.bottom + 10 &&
                starCX >= basketRect.left - 15 &&
                starCX <= basketRect.right + 15) {
                s.caught = true;
                s.el.remove();
                this.score += 10;
                this.updateScore();
                // Show catch effect
                this.showEffect(starCX - areaRect.left, starCY - areaRect.top);
                return false;
            }

            // Check miss (fell below)
            if (starCY > areaRect.bottom) {
                s.el.remove();
                this.missed++;
                document.getElementById('catchMiss').textContent = this.missed;
                if (this.missed >= this.maxMissed) {
                    this.endGame();
                }
                return false;
            }

            return true;
        });

        this.animFrame = requestAnimationFrame(() => this.gameLoop());
    }

    showEffect(x, y) {
        const area = document.getElementById('catchArea');
        const eff = document.createElement('div');
        eff.style.cssText = `
            position:absolute;left:${x}px;top:${y}px;font-size:1.2rem;
            pointer-events:none;z-index:20;animation:popIn 0.5s ease-out forwards;
        `;
        eff.textContent = '+10';
        area.appendChild(eff);
        setTimeout(() => eff.remove(), 500);
    }

    updateScore() {
        const el = document.getElementById('catchScore');
        if (el) el.textContent = this.score;
        this.scoreDisplay.textContent = `⭐ ${this.score}점`;
    }

    endGame() {
        this.isPlaying = false;
        clearInterval(this.starInterval);
        if (this.animFrame) cancelAnimationFrame(this.animFrame);

        // Clean up stars
        this.stars.forEach(s => s.el.remove());
        this.stars = [];

        const msg = this.score >= 200 ? '별을 엄청 많이 받았어요! 🌟✨' :
                    this.score >= 100 ? '잘했어요! 별부자! ⭐' :
                    this.score >= 50 ? '좋아요! 계속 연습해요! 💫' : '다음엔 더 많이 받아봐요! 🌠';

        if (this.onGameOver) this.onGameOver(this.score, msg);
    }

    destroy() {
        this.isPlaying = false;
        clearInterval(this.starInterval);
        if (this.animFrame) cancelAnimationFrame(this.animFrame);
        this.stars.forEach(s => s.el.remove());
    }
}

// ============================================
// Game: 가위바위보 (Rock Paper Scissors)
// ============================================
class RPSGame {
    constructor(container, scoreDisplay) {
        this.container = container;
        this.scoreDisplay = scoreDisplay;
        this.playerScore = 0;
        this.computerScore = 0;
        this.round = 0;
        this.maxRounds = 5;
        this.onGameOver = null;
    }

    init() {
        this.container.innerHTML = `
            <div class="rps-game">
                <h3 style="margin-bottom:4px;">컴퓨터와 대결! ✌️✊✋</h3>
                <p style="font-size:0.85rem;color:#757575;margin-bottom:12px;">${this.maxRounds}판 중 많이 이기는 사람이 승리!</p>

                <div class="rps-result">
                    <div class="rps-player" id="rpsPlayer">🤔</div>
                    <div class="rps-vs">VS</div>
                    <div class="rps-computer" id="rpsComputer">🤔</div>
                </div>

                <div class="rps-outcome" id="rpsOutcome"></div>

                <div class="rps-choices">
                    <button class="rps-btn" data-choice="rock" aria-label="바위">✊</button>
                    <button class="rps-btn" data-choice="scissors" aria-label="가위">✌️</button>
                    <button class="rps-btn" data-choice="paper" aria-label="보">✋</button>
                </div>

                <div class="rps-score-board">
                    <span>😊 나: <strong id="rpsPScore">0</strong></span>
                    <span>🤖 컴퓨터: <strong id="rpsCScore">0</strong></span>
                    <span>🏁 라운드: <strong id="rpsRound">1</strong>/${this.maxRounds}</span>
                </div>
            </div>
        `;
        this.scoreDisplay.textContent = '⚔️ 0 : 0';

        // Bind choice buttons
        this.container.querySelectorAll('.rps-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const choice = btn.dataset.choice;
                this.playRound(choice);
            });
        });
    }

    playRound(playerChoice) {
        if (this.round >= this.maxRounds) return;

        const choices = ['rock', 'scissors', 'paper'];
        const emojis = { rock: '✊', scissors: '✌️', paper: '✋' };
        const computerChoice = choices[Math.floor(Math.random() * 3)];

        this.round++;

        // Animate
        const playerEl = document.getElementById('rpsPlayer');
        const computerEl = document.getElementById('rpsComputer');
        const outcomeEl = document.getElementById('rpsOutcome');

        playerEl.textContent = '✊✌️✋';
        computerEl.textContent = '✊✌️✋';

        let count = 0;
        const animInterval = setInterval(() => {
            playerEl.textContent = ['✊', '✌️', '✋'][count % 3];
            computerEl.textContent = ['✊', '✌️', '✋'][(count + 1) % 3];
            count++;
            if (count >= 6) {
                clearInterval(animInterval);
                this.showResult(playerChoice, computerChoice, emojis, playerEl, computerEl, outcomeEl);
            }
        }, 120);
    }

    showResult(player, computer, emojis, playerEl, computerEl, outcomeEl) {
        playerEl.textContent = emojis[player];
        computerEl.textContent = emojis[computer];

        let result;
        if (player === computer) {
            result = 'draw';
            outcomeEl.textContent = '🤝 비겼어요!';
            outcomeEl.style.color = '#FFB74D';
        } else if (
            (player === 'rock' && computer === 'scissors') ||
            (player === 'scissors' && computer === 'paper') ||
            (player === 'paper' && computer === 'rock')
        ) {
            result = 'win';
            this.playerScore++;
            outcomeEl.textContent = '🎉 이겼어요!';
            outcomeEl.style.color = '#4CAF50';
        } else {
            result = 'lose';
            this.computerScore++;
            outcomeEl.textContent = '😅 졌어요...';
            outcomeEl.style.color = '#FF5252';
        }

        document.getElementById('rpsPScore').textContent = this.playerScore;
        document.getElementById('rpsCScore').textContent = this.computerScore;
        document.getElementById('rpsRound').textContent = this.round;
        this.scoreDisplay.textContent = `⚔️ ${this.playerScore} : ${this.computerScore}`;

        if (this.round >= this.maxRounds) {
            setTimeout(() => this.endGame(), 1500);
        }
    }

    endGame() {
        let score, msg;
        if (this.playerScore > this.computerScore) {
            score = this.playerScore * 100;
            msg = '🏆 당신이 최종 승리자예요! 대단해요!';
        } else if (this.playerScore < this.computerScore) {
            score = this.playerScore * 50;
            msg = '😢 컴퓨터가 이겼어요. 다시 도전!';
        } else {
            score = 50;
            msg = '🤝 무승부! 멋진 대결이었어요!';
        }
        if (this.onGameOver) this.onGameOver(score, msg);
    }

    destroy() {}
}

// ============================================
// Game: 스네이크 (Snake)
// ============================================
class SnakeGame {
    constructor(container, scoreDisplay) {
        this.container = container;
        this.scoreDisplay = scoreDisplay;
        this.canvas = null;
        this.ctx = null;
        this.snake = [];
        this.food = { x: 10, y: 10 };
        this.direction = { x: 1, y: 0 };
        this.nextDirection = { x: 1, y: 0 };
        this.score = 0;
        this.isPlaying = false;
        this.gameLoopId = null;
        this.lastTime = 0;
        this.speed = 130;
        this.gridSize = 20;
        this.cols = 0;
        this.rows = 0;
        this.onGameOver = null;
    }

    init() {
        const size = Math.min(360, window.innerWidth - 32);
        this.container.innerHTML = `
            <div style="text-align:center;width:100%;max-width:${size + 20}px;">
                <div class="snake-canvas-wrap" style="width:${size}px;height:${size}px;margin:0 auto;">
                    <canvas id="snakeCanvas" width="${size}" height="${size}"></canvas>
                </div>
                <div class="snake-controls" id="snakeControls">
                    <div class="snake-dpad snake-dpad-empty"></div>
                    <button class="snake-dpad" data-dir="up" aria-label="위">⬆️</button>
                    <div class="snake-dpad snake-dpad-empty"></div>
                    <button class="snake-dpad" data-dir="left" aria-label="왼쪽">⬅️</button>
                    <div class="snake-dpad" style="font-size:0.7rem;display:flex;align-items:center;justify-content:center;color:#aaa;">방향</div>
                    <button class="snake-dpad" data-dir="right" aria-label="오른쪽">➡️</button>
                    <div class="snake-dpad snake-dpad-empty"></div>
                    <button class="snake-dpad" data-dir="down" aria-label="아래">⬇️</button>
                    <div class="snake-dpad snake-dpad-empty"></div>
                </div>
            </div>
        `;
        this.scoreDisplay.textContent = '🐍 0점';

        this.canvas = document.getElementById('snakeCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.cols = Math.floor(this.canvas.width / this.gridSize);
        this.rows = Math.floor(this.canvas.height / this.gridSize);

        // D-pad controls
        this.container.querySelectorAll('.snake-dpad[data-dir]').forEach(btn => {
            btn.addEventListener('click', () => this.changeDirection(btn.dataset.dir));
        });

        // Keyboard controls
        this.keyHandler = (e) => {
            const keyMap = {
                'ArrowUp': 'up', 'ArrowDown': 'down', 'ArrowLeft': 'left', 'ArrowRight': 'right',
                'w': 'up', 's': 'down', 'a': 'left', 'd': 'right',
                'W': 'up', 'S': 'down', 'A': 'left', 'D': 'right'
            };
            if (keyMap[e.key]) {
                e.preventDefault();
                this.changeDirection(keyMap[e.key]);
            }
        };
        document.addEventListener('keydown', this.keyHandler);

        // Swipe support
        this.touchStart = { x: 0, y: 0 };
        this.swipeHandler = (e) => {
            const touch = e.touches[0];
            this.touchStart = { x: touch.clientX, y: touch.clientY };
        };
        this.swipeEndHandler = (e) => {
            const touch = e.changedTouches[0];
            const dx = touch.clientX - this.touchStart.x;
            const dy = touch.clientY - this.touchStart.y;
            if (Math.abs(dx) > Math.abs(dy)) {
                this.changeDirection(dx > 0 ? 'right' : 'left');
            } else if (Math.abs(dy) > Math.abs(dx)) {
                this.changeDirection(dy > 0 ? 'down' : 'up');
            }
        };
        this.canvas.addEventListener('touchstart', this.swipeHandler, { passive: true });
        this.canvas.addEventListener('touchend', this.swipeEndHandler, { passive: true });

        this.start();
    }

    changeDirection(dir) {
        const dirMap = {
            'up': { x: 0, y: -1, opp: 'down' },
            'down': { x: 0, y: 1, opp: 'up' },
            'left': { x: -1, y: 0, opp: 'right' },
            'right': { x: 1, y: 0, opp: 'left' }
        };
        const newDir = dirMap[dir];
        const oppDir = dirMap[newDir.opp];
        // Prevent 180-degree turn
        if (this.direction.x !== oppDir.x || this.direction.y !== oppDir.y) {
            this.nextDirection = { x: newDir.x, y: newDir.y };
        }
    }

    start() {
        // Initialize snake in middle
        const midX = Math.floor(this.cols / 2);
        const midY = Math.floor(this.rows / 2);
        this.snake = [
            { x: midX, y: midY },
            { x: midX - 1, y: midY },
            { x: midX - 2, y: midY }
        ];
        this.direction = { x: 1, y: 0 };
        this.nextDirection = { x: 1, y: 0 };
        this.score = 0;
        this.isPlaying = true;
        this.speed = 130;
        this.placeFood();
        this.scoreDisplay.textContent = '🐍 0점';
        this.lastTime = performance.now();
        this.gameLoop(this.lastTime);
    }

    placeFood() {
        do {
            this.food.x = Math.floor(Math.random() * this.cols);
            this.food.y = Math.floor(Math.random() * this.rows);
        } while (this.snake.some(s => s.x === this.food.x && s.y === this.food.y));
    }

    gameLoop(timestamp) {
        if (!this.isPlaying) return;

        if (timestamp - this.lastTime >= this.speed) {
            this.lastTime = timestamp;
            this.update();
        }

        this.draw();
        this.gameLoopId = requestAnimationFrame((t) => this.gameLoop(t));
    }

    update() {
        this.direction = { ...this.nextDirection };
        const head = this.snake[0];
        const newHead = { x: head.x + this.direction.x, y: head.y + this.direction.y };

        // Wall collision
        if (newHead.x < 0 || newHead.x >= this.cols || newHead.y < 0 || newHead.y >= this.rows) {
            this.endGame();
            return;
        }

        // Self collision
        if (this.snake.some(s => s.x === newHead.x && s.y === newHead.y)) {
            this.endGame();
            return;
        }

        this.snake.unshift(newHead);

        // Food check
        if (newHead.x === this.food.x && newHead.y === this.food.y) {
            this.score += 10;
            this.scoreDisplay.textContent = `🐍 ${this.score}점`;
            this.placeFood();
            // Speed up slightly
            this.speed = Math.max(50, this.speed - 2);
        } else {
            this.snake.pop();
        }
    }

    draw() {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;
        const g = this.gridSize;

        // Background
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, w, h);

        // Grid lines (subtle)
        ctx.strokeStyle = 'rgba(255,255,255,0.03)';
        ctx.lineWidth = 0.5;
        for (let x = 0; x <= this.cols; x++) {
            ctx.beginPath();
            ctx.moveTo(x * g, 0);
            ctx.lineTo(x * g, h);
            ctx.stroke();
        }
        for (let y = 0; y <= this.rows; y++) {
            ctx.beginPath();
            ctx.moveTo(0, y * g);
            ctx.lineTo(w, y * g);
            ctx.stroke();
        }

        // Food
        ctx.fillStyle = '#FF5252';
        ctx.beginPath();
        ctx.arc(this.food.x * g + g / 2, this.food.y * g + g / 2, g / 2 - 2, 0, Math.PI * 2);
        ctx.fill();
        // Food glow
        ctx.fillStyle = 'rgba(255, 82, 82, 0.3)';
        ctx.beginPath();
        ctx.arc(this.food.x * g + g / 2, this.food.y * g + g / 2, g / 2 + 3, 0, Math.PI * 2);
        ctx.fill();

        // Snake body
        this.snake.forEach((seg, i) => {
            const alpha = 1 - (i / (this.snake.length + 10)) * 0.6;
            ctx.fillStyle = i === 0 ? '#4DD0B7' : `rgba(77, 208, 183, ${alpha})`;
            const pad = 1;
            const rx = seg.x * g + pad;
            const ry = seg.y * g + pad;
            const rw = g - pad * 2;
            const rh = g - pad * 2;
            const radius = 4;
            // Manual rounded rect for compatibility
            ctx.beginPath();
            ctx.moveTo(rx + radius, ry);
            ctx.lineTo(rx + rw - radius, ry);
            ctx.quadraticCurveTo(rx + rw, ry, rx + rw, ry + radius);
            ctx.lineTo(rx + rw, ry + rh - radius);
            ctx.quadraticCurveTo(rx + rw, ry + rh, rx + rw - radius, ry + rh);
            ctx.lineTo(rx + radius, ry + rh);
            ctx.quadraticCurveTo(rx, ry + rh, rx, ry + rh - radius);
            ctx.lineTo(rx, ry + radius);
            ctx.quadraticCurveTo(rx, ry, rx + radius, ry);
            ctx.closePath();
            ctx.fill();
        });

        // Snake eyes
        if (this.snake.length > 0) {
            const head = this.snake[0];
            const hx = head.x * g;
            const hy = head.y * g;
            ctx.fillStyle = 'white';
            let ex1, ey1, ex2, ey2;
            if (this.direction.x === 1) { ex1 = hx+13; ey1 = hy+5; ex2 = hx+13; ey2 = hy+13; }
            else if (this.direction.x === -1) { ex1 = hx+7; ey1 = hy+5; ex2 = hx+7; ey2 = hy+13; }
            else if (this.direction.y === -1) { ex1 = hx+5; ey1 = hy+7; ex2 = hx+13; ey2 = hy+7; }
            else { ex1 = hx+5; ey1 = hy+13; ex2 = hx+13; ey2 = hy+13; }
            ctx.beginPath();
            ctx.arc(ex1, ey1, 3, 0, Math.PI*2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(ex2, ey2, 3, 0, Math.PI*2);
            ctx.fill();
            ctx.fillStyle = '#1a1a2e';
            ctx.beginPath();
            ctx.arc(ex1, ey1, 1.5, 0, Math.PI*2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(ex2, ey2, 1.5, 0, Math.PI*2);
            ctx.fill();
        }
    }

    endGame() {
        this.isPlaying = false;
        if (this.gameLoopId) cancelAnimationFrame(this.gameLoopId);

        const msg = this.score >= 100 ? '대단해요! 뱀 마스터! 🐍👑' :
                    this.score >= 50 ? '잘했어요! 계속 도전! 💪' :
                    this.score >= 20 ? '좋은 시작이에요! 🌟' : '다음엔 더 길어질 거예요! 🐍';

        if (this.onGameOver) this.onGameOver(this.score, msg);
    }

    destroy() {
        this.isPlaying = false;
        if (this.gameLoopId) cancelAnimationFrame(this.gameLoopId);
        if (this.keyHandler) document.removeEventListener('keydown', this.keyHandler);
    }
}

// ============================================
// Game: 수학 퀴즈 (Math Quiz)
// ============================================
class MathQuiz {
    constructor(container, scoreDisplay) {
        this.container = container;
        this.scoreDisplay = scoreDisplay;
        this.score = 0;
        this.timeLeft = 60;
        this.isPlaying = false;
        this.currentAnswer = 0;
        this.timerInterval = null;
        this.onGameOver = null;
        this.questionCount = 0;
        this.correctCount = 0;
    }

    init() {
        this.container.innerHTML = `
            <div class="math-game">
                <div class="math-hud">
                    <span>⏱ <span id="mqTimer">60</span>초</span>
                    <span>✅ <span id="mqCorrect">0</span>문제</span>
                    <span>📝 <span id="mqTotal">0</span>문제</span>
                </div>
                <div class="math-question" id="mqQuestion">준비됐나요?</div>
                <div class="math-answers" id="mqAnswers">
                    <button class="math-ans-btn">-</button>
                    <button class="math-ans-btn">-</button>
                    <button class="math-ans-btn">-</button>
                    <button class="math-ans-btn">-</button>
                </div>
                <button class="btn-start" id="mqStart">🚀 시작하기</button>
            </div>
        `;
        this.scoreDisplay.textContent = '🔢 0점';

        document.getElementById('mqStart').addEventListener('click', () => {
            document.getElementById('mqStart').style.display = 'none';
            this.start();
        });

        // Answer buttons
        document.querySelectorAll('.math-ans-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if (!this.isPlaying) return;
                const answer = parseInt(btn.textContent);
                this.checkAnswer(answer, btn);
            });
        });
    }

    start() {
        this.score = 0;
        this.timeLeft = 60;
        this.isPlaying = true;
        this.questionCount = 0;
        this.correctCount = 0;
        this.scoreDisplay.textContent = '🔢 0점';
        this.generateQuestion();

        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            document.getElementById('mqTimer').textContent = this.timeLeft;
            if (this.timeLeft <= 10) {
                document.getElementById('mqTimer').style.color = '#FF5252';
            }
            if (this.timeLeft <= 0) {
                this.endGame();
            }
        }, 1000);
    }

    generateQuestion() {
        if (!this.isPlaying) return;

        // Random operation: addition for easier, subtraction for harder
        const op = Math.random() < 0.6 ? '+' : '-';
        let a, b, answer;

        if (op === '+') {
            a = Math.floor(Math.random() * 50) + 1;
            b = Math.floor(Math.random() * 50) + 1;
            answer = a + b;
        } else {
            a = Math.floor(Math.random() * 90) + 10;
            b = Math.floor(Math.random() * a) + 1;
            answer = a - b;
        }

        this.currentAnswer = answer;
        this.questionCount++;
        document.getElementById('mqTotal').textContent = this.questionCount;
        document.getElementById('mqQuestion').textContent = `${a} ${op} ${b} = ?`;

        // Generate 4 choices
        const choices = [answer];
        while (choices.length < 4) {
            const wrong = answer + (Math.floor(Math.random() * 20) - 10);
            if (wrong !== answer && wrong >= 0 && !choices.includes(wrong)) {
                choices.push(wrong);
            }
        }
        // Shuffle
        choices.sort(() => Math.random() - 0.5);

        const answerBtns = document.querySelectorAll('.math-ans-btn');
        answerBtns.forEach((btn, i) => {
            btn.textContent = choices[i];
            btn.className = 'math-ans-btn';
            btn.disabled = false;
        });
    }

    checkAnswer(userAnswer, btn) {
        if (!this.isPlaying) return;

        // Disable all buttons briefly
        document.querySelectorAll('.math-ans-btn').forEach(b => b.disabled = true);

        if (userAnswer === this.currentAnswer) {
            btn.classList.add('correct');
            this.correctCount++;
            this.score += 10;
            document.getElementById('mqCorrect').textContent = this.correctCount;
            this.scoreDisplay.textContent = `🔢 ${this.score}점`;
        } else {
            btn.classList.add('wrong');
            // Highlight correct answer
            document.querySelectorAll('.math-ans-btn').forEach(b => {
                if (parseInt(b.textContent) === this.currentAnswer) {
                    b.classList.add('correct');
                }
            });
        }

        setTimeout(() => {
            this.generateQuestion();
        }, 600);
    }

    endGame() {
        this.isPlaying = false;
        clearInterval(this.timerInterval);

        const msg = this.correctCount >= 20 ? '수학 천재예요! 🧠✨' :
                    this.correctCount >= 10 ? '정말 잘했어요! 👍' :
                    this.correctCount >= 5 ? '좋아요! 계속 연습해요! 📚' : '다음엔 더 잘할 수 있어요! 💪';

        if (this.onGameOver) this.onGameOver(this.score, msg);
    }

    destroy() {
        clearInterval(this.timerInterval);
        this.isPlaying = false;
    }
}

// ============================================
// Game: 2048 퍼즐
// ============================================
class Game2048 {
    constructor(container, scoreDisplay) {
        this.container = container;
        this.scoreDisplay = scoreDisplay;
        this.board = [];
        this.score = 0;
        this.isPlaying = false;
        this.onGameOver = null;
        this.touchStartPos = { x: 0, y: 0 };
    }

    init() {
        this.container.innerHTML = `
            <div class="game2048-wrap">
                <div class="game2048-score-area">
                    <div class="game2048-score-box">🏆 <span id="g2048Score">0</span></div>
                    <button class="btn-start" id="g2048New" style="padding:8px 20px;font-size:0.85rem;">🔄 새게임</button>
                </div>
                <div class="board2048" id="board2048"></div>
                <p class="text-center mt-8" style="font-size:0.8rem;color:#757575;">
                    화면을 스와이프해서 타일을 합치세요!
                </p>
            </div>
        `;
        this.scoreDisplay.textContent = '🧩 0점';

        document.getElementById('g2048New').addEventListener('click', () => this.startNewGame());

        // Touch/swipe
        const board = document.getElementById('board2048');
        board.addEventListener('touchstart', (e) => {
            this.touchStartPos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }, { passive: true });
        board.addEventListener('touchend', (e) => {
            const dx = e.changedTouches[0].clientX - this.touchStartPos.x;
            const dy = e.changedTouches[0].clientY - this.touchStartPos.y;
            if (Math.abs(dx) > Math.abs(dy)) {
                if (dx > 20) this.move('right');
                else if (dx < -20) this.move('left');
            } else {
                if (dy > 20) this.move('down');
                else if (dy < -20) this.move('up');
            }
        });

        // Keyboard
        this.keyHandler = (e) => {
            const keyMap = {
                'ArrowUp': 'up', 'ArrowDown': 'down', 'ArrowLeft': 'left', 'ArrowRight': 'right'
            };
            if (keyMap[e.key]) {
                e.preventDefault();
                this.move(keyMap[e.key]);
            }
        };
        document.addEventListener('keydown', this.keyHandler);

        this.startNewGame();
    }

    startNewGame() {
        this.board = Array.from({ length: 4 }, () => Array(4).fill(0));
        this.score = 0;
        this.isPlaying = true;
        this.addRandomTile();
        this.addRandomTile();
        this.render();
    }

    addRandomTile() {
        const empty = [];
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                if (this.board[r][c] === 0) empty.push({ r, c });
            }
        }
        if (empty.length === 0) return;
        const { r, c } = empty[Math.floor(Math.random() * empty.length)];
        this.board[r][c] = Math.random() < 0.9 ? 2 : 4;
    }

    move(direction) {
        if (!this.isPlaying) return;

        const oldBoard = this.board.map(row => [...row]);
        let moved = false;

        const rotate = (board, times) => {
            let b = board.map(r => [...r]);
            for (let t = 0; t < times; t++) {
                b = b[0].map((_, i) => b.map(row => row[i]).reverse());
            }
            return b;
        };

        // Rotate so we always slide left
        const rotations = { left: 0, up: 1, right: 2, down: 3 };
        let b = rotate(this.board, rotations[direction]);

        // Slide left
        for (let r = 0; r < 4; r++) {
            const row = b[r].filter(v => v !== 0);
            for (let c = 0; c < row.length - 1; c++) {
                if (row[c] === row[c + 1]) {
                    row[c] *= 2;
                    this.score += row[c];
                    row.splice(c + 1, 1);
                }
            }
            while (row.length < 4) row.push(0);
            b[r] = row;
        }

        // Rotate back
        b = rotate(b, (4 - rotations[direction]) % 4);
        this.board = b;

        // Check if anything moved
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                if (this.board[r][c] !== oldBoard[r][c]) moved = true;
            }
        }

        if (moved) {
            this.addRandomTile();
            this.render();

            // Check win
            if (this.board.some(row => row.includes(2048))) {
                setTimeout(() => this.winGame(), 300);
            }
            // Check game over
            if (this.isGameOver()) {
                setTimeout(() => this.endGame(), 500);
            }
        }
    }

    isGameOver() {
        // Any empty cell?
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                if (this.board[r][c] === 0) return false;
            }
        }
        // Any adjacent same values?
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                if (c < 3 && this.board[r][c] === this.board[r][c + 1]) return false;
                if (r < 3 && this.board[r][c] === this.board[r + 1][c]) return false;
            }
        }
        return true;
    }

    render() {
        const boardEl = document.getElementById('board2048');
        if (!boardEl) return;

        boardEl.innerHTML = '';
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                const tile = document.createElement('div');
                tile.className = 'tile2048';
                const val = this.board[r][c];
                if (val > 0) {
                    tile.textContent = val;
                    tile.setAttribute('data-value', val);
                }
                boardEl.appendChild(tile);
            }
        }

        document.getElementById('g2048Score').textContent = this.score;
        this.scoreDisplay.textContent = `🧩 ${this.score}점`;
    }

    winGame() {
        if (this.onGameOver) this.onGameOver(this.score + 500, '🎉 2048 달성! 당신은 퍼즐 마스터! 🏆');
        this.isPlaying = false;
    }

    endGame() {
        const msg = this.score >= 10000 ? '엄청난 점수예요! 👑' :
                    this.score >= 5000 ? '대단해요! 🌟' :
                    this.score >= 2000 ? '잘했어요! 👍' : '좋은 시도였어요! 다시 도전! 💪';
        if (this.onGameOver) this.onGameOver(this.score, msg);
        this.isPlaying = false;
    }

    destroy() {
        this.isPlaying = false;
        if (this.keyHandler) document.removeEventListener('keydown', this.keyHandler);
    }
}

// ============================================
// Game: 벌레 잡기 (Bug Catch)
// ============================================
class BugCatch {
    constructor(container, scoreDisplay) {
        this.container = container;
        this.scoreDisplay = scoreDisplay;
        this.score = 0;
        this.timeLeft = 25;
        this.isPlaying = false;
        this.currentBug = null;
        this.bugTimer = null;
        this.gameTimer = null;
        this.onGameOver = null;
    }

    init() {
        this.container.innerHTML = `
            <div style="width:100%;max-width:400px;">
                <div class="bug-hud">
                    <span>⏱ <span id="bugTimer">25</span>초</span>
                    <span>🐛 잡은 수: <span id="bugScore">0</span></span>
                </div>
                <div class="bug-area" id="bugArea">
                    <p style="text-align:center;padding-top:180px;color:#81C784;font-weight:700;">
                        벌레가 나타나면 터치해서 잡으세요! 🐞
                    </p>
                </div>
            </div>
        `;
        this.scoreDisplay.textContent = '🐛 0마리';

        const area = document.getElementById('bugArea');
        area.addEventListener('pointerdown', (e) => {
            if (!this.isPlaying || !this.currentBug) return;
            // Check if tapped coordinates overlap with bug position
            const rect = area.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const clickY = e.clientY - rect.top;
            const bugLeft = parseFloat(this.currentBug.el.style.left) || 0;
            const bugTop = parseFloat(this.currentBug.el.style.top) || 0;
            const bugSize = 50;
            // Add some padding for easier tapping
            const padding = 10;
            if (clickX >= bugLeft - padding &&
                clickX <= bugLeft + bugSize + padding &&
                clickY >= bugTop - padding &&
                clickY <= bugTop + bugSize + padding) {
                this.catchBug();
            }
        });

        this.start();
    }

    start() {
        this.score = 0;
        this.timeLeft = 25;
        this.isPlaying = true;
        this.updateScore();
        document.getElementById('bugArea').querySelector('p').style.display = 'none';

        this.spawnBug();
        this.gameTimer = setInterval(() => {
            this.timeLeft--;
            document.getElementById('bugTimer').textContent = this.timeLeft;
            if (this.timeLeft <= 5) {
                document.getElementById('bugTimer').style.color = '#FF5252';
            }
            if (this.timeLeft <= 0) {
                this.endGame();
            }
        }, 1000);
    }

    spawnBug() {
        if (!this.isPlaying) return;
        const area = document.getElementById('bugArea');
        const areaW = area.clientWidth;
        const areaH = area.clientHeight;

        // Remove old bug
        if (this.currentBug) {
            this.currentBug.el.remove();
            this.currentBug = null;
        }

        // Create new bug
        const bug = document.createElement('div');
        bug.className = 'bug';
        const emojis = ['🐛', '🐞', '🦋', '🐜', '🪲', '🐝'];
        bug.textContent = emojis[Math.floor(Math.random() * emojis.length)];

        const bugSize = 50;
        bug.style.left = Math.random() * (areaW - bugSize) + 'px';
        bug.style.top = Math.random() * (areaH - bugSize - 20) + 10 + 'px';

        area.appendChild(bug);
        this.currentBug = { el: bug, spawnedAt: Date.now() };

        // Auto despawn and respawn
        const stayTime = 800 + Math.random() * 1500;
        this.bugTimer = setTimeout(() => {
            if (this.isPlaying) this.spawnBug();
        }, stayTime);
    }

    catchBug() {
        if (!this.isPlaying || !this.currentBug) return;

        clearTimeout(this.bugTimer);
        this.currentBug.el.classList.add('caught');
        this.score += 10;
        this.updateScore();

        // Show score pop
        const rect = this.currentBug.el.getBoundingClientRect();
        const areaRect = document.getElementById('bugArea').getBoundingClientRect();
        const pop = document.createElement('div');
        pop.style.cssText = `
            position:absolute;left:${rect.left - areaRect.left + 15}px;
            top:${rect.top - areaRect.top}px;font-size:1.1rem;font-weight:900;
            color:#FF6B8A;pointer-events:none;z-index:50;
            animation:popIn 0.5s ease-out forwards;
        `;
        pop.textContent = '+10';
        document.getElementById('bugArea').appendChild(pop);
        setTimeout(() => pop.remove(), 500);

        setTimeout(() => {
            this.currentBug.el.remove();
            this.currentBug = null;
            if (this.isPlaying) this.spawnBug();
        }, 150);
    }

    updateScore() {
        document.getElementById('bugScore').textContent = this.score / 10;
        this.scoreDisplay.textContent = `🐛 ${this.score / 10}마리`;
    }

    endGame() {
        this.isPlaying = false;
        clearTimeout(this.bugTimer);
        clearInterval(this.gameTimer);
        if (this.currentBug) {
            this.currentBug.el.remove();
            this.currentBug = null;
        }

        const bugs = this.score / 10;
        const msg = bugs >= 20 ? '벌레 사냥꾼! 대단해요! 🏆' :
                    bugs >= 10 ? '잘 잡았어요! 👍' :
                    bugs >= 5 ? '좋아요! 더 빨리 잡아볼까요? 💪' : '다음엔 더 많이 잡아봐요! 🐛';

        if (this.onGameOver) this.onGameOver(this.score, msg);
    }

    destroy() {
        this.isPlaying = false;
        clearTimeout(this.bugTimer);
        clearInterval(this.gameTimer);
        if (this.currentBug) {
            this.currentBug.el.remove();
            this.currentBug = null;
        }
    }
}

// ============================================
// Game: 틱택토 (Tic-Tac-Toe)
// ============================================
class TicTacToe {
    constructor(container, scoreDisplay) {
        this.container = container;
        this.scoreDisplay = scoreDisplay;
        this.board = Array(9).fill(null);
        this.playerScore = 0;
        this.computerScore = 0;
        this.draws = 0;
        this.isPlaying = false;
        this.onGameOver = null;
    }

    init() {
        this.board = Array(9).fill(null);
        this.isPlaying = true;
        this.container.innerHTML = `
            <div style="text-align:center;max-width:320px;width:100%;">
                <div style="display:flex;justify-content:space-between;margin-bottom:8px;font-weight:700;">
                    <span>😊 나: <span id="tttPScore">${this.playerScore}</span></span>
                    <span>🤝 무: <span id="tttDraws">${this.draws}</span></span>
                    <span>🤖 컴: <span id="tttCScore">${this.computerScore}</span></span>
                </div>
                <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:0 auto;">
                    ${Array.from({length:9}, (_,i) => `
                        <button class="ttt-cell" data-idx="${i}" style="
                            aspect-ratio:1;font-size:3rem;border:3px solid #eee;border-radius:16px;
                            background:white;cursor:pointer;touch-action:manipulation;
                        "></button>
                    `).join('')}
                </div>
                <p id="tttStatus" style="margin-top:12px;font-weight:700;font-size:1.1rem;min-height:28px;">
                    당신 차례예요! 😊
                </p>
                <button class="btn-start" id="tttNew" style="margin-top:10px;padding:10px 30px;font-size:0.9rem;">
                    🔄 새 판
                </button>
            </div>
        `;
        this.scoreDisplay.textContent = `⭕ ${this.playerScore}승`;

        this.container.querySelectorAll('.ttt-cell').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.dataset.idx);
                this.playerMove(idx);
            });
        });
        document.getElementById('tttNew').addEventListener('click', () => this.resetBoard());
    }

    playerMove(idx) {
        if (!this.isPlaying || this.board[idx] !== null) return;
        this.board[idx] = 'O';
        this.renderBoard();

        if (this.checkWin('O')) {
            this.playerScore++;
            this.endGame('win');
            return;
        }
        if (this.board.every(c => c !== null)) {
            this.draws++;
            this.endGame('draw');
            return;
        }

        // Computer move
        document.getElementById('tttStatus').textContent = '컴퓨터 생각 중... 🤔';
        setTimeout(() => {
            this.computerMove();
        }, 400);
    }

    computerMove() {
        if (!this.isPlaying) return;
        const idx = this.getBestMove();
        this.board[idx] = 'X';
        this.renderBoard();

        if (this.checkWin('X')) {
            this.computerScore++;
            this.endGame('lose');
            return;
        }
        if (this.board.every(c => c !== null)) {
            this.draws++;
            this.endGame('draw');
            return;
        }
        document.getElementById('tttStatus').textContent = '당신 차례예요! 😊';
    }

    getBestMove() {
        // Simple AI: win > block > center > corner > side
        const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

        // Try to win
        for (const [a,b,c] of lines) {
            const vals = [this.board[a],this.board[b],this.board[c]];
            if (vals.filter(v=>v==='X').length===2 && vals.includes(null)) {
                return [a,b,c][vals.indexOf(null)];
            }
        }
        // Block player
        for (const [a,b,c] of lines) {
            const vals = [this.board[a],this.board[b],this.board[c]];
            if (vals.filter(v=>v==='O').length===2 && vals.includes(null)) {
                return [a,b,c][vals.indexOf(null)];
            }
        }
        // Center
        if (this.board[4] === null) return 4;
        // Corners
        const corners = [0,2,6,8].filter(i => this.board[i]===null);
        if (corners.length > 0) return corners[Math.floor(Math.random()*corners.length)];
        // Sides
        const sides = [1,3,5,7].filter(i => this.board[i]===null);
        return sides[Math.floor(Math.random()*sides.length)];
    }

    checkWin(player) {
        const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
        return lines.some(([a,b,c]) =>
            this.board[a]===player && this.board[b]===player && this.board[c]===player);
    }

    renderBoard() {
        this.container.querySelectorAll('.ttt-cell').forEach((btn, i) => {
            btn.textContent = this.board[i] === 'O' ? '⭕' : this.board[i] === 'X' ? '❌' : '';
            btn.style.color = this.board[i] === 'O' ? '#4CAF50' : '#FF5252';
        });
    }

    resetBoard() {
        this.board = Array(9).fill(null);
        this.isPlaying = true;
        this.renderBoard();
        document.getElementById('tttStatus').textContent = '당신 차례예요! 😊';
    }

    endGame(result) {
        this.isPlaying = false;
        this.renderBoard();
        document.getElementById('tttPScore').textContent = this.playerScore;
        document.getElementById('tttCScore').textContent = this.computerScore;
        document.getElementById('tttDraws').textContent = this.draws;
        this.scoreDisplay.textContent = `⭕ ${this.playerScore}승`;

        if (result === 'win') {
            document.getElementById('tttStatus').textContent = '🎉 당신이 이겼어요!';
        } else if (result === 'lose') {
            document.getElementById('tttStatus').textContent = '😅 컴퓨터가 이겼어요';
        } else {
            document.getElementById('tttStatus').textContent = '🤝 비겼어요!';
        }
    }

    destroy() { this.isPlaying = false; }
}

// ============================================
// Game: 반응 속도 (Reaction Time)
// ============================================
class ReactionTime {
    constructor(container, scoreDisplay) {
        this.container = container;
        this.scoreDisplay = scoreDisplay;
        this.round = 0;
        this.maxRounds = 5;
        this.times = [];
        this.isWaiting = false;
        this.waitStart = 0;
        this.isPlaying = false;
        this.onGameOver = null;
        this.timeoutId = null;
    }

    init() {
        this.round = 0;
        this.times = [];
        this.isPlaying = true;
        this.container.innerHTML = `
            <div style="text-align:center;max-width:360px;width:100%;">
                <div style="font-weight:700;margin-bottom:8px;">
                    🏃 라운드: <span id="rxRound">1</span>/${this.maxRounds}
                </div>
                <div id="rxArea" style="
                    width:100%;aspect-ratio:1;max-height:320px;margin:0 auto;
                    border-radius:20px;display:flex;align-items:center;justify-content:center;
                    background:#E53935;color:white;font-size:1.5rem;font-weight:900;
                    cursor:pointer;touch-action:manipulation;transition:background 0.15s;
                    user-select:none;
                ">터치해서 시작!</div>
                <p id="rxResult" style="margin-top:12px;font-weight:700;min-height:24px;"></p>
                <div id="rxTimes" style="margin-top:8px;font-size:0.85rem;color:#757575;"></div>
            </div>
        `;
        this.scoreDisplay.textContent = '⚡ 준비';

        const area = document.getElementById('rxArea');
        area.addEventListener('pointerdown', (e) => {
            e.preventDefault();
            if (!this.isPlaying) return;
            if (!this.isWaiting) {
                this.startWait();
            } else {
                this.recordReaction();
            }
        });
    }

    startWait() {
        this.isWaiting = true;
        const area = document.getElementById('rxArea');
        area.style.background = '#FF8F00';
        area.textContent = '기다리세요... 🟠';
        document.getElementById('rxResult').textContent = '';

        const delay = 1500 + Math.random() * 3500;
        this.timeoutId = setTimeout(() => {
            if (!this.isPlaying) return;
            this.isWaiting = true;
            this.waitStart = performance.now();
            area.style.background = '#43A047';
            area.textContent = '지금 눌러! 🟢';
            document.getElementById('rxResult').textContent = '빨리! 지금!';
        }, delay);
    }

    recordReaction() {
        if (!this.isWaiting) return;
        const time = performance.now() - this.waitStart;

        // Check for early tap
        const area = document.getElementById('rxArea');
        if (area.style.background !== 'rgb(67, 160, 71)') {
            // Tapped too early (during wait)
            clearTimeout(this.timeoutId);
            area.style.background = '#E53935';
            area.textContent = '너무 빨랐어요! 😱 다시 시도';
            document.getElementById('rxResult').textContent = '초록색이 되면 눌러주세요!';
            this.isWaiting = false;
            return;
        }

        this.times.push(time);
        this.round++;
        this.isWaiting = false;
        clearTimeout(this.timeoutId);

        document.getElementById('rxRound').textContent = this.round;

        const avg = Math.round(this.times.reduce((a,b)=>a+b,0) / this.times.length);
        document.getElementById('rxResult').textContent = `⏱ ${Math.round(time)}ms (평균: ${avg}ms)`;
        document.getElementById('rxTimes').innerHTML = this.times.map((t,i) =>
            `${i+1}차: ${Math.round(t)}ms`).join(' | ');
        this.scoreDisplay.textContent = `⚡ ${avg}ms`;

        if (this.round >= this.maxRounds) {
            area.style.background = '#5C6BC0';
            area.textContent = '결과 보기 👆';
            setTimeout(() => this.endGame(), 800);
        } else {
            area.style.background = '#E53935';
            area.textContent = `다음 라운드! (${this.round}/${this.maxRounds})`;
        }
    }

    endGame() {
        this.isPlaying = false;
        clearTimeout(this.timeoutId);
        const avg = Math.round(this.times.reduce((a,b)=>a+b,0) / this.times.length);
        const score = Math.max(0, Math.round(1000 - avg));

        const msg = avg < 250 ? '⚡ 초고속 반사신경! 프로게이머 수준!' :
                    avg < 350 ? '👍 빠르네요! 좋은 반응 속도!' :
                    avg < 500 ? '😊 괜찮아요! 연습하면 더 빨라져요!' : '💪 계속 연습해봐요!';

        if (this.onGameOver) this.onGameOver(score, msg);
    }

    destroy() {
        this.isPlaying = false;
        clearTimeout(this.timeoutId);
    }
}

// ============================================
// Game: 숫자 야구 (Number Baseball)
// ============================================
class NumberBaseball {
    constructor(container, scoreDisplay) {
        this.container = container;
        this.scoreDisplay = scoreDisplay;
        this.answer = '';
        this.attempts = 0;
        this.maxAttempts = 9;
        this.history = [];
        this.isPlaying = false;
        this.onGameOver = null;
    }

    init() {
        // Generate 3 unique digits
        const digits = [0,1,2,3,4,5,6,7,8,9];
        const shuffled = digits.sort(() => Math.random() - 0.5);
        this.answer = shuffled.slice(0, 3).join('');
        this.attempts = 0;
        this.history = [];
        this.isPlaying = true;

        this.container.innerHTML = `
            <div style="text-align:center;max-width:360px;width:100%;">
                <h3 style="margin-bottom:4px;">⚾ 숫자 야구</h3>
                <p style="font-size:0.85rem;color:#757575;margin-bottom:12px;">
                    서로 다른 숫자 3자리를 ${this.maxAttempts}번 안에 맞춰보세요!
                </p>
                <div id="nbInput" style="display:flex;gap:8px;justify-content:center;margin-bottom:12px;">
                    <input type="number" id="nbD1" min="0" max="9" style="width:60px;height:60px;text-align:center;font-size:2rem;border:3px solid #ddd;border-radius:12px;" maxlength="1">
                    <input type="number" id="nbD2" min="0" max="9" style="width:60px;height:60px;text-align:center;font-size:2rem;border:3px solid #ddd;border-radius:12px;" maxlength="1">
                    <input type="number" id="nbD3" min="0" max="9" style="width:60px;height:60px;text-align:center;font-size:2rem;border:3px solid #ddd;border-radius:12px;" maxlength="1">
                </div>
                <button class="btn-start" id="nbSubmit" style="padding:12px 30px;">⚾ 추리하기</button>
                <p id="nbMsg" style="margin-top:8px;font-weight:700;min-height:24px;color:#FF5252;"></p>
                <div id="nbHistory" style="margin-top:8px;font-size:0.85rem;text-align:left;max-height:200px;overflow-y:auto;"></div>
                <p style="margin-top:8px;font-size:0.8rem;">남은 기회: <strong id="nbLeft">${this.maxAttempts}</strong></p>
            </div>
        `;
        this.scoreDisplay.textContent = '⚾ 0회';

        // Auto-focus next input
        ['nbD1','nbD2','nbD3'].forEach((id,i,arr) => {
            const inp = document.getElementById(id);
            inp.addEventListener('input', () => {
                if (inp.value.length === 1 && i < 2) {
                    document.getElementById(arr[i+1]).focus();
                }
            });
            // Submit on enter in last input
            if (i === 2) {
                inp.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') this.submitGuess();
                });
            }
        });

        document.getElementById('nbSubmit').addEventListener('click', () => this.submitGuess());
    }

    submitGuess() {
        if (!this.isPlaying) return;
        const d1 = document.getElementById('nbD1').value;
        const d2 = document.getElementById('nbD2').value;
        const d3 = document.getElementById('nbD3').value;
        const guess = d1 + d2 + d3;

        if (guess.length !== 3 || !/^\d{3}$/.test(guess)) {
            document.getElementById('nbMsg').textContent = '숫자 3개를 모두 입력해주세요!';
            return;
        }
        if (new Set(guess.split('')).size !== 3) {
            document.getElementById('nbMsg').textContent = '서로 다른 숫자를 입력해주세요!';
            return;
        }

        this.attempts++;
        document.getElementById('nbMsg').textContent = '';

        let strikes = 0, balls = 0;
        for (let i = 0; i < 3; i++) {
            if (guess[i] === this.answer[i]) strikes++;
            else if (this.answer.includes(guess[i])) balls++;
        }

        const resultStr = strikes === 3 ? '🎉 정답!' : `S:${strikes} B:${balls}`;
        this.history.push({ guess, strikes, balls, attempt: this.attempts });
        document.getElementById('nbLeft').textContent = this.maxAttempts - this.attempts;

        const histEl = document.getElementById('nbHistory');
        histEl.innerHTML = this.history.map(h =>
            `<div style="padding:6px 8px;margin:2px 0;background:#f5f5f5;border-radius:8px;display:flex;justify-content:space-between;">
                <span><strong>${h.attempt}.</strong> ${h.guess.split('').join(' ')}</span>
                <span style="color:${h.strikes===3?'#4CAF50':'#FF6B8A'};font-weight:700;">
                    ${h.strikes===3 ? '🎉 홈런!' : `⚾ S:${h.strikes} B:${h.balls}`}
                </span>
            </div>`
        ).join('');
        histEl.scrollTop = histEl.scrollHeight;
        this.scoreDisplay.textContent = `⚾ ${this.attempts}회`;

        if (strikes === 3) {
            this.endGame(true);
        } else if (this.attempts >= this.maxAttempts) {
            this.endGame(false);
        }

        // Clear inputs + focus
        document.getElementById('nbD1').value = '';
        document.getElementById('nbD2').value = '';
        document.getElementById('nbD3').value = '';
        document.getElementById('nbD1').focus();
    }

    endGame(isWin) {
        this.isPlaying = false;
        if (isWin) {
            const score = (this.maxAttempts - this.attempts + 1) * 100;
            const msg = this.attempts <= 3 ? '🧠 천재! 엄청난 추리력!' :
                        this.attempts <= 6 ? '👍 잘 맞췄어요!' : '😊 맞췄어요!';
            if (this.onGameOver) this.onGameOver(score, msg);
        } else {
            const msg = `정답은 ${this.answer.split('').join(' ')} 였어요! 다음엔 맞출 수 있어요! 💪`;
            if (this.onGameOver) this.onGameOver(0, msg);
        }
    }

    destroy() { this.isPlaying = false; }
}

// ============================================
// Game: 색깔 맞추기 (Color Word / Stroop)
// ============================================
class ColorWord {
    constructor(container, scoreDisplay) {
        this.container = container;
        this.scoreDisplay = scoreDisplay;
        this.score = 0;
        this.timeLeft = 30;
        this.isPlaying = false;
        this.correctColor = '';
        this.timerInterval = null;
        this.onGameOver = null;
        this.colors = ['빨강','파랑','초록','노랑','보라','주황'];
        this.colorCodes = {
            '빨강': '#E53935', '파랑': '#1E88E5', '초록': '#43A047',
            '노랑': '#FDD835', '보라': '#8E24AA', '주황': '#FB8C00'
        };
    }

    init() {
        this.score = 0;
        this.timeLeft = 30;
        this.isPlaying = true;
        this.container.innerHTML = `
            <div style="text-align:center;max-width:360px;width:100%;">
                <div style="display:flex;justify-content:space-between;font-weight:700;margin-bottom:8px;">
                    <span>⏱ <span id="cwTimer">30</span>초</span>
                    <span>✅ <span id="cwScore">0</span>점</span>
                </div>
                <div id="cwWord" style="
                    font-size:3rem;font-weight:900;min-height:100px;display:flex;
                    align-items:center;justify-content:center;margin:16px 0;
                ">시작!</div>
                <p style="font-size:0.85rem;color:#757575;margin-bottom:8px;">
                    글자의 <strong>실제 색깔</strong>을 골라주세요! (뜻 말고!)
                </p>
                <div id="cwChoices" style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;"></div>
                <button class="btn-start" id="cwStart" style="margin-top:16px;">🚀 시작하기</button>
            </div>
        `;
        this.scoreDisplay.textContent = '🎨 0점';

        document.getElementById('cwStart').addEventListener('click', () => {
            document.getElementById('cwStart').style.display = 'none';
            this.startGame();
        });
    }

    startGame() {
        this.nextRound();
        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            document.getElementById('cwTimer').textContent = this.timeLeft;
            if (this.timeLeft <= 5) {
                document.getElementById('cwTimer').style.color = '#FF5252';
            }
            if (this.timeLeft <= 0) this.endGame();
        }, 1000);
    }

    nextRound() {
        if (!this.isPlaying) return;
        // Pick word color (actual displayed color) and word meaning
        const wordText = this.colors[Math.floor(Math.random() * this.colors.length)];
        let displayColor;
        do {
            displayColor = this.colors[Math.floor(Math.random() * this.colors.length)];
        } while (displayColor === wordText); // Make sure it's different (Stroop effect)

        this.correctColor = displayColor;

        const wordEl = document.getElementById('cwWord');
        wordEl.textContent = wordText;
        wordEl.style.color = this.colorCodes[displayColor];

        // Generate choice buttons (color names)
        const choicesDiv = document.getElementById('cwChoices');
        const correctIndex = Math.floor(Math.random() * 6);
        const choices = [...this.colors];
        // Ensure correct answer is included
        if (!choices.includes(displayColor)) choices[correctIndex] = displayColor;

        choicesDiv.innerHTML = choices.map(c => `
            <button class="cw-cho-btn" data-color="${c}" style="
                padding:12px 8px;font-size:0.9rem;font-weight:700;
                background:${this.colorCodes[c]};color:white;
                border:none;border-radius:12px;cursor:pointer;
                touch-action:manipulation;box-shadow:0 3px 8px rgba(0,0,0,0.15);
            ">${c}</button>
        `).join('');

        choicesDiv.querySelectorAll('.cw-cho-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if (!this.isPlaying) return;
                if (btn.dataset.color === this.correctColor) {
                    this.score += 10;
                    document.getElementById('cwScore').textContent = this.score;
                    this.scoreDisplay.textContent = `🎨 ${this.score}점`;
                    btn.style.transform = 'scale(1.1)';
                    btn.style.boxShadow = '0 0 20px rgba(76,175,80,0.5)';
                } else {
                    this.score = Math.max(0, this.score - 5);
                    document.getElementById('cwScore').textContent = this.score;
                    this.scoreDisplay.textContent = `🎨 ${this.score}점`;
                    btn.style.transform = 'scale(0.9)';
                    btn.style.opacity = '0.5';
                }
                setTimeout(() => this.nextRound(), 300);
            });
        });
    }

    endGame() {
        this.isPlaying = false;
        clearInterval(this.timerInterval);
        const msg = this.score >= 150 ? '🎨 색깔의 달인! 집중력 최고!' :
                    this.score >= 80 ? '👍 좋은 집중력이에요!' :
                    this.score >= 40 ? '😊 괜찮아요! 연습하면 늘어요!' : '💪 뇌를 단련해봐요!';
        if (this.onGameOver) this.onGameOver(this.score, msg);
    }

    destroy() {
        this.isPlaying = false;
        clearInterval(this.timerInterval);
    }
}

// ============================================
// Game: 버블 팝 (Bubble Pop)
// ============================================
class BubblePop {
    constructor(container, scoreDisplay) {
        this.container = container;
        this.scoreDisplay = scoreDisplay;
        this.score = 0;
        this.timeLeft = 30;
        this.isPlaying = false;
        this.bubbles = [];
        this.animFrame = null;
        this.spawnInterval = null;
        this.gameTimer = null;
        this.onGameOver = null;
    }

    init() {
        this.score = 0;
        this.timeLeft = 30;
        this.isPlaying = true;
        this.bubbles = [];
        this.container.innerHTML = `
            <div style="width:100%;max-width:400px;">
                <div style="display:flex;justify-content:space-between;font-weight:700;margin-bottom:6px;">
                    <span>⏱ <span id="bpTimer">30</span>초</span>
                    <span>🫧 점수: <span id="bpScore">0</span></span>
                </div>
                <div id="bpArea" style="
                    position:relative;width:100%;height:420px;
                    background:linear-gradient(180deg,#E3F2FD 0%,#BBDEFB 50%,#90CAF9 100%);
                    border-radius:20px;overflow:hidden;cursor:pointer;
                    touch-action:manipulation;border:3px solid #64B5F6;
                "></div>
            </div>
        `;
        this.scoreDisplay.textContent = '🫧 0점';

        const area = document.getElementById('bpArea');
        area.addEventListener('pointerdown', (e) => {
            if (!this.isPlaying) return;
            const rect = area.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            this.checkBubblePop(x, y);
        });

        this.startGame();
    }

    startGame() {
        this.spawnInterval = setInterval(() => this.spawnBubble(), 500);
        this.gameTimer = setInterval(() => {
            this.timeLeft--;
            document.getElementById('bpTimer').textContent = this.timeLeft;
            if (this.timeLeft <= 5) document.getElementById('bpTimer').style.color = '#FF5252';
            if (this.timeLeft <= 0) this.endGame();
        }, 1000);
        this.gameLoop();
    }

    spawnBubble() {
        if (!this.isPlaying) return;
        const area = document.getElementById('bpArea');
        const areaW = area.clientWidth;
        const size = 35 + Math.random() * 50;
        const bubble = document.createElement('div');
        const colors = ['#FF6B8A','#FFD54F','#4DD0B7','#64B5F6','#BA68C8','#FF8A65','#81C784'];
        const color = colors[Math.floor(Math.random()*colors.length)];
        bubble.style.cssText = `
            position:absolute;width:${size}px;height:${size}px;
            background:radial-gradient(circle at 30% 30%,rgba(255,255,255,0.7),${color});
            border-radius:50%;left:${Math.random()*(areaW-size)}px;
            bottom:-${size}px;pointer-events:none;z-index:10;
            box-shadow:inset -4px -4px 8px rgba(0,0,0,0.1),inset 2px 2px 4px rgba(255,255,255,0.5);
        `;
        area.appendChild(bubble);

        const speed = 0.3 + Math.random() * 0.8;
        const points = Math.round((60 - size) / 5) * 5;
        this.bubbles.push({ el: bubble, y: area.clientHeight, speed, size, points, popped: false });
    }

    checkBubblePop(clickX, clickY) {
        // Check in reverse (top bubbles first)
        for (let i = this.bubbles.length - 1; i >= 0; i--) {
            const b = this.bubbles[i];
            if (b.popped) continue;
            const rect = b.el.getBoundingClientRect();
            const areaRect = document.getElementById('bpArea').getBoundingClientRect();
            const bx = rect.left - areaRect.left + b.size/2;
            const by = rect.top - areaRect.top + b.size/2;
            const dist = Math.sqrt((clickX-bx)**2 + (clickY-by)**2);
            if (dist < b.size/2) {
                b.popped = true;
                b.el.style.transition = 'transform 0.15s, opacity 0.15s';
                b.el.style.transform = 'scale(1.5)';
                b.el.style.opacity = '0';
                this.score += b.points;
                document.getElementById('bpScore').textContent = this.score;
                this.scoreDisplay.textContent = `🫧 ${this.score}점`;
                // Pop effect
                const pop = document.createElement('div');
                pop.style.cssText = `
                    position:absolute;left:${bx-10}px;top:${by-10}px;font-size:0.9rem;
                    font-weight:900;color:#FF6B8A;pointer-events:none;z-index:50;
                `;
                pop.textContent = `+${b.points}`;
                document.getElementById('bpArea').appendChild(pop);
                setTimeout(() => { pop.remove(); b.el.remove(); }, 200);
                return;
            }
        }
    }

    gameLoop() {
        if (!this.isPlaying) return;
        const area = document.getElementById('bpArea');
        const areaH = area.clientHeight;
        this.bubbles = this.bubbles.filter(b => {
            if (b.popped) return false;
            b.y -= b.speed;
            b.el.style.bottom = (areaH - b.y) + 'px';
            if (b.y < -b.size) {
                b.el.remove();
                return false;
            }
            return true;
        });
        this.animFrame = requestAnimationFrame(() => this.gameLoop());
    }

    endGame() {
        this.isPlaying = false;
        clearInterval(this.spawnInterval);
        clearInterval(this.gameTimer);
        if (this.animFrame) cancelAnimationFrame(this.animFrame);
        this.bubbles.forEach(b => b.el.remove());
        this.bubbles = [];

        const msg = this.score >= 300 ? '🫧 버블 마스터! 대단해요!' :
                    this.score >= 150 ? '👍 엄청 많이 터뜨렸어요!' :
                    this.score >= 50 ? '😊 잘했어요!' : '💪 더 빨리 터뜨려봐요!';
        if (this.onGameOver) this.onGameOver(this.score, msg);
    }

    destroy() {
        this.isPlaying = false;
        clearInterval(this.spawnInterval);
        clearInterval(this.gameTimer);
        if (this.animFrame) cancelAnimationFrame(this.animFrame);
        this.bubbles.forEach(b => b.el.remove());
    }
}

// ============================================
// Game: 슬라이드 퍼즐 (15 Puzzle)
// ============================================
class SlidePuzzle {
    constructor(container, scoreDisplay) {
        this.container = container;
        this.scoreDisplay = scoreDisplay;
        this.board = [];
        this.emptyIdx = 15;
        this.moves = 0;
        this.isPlaying = false;
        this.onGameOver = null;
    }

    init() {
        // Create solvable initial state
        this.board = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,0];
        // Shuffle with even number of inversions (for solvability)
        do {
            for (let i = this.board.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [this.board[i], this.board[j]] = [this.board[j], this.board[i]];
            }
        } while (!this.isSolvable());

        this.emptyIdx = this.board.indexOf(0);
        this.moves = 0;
        this.isPlaying = true;

        this.container.innerHTML = `
            <div style="text-align:center;max-width:340px;width:100%;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
                    <span style="font-weight:700;">🏆 이동: <span id="spMoves">0</span></span>
                    <button class="btn-start" id="spNew" style="padding:8px 20px;font-size:0.85rem;">🔄 섞기</button>
                </div>
                <div id="spBoard" style="
                    display:grid;grid-template-columns:repeat(4,1fr);gap:6px;
                    background:#BBADA0;padding:8px;border-radius:12px;
                "></div>
                <p style="margin-top:8px;font-size:0.8rem;color:#757575;">
                    타일을 터치해서 빈 칸으로 옮겨 순서대로 배열하세요!
                </p>
            </div>
        `;
        this.scoreDisplay.textContent = '🧩 0회';
        this.renderBoard();

        document.getElementById('spNew').addEventListener('click', () => this.init());
    }

    isSolvable() {
        let inv = 0;
        const arr = this.board.filter(v => v !== 0);
        for (let i = 0; i < arr.length; i++) {
            for (let j = i + 1; j < arr.length; j++) {
                if (arr[i] > arr[j]) inv++;
            }
        }
        const emptyRow = Math.floor(this.emptyIdx / 4);
        return (inv + emptyRow) % 2 === 1; // For odd grid width
    }

    renderBoard() {
        const boardEl = document.getElementById('spBoard');
        if (!boardEl) return;
        boardEl.innerHTML = '';
        for (let i = 0; i < 16; i++) {
            const tile = document.createElement('div');
            const val = this.board[i];
            if (val === 0) {
                tile.style.cssText = 'aspect-ratio:1;background:transparent;';
            } else {
                tile.style.cssText = `
                    aspect-ratio:1;background:#EEE4DA;border-radius:6px;
                    display:flex;align-items:center;justify-content:center;
                    font-size:1.3rem;font-weight:900;color:#776E65;
                    cursor:pointer;touch-action:manipulation;
                    box-shadow:0 2px 4px rgba(0,0,0,0.1);
                `;
                tile.textContent = val;
                tile.addEventListener('click', () => this.moveTile(i));
            }
            boardEl.appendChild(tile);
        }
    }

    moveTile(idx) {
        if (!this.isPlaying) return;
        const empty = this.emptyIdx;
        const validMoves = [];
        const er = Math.floor(empty / 4), ec = empty % 4;
        const ir = Math.floor(idx / 4), ic = idx % 4;
        if (Math.abs(er - ir) + Math.abs(ec - ic) === 1) {
            [this.board[empty], this.board[idx]] = [this.board[idx], this.board[empty]];
            this.emptyIdx = idx;
            this.moves++;
            document.getElementById('spMoves').textContent = this.moves;
            this.scoreDisplay.textContent = `🧩 ${this.moves}회`;
            this.renderBoard();

            if (this.checkWin()) {
                setTimeout(() => this.endGame(), 300);
            }
        }
    }

    checkWin() {
        for (let i = 0; i < 15; i++) {
            if (this.board[i] !== i + 1) return false;
        }
        return this.board[15] === 0;
    }

    endGame() {
        this.isPlaying = false;
        const score = Math.max(0, 500 - this.moves * 5);
        const msg = this.moves <= 60 ? '🧩 퍼즐 마스터! 완벽해요!' :
                    this.moves <= 100 ? '👍 잘 맞췄어요!' :
                    this.moves <= 150 ? '😊 완성! 더 적은 이동으로 도전!' : '💪 완성했어요! 연습하면 더 빨라져요!';
        if (this.onGameOver) this.onGameOver(score, msg);
    }

    destroy() { this.isPlaying = false; }
}

// ============================================
// Game: 순발력 탭 (Speed Tap)
// ============================================
class SpeedTap {
    constructor(container, scoreDisplay) {
        this.container = container;
        this.scoreDisplay = scoreDisplay;
        this.score = 0;
        this.taps = 0;
        this.timeLeft = 20;
        this.isPlaying = false;
        this.targetTimer = null;
        this.gameTimer = null;
        this.currentTarget = null;
        this.onGameOver = null;
    }

    init() {
        this.score = 0;
        this.taps = 0;
        this.timeLeft = 20;
        this.isPlaying = true;
        this.container.innerHTML = `
            <div style="width:100%;max-width:400px;">
                <div style="display:flex;justify-content:space-between;font-weight:700;margin-bottom:6px;">
                    <span>⏱ <span id="stTimer">20</span>초</span>
                    <span>👆 탭: <span id="stTaps">0</span>회</span>
                </div>
                <div id="stArea" style="
                    position:relative;width:100%;height:400px;
                    background:linear-gradient(135deg,#FFF3E0,#FCE4EC);
                    border-radius:20px;overflow:hidden;cursor:crosshair;
                    touch-action:manipulation;border:3px solid #FFE0B2;
                ">
                    <div id="stTarget" style="
                        position:absolute;width:60px;height:60px;
                        background:radial-gradient(circle,#E53935,#B71C1C);
                        border-radius:50%;display:none;pointer-events:none;
                        box-shadow:0 4px 20px rgba(229,57,53,0.5);
                        z-index:20;
                    "></div>
                </div>
            </div>
        `;
        this.scoreDisplay.textContent = '👆 0회';

        const area = document.getElementById('stArea');
        area.addEventListener('pointerdown', (e) => {
            if (!this.isPlaying) return;
            const rect = area.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const target = document.getElementById('stTarget');
            const targetRect = target.getBoundingClientRect();
            const tx = targetRect.left - rect.left + 30;
            const ty = targetRect.top - rect.top + 30;
            const dist = Math.sqrt((x-tx)**2 + (y-ty)**2);
            if (dist < 45 && target.style.display !== 'none') {
                this.taps++;
                this.score += 10;
                document.getElementById('stTaps').textContent = this.taps;
                this.scoreDisplay.textContent = `👆 ${this.taps}회`;
                target.style.display = 'none';
                // Show +10 pop
                const pop = document.createElement('div');
                pop.style.cssText = `
                    position:absolute;left:${tx-10}px;top:${ty-10}px;
                    font-size:1.2rem;font-weight:900;color:#4CAF50;
                    pointer-events:none;z-index:50;
                `;
                pop.textContent = '+10';
                area.appendChild(pop);
                setTimeout(() => pop.remove(), 400);
                this.spawnTarget();
            }
        });

        this.startGame();
    }

    startGame() {
        this.spawnTarget();
        this.gameTimer = setInterval(() => {
            this.timeLeft--;
            document.getElementById('stTimer').textContent = this.timeLeft;
            if (this.timeLeft <= 5) document.getElementById('stTimer').style.color = '#FF5252';
            if (this.timeLeft <= 0) this.endGame();
        }, 1000);
    }

    spawnTarget() {
        if (!this.isPlaying) return;
        // Clear old timer
        clearTimeout(this.targetTimer);

        const area = document.getElementById('stArea');
        const target = document.getElementById('stTarget');
        const areaW = area.clientWidth;
        const areaH = area.clientHeight;
        const targetSize = 60;

        const x = Math.random() * (areaW - targetSize);
        const y = Math.random() * (areaH - targetSize);

        // Random size variation
        const size = 50 + Math.random() * 30;
        target.style.width = size + 'px';
        target.style.height = size + 'px';
        target.style.left = x + 'px';
        target.style.top = y + 'px';
        target.style.display = 'block';

        // Auto-hide after a bit
        this.targetTimer = setTimeout(() => {
            target.style.display = 'none';
            if (this.isPlaying) this.spawnTarget();
        }, 1200 + Math.random() * 800);
    }

    endGame() {
        this.isPlaying = false;
        clearTimeout(this.targetTimer);
        clearInterval(this.gameTimer);
        document.getElementById('stTarget').style.display = 'none';

        const msg = this.taps >= 30 ? '👆 초고속 터치! 손이 번개처럼 빨라요!' :
                    this.taps >= 20 ? '👍 엄청 빠르네요! 좋은 순발력!' :
                    this.taps >= 10 ? '😊 잘했어요! 더 빨리 해볼까요?' : '💪 계속 연습해서 속도를 높여봐요!';
        if (this.onGameOver) this.onGameOver(this.score, msg);
    }

    destroy() {
        this.isPlaying = false;
        clearTimeout(this.targetTimer);
        clearInterval(this.gameTimer);
    }
}

// ============================================
// Game: 사이먼 기억력 (Simon Says)
// ============================================
class SimonSays {
    constructor(container, scoreDisplay) {
        this.container = container;
        this.scoreDisplay = scoreDisplay;
        this.sequence = [];
        this.playerSeq = [];
        this.level = 1;
        this.isPlaying = false;
        this.isShowing = false;
        this.onGameOver = null;
        this.colors = ['#E53935','#1E88E5','#43A047','#FDD835'];
        this.colorNames = ['빨강','파랑','초록','노랑'];
    }

    init() {
        this.sequence = [Math.floor(Math.random() * 4)];
        this.playerSeq = [];
        this.level = 1;
        this.isPlaying = true;
        this.isShowing = false;

        this.container.innerHTML = `
            <div style="text-align:center;max-width:340px;width:100%;">
                <div style="font-weight:900;font-size:1.3rem;margin-bottom:8px;">
                    🧠 레벨 <span id="ssLevel">1</span>
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;max-width:280px;margin:0 auto;">
                    ${this.colors.map((c,i) => `
                        <button class="ss-btn" data-idx="${i}" style="
                            aspect-ratio:1;background:${c};border:none;border-radius:16px;
                            cursor:pointer;touch-action:manipulation;box-shadow:0 4px 12px rgba(0,0,0,0.2);
                            transition:transform 0.1s,opacity 0.1s;font-size:2rem;
                        ">${['🔴','🔵','🟢','🟡'][i]}</button>
                    `).join('')}
                </div>
                <p id="ssMsg" style="margin-top:12px;font-weight:700;min-height:24px;">순서를 기억하세요! 👀</p>
                <button class="btn-start" id="ssStart" style="margin-top:8px;padding:10px 30px;font-size:0.9rem;">▶️ 시작</button>
            </div>
        `;
        this.scoreDisplay.textContent = '🧠 Lv.1';

        document.getElementById('ssStart').addEventListener('click', () => {
            document.getElementById('ssStart').style.display = 'none';
            this.showSequence();
        });

        this.container.querySelectorAll('.ss-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if (!this.isPlaying || this.isShowing) return;
                const idx = parseInt(btn.dataset.idx);
                this.playerInput(idx, btn);
            });
        });
    }

    showSequence() {
        this.isShowing = true;
        this.playerSeq = [];
        document.getElementById('ssMsg').textContent = '순서를 잘 보세요! 👀';

        let i = 0;
        const interval = setInterval(() => {
            if (i >= this.sequence.length || !this.isPlaying) {
                clearInterval(interval);
                this.isShowing = false;
                document.getElementById('ssMsg').textContent = '따라해보세요! 👆';
                return;
            }
            const idx = this.sequence[i];
            const btn = this.container.querySelectorAll('.ss-btn')[idx];
            this.lightUp(btn, idx);
            i++;
        }, 600);
    }

    lightUp(btn, idx) {
        btn.style.transform = 'scale(1.1)';
        btn.style.opacity = '1';
        btn.style.boxShadow = `0 0 30px ${this.colors[idx]}`;
        setTimeout(() => {
            btn.style.transform = 'scale(1)';
            btn.style.opacity = '0.7';
            btn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
        }, 250);
    }

    playerInput(idx, btn) {
        if (!this.isPlaying || this.isShowing) return;

        this.lightUp(btn, idx);

        this.playerSeq.push(idx);
        const pos = this.playerSeq.length - 1;

        if (idx !== this.sequence[pos]) {
            // Wrong!
            document.getElementById('ssMsg').textContent = '틀렸어요! 😢';
            btn.style.transform = 'scale(0.85)';
            setTimeout(() => this.endGame(), 800);
            return;
        }

        if (this.playerSeq.length === this.sequence.length) {
            // Level complete!
            this.level++;
            document.getElementById('ssLevel').textContent = this.level;
            this.scoreDisplay.textContent = `🧠 Lv.${this.level}`;
            document.getElementById('ssMsg').textContent = `레벨 ${this.level} 통과! 🎉`;
            this.sequence.push(Math.floor(Math.random() * 4));
            setTimeout(() => this.showSequence(), 1000);
        }
    }

    endGame() {
        this.isPlaying = false;
        const score = this.level * 100;
        const msg = this.level >= 10 ? '🧠 천재적인 기억력! 대단해요!' :
                    this.level >= 6 ? '👍 정말 좋은 기억력이에요!' :
                    this.level >= 3 ? '😊 잘했어요! 더 높은 레벨에 도전!' : '💪 연습하면 기억력이 좋아져요!';
        if (this.onGameOver) this.onGameOver(score, msg);
    }

    destroy() { this.isPlaying = false; }
}

// ============================================
// Initialize App on DOM Ready
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
