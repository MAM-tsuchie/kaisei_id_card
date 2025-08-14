# Phase 0: 環境構築・基盤整備 詳細実装計画

最終更新: 2024-08-13 03:35

## 概要
- **期間**: 5営業日
- **目的**: 開発環境の構築とプロジェクト基盤の整備
- **使用環境**: Firebaseエミュレータのみ（実プロジェクトは作成しない）

## 必要な参照ドキュメント一覧
| ドキュメント | 参照目的 | パス |
|------------|---------|-----|
| CLAUDE.md | プロジェクト全体指針、ワークフロー、命名規則 | [../CLAUDE.md](../CLAUDE.md) |
| coding-standards.md | コーディング規約、命名規則詳細 | [./coding-standards.md](./coding-standards.md) |
| system-requirements.md | システム要件、制約事項 | [./system-requirements.md](./system-requirements.md) |
| functional-specifications.md | 機能仕様、UI/UX要件 | [./functional-specifications.md](./functional-specifications.md) |
| error-codes.md | エラーコード体系、エラー処理方針 | [./error-codes.md](./error-codes.md) |
| environment-strategy.md | 環境構築戦略、段階的アプローチ | [./environment-strategy.md](./environment-strategy.md) |
| phase-completion-criteria.md | Phase 0完了基準 | [./phase-completion-criteria.md](./phase-completion-criteria.md) |

---

## Day 1: Firebase設定とNode.js環境（月曜日）

### 午前: Firebaseエミュレータ設定

#### 1-1: 作業前確認
- [ ] 現在のディレクトリが `/kaisei_id_card` であることを確認
- [ ] `firebase --version` でFirebase CLIがインストール済みであることを確認
- [ ] **参照**: [CLAUDE.md](../CLAUDE.md) - コマンド実行規則（ルートから実行）

#### 1-2: Firebaseエミュレータ初期化
```bash
# エミュレータのみ初期化（プロジェクトは作成しない）
firebase init emulators
```
**選択項目**:
- [ ] Authentication Emulator
- [ ] Functions Emulator  
- [ ] Firestore Emulator
- [ ] Storage Emulator
- [ ] Hosting Emulator
- [ ] Emulator UI

**参照**: [environment-strategy.md](./environment-strategy.md) - ローカル環境設定

#### 1-3: firebase.json確認・修正
- [ ] 既存の[firebase.json](../firebase.json)を開く
- [ ] ポート設定を確認（Auth:9099, Functions:5001, Firestore:8080, Storage:9199, UI:4000）
- [ ] `singleProjectMode: true` が設定されていることを確認

#### 1-4: セキュリティルール作成
- [ ] [firestore.rules](../firestore.rules)を確認（既存）
- [ ] storage.rulesを新規作成：
```javascript
// storage.rules
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      // Phase 0: 開発用の緩いルール
      allow read, write: if request.auth != null;
    }
  }
}
```
**参照**: [phase-completion-criteria.md](./phase-completion-criteria.md) - セキュリティルール要件

#### 1-5: エミュレータ起動確認
```bash
firebase emulators:start
```
- [ ] http://localhost:4000 でEmulator UIが表示される
- [ ] エラーなく全サービスが起動する
- [ ] Ctrl+Cで停止できる

### 午後: Node.js環境構築

#### 1-6: 依存関係インストール
```bash
# ルートディレクトリで実行
npm install
```
- [ ] エラーなく完了する
- [ ] node_modulesフォルダが作成される
- [ ] **参照**: [package.json](../package.json) - 依存関係確認

#### 1-7: TypeScript設定ファイル作成

**functions/tsconfig.json**:
```json
{
  "extends": "../tsconfig.json",
  "compilerOptions": {
    "module": "commonjs",
    "outDir": "./lib",
    "rootDir": "./src",
    "target": "ES2022",
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "lib", "**/*.test.ts"]
}
```

**apps/admin-web/tsconfig.json**:
```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "jsx": "preserve",
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "allowJs": true,
    "noEmit": true,
    "incremental": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

**packages/shared/tsconfig.json**:
```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

**packages/firebase-config/tsconfig.json**:
```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "declaration": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

- [ ] 各ファイルを作成
- [ ] **参照**: [tsconfig.json](../tsconfig.json) - ルート設定の継承確認

#### 1-8: Lint動作確認
```bash
npm run lint
```
- [ ] 実行される（エラーは現時点で許容）
- [ ] **参照**: [coding-standards.md](./coding-standards.md) - ESLint規約

#### Day 1 完了チェック
- [ ] Firebaseエミュレータが起動する
- [ ] npm installが完了している
- [ ] TypeScript設定ファイルが作成されている

---

## Day 2: Flutter & Next.js設定（火曜日）

### 午前: Flutter環境設定

#### 2-1: Flutter環境確認
```bash
flutter doctor
```
- [ ] Flutter SDK が利用可能
- [ ] Chrome が利用可能（Web開発用）

#### 2-2: Flutterプロジェクト作成
```bash
# ルートから実行
flutter create apps/student-app \
  --org com.kaisei.school \
  --project-name kaisei_student_app \
  --platforms ios,android,web \
  --no-pub
