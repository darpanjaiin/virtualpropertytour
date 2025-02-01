class NotificationService {
    constructor() {
        this.setupNotifications();
    }

    async setupNotifications() {
        try {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                this.subscribeToNotifications();
            }
        } catch (error) {
            console.error('Notification setup failed:', error);
        }
    }

    async subscribeToNotifications() {
        const { data: { subscription }, error } = await dbManager.supabase
            .from('notifications')
            .on('INSERT', payload => {
                this.showNotification(payload.new);
            })
            .subscribe();

        if (error) {
            console.error('Notification subscription failed:', error);
        }
    }

    showNotification(data) {
        if (!('Notification' in window)) return;

        new Notification(data.title, {
            body: data.message,
            icon: '/icons/notification-icon.png'
        });
    }

    async sendEmail(to, template, data) {
        try {
            const response = await fetch(config.EMAIL_SERVICE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    to,
                    template,
                    data
                })
            });

            if (!response.ok) throw new Error('Email sending failed');
            return await response.json();
        } catch (error) {
            console.error('Email sending failed:', error);
            throw error;
        }
    }
}

const notificationService = new NotificationService(); 