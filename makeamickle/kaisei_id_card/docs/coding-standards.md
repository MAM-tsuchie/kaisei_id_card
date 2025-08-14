# デジタル学生証システム コーディング規約

## 1. TypeScript/JavaScript コーディング規約

### 1.1 命名規則

#### ファイル名（TypeScript/JavaScript）
**必ず kebab-case（ハイフン区切り小文字）を使用する**
```typescript
✅ 正しい例：
user-service.ts
validate-activation-code.ts
digital-card-controller.ts

❌ 間違い：
userService.ts        // キャメルケース禁止
UserService.ts        // パスカルケース禁止
user_service.ts       // スネークケース禁止
```

#### 変数名
**必ず camelCase（先頭小文字のキャメルケース）を使用する**
```typescript
✅ 正しい例：
const userName: string = "田中太郎";
const isActive: boolean = true;
let retryCount: number = 0;

❌ 間違い：
const user_name = "田中太郎";      // スネークケース禁止
const UserName = "田中太郎";       // パスカルケース禁止
const USERNAME = "田中太郎";       // 大文字禁止（定数以外）
```

#### 定数名
**必ず UPPER_SNAKE_CASE（大文字スネークケース）を使用する**
```typescript
✅ 正しい例：
const MAX_DEVICES: number = 2;
const API_TIMEOUT_MS: number = 30000;
const DEFAULT_PAGE_SIZE: number = 20;

❌ 間違い：
const maxDevices = 2;              // キャメルケース禁止
const MAX_DEVICES_COUNT = 2;       // 冗長な命名禁止
const max_devices = 2;              // 小文字禁止
```

#### 関数名
**必ず camelCase で動詞から始める**
```typescript
✅ 正しい例：
function getUserById(id: string): User { }
function validateEmail(email: string): boolean { }
function calculateExpiryDate(date: Date): Date { }
async function fetchStudentData(id: string): Promise<Student> { }

❌ 間違い：
function user_by_id() { }          // スネークケース禁止
function GetUserById() { }         // パスカルケース禁止
function userById() { }            // 動詞なし禁止
function byIdUser() { }            // 語順違反禁止
```

#### クラス名
**必ず PascalCase（先頭大文字のパスカルケース）を使用する**
```typescript
✅ 正しい例：
class UserService { }
class DigitalCardManager { }
class AuthenticationController { }

❌ 間違い：
class userService { }              // キャメルケース禁止
class user_service { }             // スネークケース禁止
class User_Service { }             // アンダースコア禁止
```

#### インターフェース名
**必ず I プレフィックス付きの PascalCase を使用する**
```typescript
✅ 正しい例：
interface IUser { }
interface IUserService { }
interface IAuthenticationResult { }

❌ 間違い：
interface User { }                 // Iプレフィックスなし禁止
interface UserInterface { }        // Interface接尾辞禁止
interface user { }                 // 小文字禁止
```

#### 型定義名
**必ず PascalCase を使用する（I プレフィックスなし）**
```typescript
✅ 正しい例：
type UserStatus = 'active' | 'graduated' | 'withdrawn';
type ApiResponse<T> = { data: T; error?: string };
type Nullable<T> = T | null;

❌ 間違い：
type IUserStatus = ...;            // Iプレフィックス禁止
type userStatus = ...;             // キャメルケース禁止
type USER_STATUS = ...;            // 大文字禁止
```

#### Enum名と値
**Enum名は PascalCase、値は UPPER_SNAKE_CASE を使用する**
```typescript
✅ 正しい例：
enum UserRole {
  STUDENT = 'STUDENT',
  ALUMNI = 'ALUMNI',
  ADMIN = 'ADMIN'
}

❌ 間違い：
enum USER_ROLE { }                 // Enum名大文字禁止
enum UserRole {
  Student = 'student',            // 値が大文字でない禁止
  alumni = 'ALUMNI'               // 値の形式不統一禁止
}
```

### 1.2 変数宣言の規則

