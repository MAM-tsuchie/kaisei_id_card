#!/usr/bin/env node

/**
 * Phase 0 完了チェックスクリプト
 * 環境構築・基盤整備フェーズの完了状況を確認します
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 色付きログ出力用
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function error(message) {
  log(`❌ ${message}`, 'red');
}

function success(message) {
  log(`✅ ${message}`, 'green');
}

function warning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function info(message) {
  log(`ℹ️  ${message}`, 'blue');
}

// ルートディレクトリ確認
function checkProjectRoot() {
  const rootPath = process.cwd();
  const claudeMdPath = path.join(rootPath, 'CLAUDE.md');
  
  if (!fs.existsSync(claudeMdPath)) {
    error('CLAUDE.mdが見つかりません。プロジェクトルートから実行してください。');
    process.exit(1);
  }
  
  success('プロジェクトルートディレクトリで実行中');
  return rootPath;
}

// ファイル存在確認
function checkFileExists(filePath, description) {
  if (fs.existsSync(filePath)) {
    success(`${description}: ${filePath}`);
    return true;
  } else {
    error(`${description}が見つかりません: ${filePath}`);
    return false;
  }
}

// ディレクトリ存在確認
function checkDirectoryExists(dirPath, description) {
  if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) {
    success(`${description}: ${dirPath}`);
    return true;
  } else {
    error(`${description}が見つかりません: ${dirPath}`);
    return false;
  }
}

// コマンド実行確認
function checkCommand(command, description) {
  try {
    execSync(command, { stdio: 'pipe', encoding: 'utf8' });
    success(`${description}: ${command}`);
    return true;
  } catch (err) {
    error(`${description}でエラー: ${command}`);
    error(`エラー詳細: ${err.message}`);
    return false;
  }
}

// NPMパッケージ確認
function checkNpmPackage(packagePath) {
  const packageJsonPath = path.join(packagePath, 'package.json');
  const nodeModulesPath = path.join(packagePath, 'node_modules');
  
  if (fs.existsSync(packageJsonPath) && fs.existsSync(nodeModulesPath)) {
    success(`NPMパッケージ: ${packagePath}`);
    return true;
  } else {
    error(`NPMパッケージが不完全: ${packagePath}`);
    return false;
  }
}

// メイン関数
function main() {
  log('🔍 Phase 0 完了チェックを開始します...', 'cyan');
  log('', 'reset');
  
  const rootPath = checkProjectRoot();
  let allChecksPass = true;
  
  // 1. 基本ディレクトリ構造チェック
  log('📁 1. ディレクトリ構造チェック', 'bright');
  const directories = [
    'apps',
    'apps/student-app',
    'apps/admin-web',
    'functions',
    'packages',
    'packages/shared',
    'packages/firebase-config',
    'scripts',
    'docs',
    'tests'
  ];
  
  directories.forEach(dir => {
    if (!checkDirectoryExists(path.join(rootPath, dir), `ディレクトリ: ${dir}`)) {
      allChecksPass = false;
    }
  });
  
  log('', 'reset');
  
  // 2. 設定ファイルチェック
  log('⚙️  2. 設定ファイルチェック', 'bright');
  const configFiles = [
    'package.json',
    'firebase.json',
    'firestore.rules',
    'storage.rules',
    'firestore.indexes.json',
    '.eslintrc.json',
    '.prettierrc',
    '.gitignore',
    'README.md',
    'CLAUDE.md'
  ];
  
  configFiles.forEach(file => {
    if (!checkFileExists(path.join(rootPath, file), `設定ファイル: ${file}`)) {
      allChecksPass = false;
    }
  });
  
  log('', 'reset');
  
  // 3. TypeScript設定ファイルチェック
  log('📝 3. TypeScript設定ファイルチェック', 'bright');
  const tsConfigFiles = [
    'functions/tsconfig.json',
    'apps/admin-web/tsconfig.json',
    'packages/shared/tsconfig.json',
    'packages/firebase-config/tsconfig.json'
  ];
  
  tsConfigFiles.forEach(file => {
    if (!checkFileExists(path.join(rootPath, file), `TypeScript設定: ${file}`)) {
      allChecksPass = false;
    }
  });
  
  log('', 'reset');
  
  // 4. Flutter設定チェック
  log('📱 4. Flutter設定チェック', 'bright');
  const flutterFiles = [
    'apps/student-app/pubspec.yaml',
    'apps/student-app/lib/main.dart',
    'apps/student-app/lib/core/app.dart'
  ];
  
  flutterFiles.forEach(file => {
    if (!checkFileExists(path.join(rootPath, file), `Flutter設定: ${file}`)) {
      allChecksPass = false;
    }
  });
  
  log('', 'reset');
  
  // 5. Next.js設定チェック
  log('🌐 5. Next.js設定チェック', 'bright');
  const nextjsFiles = [
    'apps/admin-web/next.config.js',
    'apps/admin-web/src/pages/_app.tsx',
    'apps/admin-web/src/pages/index.tsx'
  ];
  
  nextjsFiles.forEach(file => {
    if (!checkFileExists(path.join(rootPath, file), `Next.js設定: ${file}`)) {
      allChecksPass = false;
    }
  });
  
  log('', 'reset');
  
  // 6. Cloud Functions設定チェック
  log('☁️  6. Cloud Functions設定チェック', 'bright');
  const functionsFiles = [
    'functions/src/index.ts',
    'functions/src/utils/errorHandler.ts'
  ];
  
  functionsFiles.forEach(file => {
    if (!checkFileExists(path.join(rootPath, file), `Functions設定: ${file}`)) {
      allChecksPass = false;
    }
  });
  
  log('', 'reset');
  
  // 7. 共有パッケージチェック
  log('📦 7. 共有パッケージチェック', 'bright');
  const sharedFiles = [
    'packages/shared/src/types/index.ts',
    'packages/shared/src/constants/index.ts',
    'packages/shared/src/utils/validation.ts',
    'packages/firebase-config/src/index.ts'
  ];
  
  sharedFiles.forEach(file => {
    if (!checkFileExists(path.join(rootPath, file), `共有パッケージ: ${file}`)) {
      allChecksPass = false;
    }
  });
  
  log('', 'reset');
  
  // 8. テスト設定チェック
  log('🧪 8. テスト設定チェック', 'bright');
  const testFiles = [
    'functions/jest.config.js',
    'apps/admin-web/jest.config.js',
    'packages/shared/jest.config.js'
  ];
  
  testFiles.forEach(file => {
    if (!checkFileExists(path.join(rootPath, file), `テスト設定: ${file}`)) {
      allChecksPass = false;
    }
  });
  
  log('', 'reset');
  
  // 9. CI/CD設定チェック
  log('🔄 9. CI/CD設定チェック', 'bright');
  const cicdFiles = [
    '.github/workflows/ci.yml',
    '.env.example'
  ];
  
  cicdFiles.forEach(file => {
    if (!checkFileExists(path.join(rootPath, file), `CI/CD設定: ${file}`)) {
      allChecksPass = false;
    }
  });
  
  log('', 'reset');
  
  // 10. ドキュメントチェック
  log('📖 10. ドキュメントチェック', 'bright');
  const documentFiles = [
    'docs/system-requirements.md',
    'docs/functional-specifications.md',
    'docs/implementation-roadmap.md',
    'docs/coding-standards.md',
    'docs/phase-completion-criteria.md',
    'docs/current-status.md',
    'docs/development-guide.md',
    'docs/api-specification.md'
  ];
  
  documentFiles.forEach(file => {
    if (!checkFileExists(path.join(rootPath, file), `ドキュメント: ${file}`)) {
      allChecksPass = false;
    }
  });
  
  log('', 'reset');
  
  // 11. NPMパッケージインストール確認
  log('📥 11. NPMパッケージインストール確認', 'bright');
  const npmPackages = [
    '.',
    'functions',
    'apps/admin-web',
    'packages/shared',
    'packages/firebase-config'
  ];
  
  npmPackages.forEach(pkg => {
    if (!checkNpmPackage(path.join(rootPath, pkg))) {
      allChecksPass = false;
    }
  });
  
  log('', 'reset');
  
  // 12. コマンド実行チェック
  log('🔧 12. コマンド実行チェック', 'bright');
  const commands = [
    ['npm run lint', 'Lint実行'],
    ['npm run type-check', 'TypeScriptチェック'],
    ['npm run test:all', 'テスト実行'],
    ['firebase --version', 'Firebase CLI確認']
  ];
  
  commands.forEach(([command, description]) => {
    if (!checkCommand(command, description)) {
      allChecksPass = false;
    }
  });
  
  log('', 'reset');
  
  // 最終結果
  if (allChecksPass) {
    log('🎉 Phase 0 完了チェック: すべて合格!', 'green');
    log('✨ 環境構築・基盤整備フェーズが正常に完了しています', 'green');
    log('👉 次は Phase 1 の実装に進むことができます', 'cyan');
  } else {
    log('❌ Phase 0 完了チェック: 失敗項目があります', 'red');
    log('🔧 上記のエラー項目を修正してから再実行してください', 'yellow');
    process.exit(1);
  }
}

// スクリプト実行
if (require.main === module) {
  main();
}

module.exports = {
  checkProjectRoot,
  checkFileExists,
  checkDirectoryExists,
  checkCommand,
  checkNpmPackage
};