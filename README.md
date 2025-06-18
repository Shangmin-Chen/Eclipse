# Eclipse

**Turn any repetitive web task into automated code with zero setup.**

Eclipse is an intelligent browser extension that watches you perform web tasks once, then automatically generates clean automation scripts you can run forever. No more spending hours reverse-engineering APIs or writing brittle Selenium scripts.

## The Problem

Automating web workflows today is painful:
- ✗ Hours spent analyzing network traffic to find the right API endpoints
- ✗ Dealing with authentication tokens, CSRF protection, and session management
- ✗ Brittle scripts that break when websites change
- ✗ Non-technical users completely locked out of automation

## The Solution

1. **Record**: Install our browser extension and perform your task normally
2. **Analyze**: Our AI filters network traffic to identify essential API calls
3. **Generate**: Get clean, runnable automation code in Python or JavaScript
4. **Execute**: Run your automation script anywhere, anytime

## Key Features

- 🎯 **Smart API Detection** - Filters out analytics noise to find the endpoints that matter
- 🔐 **Authentication Handling** - Automatically manages cookies, tokens, and session state
- 🧠 **AI-Powered Code Generation** - Creates clean, maintainable automation scripts
- 🔄 **Error Recovery** - Built-in retry logic and failure handling
- 🚀 **Zero Setup** - Works with any website, no configuration required

## Use Cases

- **Students**: Automate class registration, grade checking, assignment submissions
- **Job Seekers**: Bulk apply to positions, track application status
- **E-commerce**: Monitor prices, restock notifications, bulk ordering
- **Customer Service**: Automate routine account management tasks
- **Data Collection**: Gather information from multiple sources systematically

## Quick Start

### 1. Install the Extension
```bash
# Chrome Web Store (coming soon)
# Or install from source:
git clone https://github.com/Shangmin-Chen/Eclipse
cd Eclipse
npm install
npm run build
# Load unpacked extension in Chrome
```

### 2. Record Your Workflow
1. Click the Eclipse extension icon
2. Hit "Start Recording"
3. Perform your task normally in the browser
4. Click "Stop Recording" when done

### 3. Generate Automation Code
```python
# Example generated code for class registration
import requests
from webflow_recorder import WebFlowSession

session = WebFlowSession()
session.login("portal.university.edu", username="your_username", password="your_password")

# Search for available classes
classes = session.search_classes(
    term="Fall 2024",
    subject="Computer Science",
    course_number="CS101"
)

# Register for open classes
for class_info in classes:
    if class_info['seats_available'] > 0:
        result = session.register_for_class(class_info['class_id'])
        print(f"Registered for {class_info['name']}: {result}")
```

### 4. Schedule and Run
```bash
# Run once
python my_automation.py

# Or schedule with cron
crontab -e
# Add: 0 8 * * * python /path/to/my_automation.py
```

## How It Works

### Recording Phase
- Browser extension captures all network requests during user interaction
- Records DOM events (clicks, form submissions, navigation)
- Stores authentication tokens and session data securely

### Analysis Phase
- AI classifier identifies functional API calls vs. tracking/analytics
- Maps user actions to corresponding backend requests
- Extracts authentication patterns and required headers
- Detects rate limiting and pagination patterns

### Generation Phase
- Creates clean, readable automation scripts
- Handles authentication, session management, and error recovery
- Generates both one-time scripts and reusable automation functions
- Provides scheduling and monitoring capabilities

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Extension**: Chrome Extension API, Manifest V3
- **Backend**: Node.js, Express, PostgreSQL
- **AI/ML**: OpenAI GPT-4, custom classification models
- **Automation**: Playwright, Puppeteer, Python requests

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup
```bash
git clone https://github.com/Shangmin-Chen/Eclipse
cd Eclipse
npm install

# Start development server
npm run dev

# Build extension
npm run build:extension

# Run tests
npm test
```

## Roadmap

- [ ] **Q1 2025**: Chrome extension MVP with basic recording
- [ ] **Q2 2025**: AI-powered code generation and filtering
- [ ] **Q3 2025**: Python and JavaScript output support
- [ ] **Q4 2025**: Scheduling, monitoring, and team collaboration features
- [ ] **2026**: Firefox and Safari extensions, enterprise features

