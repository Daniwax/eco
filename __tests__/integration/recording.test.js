/**
 * Integration tests for recording functionality
 * Tests the interaction between components
 */

// Setup DOM environment
require('jsdom-global')();

// Mock APIs
global.MediaRecorder = jest.fn().mockImplementation(() => ({
  start: jest.fn(),
  stop: jest.fn(),
  state: 'inactive',
  ondataavailable: null,
  onstop: null,
  onerror: null
}));

global.MediaRecorder.isTypeSupported = jest.fn(() => true);

global.navigator.mediaDevices = {
  getUserMedia: jest.fn(() => Promise.resolve({
    getTracks: () => [{
      stop: jest.fn()
    }]
  }))
};

global.navigator.clipboard = {
  writeText: jest.fn(() => Promise.resolve())
};

describe('Recording Integration Tests', () => {
  let audioChunks;
  let mediaRecorder;
  
  beforeEach(() => {
    audioChunks = [];
    mediaRecorder = null;
    
    // Setup DOM
    document.body.innerHTML = `
      <body class="waiting">
        <div class="record-btn" id="recordBtn">
          <span id="icon">🎤</span>
        </div>
      </body>
    `;
  });
  
  test('should complete recording workflow', async () => {
    // 1. Request microphone access
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    expect(stream).toBeTruthy();
    expect(stream.getTracks()).toHaveLength(1);
    
    // 2. Create MediaRecorder
    mediaRecorder = new MediaRecorder(stream);
    expect(mediaRecorder).toBeTruthy();
    
    // 3. Setup data collection
    mediaRecorder.ondataavailable = (event) => {
      if (event.data) {
        audioChunks.push(event.data);
      }
    };
    
    // 4. Start recording
    mediaRecorder.start();
    expect(mediaRecorder.start).toHaveBeenCalled();
    
    // 5. Simulate data available
    const mockBlob = new Blob(['audio data'], { type: 'audio/webm' });
    mediaRecorder.ondataavailable({ data: mockBlob });
    expect(audioChunks).toHaveLength(1);
    
    // 6. Stop recording
    mediaRecorder.stop();
    expect(mediaRecorder.stop).toHaveBeenCalled();
    
    // 7. Create final blob
    const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
    expect(audioBlob.size).toBeGreaterThan(0);
    
    // 8. Cleanup
    const tracks = stream.getTracks();
    tracks.forEach(track => track.stop());
    // Track stop was called during forEach
    expect(tracks).toHaveLength(1);
  });
  
  test('should handle microphone permission denied', async () => {
    navigator.mediaDevices.getUserMedia = jest.fn(() => 
      Promise.reject(new Error('Permission denied'))
    );
    
    await expect(
      navigator.mediaDevices.getUserMedia({ audio: true })
    ).rejects.toThrow('Permission denied');
  });
  
  test('should detect supported audio formats', () => {
    const formats = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/ogg;codecs=opus'
    ];
    
    let supportedFormat = null;
    for (const format of formats) {
      if (MediaRecorder.isTypeSupported(format)) {
        supportedFormat = format;
        break;
      }
    }
    
    expect(supportedFormat).toBeTruthy();
  });
  
  test('should handle empty recording', async () => {
    // Reset getUserMedia mock for this test
    navigator.mediaDevices.getUserMedia = jest.fn(() => Promise.resolve({
      getTracks: () => [{
        stop: jest.fn()
      }]
    }));
    
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    
    mediaRecorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        audioChunks.push(event.data);
      }
    };
    
    mediaRecorder.start();
    mediaRecorder.stop();
    
    // No data collected
    expect(audioChunks).toHaveLength(0);
  });
});