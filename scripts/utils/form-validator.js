class FormValidator {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.propertySelect = document.getElementById('propertySelect');
        this.propertyDetails = document.getElementById('propertyDetails');
        this.propertyLoading = document.getElementById('propertyLoading');
        this.setupEventListeners();
        this.loadProperties();
    }

    setupEventListeners() {
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (this.validateForm()) {
                await this.handleSubmit();
            }
        });

        this.propertySelect.addEventListener('change', () => {
            this.updatePropertyDetails();
        });
    }

    async loadProperties() {
        try {
            const properties = await dbManager.fetchProperties();
            this.propertyLoading.style.display = 'none';
            this.populatePropertySelect(properties);
        } catch (error) {
            this.showError('Failed to load properties. Please try again later.');
            this.propertyLoading.textContent = 'Failed to load properties. Please refresh the page.';
        }
    }

    populatePropertySelect(properties) {
        this.properties = properties; // Store for later use
        properties.forEach(property => {
            const option = document.createElement('option');
            option.value = property.id;
            option.textContent = property.name;
            this.propertySelect.appendChild(option);
        });
    }

    updatePropertyDetails() {
        const selectedId = this.propertySelect.value;
        if (!selectedId) {
            this.propertyDetails.classList.add('hidden');
            return;
        }

        const property = this.properties.find(p => p.id === selectedId);
        if (property) {
            document.getElementById('propertyName').textContent = property.name;
            document.getElementById('propertyDescription').textContent = property.description;
            this.propertyDetails.classList.remove('hidden');
        }
    }

    validateForm() {
        const name = document.getElementById('guestName').value;
        const email = document.getElementById('guestEmail').value;
        const phone = document.getElementById('guestPhone').value;
        const propertyId = document.getElementById('propertySelect').value;

        if (!name || !email || !phone || !propertyId) {
            this.showError('Please fill in all fields');
            return false;
        }

        if (!this.validateEmail(email)) {
            this.showError('Please enter a valid email address');
            return false;
        }

        if (!this.validatePhone(phone)) {
            this.showError('Please enter a valid phone number');
            return false;
        }

        return true;
    }

    validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    validatePhone(phone) {
        return /^\+?[\d\s-]{10,}$/.test(phone);
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

    async handleSubmit() {
        const submitBtn = this.form.querySelector('button');
        const btnText = submitBtn.querySelector('.btn-text');
        const loader = submitBtn.querySelector('.loader');

        // Show loading state
        btnText.textContent = 'Scheduling...';
        loader.classList.remove('hidden');
        submitBtn.disabled = true;

        try {
            const formData = {
                propertyId: this.propertySelect.value,
                name: document.getElementById('guestName').value,
                email: document.getElementById('guestEmail').value,
                phone: document.getElementById('guestPhone').value
            };

            await dbManager.createTourRequest(formData);
            
            // Show success message
            this.form.classList.add('hidden');
            document.getElementById('successMessage').classList.remove('hidden');
        } catch (error) {
            this.showError('Failed to submit tour request. Please try again.');
        } finally {
            // Reset button state
            btnText.textContent = 'Schedule Tour';
            loader.classList.add('hidden');
            submitBtn.disabled = false;
        }
    }
}

// Initialize form validator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new FormValidator('tourRequestForm');
}); 