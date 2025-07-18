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
            const gestureName = this.recognizeGesture(landmarks); // "グー", "チョキ", "パー" または null を返す
            let action = null;

            // ジェスチャー名に対応するアクションを割り当てる
            switch (gestureName) {
                case 'グー':
                    action = 'rotate';
                    break;
                case 'チョキ':
                    action = 'right';
                    break;
                case 'パー':
                    action = 'left';
                    break;
            }

            this.handleGesture(action);
            
            // ステータス更新
            document.getElementById('hand-status').textContent = '検出中';
            document.getElementById('gesture-type').textContent = gestureName || '-'; // UIにはジェスチャー名を表示
        } else {
            document.getElementById('hand-status').textContent = '未検出';
            document.getElementById('gesture-type').textContent = '-';
        }
        
        this.ctx.restore();
    }
    
    recognizeGesture(landmarks) {
        // 各指が伸びているかを判定するフラグ
        // 指先(tip)が第二関節(pip)より上(y座標が小さい)にあるかで判定
        const isIndexExtended = landmarks[8].y < landmarks[6].y;
        const isMiddleExtended = landmarks[12].y < landmarks[10].y;
        const isRingExtended = landmarks[16].y < landmarks[14].y;
        const isPinkyExtended = landmarks[20].y < landmarks[18].y;

        // パー: 人差し指、中指、薬指、小指がすべて伸びている
        if (isIndexExtended && isMiddleExtended && isRingExtended && isPinkyExtended) {
            return 'パー';
        }
        
        // チョキ: 人差し指と中指が伸びていて、薬指と小指が曲がっている
        if (isIndexExtended && isMiddleExtended && !isRingExtended && !isPinkyExtended) {
            return 'チョキ';
        }
        
        // グー: 4本の指がすべて曲がっている
        // 指先(tip)が付け根(mcp)より下(y座標が大きい)にあるかで判定
        const isFist = landmarks[8].y > landmarks[5].y &&
                       landmarks[12].y > landmarks[9].y &&
                       landmarks[16].y > landmarks[13].y &&
                       landmarks[20].y > landmarks[17].y;

        if (isFist) {
            return 'グー';
        }
        
        return null; // 認識されたジェスチャーがない場合
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
