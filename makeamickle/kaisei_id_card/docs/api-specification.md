# API仕様書

## 概要
開成デジタル学生証システムのAPI仕様書です。  
**版数**: v1.0  
**最終更新**: 2025-08-13

## ベースURL
- **開発環境**: `http://localhost:5001/school-digital-id-dev/asia-northeast1`
- **ステージング環境**: `https://asia-northeast1-school-digital-id-staging.cloudfunctions.net`
- **本番環境**: `https://asia-northeast1-school-digital-id-prod.cloudfunctions.net`

## 認証方式
Firebase Authentication による Bearer Token 認証

```http
Authorization: Bearer <Firebase_ID_Token>
```

## 共通レスポンス形式

### 成功レスポンス
```json
{
  "success": true,
  "data": {},
  "message": "処理が正常に完了しました",
  "timestamp": "2025-08-13T12:00:00.000Z"
}
```

### エラーレスポンス
```json
{
  "success": false,
  "error": {
    "code": "USER_NOT_FOUND",
    "message": "ユーザーが見つかりませんでした",
    "details": {}
  },
  "timestamp": "2025-08-13T12:00:00.000Z"
}
```

## エラーコード一覧

| コード | HTTPステータス | 説明 |
|--------|---------------|------|
| `VALIDATION_ERROR` | 400 | リクエストパラメータが不正 |
| `UNAUTHORIZED` | 401 | 認証が必要 |
| `FORBIDDEN` | 403 | アクセス権限なし |
| `USER_NOT_FOUND` | 404 | ユーザーが見つからない |
| `CARD_NOT_FOUND` | 404 | 学生証が見つからない |
| `INTERNAL_SERVER_ERROR` | 500 | サーバー内部エラー |
| `SERVICE_UNAVAILABLE` | 503 | サービス利用不可 |

## API エンドポイント

### 認証関連

#### POST /auth/verify
Firebase ID Tokenの検証とユーザー情報取得

**リクエスト**
```json
{
  "idToken": "string"
}
```

**レスポンス**
```json
{
  "success": true,
  "data": {
    "uid": "string",
    "email": "string",
    "displayName": "string",
    "role": "student" | "admin",
    "isActive": true
  }
}
```

### ユーザー管理

#### GET /users/{userId}
ユーザー情報取得

**パスパラメータ**
- `userId`: ユーザーID (string)

**レスポンス**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "email": "string",
    "displayName": "string",
    "role": "student" | "admin",
    "profile": {
      "studentId": "string",
      "grade": number,
      "class": "string",
      "enrollmentYear": number
    },
    "isActive": true,
    "createdAt": "2025-08-13T12:00:00.000Z",
    "updatedAt": "2025-08-13T12:00:00.000Z"
  }
}
```

#### PUT /users/{userId}
ユーザー情報更新

**リクエスト**
```json
{
  "displayName": "string",
  "profile": {
    "grade": number,
    "class": "string"
  }
}
```

### デジタル学生証

#### GET /cards/{userId}
デジタル学生証取得

**レスポンス**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "userId": "string",
    "studentInfo": {
      "studentId": "string",
      "name": "string",
      "grade": number,
      "class": "string",
      "photoUrl": "string"
    },
    "qrCode": "string",
    "barcode": "string",
    "issuedAt": "2025-08-13T12:00:00.000Z",
    "expiresAt": "2026-03-31T23:59:59.000Z",
    "isActive": true
  }
}
```

#### POST /cards/{userId}/regenerate
学生証の再生成

**レスポンス**
```json
{
  "success": true,
  "data": {
    "qrCode": "string",
    "barcode": "string",
    "issuedAt": "2025-08-13T12:00:00.000Z"
  }
}
```

### 管理者機能

#### GET /admin/users
ユーザー一覧取得（管理者のみ）

**クエリパラメータ**
- `page`: ページ番号 (number, default: 1)
- `limit`: 取得件数 (number, default: 50, max: 100)
- `role`: ロールフィルタ (string, optional)
- `grade`: 学年フィルタ (number, optional)

**レスポンス**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "string",
        "email": "string",
        "displayName": "string",
        "role": "student",
        "profile": {
          "studentId": "string",
          "grade": number,
          "class": "string"
        },
        "isActive": true
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 750,
      "totalPages": 15
    }
  }
}
```

#### POST /admin/users/bulk-create
ユーザー一括作成（管理者のみ）

**リクエスト**
```json
{
  "users": [
    {
      "email": "string",
      "displayName": "string",
      "profile": {
        "studentId": "string",
        "grade": number,
        "class": "string",
        "enrollmentYear": number
      }
    }
  ]
}
```

#### POST /admin/cards/bulk-regenerate
学生証一括再生成（管理者のみ）

**リクエスト**
```json
{
  "userIds": ["string"],
  "reason": "string"
}
```

### 通知機能（卒業生向け）

#### GET /notifications/{userId}
通知一覧取得

**クエリパラメータ**
- `unreadOnly`: 未読のみ取得 (boolean, default: false)
- `limit`: 取得件数 (number, default: 20)

**レスポンス**
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "string",
        "title": "string",
        "body": "string",
        "type": "info" | "warning" | "announcement",
        "isRead": false,
        "createdAt": "2025-08-13T12:00:00.000Z"
      }
    ]
  }
}
```

#### PUT /notifications/{notificationId}/read
通知既読マーク

**レスポンス**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "isRead": true,
    "readAt": "2025-08-13T12:00:00.000Z"
  }
}
```

## WebSocket API

### リアルタイム通知
```javascript
// 接続
const socket = io('ws://localhost:5001');

// 認証
socket.emit('auth', { idToken: 'Firebase_ID_Token' });

// 通知受信
socket.on('notification', (data) => {
  console.log('新しい通知:', data);
});
```

## レート制限
- **一般API**: 100リクエスト/分/ユーザー
- **管理者API**: 1000リクエスト/分/管理者
- **WebSocket**: 10接続/ユーザー

## セキュリティ考慮事項

### HTTPS通信
本番環境では必須

### CORS設定
```javascript
// 許可されたオリジン
const allowedOrigins = [
  'https://student-app.kaisei-school.jp',
  'https://admin.kaisei-school.jp'
];
```

### データ暗号化
- 機密データはFirestore暗号化
- 画像ファイルはCloud Storage暗号化

## サンプルコード

### JavaScript/TypeScript
```typescript
// ユーザー情報取得
const getUserInfo = async (userId: string, idToken: string) => {
  const response = await fetch(`/users/${userId}`, {
    headers: {
      'Authorization': `Bearer ${idToken}`,
      'Content-Type': 'application/json'
    }
  });
  
  const result = await response.json();
  
  if (!result.success) {
    throw new Error(result.error.message);
  }
  
  return result.data;
};
```

### Dart/Flutter
```dart
// デジタル学生証取得
Future<DigitalCard> getDigitalCard(String userId) async {
  final idToken = await FirebaseAuth.instance.currentUser?.getIdToken();
  
  final response = await http.get(
    Uri.parse('$baseUrl/cards/$userId'),
    headers: {
      'Authorization': 'Bearer $idToken',
      'Content-Type': 'application/json',
    },
  );
  
  final result = jsonDecode(response.body);
  
  if (!result['success']) {
    throw Exception(result['error']['message']);
  }
  
  return DigitalCard.fromJson(result['data']);
}
```

## 変更履歴

| 版数 | 日付 | 変更内容 | 担当者 |
|------|------|----------|--------|
| v1.0 | 2025-08-13 | 初版作成 | 開発チーム |

---

**注意**: この仕様書は Phase 1 以降で実際のAPI実装と合わせて詳細化されます。