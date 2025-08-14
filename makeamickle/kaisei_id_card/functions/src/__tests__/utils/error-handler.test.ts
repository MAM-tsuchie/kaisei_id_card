import { AppError, handleError } from '../../utils/error-handler';
import * as functions from 'firebase-functions';

describe('error-handler', () => {
  describe('AppError', () => {
    it('should create an error with correct properties', () => {
      const error = new AppError('TEST001', 'Test error', 400);
      
      expect(error.code).toBe('TEST001');
      expect(error.message).toBe('Test error');
      expect(error.statusCode).toBe(400);
      expect(error.name).toBe('AppError');
    });
  });

  describe('handleError', () => {
    it('should throw HttpsError for AppError', () => {
      const appError = new AppError('invalid-argument', 'Test error', 400);
      
      expect(() => handleError(appError)).toThrow(functions.https.HttpsError);
    });
  });
});