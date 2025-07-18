# MediaPipeハンドトラッキングテトリス 仕様書

## 1. 概要
MediaPipeのハンドトラッキング機能を使用して、手のジェスチャーでテトリスを操作するシンプルなWebアプリケーションを開発します。GitHub Codespacesで実行可能な環境で構築します。

## 2. システム要件

### 2.1 動作環境
- **プラットフォーム**: Webブラウザ（Chrome推奨）
- **カメラ**: Webカメラ必須
- **実行環境**: GitHub Codespaces
- **Node.js**: 18.x以上

### 2.2 技術スタック（最小構成）
- **フロントエンド**: HTML5, CSS3, JavaScript
- **ハンドトラッキング**: MediaPipe Hands
- **ゲーム描画**: Canvas API
- **開発サーバー**: Vite（シンプルで高速）
- **パッケージ管理**: npm

## 3. Codespacesターミナルでの実行手順

### 3.1 GitHub Codespacesターミナルでのセットアップ
```bash
# 1. Codespacesでリポジトリを開いた後、Codespacesのターミナルで実行

# 2. プロジェクトディレクトリの作成と移動
mkdir tetris-hand
cd tetris-hand

# 3. package.jsonの初期化
npm init -y

# 4. 必要なパッケージのインストール
npm install --save-dev vite

# 5. MediaPipe関連パッケージのインストール
npm install @mediapipe/hands @mediapipe/camera_utils @mediapipe/drawing_utils

# 6. 開発サーバーの起動
npm run dev

# 7. ブラウザでプレビュー（Codespacesが自動的にポート転送）
# "PORTS"タブから転送されたURLをクリック
```

### 3.2 プロジェクト作成コマンド
```bash
# ファイル構造を一括作成（Codespacesターミナルで実行）
mkdir -p src/{game,hand} styles
touch index.html src/main.js src/game/tetris.js src/hand/tracker.js styles/main.css
```

### 3.3 package.jsonのスクリプト設定
```bash
# package.jsonに開発用スクリプトを追加
npm pkg set scripts.dev="vite"
npm pkg set scripts.build="vite build"
npm pkg set scripts.preview="vite preview"
```

## 4. 機能仕様（シンプル版）

### 4.1 最小限のゲーム機能
- **テトリス基本**: 7種類のテトロミノ
- **フィールド**: 10×20グリッド
- **スコア**: ライン消去でポイント獲得
- **ゲームオーバー**: 最上部到達で終了

### 4.2 シンプルなジェスチャー操作
1. **左移動**: 手を左に傾ける
2. **右移動**: 手を右に傾ける
3. **落下**: 手を下に向ける
4. **回転**: 人差し指を立てる

## 5. シンプルなUI設計

### 5.1 画面レイアウト
```
+------------------+------------------+
|                  |                  |
|   テトリス画面    |   カメラ映像     |
|   (50%)         |   (50%)          |
|                  |                  |
|  +-----------+   |                  |
|  |  10 x 20  |   |  手の検出状態    |
|  |  グリッド  |   |                  |
|  +-----------+   |                  |
|                  |                  |
|  スコア: 0       |                  |
+------------------+------------------+
```

## 6. 最小限の実装構造

### 6.1 シンプルなファイル構成
```
tetris-hand/
├── index.html         # メインHTML
├── package.json       # npm設定
├── src/
│   ├── main.js        # メインファイル
│   ├── game/
│   │   └── tetris.js  # テトリスロジック
│   └── hand/
│       └── tracker.js # ハンドトラッキング
└── styles/
    └── main.css       # スタイル
```

### 6.2 最小限のコード例

#### index.html
```html
<!DOCTYPE html>
<html>
<head>
    <title>Hand Tetris</title>
    <link rel="stylesheet" href="styles/main.css">
</head>
<body>
    <div id="game-container">
        <canvas id="tetris-canvas"></canvas>
        <video id="camera-video"></video>
    </div>
    <script type="module" src="src/main.js"></script>
</body>
</html>
```

## 7. Codespacesでの動作確認手順

### 7.1 Codespacesターミナルでの確認
```bash
# 1. Codespacesのターミナルで開発サーバー起動
npm run dev

# 2. Codespacesの画面下部の"PORTS"タブを確認
# 3. 転送されたURL（地球アイコン）をクリック
# 4. ブラウザでカメラ許可ダイアログが出たら"許可"をクリック
# 5. 手をカメラに向けてジェスチャーテスト
```

### 7.2 Codespacesでのトラブルシューティング
```bash
# ポートが表示されない場合（Codespacesターミナルで実行）
npx vite --host

# MediaPipeエラーの場合
npm list @mediapipe/hands

# 依存関係の再インストール
rm -rf node_modules package-lock.json
npm install
```

## 8. 最小動作要件
- カメラアクセス許可
- 安定したインターネット接続（MediaPipeモデルダウンロード用）
- 明るい環境（手の認識精度向上）

## 9. Codespacesでの開発開始
```bash
# Codespacesターミナルですべてを一度に実行するクイックスタート
npm init -y
npm install --save-dev vite
npm install @mediapipe/hands @mediapipe/camera_utils @mediapipe/drawing_utils
npm pkg set scripts.dev="vite"
mkdir -p src/{game,hand} styles
touch index.html src/main.js src/game/tetris.js src/hand/tracker.js styles/main.css
# ファイルにコードを追加後
npm run dev
```