#### const を最優先で使用する
```typescript
✅ 正しい例：
const userId: string = 'user123';
const config = { timeout: 5000 } as const;
const users: ReadonlyArray<User> = fetchUsers();

❌ 間違い：
let userId = 'user123';            // 再代入しないのにlet禁止
var config = { };                  // var使用禁止
```

#### let は再代入が必要な場合のみ使用する
```typescript
✅ 正しい例：
let retryCount: number = 0;
while (retryCount < MAX_RETRIES) {
  retryCount++;
  // 処理
}

❌ 間違い：
let userName = getUserName();     // 再代入しない場合のlet禁止
```

#### var は絶対に使用禁止
```typescript
❌ 絶対禁止：
var name = 'test';
var count = 0;
```

#### 型注釈を必ず明示する
```typescript
✅ 正しい例：
const userName: string = getUserName();
const userAge: number = 25;
const isActive: boolean = true;
const userIds: string[] = ['id1', 'id2'];
const userMap: Map<string, IUser> = new Map();

❌ 間違い：
const data = getData();            // 型注釈なし禁止
const users = [];                  // 配列の型不明禁止
```

### 1.3 関数定義の規則

#### 戻り値の型を必ず明示する
```typescript
✅ 正しい例：
function add(a: number, b: number): number {
  return a + b;
}

async function fetchUser(id: string): Promise<IUser> {
  return await api.getUser(id);
}

function logMessage(message: string): void {
  console.log(message);
}

❌ 間違い：
function add(a: number, b: number) {     // 戻り値型なし禁止
  return a + b;
}
```

#### アロー関数の使用規則
```typescript
✅ 正しい例：
// 単一式の場合：括弧と return を省略する
const double = (x: number): number => x * 2;

// 複数行の場合：括弧と return を明示する
const processUser = (user: IUser): IProcessedUser => {
  validateUser(user);
  const processed = transformUser(user);
  return processed;
};

❌ 間違い：
// 単一式で不要な括弧
const double = (x: number): number => { return x * 2; };

// 複数行で return なし
const processUser = (user: IUser) => {
  validateUser(user);
  transformUser(user);  // return忘れ
};
```

#### async/await の使用規則
```typescript
✅ 正しい例：
async function fetchUserData(id: string): Promise<IUser> {
  try {
    const user = await api.getUser(id);
    return user;
  } catch (error) {
    logger.error('エラー発生', { id, error });
    throw new UserNotFoundError(id);
  }
}

❌ 間違い：
// Promise.then の使用禁止
function fetchUserData(id: string) {
  return api.getUser(id)
    .then(user => user)
    .catch(error => { throw error; });
}

// try-catch なしの async 関数禁止
async function fetchUserData(id: string): Promise<IUser> {
  const user = await api.getUser(id);  // エラーハンドリングなし
  return user;
}
```

### 1.4 クラス定義の規則

#### プロパティとメソッドの順序を守る
```typescript
✅ 正しい例：
class UserService {
  // 1. 静的プロパティ
  public static readonly VERSION: string = '1.0.0';
  
  // 2. プライベートプロパティ（_プレフィックス必須）
  private readonly _repository: IUserRepository;
  private _cache: Map<string, IUser>;
  
  // 3. パブリックプロパティ
  public readonly serviceName: string = 'UserService';
  
  // 4. コンストラクタ
  constructor(repository: IUserRepository) {
    this._repository = repository;
    this._cache = new Map();
  }
  
  // 5. 静的メソッド
  public static createInstance(): UserService {
    return new UserService(new UserRepository());
  }
  
  // 6. パブリックメソッド
  public async getUser(id: string): Promise<IUser> {
    return this._fetchUser(id);
  }
  
  // 7. プライベートメソッド（_プレフィックス必須）
  private async _fetchUser(id: string): Promise<IUser> {
    return await this._repository.findById(id);
  }
}

❌ 間違い：
class UserService {
  constructor() { }        // プロパティより先禁止
  private cache: Map;      // _プレフィックスなし禁止
  public getUser() { }     // プライベートメソッドより先
  private fetchUser() { }  // _プレフィックスなし禁止
}
```

