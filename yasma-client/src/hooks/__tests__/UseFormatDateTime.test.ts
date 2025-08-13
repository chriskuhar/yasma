import { renderHook } from '@testing-library/react';
import useFormatDateTime from '../UseFormatDateTime';

describe('useFormatDateTime', () => {
  let hook: ReturnType<typeof useFormatDateTime>;

  beforeEach(() => {
    const { result } = renderHook(() => useFormatDateTime());
    hook = result.current;
  });

  describe('formatDateTime', () => {
    it('should return empty string for null/undefined timestamp', () => {
      expect(hook.formatDateTime('')).toBe('');
      expect(hook.formatDateTime(null as any)).toBe('');
      expect(hook.formatDateTime(undefined as any)).toBe('');
    });

    it('should format today\'s date with time only', () => {
      const today = new Date();
      const timestamp = today.toISOString();
      
      const result = hook.formatDateTime(timestamp);
      
      // Should match time format like "2:30 PM"
      expect(result).toMatch(/^\d{1,2}:\d{2}\s(AM|PM)$/);
    });

    it('should format non-today date with full date and time', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const timestamp = yesterday.toISOString();
      
      const result = hook.formatDateTime(timestamp);
      
      // Should match format like "12/25/2023, 2:30 PM"
      expect(result).toMatch(/^\d{1,2}\/\d{1,2}\/\d{4},\s\d{1,2}:\d{2}\s(AM|PM)$/);
    });

    it('should handle different time formats correctly', () => {
      const testCases = [
        {
          date: new Date('2023-12-25T10:30:00Z'),
          expectedPattern: /^\d{1,2}\/\d{1,2}\/\d{4},\s\d{1,2}:\d{2}\s(AM|PM)$/
        },
        {
          date: new Date('2023-12-25T22:45:00Z'),
          expectedPattern: /^\d{1,2}\/\d{1,2}\/\d{4},\s\d{1,2}:\d{2}\s(AM|PM)$/
        },
        {
          date: new Date('2023-12-25T00:00:00Z'),
          expectedPattern: /^\d{1,2}\/\d{1,2}\/\d{4},\s\d{1,2}:\d{2}\s(AM|PM)$/
        }
      ];

      testCases.forEach(({ date, expectedPattern }) => {
        const result = hook.formatDateTime(date.toISOString());
        expect(result).toMatch(expectedPattern);
      });
    });

    it('should handle edge cases around midnight', () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const timestamp = today.toISOString();
      
      const result = hook.formatDateTime(timestamp);
      
      // Should still be today, so time format
      expect(result).toMatch(/^\d{1,2}:\d{2}\s(AM|PM)$/);
    });

    it('should handle invalid date strings gracefully', () => {
      const invalidDates = [
        'invalid-date',
        '2023-13-45T25:70:99Z',
        'not-a-date-at-all'
      ];

      invalidDates.forEach(invalidDate => {
        const result = hook.formatDateTime(invalidDate);
        // Should return empty string or handle gracefully
        expect(typeof result).toBe('string');
      });
    });

    it('should format dates in different timezones correctly', () => {
      const utcDate = new Date('2023-12-25T15:30:00Z');
      const timestamp = utcDate.toISOString();
      
      const result = hook.formatDateTime(timestamp);
      
      // Should be a valid date format
      expect(result).toMatch(/^(\d{1,2}:\d{2}\s(AM|PM)|\d{1,2}\/\d{1,2}\/\d{4},\s\d{1,2}:\d{2}\s(AM|PM))$/);
    });
  });

  describe('date comparison logic', () => {
    it('should correctly identify today vs other days', () => {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      
      const todayResult = hook.formatDateTime(today.toISOString());
      const yesterdayResult = hook.formatDateTime(yesterday.toISOString());
      
      // Today should show time only, yesterday should show full date
      expect(todayResult).toMatch(/^\d{1,2}:\d{2}\s(AM|PM)$/);
      expect(yesterdayResult).toMatch(/^\d{1,2}\/\d{1,2}\/\d{4},\s\d{1,2}:\d{2}\s(AM|PM)$/);
    });
  });
});

