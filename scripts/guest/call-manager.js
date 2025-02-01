class GuestCallManager {
    constructor() {
        this.tourId = new URLSearchParams(window.location.search).get('tourId');
        if (!this.tourId) {
            alert('Invalid tour ID');
            window.close();
            return;
        }

        this.initializeCall();
    }

    async initializeCall() {
        try {
            // Get tour details
            const { data: tour, error } = await dbManager.supabase
                .from('tour_requests')
                .select('*')
                .eq('id', this.tourId)
                .single();

            if (error) throw error;

            // Initialize WebRTC
            const peerManager = new PeerManager();
            await peerManager.initialize(`guest-${this.tourId}`);

            // Connect to caretaker
            await peerManager.makeCall(`caretaker-${this.tourId}`);
        } catch (error) {
            console.error('Error initializing call:', error);
            alert('Failed to connect to the tour. Please try again.');
        }
    }
}

// Initialize guest call manager
const callManager = new GuestCallManager(); 