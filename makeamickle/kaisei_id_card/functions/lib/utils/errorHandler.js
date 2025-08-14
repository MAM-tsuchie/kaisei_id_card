"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = exports.AppError = void 0;
exports.handleError = handleError;
const functions = __importStar(require("firebase-functions"));
/**
 * アプリケーションエラークラス
 * @see docs/error-codes.md - エラーコード体系
 */
class AppError extends Error {
    constructor(code, message, statusCode = 500) {
        super(message);
        this.code = code;
        this.statusCode = statusCode;
        this.name = 'AppError';
    }
}
exports.AppError = AppError;
/**
 * エラーハンドリング関数
 */
function handleError(error) {
    // ログ出力（console.logは使用しない）
    functions.logger.error('Error occurred:', error);
    if (error instanceof functions.https.HttpsError) {
        throw error;
    }
    if (error instanceof AppError) {
        throw new functions.https.HttpsError(error.code, error.message);
    }
    throw new functions.https.HttpsError('internal', 'An unexpected error occurred');
}
/**
 * ロガーユーティリティ
 * @see docs/coding-standards.md - console.log禁止
 */
exports.logger = {
    info: (message, ...args) => {
        functions.logger.info(message, ...args);
    },
    warn: (message, ...args) => {
        functions.logger.warn(message, ...args);
    },
    error: (message, ...args) => {
        functions.logger.error(message, ...args);
    },
};
//# sourceMappingURL=errorHandler.js.map