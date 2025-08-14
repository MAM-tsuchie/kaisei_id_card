/**
 * バリデーションユーティリティ
 * @see docs/coding-standards.md - 入力検証
 */

/**
 * 学籍番号バリデーション
 * 形式: 西暦4桁 + 連番3桁（例: 2024001）
 */
export function isValidStudentId(id: string): boolean {
  if (!id || typeof id !== 'string') {
    return false;
  }
  return /^20\d{5}$/.test(id);
}

/**
 * メールアドレスバリデーション
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') {
    return false;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * 学年バリデーション（1-6）
 */
export function isValidGrade(grade: number): boolean {
  return Number.isInteger(grade) && grade >= 1 && grade <= 6;
}

/**
 * クラスバリデーション（A-F）
 */
export function isValidClass(className: string): boolean {
  return ['A', 'B', 'C', 'D', 'E', 'F'].includes(className);
}

/**
 * 名前バリデーション
 */
export function isValidName(name: string): boolean {
  if (!name || typeof name !== 'string') {
    return false;
  }
  // 1文字以上20文字以下
  return name.length >= 1 && name.length <= 20;
}