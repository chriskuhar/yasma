import { renderHook } from '@testing-library/react';
import useApi from '../UseApi';

// Mock the useB64 hook
jest.mock('../useB64', () => ({
  __esModule: true,
  default: () => ({
    stringToB64: jest.fn((str: string) => btoa(str)),
    b64ToString: jest.fn((b64: string) => atob(b64)),
  }),
}));

describe('useApi', () => {
  let hook: ReturnType<typeof useApi>;
  let mockFetch: jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    const { result } = renderHook(() => useApi());
    hook = result.current;
    
    // Reset fetch mock
    mockFetch = fetch as jest.MockedFunction<typeof fetch>;
    mockFetch.mockClear();
  });

  afterEach(() => {
    // Clear sessionStorage
    sessionStorage.clear();
  });

  describe('testApi', () => {
    it('should make a GET request to test endpoint', async () => {
      const mockResponse = { data: 'test data', error: null };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await hook.testApi();

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/testRedisKey',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle API errors gracefully', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await hook.testApi();

      expect(result).toEqual({
        data: null,
        error: 'Unknown error occurred.',
      });
    });
  });

  describe('authenticate', () => {
    it('should make a POST request with email and password', async () => {
      const mockResponse = { data: { token: 'test-token' }, error: null };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await hook.authenticate('test@example.com', 'password123');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/auth',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ email: 'test@example.com', password: 'password123' }),
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      );
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('validateGoogleCode', () => {
    it('should return true and store token when validation succeeds', async () => {
      const mockResponse = {
        data: { data: { token: 'google-token-123' } },
        error: null,
      };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await hook.validateGoogleCode('google-code-123');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/google-validate-code',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ code: 'google-code-123' }),
        })
      );
      expect(result).toBe(true);
      expect(sessionStorage.setItem).toHaveBeenCalledWith('token', 'google-token-123');
    });

    it('should return false when validation fails', async () => {
      const mockResponse = { data: { data: {} }, error: null };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await hook.validateGoogleCode('invalid-code');

      expect(result).toBe(false);
      expect(sessionStorage.setItem).not.toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('should remove token from sessionStorage', () => {
      hook.logout();

      expect(sessionStorage.removeItem).toHaveBeenCalledWith('token');
    });
  });

  describe('signup', () => {
    it('should make a POST request with user data', async () => {
      const mockResponse = { data: { userId: '123' }, error: null };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const userData = {
        email: 'new@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      };

      const result = await hook.signup(userData);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/auth/signup',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(userData),
        })
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('listMbox', () => {
    it('should make a GET request to list mailboxes', async () => {
      const mockResponse = { data: [{ id: '1', name: 'Inbox' }], error: null };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await hook.listMbox();

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/mbox/list',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Authorization': expect.stringContaining('Bearer'),
          }),
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('should return error result when API call fails', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await hook.listMbox();

      expect(result).toEqual({
        data: null,
        error: 'Unknown error occurred.',
      });
    });
  });

  describe('isAuthenticated', () => {
    it('should return token when user is authenticated', () => {
      const token = 'test-token-123';
      (sessionStorage.getItem as jest.Mock).mockReturnValue(token);

      const result = hook.isAuthenticated();

      expect(sessionStorage.getItem).toHaveBeenCalledWith('token');
      expect(result).toBe(token);
    });

    it('should return false when no token exists', () => {
      (sessionStorage.getItem as jest.Mock).mockReturnValue(null);

      const result = hook.isAuthenticated();

      expect(result).toBe(false);
    });
  });

  describe('listMessages', () => {
    it('should make a GET request with mailbox and optional page token', async () => {
      const mockResponse = { data: [{ id: '1', subject: 'Test' }], error: null };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await hook.listMessages('inbox', 'page-token-123');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/mbox/messages?mbox=inbox&nextPageToken=page-token-123',
        expect.objectContaining({
          method: 'GET',
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('should make request without page token when not provided', async () => {
      const mockResponse = { data: [{ id: '1', subject: 'Test' }], error: null };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      await hook.listMessages('inbox', null);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/mbox/messages?mbox=inbox',
        expect.any(Object)
      );
    });
  });

  describe('getMessage', () => {
    it('should make a GET request for specific message', async () => {
      const mockMessage = { id: 'msg-123', subject: 'Test Message' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockMessage }),
      } as Response);

      const result = await hook.getMessage('msg-123');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/mbox/message/msg-123',
        expect.objectContaining({
          method: 'GET',
        })
      );
      expect(result).toEqual(mockMessage);
    });

    it('should return empty object when API call fails', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await hook.getMessage('msg-123');

      expect(result).toEqual({});
    });
  });

  describe('getMessageAttachment', () => {
    it('should make a GET request for message attachment', async () => {
      const mockAttachment = { id: 'att-123', filename: 'test.pdf' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockAttachment }),
      } as Response);

      const result = await hook.getMessageAttachment('msg-123', 'att-123');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/mbox/message/msg-123/att-123',
        expect.objectContaining({
          method: 'GET',
        })
      );
      expect(result).toEqual(mockAttachment);
    });
  });

  describe('deleteMessage', () => {
    it('should make a DELETE request for message', async () => {
      const mockResponse = { id: 'msg-123', deleted: true };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockResponse }),
      } as Response);

      const result = await hook.deleteMessage('msg-123');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/mbox/message/msg-123',
        expect.objectContaining({
          method: 'DELETE',
        })
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('newMessage', () => {
    it('should make a POST request to create new message', async () => {
      const mockResponse = { messageId: 'new-msg-123' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: mockResponse }),
      } as Response);

      const result = await hook.newMessage('Message content', 'recipient@example.com', 'Test Subject');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/mbox/message',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            message: 'Message content',
            recipient: 'recipient@example.com',
            subject: 'Test Subject',
          }),
        })
      );
      expect(result).toBe('new-msg-123');
    });
  });

  describe('googleAuthenticate', () => {
    it('should make a POST request for Google authentication', async () => {
      const mockResponse = { data: { token: 'google-token' }, error: null };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await hook.googleAuthenticate('test@example.com', 'password123');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/google-auth',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ email: 'test@example.com', password: 'password123' }),
        })
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('API error handling', () => {
    it('should handle network errors consistently', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      const results = await Promise.all([
        hook.testApi(),
        hook.listMbox(),
        hook.getMessage('msg-123'),
      ]);

      results.forEach(result => {
        if ('error' in result) {
          expect(result.error).toBe('Unknown error occurred.');
        }
      });
    });

    it('should handle non-OK responses', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({ error: 'Internal server error' }),
      } as Response);

      const result = await hook.testApi();

      expect(result).toEqual({
        data: null,
        error: 'Unknown error occurred.',
      });
    });
  });
});

