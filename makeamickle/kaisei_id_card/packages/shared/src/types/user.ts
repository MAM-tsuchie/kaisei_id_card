/**
 * ユーザー基本情報
 * @see docs/system-requirements.md - ユーザー要件
 * @see docs/functional-specifications.md - ユーザー管理仕様
 */

/**
 * 名前情報
 */
export interface IName {
  lastName: string;      // 姓
  firstName: string;     // 名
  lastNameKana: string;  // 姓（カナ）
  firstNameKana: string; // 名（カナ）
}

/**
 * ユーザーステータス
 */
export type UserStatus = 'active' | 'graduated' | 'withdrawn' | 'suspended';

/**
 * ユーザーロール
 */
export type UserRole = 'student' | 'alumni' | 'admin' | 'staff';

/**
 * ユーザー情報
 */
export interface IUser {
  id: string;
  studentId: string;     // 学籍番号（7桁）
  email: string;
  name: IName;
  grade?: number;        // 1-6 (中1-高3)
  class?: string;        // A-F
  status: UserStatus;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;      // 論理削除用
}