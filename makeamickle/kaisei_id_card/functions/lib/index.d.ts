/**
 * ヘルスチェックエンドポイント
 * @see docs/functional-specifications.md - API仕様
 */
export declare const healthCheck: import("firebase-functions/v2/https").HttpsFunction;
/**
 * サンプル認証付き関数
 * @see docs/error-codes.md - エラーハンドリング
 */
export declare const sampleFunction: import("firebase-functions/v2/https").CallableFunction<any, Promise<{
    success: boolean;
    message: string;
    userId: string;
    timestamp: string;
}>, unknown>;
//# sourceMappingURL=index.d.ts.map