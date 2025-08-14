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
exports.sampleFunction = exports.healthCheck = void 0;
const https_1 = require("firebase-functions/v2/https");
const https_2 = require("firebase-functions/v2/https");
const admin = __importStar(require("firebase-admin"));
// Firebase Admin初期化
admin.initializeApp();
// リージョン設定
const REGION = 'asia-northeast1';
/**
 * ヘルスチェックエンドポイント
 * @see docs/functional-specifications.md - API仕様
 */
exports.healthCheck = (0, https_1.onRequest)({ region: REGION }, (_req, res) => {
    res.status(200).json({
        status: 'ok',
        message: 'Cloud Functions is running',
        timestamp: new Date().toISOString(),
        region: REGION,
    });
});
/**
 * サンプル認証付き関数
 * @see docs/error-codes.md - エラーハンドリング
 */
exports.sampleFunction = (0, https_1.onCall)({ region: REGION }, async (request) => {
    // 認証チェック
    if (!request.auth) {
        throw new https_2.HttpsError('unauthenticated', '認証が必要です');
    }
    return {
        success: true,
        message: 'Function executed successfully',
        userId: request.auth.uid,
        timestamp: new Date().toISOString(),
    };
});
//# sourceMappingURL=index.js.map