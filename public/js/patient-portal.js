document.addEventListener('DOMContentLoaded', function() {
  // Mobile menu toggle
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  
  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', function() {
      navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
      mobileMenuBtn.classList.toggle('active');
    });
  }

  // Modal functionality
  const modals = {
    appointments: document.getElementById('appointments-modal'),
    prescriptions: document.getElementById('prescriptions-modal'),
    billing: document.getElementById('billing-modal'),
    records: document.getElementById('records-modal'),
    profile: document.getElementById('profile-modal'),
    chat: document.getElementById('chat-modal')
  };

  // Open modal functions
  document.getElementById('appointments-card').addEventListener('click', () => toggleModal('appointments'));
  document.getElementById('prescriptions-card').addEventListener('click', () => toggleModal('prescriptions'));
  document.getElementById('billing-card').addEventListener('click', () => toggleModal('billing'));
  document.getElementById('records-card').addEventListener('click', () => toggleModal('records'));
  document.getElementById('profile-link').addEventListener('click', (e) => {
    e.preventDefault();
    toggleModal('profile');
  });
  document.getElementById('open-chat').addEventListener('click', () => toggleModal('chat'));

  // Close modal functions
  document.querySelectorAll('.close-modal').forEach(btn => {
    btn.addEventListener('click', function() {
      const modal = this.closest('.modal');
      closeModal(modal);
    });
  });

  // Close modal when clicking outside
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', function(e) {
      if (e.target === this) {
        closeModal(this);
      }
    });
  });

  // Close modal with Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal').forEach(modal => {
        if (modal.classList.contains('open')) {
          closeModal(modal);
        }
      });
    }
  });

  function toggleModal(modalName) {
    const modal = modals[modalName];
    if (modal) {
      modal.classList.toggle('open');
      document.body.style.overflow = modal.classList.contains('open') ? 'hidden' : '';
    }
  }

  function closeModal(modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Form submissions
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      // In a real app, you would handle form submission here
      alert('Form submitted successfully!');
      const modal = this.closest('.modal');
      if (modal) {
        closeModal(modal);
      }
    });
  });

  // Chat functionality
  const chatInput = document.getElementById('chat-input');
  const sendMessageBtn = document.getElementById('send-message');
  const chatMessages = document.getElementById('chat-messages');
  
  function sendMessage() {
    const messageText = chatInput.value.trim();
    if (messageText) {
      const messageDiv = document.createElement('div');
      messageDiv.className = 'message sent';
      messageDiv.innerHTML = `
        <div class="message-content">
          <p>${messageText}</p>
          <span class="message-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
        </div>
      `;
      
      chatMessages.appendChild(messageDiv);
      chatInput.value = '';
      chatMessages.scrollTop = chatMessages.scrollHeight;
      
      // Simulate doctor response after a delay
      setTimeout(simulateDoctorResponse, 1500);
    }
  }
  
  function simulateDoctorResponse() {
    const responses = [
      "I understand your concern. Can you describe your symptoms in more detail?",
      "How long have you been experiencing this?",
      "Have you taken any medication for this?",
      "I recommend scheduling an appointment so we can examine this further.",
      "That's a common side effect. Let's adjust your medication.",
      "Are you experiencing any other symptoms along with this?"
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    const responseDiv = document.createElement('div');
    responseDiv.className = 'message received';
    responseDiv.innerHTML = `
      <div class="message-content">
        <p>${randomResponse}</p>
        <span class="message-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
      </div>
    `;
    
    chatMessages.appendChild(responseDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  
  sendMessageBtn.addEventListener('click', sendMessage);
  
  chatInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });

  // Logout functionality
  document.getElementById('logout').addEventListener('click', function(e) {
    e.preventDefault();
    // In a real app, you would make an API call to logout
    console.log('User logged out');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'login.html';
  });

  // Initialize with some scroll to bottom for chat
  if (chatMessages) {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Set minimum date for appointment date picker to today
  const today = new Date().toISOString().split('T')[0];
  const appointmentDate = document.getElementById('appointment-date');
  if (appointmentDate) {
    appointmentDate.min = today;
  }
});