### 1.5 エラーハンドリングの規則

#### カスタムエラークラスを必ず定義する
```typescript
✅ 正しい例：
class AppError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly statusCode: number = 500
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends AppError {
  constructor(message: string) {
    super('VALIDATION_ERROR', message, 400);
  }
}

❌ 間違い：
throw new Error('エラー');        // 汎用Errorクラス禁止
throw 'エラー文字列';              // 文字列throw禁止
```

#### try-catch-finally の使用規則
```typescript
✅ 正しい例：
async function processData(data: any): Promise<void> {
  let connection: IDbConnection | null = null;
  
  try {
    connection = await getConnection();
    await connection.beginTransaction();
    await processWithConnection(connection, data);
    await connection.commit();
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    logger.error('処理失敗', { error });
    throw new ProcessingError('データ処理に失敗しました');
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

❌ 間違い：
try {
  // 処理
} catch (e) {                      // error変数名禁止
  console.log(e);                  // console.log禁止
  // エラーの握りつぶし禁止
}
```

### 1.6 インポート/エクスポートの規則

#### インポート順序を必ず守る
```typescript
✅ 正しい例：
// 1. Node.js組み込みモジュール
import * as fs from 'fs';
import * as path from 'path';

// 2. 外部パッケージ
import * as express from 'express';
import { z } from 'zod';

// 3. 内部モジュール（絶対パス）
import { UserService } from '@/services/user-service';
import { IUser } from '@/types/user';

// 4. 内部モジュール（相対パス）
import { validateInput } from './validators';
import { formatDate } from './utils';

❌ 間違い：
import { validateInput } from './validators';  // 順序違反
import * as express from 'express';
import * as fs from 'fs';
```

#### 名前付きエクスポートを使用する
```typescript
✅ 正しい例：
export class UserController { }
export interface IUserController { }
export const USER_CONSTANTS = { };

❌ 間違い：
export default UserController;    // デフォルトエクスポート禁止
```

---

## 2. Flutter/Dart コーディング規約

### 2.1 命名規則

#### ファイル名（Dart/Flutter）
**必ず snake_case（アンダースコア区切り小文字）を使用する**
```dart
✅ 正しい例：
student_card_screen.dart
user_service.dart
digital_card_model.dart

❌ 間違い：
studentCardScreen.dart       // キャメルケース禁止
StudentCardScreen.dart       // パスカルケース禁止
student-card-screen.dart     // ハイフン禁止
```

#### クラス名
**必ず PascalCase を使用する**
```dart
✅ 正しい例：
class StudentCardWidget { }
class UserService { }
class DigitalCardModel { }

❌ 間違い：
class studentCardWidget { }   // 先頭小文字禁止
class student_card_widget { }  // スネークケース禁止
```

#### 変数名・関数名
**必ず lowerCamelCase を使用する**
```dart
✅ 正しい例：
String userName = '田中太郎';
bool isActive = true;
void displayCard() { }
Future<User> fetchUser() async { }

❌ 間違い：
String user_name = '田中太郎';     // スネークケース禁止
String UserName = '田中太郎';      // パスカルケース禁止
void DisplayCard() { }            // 先頭大文字禁止
```

#### 定数名
**必ず lowerCamelCase を使用する（Dartの慣例）**
```dart
✅ 正しい例：
const int maxDevices = 2;
const Duration apiTimeout = Duration(seconds: 30);
const String defaultAvatarUrl = 'assets/images/default.png';

❌ 間違い：
const int MAX_DEVICES = 2;        // 大文字禁止
const int MaxDevices = 2;         // パスカルケース禁止
```