## Security & Privacy

- All recorded data stays local until you choose to generate code
- We never store your passwords or sensitive authentication data
- Generated scripts use secure token management practices
- Optional cloud sync with end-to-end encryption

## Support

- 📧 Email: support@ place holder for now
- 💬 Discord: [Join our community](https://discord.gg/ place holder)
- 📖 Documentation: [docs.webflowrecorder.com](https://docs. place holder .com)
- 🐛 Issues: [GitHub Issues](https://github.com/Shangmin-Chen/Eclipse/issues)

## Topic and Tags
automation, browser-extension, web-scraping, ai, workflow-automation, python, javascript, selenium, api-automation, productivity, chrome-extension, no-code, rpa

## License

MIT License - see [LICENSE](LICENSE) file for details.

---

**Made with ❤️ for everyone who's tired of doing the same web tasks over and over again.**

# Chrome Extension Template

A comprehensive, production-ready template for creating Chrome extensions with modern features and best practices.

## Features

- **Manifest V3** - Latest Chrome extension manifest version
- **Modern UI** - Clean, responsive popup interface
- **Background Service Worker** - Handles extension lifecycle and background tasks
- **Content Scripts** - Interacts with web pages
- **Settings Management** - Persistent storage with Chrome sync
- **Context Menus** - Right-click menu integration
- **Keyboard Shortcuts** - Custom hotkeys support
- **Theme Support** - Light/dark theme switching
- **Auto-run Features** - Automatic execution on page load
- **Page Information** - Detailed page analysis
- **Modern CSS** - Responsive design with animations
- **Error Handling** - Comprehensive error management
- **TypeScript Ready** - Easy to convert to TypeScript

## File Structure

```
chrome-extension-template/
├── manifest.json          # Extension manifest (Manifest V3)
├── popup.html            # Popup interface
├── popup.css             # Popup styles
├── popup.js              # Popup functionality
├── background.js         # Background service worker
├── content.js            # Content script
├── content.css           # Content script styles
├── icons/                # Extension icons
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   └── icon128.png
├── package.json          # Project configuration
└── README.md            # This file
```

## Quick Start

### 1. Clone or Download

```bash
git clone https://github.com/yourusername/chrome-extension-template.git
cd chrome-extension-template
```

### 2. Create Icons

Add your extension icons to the `icons/` directory:
- `icon16.png` (16x16)
- `icon32.png` (32x32)
- `icon48.png` (48x48)
- `icon128.png` (128x128)

### 3. Customize

1. **Update `manifest.json`**:
   - Change `name`, `description`, and `version`
   - Modify permissions as needed
   - Update icon paths

2. **Customize popup** (`popup.html`, `popup.css`, `popup.js`):
   - Modify UI elements
   - Add your extension's features
   - Update styling

3. **Implement features** (`content.js`, `background.js`):
   - Add your extension's core functionality
   - Handle user interactions
   - Process page data

### 4. Load in Chrome

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (top right)
3. Click "Load unpacked"
4. Select your extension directory

### 5. Test

- Click the extension icon in the toolbar
- Test features on different websites
- Check the browser console for logs
- Verify settings persistence

## Development

### Available Scripts

```bash
# Install dependencies
npm install

# Build extension
npm run build

# Package for distribution
npm run package

# Clean build artifacts
npm run clean
```

### Development Workflow

1. **Make changes** to your extension files
2. **Reload extension** in `chrome://extensions/`
3. **Test functionality** on target websites
4. **Debug** using Chrome DevTools
5. **Iterate** and repeat

### Debugging

- **Popup**: Right-click extension icon → "Inspect popup"
- **Background**: Go to `chrome://extensions/` → Click "service worker" link
- **Content Scripts**: Use regular DevTools on the target page

## Configuration

### Permissions

The template includes common permissions. Modify `manifest.json` as needed:

```json
{
  "permissions": [
    "activeTab",      // Access current tab
    "storage",        // Store settings
    "scripting"       // Inject scripts
  ],
  "host_permissions": [
    "http://*/*",     // HTTP sites
    "https://*/*"     // HTTPS sites
  ]
}
```

### Settings

Default settings are configured in `background.js`:

```javascript
const defaultSettings = {
  autoRun: false,        // Auto-run on page load
  theme: 'light',        // UI theme
  featureEnabled: false, // Main feature toggle
  notifications: true    // Show notifications
};
```

## Features Explained

### Popup Interface

The popup provides a clean, modern interface with:
- **Quick Actions**: Toggle features and get page info
- **Settings Panel**: Configure extension behavior
- **Status Indicator**: Visual feedback on extension state
- **Responsive Design**: Works on different screen sizes

### Background Service Worker

Handles extension lifecycle:
- **Installation/Update**: Sets up default settings
- **Message Routing**: Communicates between components
- **Tab Management**: Monitors page loads and changes
- **Context Menus**: Provides right-click options

### Content Script

Interacts with web pages:
- **DOM Manipulation**: Modifies page content
- **Event Handling**: Responds to user actions
- **Data Collection**: Gathers page information
- **Visual Feedback**: Shows extension status

### Settings Management

Persistent storage using Chrome sync:
- **Cross-device sync**: Settings sync across devices
- **Automatic backup**: No data loss
- **Real-time updates**: Changes apply immediately

## Customization Guide

### Adding New Features

1. **Define the feature** in `popup.js`
2. **Implement logic** in `content.js` or `background.js`
3. **Add UI elements** to `popup.html`
4. **Style components** in `popup.css` or `content.css`
5. **Update permissions** in `manifest.json` if needed

### Styling

The template uses modern CSS with:
- **CSS Grid/Flexbox**: Responsive layouts
- **CSS Variables**: Easy theming
- **Animations**: Smooth transitions
- **Media Queries**: Mobile-friendly design

### Message Passing

Components communicate via Chrome's message API:

```javascript
// Send message
chrome.runtime.sendMessage({ action: 'myAction', data: myData });

// Listen for messages
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'myAction') {
    // Handle message
    sendResponse({ success: true });
  }
});
```

## Publishing

### Chrome Web Store

1. **Package extension**: `npm run package`
2. **Create developer account**: [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole/)
3. **Upload extension**: Submit your `.zip` file
4. **Provide details**: Description, screenshots, privacy policy
5. **Submit for review**: Wait for approval

### Distribution

- **Chrome Web Store**: Recommended for public distribution
- **Direct installation**: `.crx` files for private distribution
- **Enterprise**: Group policy deployment

## Best Practices

### Security

- **Minimize permissions**: Only request necessary permissions
- **Validate input**: Sanitize user data
- **Use HTTPS**: For external API calls
- **Content Security Policy**: Follow CSP guidelines

### Performance

- **Lazy loading**: Load resources when needed
- **Efficient DOM queries**: Cache selectors
- **Memory management**: Clean up event listeners
- **Background optimization**: Minimize background script usage

### User Experience

- **Clear feedback**: Show operation status
- **Intuitive interface**: Easy to understand and use
- **Accessibility**: Support screen readers
- **Error handling**: Graceful failure recovery

## Troubleshooting

### Common Issues

1. **Extension not loading**:
   - Check `manifest.json` syntax
   - Verify file paths
   - Check browser console for errors

2. **Permissions denied**:
   - Review requested permissions
   - Test on different sites
   - Check manifest configuration

3. **Content script not working**:
   - Verify `matches` patterns in manifest
   - Check for JavaScript errors
   - Test on simple HTML pages

### Debug Tips

- Use `console.log()` for debugging
- Check Chrome's extension page for errors
- Test on different websites
- Verify manifest V3 compatibility

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/chrome-extension-template/issues)
- **Documentation**: [Chrome Extension Documentation](https://developer.chrome.com/docs/extensions/)
- **Community**: [Chrome Extensions Forum](https://groups.google.com/forum/#!forum/chrome-extensions)

---

**Happy coding!** 🚀