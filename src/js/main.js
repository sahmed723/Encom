// Import Alpine.js
import Alpine from 'alpinejs';

// Import aos
import AOS from 'aos';

// Initialize Alpine
window.Alpine = Alpine;
Alpine.start();

AOS.init({
  once: true,
  disable: 'phone',
  duration: 600,
  easing: 'ease-out-sine',
});

// import component from './components/component';
