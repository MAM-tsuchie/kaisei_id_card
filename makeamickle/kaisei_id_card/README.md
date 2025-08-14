# 開成デジタル学生証システム

## 概要
某中高一貫校（生徒750名、卒業生10,000名）向けのデジタル学生証システムです。

## 主な機能
- デジタル学生証の表示（オフライン対応）
- バーコード/QRコード生成
- 管理者向けWeb管理画面
- 年次処理自動化

## 技術スタック
- **モバイルアプリ**: Flutter 3.0+ (iOS/Android/Web)
- **管理画面**: Next.js 14.0+ / React 18.0+ / TypeScript 5.0+
- **バックエンド**: Firebase (Firestore, Functions, Auth, Storage)
- **インフラ**: Google Cloud Platform (asia-northeast1)

## 必要な環境
- Node.js 18以上
- npm 9以上
- Flutter 3.0以上
- Firebase CLI
- **Java 11以上** (Firebaseエミュレータ用)

## セットアップ

### 1. リポジトリのクローン
```bash
git clone [repository-url]
cd kaisei_id_card
```

### 2. Java環境のセットアップ（重要）
```bash
# HomebrewでJava 11をインストール
brew install openjdk@11

# Javaが正しくインストールされているか確認
npm run check-java
```

### 3. 依存関係のインストール
```bash
npm install
```

### 4. 環境変数の設定
```bash
cp .env.example .env
# .envファイルを編集（Phase 2以降で実際の値を設定）
```

### 5. Firebaseエミュレータの起動
```bash
# Java環境をチェックしてからエミュレータ起動
npm run check-java
npm run dev:emulator
```

### 6. 開発サーバーの起動

#### すべてのサービスを同時起動
```bash
npm run dev:all
```

#### 個別起動
```bash
# Flutter アプリ
flutter run -d chrome --target apps/student-app/lib/main.dart

# Next.js 管理画面
npm run dev --workspace=apps/admin-web

# Cloud Functions
npm run serve --workspace=functions
```

## 開発ガイド

### コマンド一覧
| コマンド | 説明 |
|---------|------|
| `npm run dev:all` | 全サービス起動 |
| `npm run build:all` | 全プロジェクトビルド |
| `npm run test:all` | 全テスト実行 |
| `npm run lint:all` | Lint実行 |
| `npm run format:all` | コードフォーマット |

### プロジェクト構造
```
kaisei_id_card/
├── apps/
│   ├── student-app/     # Flutter モバイルアプリ
│   └── admin-web/       # Next.js 管理画面
├── functions/           # Cloud Functions
├── packages/
│   ├── shared/          # 共通型定義・ユーティリティ
│   └── firebase-config/ # Firebase設定
└── docs/                # ドキュメント
```

### ドキュメント
- [プロジェクト指針](./CLAUDE.md)
- [コーディング規約](./docs/coding-standards.md)
- [システム要件](./docs/system-requirements.md)
- [機能仕様](./docs/functional-specifications.md)
- [実装ロードマップ](./docs/implementation-roadmap.md)

## テスト

### ユニットテスト実行
```bash
npm run test:all
```

### カバレッジレポート
```bash
npm run test:coverage
```

## デプロイ
※ Phase 2以降で実装

## ライセンス
Proprietary - All rights reserved

## お問い合わせ
[連絡先情報]