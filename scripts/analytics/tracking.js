class AnalyticsTracker {
    constructor() {
        this.initGA();
        this.setupEventListeners();
    }

    initGA() {
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', config.GA_TRACKING_ID);
    }

    setupEventListeners() {
        // Track form submissions
        document.getElementById('tourRequestForm')?.addEventListener('submit', () => {
            this.trackEvent('Tour', 'Request', 'Submit');
        });

        // Track property selections
        document.getElementById('propertySelect')?.addEventListener('change', (e) => {
            this.trackEvent('Property', 'Select', e.target.value);
        });
    }

    trackEvent(category, action, label = null, value = null) {
        gtag('event', action, {
            'event_category': category,
            'event_label': label,
            'value': value
        });
    }

    trackError(error, context = {}) {
        gtag('event', 'error', {
            'event_category': 'Error',
            'event_label': error.message,
            'event_context': JSON.stringify(context)
        });
    }
}

const analytics = new AnalyticsTracker(); 