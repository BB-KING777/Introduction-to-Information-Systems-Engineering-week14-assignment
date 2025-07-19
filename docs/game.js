// Famicom Style Block Game - Week 14 Assignment
// Shuta Wakamiya - July 2025
// Simple Tetris-like game with procedural chiptune music

// Famicom color palette (authentic NES colors)
const FAMICOM_COLORS = {
    BLACK: '#000000',
    WHITE: '#FFFFFF',
    RED: '#AB0013',
    CYAN: '#00EBDB',
    BRIGHT_YELLOW: '#F3BF3F',
    BRIGHT_GREEN: '#83D313',
    BRIGHT_PURPLE: '#8300F3',
    BLUE: '#0073EF',
    ORANGE: '#FF7763'
};

// Game constants
const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const BLOCK_SIZE = 24;

// Game state
let gameState = {
    board: [],
    currentPiece: null,
    nextPiece: null,
    score: 0,
    lines: 0,
    level: 1,
    gameRunning: false,
    gamePaused: false,
    dropTime: 0,
    lastTime: 0
};

// Music state
let audioContext = null;
let musicPlaying = false;
let musicTimeout = null;
let musicTimeouts = [];
let currentMeasure = 0;
let mp3Buffer = null;
let mp3Source = null;

// Tetris pieces
const PIECES = [
    {
        shape: [
            [0, 0, 0, 0],
            [1, 1, 1, 1],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ],
        color: FAMICOM_COLORS.CYAN,
        name: 'I'
    },
    {
        shape: [
            [1, 1],
            [1, 1]
        ],
        color: FAMICOM_COLORS.BRIGHT_YELLOW,
        name: 'O'
    },
    {
        shape: [
            [0, 1, 0],
            [1, 1, 1],
            [0, 0, 0]
        ],
        color: FAMICOM_COLORS.BRIGHT_PURPLE,
        name: 'T'
    },
    {
        shape: [
            [0, 1, 1],
            [1, 1, 0],
            [0, 0, 0]
        ],
        color: FAMICOM_COLORS.BRIGHT_GREEN,
        name: 'S'
    },
    {
        shape: [
            [1, 1, 0],
            [0, 1, 1],
            [0, 0, 0]
        ],
        color: FAMICOM_COLORS.RED,
        name: 'Z'
    },
    {
        shape: [
            [1, 0, 0],
            [1, 1, 1],
            [0, 0, 0]
        ],
        color: FAMICOM_COLORS.BLUE,
        name: 'J'
    },
    {
        shape: [
            [0, 0, 1],
            [1, 1, 1],
            [0, 0, 0]
        ],
        color: FAMICOM_COLORS.ORANGE,
        name: 'L'
    }
];

// Initialize canvas
let canvas, ctx, nextCanvas, nextCtx;

function initGame() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    nextCanvas = document.getElementById('nextCanvas');
    nextCtx = nextCanvas.getContext('2d');
    
    ctx.imageSmoothingEnabled = false;
    nextCtx.imageSmoothingEnabled = false;
    
    gameState.board = Array(BOARD_HEIGHT).fill().map(() => Array(BOARD_WIDTH).fill(0));
    
    gameState.nextPiece = generatePiece();
    newPiece();
    
    setupControls();
    
    document.getElementById('startBtn').addEventListener('click', startGame);
    document.getElementById('pauseBtn').addEventListener('click', pauseGame);
    document.getElementById('resetBtn').addEventListener('click', resetGame);
    document.getElementById('musicBtn').addEventListener('click', toggleMusic);
    
    initAudio();
    render();
}

function initAudio() {
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // File Input要素を作成してMP3読み込みを試行
        createFileInput();
        
    } catch (e) {
        console.log('Audio not supported');
    }
}

