#!/usr/bin/env node

/**
 * コマンド実行前にディレクトリ移動違反をチェックするスクリプト
 * Claude Code のhook機能から呼び出される
 */

const command = process.argv[2];

if (!command) {
  console.log('No command provided');
  process.exit(0);
}

// 禁止パターンの定義
const blockedPatterns = [
  /^cd\s+/,  // すべての cd コマンドを禁止
  /^flutter\s+/,  // 直接的な flutter コマンドを禁止
  /^dart\s+/,  // 直接的な dart コマンドを禁止
  /\(cd\s+.*flutter.*\)/,  // 括弧内でも flutter は禁止
  /\(cd\s+.*dart.*\)/,  // 括弧内でも dart は禁止
];

// 唯一許可される例外パターン（iOS Pod インストールのみ）
const allowedExceptions = [
  /^\(cd\s+apps\/student-app\/ios\s+&&\s+pod\s+install\)$/,  // iOS Pod install のみ
];

// npm script経由のコマンドは許可
const npmScriptPatterns = [
  /^npm\s+run\s+/,
  /^yarn\s+/,
  /^pnpm\s+run\s+/,
];

// コマンドがnpm script経由かチェック
function isNpmScript(cmd) {
  return npmScriptPatterns.some(pattern => pattern.test(cmd));
}

// 例外として許可されているかチェック
function isAllowedException(cmd) {
  return allowedExceptions.some(pattern => pattern.test(cmd));
}

// 違反理由を取得
function getViolationReason(cmd) {
  if (/^flutter\s+/.test(cmd)) {
    return 'Flutter コマンドの直接実行は禁止されています。npm scripts を使用してください。';
  }
  if (/^dart\s+/.test(cmd)) {
    return 'Dart コマンドの直接実行は禁止されています。npm scripts を使用してください。';
  }
  if (/\(cd\s+.*flutter.*\)/.test(cmd)) {
    return '括弧を使った Flutter コマンドの実行も禁止されています。npm scripts を使用してください。';
  }
  if (/\(cd\s+.*dart.*\)/.test(cmd)) {
    return '括弧を使った Dart コマンドの実行も禁止されています。npm scripts を使用してください。';
  }
  if (/^cd\s+/.test(cmd)) {
    return 'サブディレクトリへの cd 移動は禁止されています。';
  }
  return 'このコマンドパターンは禁止されています。';
}

// 違反をチェック
function checkViolation(cmd) {
  // npm script経由は常に許可
  if (isNpmScript(cmd)) {
    return { valid: true };
  }

  // 例外として許可されているコマンド
  if (isAllowedException(cmd)) {
    return { 
      valid: true, 
      warning: '⚠️ iOS Pod インストールは技術的制約により例外的に許可されています。' 
    };
  }

  // 禁止パターンに該当するかチェック
  for (const pattern of blockedPatterns) {
    if (pattern.test(cmd)) {
      return {
        valid: false,
        error: `❌ コマンド実行違反が検出されました！

実行しようとしたコマンド: ${cmd}

【違反理由】
${getViolationReason(cmd)}

【正しい実行方法】
1. Flutter/Dart コマンドは必ず npm scripts 経由で実行:
   - テスト: npm run test:flutter
   - ビルド: npm run build:flutter
   - 解析: npm run analyze:flutter
   - フォーマット: npm run format:flutter

2. その他のコマンドも npm scripts または workspace 経由で:
   - Functions: npm run test --workspace=functions
   - Admin: npm run dev --workspace=apps/admin-web

3. 唯一の例外（技術的制約）:
   - iOS Pod インストール: (cd apps/student-app/ios && pod install)

⚠️ Flutter/Dart の直接実行は一切禁止されています。
必ず package.json に定義された npm scripts を使用してください。

詳細は CLAUDE.md の「コマンド実行規則」を参照してください。`
      };
    }
  }

  return { valid: true };
}

// メイン処理
const result = checkViolation(command);

if (!result.valid) {
  console.error(result.error);
  process.exit(1);  // エラーで終了（コマンド実行をブロック）
}

if (result.warning) {
  console.warn(result.warning);
}

// 正常終了
process.exit(0);