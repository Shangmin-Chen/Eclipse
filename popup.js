// Popup script for Eclipse Web Traffic Recorder
class TrafficRecorderPopup {
    constructor() {
        this.isRecording = false;
        this.recordingStartTime = null;
        this.durationInterval = null;
        this.init();
    }

    async init() {
        this.bindEvents();
        await this.loadSettings();
        await this.updateStatus();
        this.startStatusUpdates();
    }

    bindEvents() {
        // Recording controls
        document.getElementById('startRecording').addEventListener('click', () => {
            this.startRecording();
        });

        document.getElementById('stopRecording').addEventListener('click', () => {
            this.stopRecording();
        });

        // Export controls
        document.getElementById('exportData').addEventListener('click', () => {
            this.exportData();
        });

        document.getElementById('clearData').addEventListener('click', () => {
            this.clearData();
        });

        // Settings
        document.getElementById('autoRecord').addEventListener('change', (e) => {
            this.saveSetting('autoRecord', e.target.checked);
        });

        document.getElementById('recordTypes').addEventListener('change', (e) => {
            this.saveRecordTypes();
        });

        document.getElementById('exportFormat').addEventListener('change', (e) => {
            this.saveSetting('exportFormat', e.target.value);
        });
    }

    async loadSettings() {
        try {
            const result = await chrome.storage.sync.get({
                autoRecord: false,
                recordTypes: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
                exportFormat: 'json',
                isRecording: false,
                recordingStartTime: null
            });

            // Apply settings to UI
            document.getElementById('autoRecord').checked = result.autoRecord;
            document.getElementById('exportFormat').value = result.exportFormat;

            // Set record types
            const recordTypesSelect = document.getElementById('recordTypes');
            Array.from(recordTypesSelect.options).forEach(option => {
                option.selected = result.recordTypes.includes(option.value);
            });

            // Check if recording was in progress
            if (result.isRecording && result.recordingStartTime) {
                this.isRecording = true;
                this.recordingStartTime = result.recordingStartTime;
                this.updateRecordingUI();
            }
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    }

    async saveSetting(key, value) {
        try {
            await chrome.storage.sync.set({ [key]: value });
            
            // Notify background script of setting change
            chrome.runtime.sendMessage({
                action: 'settingChanged',
                key: key,
                value: value
            });
        } catch (error) {
            console.error('Error saving setting:', error);
        }
    }

    async saveRecordTypes() {
        const recordTypesSelect = document.getElementById('recordTypes');
        const selectedTypes = Array.from(recordTypesSelect.selectedOptions).map(option => option.value);
        await this.saveSetting('recordTypes', selectedTypes);
    }

    async startRecording() {
        try {
            this.isRecording = true;
            this.recordingStartTime = Date.now();
            
            // Save recording state
            await chrome.storage.sync.set({
                isRecording: true,
                recordingStartTime: this.recordingStartTime
            });

            // Send message to background script
            chrome.runtime.sendMessage({
                action: 'startRecording',
                startTime: this.recordingStartTime
            });

            this.updateRecordingUI();
            this.startDurationTimer();
            
            console.log('Recording started');
        } catch (error) {
            console.error('Error starting recording:', error);
        }
    }

    async stopRecording() {
        try {
            this.isRecording = false;
            
            // Save recording state
            await chrome.storage.sync.set({
                isRecording: false,
                recordingStartTime: null
            });

            // Send message to background script
            chrome.runtime.sendMessage({
                action: 'stopRecording'
            });

            this.updateRecordingUI();
            this.stopDurationTimer();
            
            console.log('Recording stopped');
        } catch (error) {
            console.error('Error stopping recording:', error);
        }
    }

    updateRecordingUI() {
        const startBtn = document.getElementById('startRecording');
        const stopBtn = document.getElementById('stopRecording');
        const exportSection = document.getElementById('exportSection');
        const statusIndicator = document.getElementById('statusIndicator');
        const recordingStatus = document.getElementById('recordingStatus');

        if (this.isRecording) {
            startBtn.style.display = 'none';
            stopBtn.style.display = 'flex';
            exportSection.style.display = 'none';
            statusIndicator.classList.add('recording');
            recordingStatus.textContent = 'Recording';
            recordingStatus.classList.add('recording');
        } else {
            startBtn.style.display = 'flex';
            stopBtn.style.display = 'none';
            exportSection.style.display = 'block';
            statusIndicator.classList.remove('recording');
            recordingStatus.textContent = 'Not Recording';
            recordingStatus.classList.remove('recording');
        }
    }

    startDurationTimer() {
        this.durationInterval = setInterval(() => {
            this.updateDuration();
        }, 1000);
    }

    stopDurationTimer() {
        if (this.durationInterval) {
            clearInterval(this.durationInterval);
            this.durationInterval = null;
        }
    }

    updateDuration() {
        if (this.recordingStartTime) {
            const duration = Date.now() - this.recordingStartTime;
            const hours = Math.floor(duration / 3600000);
            const minutes = Math.floor((duration % 3600000) / 60000);
            const seconds = Math.floor((duration % 60000) / 1000);
            
            const durationText = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            document.getElementById('recordingDuration').textContent = durationText;
        }
    }

    async exportData() {
        try {
            const format = document.getElementById('exportFormat').value;
            
            // Request data from background script
            const response = await chrome.runtime.sendMessage({
                action: 'exportData',
                format: format
            });

            if (response && response.success) {
                this.downloadFile(response.data, response.filename);
            } else {
                console.error('Export failed:', response?.error);
            }
        } catch (error) {
            console.error('Error exporting data:', error);
        }
    }

    downloadFile(content, filename) {
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        chrome.downloads.download({
            url: url,
            filename: filename,
            saveAs: true
        }, (downloadId) => {
            if (chrome.runtime.lastError) {
                console.error('Download failed:', chrome.runtime.lastError);
            } else {
                console.log('Download started with ID:', downloadId);
            }
            URL.revokeObjectURL(url);
        });
    }

    async clearData() {
        try {
            // Send message to background script to clear data
            const response = await chrome.runtime.sendMessage({
                action: 'clearData'
            });

            if (response && response.success) {
                this.updateActivityLog([]);
                this.updateStats(0, 0);
                console.log('Data cleared successfully');
            }
        } catch (error) {
            console.error('Error clearing data:', error);
        }
    }

    startStatusUpdates() {
        // Update stats every 2 seconds
        setInterval(async () => {
            await this.updateStats();
        }, 2000);

        // Update activity log every 5 seconds
        setInterval(async () => {
            await this.updateActivityLog();
        }, 5000);
    }

    async updateStats() {
        try {
            const response = await chrome.runtime.sendMessage({
                action: 'getStats'
            });

            if (response && response.success) {
                const { requestCount, dataSize } = response.data;
                document.getElementById('requestCount').textContent = requestCount;
                document.getElementById('dataSize').textContent = this.formatBytes(dataSize);
            }
        } catch (error) {
            console.error('Error updating stats:', error);
        }
    }

    async updateActivityLog() {
        try {
            const response = await chrome.runtime.sendMessage({
                action: 'getActivityLog'
            });

            if (response && response.success) {
                this.displayActivityLog(response.data);
            }
        } catch (error) {
            console.error('Error updating activity log:', error);
        }
    }

    displayActivityLog(activities) {
        const activityLog = document.getElementById('activityLog');
        
        if (!activities || activities.length === 0) {
            activityLog.innerHTML = '<p class="empty-state">No activity recorded yet. Start recording to see traffic data.</p>';
            return;
        }

        const recentActivities = activities.slice(-10); // Show last 10 activities
        const html = recentActivities.map(activity => `
            <div class="activity-item">
                <span class="activity-method ${activity.method.toLowerCase()}">${activity.method}</span>
                <span class="activity-url">${activity.url}</span>
                <div class="activity-time">${new Date(activity.timestamp).toLocaleTimeString()}</div>
            </div>
        `).join('');

        activityLog.innerHTML = html;
    }

    formatBytes(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    }

    async updateStatus() {
        try {
            const result = await chrome.storage.sync.get({ isRecording: false });
            this.isRecording = result.isRecording;
            this.updateRecordingUI();
        } catch (error) {
            console.error('Error updating status:', error);
        }
    }
}

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TrafficRecorderPopup();
});

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'recordingStatusChanged') {
        // Update recording status if needed
        console.log('Recording status changed:', message);
    }
}); 