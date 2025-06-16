import { app } from './app.js';


// document.querySelector('#menu button:contains("Import")')?.addEventListener('click', () => {
//   console.log("Import clicked");
//   // open file input or trigger load
// });

// document.querySelector('#menu button:contains("Export")')?.addEventListener('click', () => {
//   console.log("Export clicked");
//   // trigger export logic
// });

document.addEventListener('DOMContentLoaded', () => {
  const menu = document.querySelector('#menu');

  const canvas = app.renderer.domElement;

  // Menu click logic
  menu.addEventListener('pointerdown', (e) => {
    // Close any other open dropdowns
    document.querySelectorAll('#menu li.open').forEach(li => {
      if (!li.contains(e.target)) li.classList.remove('open');
    });

    // Toggle the clicked dropdown
    if (e.target.classList.contains('dropdown-toggle')) {
      const li = e.target.closest('li');
      li.classList.toggle('open');
    }
  });

  document.querySelectorAll('#menu li').forEach(item => {
    item.addEventListener('pointerenter', (e) => {
      const submenu = item.querySelector('.dropdown');
      if (submenu && submenu.parentElement.closest('.dropdown')) {
        // This is a nested dropdown
        submenu.style.display = 'flex'; // Temporarily show to measure
        submenu.style.visibility = 'hidden'; // Prevent flicker

        const rect = submenu.getBoundingClientRect();
        const viewportWidth = window.innerWidth;

        if (rect.right > viewportWidth) {
          // Not enough space on the right → open to the left
          submenu.style.left = 'auto';
          submenu.style.right = '100%';
        } else {
          // Enough space → open to the right
          submenu.style.left = '100%';
          submenu.style.right = 'auto';
        }

        submenu.style.visibility = 'visible';
      }
    });

    item.addEventListener('pointerleave', (e) => {
      const submenu = item.querySelector('.dropdown');
      if (submenu) {
        submenu.style.display = '';
        submenu.style.left = '';
        submenu.style.right = '';
        submenu.style.visibility = '';
      }
    });
  });


  // Click-outside-to-close logic
  document.addEventListener('pointerdown', (e) => {
    if (!menu.contains(e.target)) {
      document.querySelectorAll('#menu li.open').forEach(li => {
        li.classList.remove('open');
      });
    }
  });
});
