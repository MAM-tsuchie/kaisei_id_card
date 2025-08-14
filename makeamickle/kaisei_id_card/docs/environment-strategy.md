# 環境戦略と移行計画

> 📌 **詳細な本番移行計画は [production-migration-plan.md](./production-migration-plan.md) を参照**

## 環境構築の段階的アプローチ

### Phase別環境利用計画

| Phase | 期間 | 使用環境 | Firebase プロジェクト | 目的 |
|-------|------|---------|---------------------|------|
| **Phase 0** | 1週目 | ローカルのみ | なし（エミュレータ） | 環境構築・基盤整備 |
| **Phase 1** | 2週目 | ローカルのみ | なし（エミュレータ） | 認証基盤・基本CRUD |
| **Phase 2** | 3-4週目 | ローカル + 開発環境準備 | kaisei-id-card-dev作成 | 生徒証コア機能 |
| **Phase 3** | 5-6週目 | 開発環境 | kaisei-id-card-dev | 管理画面基本機能 |
| **Phase 4** | 7週目 | 開発環境 | kaisei-id-card-dev | 年次処理・一括処理 |
| **Phase 5** | 8週目 | ステージング環境 | kaisei-id-card-staging作成 | 通知機能・卒業生対応 |
| **Phase 6** | 9週目 | ステージング環境 | kaisei-id-card-staging | セキュリティ強化 |
| **Phase 7** | 10-11週目 | 本番環境準備 | kaisei-id-card-prod作成 | テスト・移行準備 |
| **リリース** | 12週目以降 | 本番環境 | kaisei-id-card-prod | 本番稼働 |

## 各環境の詳細

### 1. ローカル環境（Phase 0-1）
**特徴**：
- Firebaseエミュレータのみ使用
- 実際のFirebaseプロジェクト不要
- 完全無料で開発可能

**用途**：
- 個人開発
- 基本機能の実装
- ユニットテスト

**制限事項**：
- プッシュ通知（FCM）テスト不可
- 実機デバイステスト不可
- チーム間でのデータ共有不可

### 2. 開発環境（Phase 2-4）
**作成タイミング**: Phase 2後半

**特徴**：
- 実際のFirebaseプロジェクト使用
- 無料枠内で運用
- チーム開発可能

**用途**：
- 機能開発
- 統合テスト
- デモ環境

**設定内容**：
```bash
# Firebaseプロジェクト作成
firebase projects:create kaisei-id-card-dev --display-name "開成ID開発環境"

# 各サービス有効化
firebase use kaisei-id-card-dev
firebase deploy --only firestore:rules,firestore:indexes
firebase deploy --only storage
firebase deploy --only functions
```

### 3. ステージング環境（Phase 5-6）
**作成タイミング**: Phase 5開始時

**特徴**：
- 本番相当の設定
- 実データに近いテストデータ
- パフォーマンステスト可能

**用途**：
- 受入テスト
- 負荷テスト
- セキュリティテスト
- 運用リハーサル

**設定内容**：
```bash
# Firebaseプロジェクト作成
firebase projects:create kaisei-id-card-staging --display-name "開成IDステージング環境"

# 本番相当の設定
firebase functions:config:set env.type="staging"
firebase deploy
```

### 4. 本番環境（Phase 7以降）
**作成タイミング**: Phase 7開始時

**特徴**：
- 完全な本番設定
- バックアップ体制
- 監視・アラート設定

**用途**：
- 実運用
- 750名の生徒利用
- 10,000名の卒業生対応

**設定内容**：
```bash
# Firebaseプロジェクト作成
firebase projects:create kaisei-id-card-prod --display-name "開成ID本番環境"

# セキュリティ強化設定
firebase functions:config:set env.type="production"
firebase deploy --only firestore:rules,storage:rules
firebase deploy --only functions
```

## コスト管理戦略

### Phase別予想コスト

| Phase | 環境 | 月額コスト（予想） | 備考 |
|-------|------|-----------------|------|
| Phase 0-1 | ローカル | ¥0 | エミュレータのみ |
| Phase 2-4 | 開発 | ¥0-1,000 | Firebase無料枠内 |
| Phase 5-6 | ステージング | ¥1,000-3,000 | テストデータ量による |
| Phase 7 | 本番準備 | ¥3,000-5,000 | 移行テスト含む |
| 本番運用 | 本番 | ¥5,000-10,000 | 750名規模想定 |

### コスト削減施策
1. **開発初期**：エミュレータ最大活用
2. **テスト環境**：使用時のみ起動
3. **画像最適化**：リサイズとキャッシュ
4. **Functions最適化**：コールドスタート削減

## 移行チェックリスト

### ローカル → 開発環境（Phase 2）
- [ ] Firebaseプロジェクト作成
- [ ] Firebase CLI認証
- [ ] 環境変数設定（.env.development）
- [ ] FlutterFire設定
- [ ] セキュリティルールデプロイ
- [ ] 初期データ投入

### 開発 → ステージング（Phase 5）
- [ ] 新規Firebaseプロジェクト作成
- [ ] 本番相当のセキュリティルール
- [ ] テストデータ移行
- [ ] 監視設定
- [ ] バックアップ設定
- [ ] 負荷テスト実施

### ステージング → 本番（Phase 7後）
- [ ] 本番Firebaseプロジェクト作成
- [ ] セキュリティ監査
- [ ] データ移行リハーサル
- [ ] 障害対応手順確立
- [ ] 運用マニュアル完成
- [ ] 最終承認取得

## リスク管理

### 環境別リスク

**ローカル環境**：
- リスク：チーム間の環境差異
- 対策：Docker化検討

**開発環境**：
- リスク：誤って本番データ投入
- 対策：環境変数による明確な区別

**ステージング環境**：
- リスク：本番データ流出
- 対策：マスキング処理済みデータ使用

**本番環境**：
- リスク：設定ミスによる障害
- 対策：Infrastructure as Code、変更管理プロセス

## 決定事項

1. **Phase 0-1はエミュレータのみで開発**
   - コスト削減
   - 即座に開発開始可能

2. **Phase 2後半で開発環境構築**
   - チーム開発の必要性
   - 実機テストの開始

3. **Phase 5でステージング環境構築**
   - 本格的な検証開始
   - 卒業生機能のテスト

4. **Phase 7で本番環境準備**
   - 十分なテスト期間確保
   - 段階的移行の実施