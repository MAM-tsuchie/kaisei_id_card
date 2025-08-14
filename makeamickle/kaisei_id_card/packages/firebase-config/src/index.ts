/**
 * Firebase設定モジュール
 * @see docs/environment-strategy.md - 環境設定
 */
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getFunctions, Functions } from 'firebase/functions';

// エミュレータ用の設定
const firebaseConfig = {
  apiKey: 'demo-api-key',
  authDomain: 'demo.firebaseapp.com',
  projectId: 'demo-kaisei-id-card',
  storageBucket: 'demo-kaisei-id-card.appspot.com',
  messagingSenderId: '123456789',
  appId: 'demo-app-id',
};

let app: FirebaseApp;

// アプリ初期化
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// サービスインスタンス
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
export const storage: FirebaseStorage = getStorage(app);
export const functions: Functions = getFunctions(app, 'asia-northeast1');

// エミュレータ接続設定（開発環境のみ）
export function connectToEmulators(): void {
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    // Auth エミュレータ
    import('firebase/auth').then(({ connectAuthEmulator }) => {
      try {
        connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
      } catch (error) {
        // 既に接続済みの場合はエラーを無視
      }
    });
    
    // Firestore エミュレータ
    import('firebase/firestore').then(({ connectFirestoreEmulator }) => {
      try {
        connectFirestoreEmulator(db, 'localhost', 8080);
      } catch (error) {
        // 既に接続済みの場合はエラーを無視
      }
    });
    
    // Storage エミュレータ
    import('firebase/storage').then(({ connectStorageEmulator }) => {
      try {
        connectStorageEmulator(storage, 'localhost', 9199);
      } catch (error) {
        // 既に接続済みの場合はエラーを無視
      }
    });
    
    // Functions エミュレータ
    import('firebase/functions').then(({ connectFunctionsEmulator }) => {
      try {
        connectFunctionsEmulator(functions, 'localhost', 5001);
      } catch (error) {
        // 既に接続済みの場合はエラーを無視
      }
    });
  }
}

// デフォルトエクスポート
export default app;