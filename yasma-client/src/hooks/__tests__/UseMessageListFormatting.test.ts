import { renderHook } from '@testing-library/react';
import useMessageListFormatting from '../UseMessageListFormatting';

describe('useMessageListFormatting', () => {
  let hook: ReturnType<typeof useMessageListFormatting>;

  beforeEach(() => {
    const { result } = renderHook(() => useMessageListFormatting());
    hook = result.current;
  });

  describe('formatMessageFrom', () => {
    it('should return empty string for null/undefined input', () => {
      expect(hook.formatMessageFrom('')).toBe('');
      expect(hook.formatMessageFrom(null as any)).toBe('');
      expect(hook.formatMessageFrom(undefined as any)).toBe('');
    });

    it('should extract name from email format "Name <email@example.com>"', () => {
      const input = 'John Doe <john.doe@example.com>';
      const expected = 'John Doe ';
      
      const result = hook.formatMessageFrom(input);
      
      expect(result).toBe(expected);
    });

    it('should handle email without name', () => {
      const input = 'john.doe@example.com';
      const expected = 'john.doe@example.com';
      
      const result = hook.formatMessageFrom(input);
      
      expect(result).toBe(expected);
    });

    it('should handle email with multiple angle brackets', () => {
      const input = 'John Doe <john.doe@example.com> <extra@example.com>';
      const expected = 'John Doe ';
      
      const result = hook.formatMessageFrom(input);
      
      expect(result).toBe(expected);
    });

    it('should handle email with spaces around angle brackets', () => {
      const input = 'John Doe  <  john.doe@example.com  >';
      const expected = 'John Doe  ';
      
      const result = hook.formatMessageFrom(input);
      
      expect(result).toBe(expected);
    });

    it('should handle special characters in name', () => {
      const input = 'José María <jose.maria@example.com>';
      const expected = 'José María ';
      
      const result = hook.formatMessageFrom(input);
      
      expect(result).toBe(expected);
    });

    it('should handle empty name part', () => {
      const input = '<john.doe@example.com>';
      const expected = '';
      
      const result = hook.formatMessageFrom(input);
      
      expect(result).toBe(expected);
    });

    it('should handle malformed email strings', () => {
      const input = 'John Doe <john.doe@example.com';
      const expected = 'John Doe <john.doe@example.com';
      
      const result = hook.formatMessageFrom(input);
      
      expect(result).toBe(expected);
    });
  });

  describe('formatMessageSubject', () => {
    it('should return original string if length is within limit', () => {
      const input = 'Short subject';
      const expected = 'Short subject';
      
      const result = hook.formatMessageSubject(input);
      
      expect(result).toBe(expected);
    });

    it('should truncate long subjects and add ellipsis', () => {
      const longSubject = 'A'.repeat(130); // Longer than MAX_SUBJECT_LENGTH (128)
      const expected = 'A'.repeat(128) + '...';
      
      const result = hook.formatMessageSubject(longSubject);
      
      expect(result).toBe(expected);
    });

    it('should handle subjects exactly at the limit', () => {
      const exactLengthSubject = 'A'.repeat(128); // Exactly MAX_SUBJECT_LENGTH
      const expected = 'A'.repeat(128);
      
      const result = hook.formatMessageSubject(exactLengthSubject);
      
      expect(result).toBe(expected);
    });

    it('should handle subjects one character over the limit', () => {
      const overLimitSubject = 'A'.repeat(129); // One over MAX_SUBJECT_LENGTH
      const expected = 'A'.repeat(128) + '...';
      
      const result = hook.formatMessageSubject(overLimitSubject);
      
      expect(result).toBe(expected);
    });

    it('should handle null/undefined input', () => {
      expect(hook.formatMessageSubject('')).toBe('');
      expect(hook.formatMessageSubject(null as any)).toBe('');
      expect(hook.formatMessageSubject(undefined as any)).toBe('');
    });

    it('should handle subjects with special characters', () => {
      const input = 'Subject with émojis 🚀 and special chars!';
      const result = hook.formatMessageSubject(input);
      
      // Should not be truncated if under limit
      if (input.length <= 128) {
        expect(result).toBe(input);
      } else {
        expect(result).toMatch(/^.{128}\.\.\.$/);
      }
    });

    it('should handle very long subjects', () => {
      const veryLongSubject = 'A'.repeat(500);
      const expected = 'A'.repeat(128) + '...';
      
      const result = hook.formatMessageSubject(veryLongSubject);
      
      expect(result).toBe(expected);
    });

    it('should preserve original string when no truncation needed', () => {
      const testCases = [
        'Simple subject',
        'Subject with numbers 123',
        'Subject with special chars: !@#$%^&*()',
        'Subject with unicode: 世界, 🌍',
        'A'.repeat(127), // Just under limit
        'A'.repeat(128), // Exactly at limit
      ];

      testCases.forEach(testCase => {
        const result = hook.formatMessageSubject(testCase);
        if (testCase.length <= 128) {
          expect(result).toBe(testCase);
        } else {
          expect(result).toMatch(/^.{128}\.\.\.$/);
        }
      });
    });
  });

  describe('edge cases', () => {
    it('should handle whitespace-only subjects', () => {
      const input = '   ';
      const expected = '   ';
      
      const result = hook.formatMessageSubject(input);
      
      expect(result).toBe(expected);
    });

    it('should handle subjects with only ellipsis characters', () => {
      const input = '...';
      const expected = '...';
      
      const result = hook.formatMessageSubject(input);
      
      expect(result).toBe(expected);
    });

    it('should handle email addresses with unusual formats', () => {
      const testCases = [
        'John Doe <john.doe@example.com>',
        'john.doe@example.com',
        '<john.doe@example.com>',
        'John Doe <john.doe@example.com',
        'John Doe john.doe@example.com',
        'John "Doe" <john.doe@example.com>',
      ];

      testCases.forEach(testCase => {
        const result = hook.formatMessageFrom(testCase);
        expect(typeof result).toBe('string');
        expect(result.length).toBeLessThanOrEqual(testCase.length);
      });
    });
  });

  describe('integration scenarios', () => {
    it('should handle realistic email scenarios', () => {
      const realisticEmails = [
        'John Doe <john.doe@company.com>',
        'support@service.com',
        'José María <jose.maria@example.org>',
        'Marketing Team <marketing@company.com>',
        'noreply@system.com',
      ];

      realisticEmails.forEach(email => {
        const result = hook.formatMessageFrom(email);
        expect(typeof result).toBe('string');
        expect(result.length).toBeLessThanOrEqual(email.length);
      });
    });

    it('should handle realistic subject scenarios', () => {
      const realisticSubjects = [
        'Meeting tomorrow at 2 PM',
        'A'.repeat(150), // Long subject
        'Re: Project update',
        'FW: Important announcement',
        'A'.repeat(50), // Medium subject
        'Test',
      ];

      realisticSubjects.forEach(subject => {
        const result = hook.formatMessageSubject(subject);
        expect(typeof result).toBe('string');
        if (subject.length > 128) {
          expect(result).toMatch(/^.{128}\.\.\.$/);
        } else {
          expect(result).toBe(subject);
        }
      });
    });
  });
});
