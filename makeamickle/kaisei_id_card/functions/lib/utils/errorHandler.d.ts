/**
 * アプリケーションエラークラス
 * @see docs/error-codes.md - エラーコード体系
 */
export declare class AppError extends Error {
    code: string;
    statusCode: number;
    constructor(code: string, message: string, statusCode?: number);
}
/**
 * エラーハンドリング関数
 */
export declare function handleError(error: unknown): never;
/**
 * ロガーユーティリティ
 * @see docs/coding-standards.md - console.log禁止
 */
export declare const logger: {
    info: (message: string, ...args: unknown[]) => void;
    warn: (message: string, ...args: unknown[]) => void;
    error: (message: string, ...args: unknown[]) => void;
};
//# sourceMappingURL=errorHandler.d.ts.map