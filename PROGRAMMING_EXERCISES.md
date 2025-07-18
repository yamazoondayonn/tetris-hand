# 🎯 プログラミング練習問題集

このファイルでは、テトリスゲームを改造しながらプログラミングを学べる練習問題を用意しました。初心者から上級者まで、段階的に学習できます。

## 📚 目次

1. [準備編 - コードを読もう](#準備編---コードを読もう)
2. [初級編 - 小さな変更から始めよう](#初級編---小さな変更から始めよう)
3. [中級編 - 新機能を追加しよう](#中級編---新機能を追加しよう)
4. [上級編 - 大きな改造に挑戦](#上級編---大きな改造に挑戦)
5. [発展編 - オリジナルゲームを作ろう](#発展編---オリジナルゲームを作ろう)

---

## 準備編 - コードを読もう

### 📖 演習0-1: コードの構造を理解する

**目標**: プロジェクトの全体構造を把握する

1. 各ファイルを開いて、最初の10行を読んでみましょう
2. 以下の質問に答えてください：
   - `index.html` の役割は？
   - `main.js` は何をしているファイル？
   - `tetris.js` と `tracker.js` の違いは？

<details>
<summary>💡 答え</summary>

- `index.html`: ゲームの画面構造（HTML）を定義
- `main.js`: アプリ全体を管理し、ゲームとカメラを連携
- `tetris.js`: テトリスのゲームロジック
- `tracker.js`: 手の動きを認識する処理

</details>

### 📖 演習0-2: console.logで値を確認しよう

**目標**: デバッグの基本を学ぶ

`src/hand/tracker.js` の `recognizeGesture` 関数に以下を追加：

```javascript
recognizeGesture(landmarks) {
    const wrist = landmarks[0];
    const middleBase = landmarks[9];
    
    // ここに追加
    console.log('手首の位置:', wrist);
    console.log('中指の付け根:', middleBase);
    
    // 以下既存のコード...
}
```

ブラウザの開発者ツール（F12）でコンソールを確認してみましょう。

---

## 初級編 - 小さな変更から始めよう

### 🔰 問題1-1: ゲームの色を変えてみよう

**ファイル**: `src/game/tetris.js`

**課題**: テトリスブロックの色を自分の好きな色に変更する

現在のコード（30行目付近）：
```javascript
this.colors = [
    '#000000', // 0: 空
    '#00f0f0', // 1: I - シアン
    '#f0f000', // 2: O - 黄色
    // ...
];
```

**ヒント**: 
- 色は16進数カラーコード（#RRGGBB）で指定
- [カラーピッカー](https://www.google.com/search?q=color+picker)で好きな色を選べます

**チャレンジ**: 虹色（レインボー）のテーマを作ってみよう！

### 🔰 問題1-2: ゲームスピードを調整しよう

**ファイル**: `src/game/tetris.js`

**課題**: ゲームの初期スピードを変更する

現在のコード（17行目付近）：
```javascript
this.dropInterval = 1000; // ミリ秒
```

**実験**:
1. `500` に変更 → どうなる？
2. `2000` に変更 → どうなる？
3. 自分にとってちょうど良いスピードを見つけよう

### 🔰 問題1-3: スコアの計算を変えよう

**ファイル**: `src/game/tetris.js`

**課題**: ラインを消したときのスコアを2倍にする

現在のコード（`checkLines`関数内、180行目付近）：
```javascript
this.score += linesCleared * 100 * this.level;
```

**チャレンジ**: 
- 一度に複数ライン消したらボーナス点を追加
- 例: 2ライン同時 → 300点、3ライン → 500点、4ライン（テトリス） → 1000点

<details>
<summary>💡 解答例</summary>

```javascript
// ボーナス計算
let bonus = 0;
switch(linesCleared) {
    case 1: bonus = 100; break;
    case 2: bonus = 300; break;
    case 3: bonus = 500; break;
    case 4: bonus = 1000; break;
}
this.score += bonus * this.level;
```

</details>

---

## 中級編 - 新機能を追加しよう

### 🏃 問題2-1: 次のピース表示機能

**課題**: 次に落ちてくるピースを画面に表示する

**手順**:
1. `tetris.js` に `nextPiece` 変数を追加
2. `spawnPiece` で次のピースを決定
3. `index.html` に表示エリアを追加
4. 次のピースを描画

<details>
<summary>💡 実装のヒント</summary>

1. tetris.js に追加：
```javascript
constructor(canvas) {
    // 既存のコード...
    this.nextPiece = null;
    this.nextPieceType = 0;
}

spawnPiece() {
    // 現在のnextPieceを使用
    if (this.nextPiece) {
        this.currentPiece = this.nextPiece;
        // 新しい次のピースを生成
    }
    // ...
}
```

2. HTMLに追加：
```html
<div class="next-piece">
    <h3>次のピース</h3>
    <canvas id="next-piece-canvas" width="120" height="120"></canvas>
</div>
```

</details>

### 🏃 問題2-2: 効果音を追加しよう

**課題**: ライン消去時に音を鳴らす

**手順**:
1. 効果音ファイルを用意（または[フリー素材](https://freesound.org/)を使用）
2. `Audio` オブジェクトを作成
3. 適切なタイミングで再生

```javascript
// tetris.js のコンストラクタに追加
this.sounds = {
    lineClear: new Audio('/sounds/line-clear.mp3'),
    gameOver: new Audio('/sounds/game-over.mp3')
};

// checkLines関数で音を再生
if (linesCleared > 0) {
    this.sounds.lineClear.play();
}
```

### 🏃 問題2-3: パーティクルエフェクト

**課題**: ラインが消えるときにパーティクル（粒子）エフェクトを表示

**ヒント**: 
- 配列で複数のパーティクルを管理
- 各パーティクルは位置、速度、色、寿命を持つ
- `render`関数で描画、`update`関数で更新

<details>
<summary>💡 基本的な実装</summary>

```javascript
class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 4;
        this.vy = (Math.random() - 0.5) * 4;
        this.life = 1.0;
        this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.1; // 重力
        this.life -= 0.02;
    }
    
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.life;
        ctx.fillRect(this.x, this.y, 4, 4);
        ctx.globalAlpha = 1.0;
    }
}
```

</details>

---

## 上級編 - 大きな改造に挑戦

### 🚀 問題3-1: ゴーストピース機能

**課題**: 現在のピースが落ちる位置を半透明で表示する

**必要なスキル**:
- 衝突判定の理解
- Canvas の透明度操作
- 予測計算

### 🚀 問題3-2: マルチプレイヤーモード

**課題**: 2人で同時にプレイできるモードを追加

**実装内容**:
- 画面を2分割
- それぞれ独立したゲームインスタンス
- 相手にブロックを送る機能

### 🚀 問題3-3: AIプレイヤー

**課題**: 自動でテトリスをプレイするAIを作る

**アルゴリズムのヒント**:
1. 可能な配置をすべて計算
2. 各配置を評価（高さ、穴の数、ライン消去可能性）
3. 最良の配置を選択

---

## 発展編 - オリジナルゲームを作ろう

### 🌟 プロジェクト案

#### 1. テトリス × リズムゲーム
- 音楽に合わせてブロックが落ちる
- リズムに合わせて操作するとボーナス

#### 2. テトリス × RPG
- ブロックを消すと経験値獲得
- レベルアップで新しい能力解放
- ボスバトルモード

#### 3. 協力型テトリス
- 2人で1つのフィールドを操作
- 役割分担（移動係、回転係）
- コミュニケーションが鍵

### 🌟 実装のアドバイス

1. **小さく始める**: まず基本機能から
2. **頻繁にテスト**: 動作確認を忘れずに
3. **コメントを書く**: 後で見返せるように
4. **楽しむ**: 創造性を発揮しよう！

---

## 📝 学習の記録

各問題を解いたら、以下を記録してみましょう：

```markdown
## 問題X-X: [問題名]
- 日付: 2024/XX/XX
- 難易度: ★★★☆☆
- かかった時間: XX分
- 学んだこと:
  - 
  - 
- 次回への課題:
  - 
```

---

## 🎉 完走おめでとう！

すべての問題を解いたあなたは、もう立派なゲーム開発者です！

次のステップ：
- GitHubで自分の作品を公開しよう
- 友達に遊んでもらってフィードバックをもらおう
- 新しい技術（Three.js、Phaser.js など）に挑戦しよう
- ゲームジャムに参加してみよう

**Happy Coding! 🚀**