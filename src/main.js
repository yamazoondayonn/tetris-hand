import { TetrisGame } from './game/tetris.js';
import { HandTracker } from './hand/tracker.js';

class App {
    constructor() {
        this.tetrisCanvas = document.getElementById('tetris-canvas');
        this.cameraVideo = document.getElementById('camera-video');
        this.cameraCanvas = document.getElementById('camera-canvas');
        this.startBtn = document.getElementById('start-btn');
        this.pauseBtn = document.getElementById('pause-btn');
        
        this.tetrisGame = new TetrisGame(this.tetrisCanvas);
        this.handTracker = new HandTracker(this.cameraVideo, this.cameraCanvas);
        
        this.isPlaying = false;
        this.isPaused = false;
        
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        this.startBtn.addEventListener('click', () => this.startGame());
        this.pauseBtn.addEventListener('click', () => this.togglePause());
        
        // ハンドトラッキングからのジェスチャーを受け取る
        this.handTracker.onGesture((gesture) => {
            if (!this.isPlaying || this.isPaused) return;
            
            switch(gesture) {
                case 'left':
                    this.tetrisGame.moveLeft();
                    break;
                case 'right':
                    this.tetrisGame.moveRight();
                    break;
                case 'down':
                    this.tetrisGame.softDrop();
                    break;
                case 'rotate':
                    this.tetrisGame.rotate();
                    break;
            }
        });
        
        // キーボード操作（デバッグ用）
        document.addEventListener('keydown', (e) => {
            if (!this.isPlaying || this.isPaused) return;
            
            switch(e.key) {
                case 'ArrowLeft':
                    this.tetrisGame.moveLeft();
                    break;
                case 'ArrowRight':
                    this.tetrisGame.moveRight();
                    break;
                case 'ArrowDown':
                    this.tetrisGame.softDrop();
                    break;
                case 'ArrowUp':
                case ' ':
                    this.tetrisGame.rotate();
                    break;
            }
        });
    }
    
    async startGame() {
        try {
            // カメラの初期化
            await this.handTracker.initialize();
            
            // ゲーム開始
            this.tetrisGame.start();
            this.isPlaying = true;
            
            // ボタンの状態更新
            this.startBtn.disabled = true;
            this.pauseBtn.disabled = false;
            
            // ゲームループ開始
            this.gameLoop();
            
        } catch (error) {
            console.error('ゲーム開始エラー:', error);
            alert('カメラの初期化に失敗しました。カメラのアクセス許可を確認してください。');
        }
    }
    
    togglePause() {
        this.isPaused = !this.isPaused;
        this.pauseBtn.textContent = this.isPaused ? '再開' : '一時停止';
        
        if (this.isPaused) {
            this.tetrisGame.pause();
        } else {
            this.tetrisGame.resume();
            this.gameLoop();
        }
    }
    
    gameLoop() {
        if (!this.isPlaying || this.isPaused) return;
        
        // ゲームの更新と描画
        this.tetrisGame.update();
        this.tetrisGame.render();
        
        // スコアとラインの更新
        document.getElementById('score').textContent = this.tetrisGame.score;
        document.getElementById('lines').textContent = this.tetrisGame.lines;
        
        // ゲームオーバーチェック
        if (this.tetrisGame.isGameOver) {
            this.gameOver();
            return;
        }
        
        requestAnimationFrame(() => this.gameLoop());
    }
    
    gameOver() {
        this.isPlaying = false;
        this.startBtn.disabled = false;
        this.startBtn.textContent = 'もう一度プレイ';
        this.pauseBtn.disabled = true;
        
        alert(`ゲームオーバー!\nスコア: ${this.tetrisGame.score}\nライン: ${this.tetrisGame.lines}`);
    }
}

// アプリケーション開始
document.addEventListener('DOMContentLoaded', () => {
    new App();
});