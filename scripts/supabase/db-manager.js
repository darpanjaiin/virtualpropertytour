class DatabaseManager {
    constructor() {
        // Initialize Supabase client
        this.supabase = supabase.createClient(
            'https://qztzrdahaluiwkrakpme.supabase.co',
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6dHpyZGFoYWx1aXdrcmFrcG1lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg0MDI0NDQsImV4cCI6MjA1Mzk3ODQ0NH0.WZS6IgzibUcTOYH8rtmqx6gIh6WqMJo5h9wutwxXS14'
        );
    }

    async fetchProperties() {
        try {
            const { data, error } = await this.supabase
                .from('properties')
                .select('id, name, description');

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching properties:', error);
            throw error;
        }
    }

    async createTourRequest(guestData) {
        try {
            const { data, error } = await this.supabase
                .from('tour_requests')
                .insert([
                    {
                        property_id: guestData.propertyId,
                        guest_name: guestData.name,
                        guest_email: guestData.email,
                        guest_phone: guestData.phone,
                        status: 'pending'
                    }
                ]);

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error creating tour request:', error);
            throw error;
        }
    }
}

// Initialize database manager
const dbManager = new DatabaseManager(); 