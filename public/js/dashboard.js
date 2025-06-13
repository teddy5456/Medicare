document.addEventListener('DOMContentLoaded', function() {
  // Toggle notification dropdown
  const notificationBtn = document.querySelector('.notification-btn');
  const notificationDropdown = document.querySelector('.notification-dropdown');
  
  if (notificationBtn && notificationDropdown) {
    notificationBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      notificationDropdown.classList.toggle('show');
      
      // Close user menu if open
      const userMenu = document.querySelector('.user-menu-dropdown');
      if (userMenu) userMenu.classList.remove('show');
    });
  }
  
  // Toggle user menu
  const userMenuBtn = document.querySelector('.user-menu-btn');
  const userMenuDropdown = document.querySelector('.user-menu-dropdown');
  
  if (userMenuBtn && userMenuDropdown) {
    userMenuBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      userMenuDropdown.classList.toggle('show');
      
      // Close notification dropdown if open
      if (notificationDropdown) notificationDropdown.classList.remove('show');
    });
  }
  
  // Close dropdowns when clicking outside
  document.addEventListener('click', function() {
    if (notificationDropdown) notificationDropdown.classList.remove('show');
    if (userMenuDropdown) userMenuDropdown.classList.remove('show');
  });
  
  // Mark all notifications as read
  const markAllReadBtn = document.querySelector('.mark-all-read');
  if (markAllReadBtn) {
    markAllReadBtn.addEventListener('click', function() {
      document.querySelectorAll('.notification-item.unread').forEach(item => {
        item.classList.remove('unread');
      });
      
      // Update notification counter
      const notificationCounter = document.querySelector('.notification-counter');
      if (notificationCounter) notificationCounter.style.display = 'none';
    });
  }
  
  // Logout functionality
  const logoutLinks = document.querySelectorAll('#logout, #logout-link');
  logoutLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      // Here you would typically make an API call to logout
      console.log('User logged out');
      
      // Clear any user data and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = 'login.html';
    });
  });
  
  // Simulate loading user data
  const currentUser = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'patient'
  };
  
  // Update UI with user data
  document.querySelectorAll('#patient-name, .user-name').forEach(el => {
    el.textContent = currentUser.name;
  });
  
  // Simulate appointment cancellation
  document.querySelectorAll('.appointment-actions .btn-outline').forEach(btn => {
    btn.addEventListener('click', function() {
      if (confirm('Are you sure you want to cancel this appointment?')) {
        const appointmentCard = this.closest('.appointment-card');
        appointmentCard.style.opacity = '0.5';
        appointmentCard.querySelector('.appointment-actions').innerHTML = 
          '<span class="text-danger">Appointment cancelled</span>';
        
        // Update upcoming appointments count
        const upcomingCount = document.querySelector('.summary-card:nth-child(1) .card-value');
        if (upcomingCount) {
          const count = parseInt(upcomingCount.textContent);
          if (count > 0) upcomingCount.textContent = count - 1;
        }
      }
    });
  });
  
  // Simulate prescription refill request
  document.querySelectorAll('.prescription-actions .btn-primary').forEach(btn => {
    btn.addEventListener('click', function() {
      const prescriptionCard = this.closest('.prescription-card');
      prescriptionCard.querySelector('.prescription-actions').innerHTML = 
        '<span class="text-success">Refill requested - awaiting approval</span>';
    });
  });
});