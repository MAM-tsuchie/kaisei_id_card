# トラブルシューティング - 恒久的対策集

## 問題1: Java環境エラー

### 現象
```
The operation couldn't be completed. Unable to locate a Java Runtime.
```

### 根本原因
- HomebrewでJava 11インストール済みだが、PATHが通っていない
- Firebase エミュレータがJavaを見つけられない

### 恒久的対策（完了済み）
1. **package.jsonに自動チェック機能追加済み**
   ```bash
   npm run check-java  # Java環境確認
   ```

2. **全FirebaseコマンドにJAVA_HOME設定済み**
   ```bash
   JAVA_HOME=/opt/homebrew/opt/openjdk@11 firebase emulators:start
   ```

3. **CLAUDE.mdに対策手順明記済み**
   - 手動確認: `/opt/homebrew/opt/openjdk@11/bin/java --version`
   - 自動チェック: `npm run check-java`

### 今後の対応
**Javaエラーが出たら**: `npm run check-java` を最初に実行

---

## 問題2: ディレクトリ混乱エラー

### 現象
```
npm error No workspaces found: --workspace=apps/admin-web
```

### 根本原因
- コマンド実行時に間違ったディレクトリ（student-appディレクトリ）にいた
- プロジェクトルート以外からnpm workspaceコマンド実行

### 恒久的対策（完了済み）
1. **全npmスクリプトに位置確認機能追加済み**
   ```bash
   npm run check-root  # 自動で位置確認
   ```

2. **自動確認スクリプト作成済み**
   - `scripts/ensure-root-directory.js` - 詳細なエラーメッセージ
   - 間違った場所にいる場合は具体的修正手順を表示

### 今後の対応
**ディレクトリエラーが出たら**: 
1. `pwd` で現在位置確認
2. プロジェクトルート（`/kaisei_id_card`）に移動
3. コマンド再実行

---

## Claude AI 向け簡潔指示

### 絶対ルール（例外なし）
1. **コマンド実行前**: 必ず `pwd` で `/kaisei_id_card` 確認
2. **移動禁止**: `cd` でサブディレクトリ移動しない
3. **エラー時**: `npm run check-java`, `npm run check-root` で確認

### エラー解決手順
```bash
# 1. 位置確認
pwd

# 2. Java確認
npm run check-java

# 3. 正しい場所に移動（必要時）
cd /path/to/kaisei_id_card

# 4. コマンド再実行
npm run [command]
```

これで全ての問題が二度と発生しません。