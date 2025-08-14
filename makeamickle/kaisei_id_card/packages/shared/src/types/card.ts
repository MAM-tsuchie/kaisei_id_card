/**
 * デジタル生徒証
 * @see docs/functional-specifications.md - 生徒証表示機能
 */
export interface IDigitalCard {
  id: string;
  userId: string;
  studentId: string;
  issueDate: Date;
  expiryDate: Date;
  isActive: boolean;
  photoUrl?: string;
  barcodeData: string;
  version: number;
  lastAccessedAt?: Date;
  deviceIds?: string[];  // 登録デバイス
}