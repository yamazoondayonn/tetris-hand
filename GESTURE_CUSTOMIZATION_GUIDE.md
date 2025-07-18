# 🎮 手の動きカスタマイズガイド

このガイドでは、MediaPipeを使った手の動き（ジェスチャー）認識の仕組みと、カスタマイズ方法を初心者にもわかりやすく説明します。

## 📚 目次

1. [手の認識の基本](#1-手の認識の基本)
2. [コードの構造を理解しよう](#2-コードの構造を理解しよう)
3. [ジェスチャーをカスタマイズする方法](#3-ジェスチャーをカスタマイズする方法)
4. [練習問題](#4-練習問題)
5. [上級カスタマイズ](#5-上級カスタマイズ)

## 1. 手の認識の基本

### MediaPipeの21個のランドマーク

MediaPipeは手を21個の点（ランドマーク）で表現します：

```
    8   12  16  20  ← 指先（Tip）
    |   |   |   |
    7   11  15  19
    |   |   |   |
    6   10  14  18
    |   |   |   |
4   5   9   13  17  ← 指の付け根（MCP）
 \ | / | / | /
  \|/ |/ |/
   3  2  1
    \ | /
     \|/
      0 ← 手首（Wrist）
```

各番号の意味：
- 0: 手首
- 1-4: 親指
- 5-8: 人差し指
- 9-12: 中指
- 13-16: 薬指
- 17-20: 小指

### 座標システム

各ランドマークは3つの値を持ちます：
- `x`: 左右の位置（0.0〜1.0）
- `y`: 上下の位置（0.0〜1.0）
- `z`: 奥行き（カメラからの距離）

## 2. コードの構造を理解しよう

### 重要なファイル

```
src/hand/tracker.js  ← ここでジェスチャーを認識
```

### ジェスチャー認識の流れ

```javascript
// tracker.js の重要な部分

recognizeGesture(landmarks) {
    // 1. 必要なランドマークを取得
    const wrist = landmarks[0];        // 手首
    const middleBase = landmarks[9];   // 中指の付け根
    
    // 2. 計算や判定を行う
    const angle = /* 角度を計算 */;
    
    // 3. ジェスチャーを判定して返す
    if (angle < -30) {
        return 'right';
    }
    // ...
}
```

## 3. ジェスチャーをカスタマイズする方法

### 🎯 基本的なカスタマイズ例

#### 例1: 手の傾きの感度を変える

現在のコード（tracker.js 90行目付近）：
```javascript
// 手の傾きを計算
const angle = Math.atan2(middleBase.y - wrist.y, middleBase.x - wrist.x) * 180 / Math.PI;

// ジェスチャー判定
if (angle < -30) {
    return 'right';
} else if (angle > 30) {
    return 'left';
}
```

**カスタマイズ例**：より敏感にする
```javascript
// 角度を20度に変更（より小さい傾きで反応）
if (angle < -20) {    // -30 → -20
    return 'right';
} else if (angle > 20) {  // 30 → 20
    return 'left';
}
```

#### 例2: 新しいジェスチャーを追加する

**「グー」でゲームを一時停止する機能を追加**

1. まず、tracker.js に指が閉じているかを判定する関数を追加：

```javascript
// 全ての指が閉じているかチェック
isFist(landmarks) {
    // 各指の先端と付け根の距離をチェック
    const fingers = [
        { tip: 4, base: 2 },   // 親指
        { tip: 8, base: 5 },   // 人差し指
        { tip: 12, base: 9 },  // 中指
        { tip: 16, base: 13 }, // 薬指
        { tip: 20, base: 17 }  // 小指
    ];
    
    for (let finger of fingers) {
        const tipY = landmarks[finger.tip].y;
        const baseY = landmarks[finger.base].y;
        
        // 指先が付け根より上にある（開いている）場合
        if (tipY < baseY - 0.05) {
            return false;
        }
    }
    
    return true;  // 全ての指が閉じている
}
```

2. recognizeGesture 関数に追加：

```javascript
recognizeGesture(landmarks) {
    // 既存のコード...
    
    // グーの判定を追加
    if (this.isFist(landmarks)) {
        return 'pause';
    }
    
    // 既存の判定...
}
```

3. main.js でpauseアクションを処理：

```javascript
switch(gesture) {
    // 既存のケース...
    case 'pause':
        this.togglePause();
        break;
}
```

### 🎨 ビジュアルフィードバックの追加

手の状態を画面に表示してデバッグしやすくする：

```javascript
// tracker.js の onResults 関数内に追加
onResults(results) {
    // 既存のコード...
    
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const landmarks = results.multiHandLandmarks[0];
        
        // デバッグ情報を表示
        const wrist = landmarks[0];
        const middleBase = landmarks[9];
        const angle = Math.atan2(middleBase.y - wrist.y, middleBase.x - wrist.x) * 180 / Math.PI;
        
        // 角度を画面に表示（新しい要素を追加する必要があります）
        console.log(`手の角度: ${angle.toFixed(1)}度`);
    }
}
```

## 4. 練習問題

### 🔰 初級問題

#### 問題1: ピースサイン（✌️）で特別な動作をさせよう

ヒント：
- 人差し指（8番）と中指（12番）だけが伸びている状態
- 他の指は曲がっている状態

<details>
<summary>💡 解答例を見る</summary>

```javascript
isPeaceSign(landmarks) {
    // 人差し指が伸びているか
    const indexExtended = landmarks[8].y < landmarks[5].y - 0.1;
    
    // 中指が伸びているか
    const middleExtended = landmarks[12].y < landmarks[9].y - 0.1;
    
    // 薬指が曲がっているか
    const ringBent = landmarks[16].y > landmarks[13].y - 0.05;
    
    // 小指が曲がっているか
    const pinkyBent = landmarks[20].y > landmarks[17].y - 0.05;
    
    return indexExtended && middleExtended && ringBent && pinkyBent;
}
```

</details>

#### 問題2: 感度調整機能を作ろう

設定ファイルを作って、角度の閾値を変更できるようにしてみましょう。

<details>
<summary>💡 解答例を見る</summary>

1. 設定を保持する変数を追加：

```javascript
// tracker.js の上部に追加
class HandTracker {
    constructor(videoElement, canvasElement) {
        // 既存のコード...
        
        // 設定値
        this.settings = {
            leftAngle: 30,
            rightAngle: -30,
            gestureThreshold: 300
        };
    }
}
```

2. 設定を使うように変更：

```javascript
recognizeGesture(landmarks) {
    // 既存のコード...
    
    if (angle < this.settings.rightAngle) {
        return 'right';
    } else if (angle > this.settings.leftAngle) {
        return 'left';
    }
}
```

</details>

### 🏃 中級問題

#### 問題3: 指の本数でスピードを変える

開いている指の本数で落下速度を制御してみましょう。

<details>
<summary>💡 解答例を見る</summary>

```javascript
countOpenFingers(landmarks) {
    let count = 0;
    const fingers = [
        { tip: 4, base: 2 },   // 親指
        { tip: 8, base: 5 },   // 人差し指
        { tip: 12, base: 9 },  // 中指
        { tip: 16, base: 13 }, // 薬指
        { tip: 20, base: 17 }  // 小指
    ];
    
    for (let i = 0; i < fingers.length; i++) {
        const finger = fingers[i];
        
        if (i === 0) { // 親指は横方向で判定
            if (Math.abs(landmarks[finger.tip].x - landmarks[finger.base].x) > 0.1) {
                count++;
            }
        } else { // 他の指は縦方向で判定
            if (landmarks[finger.tip].y < landmarks[finger.base].y - 0.05) {
                count++;
            }
        }
    }
    
    return count;
}

// recognizeGesture に追加
const openFingers = this.countOpenFingers(landmarks);
if (openFingers === 1) {
    return 'slow_drop';
} else if (openFingers === 5) {
    return 'fast_drop';
}
```

</details>

### 🚀 上級問題

#### 問題4: ジェスチャーの組み合わせ

「人差し指を立てて、手を回転させる」でブロックを回転させる機能を実装しよう。

ヒント：
- 前フレームの手の位置を記憶
- 手の中心点の移動を追跡
- 円を描く動きを検出

<details>
<summary>💡 解答例を見る</summary>

```javascript
class HandTracker {
    constructor(videoElement, canvasElement) {
        // 既存のコード...
        
        // 手の位置履歴
        this.handHistory = [];
        this.maxHistoryLength = 10;
    }
    
    detectCircularMotion(landmarks) {
        // 手の中心を計算
        const palmCenter = {
            x: (landmarks[0].x + landmarks[5].x + landmarks[17].x) / 3,
            y: (landmarks[0].y + landmarks[5].y + landmarks[17].y) / 3
        };
        
        // 履歴に追加
        this.handHistory.push(palmCenter);
        if (this.handHistory.length > this.maxHistoryLength) {
            this.handHistory.shift();
        }
        
        // 履歴が十分でない場合
        if (this.handHistory.length < this.maxHistoryLength) {
            return false;
        }
        
        // 移動距離を計算
        let totalDistance = 0;
        for (let i = 1; i < this.handHistory.length; i++) {
            const dx = this.handHistory[i].x - this.handHistory[i-1].x;
            const dy = this.handHistory[i].y - this.handHistory[i-1].y;
            totalDistance += Math.sqrt(dx * dx + dy * dy);
        }
        
        // 始点と終点の距離
        const startEnd = Math.sqrt(
            Math.pow(this.handHistory[0].x - palmCenter.x, 2) +
            Math.pow(this.handHistory[0].y - palmCenter.y, 2)
        );
        
        // 円を描いているか判定
        return totalDistance > 0.3 && startEnd < 0.1;
    }
}
```

</details>

## 5. 上級カスタマイズ

### 🎯 機械学習を使った独自ジェスチャー

より複雑なジェスチャーを認識したい場合は、TensorFlow.jsを使って独自の分類器を作ることもできます。

```javascript
// 将来の拡張例
class CustomGestureRecognizer {
    async loadModel() {
        this.model = await tf.loadLayersModel('/models/custom-gestures/model.json');
    }
    
    async predict(landmarks) {
        // ランドマークを配列に変換
        const input = landmarks.flatMap(l => [l.x, l.y, l.z]);
        const prediction = await this.model.predict(tf.tensor2d([input]));
        return prediction;
    }
}
```

### 🎨 デバッグツールの作成

開発を簡単にするため、デバッグモードを追加：

```javascript
// tracker.js に追加
enableDebugMode() {
    this.debugMode = true;
    
    // デバッグパネルを作成
    const debugPanel = document.createElement('div');
    debugPanel.id = 'debug-panel';
    debugPanel.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 10px;
        font-family: monospace;
    `;
    document.body.appendChild(debugPanel);
}

updateDebugInfo(landmarks) {
    if (!this.debugMode) return;
    
    const panel = document.getElementById('debug-panel');
    const angle = this.calculateAngle(landmarks);
    const gesture = this.recognizeGesture(landmarks);
    
    panel.innerHTML = `
        <h3>Debug Info</h3>
        <p>Angle: ${angle.toFixed(1)}°</p>
        <p>Gesture: ${gesture || 'none'}</p>
        <p>FPS: ${this.fps}</p>
    `;
}
```

## 🎓 まとめ

このガイドで学んだこと：
1. MediaPipeのランドマークシステム
2. ジェスチャー認識の基本的な仕組み
3. カスタムジェスチャーの作り方
4. デバッグとテストの方法

### 次のステップ

- より複雑なジェスチャーを実装してみる
- 2つの手を使った操作を追加する
- ジェスチャーの学習機能を実装する
- 友達とジェスチャーを共有する機能を作る

## 📚 参考リンク

- [MediaPipe公式ドキュメント](https://google.github.io/mediapipe/solutions/hands.html)
- [JavaScript MDN Web Docs](https://developer.mozilla.org/ja/docs/Web/JavaScript)
- [TensorFlow.js](https://www.tensorflow.org/js)

---

💡 **ヒント**: わからないことがあったら、コンソールログ（`console.log()`）を使って値を確認しながら進めましょう！