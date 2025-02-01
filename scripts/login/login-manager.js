class LoginManager {
    constructor() {
        this.form = document.getElementById('loginForm');
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleLogin();
        });
    }

    async handleLogin() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const submitBtn = this.form.querySelector('button');
        const btnText = submitBtn.querySelector('.btn-text');
        const loader = submitBtn.querySelector('.loader');

        // Show loading state
        btnText.textContent = 'Logging in...';
        loader.classList.remove('hidden');
        submitBtn.disabled = true;

        try {
            await authManager.login(email, password);
        } catch (error) {
            this.showError('Invalid email or password');
        } finally {
            // Reset button state
            btnText.textContent = 'Login';
            loader.classList.add('hidden');
            submitBtn.disabled = false;
        }
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error';
        errorDiv.textContent = message;
        
        // Remove any existing error messages
        const existingError = this.form.querySelector('.error');
        if (existingError) {
            existingError.remove();
        }
        
        this.form.insertBefore(errorDiv, this.form.querySelector('button'));
        
        // Remove error after 5 seconds
        setTimeout(() => errorDiv.remove(), 5000);
    }
}

// Initialize login manager
const loginManager = new LoginManager(); 