// ファイル選択用のInput要素を作成
function createFileInput() {
    // 既存のファイル入力があれば削除
    const existingInput = document.getElementById('musicFileInput');
    if (existingInput) {
        existingInput.remove();
    }
    
    // ファイル入力要素を作成
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.id = 'musicFileInput';
    fileInput.accept = 'audio/*';
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);
    
    // Musicボタンの近くに「MP3を選択」ボタンを追加
    const musicBtn = document.getElementById('musicBtn');
    if (musicBtn && !document.getElementById('selectMusicBtn')) {
        const selectBtn = document.createElement('button');
        selectBtn.id = 'selectMusicBtn';
        selectBtn.textContent = 'MP3選択';
        selectBtn.style.marginLeft = '10px';
        selectBtn.onclick = () => fileInput.click();
        musicBtn.parentNode.insertBefore(selectBtn, musicBtn.nextSibling);
    }
    
    // ファイル選択時の処理
    fileInput.addEventListener('change', handleFileSelect);
}

// ファイル選択処理
async function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('audio/')) {
        alert('音声ファイルを選択してください');
        return;
    }
    
    try {
        console.log('Loading selected music file:', file.name);
        
        // FileReaderを使用してArrayBufferとして読み込み
        const arrayBuffer = await readFileAsArrayBuffer(file);
        mp3Buffer = await audioContext.decodeAudioData(arrayBuffer);
        
        console.log('Music loaded successfully!', file.name);
        
        // ボタンのテキストを更新
        const selectBtn = document.getElementById('selectMusicBtn');
        if (selectBtn) {
            selectBtn.textContent = '✓ ' + file.name.substring(0, 10);
            selectBtn.style.backgroundColor = '#4CAF50';
            selectBtn.style.color = 'white';
        }
        
        // 自動で音楽開始
        if (!musicPlaying) {
            startMusic();
        }
        
    } catch (error) {
        console.error('音楽ファイル読み込みエラー:', error);
        alert('音楽ファイルの読み込みに失敗しました');
        mp3Buffer = null;
    }
}

// FileをArrayBufferとして読み込む
function readFileAsArrayBuffer(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);
        reader.readAsArrayBuffer(file);
    });
}

// MP3音楽ファイルを読み込む関数（HTTPサーバー用）
async function loadMP3Music() {
    try {
        console.log('Loading music.mp3...');
        const response = await fetch('music.mp3');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const arrayBuffer = await response.arrayBuffer();
        mp3Buffer = await audioContext.decodeAudioData(arrayBuffer);
        console.log('Music loaded successfully!');
    } catch (error) {
        console.error('MP3読み込みエラー:', error);
        console.log('Fallback to procedural music');
        mp3Buffer = null;
    }
}

function generatePiece() {
    const pieceTemplate = PIECES[Math.floor(Math.random() * PIECES.length)];
    return {
        shape: pieceTemplate.shape.map(row => [...row]),
        color: pieceTemplate.color,
        name: pieceTemplate.name,
        x: Math.floor(BOARD_WIDTH / 2) - Math.floor(pieceTemplate.shape[0].length / 2),
        y: 0
    };
}

function newPiece() {
    gameState.currentPiece = gameState.nextPiece;
    gameState.nextPiece = generatePiece();
    
    if (collision()) {
        gameOver();
    }
}

function collision() {
    if (!gameState.currentPiece) {
        return false;
    }
    
    const piece = gameState.currentPiece;
    for (let y = 0; y < piece.shape.length; y++) {
        for (let x = 0; x < piece.shape[y].length; x++) {
            if (piece.shape[y][x]) {
                const newX = piece.x + x;
                const newY = piece.y + y;
                
                if (newX < 0 || newX >= BOARD_WIDTH || 
                    newY >= BOARD_HEIGHT ||
                    (newY >= 0 && gameState.board[newY][newX])) {
                    return true;
                }
            }
        }
    }
    return false;
}

function placePiece() {
    const piece = gameState.currentPiece;
    for (let y = 0; y < piece.shape.length; y++) {
        for (let x = 0; x < piece.shape[y].length; x++) {
            if (piece.shape[y][x]) {
                const boardX = piece.x + x;
                const boardY = piece.y + y;
                if (boardY >= 0) {
                    gameState.board[boardY][boardX] = piece.color;
                }
            }
        }
    }
    
    clearLines();
    newPiece();
}