```
- [ ] apps/student-appディレクトリが作成される
- [ ] **参照**: [CLAUDE.md](../CLAUDE.md) - ディレクトリ構造

#### 2-3: pubspec.yaml編集
**apps/student-app/pubspec.yaml**に以下を追加:
```yaml
dependencies:
  flutter:
    sdk: flutter
  # Firebase
  firebase_core: ^2.24.0
  firebase_auth: ^4.15.0
  cloud_firestore: ^4.13.0
  firebase_storage: ^11.5.0
  firebase_messaging: ^14.7.0
  
  # 状態管理
  flutter_riverpod: ^2.4.0
  
  # ナビゲーション
  go_router: ^12.1.0
  
  # ローカルストレージ
  hive_flutter: ^1.1.0
  
  # UI
  cached_network_image: ^3.3.0
  
  # バーコード/QR
  barcode_widget: ^2.0.4
  qr_flutter: ^4.1.0

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0
  build_runner: ^2.4.0
  freezed: ^2.4.0
  json_serializable: ^6.7.0
```

#### 2-4: 依存関係インストールと構造作成
```bash
# Flutterの依存関係インストール
cd apps/student-app && flutter pub get && cd ../..

# ディレクトリ構造確認（既に作成済み）
ls apps/student-app/lib/
```
- [ ] 依存関係がインストールされる
- [ ] **参照**: [functional-specifications.md](./functional-specifications.md) - モバイルアプリ要件

#### 2-5: main.dart作成
**apps/student-app/lib/main.dart**:
```dart
import 'package:flutter/material.dart';

void main() {
  runApp(const KaiseiStudentApp());
}

class KaiseiStudentApp extends StatelessWidget {
  const KaiseiStudentApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: '開成デジタル学生証',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.blue),
        useMaterial3: true,
      ),
      home: const Scaffold(
        appBar: AppBar(
          title: const Text('開成デジタル学生証'),
        ),
        body: const Center(
          child: Text(
            'Phase 0: Flutter環境構築完了',
            style: TextStyle(fontSize: 24),
          ),
        ),
      ),
    );
  }
}
```
- [ ] ファイルを作成
- [ ] **参照**: [coding-standards.md](./coding-standards.md) - Dart命名規則

#### 2-6: Flutter起動確認
```bash
# ルートから実行
flutter run -d chrome --target apps/student-app/lib/main.dart
```
- [ ] Chromeブラウザでアプリが起動する
- [ ] "Phase 0: Flutter環境構築完了"が表示される
- [ ] qキーで終了できる

### 午後: Next.js管理画面設定

#### 2-7: Next.js設定ファイル作成
**apps/admin-web/next.config.js**:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@kaisei-id-card/shared'],
};

module.exports = nextConfig;
```
- [ ] ファイルを作成

#### 2-8: 基本ページ作成
**apps/admin-web/src/pages/_app.tsx**:
```typescript
import type { AppProps } from 'next/app';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
```

**apps/admin-web/src/pages/index.tsx**:
```typescript
import { Container, Typography, Box } from '@mui/material';

export default function Home(): JSX.Element {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          開成デジタル学生証 管理画面
        </Typography>
        <Typography variant="body1">
          Phase 0: Next.js環境構築完了
        </Typography>
      </Box>
    </Container>
  );
}
```
- [ ] 各ファイルを作成
- [ ] **参照**: [coding-standards.md](./coding-standards.md) - TypeScript命名規則

#### 2-9: Next.js起動確認
```bash
# ルートから実行
npm run dev --workspace=apps/admin-web
```
- [ ] http://localhost:3000 でアクセスできる
- [ ] "開成デジタル学生証 管理画面"が表示される
- [ ] Ctrl+Cで停止できる

#### Day 2 完了チェック
- [ ] Flutter Webアプリが起動する
- [ ] Next.js管理画面が起動する
- [ ] 両方のアプリで基本画面が表示される

---

## Day 3: Functions & 共有パッケージ（水曜日）

### 午前: Cloud Functions設定

#### 3-1: ソースディレクトリ作成
```bash
mkdir -p functions/src/utils
```
- [ ] ディレクトリが作成される

