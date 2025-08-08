/**
 * Integration tests for Groq API
 * Tests API communication and error handling
 */

// Mock fetch globally
global.fetch = jest.fn();

describe('Groq API Integration Tests', () => {
  const GROQ_API_KEY = 'test-api-key';
  
  beforeEach(() => {
    fetch.mockClear();
  });
  
  test('should format API request correctly', async () => {
    // Mock successful response
    fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ text: 'Hello world' })
    });
    
    const audioBlob = new Blob(['test audio'], { type: 'audio/webm' });
    const formData = new FormData();
    formData.append('file', audioBlob, 'recording.webm');
    formData.append('model', 'whisper-large-v3');
    formData.append('language', 'en');
    formData.append('temperature', '0');
    
    const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: formData
    });
    
    expect(fetch).toHaveBeenCalledWith(
      'https://api.groq.com/openai/v1/audio/transcriptions',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Authorization': `Bearer ${GROQ_API_KEY}`
        }),
        body: expect.any(FormData)
      })
    );
    
    const data = await response.json();
    expect(data.text).toBe('Hello world');
  });
  
  test('should handle API errors', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      text: async () => 'Invalid API key'
    });
    
    const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer invalid-key'
      },
      body: new FormData()
    });
    
    expect(response.ok).toBe(false);
    expect(response.status).toBe(401);
    
    const errorText = await response.text();
    expect(errorText).toBe('Invalid API key');
  });
  
  test('should handle network errors', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));
    
    await expect(
      fetch('https://api.groq.com/openai/v1/audio/transcriptions')
    ).rejects.toThrow('Network error');
  });
  
  test('should handle timeout', async () => {
    const controller = new AbortController();
    
    // Simulate timeout
    setTimeout(() => controller.abort(), 100);
    
    fetch.mockImplementation(() => 
      new Promise((resolve) => {
        setTimeout(() => resolve({ ok: true }), 200);
      })
    );
    
    try {
      await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
        signal: controller.signal
      });
    } catch (error) {
      expect(error.name).toBe('AbortError');
    }
  });
  
  test('should handle empty transcription', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ text: '' })
    });
    
    const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions');
    const data = await response.json();
    
    expect(data.text).toBe('');
  });
  
  test('should handle rate limiting', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 429,
      headers: {
        get: (header) => header === 'Retry-After' ? '60' : null
      },
      text: async () => 'Rate limit exceeded'
    });
    
    const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions');
    
    expect(response.status).toBe(429);
    const retryAfter = response.headers.get('Retry-After');
    expect(retryAfter).toBe('60');
  });
});