#### プライベートメンバー
**必ず _ プレフィックスを使用する**
```dart
✅ 正しい例：
class UserService {
  String _privateField = '';
  
  void _privateMethod() { }
}

❌ 間違い：
class UserService {
  String privateField = '';       // _なし禁止
  
  void privateMethod() { }        // _なし禁止
}
```

### 2.2 Widget作成の規則

#### StatelessWidget の構造を守る
```dart
✅ 正しい例：
class StudentCardWidget extends StatelessWidget {
  // 1. フィールド定義（final必須）
  final String studentId;
  final String studentName;
  
  // 2. コンストラクタ（const必須、Key?必須）
  const StudentCardWidget({
    Key? key,
    required this.studentId,
    required this.studentName,
  }) : super(key: key);
  
  // 3. buildメソッド（@override必須）
  @override
  Widget build(BuildContext context) {
    return Container();
  }
  
  // 4. プライベートメソッド（_プレフィックス必須）
  Widget _buildHeader() {
    return Text(studentName);
  }
}

❌ 間違い：
class StudentCardWidget extends StatelessWidget {
  String studentId;                // final なし禁止
  
  StudentCardWidget({              // const なし禁止
    this.studentId = '',          // required なし禁止
  });
  
  Widget build(context) {          // @override なし禁止
    return Container();
  }
}
```

#### StatefulWidget の構造を守る
```dart
✅ 正しい例：
class LoginScreen extends StatefulWidget {
  final String title;
  
  const LoginScreen({
    Key? key,
    required this.title,
  }) : super(key: key);
  
  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  // 1. コントローラー定義
  final _emailController = TextEditingController();
  
  // 2. 状態変数定義
  bool _isLoading = false;
  
  // 3. initState（必要な場合のみ）
  @override
  void initState() {
    super.initState();  // 必ず最初に呼ぶ
    _initialize();
  }
  
  // 4. dispose（コントローラー使用時必須）
  @override
  void dispose() {
    _emailController.dispose();
    super.dispose();  // 必ず最後に呼ぶ
  }
  
  // 5. buildメソッド
  @override
  Widget build(BuildContext context) {
    return Scaffold();
  }
  
  // 6. プライベートメソッド
  void _initialize() { }
}

❌ 間違い：
class _LoginScreenState extends State<LoginScreen> {
  @override
  void initState() {
    _initialize();         // super.initState()呼び忘れ禁止
  }
  
  @override
  void dispose() {        // コントローラーのdispose忘れ禁止
    super.dispose();
  }
}
```

### 2.3 非同期処理の規則

#### async/await を必ず使用する
```dart
✅ 正しい例：
Future<User> fetchUser(String id) async {
  try {
    final response = await http.get(Uri.parse('$apiUrl/users/$id'));
    
    if (response.statusCode == 200) {
      return User.fromJson(jsonDecode(response.body));
    } else {
      throw ApiException('ユーザー取得失敗');
    }
  } catch (e) {
    throw AppException('エラーが発生しました: $e');
  }
}

❌ 間違い：
Future<User> fetchUser(String id) {
  return http.get(Uri.parse('$apiUrl/users/$id'))
    .then((response) {                    // then使用禁止
      return User.fromJson(response.body);
    });
}
```

#### FutureBuilder の使用規則
```dart
✅ 正しい例：
FutureBuilder<User>(
  future: fetchUser(userId),
  builder: (context, snapshot) {
    // 1. エラーチェック
    if (snapshot.hasError) {
      return ErrorWidget(error: snapshot.error!);
    }
    
    // 2. データチェック
    if (!snapshot.hasData) {
      return const CircularProgressIndicator();
    }
    
    // 3. データ表示
    final user = snapshot.data!;
    return UserWidget(user: user);
  },
)

❌ 間違い：
FutureBuilder<User>(
  future: fetchUser(userId),
  builder: (context, snapshot) {
    return UserWidget(user: snapshot.data!);  // null安全性無視禁止
  },
)
```

### 2.4 エラーハンドリングの規則