#### 3-2: index.ts作成
**functions/src/index.ts**:
```typescript
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Firebase Admin初期化
admin.initializeApp();

// リージョン設定
const REGION = 'asia-northeast1';

/**
 * ヘルスチェックエンドポイント
 * @see docs/functional-specifications.md - API仕様
 */
export const healthCheck = functions
  .region(REGION)
  .https.onRequest((req, res) => {
    res.status(200).json({
      status: 'ok',
      message: 'Cloud Functions is running',
      timestamp: new Date().toISOString(),
      region: REGION,
    });
  });

/**
 * サンプル認証付き関数
 * @see docs/error-codes.md - エラーハンドリング
 */
export const sampleFunction = functions
  .region(REGION)
  .https.onCall(async (data, context) => {
    // 認証チェック
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        '認証が必要です'
      );
    }

    return {
      success: true,
      message: 'Function executed successfully',
      userId: context.auth.uid,
      timestamp: new Date().toISOString(),
    };
  });
```
- [ ] ファイルを作成
- [ ] **参照**: [error-codes.md](./error-codes.md) - AUTH001エラー

#### 3-3: エラーハンドリングユーティリティ作成
**functions/src/utils/error-handler.ts**:
```typescript
import * as functions from 'firebase-functions';

/**
 * アプリケーションエラークラス
 * @see docs/error-codes.md - エラーコード体系
 */
export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'AppError';
  }
}

/**
 * エラーハンドリング関数
 */
export function handleError(error: unknown): never {
  // ログ出力（console.logは使用しない）
  functions.logger.error('Error occurred:', error);

  if (error instanceof functions.https.HttpsError) {
    throw error;
  }

  if (error instanceof AppError) {
    throw new functions.https.HttpsError(
      error.code as any,
      error.message
    );
  }

  throw new functions.https.HttpsError(
    'internal',
    'An unexpected error occurred'
  );
}

/**
 * ロガーユーティリティ
 * @see docs/coding-standards.md - console.log禁止
 */
export const logger = {
  info: (message: string, ...args: any[]) => {
    functions.logger.info(message, ...args);
  },
  warn: (message: string, ...args: any[]) => {
    functions.logger.warn(message, ...args);
  },
  error: (message: string, ...args: any[]) => {
    functions.logger.error(message, ...args);
  },
};
```
- [ ] ファイルを作成
- [ ] **参照**: [coding-standards.md](./coding-standards.md) - console.log禁止規約

#### 3-4: Functionsビルド確認
```bash
# ルートから実行
npm run build --workspace=functions
```
- [ ] エラーなくビルドが完了する
- [ ] libディレクトリが作成される

### 午後: 共有パッケージ実装

#### 3-5: shared パッケージのディレクトリ作成
```bash
mkdir -p packages/shared/src/{types,constants,utils}
mkdir -p packages/firebase-config/src
```
- [ ] ディレクトリが作成される

#### 3-6: 基本型定義作成
**packages/shared/src/types/user.ts**:
```typescript
/**
 * ユーザー基本情報
 * @see docs/system-requirements.md - ユーザー要件
 * @see docs/functional-specifications.md - ユーザー管理仕様
 */

/**
 * 名前情報
 */
export interface IName {
  lastName: string;      // 姓
  firstName: string;     // 名
  lastNameKana: string;  // 姓（カナ）
  firstNameKana: string; // 名（カナ）
}

/**
 * ユーザーステータス
 */
export type UserStatus = 'active' | 'graduated' | 'withdrawn' | 'suspended';

/**
 * ユーザーロール
 */
export type UserRole = 'student' | 'alumni' | 'admin' | 'staff';

/**
 * ユーザー情報
 */
export interface IUser {
  id: string;
  studentId: string;     // 学籍番号（7桁）
  email: string;
  name: IName;
  grade?: number;        // 1-6 (中1-高3)
  class?: string;        // A-F
  status: UserStatus;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;      // 論理削除用
}
```

**packages/shared/src/types/card.ts**:
```typescript
/**
 * デジタル生徒証
 * @see docs/functional-specifications.md - 生徒証表示機能
 */
export interface IDigitalCard {
  id: string;
  userId: string;
  studentId: string;
  issueDate: Date;
  expiryDate: Date;
  isActive: boolean;
  photoUrl?: string;
  barcodeData: string;
  version: number;
  lastAccessedAt?: Date;
  deviceIds?: string[];  // 登録デバイス
}
```

**packages/shared/src/types/index.ts**:
```typescript
// 型定義のエクスポート
export * from './user';
export * from './card';
```
- [ ] 各ファイルを作成
- [ ] **参照**: [system-requirements.md](./system-requirements.md) - データモデル要件

