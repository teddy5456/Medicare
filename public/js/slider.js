document.addEventListener('DOMContentLoaded', function() {
  const testimonials = document.querySelectorAll('.testimonial');
  const dots = document.querySelectorAll('.dot');
  const prevBtn = document.querySelector('.slider-prev');
  const nextBtn = document.querySelector('.slider-next');
  let currentIndex = 0;
  
  // Show current testimonial
  function showTestimonial(index) {
    testimonials.forEach(testimonial => testimonial.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    testimonials[index].classList.add('active');
    dots[index].classList.add('active');
    currentIndex = index;
  }
  
  // Next testimonial
  function nextTestimonial() {
    currentIndex = (currentIndex + 1) % testimonials.length;
    showTestimonial(currentIndex);
  }
  
  // Previous testimonial
  function prevTestimonial() {
    currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
    showTestimonial(currentIndex);
  }
  
  // Auto-rotate testimonials
  let interval = setInterval(nextTestimonial, 5000);
  
  // Pause on hover
  const slider = document.querySelector('.testimonial-slider');
  slider.addEventListener('mouseenter', () => clearInterval(interval));
  slider.addEventListener('mouseleave', () => interval = setInterval(nextTestimonial, 5000));
  
  // Navigation buttons
  nextBtn.addEventListener('click', () => {
    clearInterval(interval);
    nextTestimonial();
    interval = setInterval(nextTestimonial, 5000);
  });
  
  prevBtn.addEventListener('click', () => {
    clearInterval(interval);
    prevTestimonial();
    interval = setInterval(nextTestimonial, 5000);
  });
  
  // Dot navigation
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      clearInterval(interval);
      showTestimonial(index);
      interval = setInterval(nextTestimonial, 5000);
    });
  });
  
  // Initialize first testimonial
  showTestimonial(0);
});