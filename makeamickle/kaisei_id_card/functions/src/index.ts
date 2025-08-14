import { onRequest, onCall } from 'firebase-functions/v2/https';
import { HttpsError } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';
import type { Request, Response } from 'express';

// Firebase Admin初期化
admin.initializeApp();

// リージョン設定
const REGION = 'asia-northeast1';

/**
 * ヘルスチェックエンドポイント
 * @see docs/functional-specifications.md - API仕様
 */
export const healthCheck = onRequest(
  { region: REGION },
  (_req: Request, res: Response) => {
    res.status(200).json({
      status: 'ok',
      message: 'Cloud Functions is running',
      timestamp: new Date().toISOString(),
      region: REGION,
    });
  }
);

/**
 * サンプル認証付き関数
 * @see docs/error-codes.md - エラーハンドリング
 */
export const sampleFunction = onCall(
  { region: REGION },
  async (request) => {
    // 認証チェック
    if (!request.auth) {
      throw new HttpsError(
        'unauthenticated',
        '認証が必要です'
      );
    }

    return {
      success: true,
      message: 'Function executed successfully',
      userId: request.auth.uid,
      timestamp: new Date().toISOString(),
    };
  }
);