// Utility Functions

/**
 * Check if user is logged in
 */
function isUserLoggedIn() {
    return sessionStorage.getItem('username') !== null;
}

/**
 * Login user
 */
function loginUser(username, password) {
    if (!username || !password) {
        return {
            success: false,
            message: 'Username and password are required'
        };
    }

    if (username.length < 3) {
        return {
            success: false,
            message: 'Username must be at least 3 characters long'
        };
    }

    if (password.length < 4) {
        return {
            success: false,
            message: 'Password must be at least 4 characters long'
        };
    }

    // Store username in session
    sessionStorage.setItem('username', username);
    return {
        success: true,
        message: 'Login successful'
    };
}

/**
 * Validate email
 */
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate IP address
 */
function validateIP(ip) {
    const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return ipRegex.test(ip);
}

/**
 * Format date
 */
function formatDate(date) {
    return new Date(date).toLocaleDateString();
}

/**
 * Clear error messages
 */
function clearErrorMessages() {
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(msg => {
        msg.textContent = '';
    });
}

/**
 * Display error message for a field
 */
function displayError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (field) {
        const errorElement = field.parentElement.querySelector('.error-message');
        if (errorElement) {
            errorElement.textContent = message;
        }
    }
}

// Login Page Script
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            clearErrorMessages();
            
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value.trim();
            
            // Validate inputs
            let isValid = true;
            
            if (!username) {
                displayError('username', 'Username is required');
                isValid = false;
            } else if (username.length < 3) {
                displayError('username', 'Username must be at least 3 characters');
                isValid = false;
            }
            
            if (!password) {
                displayError('password', 'Password is required');
                isValid = false;
            } else if (password.length < 4) {
                displayError('password', 'Password must be at least 4 characters');
                isValid = false;
            }
            
            if (!isValid) {
                return;
            }
            
            // Attempt login
            const loginResult = loginUser(username, password);
            
            if (loginResult.success) {
                // Redirect to dashboard
                window.location.href = 'dashboard.html';
            } else {
                displayError('username', loginResult.message);
            }
        });

        // Add real-time validation
        document.getElementById('username').addEventListener('blur', function() {
            const username = this.value.trim();
            if (username && username.length < 3) {
                displayError('username', 'Username must be at least 3 characters');
            } else {
                document.querySelector('#username').parentElement.querySelector('.error-message').textContent = '';
            }
        });

        document.getElementById('password').addEventListener('blur', function() {
            const password = this.value.trim();
            if (password && password.length < 4) {
                displayError('password', 'Password must be at least 4 characters');
            } else {
                document.querySelector('#password').parentElement.querySelector('.error-message').textContent = '';
            }
        });
    }
});

/**
 * Form Page Validation
 */
function validateFormData(option, formData) {
    const errors = {};

    switch(option) {
        case 'search-order':
            if (!formData.get('orderId') || formData.get('orderId').trim() === '') {
                errors.orderId = 'Order ID is required';
            }
            if (!formData.get('orderEmail') || formData.get('orderEmail').trim() === '') {
                errors.orderEmail = 'Email is required';
            } else if (!validateEmail(formData.get('orderEmail'))) {
                errors.orderEmail = 'Please enter a valid email address';
            }
            break;

        case 'inventory':
            if (!formData.get('productId') || formData.get('productId').trim() === '') {
                errors.productId = 'Product ID is required';
            }
            if (!formData.get('productQuantity') || formData.get('productQuantity') === '') {
                errors.productQuantity = 'Quantity is required';
            } else if (parseInt(formData.get('productQuantity')) < 1) {
                errors.productQuantity = 'Quantity must be at least 1';
            }
            if (!formData.get('warehouse') || formData.get('warehouse') === '') {
                errors.warehouse = 'Warehouse location is required';
            }
            break;

        case 'network':
            if (!formData.get('deviceId') || formData.get('deviceId').trim() === '') {
                errors.deviceId = 'Device ID is required';
            }
            if (!formData.get('ipAddress') || formData.get('ipAddress').trim() === '') {
                errors.ipAddress = 'IP Address is required';
            } else if (!validateIP(formData.get('ipAddress'))) {
                errors.ipAddress = 'Please enter a valid IP address';
            }
            break;

        case 'activation':
            if (!formData.get('serviceCode') || formData.get('serviceCode').trim() === '') {
                errors.serviceCode = 'Service Code is required';
            }
            if (!formData.get('activationPhone') || formData.get('activationPhone').trim() === '') {
                errors.activationPhone = 'Phone Number is required';
            } else if (!/^\d{10,}$/.test(formData.get('activationPhone').replace(/\D/g, ''))) {
                errors.activationPhone = 'Please enter a valid phone number';
            }
            if (!formData.get('agreeTerms')) {
                errors.agreeTerms = 'You must agree to the terms and conditions';
            }
            break;

        case 'completion':
            if (!formData.get('projectId') || formData.get('projectId').trim() === '') {
                errors.projectId = 'Project ID is required';
            }
            if (!formData.get('completionDate') || formData.get('completionDate') === '') {
                errors.completionDate = 'Target Completion Date is required';
            }
            break;
    }

    return errors;
}

