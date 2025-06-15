// doctor.js - Doctor's Portal JavaScript

document.addEventListener('DOMContentLoaded', function() {
  // Mobile menu toggle
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  
  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', function() {
      navLinks.classList.toggle('active');
      mobileMenuBtn.classList.toggle('active');
    });
  }

  // User dropdown menu
  const userBtn = document.querySelector('.user-btn');
  const dropdownMenu = document.querySelector('.dropdown-menu');
  
  if (userBtn && dropdownMenu) {
    userBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      dropdownMenu.classList.toggle('show');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function() {
      dropdownMenu.classList.remove('show');
    });
  }

  // Modal functionality
  const modals = {
    'new-patient-btn': 'new-patient-modal',
    'quick-notes-btn': 'quick-notes-modal'
  };
  
  // Open modals
  Object.keys(modals).forEach(btnId => {
    const btn = document.getElementById(btnId);
    const modalId = modals[btnId];
    
    if (btn && document.getElementById(modalId)) {
      btn.addEventListener('click', function() {
        openModal(modalId);
      });
    }
  });
  
  // Close modals
  const closeButtons = document.querySelectorAll('.close-modal');
  closeButtons.forEach(button => {
    button.addEventListener('click', function() {
      const modal = this.closest('.modal');
      closeModal(modal);
    });
  });
  
  // Close modal when clicking outside content
  const modalElements = document.querySelectorAll('.modal');
  modalElements.forEach(modal => {
    modal.addEventListener('click', function(e) {
      if (e.target === this) {
        closeModal(this);
      }
    });
  });
  
  // Tab functionality for patient chart
  const tabButtons = document.querySelectorAll('.tab-btn');
  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      const tabId = this.getAttribute('data-tab');
      switchTab(tabId);
    });
  });

  // Form submissions
  const newPatientForm = document.getElementById('new-patient-form');
  if (newPatientForm) {
    newPatientForm.addEventListener('submit', function(e) {
      e.preventDefault();
      // Here you would typically send the data to the server
      alert('Patient registration submitted successfully!');
      closeModal(document.getElementById('new-patient-modal'));
    });
  }
  
  const quickNotesForm = document.getElementById('quick-notes-form');
  if (quickNotesForm) {
    quickNotesForm.addEventListener('submit', function(e) {
      e.preventDefault();
      // Here you would typically send the data to the server
      alert('Note saved successfully!');
      closeModal(document.getElementById('quick-notes-modal'));
    });
  }

  // Logout functionality
  const logoutBtn = document.getElementById('logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function(e) {
      e.preventDefault();
      // Here you would typically handle the logout process
      if (confirm('Are you sure you want to logout?')) {
        alert('You have been logged out.');
        // Redirect to login page
        window.location.href = 'login.html';
      }
    });
  }

  // Helper functions
  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }
  
  function closeModal(modal) {
    if (modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  }
  
  function switchTab(tabId) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.remove('active');
    });
    
    // Deactivate all tab buttons
    document.querySelectorAll('.tab-btn').forEach(button => {
      button.classList.remove('active');
    });
    
    // Activate selected tab
    const tabContent = document.getElementById(`${tabId}-tab`);
    const tabButton = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
    
    if (tabContent && tabButton) {
      tabContent.classList.add('active');
      tabButton.classList.add('active');
    }
  }

  // Initialize the first tab as active
  if (tabButtons.length > 0) {
    tabButtons[0].click();
  }

  // Sample data for demonstration purposes
  // In a real application, this would come from an API
  const today = new Date();
  const timeOptions = { hour: '2-digit', minute: '2-digit' };
  const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  
  // Update today's date in the UI
  const dateElements = document.querySelectorAll('.current-date');
  dateElements.forEach(el => {
    el.textContent = today.toLocaleDateString('en-US', dateOptions);
  });
  
  // Update current time in the UI
  function updateCurrentTime() {
    const now = new Date();
    const timeElements = document.querySelectorAll('.current-time');
    timeElements.forEach(el => {
      el.textContent = now.toLocaleTimeString('en-US', timeOptions);
    });
  }
  
  updateCurrentTime();
  setInterval(updateCurrentTime, 1000);
  
  // Sample function to handle prescription approval
  const approveBtns = document.querySelectorAll('.task-actions .btn-primary');
  approveBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const taskItem = this.closest('.task-item');
      if (taskItem) {
        taskItem.style.opacity = '0.5';
        taskItem.style.pointerEvents = 'none';
        setTimeout(() => {
          taskItem.remove();
        }, 300);
      }
    });
  });
  
  // Sample function to handle patient chart viewing
  const viewChartBtns = document.querySelectorAll('.patient-actions .btn-primary, .schedule-actions .btn-text');
  viewChartBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      openModal('patient-chart-modal');
    });
  });
  
  // Sample function to handle start visit
  const startVisitBtns = document.querySelectorAll('.schedule-actions .btn-primary');
  startVisitBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const patientName = this.closest('.schedule-item').querySelector('h4').textContent;
      alert(`Starting visit with ${patientName}`);
    });
  });
  
  // Sample function to handle quick action buttons
  const actionBtns = document.querySelectorAll('.action-btn');
  actionBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const actionName = this.querySelector('span').textContent;
      alert(`${actionName} action clicked`);
    });
  });
  
  // Sample function to handle patient selection in prescription modal
  const patientSelect = document.getElementById('prescription-patient');
  if (patientSelect) {
    patientSelect.addEventListener('change', function() {
      const selectedPatient = this.value;
      // In a real app, you would fetch patient details from your database
      const patientDetails = {
        'john-doe': {
          name: 'John Doe',
          dob: '06/15/1985',
          allergies: 'Penicillin, Sulfa',
          conditions: 'Hypertension, Type 2 Diabetes'
        },
        'mary-smith': {
          name: 'Mary Smith',
          dob: '03/22/1978',
          allergies: 'None',
          conditions: 'New Patient'
        },
        'robert-johnson': {
          name: 'Robert Johnson',
          dob: '11/05/1965',
          allergies: 'Latex',
          conditions: 'Heart Disease, High Cholesterol'
        }
      };
      
      const patientInfo = patientDetails[selectedPatient] || {};
      const displayElement = document.querySelector('.patient-info-display .patient-details');
      
      if (displayElement) {
        displayElement.innerHTML = `
          <h4>${patientInfo.name || 'Select a patient'}</h4>
          <p>DOB: ${patientInfo.dob || ''}</p>
          <p>Allergies: ${patientInfo.allergies || 'None recorded'}</p>
          <p>Conditions: ${patientInfo.conditions || 'None recorded'}</p>
        `;
      }
    });
  }
});