#### カスタム例外クラスを定義する
```dart
✅ 正しい例：
class AppException implements Exception {
  final String message;
  final String? code;
  
  const AppException(this.message, [this.code]);
  
  @override
  String toString() => message;
}

class NetworkException extends AppException {
  const NetworkException([String message = 'ネットワークエラー']) 
    : super(message, 'NETWORK_ERROR');
}

❌ 間違い：
throw Exception('エラー');         // 汎用Exception禁止
throw 'エラー文字列';               // 文字列throw禁止
```

#### try-catch-finally の使用規則
```dart
✅ 正しい例：
Future<void> saveData(String data) async {
  File? file;
  
  try {
    file = await File('path/to/file').create();
    await file.writeAsString(data);
  } catch (e) {
    logger.error('ファイル書き込み失敗', error: e);
    throw FileWriteException('保存に失敗しました');
  } finally {
    await file?.delete();  // クリーンアップ
  }
}

❌ 間違い：
try {
  await saveData(data);
} catch (e) {
  print(e);               // print使用禁止
  // エラーの握りつぶし禁止
}
```

### 2.5 定数定義の規則

#### const を積極的に使用する
```dart
✅ 正しい例：
// Widget生成時
const Text('固定テキスト');
const EdgeInsets.all(16.0);
const SizedBox(height: 8);

// リスト定義時
const List<String> categories = ['A', 'B', 'C'];

// コンストラクタ
const StudentCard(studentId: '123');

❌ 間違い：
Text('固定テキスト');              // const なし禁止
EdgeInsets.all(16.0);             // const なし禁止
final list = ['A', 'B', 'C'];    // 固定値なのに const なし禁止
```

---

## 3. Next.js/React コーディング規約

### 3.1 コンポーネント命名規則

#### コンポーネント名
**必ず PascalCase を使用する**
```tsx
✅ 正しい例：
const StudentCard: React.FC = () => { };
const UserProfile: React.FC = () => { };
function AdminDashboard() { }

❌ 間違い：
const studentCard = () => { };    // キャメルケース禁止
const student_card = () => { };    // スネークケース禁止
```

#### Props型名
**必ず コンポーネント名 + Props を使用する**
```tsx
✅ 正しい例：
interface StudentCardProps {
  studentId: string;
  studentName: string;
}

const StudentCard: React.FC<StudentCardProps> = (props) => { };

❌ 間違い：
interface Props { }                // 汎用名禁止
interface StudentCardInterface { } // Interface接尾辞禁止
```

### 3.2 コンポーネント構造の規則

#### 関数コンポーネントの構造を守る
```tsx
✅ 正しい例：
const StudentCard: React.FC<StudentCardProps> = ({
  studentId,
  studentName,
  onSelect,
}) => {
  // 1. State定義
  const [isSelected, setIsSelected] = useState(false);
  
  // 2. Hooks使用
  const router = useRouter();
  
  // 3. Memoized values
  const displayName = useMemo(() => {
    return formatName(studentName);
  }, [studentName]);
  
  // 4. Callbacks
  const handleClick = useCallback(() => {
    onSelect?.(studentId);
  }, [studentId, onSelect]);
  
  // 5. Effects
  useEffect(() => {
    // 処理
    return () => {
      // クリーンアップ
    };
  }, [studentId]);
  
  // 6. 早期リターン
  if (!studentId) {
    return null;
  }
  
  // 7. メインレンダリング
  return (
    <div onClick={handleClick}>
      {displayName}
    </div>
  );
};

❌ 間違い：
const StudentCard = (props) => {
  const handleClick = () => { };  // useCallback なし禁止
  
  useEffect(() => { });           // 依存配列なし禁止
  
  const [state, setState] = useState();  // 型なし禁止
  
  return <div />;
};
```

### 3.3 Hooks使用の規則

