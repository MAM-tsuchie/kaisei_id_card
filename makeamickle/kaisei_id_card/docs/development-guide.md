# 開発環境構築ガイド

## 前提条件

### 必須ソフトウェア
- Node.js 18.0.0以上
- npm 9.0.0以上
- Flutter 3.0.0以上
- Firebase CLI最新版
- Git

### 推奨エディタ
- Visual Studio Code
  - 拡張機能:
    - Flutter
    - Dart
    - ESLint
    - Prettier
    - Firebase

## セットアップ手順

### 1. 環境確認
```bash
node --version  # v18.0.0以上
npm --version   # 9.0.0以上
flutter --version # 3.0.0以上
firebase --version # 最新版
```

### 2. プロジェクトセットアップ
```bash
# リポジトリクローン
git clone [repository-url]
cd kaisei_id_card

# 依存関係インストール
npm install

# Flutter依存関係
cd apps/student-app && flutter pub get && cd ../..
```

### 3. エミュレータ設定
```bash
# 初回のみ実行
firebase init emulators

# エミュレータ起動
firebase emulators:start
```

## 開発ワークフロー

### ブランチ戦略
- `main`: 本番環境
- `develop`: 開発環境
- `feature/*`: 機能開発
- `hotfix/*`: 緊急修正

### コミットメッセージ規約
```
feat: 新機能追加
fix: バグ修正
docs: ドキュメント更新
style: コードスタイル修正
refactor: リファクタリング
test: テスト追加・修正
chore: ビルド・補助ツール
```

### コードレビュー必須項目
- [ ] TypeScript型安全性チェック
- [ ] セキュリティ脆弱性チェック
- [ ] テストカバレッジ確認
- [ ] パフォーマンス影響確認
- [ ] ドキュメント更新確認

## 日常的な開発タスク

### 新機能開発の流れ
1. `develop`ブランチから`feature/`ブランチを作成
2. 機能実装とテスト作成
3. Lint・TypeScriptチェック実行
4. プルリクエスト作成
5. コードレビュー
6. `develop`ブランチにマージ

### テスト実行
```bash
# 全テスト実行
npm run test:all

# 個別テスト実行
npm run test --workspace=functions
npm run test --workspace=apps/admin-web
flutter test apps/student-app

# カバレッジレポート
npm run test:coverage
```

### コード品質チェック
```bash
# Lint実行
npm run lint:all

# フォーマット実行
npm run format:all

# TypeScriptチェック
npm run type-check
```

### デバッグ方法

#### Firebase エミュレータ使用
```bash
# エミュレータ起動
firebase emulators:start

# ログ確認
firebase emulators:exec --only functions 'echo "Functions running"'
```

#### Next.js デバッグ
```bash
# デバッグモードで起動
npm run dev --workspace=apps/admin-web

# ブラウザで http://localhost:3000 にアクセス
```

#### Flutter デバッグ
```bash
# Chrome WebでFlutterアプリ起動
flutter run -d chrome --target apps/student-app/lib/main.dart

# ホットリロード: r
# ホットリスタート: R
# 終了: q
```

## トラブルシューティング

### よくある問題

#### 1. npm install エラー
```bash
# node_modules削除して再インストール
rm -rf node_modules package-lock.json
npm install
```

#### 2. Flutter pub get エラー
```bash
# Flutterキャッシュクリア
flutter clean apps/student-app
flutter pub get apps/student-app
```

#### 3. Firebase エミュレータ起動エラー
```bash
# Java確認
java --version  # 11以上必要

# ポート使用状況確認
lsof -i :4000  # Firestore
lsof -i :5000  # Firebase Hosting
lsof -i :5001  # Cloud Functions
```

#### 4. TypeScript エラー
```bash
# TypeScript設定確認
npm run type-check

# 型定義更新
npm install --save-dev @types/node
```

### パフォーマンス最適化

#### ビルド時間短縮
```bash
# npmキャッシュクリア
npm cache clean --force

# Firebase Functionsビルド最適化
npm run build --workspace=functions
```

#### メモリ使用量監視
```bash
# Node.jsメモリ使用量確認
node --max-old-space-size=4096 build-script.js
```

## セキュリティ考慮事項

### 開発時の注意点
- 認証情報をコードにハードコーディングしない
- `.env`ファイルをGitに含めない
- Firebase Admin SDKキーを適切に管理
- 本番環境データに開発環境からアクセスしない

### 認証情報管理
```bash
# 環境変数設定例
export FIREBASE_PROJECT_ID=your-project-id
export FIREBASE_ADMIN_KEY_PATH=/path/to/service-account.json
```

## 本番デプロイ前チェックリスト

### コード品質
- [ ] 全テストが成功している
- [ ] Lintエラーがない
- [ ] TypeScriptエラーがない
- [ ] セキュリティスキャン実行済み

### 機能確認
- [ ] 全機能が期待通り動作する
- [ ] エラーハンドリングが適切
- [ ] パフォーマンス要件を満たす
- [ ] モバイル対応確認済み

### ドキュメント
- [ ] README.md更新済み
- [ ] API仕様書更新済み
- [ ] CHANGELOG.md更新済み
- [ ] 運用手順書確認済み

---

**最終更新**: 2025-08-13  
**作成者**: 開発チーム