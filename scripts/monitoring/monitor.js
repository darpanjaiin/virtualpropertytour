class SystemMonitor {
    constructor() {
        this.metrics = {
            requestLatency: [],
            errorCount: 0,
            activeUsers: 0
        };
        
        this.setupMonitoring();
    }

    setupMonitoring() {
        // Performance monitoring
        this.monitorPerformance();
        
        // Error tracking
        this.monitorErrors();
        
        // User tracking
        this.monitorUserActivity();
    }

    monitorPerformance() {
        // Monitor page load performance
        window.addEventListener('load', () => {
            const timing = performance.getEntriesByType('navigation')[0];
            this.logMetric('pageLoad', timing.duration);
        });

        // Monitor API calls
        this.interceptFetch();
    }

    interceptFetch() {
        const originalFetch = window.fetch;
        window.fetch = async (...args) => {
            const start = performance.now();
            try {
                const response = await originalFetch(...args);
                this.logMetric('apiLatency', performance.now() - start);
                return response;
            } catch (error) {
                this.logError(error);
                throw error;
            }
        };
    }

    logMetric(name, value) {
        // Send to monitoring service
        console.log(`Metric - ${name}: ${value}`);
    }

    logError(error) {
        this.metrics.errorCount++;
        errorHandler.handleError(error);
    }
}

const systemMonitor = new SystemMonitor(); 