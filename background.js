// Background service worker for Eclipse Web Traffic Recorder
class TrafficRecorderBackground {
    constructor() {
        this.isRecording = false;
        this.recordedData = [];
        this.recordingStartTime = null;
        this.stats = {
            requestCount: 0,
            dataSize: 0
        };
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadRecordingState();
        console.log('Eclipse Web Traffic Recorder background service initialized');
    }

    bindEvents() {
        // Extension installation/update events
        chrome.runtime.onInstalled.addListener((details) => {
            this.handleInstallation(details);
        });

        // Message handling
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            this.handleMessage(message, sender, sendResponse);
            return true; // Keep message channel open for async responses
        });

        // Web request monitoring
        chrome.webRequest.onBeforeRequest.addListener(
            (details) => this.handleWebRequest(details),
            { urls: ["<all_urls>"] },
            ["requestBody"]
        );

        chrome.webRequest.onBeforeSendHeaders.addListener(
            (details) => this.handleRequestHeaders(details),
            { urls: ["<all_urls>"] },
            ["requestHeaders"]
        );

        chrome.webRequest.onResponseStarted.addListener(
            (details) => this.handleResponse(details),
            { urls: ["<all_urls>"] },
            ["responseHeaders"]
        );

        // Tab events
        chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
            this.handleTabUpdate(tabId, changeInfo, tab);
        });

        // Storage changes
        chrome.storage.onChanged.addListener((changes, namespace) => {
            this.handleStorageChange(changes, namespace);
        });
    }

    async handleInstallation(details) {
        console.log('Extension installation event:', details.reason);

        if (details.reason === 'install') {
            await this.setupDefaultSettings();
            await this.showWelcomeNotification();
        } else if (details.reason === 'update') {
            await this.handleUpdate(details.previousVersion);
        }
    }

    async setupDefaultSettings() {
        const defaultSettings = {
            autoRecord: false,
            recordTypes: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
            exportFormat: 'json',
            notifications: true,
            version: '1.0.0'
        };

        try {
            await chrome.storage.sync.set(defaultSettings);
            console.log('Default settings initialized');
        } catch (error) {
            console.error('Error setting up default settings:', error);
        }
    }

    async showWelcomeNotification() {
        try {
            const settings = await chrome.storage.sync.get({ notifications: true });
            if (settings.notifications) {
                chrome.notifications.create({
                    type: 'basic',
                    iconUrl: 'icons/icon48.png',
                    title: 'Eclipse Web Traffic Recorder',
                    message: 'Extension installed successfully! Click the extension icon to start recording web traffic.'
                });
            }
        } catch (error) {
            console.error('Error showing welcome notification:', error);
        }
    }

    async handleUpdate(previousVersion) {
        console.log(`Extension updated from ${previousVersion} to 1.0.0`);
        
        try {
            const currentSettings = await chrome.storage.sync.get();
            
            if (!currentSettings.hasOwnProperty('recordTypes')) {
                await chrome.storage.sync.set({ recordTypes: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'] });
            }
            
            console.log('Settings migration completed');
        } catch (error) {
            console.error('Error during update migration:', error);
        }
    }

    async handleMessage(message, sender, sendResponse) {
        console.log('Background received message:', message);

        try {
            switch (message.action) {
                case 'startRecording':
                    await this.startRecording(message.startTime);
                    sendResponse({ success: true });
                    break;

                case 'stopRecording':
                    await this.stopRecording();
                    sendResponse({ success: true });
                    break;

                case 'exportData':
                    const exportResult = await this.exportData(message.format);
                    sendResponse(exportResult);
                    break;

                case 'clearData':
                    await this.clearData();
                    sendResponse({ success: true });
                    break;

                case 'getStats':
                    sendResponse({ success: true, data: this.stats });
                    break;

                case 'getActivityLog':
                    const activities = this.getRecentActivities();
                    sendResponse({ success: true, data: activities });
                    break;

                case 'settingChanged':
                    await this.handleSettingChange(message.key, message.value);
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

    async startRecording(startTime) {
        this.isRecording = true;
        this.recordingStartTime = startTime || Date.now();
        this.recordedData = [];
        this.stats = { requestCount: 0, dataSize: 0 };

        // Save recording state
        await chrome.storage.sync.set({
            isRecording: true,
            recordingStartTime: this.recordingStartTime
        });

        console.log('Recording started at:', new Date(this.recordingStartTime));
    }

    async stopRecording() {
        this.isRecording = false;
        
        // Save recording state
        await chrome.storage.sync.set({
            isRecording: false,
            recordingStartTime: null
        });

        console.log('Recording stopped. Total requests:', this.stats.requestCount);
    }

    async loadRecordingState() {
        try {
            const result = await chrome.storage.sync.get({
                isRecording: false,
                recordingStartTime: null
            });

            if (result.isRecording && result.recordingStartTime) {
                this.isRecording = true;
                this.recordingStartTime = result.recordingStartTime;
                console.log('Recording state restored');
            }
        } catch (error) {
            console.error('Error loading recording state:', error);
        }
    }

    handleWebRequest(details) {
        if (!this.isRecording) return;

        const settings = this.getRecordTypes();
        if (!settings.includes(details.method)) return;

        const requestData = {
            id: details.requestId,
            method: details.method,
            url: details.url,
            timestamp: Date.now(),
            type: 'request',
            requestBody: details.requestBody,
            tabId: details.tabId,
            frameId: details.frameId
        };

        this.recordedData.push(requestData);
        this.stats.requestCount++;
        
        console.log('Recorded request:', details.method, details.url);
    }

    handleRequestHeaders(details) {
        if (!this.isRecording) return;

        // Find the corresponding request and add headers
        const requestIndex = this.recordedData.findIndex(req => req.id === details.requestId);
        if (requestIndex !== -1) {
            this.recordedData[requestIndex].requestHeaders = details.requestHeaders;
        }
    }

    handleResponse(details) {
        if (!this.isRecording) return;

        // Find the corresponding request and add response data
        const requestIndex = this.recordedData.findIndex(req => req.id === details.requestId);
        if (requestIndex !== -1) {
            this.recordedData[requestIndex].responseHeaders = details.responseHeaders;
            this.recordedData[requestIndex].statusCode = details.statusCode;
            this.recordedData[requestIndex].responseTime = Date.now();
            
            // Calculate response size
            const contentLength = details.responseHeaders?.find(h => h.name.toLowerCase() === 'content-length');
            if (contentLength) {
                const size = parseInt(contentLength.value) || 0;
                this.stats.dataSize += size;
            }
        }
    }

    getRecordTypes() {
        // This would normally be loaded from storage, but for simplicity we'll return default
        return ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
    }

    async exportData(format) {
        try {
            let data, filename, mimeType;

            switch (format) {
                case 'json':
                    data = JSON.stringify(this.recordedData, null, 2);
                    filename = `eclipse-traffic-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`;
                    mimeType = 'application/json';
                    break;

                case 'csv':
                    data = this.convertToCSV();
                    filename = `eclipse-traffic-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.csv`;
                    mimeType = 'text/csv';
                    break;

                case 'har':
                    data = this.convertToHAR();
                    filename = `eclipse-traffic-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.har`;
                    mimeType = 'application/json';
                    break;

                default:
                    throw new Error('Unsupported export format');
            }

            return {
                success: true,
                data: data,
                filename: filename,
                mimeType: mimeType
            };
        } catch (error) {
            console.error('Error exporting data:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    convertToCSV() {
        const headers = ['Method', 'URL', 'Status Code', 'Timestamp', 'Response Time', 'Data Size'];
        const rows = this.recordedData.map(record => [
            record.method,
            record.url,
            record.statusCode || 'N/A',
            new Date(record.timestamp).toISOString(),
            record.responseTime ? new Date(record.responseTime).toISOString() : 'N/A',
            this.calculateResponseSize(record) || 'N/A'
        ]);

        return [headers, ...rows]
            .map(row => row.map(cell => `"${cell}"`).join(','))
            .join('\n');
    }

    convertToHAR() {
        const har = {
            log: {
                version: "1.2",
                creator: {
                    name: "Eclipse Web Traffic Recorder",
                    version: "1.0.0"
                },
                entries: this.recordedData.map(record => this.convertToHAREntry(record))
            }
        };

        return JSON.stringify(har, null, 2);
    }

    convertToHAREntry(record) {
        return {
            startedDateTime: new Date(record.timestamp).toISOString(),
            time: record.responseTime ? record.responseTime - record.timestamp : 0,
            request: {
                method: record.method,
                url: record.url,
                headers: record.requestHeaders || [],
                queryString: this.parseQueryString(record.url),
                bodySize: record.requestBody ? JSON.stringify(record.requestBody).length : 0
            },
            response: {
                status: record.statusCode || 0,
                statusText: this.getStatusText(record.statusCode),
                headers: record.responseHeaders || [],
                bodySize: this.calculateResponseSize(record) || 0
            }
        };
    }

    parseQueryString(url) {
        try {
            const urlObj = new URL(url);
            return Array.from(urlObj.searchParams.entries()).map(([name, value]) => ({
                name: name,
                value: value
            }));
        } catch (error) {
            return [];
        }
    }

    getStatusText(statusCode) {
        const statusTexts = {
            200: 'OK',
            201: 'Created',
            400: 'Bad Request',
            401: 'Unauthorized',
            403: 'Forbidden',
            404: 'Not Found',
            500: 'Internal Server Error'
        };
        return statusTexts[statusCode] || 'Unknown';
    }

    calculateResponseSize(record) {
        if (record.responseHeaders) {
            const contentLength = record.responseHeaders.find(h => h.name.toLowerCase() === 'content-length');
            return contentLength ? parseInt(contentLength.value) : 0;
        }
        return 0;
    }

    async clearData() {
        this.recordedData = [];
        this.stats = { requestCount: 0, dataSize: 0 };
        console.log('Data cleared');
    }

    getRecentActivities() {
        return this.recordedData.slice(-50).map(record => ({
            method: record.method,
            url: record.url,
            timestamp: record.timestamp,
            statusCode: record.statusCode
        }));
    }

    async handleSettingChange(key, value) {
        console.log(`Setting changed: ${key} = ${value}`);
        
        switch (key) {
            case 'autoRecord':
                await this.updateAutoRecordBehavior(value);
                break;
            case 'recordTypes':
                console.log('Record types updated:', value);
                break;
            case 'exportFormat':
                console.log('Export format updated:', value);
                break;
        }
    }

    async updateAutoRecordBehavior(enabled) {
        if (enabled) {
            console.log('Auto-record enabled');
        } else {
            console.log('Auto-record disabled');
        }
    }

    async handleTabUpdate(tabId, changeInfo, tab) {
        if (changeInfo.status === 'complete' && tab.url) {
            try {
                const settings = await chrome.storage.sync.get({ autoRecord: false });
                
                if (settings.autoRecord && !this.isRecording) {
                    await this.startRecording();
                    console.log('Auto-recording started for tab:', tabId);
                }
            } catch (error) {
                console.error('Error handling tab update:', error);
            }
        }
    }

    async handleStorageChange(changes, namespace) {
        console.log('Storage changed:', changes, namespace);
        
        for (const [key, { oldValue, newValue }] of Object.entries(changes)) {
            console.log(`${key} changed from ${oldValue} to ${newValue}`);
        }
    }
}

// Initialize background service
new TrafficRecorderBackground(); 