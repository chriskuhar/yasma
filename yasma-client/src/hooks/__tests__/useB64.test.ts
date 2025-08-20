import { renderHook } from '@testing-library/react';

// Mock the base64-js library before importing the hook
jest.mock('base64-js', () => ({
  __esModule: true,
  default: {
    toByteArray: jest.fn((b64: string) => {
      try {
        return new Uint8Array(Buffer.from(b64, 'base64'));
      } catch {
        throw new Error('Invalid base64');
      }
    }),
    fromByteArray: jest.fn((bytes: Uint8Array) => {
      try {
        return Buffer.from(bytes).toString('base64');
      } catch {
        throw new Error('Invalid bytes');
      }
    }),
  },
}));

// Import the hook after mocking
import useB64 from '../useB64';

describe('useB64', () => {
  let hook: ReturnType<typeof useB64>;

  beforeEach(() => {
    const { result } = renderHook(() => useB64());
    hook = result.current;
  });

  describe('stringToB64', () => {
    it('should encode a simple string to base64', () => {
      const input = 'Hello, World!';
      const expected = 'SGVsbG8sIFdvcmxkIQ==';
      
      const result = hook.stringToB64(input);
      
      expect(result).toBe(expected);
    });

    it('should encode an empty string to base64', () => {
      const input = '';
      const expected = '';
      
      const result = hook.stringToB64(input);
      
      expect(result).toBe(expected);
    });

    it('should encode special characters correctly', () => {
      const input = 'Hello, 世界! 🚀';
      const result = hook.stringToB64(input);
      
      // Should not be empty and should be a valid base64 string
      expect(result).toBeTruthy();
      expect(result).toMatch(/^[A-Za-z0-9+/]*={0,2}$/);
    });

    it('should handle errors gracefully', () => {
      // Mock base64js to throw an error
      const originalFromByteArray = require('base64-js').default.fromByteArray;
      require('base64-js').default.fromByteArray = jest.fn().mockImplementation(() => {
        throw new Error('Test error');
      });

      const result = hook.stringToB64('test');
      
      expect(result).toBe('');
      
      // Restore original function
      require('base64-js').default.fromByteArray = originalFromByteArray;
    });
  });

  describe('b64ToString', () => {
    it('should decode a base64 string to original text', () => {
      const input = 'SGVsbG8sIFdvcmxkIQ==';
      const expected = 'Hello, World!';
      
      const result = hook.b64ToString(input);
      
      expect(result).toBe(expected);
    });

    it('should return null for invalid base64 string', () => {
      const input = 'invalid-base64!@#';
      
      const result = hook.b64ToString(input);
      
      expect(result).toBeNull();
    });

    it('should return null for empty string', () => {
      const input = '';
      
      const result = hook.b64ToString(input);
      
      expect(result).toBeNull();
    });

    it('should decode special characters correctly', () => {
      const original = 'Hello, 世界! 🚀';
      const encoded = hook.stringToB64(original);
      const decoded = hook.b64ToString(encoded);
      
      expect(decoded).toBe(original);
    });

    it('should handle errors gracefully', () => {
      // Mock base64js to throw an error
      const originalToByteArray = require('base64-js').default.toByteArray;
      require('base64-js').default.toByteArray = jest.fn().mockImplementation(() => {
        throw new Error('Test error');
      });

      const result = hook.b64ToString('test');
      
      expect(result).toBeNull();
      
      // Restore original function
      require('base64-js').default.toByteArray = originalToByteArray;
    });
  });

  describe('round-trip encoding/decoding', () => {
    it('should maintain data integrity through encode/decode cycle', () => {
      const testCases = [
        'Simple text',
        'Text with numbers 123',
        'Special chars: !@#$%^&*()',
        'Unicode: 世界, 🌍, 🚀',
        'Multi-line\ntext\nwith\nbreaks',
        '',
      ];

      testCases.forEach(testCase => {
        const encoded = hook.stringToB64(testCase);
        const decoded = hook.b64ToString(encoded);
        expect(decoded).toBe(testCase);
      });
    });
  });
});

