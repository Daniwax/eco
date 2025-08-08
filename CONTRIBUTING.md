# Contributing to Voice Recorder

Thank you for your interest in contributing to Voice Recorder! This document provides guidelines and instructions for contributing.

## How to Contribute

### Reporting Issues

1. **Check existing issues** first to avoid duplicates
2. Use the issue template if available
3. Include:
   - Your operating system and version
   - Steps to reproduce the issue
   - Expected vs actual behavior
   - Screenshots if applicable
   - Log files from `%APPDATA%\voice-recorder\` if relevant

### Suggesting Features

1. Open an issue with `[Feature Request]` in the title
2. Describe the feature and its use case
3. Explain why it would benefit users

### Code Contributions

#### Setting Up Development Environment

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR-USERNAME/voice-recorder.git
   cd voice-recorder/electron
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Set up your Groq API key:
   - Get a key from [Groq Console](https://console.groq.com/keys)
   - Add it to `recorder.html` line 158

5. Run in development:
   ```bash
   npm start
   ```

#### Development Guidelines

- **Code Style**: Follow the existing code style
- **No Console Logs**: Remove all `console.log` statements before submitting
- **Test Your Changes**: Ensure the app builds and runs correctly
- **Small PRs**: Keep pull requests focused on a single feature/fix

#### Building

```bash
# Build installer
npm run build

# Build portable
npm run build-portable

# Build both
npm run build-all
```

### Pull Request Process

1. Create a new branch for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit:
   ```bash
   git add .
   git commit -m "Add: your feature description"
   ```

3. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

4. Open a Pull Request with:
   - Clear title and description
   - Reference any related issues
   - Screenshots/GIFs of UI changes
   - Test results

## Code Structure

```
electron/
├── main.cjs          # Electron main process
├── preload.cjs       # IPC bridge
├── recorder.html     # UI and recording logic
├── simple-logger.cjs # File logging utility
└── build/           # Icons and resources
```

### Key Components

- **Recording Logic**: `recorder.html` lines 283-381
- **Transcription**: `recorder.html` lines 423-526
- **State Management**: `recorder.html` lines 219-264
- **Global Hotkeys**: `main.cjs` lines 212-243
- **Window Management**: `main.cjs` lines 68-154

## Testing Checklist

Before submitting a PR, ensure:

- [ ] App launches without errors
- [ ] Recording starts/stops with click and F8
- [ ] Transcription works with valid API key
- [ ] Text copies to clipboard
- [ ] Window stays on top
- [ ] F9 shows/hides window
- [ ] Icons display correctly
- [ ] Both installer and portable build successfully

## Need Help?

- Open an issue for questions
- Check existing documentation in README.md
- Review closed issues for solutions

## License

By contributing, you agree that your contributions will be licensed under the MIT License.