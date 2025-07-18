# Hand Tracking Tetris

MediaPipeのハンドトラッキングを使って、手のジェスチャーでテトリスを操作するWebアプリケーションです。

## 📚 学習用ドキュメント

- 🎮 **[手の動きカスタマイズガイド](./GESTURE_CUSTOMIZATION_GUIDE.md)** - ジェスチャーの仕組みとカスタマイズ方法
- 🎯 **[プログラミング練習問題集](./PROGRAMMING_EXERCISES.md)** - 初心者から上級者向けの練習問題

## デモ

手をカメラに向けて以下のジェスチャーでテトリスを操作します：
- 👈 手を左に傾ける：ブロックを左に移動
- 👉 手を右に傾ける：ブロックを右に移動
- 👇 手を下に向ける：ブロックを高速落下
- ☝️ 人差し指を立てる：ブロックを回転

## GitHub Codespacesでの詳細なセットアップ手順

### 1. Codespacesの起動

#### GitHubリポジトリから起動する場合
1. GitHubでこのリポジトリを開く
2. 緑色の「Code」ボタンをクリック
3. 「Codespaces」タブを選択
4. 「Create codespace on main」をクリック
5. 新しいタブでCodespacesが起動するまで待つ（初回は2-3分かかります）

#### 新規プロジェクトとして始める場合
1. GitHub.comにログイン
2. 右上の「+」アイコンから「New codespace」を選択
3. 「Blank」テンプレートを選択して起動

### 2. プロジェクトのセットアップ

Codespacesが起動したら、下部のターミナルで以下のコマンドを順番に実行：

```bash
# 1. プロジェクトフォルダがない場合は作成（新規の場合のみ）
mkdir tetris-hand
cd tetris-hand

# 2. このリポジトリのファイルをコピー（既存のファイルがある場合はスキップ）
# ファイルがすでにある場合は、この手順をスキップしてください
git clone https://github.com/itoksk/tetris-hand.git temp_clone
cp -r temp_clone/* .
cp -r temp_clone/.* . 2>/dev/null || true
rm -rf temp_clone

# 3. 依存関係のインストール前にクリーンアップ（推奨）
rm -rf node_modules package-lock.json
npm cache clean --force

# 4. 依存関係のインストール
npm install

# 5. 開発サーバーの起動
npm run dev

# もしnpm run devでエラーが出る場合は以下を実行
npx vite --host 0.0.0.0
```

### 3. アプリケーションへのアクセス

#### ポート転送の確認
1. Codespacesの画面下部にある「PORTS（ポート）」タブをクリック
2. 「5173」ポート（Viteのデフォルト）が表示されるまで待つ
3. ポートが表示されない場合は、ターミナルに表示されるURLを確認

#### ブラウザでアプリを開く
1. PORTSタブの「5173」の行にある地球アイコン（🌐）をクリック
2. 新しいタブでアプリケーションが開きます
3. または、「転送されたアドレス」列のURLをコピーして新しいタブで開く

### 4. カメラの設定

1. ブラウザでアプリが開いたら、カメラアクセスの許可ダイアログが表示されます
2. 「許可」または「Allow」をクリック
3. カメラが起動し、右側の画面に映像が表示されます

### 5. ゲームの開始

1. 「ゲーム開始」ボタンをクリック
2. カメラに手を映して、以下のジェスチャーで操作：
   - 手を左に傾ける → ブロックが左に移動
   - 手を右に傾ける → ブロックが右に移動
   - 手を下に向ける → ブロックが高速落下
   - 人差し指を立てる → ブロックが回転

## クイックスタート（初回セットアップ）

Codespacesターミナルで以下のコマンドをコピー&ペーストして実行：

```bash
# クリーンな環境から始める
rm -rf node_modules package-lock.json
npm cache clean --force

# 初期化とパッケージインストール
npm init -y
npm install --save-dev vite
npm install @mediapipe/hands @mediapipe/camera_utils @mediapipe/drawing_utils

# スクリプトの設定
npm pkg set scripts.dev="vite"
npm pkg set scripts.build="vite build"
npm pkg set scripts.preview="vite preview"

# 開発サーバーの起動
npm run dev

# もしエラーが出る場合は
npx vite --host 0.0.0.0
```

## 自分のGitHubリポジトリに保存する方法

プログラムをカスタマイズした後、自分のGitHubアカウントに保存する手順：