#### カスタムHooksは use プレフィックス必須
```tsx
✅ 正しい例：
function useUser(userId: string) { }
function usePagination(options: Options) { }
function useDebounce<T>(value: T, delay: number) { }

❌ 間違い：
function getUser(userId: string) { }      // use なし禁止
function UserHook(userId: string) { }     // 形式違反禁止
```

#### useEffect の依存配列を必ず指定する
```tsx
✅ 正しい例：
useEffect(() => {
  fetchData();
}, []);  // マウント時のみ

useEffect(() => {
  fetchUser(userId);
}, [userId]);  // userIdが変わったとき

useEffect(() => {
  const timer = setInterval(() => {
    refresh();
  }, 1000);
  
  return () => clearInterval(timer);  // クリーンアップ必須
}, [refresh]);

❌ 間違い：
useEffect(() => {
  fetchData();
});  // 依存配列なし禁止

useEffect(() => {
  fetchUser(userId);
}, []);  // userIdの依存漏れ禁止
```

#### useCallback/useMemo を適切に使用する
```tsx
✅ 正しい例：
// 子コンポーネントに渡す関数
const handleSubmit = useCallback((data: FormData) => {
  submitForm(data);
}, [submitForm]);

// 計算コストが高い処理
const expensiveValue = useMemo(() => {
  return calculateComplexValue(data);
}, [data]);

❌ 間違い：
// 単純な値にuseMemo禁止
const simpleValue = useMemo(() => x + 1, [x]);

// インライン関数禁止
<Button onClick={() => handleClick(id)} />
```

### 3.4 型定義の規則

#### interface と type の使い分け
```tsx
✅ 正しい例：
// オブジェクト型は interface
interface IUser {
  id: string;
  name: string;
}

// ユニオン型・交差型は type
type Status = 'active' | 'inactive';
type UserWithRole = IUser & { role: string };

❌ 間違い：
type User = {              // オブジェクトにtype禁止
  id: string;
  name: string;
};

interface Status {         // ユニオン型にinterface禁止
  // 不可能
}
```

---

## 4. 共通禁止事項

### 4.1 絶対禁止事項

```typescript
❌ console.log の使用禁止（デバッグ後は必ず削除）
console.log('デバッグ');

❌ any 型の使用禁止
let data: any;

❌ 非null アサーション演算子(!)の濫用禁止
const value = getData()!;  // null チェックなし禁止

❌ マジックナンバーの使用禁止
if (count > 10) { }  // 10 が何を意味するか不明

❌ 日本語変数名禁止
const 名前 = '田中';

❌ コメントアウトしたコードの放置禁止
// const oldCode = 'test';

❌ TODO コメントの放置禁止（実装するかチケット化する）
// TODO: あとで実装

❌ 使用していないインポート・変数の放置禁止
import { unused } from './module';
const unusedVariable = 'test';

❌ エラーの握りつぶし禁止
try {
  riskyOperation();
} catch (e) {
  // 何もしない
}

❌ ハードコーディングされた認証情報禁止
const apiKey = 'sk-1234567890abcdef';
```

### 4.2 必須実施事項

```typescript
✅ 全ての関数に戻り値の型を明示する
function getName(): string { }

✅ 全ての変数に型を明示する
const count: number = 0;

✅ エラーは必ずログに記録する
catch (error) {
  logger.error('処理失敗', { error });
  throw error;
}

✅ 定数は意味のある名前で定義する
const MAX_RETRY_COUNT = 3;
if (count > MAX_RETRY_COUNT) { }

✅ 複雑な条件は変数に抽出する
const isValidUser = user && user.age >= 18 && user.isActive;
if (isValidUser) { }

✅ 早期リターンで入れ子を減らす
if (!user) return null;
if (!user.isActive) return null;
// メイン処理

✅ null/undefined チェックを行う
const value = getData();
if (value !== null && value !== undefined) {
  processValue(value);
}
```

---

## 改訂履歴

| 版 | 日付 | 内容 | 作成者 |
|----|------|------|--------|
| 1.0 | 2024-01-25 | 初版作成 | システム設計担当 |