/**
 * Display validation errors on form
 */
function displayFormErrors(errors) {
    clearErrorMessages();
    
    for (const [fieldName, errorMessage] of Object.entries(errors)) {
        const field = document.getElementById(fieldName);
        if (field) {
            const errorElement = field.parentElement?.querySelector('.error-message') || 
                                field.parentElement?.querySelector('label')?.nextElementSibling;
            if (errorElement) {
                const newError = document.createElement('span');
                newError.className = 'error-message';
                newError.textContent = errorMessage;
                
                if (field.parentElement.querySelector('.error-message')) {
                    field.parentElement.querySelector('.error-message').remove();
                }
                
                field.parentElement.appendChild(newError);
                field.style.borderColor = '#e74c3c';
            }
        }
    }
}

/**
 * Get query parameter from URL
 */
function getQueryParameter(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

/**
 * Store data in localStorage (optional - for persistence across sessions)
 */
function saveToLocalStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (e) {
        console.error('Failed to save to localStorage:', e);
        return false;
    }
}

/**
 * Get data from localStorage
 */
function getFromLocalStorage(key) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (e) {
        console.error('Failed to get from localStorage:', e);
        return null;
    }
}

/**
 * Clear all session data
 */
function clearSessionData() {
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('selectedOption');
    sessionStorage.removeItem('formData');
}

/**
 * Redirect to login if not authenticated
 */
function checkAuthentication() {
    if (!isUserLoggedIn()) {
        window.location.href = 'index.html';
    }
}

/**
 * Log user activity (optional)
 */
function logActivity(action, details = {}) {
    const activity = {
        timestamp: new Date().toISOString(),
        action: action,
        username: sessionStorage.getItem('username'),
        ...details
    };
    
    console.log('Activity:', activity);
    
    // Could be sent to a server for logging
    // fetch('/api/log', { method: 'POST', body: JSON.stringify(activity) });
}

/**
 * Debounce function for input validation
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Add loading state to button
 */
function setButtonLoading(buttonId, isLoading = true) {
    const button = document.getElementById(buttonId);
    if (button) {
        if (isLoading) {
            button.disabled = true;
            button.textContent = 'Loading...';
        } else {
            button.disabled = false;
            button.textContent = button.getAttribute('data-original-text') || 'Submit';
        }
    }
}

/**
 * Show toast notification (optional)
 */
function showNotification(message, type = 'info') {
    console.log(`[${type.toUpperCase()}] ${message}`);
    
    // Could be replaced with a toast library or custom implementation
    // alert(message);
}

/**
 * Format currency
 */
function formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
    }).format(amount);
}

/**
 * Get browser info
 */
function getBrowserInfo() {
    return {
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform
    };
}

/**
 * Check internet connectivity
 */
function isOnline() {
    return navigator.onLine;
}

// Add online/offline event listeners
window.addEventListener('online', function() {
    console.log('Connection restored');
    showNotification('Connection restored', 'success');
});

window.addEventListener('offline', function() {
    console.log('Connection lost');
    showNotification('Connection lost', 'warning');
});

/**
 * Scroll to element smoothly
 */
function scrollToElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}
