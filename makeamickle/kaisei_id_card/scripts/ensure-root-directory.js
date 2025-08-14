#!/usr/bin/env node

/**
 * プロジェクトルートディレクトリの確認スクリプト
 * 全てのnpmコマンド実行前に自動実行される
 */

const path = require('path');
const fs = require('fs');

const currentDir = process.cwd();
const projectName = 'kaisei_id_card';

// プロジェクトルート判定
const isProjectRoot = () => {
  return currentDir.endsWith(`/${projectName}`) && 
         fs.existsSync(path.join(currentDir, 'package.json')) &&
         fs.existsSync(path.join(currentDir, 'CLAUDE.md'));
};

// 実行
if (!isProjectRoot()) {
  console.error('🚨 致命的エラー: コマンドはプロジェクトルートから実行する必要があります');
  console.error(`❌ 現在の位置: ${currentDir}`);
  console.error(`✅ 正しい位置: /.../kaisei_id_card`);
  console.error('');
  console.error('💡 解決方法:');
  console.error('   cd /path/to/kaisei_id_card');
  console.error('   npm run [command]');
  console.error('');
  console.error('🚨 この問題を防ぐため、Claude AIは以下を厳守すること:');
  console.error('   1. pwd でプロジェクトルート確認');
  console.error('   2. cd コマンドの使用禁止（例外除く）');
  console.error('   3. npm scriptsでのみコマンド実行');
  
  process.exit(1);
}

console.log(`✅ 実行位置確認完了: ${currentDir}`);