### 1. GitHubで新しいリポジトリを作成
1. [GitHub](https://github.com)にログイン
2. 右上の「+」アイコン → 「New repository」
3. 設定：
   - Repository name: `my-tetris-hand`（好きな名前でOK）
   - Description: 「手の動きで操作するテトリスゲーム」など
   - Public または Private を選択
   - **重要**: 「Add a README file」のチェックは**外す**
4. 「Create repository」をクリック

### 2. Codespacesで以下のコマンドを実行

```bash
# Gitリポジトリとして初期化（まだの場合）
git init

# すべてのファイルをステージング
git add .

# 初回コミット
git commit -m "手の動きで操作するテトリスゲームを作成"

# 自分のリポジトリに接続（YOUR_USERNAMEは自分のGitHubユーザー名に置き換える）
git remote add origin https://github.com/YOUR_USERNAME/my-tetris-hand.git

# mainブランチに設定
git branch -M main

# GitHubにプッシュ
git push -u origin main
```

### 3. 今後の変更を保存する場合

```bash
# 変更したファイルを確認
git status

# 変更をステージング
git add .

# コミット（変更内容を説明するメッセージを書く）
git commit -m "ジェスチャーの感度を調整"

# GitHubにプッシュ
git push
```

### よくあるエラーと対処法

**認証エラーが出る場合**
```bash
# GitHubのユーザー名とメールを設定
git config --global user.name "あなたのGitHubユーザー名"
git config --global user.email "あなたのメールアドレス"
```

**リモートリポジトリが既に存在する場合**
```bash
# 既存のリモート設定を確認
git remote -v

# 既存のリモートを削除して再設定
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/my-tetris-hand.git
```

## プロジェクト構成

```
tetris-hand/
├── README.md          # このファイル
├── index.html         # メインHTML
├── package.json       # npm設定
├── src/
│   ├── main.js        # エントリーポイント
│   ├── game/
│   │   └── tetris.js  # テトリスゲームロジック
│   └── hand/
│       └── tracker.js # ハンドトラッキング
└── styles/
    └── main.css       # スタイルシート
```

## MediaPipe Handsについて

### MediaPipe Handsとは？

MediaPipe Handsは、Google社が開発した**手の形を認識する技術**です。カメラに映った手の画像から、リアルタイムで手の位置や指の関節（かんせつ）の場所を検出することができます。

#### わかりやすく言うと...
- スマートフォンのカメラで自分の顔にエフェクトをかける機能を使ったことはありますか？
- あれと同じように、MediaPipe Handsは「手」を認識して、その動きを追跡（ついせき）します
- **21個の点**（ランドマーク）で手の形を表現します

### どうやって手を認識しているの？

#### 1. 機械学習（きかいがくしゅう）の活用
MediaPipe Handsは**ディープラーニング**という技術を使っています。これは人間の脳の仕組みをまねたコンピュータープログラムです。

- たくさんの手の画像を見せて「これが手だよ」と教える
- コンピューターが手の特徴を自動的に学習する
- 新しい画像を見せると、学習した知識を使って手を見つける

#### 2. 処理の流れ
1. **手の検出**：画像の中から手がある場所を見つける
2. **ランドマーク検出**：手の21個の重要な点（指の関節など）を特定
3. **追跡**：次のフレームでも手を追い続ける

### JavaScriptでの実装

このプロジェクトではJavaScript版のMediaPipe Handsを使用しています。Pythonだけでなく、Webブラウザ上でも動作するのが特徴です。

```javascript
// MediaPipe Handsの基本的な使い方
import {Hands} from '@mediapipe/hands';

// 手認識の設定
const hands = new Hands({
  maxNumHands: 2,        // 最大2つの手を認識
  modelComplexity: 1,    // モデルの複雑さ（0-1）
  minDetectionConfidence: 0.5,  // 検出の信頼度（0-1）
});
```

### 基幹技術と産業への応用

#### 1. コンピュータービジョン
MediaPipe Handsは**コンピュータービジョン**という分野の技術です。これは「コンピューターに目を持たせる」技術で、カメラの画像から意味のある情報を取り出します。

#### 2. 産業界での応用例

**製造業**
- 工場での作業員の動作分析
- 危険な動作の検知と警告
- 品質管理での手作業の自動チェック

**医療・リハビリテーション**
- 手の動きのリハビリ支援
- 手話の自動翻訳システム
- 外科医の手術手技の分析

**エンターテインメント**
- VR/ARでの自然な手の操作
- ゲームのモーションコントロール
- バーチャルピアノなどの楽器演奏

**自動車産業**
- 運転中のジェスチャー操作
- ドライバーの疲労検知
- 車内エンターテインメントの操作

#### 3. ネットワーク技術との関連

**エッジコンピューティング**
- MediaPipeは端末（エッジ）で処理を行うため、ネットワーク遅延がない
- プライバシーを守りながら高速な処理が可能

**WebRTC（Web Real-Time Communication）**
- ブラウザでカメラ映像を扱う技術
- リアルタイムでの映像処理を可能にする

### 学習のポイント

1. **数学の重要性**：座標計算や行列演算が使われています
2. **プログラミング**：JavaScriptでリアルタイム処理を実装
3. **問題解決能力**：手の動きをゲーム操作に変換する工夫

このような技術を学ぶことで、将来的にはロボット工学、AI開発、ヒューマンインターフェース設計などの分野で活躍できる可能性があります。

## 動作環境

- Webカメラが必要です
- Chrome推奨（MediaPipeの互換性のため）
- 明るい場所での使用を推奨

## トラブルシューティング

### Codespacesでよくある問題と解決方法

#### ポートが表示されない場合
```bash
# ホストを明示的に指定して起動
npx vite --host 0.0.0.0

# または、別のポートで起動
npx vite --port 3000 --host
```

#### npm installでエラーが出る場合
```bash
# キャッシュをクリアして再インストール
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

#### カメラが認識されない場合
1. ブラウザのアドレスバーの左側にあるカメラアイコンを確認
2. カメラがブロックされていないか確認
3. ブラウザの設定 → プライバシーとセキュリティ → サイトの設定 → カメラ で許可
4. Codespacesは自動的にHTTPSで提供されるため、カメラアクセスが可能です

#### 手の認識がうまくいかない場合
- 背景と手のコントラストを確保してください
- カメラから30-100cmの距離を保ってください
- 十分な照明があることを確認してください
- 手のひらをカメラに向けてはっきりと表示してください

#### Codespacesのパフォーマンスが遅い場合
1. Codespacesのマシンタイプを確認（無料版は2コア、4GB RAM）
2. 不要なタブやアプリケーションを閉じる
3. ブラウザのハードウェアアクセラレーションを有効にする

## ライセンス

MIT