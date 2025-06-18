// Content script for Eclipse Web Traffic Recorder
class TrafficRecorderContent {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
        this.checkRecordingStatus();
        console.log('Eclipse Web Traffic Recorder content script loaded');
    }

    bindEvents() {
        // Listen for messages from popup and background
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            this.handleMessage(message, sender, sendResponse);
            return true; // Keep message channel open for async responses
        });

        // Listen for DOM changes
        document.addEventListener('DOMContentLoaded', () => {
            this.onDOMReady();
        });

        // Handle page visibility changes
        document.addEventListener('visibilitychange', () => {
            this.onVisibilityChange();
        });
    }

    async handleMessage(message, sender, sendResponse) {
        console.log('Content script received message:', message);

        try {
            switch (message.action) {
                case 'getRecordingStatus':
                    const status = await this.getRecordingStatus();
                    sendResponse({ success: true, data: status });
                    break;

                case 'showRecordingIndicator':
                    this.showRecordingIndicator(message.show);
                    sendResponse({ success: true });
                    break;

                default:
                    sendResponse({ success: false, error: 'Unknown action' });
            }
        } catch (error) {
            console.error('Error handling message:', error);
            sendResponse({ success: false, error: error.message });
        }
    }

    async checkRecordingStatus() {
        try {
            const result = await chrome.storage.sync.get({ isRecording: false });
            if (result.isRecording) {
                this.showRecordingIndicator(true);
            }
        } catch (error) {
            console.error('Error checking recording status:', error);
        }
    }

    async getRecordingStatus() {
        try {
            const result = await chrome.storage.sync.get({ 
                isRecording: false, 
                recordingStartTime: null 
            });
            
            return {
                isRecording: result.isRecording,
                startTime: result.recordingStartTime,
                currentPage: window.location.href,
                pageTitle: document.title
            };
        } catch (error) {
            console.error('Error getting recording status:', error);
            return { isRecording: false };
        }
    }

    showRecordingIndicator(show) {
        let indicator = document.getElementById('eclipse-recording-indicator');
        
        if (show) {
            if (!indicator) {
                indicator = document.createElement('div');
                indicator.id = 'eclipse-recording-indicator';
                indicator.style.cssText = `
                    position: fixed;
                    top: 10px;
                    right: 10px;
                    width: 12px;
                    height: 12px;
                    background: #ef4444;
                    border-radius: 50%;
                    z-index: 999999;
                    pointer-events: none;
                    box-shadow: 0 0 8px rgba(239, 68, 68, 0.5);
                    animation: eclipse-pulse 2s infinite;
                `;
                
                // Add pulse animation
                const style = document.createElement('style');
                style.textContent = `
                    @keyframes eclipse-pulse {
                        0% {
                            transform: scale(1);
                            opacity: 1;
                        }
                        50% {
                            transform: scale(1.2);
                            opacity: 0.7;
                        }
                        100% {
                            transform: scale(1);
                            opacity: 1;
                        }
                    }
                `;
                document.head.appendChild(style);
                document.body.appendChild(indicator);
            }
            
            indicator.style.background = '#4ade80';
            indicator.style.boxShadow = '0 0 8px rgba(74, 222, 128, 0.5)';
        } else {
            if (indicator) {
                indicator.remove();
            }
        }
    }

    onDOMReady() {
        console.log('DOM ready - Eclipse recorder active');
        // Perform any initialization that requires the DOM to be ready
    }

    onVisibilityChange() {
        if (document.hidden) {
            console.log('Page hidden');
        } else {
            console.log('Page visible');
        }
    }
}

// Initialize content script
new TrafficRecorderContent(); 