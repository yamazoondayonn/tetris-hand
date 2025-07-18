import { Hands } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import { HAND_CONNECTIONS } from '@mediapipe/hands';

export class HandTracker {
    constructor(videoElement, canvasElement) {
        this.video = videoElement;
        this.canvas = canvasElement;
        this.ctx = canvasElement.getContext('2d');
        
        this.gestureCallback = null;
        this.lastGesture = null;
        this.gestureStartTime = 0;
        this.gestureThreshold = 300; // 300ms
        
        this.hands = null;
        this.camera = null;
    }
    
    async initialize() {
        // MediaPipe Handsの初期化
        this.hands = new Hands({
            locateFile: (file) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
            }
        });
        
        this.hands.setOptions({
            maxNumHands: 1,
            modelComplexity: 1,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5
        });
        
        this.hands.onResults((results) => this.onResults(results));
        
        // カメラの初期化
        this.camera = new Camera(this.video, {
            onFrame: async () => {
                await this.hands.send({ image: this.video });
            },
            width: 640,
            height: 480
        });
        
        await this.camera.start();
        
        // キャンバスのサイズ設定
        this.canvas.width = 640;
        this.canvas.height = 480;
    }
    
    onResults(results) {
        // キャンバスをクリア
        this.ctx.save();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // カメラ画像を描画
        this.ctx.drawImage(results.image, 0, 0, this.canvas.width, this.canvas.height);
        
        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            const landmarks = results.multiHandLandmarks[0];
            
            // 手のランドマークを描画
            drawConnectors(this.ctx, landmarks, HAND_CONNECTIONS, {
                color: '#00FF00',
                lineWidth: 5
            });
            
            drawLandmarks(this.ctx, landmarks, {
                color: '#FF0000',
                lineWidth: 2
            });
            
            // ジェスチャー認識
            const gesture = this.recognizeGesture(landmarks);
            this.handleGesture(gesture);
            
            // ステータス更新
            document.getElementById('hand-status').textContent = '検出中';
            document.getElementById('gesture-type').textContent = gesture || '-';
        } else {
            document.getElementById('hand-status').textContent = '未検出';
            document.getElementById('gesture-type').textContent = '-';
        }
        
        this.ctx.restore();
    }
    
    recognizeGesture(landmarks) {
        // 手首と中指の付け根の座標を取得
        const wrist = landmarks[0];
        const middleBase = landmarks[9];
        
        // 手の傾きを計算
        const angle = Math.atan2(middleBase.y - wrist.y, middleBase.x - wrist.x) * 180 / Math.PI;
        
        // 人差し指の状態をチェック
        const indexTip = landmarks[8];
        const indexBase = landmarks[5];
        const indexExtended = indexTip.y < indexBase.y - 0.1;
        
        // ジェスチャー判定
        if (indexExtended && this.isOnlyIndexExtended(landmarks)) {
            return 'rotate';
        } else if (angle < -30) {
            return 'right'; // 画面上では左右反転
        } else if (angle > 30) {
            return 'left';  // 画面上では左右反転
        } else if (wrist.y < middleBase.y - 0.1) {
            return 'down';
        }
        
        return null;
    }
    
    isOnlyIndexExtended(landmarks) {
        // 各指の状態をチェック
        const fingers = [
            { tip: 4, base: 2 },   // 親指
            { tip: 8, base: 5 },   // 人差し指
            { tip: 12, base: 9 },  // 中指
            { tip: 16, base: 13 }, // 薬指
            { tip: 20, base: 17 }  // 小指
        ];
        
        const extended = fingers.map((finger, index) => {
            if (index === 0) { // 親指は横方向で判定
                return Math.abs(landmarks[finger.tip].x - landmarks[finger.base].x) > 0.1;
            } else {
                return landmarks[finger.tip].y < landmarks[finger.base].y - 0.05;
            }
        });
        
        // 人差し指だけが伸びている
        return extended[1] && !extended[2] && !extended[3] && !extended[4];
    }
    
    handleGesture(gesture) {
        if (!gesture) {
            this.lastGesture = null;
            this.gestureStartTime = 0;
            return;
        }
        
        const now = Date.now();
        
        if (gesture !== this.lastGesture) {
            this.lastGesture = gesture;
            this.gestureStartTime = now;
        } else if (now - this.gestureStartTime > this.gestureThreshold) {
            // 閾値を超えたらジェスチャーを発火
            if (this.gestureCallback) {
                this.gestureCallback(gesture);
            }
        }
    }
    
    onGesture(callback) {
        this.gestureCallback = callback;
    }
}