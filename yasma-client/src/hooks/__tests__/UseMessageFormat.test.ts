import { renderHook } from '@testing-library/react';
import useMessageFormat from '../UseMessageFormat';
import { Message, MessageHeader, MimeMediaObj } from '@/types/mbox';

// Mock the dependencies
jest.mock('../UseApi', () => ({
  __esModule: true,
  default: () => ({
    getMessageAttachment: jest.fn(),
  }),
}));

jest.mock('../useB64', () => ({
  __esModule: true,
  default: () => ({
    b64ToString: jest.fn((b64: string) => atob(b64)),
  }),
}));

describe('useMessageFormat', () => {
  let hook: ReturnType<typeof useMessageFormat>;

  beforeEach(() => {
    const { result } = renderHook(() => useMessageFormat());
    hook = result.current;
  });

  describe('messageRender', () => {
    it('should return empty string for null/undefined message', async () => {
      const result = await hook.messageRender(null as any, 'msg-123');
      expect(result).toBe('');
    });

    it('should handle simple text/html message', async () => {
      const message: Message = {
        mimeType: 'text/html',
        body: {
          data: btoa('<p>Hello World</p>'),
        },
      };

      const result = await hook.messageRender(message, 'msg-123');

      expect(result).toBe('<p>Hello World</p>');
    });

    it('should handle multipart/mixed messages with text/html parts', async () => {
      const message: Message = {
        mimeType: 'multipart/mixed',
        parts: [
          {
            mimeType: 'text/html',
            body: {
              data: btoa('<p>HTML content</p>'),
            },
          },
        ],
      };

      const result = await hook.messageRender(message, 'msg-123');

      expect(result).toBe('<p>HTML content</p>');
    });

    it('should handle multipart/alternative messages', async () => {
      const message: Message = {
        mimeType: 'multipart/alternative',
        parts: [
          {
            mimeType: 'text/plain',
            body: {
              data: btoa('Plain text content'),
            },
          },
          {
            mimeType: 'text/html',
            body: {
              data: btoa('<p>HTML content</p>'),
            },
          },
        ],
      };

      const result = await hook.messageRender(message, 'msg-123');

      expect(result).toBe('<p>HTML content</p>');
    });

    it('should handle nested multipart messages', async () => {
      const message: Message = {
        mimeType: 'multipart/mixed',
        parts: [
          {
            mimeType: 'multipart/alternative',
            parts: [
              {
                mimeType: 'text/html',
                body: {
                  data: btoa('<p>Nested HTML content</p>'),
                },
              },
            ],
          },
        ],
      };

      const result = await hook.messageRender(message, 'msg-123');

      expect(result).toBe('<p>Nested HTML content</p>');
    });

    it('should handle messages with image attachments', async () => {
      // Mock the getMessageAttachment function
      const mockGetMessageAttachment = require('../UseApi').default().getMessageAttachment;
      mockGetMessageAttachment.mockResolvedValue({
        data: 'base64-image-data',
      });

      const message: Message = {
        mimeType: 'multipart/mixed',
        parts: [
          {
            mimeType: 'text/html',
            body: {
              data: btoa('<img src="cid:image1">'),
            },
          },
          {
            mimeType: 'image/jpeg',
            body: {
              attachmentId: 'att-123',
            },
            headers: [
              {
                name: 'X-Attachment-Id',
                value: 'image1',
              } as MessageHeader,
            ],
          },
        ],
      };

      const result = await hook.messageRender(message, 'msg-123');

      expect(result).toBe('<img src="data:image/jpeg;base64,base64-image-data">');
      expect(mockGetMessageAttachment).toHaveBeenCalledWith('msg-123', 'att-123');
    });

    it('should handle errors gracefully', async () => {
      const message: Message = {
        mimeType: 'text/html',
        body: {
          data: 'invalid-base64',
        },
      };

      const result = await hook.messageRender(message, 'msg-123');

      expect(result).toBe('');
    });

    it('should handle empty parts array', async () => {
      const message: Message = {
        mimeType: 'multipart/mixed',
        parts: [],
      };

      const result = await hook.messageRender(message, 'msg-123');

      expect(result).toBe('');
    });

    it('should handle messages without body data', async () => {
      const message: Message = {
        mimeType: 'text/html',
        body: {},
      };

      const result = await hook.messageRender(message, 'msg-123');

      expect(result).toBe('');
    });

    it('should handle messages with multiple text/html parts', async () => {
      const message: Message = {
        mimeType: 'multipart/mixed',
        parts: [
          {
            mimeType: 'text/html',
            body: {
              data: btoa('<p>First part</p>'),
            },
          },
          {
            mimeType: 'text/html',
            body: {
              data: btoa('<p>Second part</p>'),
            },
          },
        ],
      };

      const result = await hook.messageRender(message, 'msg-123');

      expect(result).toBe('<p>First part</p> <p>Second part</p>');
    });

    it('should handle messages with mixed content types', async () => {
      const message: Message = {
        mimeType: 'multipart/mixed',
        parts: [
          {
            mimeType: 'text/plain',
            body: {
              data: btoa('Plain text content'),
            },
          },
          {
            mimeType: 'text/html',
            body: {
              data: btoa('<p>HTML content</p>'),
            },
          },
          {
            mimeType: 'image/png',
            body: {
              attachmentId: 'att-456',
            },
            headers: [
              {
                name: 'X-Attachment-Id',
                value: 'image2',
              } as MessageHeader,
            ],
          },
        ],
      };

      const result = await hook.messageRender(message, 'msg-123');

      expect(result).toBe('<p>HTML content</p>');
    });

    it('should handle case insensitive MIME type matching', async () => {
      const message: Message = {
        mimeType: 'MULTIPART/MIXED',
        parts: [
          {
            mimeType: 'TEXT/HTML',
            body: {
              data: btoa('<p>Case insensitive test</p>'),
            },
          },
        ],
      };

      const result = await hook.messageRender(message, 'msg-123');

      expect(result).toBe('<p>Case insensitive test</p>');
    });

    it('should handle messages with missing MIME type', async () => {
      const message: Message = {
        body: {
          data: btoa('<p>No MIME type</p>'),
        },
      };

      const result = await hook.messageRender(message, 'msg-123');

      expect(result).toBe('');
    });

    it('should handle messages with empty MIME type', async () => {
      const message: Message = {
        mimeType: '',
        body: {
          data: btoa('<p>Empty MIME type</p>'),
        },
      };

      const result = await hook.messageRender(message, 'msg-123');

      expect(result).toBe('');
    });
  });

  describe('edge cases', () => {
    it('should handle very large messages', async () => {
      const largeHtml = '<p>' + 'A'.repeat(10000) + '</p>';
      const message: Message = {
        mimeType: 'text/html',
        body: {
          data: btoa(largeHtml),
        },
      };

      const result = await hook.messageRender(message, 'msg-123');

      expect(result).toBe(largeHtml);
    });

    it('should handle messages with special characters', async () => {
      const specialHtml = '<p>Special chars: émojis 🚀, unicode 世界</p>';
      const message: Message = {
        mimeType: 'text/html',
        body: {
          data: btoa(specialHtml),
        },
      };

      const result = await hook.messageRender(message, 'msg-123');

      expect(result).toBe(specialHtml);
    });

    it('should handle messages with complex nested structure', async () => {
      const message: Message = {
        mimeType: 'multipart/mixed',
        parts: [
          {
            mimeType: 'multipart/alternative',
            parts: [
              {
                mimeType: 'text/plain',
                body: {
                  data: btoa('Plain text'),
                },
              },
              {
                mimeType: 'text/html',
                body: {
                  data: btoa('<p>HTML version</p>'),
                },
              },
            ],
          },
          {
            mimeType: 'multipart/related',
            parts: [
              {
                mimeType: 'text/html',
                body: {
                  data: btoa('<p>Related HTML</p>'),
                },
              },
            ],
          },
        ],
      };

      const result = await hook.messageRender(message, 'msg-123');

      expect(result).toBe('<p>HTML version</p> <p>Related HTML</p>');
    });
  });
});

