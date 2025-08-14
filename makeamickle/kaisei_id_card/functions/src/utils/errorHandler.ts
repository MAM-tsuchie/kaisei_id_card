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
      error.code as functions.https.FunctionsErrorCode,
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
  info: (message: string, ...args: unknown[]): void => {
    functions.logger.info(message, ...args);
  },
  warn: (message: string, ...args: unknown[]): void => {
    functions.logger.warn(message, ...args);
  },
  error: (message: string, ...args: unknown[]): void => {
    functions.logger.error(message, ...args);
  },
};