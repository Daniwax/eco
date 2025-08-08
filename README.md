# Eco - Desktop Speech-to-Text Application

<p align="center">
  <img src="build/icon.png" alt="Eco Icon" width="128" height="128">
</p>

<p align="center">
  <strong>A minimalist, always-on-top voice input tool with instant speech-to-text transcription</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#installation">Installation</a> •
  <a href="#usage">Usage</a> •
  <a href="#building-from-source">Build</a> •
  <a href="#contributing">Contributing</a> •
  <a href="#license">License</a>
</p>

---

A lightweight desktop application that transcribes speech to text using Groq's Whisper API and automatically copies the result to your clipboard. Perfect for quick voice notes, dictation, and hands-free text input.

## Features

- 🎤 **One-click recording** - Simple purple floating widget
- 🎯 **Always on top** - Never loses focus or gets hidden
- ⌨️ **Global hotkeys** - F8 to record, F9 to show/hide
- 📋 **Auto-clipboard** - Transcribed text automatically copied
- 🚀 **Fast transcription** - Uses Groq's Whisper Large V3 model
- 💜 **Minimalist design** - Clean, distraction-free interface

## Installation

### Download Pre-built Releases

#### Using the Installer (Recommended)
1. Download `Eco-Setup.exe` from [Releases](https://github.com/YOUR-USERNAME/eco/releases)
2. Run the installer and follow the prompts
3. Launch "Eco" from Start Menu or Desktop

#### Using the Portable Version
1. Download `Eco-Portable.exe` from [Releases](https://github.com/YOUR-USERNAME/eco/releases)
2. Run directly - no installation needed
3. Note: Portable version may show default Electron icon

## Usage

### First-Time Setup
1. Get a free API key from [Groq Console](https://console.groq.com/keys)
2. On first launch, enter your API key when prompted
3. The key is saved locally for future use

### Recording
- **Click the widget** or press **F8** to start/stop recording
- Widget changes colors:
  - 💜 **Purple**: Ready to record
  - 🟠 **Orange**: Recording your voice
  - 🔵 **Blue**: Processing/Transcribing
  - 🟢 **Green**: Success! Text copied to clipboard
  - 🔴 **Red**: Error occurred

### Keyboard Shortcuts
- **F8**: Toggle recording on/off
- **F9**: Show/hide the widget
- **Escape**: Force reset if stuck
- **Ctrl+L**: Open logs folder (for debugging)

### Tips
- Long press (2 seconds) the widget to force reset if needed
- The widget auto-positions in the bottom-right corner
- Transcribed text is automatically copied to clipboard
- Maximum recording time is 30 seconds per session

## Building from Source

### Prerequisites
- Node.js 16 or higher
- npm or yarn
- Windows OS (for Windows build)

### Setup
```bash
# Clone the repository
cd voice-app/electron

# Install dependencies
npm install
```

### Development
```bash
# Run in development mode
npm start
```

### Building Executables
```bash
# Build installer (.exe setup)
npm run build

# Build portable version
npm run build-portable

# Build both versions
npm run build-all
```

Built files will be in the `dist` folder.

## Configuration

### API Key
Your Groq API key is stored locally at:
```
%APPDATA%\eco\Preferences
```

### Logs
Application logs are saved to:
```
%APPDATA%\eco\log-[timestamp].txt
```

## Known Issues

1. **Portable Version Icon**: The portable version may display the default Electron icon instead of the custom icon. This is a known limitation with portable Electron apps on Windows.

2. **Multiple Instances**: Only one instance can run at a time. If the app seems unresponsive, check Task Manager for existing instances.

3. **Microphone Access**: On first run, Windows may prompt for microphone permission. Make sure to allow access.

## Troubleshooting

### App Won't Start
- Check if another instance is running in Task Manager
- Try running as Administrator
- Check Windows Defender or antivirus isn't blocking it

### No Transcription
- Verify your Groq API key is correct
- Check internet connection
- Ensure microphone is working and not muted
- Check logs folder (Ctrl+L) for error details

### Widget Disappeared
- Press F9 to toggle visibility
- Check bottom-right corner of screen
- Look for the app icon in system tray

### Stuck in Blue State
- Press Escape to force reset
- Long-press the widget for 2 seconds
- Restart the application if needed

## Technical Details

- **Framework**: Electron 27
- **Transcription**: Groq Whisper Large V3 API
- **Audio Format**: WebM with Opus codec
- **Languages**: JavaScript, HTML, CSS
- **Platform**: Windows (tested on Windows 10/11)

## Privacy

- All processing is done locally except for the transcription API call
- Your API key is stored locally and never shared
- Audio is not stored permanently - only sent to Groq for transcription
- No telemetry or usage tracking

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

Created by Daniel

## Support

- 🐛 [Report Issues](https://github.com/YOUR-USERNAME/eco/issues)
- 💡 [Request Features](https://github.com/YOUR-USERNAME/eco/issues/new)
- 📖 [Documentation](https://github.com/YOUR-USERNAME/eco/wiki)

## Acknowledgments

- [Groq](https://groq.com) for the Whisper API
- [Electron](https://electronjs.org) for the framework
- [Electron Builder](https://www.electron.build) for packaging

---

<p align="center">
  <strong>Version 1.0.1</strong> | Last Updated: January 2025
</p>

<p align="center">
  Made with 💜 for the community
</p>