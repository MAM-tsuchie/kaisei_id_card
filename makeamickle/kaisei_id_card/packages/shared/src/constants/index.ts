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