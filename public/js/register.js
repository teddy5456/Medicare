document.addEventListener('DOMContentLoaded', function() {
  const registerForm = document.getElementById('register-form');
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirm-password');
  const passwordMatchMessage = document.getElementById('password-match');
  
  // Password validation
  if (passwordInput) {
    passwordInput.addEventListener('input', validatePassword);
  }
  
  if (confirmPasswordInput) {
    confirmPasswordInput.addEventListener('input', checkPasswordMatch);
  }
  
  // Form submission
  if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      if (!validateForm()) return;
      
      // Get form values
      const formData = {
        firstName: document.getElementById('first-name').value.trim(),
        lastName: document.getElementById('last-name').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        dob: document.getElementById('dob').value,
        gender: document.getElementById('gender').value,
        password: passwordInput.value,
        confirmPassword: confirmPasswordInput.value,
        terms: document.getElementById('terms').checked
      };
      
      // Make API call to register the user
      fetch('http://localhost:8000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })
      .then(response => {
        if (!response.ok) {
          return response.json().then(err => { throw err; });
        }
        return response.json();
      })
      .then(data => {
        alert(data.message || 'Registration successful! You will now be redirected to login.');
        window.location.href = 'login.html';
      })
      .catch(error => {
        console.error('Registration error:', error);
        const errorMessage = error.error || 'Registration failed. Please try again.';
        // Display error to user - example using a div with id="error-message"
        const errorElement = document.getElementById('error-message');
        if (errorElement) {
          errorElement.textContent = errorMessage;
          errorElement.style.display = 'block';
        } else {
          alert(errorMessage);
        }
      });
    });
  }
  
  function validatePassword() {
    const password = passwordInput.value;
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    
    // Update requirement indicators
    document.getElementById('req-length').style.color = requirements.length ? 'var(--success-color)' : 'var(--text-light)';
    document.getElementById('req-uppercase').style.color = requirements.uppercase ? 'var(--success-color)' : 'var(--text-light)';
    document.getElementById('req-number').style.color = requirements.number ? 'var(--success-color)' : 'var(--text-light)';
    document.getElementById('req-special').style.color = requirements.special ? 'var(--success-color)' : 'var(--text-light)';
    
    return Object.values(requirements).every(Boolean);
  }
  
  function checkPasswordMatch() {
    if (passwordInput.value && confirmPasswordInput.value) {
      if (passwordInput.value === confirmPasswordInput.value) {
        passwordMatchMessage.textContent = 'Passwords match!';
        passwordMatchMessage.style.color = 'var(--success-color)';
        return true;
      } else {
        passwordMatchMessage.textContent = 'Passwords do not match';
        passwordMatchMessage.style.color = 'var(--error-color)';
        return false;
      }
    }
    return false;
  }
  
  function validateForm() {
    let isValid = true;
    
    // Check all required fields
    document.querySelectorAll('[required]').forEach(field => {
      if (!field.value.trim()) {
        field.style.borderColor = 'var(--error-color)';
        isValid = false;
      } else {
        field.style.borderColor = '#ddd';
      }
    });
    
    // Validate email format
    const email = document.getElementById('email');
    if (email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      email.style.borderColor = 'var(--error-color)';
      isValid = false;
    }
    
    // Check password requirements
    if (!validatePassword()) {
      passwordInput.style.borderColor = 'var(--error-color)';
      isValid = false;
    }
    
    // Check password match
    if (!checkPasswordMatch()) {
      confirmPasswordInput.style.borderColor = 'var(--error-color)';
      isValid = false;
    }
    
    // Check terms agreement
    if (!document.getElementById('terms').checked) {
      alert('You must agree to the Terms of Service and Privacy Policy');
      isValid = false;
    }
    
    return isValid;
  }
});