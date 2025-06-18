document.addEventListener('DOMContentLoaded', function() {
  // Password toggle
  const showPassword = document.getElementById('show-password');
  const passwordField = document.getElementById('password');
  
  if (showPassword && passwordField) {
    showPassword.addEventListener('change', function() {
      passwordField.type = this.checked ? 'text' : 'password';
    });
  }
  
  // Login form submission
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form values
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      const rememberMe = document.getElementById('remember').checked;
      
      // Simple validation
      if (!email || !password) {
        alert('Please fill in all fields');
        return;
      }
      
      // Make API call to authenticate
      fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      })
      .then(response => {
        if (!response.ok) {
          return response.json().then(err => { throw err; });
        }
        return response.json();
      })
      .then(data => {
        // Store user data in localStorage if "Remember me" is checked
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', email);
        } else {
          localStorage.removeItem('rememberedEmail');
        }
        
        // Store user data in session
        sessionStorage.setItem('user', JSON.stringify(data.user));
        
        // Redirect based on user role
        redirectAfterLogin(data.user.role);
      })
      .catch(error => {
        console.error('Login error:', error);
        alert(error.error || 'Login failed. Please try again.');
      });
    });
  }
  
  // Pre-fill email if remembered
  const rememberedEmail = localStorage.getItem('rememberedEmail');
  if (rememberedEmail && document.getElementById('email')) {
    document.getElementById('email').value = rememberedEmail;
    document.getElementById('remember').checked = true;
  }
  
  // Social login buttons
  document.querySelectorAll('.btn-social').forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      const provider = this.classList.contains('google') ? 'Google' : 'Facebook';
      alert(`This would normally redirect to ${provider} authentication`);
    });
  });
});

// Redirect to appropriate dashboard
function redirectAfterLogin(role) {
  switch (role) {
    case 'admin':
      window.location.href = 'admin-dashboard.html';
      break;
    case 'doctor':
      window.location.href = 'doctor.html';
      break;
    case 'nurse':
      window.location.href = 'nurse-dashboard.html';
      break;
    default:
      window.location.href = 'patient-dashboard.html';
  }
}