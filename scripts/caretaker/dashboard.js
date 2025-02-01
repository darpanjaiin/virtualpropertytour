class DashboardManager {
    constructor() {
        this.currentFilter = 'pending';
        this.setupEventListeners();
        this.loadTourRequests();
        this.setupRealtimeSubscription();
    }

    setupEventListeners() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.currentFilter = btn.dataset.status;
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.loadTourRequests();
            });
        });
    }

    async loadTourRequests() {
        try {
            const { data: requests, error } = await dbManager.supabase
                .from('tour_requests')
                .select(`
                    *,
                    properties (
                        name,
                        description
                    )
                `)
                .eq('status', this.currentFilter)
                .order('created_at', { ascending: false });

            if (error) throw error;
            this.renderRequests(requests);
        } catch (error) {
            console.error('Error loading requests:', error);
        }
    }

    setupRealtimeSubscription() {
        dbManager.supabase
            .channel('tour_requests')
            .on('postgres_changes', 
                { event: '*', schema: 'public', table: 'tour_requests' },
                this.handleRealtimeUpdate.bind(this)
            )
            .subscribe();
    }

    handleRealtimeUpdate(payload) {
        // Reload requests when there's any change
        this.loadTourRequests();
    }

    renderRequests(requests) {
        const requestsList = document.getElementById('requestsList');
        requestsList.innerHTML = '';

        requests.forEach(request => {
            const card = document.createElement('div');
            card.className = 'request-card';
            card.innerHTML = `
                <div class="request-header">
                    <span class="request-property">${request.properties.name}</span>
                    <span class="request-status status-${request.status}">${request.status}</span>
                </div>
                <div class="request-details">
                    <div>Guest: ${request.guest_name}</div>
                    <div>Email: ${request.guest_email}</div>
                    <div>Phone: ${request.guest_phone}</div>
                    <div>Requested: ${new Date(request.created_at).toLocaleString()}</div>
                </div>
                <div class="request-actions">
                    ${this.renderActionButtons(request)}
                </div>
            `;

            requestsList.appendChild(card);
        });
    }

    renderActionButtons(request) {
        if (request.status === 'pending') {
            return `
                <button onclick="dashboard.acceptRequest('${request.id}')" class="submit-btn">Accept</button>
                <button onclick="dashboard.rejectRequest('${request.id}')" class="secondary-btn">Reject</button>
            `;
        } else if (request.status === 'accepted') {
            return `
                <button onclick="dashboard.startTour('${request.id}')" class="submit-btn">Start Tour</button>
            `;
        }
        return '';
    }

    async acceptRequest(requestId) {
        try {
            const { error } = await dbManager.supabase
                .from('tour_requests')
                .update({ status: 'accepted' })
                .eq('id', requestId);

            if (error) throw error;
        } catch (error) {
            console.error('Error accepting request:', error);
        }
    }

    async rejectRequest(requestId) {
        try {
            const { error } = await dbManager.supabase
                .from('tour_requests')
                .update({ status: 'rejected' })
                .eq('id', requestId);

            if (error) throw error;
        } catch (error) {
            console.error('Error rejecting request:', error);
        }
    }

    async startTour(requestId) {
        // Initialize WebRTC connection
        const peerManager = new PeerManager();
        await peerManager.initialize(`caretaker-${requestId}`);
        
        // Update request status
        try {
            const { error } = await dbManager.supabase
                .from('tour_requests')
                .update({ 
                    status: 'in-progress',
                    call_id: `tour-${requestId}`
                })
                .eq('id', requestId);

            if (error) throw error;
        } catch (error) {
            console.error('Error starting tour:', error);
        }
    }
}

// Initialize dashboard
const dashboard = new DashboardManager(); 