function clearLines() {
    let linesCleared = 0;
    
    for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
        if (gameState.board[y].every(cell => cell !== 0)) {
            gameState.board.splice(y, 1);
            gameState.board.unshift(Array(BOARD_WIDTH).fill(0));
            linesCleared++;
            y++;
        }
    }
    
    if (linesCleared > 0) {
        gameState.lines += linesCleared;
        gameState.score += linesCleared * 100 * gameState.level;
        gameState.level = Math.floor(gameState.lines / 10) + 1;
        updateScore();
        playLineClearSound();
    }
}

function movePiece(dx, dy) {
    if (!gameState.currentPiece) {
        return;
    }
    
    gameState.currentPiece.x += dx;
    gameState.currentPiece.y += dy;
    
    if (collision()) {
        gameState.currentPiece.x -= dx;
        gameState.currentPiece.y -= dy;
        
        if (dy > 0) {
            placePiece();
        }
    }
}

function rotatePiece(direction) {
    if (!gameState.currentPiece) {
        return;
    }
    
    const piece = gameState.currentPiece;
    const originalShape = piece.shape.map(row => [...row]);
    
    const size = piece.shape.length;
    const newShape = Array(size).fill().map(() => Array(size).fill(0));
    
    if (direction === 1) {
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                if (piece.shape[y] && piece.shape[y][x]) {
                    newShape[x][size - 1 - y] = piece.shape[y][x];
                }
            }
        }
    } else {
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                if (piece.shape[y] && piece.shape[y][x]) {
                    newShape[size - 1 - x][y] = piece.shape[y][x];
                }
            }
        }
    }
    
    piece.shape = newShape;
    
    let kicked = false;
    const kicks = [0, -1, 1, -2, 2];
    
    for (let kickX of kicks) {
        piece.x += kickX;
        if (!collision()) {
            kicked = true;
            break;
        }
        piece.x -= kickX;
    }
    
    if (!kicked) {
        piece.shape = originalShape;
    } else {
        playRotateSound();
    }
}

function hardDrop() {
    if (!gameState.currentPiece) {
        return;
    }
    
    while (!collision()) {
        gameState.currentPiece.y++;
    }
    gameState.currentPiece.y--;
    placePiece();
    playDropSound();
}

function setupControls() {
    document.addEventListener('keydown', (e) => {
        if (!gameState.gameRunning || gameState.gamePaused) {
            return;
        }
        
        switch(e.code) {
            case 'ArrowLeft':
                e.preventDefault();
                movePiece(-1, 0);
                break;
            case 'ArrowRight':
                e.preventDefault();
                movePiece(1, 0);
                break;
            case 'ArrowDown':
                e.preventDefault();
                movePiece(0, 1);
                break;
            case 'Space':
                e.preventDefault();
                hardDrop();
                break;
            case 'KeyA':
                e.preventDefault();
                rotatePiece(-1);
                break;
            case 'KeyS':
                e.preventDefault();
                rotatePiece(1);
                break;
        }
        render();
    });
}

function startGame() {
    if (!gameState.gameRunning) {
        gameState.gameRunning = true;
        gameState.gamePaused = false;
        if (audioContext && audioContext.state === 'suspended') {
            audioContext.resume();
        }
        gameLoop();
    }
}

function pauseGame() {
    gameState.gamePaused = !gameState.gamePaused;
    if (!gameState.gamePaused && gameState.gameRunning) {
        gameLoop();
    }
}

function resetGame() {
    gameState.gameRunning = false;
    gameState.gamePaused = false;
    gameState.score = 0;
    gameState.lines = 0;
    gameState.level = 1;
    gameState.board = Array(BOARD_HEIGHT).fill().map(() => Array(BOARD_WIDTH).fill(0));
    gameState.nextPiece = generatePiece();
    newPiece();
    updateScore();
    render();
}

function gameOver() {
    gameState.gameRunning = false;
    stopMusic();
    alert('Game Over! Score: ' + gameState.score);
}

function updateScore() {
    document.getElementById('score').textContent = gameState.score;
    document.getElementById('lines').textContent = gameState.lines;
    document.getElementById('level').textContent = gameState.level;
}

