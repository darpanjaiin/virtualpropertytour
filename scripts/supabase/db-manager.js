class DatabaseManager {
    constructor() {
        this.supabase = createClient(
            'https://qztzrdahaluiwkrakpme.supabase.co',
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6dHpyZGFoYWx1aXdrcmFrcG1lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg0MDI0NDQsImV4cCI6MjA1Mzk3ODQ0NH0.WZS6IgzibUcTOYH8rtmqx6gIh6WqMJo5h9wutwxXS14'
        );
    }

    async fetchProperties() {
        try {
            const { data, error } = await this.supabase
                .from('properties')
                .select('*')
                .eq('available', true);
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching properties:', error);
            throw new Error('Failed to load properties');
        }
    }

    async createTourRequest(requestData) {
        try {
            const { data, error } = await this.supabase
                .from('tour_requests')
                .insert([{
                    property_id: requestData.propertyId,
                    guest_name: requestData.name,
                    guest_phone: requestData.phone
                }])
                .select();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error creating tour request:', error);
            throw new Error('Failed to submit tour request');
        }
    }

    async updateTourRequest(requestId, updates) {
        try {
            const { data, error } = await this.supabase
                .from('tour_requests')
                .update(updates)
                .eq('id', requestId)
                .select();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error updating tour request:', error);
            throw new Error('Failed to update tour request. Please try again.');
        }
    }

    setupRealtimeSubscriptions() {
        // Subscribe to tour request updates
        this.supabase
            .channel('tour_requests')
            .on('postgres_changes', 
                { event: '*', schema: 'public', table: 'tour_requests' },
                payload => {
                    // Dispatch custom event for real-time updates
                    const event = new CustomEvent('tourRequestUpdate', { detail: payload });
                    window.dispatchEvent(event);
                }
            )
            .subscribe();
    }

    async searchProperties(searchTerm) {
        try {
            const { data, error } = await this.supabase
                .from('properties')
                .select('*')
                .textSearch('search_vector', searchTerm)
                .eq('available', true);

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error searching properties:', error);
            throw new Error('Failed to search properties. Please try again.');
        }
    }

    // Add more methods as needed...
}

// Initialize database manager
const dbManager = new DatabaseManager(); 