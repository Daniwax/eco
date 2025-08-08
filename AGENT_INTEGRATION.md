# Eco - Agent Integration Guide

## For AI Agents and Automated Systems

This document provides structured instructions for AI agents to understand, deploy, and utilize the Eco application.

## Quick Agent Summary

```yaml
application_name: Eco
version: 1.0.1
purpose: Convert speech to text via system-wide hotkey
primary_use_case: Hands-free text input for AI interactions
platform: Windows 10/11
api_dependency: Groq Whisper API
output: Clipboard text
hotkey: F8
```

## Automated Installation Instructions

### Prerequisites Check
```bash
# Check Windows version
systeminfo | findstr /B /C:"OS Name"

# Check Node.js (if building from source)
node --version  # Required: v16+

# Check available disk space
wmic logicaldisk get size,freespace,caption  # Required: 200MB
```

### Option 1: Install Pre-built (Recommended for Agents)
```bash
# Download installer
curl -L -o Eco-Setup.exe https://github.com/YOUR-USERNAME/eco/releases/latest/download/Eco-Setup.exe

# Silent install (no user interaction)
Eco-Setup.exe /S /D=C:\Program Files\Eco

# Verify installation
if exist "C:\Program Files\Eco\Eco.exe" (echo INSTALLED) else (echo FAILED)
```

### Option 2: Portable Deployment
```bash
# Download portable version
curl -L -o Eco-Portable.exe https://github.com/YOUR-USERNAME/eco/releases/latest/download/Eco-Portable.exe

# Place in tools directory
move VoiceRecorder-Portable.exe C:\Tools\

# Create startup shortcut (optional)
powershell "$s=(New-Object -COM WScript.Shell).CreateShortcut('%userprofile%\Start Menu\Programs\Startup\VoiceRecorder.lnk');$s.TargetPath='C:\Tools\VoiceRecorder-Portable.exe';$s.Save()"
```

## API Key Configuration

### Automated Setup
```javascript
// Location: %APPDATA%\voice-recorder\config.json
{
  "groq_api_key": "YOUR_GROQ_API_KEY",
  "auto_start": true,
  "minimize_to_tray": true
}
```

### Obtaining API Key Programmatically
```python
# Example: Automated Groq API key retrieval
import requests
from selenium import webdriver

def get_groq_api_key(email, password):
    """
    Note: Implement proper authentication flow
    Visit: https://console.groq.com/keys
    """
    # Implementation depends on Groq's auth system
    pass
```

## Integration with Claude Code

### Primary Use Case: Voice Input for Claude Code

```markdown
## Workflow for Claude Code Users

1. **Install Voice Recorder** on Windows machine
2. **Configure Groq API key** (one-time setup)
3. **Usage Pattern**:
   - Press F8 to start recording
   - Speak your code requirements/ideas
   - Press F8 to stop
   - Text automatically copied to clipboard
   - Paste (Ctrl+V) into Claude Code chat

## Example Voice Commands for Claude Code:

"Create a Python function that calculates fibonacci numbers with memoization"
→ Instantly in clipboard → Paste to Claude Code

"Refactor this code to use async await instead of promises"
→ Transcribed → Ready for Claude Code

"Add error handling and logging to the database connection function"
→ Voice to text → Direct to Claude Code
```

## Programmatic Control

### Starting the Application
```python
import subprocess
import time
import pyperclip  # pip install pyperclip

class VoiceRecorderController:
    def __init__(self, exe_path="C:\\Program Files\\VoiceRecorder\\VoiceRecorder.exe"):
        self.exe_path = exe_path
        self.process = None
    
    def start(self):
        """Launch Voice Recorder"""
        self.process = subprocess.Popen([self.exe_path])
        time.sleep(2)  # Wait for initialization
        return self.process.pid
    
    def trigger_recording(self):
        """Simulate F8 keypress to start/stop recording"""
        import keyboard  # pip install keyboard
        keyboard.press_and_release('f8')
    
    def get_transcription(self, record_duration=5):
        """Record for specified duration and return text"""
        # Clear clipboard
        pyperclip.copy("")
        
        # Start recording
        self.trigger_recording()
        time.sleep(record_duration)
        
        # Stop recording
        self.trigger_recording()
        time.sleep(2)  # Wait for transcription
        
        # Get result from clipboard
        return pyperclip.paste()
    
    def voice_to_command(self, duration=5):
        """Convert voice to executable command"""
        text = self.get_transcription(duration)
        return {
            "raw_text": text,
            "command": text.strip(),
            "timestamp": time.time()
        }
```

## System Integration Points

### 1. Clipboard Monitoring
```python
def monitor_clipboard_for_voice():
    """Monitor clipboard for voice transcriptions"""
    import win32clipboard
    last_text = ""
    
    while True:
        win32clipboard.OpenClipboard()
        try:
            current_text = win32clipboard.GetClipboardData()
            if current_text != last_text:
                # New transcription detected
                process_voice_input(current_text)
                last_text = current_text
        finally:
            win32clipboard.CloseClipboard()
        time.sleep(0.5)
```