function render() {
    ctx.fillStyle = FAMICOM_COLORS.BLACK;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    for (let y = 0; y < BOARD_HEIGHT; y++) {
        for (let x = 0; x < BOARD_WIDTH; x++) {
            if (gameState.board[y][x]) {
                ctx.fillStyle = gameState.board[y][x];
                ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                
                ctx.strokeStyle = FAMICOM_COLORS.WHITE;
                ctx.lineWidth = 1;
                ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        }
    }
    
    if (gameState.currentPiece) {
        const piece = gameState.currentPiece;
        ctx.fillStyle = piece.color;
        
        for (let y = 0; y < piece.shape.length; y++) {
            for (let x = 0; x < piece.shape[y].length; x++) {
                if (piece.shape[y][x]) {
                    const drawX = (piece.x + x) * BLOCK_SIZE;
                    const drawY = (piece.y + y) * BLOCK_SIZE;
                    
                    if (drawY >= 0) {
                        ctx.fillRect(drawX, drawY, BLOCK_SIZE, BLOCK_SIZE);
                        ctx.strokeStyle = FAMICOM_COLORS.WHITE;
                        ctx.lineWidth = 1;
                        ctx.strokeRect(drawX, drawY, BLOCK_SIZE, BLOCK_SIZE);
                    }
                }
            }
        }
    }
    
    renderNextPiece();
}

function renderNextPiece() {
    nextCtx.fillStyle = FAMICOM_COLORS.BLACK;
    nextCtx.fillRect(0, 0, nextCanvas.width, nextCanvas.height);
    
    if (gameState.nextPiece) {
        const piece = gameState.nextPiece;
        nextCtx.fillStyle = piece.color;
        
        const blockSize = 20;
        const offsetX = (nextCanvas.width - piece.shape[0].length * blockSize) / 2;
        const offsetY = (nextCanvas.height - piece.shape.length * blockSize) / 2;
        
        for (let y = 0; y < piece.shape.length; y++) {
            for (let x = 0; x < piece.shape[y].length; x++) {
                if (piece.shape[y][x]) {
                    const drawX = offsetX + x * blockSize;
                    const drawY = offsetY + y * blockSize;
                    
                    nextCtx.fillRect(drawX, drawY, blockSize, blockSize);
                    nextCtx.strokeStyle = FAMICOM_COLORS.WHITE;
                    nextCtx.lineWidth = 1;
                    nextCtx.strokeRect(drawX, drawY, blockSize, blockSize);
                }
            }
        }
    }
}

function gameLoop(currentTime = 0) {
    if (!gameState.gameRunning || gameState.gamePaused) {
        return;
    }
    
    const deltaTime = currentTime - gameState.lastTime;
    gameState.lastTime = currentTime;
    gameState.dropTime += deltaTime;
    
    const dropInterval = Math.max(50, 500 - (gameState.level - 1) * 50);
    
    if (gameState.dropTime > dropInterval) {
        movePiece(0, 1);
        gameState.dropTime = 0;
        render();
    }
    
    requestAnimationFrame(gameLoop);
}

function toggleMusic() {
    if (musicPlaying) {
        stopMusic();
    } else {
        startMusic();
    }
}

function startMusic() {
    if (!audioContext) {
        return;
    }
    
    if (musicPlaying) {
        return;
    }
    
    musicPlaying = true;
    
    // MP3が読み込まれている場合はMP3を使用
    if (mp3Buffer) {
        startMP3Music();
    } else {
        // フォールバック：プロシージャル音楽を使用
        startProceduralMusic();
    }
}

function startMP3Music() {
    try {
        mp3Source = audioContext.createBufferSource();
        const gainNode = audioContext.createGain();
        const filterNode = audioContext.createBiquadFilter();
        
        mp3Source.buffer = mp3Buffer;
        mp3Source.loop = true; // ループ再生
        
        // エフェクトチェーン: MP3 → ゲイン → フィルター → 出力
        mp3Source.connect(gainNode);
        gainNode.connect(filterNode);
        filterNode.connect(audioContext.destination);
        
        // 音量調整（ゲームに適した音量）
        gainNode.gain.value = 0.4;
        
        // 少し8ビット風のフィルター効果
        filterNode.type = 'lowpass';
        filterNode.frequency.value = 12000; // 高音を少しカット
        filterNode.Q.value = 1;
        
        mp3Source.start();
        console.log('MP3 music started');
        
        // 再生終了時の処理
        mp3Source.onended = () => {
            if (musicPlaying) {
                // ループが切れた場合の再開処理
                setTimeout(() => {
                    if (musicPlaying) {
                        startMP3Music();
                    }
                }, 100);
            }
        };
        
    } catch (error) {
        console.error('MP3再生エラー:', error);
        // エラーの場合はプロシージャル音楽にフォールバック
        startProceduralMusic();
    }
}

function startProceduralMusic() {
    currentMeasure = 0;
    
    // テトリスのメインメロディー（Korobeiniki）- より正確な音程
    const melody = [
        // 小節1-2
        659, 494, 523, 587, 523, 494, 440, 440, 523, 659, 587, 523, 494,
        494, 523, 587, 659, 523, 440, 440,
        // 小節3-4  
        587, 659, 523, 587, 494, 494, 440, 440, 392, 392, 440, 494, 523, 494, 440,
        440, 440, 494, 523, 587, 659, 523, 440, 440,
        // リピート部分
        587, 659, 523, 587, 494, 494, 440, 440, 392, 392, 440, 494, 523, 494, 440
    ];
    
    // ベースライン（低音部）
    const bassline = [
        // 小節1-2
        220, 220, 220, 220, 196, 196, 196, 196, 175, 175, 175, 175, 196, 196, 196, 196,
        220, 220, 220, 220, 196, 196, 196, 196, 175, 175, 175, 175, 196, 196, 196, 196,
        // 小節3-4
        220, 220, 220, 220, 247, 247, 247, 247, 262, 262, 262, 262, 220, 220, 220, 220,
        175, 175, 175, 175, 196, 196, 196, 196, 220, 220, 220, 220, 175, 175, 175
    ];
    
    // ハーモニー（中音部）
    const harmony = [
        // 小節1-2
        330, 247, 262, 294, 262, 247, 220, 220, 262, 330, 294, 262, 247,
        247, 262, 294, 330, 262, 220, 220,
        // 小節3-4
        294, 330, 262, 294, 247, 247, 220, 220, 196, 196, 220, 247, 262, 247, 220,
        220, 220, 247, 262, 294, 330, 262, 220, 220,
        // リピート部分
        294, 330, 262, 294, 247, 247, 220, 220, 196, 196, 220, 247, 262, 247, 220
    ];
    
    let noteIndex = 0;
    const tempo = 300; // より速いテンポ
    
    function playNote() {
        if (!musicPlaying) {
            return;
        }
        
        // メロディー（メインチャンネル）
        const melodyOsc = audioContext.createOscillator();
        const melodyGain = audioContext.createGain();
        melodyOsc.connect(melodyGain);
        melodyGain.connect(audioContext.destination);
        melodyOsc.frequency.setValueAtTime(melody[noteIndex % melody.length], audioContext.currentTime);
        melodyOsc.type = 'square';
        melodyGain.gain.setValueAtTime(0, audioContext.currentTime);
        melodyGain.gain.linearRampToValueAtTime(0.15, audioContext.currentTime + 0.01);
        melodyGain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.25);
        melodyOsc.start(audioContext.currentTime);
        melodyOsc.stop(audioContext.currentTime + 0.25);
        
        // ベースライン（低音チャンネル）
        const bassOsc = audioContext.createOscillator();
        const bassGain = audioContext.createGain();
        bassOsc.connect(bassGain);
        bassGain.connect(audioContext.destination);
        bassOsc.frequency.setValueAtTime(bassline[noteIndex % bassline.length], audioContext.currentTime);
        bassOsc.type = 'triangle'; // より低音らしいサウンド
        bassGain.gain.setValueAtTime(0, audioContext.currentTime);
        bassGain.gain.linearRampToValueAtTime(0.08, audioContext.currentTime + 0.01);
        bassGain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.4);
        bassOsc.start(audioContext.currentTime);
        bassOsc.stop(audioContext.currentTime + 0.4);
        
        // ハーモニー（中音チャンネル）- 4拍子に1回
        if (noteIndex % 4 === 0) {
            const harmonyOsc = audioContext.createOscillator();
            const harmonyGain = audioContext.createGain();
            harmonyOsc.connect(harmonyGain);
            harmonyGain.connect(audioContext.destination);
            harmonyOsc.frequency.setValueAtTime(harmony[Math.floor(noteIndex / 4) % harmony.length], audioContext.currentTime);
            harmonyOsc.type = 'sawtooth'; // pulseの代わりにsawtoothを使用
            harmonyGain.gain.setValueAtTime(0, audioContext.currentTime);
            harmonyGain.gain.linearRampToValueAtTime(0.06, audioContext.currentTime + 0.01);
            harmonyGain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.8);
            harmonyOsc.start(audioContext.currentTime);
            harmonyOsc.stop(audioContext.currentTime + 0.8);
        }
        
        // ドラム（ノイズチャンネル）- 4拍子のリズム
        if (noteIndex % 8 === 0 || noteIndex % 8 === 4) {
            const drumGain = audioContext.createGain();
            const drumFilter = audioContext.createBiquadFilter();
            drumGain.connect(drumFilter);
            drumFilter.connect(audioContext.destination);
            
            // ホワイトノイズの生成
            const bufferSize = audioContext.sampleRate * 0.1;
            const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }
            
            const noise = audioContext.createBufferSource();
            noise.buffer = buffer;
            noise.connect(drumGain);
            
            drumFilter.type = 'highpass';
            drumFilter.frequency.setValueAtTime(noteIndex % 8 === 0 ? 100 : 200, audioContext.currentTime);
            
            drumGain.gain.setValueAtTime(0, audioContext.currentTime);
            drumGain.gain.linearRampToValueAtTime(noteIndex % 8 === 0 ? 0.1 : 0.05, audioContext.currentTime + 0.001);
            drumGain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
            
            noise.start(audioContext.currentTime);
            noise.stop(audioContext.currentTime + 0.1);
        }
        
        noteIndex++;
        
        // ループ処理
        if (noteIndex >= melody.length) {
            noteIndex = 0;
            currentMeasure++;
        }
        
        const timeout = setTimeout(playNote, tempo);
        musicTimeouts.push(timeout);
    }
    
    playNote();
}

