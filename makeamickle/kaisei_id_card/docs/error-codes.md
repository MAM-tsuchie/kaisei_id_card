# エラーコード体系

## 統一エラーコード定義

本システムで使用する統一エラーコード体系を以下に定義します。

### エラーコードフォーマット

`[カテゴリ][番号]` - 例: AUTH001, DATA002, SYS003

### カテゴリ定義

| カテゴリ | 説明 | 番号範囲 |
|---------|------|---------|
| AUTH | 認証関連エラー | 001-099 |
| DATA | データ検証エラー | 001-099 |
| SYS | システムエラー | 001-099 |
| NET | ネットワークエラー | 001-099 |
| PERM | 権限エラー | 001-099 |
| BIZ | ビジネスロジックエラー | 001-099 |

### 詳細エラーコード定義

#### 認証エラー (AUTH)

| コード | 説明 | HTTPステータス | ユーザー表示メッセージ |
|--------|------|---------------|----------------------|
| AUTH001 | アクティベーションコード無効 | 400 | 入力されたコードが正しくありません |
| AUTH002 | 認証期限切れ | 401 | セッションの有効期限が切れました。再度ログインしてください |
| AUTH003 | デバイス数上限 | 403 | 登録可能なデバイス数の上限に達しています |
| AUTH004 | 認証情報不正 | 401 | メールアドレスまたはパスワードが正しくありません |
| AUTH005 | アカウントロック | 403 | アカウントがロックされています。管理者にお問い合わせください |

#### データエラー (DATA)

| コード | 説明 | HTTPステータス | ユーザー表示メッセージ |
|--------|------|---------------|----------------------|
| DATA001 | 必須項目未入力 | 400 | 必須項目を入力してください |
| DATA002 | 形式エラー | 400 | 入力形式が正しくありません |
| DATA003 | 重複エラー | 409 | すでに登録されています |
| DATA004 | データ不整合 | 400 | データに不整合があります |
| DATA005 | サイズ超過 | 413 | ファイルサイズが制限を超えています |

#### システムエラー (SYS)

| コード | 説明 | HTTPステータス | ユーザー表示メッセージ |
|--------|------|---------------|----------------------|
| SYS001 | ネットワークエラー | 503 | 通信エラーが発生しました。しばらくしてから再度お試しください |
| SYS002 | サーバーエラー | 500 | システムエラーが発生しました。管理者にお問い合わせください |
| SYS003 | メンテナンス中 | 503 | 現在メンテナンス中です。しばらくお待ちください |
| SYS004 | タイムアウト | 504 | 処理がタイムアウトしました。再度お試しください |
| SYS005 | リソース不足 | 507 | システムリソースが不足しています |

#### ネットワークエラー (NET)

| コード | 説明 | HTTPステータス | ユーザー表示メッセージ |
|--------|------|---------------|----------------------|
| NET001 | 接続エラー | 503 | ネットワークに接続できません |
| NET002 | タイムアウト | 504 | 接続がタイムアウトしました |
| NET003 | DNS解決エラー | 503 | サーバーが見つかりません |

#### 権限エラー (PERM)

| コード | 説明 | HTTPステータス | ユーザー表示メッセージ |
|--------|------|---------------|----------------------|
| PERM001 | アクセス権限なし | 403 | このページへのアクセス権限がありません |
| PERM002 | 操作権限なし | 403 | この操作を実行する権限がありません |
| PERM003 | IPアドレス制限 | 403 | 許可されていないIPアドレスからのアクセスです |

#### ビジネスロジックエラー (BIZ)

| コード | 説明 | HTTPステータス | ユーザー表示メッセージ |
|--------|------|---------------|----------------------|
| BIZ001 | 期限切れ | 400 | 有効期限が切れています |
| BIZ002 | 上限超過 | 429 | 制限数を超えています |
| BIZ003 | 条件不適合 | 400 | 指定された条件を満たしていません |

## 実装例

### TypeScript/JavaScript

```typescript
// errors/app-error.ts
export class AppError extends Error {
  constructor(
    public readonly code: string,
    public readonly message: string,
    public readonly statusCode: number = 500,
    public readonly userMessage?: string
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

// errors/auth-error.ts
export class AuthError extends AppError {
  static invalidActivationCode() {
    return new AuthError(
      'AUTH001',
      'Invalid activation code',
      400,
      '入力されたコードが正しくありません'
    );
  }
  
  static sessionExpired() {
    return new AuthError(
      'AUTH002',
      'Session expired',
      401,
      'セッションの有効期限が切れました。再度ログインしてください'
    );
  }
}
```

### Dart/Flutter

```dart
// lib/core/errors/app_error.dart
class AppError implements Exception {
  final String code;
  final String message;
  final int statusCode;
  final String? userMessage;
  
  const AppError({
    required this.code,
    required this.message,
    this.statusCode = 500,
    this.userMessage,
  });
}

// lib/core/errors/auth_error.dart
class AuthError extends AppError {
  const AuthError({
    required String code,
    required String message,
    int statusCode = 400,
    String? userMessage,
  }) : super(
    code: code,
    message: message,
    statusCode: statusCode,
    userMessage: userMessage,
  );
  
  factory AuthError.invalidActivationCode() => const AuthError(
    code: 'AUTH001',
    message: 'Invalid activation code',
    statusCode: 400,
    userMessage: '入力されたコードが正しくありません',
  );
  
  factory AuthError.sessionExpired() => const AuthError(
    code: 'AUTH002',
    message: 'Session expired',
    statusCode: 401,
    userMessage: 'セッションの有効期限が切れました。再度ログインしてください',
  );
}
```

## エラーハンドリングガイドライン

### 1. エラーコードは必ず統一体系を使用する
- 新しいエラーを追加する場合は、このドキュメントに追記する
- カテゴリと番号は重複しないよう管理する

### 2. ユーザー表示メッセージは日本語で分かりやすく
- 技術的な詳細は含めない
- 具体的な対処法を提示する

### 3. ログには詳細情報を記録
- エラーコード
- 発生箇所（ファイル名、行番号）
- スタックトレース
- リクエスト情報（ユーザーID、IPアドレス等）

### 4. エラーレスポンス形式

```json
{
  "error": {
    "code": "AUTH001",
    "message": "Invalid activation code",
    "userMessage": "入力されたコードが正しくありません",
    "timestamp": "2024-01-25T10:30:00Z",
    "requestId": "req_abc123"
  }
}
```

## 改訂履歴

| 版 | 日付 | 内容 | 作成者 |
|----|------|------|--------|
| 1.0 | 2024-01-25 | 初版作成 | システム設計担当 |