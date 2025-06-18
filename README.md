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
1. Click the WebFlow Recorder extension icon
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

## License

MIT License - see [LICENSE](LICENSE) file for details.

---

**Made with ❤️ for everyone who's tired of doing the same web tasks over and over again.**