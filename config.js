const config = {
    SUPABASE_URL: 'your-supabase-url',
    SUPABASE_ANON_KEY: 'your-supabase-anon-key',
    STUN_SERVERS: [
        'stun:stun.l.google.com:19302',
        'stun:global.stun.twilio.com:3478'
    ],
    SENTRY_DSN: 'your-sentry-dsn', // For error tracking
    GA_TRACKING_ID: 'your-ga-id',   // For analytics
    EMAIL_SERVICE_URL: 'your-email-service-url'
};

export default config; 