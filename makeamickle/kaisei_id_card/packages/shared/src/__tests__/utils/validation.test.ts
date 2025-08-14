import {
  isValidStudentId,
  isValidEmail,
  isValidGrade,
  isValidClass,
} from '../../utils/validation';

describe('validation utilities', () => {
  describe('isValidStudentId', () => {
    it('should validate correct student ID', () => {
      expect(isValidStudentId('2024001')).toBe(true);
      expect(isValidStudentId('2023999')).toBe(true);
    });

    it('should reject invalid student ID', () => {
      expect(isValidStudentId('1234567')).toBe(false);
      expect(isValidStudentId('202400')).toBe(false);
      expect(isValidStudentId('abcdefg')).toBe(false);
      expect(isValidStudentId('')).toBe(false);
    });
  });

  describe('isValidEmail', () => {
    it('should validate correct email', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@school.ed.jp')).toBe(true);
    });

    it('should reject invalid email', () => {
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('')).toBe(false);
    });
  });

  describe('isValidGrade', () => {
    it('should validate correct grade', () => {
      expect(isValidGrade(1)).toBe(true);
      expect(isValidGrade(6)).toBe(true);
    });

    it('should reject invalid grade', () => {
      expect(isValidGrade(0)).toBe(false);
      expect(isValidGrade(7)).toBe(false);
      expect(isValidGrade(1.5)).toBe(false);
    });
  });

  describe('isValidClass', () => {
    it('should validate correct class', () => {
      expect(isValidClass('A')).toBe(true);
      expect(isValidClass('F')).toBe(true);
    });

    it('should reject invalid class', () => {
      expect(isValidClass('G')).toBe(false);
      expect(isValidClass('1')).toBe(false);
      expect(isValidClass('')).toBe(false);
    });
  });
});