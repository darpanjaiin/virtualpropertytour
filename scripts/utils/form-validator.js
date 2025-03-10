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
            this.showError('Failed to load properties');
        }
    }

    populatePropertySelect(properties) {
        this.properties = properties;
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
        const name = document.getElementById('guestName').value.trim();
        const phone = document.getElementById('guestPhone').value.trim();
        const propertyId = this.propertySelect.value;

        if (!name || !phone || !propertyId) {
            this.showError('Please fill in all fields');
            return false;
        }

        if (!this.validatePhone(phone)) {
            this.showError('Please enter a valid phone number');
            return false;
        }

        return true;
    }

    validatePhone(phone) {
        return /^\+?[\d\s-]{10,}$/.test(phone);
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error';
        errorDiv.textContent = message;
        
        const existingError = this.form.querySelector('.error');
        if (existingError) {
            existingError.remove();
        }
        
        this.form.insertBefore(errorDiv, this.form.querySelector('button'));
        setTimeout(() => errorDiv.remove(), 5000);
    }

    async handleSubmit() {
        const submitBtn = this.form.querySelector('button');
        const btnText = submitBtn.querySelector('.btn-text');
        const loader = submitBtn.querySelector('.loader');

        btnText.textContent = 'Scheduling...';
        loader.classList.remove('hidden');
        submitBtn.disabled = true;

        try {
            const formData = {
                propertyId: this.propertySelect.value,
                name: document.getElementById('guestName').value.trim(),
                phone: document.getElementById('guestPhone').value.trim()
            };

            await dbManager.createTourRequest(formData);
            
            this.form.classList.add('hidden');
            document.getElementById('successMessage').classList.remove('hidden');
        } catch (error) {
            this.showError('Failed to submit tour request');
        } finally {
            btnText.textContent = 'Schedule Tour';
            loader.classList.add('hidden');
            submitBtn.disabled = false;
        }
    }
}

new FormValidator('tourRequestForm'); 