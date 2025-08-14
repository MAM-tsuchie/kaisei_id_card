#!/usr/bin/env node

/**
 * ホームフォルダ保護Hook
 * Claudeがホームディレクトリ内のファイルを変更しようとした場合に警告・ブロック
 */

const HOME_DIR = process.env.HOME;

function checkForHomeModification(command) {
  if (!command) return true;

  // ホームディレクトリ設定ファイルへの変更を検出するパターン
  const homeWritePatterns = [
    /echo.*>>\s*~\/\.\w+/,  // echo >> ~/.xxxrc
    /echo.*>\s*~\/\.\w+/,   // echo > ~/.xxxrc
    />>.*~\/\.\w+/,         // >> ~/.xxxrc
    />.*~\/\.\w+/,          // > ~/.xxxrc
    new RegExp(`>.*${HOME_DIR.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/\\.\\w+`),  // > /Users/xxx/.xxxrc
    new RegExp(`>>.*${HOME_DIR.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/\\.\\w+`), // >> /Users/xxx/.xxxrc
    /vim.*~\/\.\w+/,        // vim ~/.xxxrc
    /nano.*~\/\.\w+/,       // nano ~/.xxxrc
    /touch.*~\/\.\w+/,      // touch ~/.xxxrc
    /cat.*>.*~\/\.\w+/,     // cat > ~/.xxxrc
    /cp.*~\/\.\w+/,         // cp xxx ~/.xxxrc
    /mv.*~\/\.\w+/,         // mv xxx ~/.xxxrc
  ];

  for (const pattern of homeWritePatterns) {
    if (pattern.test(command)) {
      console.error('🚫 BLOCKED: ホームディレクトリ内の設定ファイルへの変更は許可されていません');
      console.error(`検出されたコマンド: ${command}`);
      console.error(`検出されたパターン: ${pattern.source}`);
      console.error('');
      console.error('📋 代替案:');
      console.error('1. プロジェクト内で環境変数を設定');
      console.error('2. 一時的なPATH設定を使用');
      console.error('3. ユーザーに許可を求める');
      console.error('');
      process.exit(1);
    }
  }

  return true;
}

// コマンドライン引数から取得
const command = process.argv[2];

if (command) {
  try {
    checkForHomeModification(command);
    console.log('✅ ホームフォルダ保護チェック通過');
  } catch (error) {
    console.error('❌ ホームフォルダ保護チェックエラー:', error.message);
    process.exit(1);
  }
} else {
  console.log('✅ ホームフォルダ保護チェック通過（コマンドなし）');
}