#### 3-7: 定数定義作成
**packages/shared/src/constants/index.ts**:
```typescript
/**
 * システム定数
 * @see docs/system-requirements.md - 制約事項
 */

// デバイス制限
export const MAX_DEVICES_STUDENT = 2;
export const MAX_DEVICES_ALUMNI = 1;

// セッション設定
export const SESSION_TIMEOUT_MINUTES = 10080; // 7日間

// ファイルサイズ制限
export const PHOTO_MAX_SIZE_MB = 5;
export const PHOTO_MIN_WIDTH = 200;
export const PHOTO_MIN_HEIGHT = 200;

// バーコード設定
export const BARCODE_UPDATE_INTERVAL_SECONDS = 30;

// 学年定義
export const GRADES = {
  1: '中学1年',
  2: '中学2年',
  3: '中学3年',
  4: '高校1年',
  5: '高校2年',
  6: '高校3年',
} as const;

// クラス定義
export const CLASSES = ['A', 'B', 'C', 'D', 'E', 'F'] as const;

// エラーコードプレフィックス
export const ERROR_PREFIX = {
  AUTH: 'AUTH',
  USER: 'USER',
  CARD: 'CARD',
  ADMIN: 'ADMIN',
  SYSTEM: 'SYSTEM',
} as const;
```
- [ ] ファイルを作成
- [ ] **参照**: [error-codes.md](./error-codes.md) - エラーコード体系

#### 3-8: バリデーションユーティリティ作成
**packages/shared/src/utils/validation.ts**:
```typescript
/**
 * バリデーションユーティリティ
 * @see docs/coding-standards.md - 入力検証
 */

/**
 * 学籍番号バリデーション
 * 形式: 西暦4桁 + 連番3桁（例: 2024001）
 */
export function isValidStudentId(id: string): boolean {
  if (!id || typeof id !== 'string') {
    return false;
  }
  return /^20\d{5}$/.test(id);
}

/**
 * メールアドレスバリデーション
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') {
    return false;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * 学年バリデーション（1-6）
 */
export function isValidGrade(grade: number): boolean {
  return Number.isInteger(grade) && grade >= 1 && grade <= 6;
}

/**
 * クラスバリデーション（A-F）
 */
export function isValidClass(className: string): boolean {
  return ['A', 'B', 'C', 'D', 'E', 'F'].includes(className);
}

/**
 * 名前バリデーション
 */
export function isValidName(name: string): boolean {
  if (!name || typeof name !== 'string') {
    return false;
  }
  // 1文字以上20文字以下
  return name.length >= 1 && name.length <= 20;
}
```
- [ ] ファイルを作成
- [ ] **参照**: [coding-standards.md](./coding-standards.md) - バリデーション規約

#### 3-9: Firebase設定モジュール作成
**packages/firebase-config/src/index.ts**:
```typescript
/**
 * Firebase設定モジュール
 * @see docs/environment-strategy.md - 環境設定
 */
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getFunctions, Functions } from 'firebase/functions';

// エミュレータ用の設定
const firebaseConfig = {
  apiKey: 'demo-api-key',
  authDomain: 'demo.firebaseapp.com',
  projectId: 'demo-kaisei-id-card',
  storageBucket: 'demo-kaisei-id-card.appspot.com',
  messagingSenderId: '123456789',
  appId: 'demo-app-id',
};

let app: FirebaseApp;

// アプリ初期化
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// サービスインスタンス
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
export const storage: FirebaseStorage = getStorage(app);
export const functions: Functions = getFunctions(app, 'asia-northeast1');

// エミュレータ接続設定（開発環境のみ）
export function connectToEmulators(): void {
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    // Auth エミュレータ
    import('firebase/auth').then(({ connectAuthEmulator }) => {
      try {
        connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
      } catch (error) {
        // 既に接続済みの場合はエラーを無視
      }
    });
    
    // Firestore エミュレータ
    import('firebase/firestore').then(({ connectFirestoreEmulator }) => {
      try {
        connectFirestoreEmulator(db, 'localhost', 8080);
      } catch (error) {
        // 既に接続済みの場合はエラーを無視
      }
    });
    
    // Storage エミュレータ
    import('firebase/storage').then(({ connectStorageEmulator }) => {
      try {
        connectStorageEmulator(storage, 'localhost', 9199);
      } catch (error) {
        // 既に接続済みの場合はエラーを無視
      }
    });
    
    // Functions エミュレータ
    import('firebase/functions').then(({ connectFunctionsEmulator }) => {
      try {
        connectFunctionsEmulator(functions, 'localhost', 5001);
      } catch (error) {
        // 既に接続済みの場合はエラーを無視
      }
    });
  }
}
```
- [ ] ファイルを作成
- [ ] **参照**: [environment-strategy.md](./environment-strategy.md) - エミュレータ設定