function stopMusic() {
    musicPlaying = false;
    
    // MP3音源を停止
    if (mp3Source) {
        try {
            mp3Source.stop();
        } catch (error) {
            console.log('MP3 source already stopped');
        }
        mp3Source = null;
    }
    
    // プロシージャル音楽のタイムアウトをクリア
    musicTimeouts.forEach(timeout => {
        clearTimeout(timeout);
    });
    musicTimeouts = [];
    
    if (musicTimeout) {
        clearTimeout(musicTimeout);
        musicTimeout = null;
    }
}

function playLineClearSound() {
    if (!audioContext) {
        return;
    }
    
    // ラインクリア時の特別なサウンド - 複数の音程で華やかに
    const frequencies = [523, 659, 784, 1047]; // C5, E5, G5, C6
    
    frequencies.forEach((freq, index) => {
        setTimeout(() => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
            oscillator.type = 'square';
            
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.3);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        }, index * 50);
    });
}

function playRotateSound() {
    if (!audioContext) {
        return;
    }
    
    // 回転音 - より短く、シャープに
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.03);
    oscillator.type = 'square';
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.005);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.08);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.08);
}

function playDropSound() {
    if (!audioContext) {
        return;
    }
    
    // ドロップ音 - より重厚感のある低音
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(120, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(40, audioContext.currentTime + 0.12);
    oscillator.type = 'triangle'; // より重い音
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.2);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
}

document.addEventListener('DOMContentLoaded', initGame);