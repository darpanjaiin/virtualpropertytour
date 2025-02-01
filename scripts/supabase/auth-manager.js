class AuthManager {
    constructor() {
        this.supabase = dbManager.supabase;
        this.checkAuth();
    }

    async checkAuth() {
        const { data: { user }, error } = await this.supabase.auth.getUser();
        
        if (error || !user) {
            // Redirect to login if not authenticated
            window.location.href = '/login.html';
            return;
        }

        // Update UI with user info
        const caretakerName = document.getElementById('caretakerName');
        if (caretakerName) {
            caretakerName.textContent = user.email;
        }
    }

    async login(email, password) {
        const { data, error } = await this.supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) throw error;
        window.location.href = '/caretaker.html';
    }

    async logout() {
        const { error } = await this.supabase.auth.signOut();
        if (error) throw error;
        window.location.href = '/login.html';
    }
}

// Initialize auth manager
const authManager = new AuthManager();

// Setup logout button
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => authManager.logout()); 