#### 3-10: パッケージインデックス作成
**packages/shared/src/index.ts**:
```typescript
// 型定義
export * from './types';

// 定数
export * from './constants';

// ユーティリティ
export * from './utils/validation';
```

**packages/firebase-config/src/index.ts**に追記:
```typescript
// デフォルトエクスポート
export default app;
```
- [ ] 各ファイルを作成/更新

#### 3-11: パッケージビルド確認
```bash
# ルートから実行
npm run build --workspace=packages/shared
npm run build --workspace=packages/firebase-config
```
- [ ] エラーなくビルドが完了する
- [ ] 各パッケージにdistディレクトリが作成される

#### Day 3 完了チェック
- [ ] Cloud Functionsがビルドできる
- [ ] 共有パッケージがビルドできる
- [ ] 型定義とユーティリティが作成されている

---

## Day 4: テスト環境 & CI/CD（木曜日）

### 午前: テスト環境構築

#### 4-1: Jest設定ファイル作成
**functions/jest.config.js**:
```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/index.ts',
    '!src/**/*.d.ts',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
```

**apps/admin-web/jest.config.js**:
```javascript
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/pages/_app.tsx',
    '!src/pages/_document.tsx',
  ],
};

module.exports = createJestConfig(customJestConfig);
```

**apps/admin-web/jest.setup.js**:
```javascript
import '@testing-library/jest-dom';
```

**packages/shared/jest.config.js**:
```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/index.ts',
  ],
};
```
- [ ] 各ファイルを作成
- [ ] **参照**: [coding-standards.md](./coding-standards.md) - テスト規約

#### 4-2: サンプルテスト作成
**functions/src/__tests__/utils/error-handler.test.ts**:
```typescript
import { AppError, handleError } from '../../utils/error-handler';
import * as functions from 'firebase-functions';

describe('error-handler', () => {
  describe('AppError', () => {
    it('should create an error with correct properties', () => {
      const error = new AppError('TEST001', 'Test error', 400);
      
      expect(error.code).toBe('TEST001');
      expect(error.message).toBe('Test error');
      expect(error.statusCode).toBe(400);
      expect(error.name).toBe('AppError');
    });
  });

  describe('handleError', () => {
    it('should throw HttpsError for AppError', () => {
      const appError = new AppError('TEST001', 'Test error', 400);
      
      expect(() => handleError(appError)).toThrow(functions.https.HttpsError);
    });
  });
});
```

**packages/shared/src/__tests__/utils/validation.test.ts**:
```typescript
import {
  isValidStudentId,
  isValidEmail,
  isValidGrade,
  isValidClass,
  isValidName,
} from '../../utils/validation';

describe('validation utilities', () => {
  describe('isValidStudentId', () => {
    it('should validate correct student ID', () => {
      expect(isValidStudentId('2024001')).toBe(true);
      expect(isValidStudentId('2023999')).toBe(true);
    });

    it('should reject invalid student ID', () => {
      expect(isValidStudentId('1234567')).toBe(false);
      expect(isValidStudentId('202400')).toBe(false);
      expect(isValidStudentId('abcdefg')).toBe(false);
      expect(isValidStudentId('')).toBe(false);
    });
  });

  describe('isValidEmail', () => {
    it('should validate correct email', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@school.ed.jp')).toBe(true);
    });

    it('should reject invalid email', () => {
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('')).toBe(false);
    });
  });

  describe('isValidGrade', () => {
    it('should validate correct grade', () => {
      expect(isValidGrade(1)).toBe(true);
      expect(isValidGrade(6)).toBe(true);
    });

    it('should reject invalid grade', () => {
      expect(isValidGrade(0)).toBe(false);
      expect(isValidGrade(7)).toBe(false);
      expect(isValidGrade(1.5)).toBe(false);
    });
  });

  describe('isValidClass', () => {
    it('should validate correct class', () => {
      expect(isValidClass('A')).toBe(true);
      expect(isValidClass('F')).toBe(true);
    });

    it('should reject invalid class', () => {
      expect(isValidClass('G')).toBe(false);
      expect(isValidClass('1')).toBe(false);
      expect(isValidClass('')).toBe(false);
    });
  });
});
```
- [ ] 各テストファイルを作成
- [ ] **参照**: [phase-completion-criteria.md](./phase-completion-criteria.md) - テスト要件

#### 4-3: テスト実行確認
```bash
# 個別実行
npm run test --workspace=functions
npm run test --workspace=packages/shared

# 全体実行（admin-webはまだテストがないため除外）
npm run test:all 2>/dev/null || true
```
- [ ] functionsのテストが成功する
- [ ] sharedのテストが成功する