### 2. Hotkey Integration
```python
# Global hotkey detection
import keyboard

def setup_voice_shortcuts():
    # F8 is already used by Voice Recorder
    # Add complementary shortcuts
    keyboard.add_hotkey('f7', lambda: prepare_for_voice_input())
    keyboard.add_hotkey('f9', lambda: process_last_transcription())
```

### 3. Log File Analysis
```python
def parse_voice_recorder_logs():
    """Extract transcription history from logs"""
    log_path = os.path.expandvars(r"%APPDATA%\voice-recorder\log-*.txt")
    
    transcriptions = []
    for log_file in glob.glob(log_path):
        with open(log_file, 'r') as f:
            for line in f:
                if "Transcription text:" in line:
                    text = line.split("Transcription text:")[1].strip()
                    transcriptions.append(text)
    
    return transcriptions
```

## Performance Metrics

```yaml
startup_time: <3 seconds
transcription_latency: 1-2 seconds
memory_usage: 50-80 MB
cpu_idle: <1%
cpu_recording: 5-10%
network_usage: Minimal (only during transcription)
accuracy: 95%+ (Whisper Large V3)
```

## Error Handling for Agents

```python
class VoiceRecorderError(Exception):
    pass

def handle_voice_recorder_errors():
    """Common error patterns and solutions"""
    
    ERROR_SOLUTIONS = {
        "API_KEY_INVALID": "Update Groq API key in %APPDATA%\\voice-recorder\\config.json",
        "MIC_ACCESS_DENIED": "Grant microphone permissions in Windows Settings",
        "PROCESS_NOT_FOUND": "Restart VoiceRecorder.exe",
        "CLIPBOARD_EMPTY": "Retry recording, check microphone input",
        "NETWORK_ERROR": "Check internet connection for Groq API"
    }
    
    return ERROR_SOLUTIONS
```

## Automation Recipes

### 1. Voice-Driven Code Generation
```bash
# Chain Voice Recorder with Claude Code
while true; do
    # Wait for F8 press (recording)
    # Get clipboard content
    # Send to Claude Code API
    # Execute generated code
done
```

### 2. Meeting Transcription
```python
def transcribe_meeting(duration_minutes=60):
    """Record and transcribe long-form audio"""
    chunks = []
    chunk_duration = 30  # seconds (max recording time)
    
    for i in range(duration_minutes * 2):  # 30-second chunks
        chunk = voice_recorder.get_transcription(chunk_duration)
        chunks.append(chunk)
        time.sleep(1)  # Brief pause between recordings
    
    return " ".join(chunks)
```

### 3. Voice Command System
```python
VOICE_COMMANDS = {
    "open browser": "start chrome",
    "check email": "start outlook",
    "run tests": "npm test",
    "build project": "npm run build",
    "commit changes": "git commit -m",
}

def execute_voice_command():
    text = get_voice_input()
    for phrase, command in VOICE_COMMANDS.items():
        if phrase in text.lower():
            os.system(command)
            break
```

## Testing Automation

```python
def automated_test_suite():
    """Verify Voice Recorder functionality"""
    
    tests = []
    
    # Test 1: Application starts
    tests.append(check_process_running("VoiceRecorder.exe"))
    
    # Test 2: Hotkey responds
    tests.append(test_hotkey_response())
    
    # Test 3: Clipboard receives data
    tests.append(test_clipboard_output())
    
    # Test 4: API connectivity
    tests.append(test_groq_api_connection())
    
    return all(tests)
```

## Resource Cleanup

```bash
# Kill all Voice Recorder processes
powershell "Get-Process VoiceRecorder | Stop-Process -Force"

# Clean logs older than 7 days
forfiles /p "%APPDATA%\voice-recorder" /m log-*.txt /d -7 /c "cmd /c del @path"

# Remove configuration
del "%APPDATA%\voice-recorder\config.json"
```

## Agent Communication Protocol

```json
{
  "agent_request": {
    "action": "transcribe",
    "duration": 10,
    "language": "en",
    "return_format": "clipboard"
  },
  "expected_response": {
    "status": "success",
    "text": "transcribed content",
    "confidence": 0.95,
    "duration_ms": 10000
  }
}
```

## Integration Priority Matrix

| Use Case | Priority | Complexity | Value |
|----------|----------|------------|-------|
| Claude Code Input | HIGH | LOW | HIGH |
| Meeting Notes | MEDIUM | MEDIUM | HIGH |
| Code Comments | HIGH | LOW | MEDIUM |
| Documentation | MEDIUM | LOW | HIGH |
| Command Execution | LOW | HIGH | MEDIUM |

---

**For Agents:** This application is optimized for hands-free text input into AI systems. Primary value: Converting human speech to text for LLM consumption without manual typing.