#!/usr/bin/env node

/**
 * Claude Code のツール呼び出し時に実行されるバリデーションスクリプト
 * 全体的なツール使用パターンをチェック
 */

const tool = process.argv[2];
const params = process.argv[3];

// ログファイルへの記録（デバッグ用）
const fs = require('fs');
const path = require('path');
const logFile = path.join(__dirname, '..', '.claude', 'command-log.json');

// ログディレクトリの作成
const logDir = path.dirname(logFile);
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// 既存のログを読み込み
let logs = [];
if (fs.existsSync(logFile)) {
  try {
    const content = fs.readFileSync(logFile, 'utf8');
    logs = JSON.parse(content);
  } catch (e) {
    logs = [];
  }
}

// 新しいログエントリを追加
const logEntry = {
  timestamp: new Date().toISOString(),
  tool: tool,
  params: params,
  pid: process.pid
};

// Bashツールの場合、コマンドを解析
if (tool === 'Bash' && params) {
  try {
    const paramObj = JSON.parse(params);
    if (paramObj.command) {
      logEntry.command = paramObj.command;
      
      // cdコマンドの使用を検出
      if (/^cd\s+/.test(paramObj.command)) {
        logEntry.violation = 'CD_COMMAND_DETECTED';
        
        // 許可された例外かチェック
        const allowedPatterns = [
          /^\(cd\s+apps\/student-app\/ios\s+&&\s+pod\s+install\)$/,
          /^\(cd\s+apps\/student-app\s+&&\s+flutter\s+.*\)$/
        ];
        
        const isAllowed = allowedPatterns.some(pattern => pattern.test(paramObj.command));
        if (!isAllowed) {
          logEntry.severity = 'ERROR';
          console.error(`
⚠️ ==================================================
   ディレクトリ移動違反の可能性が検出されました
==================================================

コマンド: ${paramObj.command}

プロジェクトルートからの実行が必要です。
npm scripts またはworkspace機能を使用してください。

==================================================
`);
        } else {
          logEntry.severity = 'WARNING';
          logEntry.exception = 'ALLOWED_EXCEPTION';
        }
      }
    }
  } catch (e) {
    // パースエラーは無視
  }
}

// ログを保存（最新100件のみ保持）
logs.push(logEntry);
if (logs.length > 100) {
  logs = logs.slice(-100);
}

fs.writeFileSync(logFile, JSON.stringify(logs, null, 2));

// 統計情報の表示（10コマンドごと）
if (logs.length % 10 === 0) {
  const violations = logs.filter(l => l.violation).length;
  if (violations > 0) {
    console.log(`
📊 コマンド実行統計（最新${logs.length}件）
- 違反検出数: ${violations}件
- 遵守率: ${((logs.length - violations) / logs.length * 100).toFixed(1)}%
`);
  }
}

// 正常終了（ブロックしない）
process.exit(0);