### 午後: CI/CD設定

#### 4-4: GitHub Actions ワークフロー作成
**.github/workflows/ci.yml**:
```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  lint:
    name: Lint Check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run ESLint
        run: npm run lint:js
      
      - name: Run Prettier check
        run: npx prettier --check .

  type-check:
    name: Type Check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run TypeScript check
        run: npm run type-check

  test:
    name: Test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm run test:all

  build:
    name: Build
    runs-on: ubuntu-latest
    needs: [lint, type-check]
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build Functions
        run: npm run build --workspace=functions
      
      - name: Build Shared packages
        run: |
          npm run build --workspace=packages/shared
          npm run build --workspace=packages/firebase-config
      
      - name: Build Admin Web
        run: npm run build --workspace=apps/admin-web

  flutter-check:
    name: Flutter Check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Flutter
        uses: subosito/flutter-action@v2
        with:
          flutter-version: '3.16.0'
          channel: 'stable'
      
      - name: Install dependencies
        run: |
          cd apps/student-app
          flutter pub get
      
      - name: Run Flutter analyze
        run: |
          cd apps/student-app
          flutter analyze
      
      - name: Run Flutter test
        run: |
          cd apps/student-app
          flutter test
```
- [ ] .github/workflows/ディレクトリを作成
- [ ] ci.ymlファイルを作成
- [ ] **参照**: [CLAUDE.md](../CLAUDE.md) - CI/CD要件

#### 4-5: 環境変数テンプレート作成
**.env.example**:
```bash
# Firebase Configuration (Phase 2以降で設定)
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain-here
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id-here
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket-here
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id-here
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id-here

# 環境設定
NODE_ENV=development
NEXT_PUBLIC_ENV=development

# エミュレータ設定
FIREBASE_AUTH_EMULATOR_HOST=localhost:9099
FIRESTORE_EMULATOR_HOST=localhost:8080
FIREBASE_STORAGE_EMULATOR_HOST=localhost:9199
```
- [ ] ファイルを作成
- [ ] **参照**: [environment-strategy.md](./environment-strategy.md) - 環境変数

#### 4-6: .gitignore確認
- [ ] .envが含まれていることを確認
- [ ] node_modulesが含まれていることを確認
- [ ] distやlibが含まれていることを確認

#### Day 4 完了チェック
- [ ] テストが実行できる
- [ ] GitHub Actionsワークフローが作成されている
- [ ] 環境変数テンプレートが用意されている

---

## Day 5: ドキュメント作成と統合確認（金曜日）

### 午前: ドキュメント作成

#### 5-1: README.md作成
**README.md**:
```markdown
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

## セットアップ

### 1. リポジトリのクローン
\`\`\`bash
git clone [repository-url]
cd kaisei_id_card
\`\`\`

### 2. 依存関係のインストール
\`\`\`bash
npm install
\`\`\`

### 3. 環境変数の設定
\`\`\`bash
cp .env.example .env
# .envファイルを編集（Phase 2以降で実際の値を設定）
\`\`\`

### 4. Firebaseエミュレータの起動
\`\`\`bash
firebase emulators:start
\`\`\`

### 5. 開発サーバーの起動

#### すべてのサービスを同時起動
\`\`\`bash
npm run dev:all
\`\`\`

#### 個別起動
\`\`\`bash
# Flutter アプリ
flutter run -d chrome --target apps/student-app/lib/main.dart

# Next.js 管理画面
npm run dev --workspace=apps/admin-web

# Cloud Functions
npm run serve --workspace=functions
\`\`\`

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
\`\`\`
kaisei_id_card/
├── apps/
│   ├── student-app/     # Flutter モバイルアプリ
│   └── admin-web/       # Next.js 管理画面
├── functions/           # Cloud Functions
├── packages/
│   ├── shared/          # 共通型定義・ユーティリティ
│   └── firebase-config/ # Firebase設定
└── docs/                # ドキュメント
\`\`\`

### ドキュメント
- [プロジェクト指針](./CLAUDE.md)
- [コーディング規約](./docs/coding-standards.md)
- [システム要件](./docs/system-requirements.md)
- [機能仕様](./docs/functional-specifications.md)
- [実装ロードマップ](./docs/implementation-roadmap.md)

## テスト

### ユニットテスト実行
\`\`\`bash
npm run test:all
\`\`\`

### カバレッジレポート
\`\`\`bash
npm run test:coverage
\`\`\`

## デプロイ
※ Phase 2以降で実装

## ライセンス
Proprietary - All rights reserved

## お問い合わせ
[連絡先情報]
```
- [ ] README.mdを作成
- [ ] **参照**: [CLAUDE.md](../CLAUDE.md) - プロジェクト概要

