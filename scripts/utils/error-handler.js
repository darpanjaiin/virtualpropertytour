class ErrorHandler {
    constructor() {
        this.initSentry();
        this.setupGlobalErrorHandling();
    }

    initSentry() {
        Sentry.init({
            dsn: config.SENTRY_DSN,
            integrations: [
                new Sentry.BrowserTracing(),
                new Sentry.Replay()
            ],
            tracesSampleRate: 1.0,
            replaysSessionSampleRate: 0.1
        });
    }

    setupGlobalErrorHandling() {
        window.onerror = (message, source, lineno, colno, error) => {
            this.handleError(error);
            return false;
        };

        window.addEventListener('unhandledrejection', (event) => {
            this.handleError(event.reason);
        });
    }

    handleError(error, context = {}) {
        console.error('Error:', error);
        
        // Log to Sentry
        Sentry.captureException(error, {
            extra: context
        });

        // Show user-friendly error message
        this.showErrorMessage(error.message || 'An unexpected error occurred');
    }

    showErrorMessage(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-toast';
        errorDiv.textContent = message;
        
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }

    showLoadingOverlay(show = true) {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.classList.toggle('hidden', !show);
        }
    }
}

const errorHandler = new ErrorHandler(); 