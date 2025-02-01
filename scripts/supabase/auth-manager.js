class AuthManager {
    constructor() {
        this.supabase = dbManager.supabase;
        this.checkAuth();
    }

    async checkAuth() {
        const { data: { user }, error } = await this.supabase.auth.getUser();
        
        if (error || !user) {
            // Only redirect if we're not already on the login page
            if (!window.location.pathname.includes('login.html')) {
                window.location.href = '/login.html';
            }
            return;
        }

        // Update UI with user info
        const caretakerName = document.getElementById('caretakerName');
        if (caretakerName) {
            caretakerName.textContent = user.email;
        }

        // Redirect to dashboard if we're on the login page
        if (window.location.pathname.includes('login.html')) {
            window.location.href = '/caretaker.html';
        }
    }

    async login(email, password) {
        const { data, error } = await this.supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            console.error('Login error:', error.message);
            throw new Error(error.message);
        }

        if (data?.user) {
            window.location.href = '/caretaker.html';
        }
    }

    async logout() {
        const { error } = await this.supabase.auth.signOut();
        if (error) {
            console.error('Logout error:', error.message);
            throw new Error(error.message);
        }
        window.location.href = '/login.html';
    }
}

// Initialize auth manager
const authManager = new AuthManager();

// Setup logout button
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => authManager.logout()); 