#### 5-2: 開発ガイド作成
**docs/development-guide.md**:
```markdown
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
\`\`\`bash
node --version  # v18.0.0以上
npm --version   # 9.0.0以上
flutter --version # 3.0.0以上
firebase --version # 最新版
\`\`\`

### 2. プロジェクトセットアップ
\`\`\`bash
# リポジトリクローン
git clone [repository-url]
cd kaisei_id_card

# 依存関係インストール
npm install

# Flutter依存関係
cd apps/student-app && flutter pub get && cd ../..
\`\`\`

### 3. エミュレータ設定
\`\`\`bash
# 初回のみ実行
firebase init emulators

# エミュレータ起動
firebase emulators:start
\`\`\`

## 開発ワークフロー

### ブランチ戦略
- `main`: 本番環境
- `develop`: 開発環境
- `feature/*`: 機能開発
- `hotfix/*`: 緊急修正

### コミットメッセージ規約
\`\`\`
feat: 新機能追加
fix: バグ修正
docs: ドキュメント更新
style: コードスタイル修正
refactor: リファクタリング
test: テスト追加・修正
chore: ビルド・補助ツール
\`\`\`

## トラブルシューティング

### npm install が失敗する
\`\`\`bash
# node_modulesをクリア
rm -rf node_modules package-lock.json
rm -rf apps/*/node_modules
rm -rf functions/node_modules
rm -rf packages/*/node_modules

# 再インストール
npm install
\`\`\`

### Firebaseエミュレータのポート競合
firebase.jsonでポート番号を変更:
\`\`\`json
{
  "emulators": {
    "auth": { "port": 9199 }, // 変更
    "firestore": { "port": 8180 } // 変更
  }
}
\`\`\`

### Flutter実行エラー
\`\`\`bash
flutter doctor # 環境診断
flutter clean  # キャッシュクリア
flutter pub get # 依存関係再取得
\`\`\`

## 参考資料
- [Firebase Documentation](https://firebase.google.com/docs)
- [Flutter Documentation](https://flutter.dev/docs)
- [Next.js Documentation](https://nextjs.org/docs)
```
- [ ] development-guide.mdを作成

#### 5-3: API仕様書テンプレート作成
**docs/api-specification-template.md**:
```markdown
# API仕様書テンプレート

## エンドポイント名

### 概要
[機能の簡単な説明]

### エンドポイント
\`\`\`
[METHOD] /api/v1/[resource]
\`\`\`

### リクエスト

#### Headers
| Name | Type | Required | Description |
|------|------|----------|-------------|
| Authorization | string | Yes | Bearer token |
| Content-Type | string | Yes | application/json |

#### Body Parameters
| Name | Type | Required | Description |
|------|------|----------|-------------|
| param1 | string | Yes | パラメータ1の説明 |
| param2 | number | No | パラメータ2の説明 |

#### Request Example
\`\`\`json
{
  "param1": "value1",
  "param2": 123
}
\`\`\`

### レスポンス

#### Success Response
**Code**: 200 OK

\`\`\`json
{
  "success": true,
  "data": {
    "id": "12345",
    "message": "Success"
  }
}
\`\`\`

#### Error Responses

**Code**: 400 Bad Request
\`\`\`json
{
  "success": false,
  "error": {
    "code": "INVALID_PARAMETER",
    "message": "Invalid parameter provided"
  }
}
\`\`\`

**Code**: 401 Unauthorized
\`\`\`json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required"
  }
}
\`\`\`

### エラーコード
| Code | Description |
|------|-------------|
| INVALID_PARAMETER | パラメータが不正 |
| UNAUTHORIZED | 認証が必要 |
| FORBIDDEN | アクセス権限なし |

### 実装例

#### Cloud Functions
\`\`\`typescript
export const functionName = functions
  .region('asia-northeast1')
  .https.onCall(async (data, context) => {
    // 実装
  });
\`\`\`

#### クライアント呼び出し
\`\`\`typescript
const result = await functions.httpsCallable('functionName')({
  param1: 'value1',
  param2: 123
});
\`\`\`

### 備考
[追加の注意事項や参考情報]
```
- [ ] api-specification-template.mdを作成

### 午後: 統合動作確認

#### 5-4: 完了チェックスクリプト作成
**scripts/check-phase0.sh**:
```bash
#!/bin/bash

echo "================================================"
echo "Phase 0 完了チェック開始"
echo "================================================"

# カラー定義
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# エラーカウント
ERROR_COUNT=0

# ファイル存在確認
echo ""
echo "1. 設定ファイル確認..."
files=(
  "firebase.json"
  "firestore.rules"
  "storage.rules"
  "package.json"
  ".eslintrc.json"
  ".prettierrc"
  "tsconfig.json"
  ".gitignore"
  "README.md"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo -e "${GREEN}✅${NC} $file"
  else
    echo -e "${RED}❌${NC} $file が見つかりません"
    ((ERROR_COUNT++))
  fi
done

# ディレクトリ存在確認
echo ""
echo "2. ディレクトリ構造確認..."
dirs=(
  "apps/student-app"
  "apps/admin-web"
  "functions"
  "packages/shared"
  "packages/firebase-config"
  "docs"
  ".github/workflows"
)

for dir in "${dirs[@]}"; do
  if [ -d "$dir" ]; then
    echo -e "${GREEN}✅${NC} $dir"
  else
    echo -e "${RED}❌${NC} $dir が見つかりません"
    ((ERROR_COUNT++))
  fi
done

# TypeScript設定確認
echo ""
echo "3. TypeScript設定確認..."
tsconfigs=(
  "functions/tsconfig.json"
  "apps/admin-web/tsconfig.json"
  "packages/shared/tsconfig.json"
  "packages/firebase-config/tsconfig.json"
)

for tsconfig in "${tsconfigs[@]}"; do
  if [ -f "$tsconfig" ]; then
    echo -e "${GREEN}✅${NC} $tsconfig"
  else
    echo -e "${RED}❌${NC} $tsconfig が見つかりません"
    ((ERROR_COUNT++))
  fi
done

# パッケージ確認
echo ""
echo "4. Node.js パッケージ確認..."
if [ -d "node_modules" ]; then
  echo -e "${GREEN}✅${NC} node_modules"
else
  echo -e "${RED}❌${NC} node_modules が見つかりません（npm install を実行してください）"
  ((ERROR_COUNT++))
fi

# Flutter確認
echo ""
echo "5. Flutter設定確認..."
if [ -f "apps/student-app/pubspec.yaml" ]; then
  echo -e "${GREEN}✅${NC} pubspec.yaml"
else
  echo -e "${RED}❌${NC} pubspec.yaml が見つかりません"
  ((ERROR_COUNT++))
fi

if [ -f "apps/student-app/lib/main.dart" ]; then
  echo -e "${GREEN}✅${NC} main.dart"
else
  echo -e "${RED}❌${NC} main.dart が見つかりません"
  ((ERROR_COUNT++))
fi

# 結果表示
echo ""
echo "================================================"
if [ $ERROR_COUNT -eq 0 ]; then
  echo -e "${GREEN}✅ Phase 0 完了チェック: 成功${NC}"
  echo "すべての項目が正常に設定されています"
else
  echo -e "${RED}❌ Phase 0 完了チェック: 失敗${NC}"
  echo "$ERROR_COUNT 個のエラーが見つかりました"
  echo "上記のエラーを修正してください"
  exit 1
fi
echo "================================================"
```
- [ ] scriptsディレクトリを作成（必要に応じて）
- [ ] check-phase0.shを作成
- [ ] 実行権限を付与: `chmod +x scripts/check-phase0.sh`

#### 5-5: 統合動作確認
```bash
# Phase 0完了チェック実行
./scripts/check-phase0.sh
```
- [ ] すべての項目が✅になることを確認

#### 5-6: 全サービス同時起動確認
```bash
# 全サービス起動
npm run dev:all
```
- [ ] エラーなく起動することを確認
- [ ] 各サービスにアクセスできることを確認：
  - http://localhost:4000 - Emulator UI
  - http://localhost:3000 - Next.js管理画面
  - http://localhost:5000 - Flutter Web（起動している場合）

#### 5-7: 最終確認
- [ ] [phase-completion-criteria.md](./phase-completion-criteria.md)のPhase 0基準を確認
- [ ] すべてのチェック項目を満たしていることを確認

#### Day 5 完了チェック
- [ ] README.mdが作成されている
- [ ] 開発ガイドが作成されている
- [ ] 完了チェックスクリプトがすべて成功する
- [ ] 全サービスが同時起動できる

---

## Phase 0 完了基準サマリー

### 必須達成項目
- [x] Firebaseエミュレータが全サービスで起動する
- [x] Flutter Webアプリがブラウザで表示される
- [x] Next.js管理画面が表示される
- [x] Cloud Functionsがエミュレータで実行できる
- [x] 基本的なテストが成功する
- [x] ESLintとTypeScriptのチェックが通る
- [x] プロジェクト構造がCLAUDE.mdの仕様と一致
- [x] ドキュメントが整備されている

### 次のステップ
Phase 0完了後、Phase 1（認証基盤・基本CRUD）の実装へ進む

---

最終更新: 2024-08-13
作成者: システム開発チーム