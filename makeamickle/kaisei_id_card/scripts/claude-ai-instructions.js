#!/usr/bin/env node

/**
 * Claude AI 向け必須指示 - clear後も確実に実行される
 * 全てのnpmコマンド実行前に自動表示
 */

console.log('\n🚨 Claude AI 必須確認事項:');
console.log('');
console.log('1. pwd で位置確認 → /kaisei_id_card であることを確認');
console.log('2. Java確認 → npm run check-java');
console.log('3. cdコマンド使用禁止 (iOS Pod以外)');
console.log('');
console.log('📋 今回発生した問題と解決策:');
console.log('');
console.log('【Java問題】');
console.log('  ❌ 絶対禁止: java --version');
console.log('  ✅ 正解: npm run check-java');
console.log('  ✅ 手動確認: /opt/homebrew/opt/openjdk@11/bin/java --version');
console.log('  原因: PATHが通っていない、Claude AIがコマンドを混同');
console.log('');
console.log('【ディレクトリ問題】'); 
console.log('  現象: No workspaces found');
console.log('  解決: pwd確認、プロジェクトルートに移動');
console.log('  原因: 間違ったディレクトリで実行');
console.log('');
console.log('✅ この情報は package.json の "preinstall" で自動表示されます');
console.log('');