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
  const toggleMenuBtn = document.querySelector('#toggle-menu-btn');
  const toggleInspectorBtn = document.querySelector('#toggle-inspector-btn');


  // Toggle dropdown menus
  const closeOtherDropdowns = (target) => {
    document.querySelectorAll('#menu li.open').forEach((li) => {
      if (!li.contains(target)) li.classList.remove('open');
    });
  };

  menu.addEventListener('pointerdown', (e) => {
    const button = e.target.closest('.dropdown-toggle');
    if (button) {
      const li = button.closest('li');
      const isOpen = li.classList.contains('open');
      closeOtherDropdowns(button);
      li.classList.toggle('open', !isOpen);
      e.stopPropagation();
    }
  });

  // Hover behavior for submenus (optional enhancement)
  menu.querySelectorAll('li').forEach((li) => {
    li.addEventListener('pointerenter', () => {
      const submenu = li.querySelector(':scope > .dropdown');
      if (submenu && submenu.parentElement.closest('.dropdown')) {
        li.classList.add('open');
        submenu.style.display = 'flex';
        submenu.style.visibility = 'hidden'; // prevent flicker
        const rect = submenu.getBoundingClientRect();
        const vw = window.innerWidth;

        if (rect.right > vw) {
          submenu.style.left = 'auto';
          submenu.style.right = '100%';
        } else {
          submenu.style.left = '100%';
          submenu.style.right = 'auto';
        }

        submenu.style.visibility = 'visible';
      }
    });

    li.addEventListener('pointerleave', () => {
      li.classList.remove('open');
      const submenu = li.querySelector(':scope > .dropdown');
      if (submenu) {
        submenu.style.display = '';
        submenu.style.left = '';
        submenu.style.right = '';
        submenu.style.visibility = '';
      }
    });
  });

  // Click outside to close
  document.addEventListener('pointerdown', (e) => {
    if (!menu.contains(e.target)) {
      document.querySelectorAll('#menu li.open').forEach((li) => {
        li.classList.remove('open');
      });
    }
  });

  // Menu toggle button logic
  let menuOpen = true;

  toggleMenuBtn.addEventListener('click', () => {
    menuOpen = !menuOpen;

    if (menuOpen) {
      toggleMenuBtn.innerHTML = '&#x25C0;'; // ◀
      menu.classList.remove('collapsed');
      toggleMenuBtn.classList.remove('collapsed');
    } else {
      toggleMenuBtn.innerHTML = '&#x25B6;'; // ▶
      menu.classList.add('collapsed');
      toggleMenuBtn.classList.add('collapsed');
    }
  });

  let inspectorOpen = true;

  toggleInspectorBtn.addEventListener('click', () => {
    inspectorOpen = !inspectorOpen;

    if (inspectorOpen) {
      toggleInspectorBtn.innerHTML = '&#x25B6;'; // ▶
      inspector.classList.remove('collapsed');
      toggleInspectorBtn.classList.remove('collapsed');
    } else {
      toggleInspectorBtn.innerHTML = '&#x25C0;'; // ◀
      inspector.classList.add('collapsed');
      toggleInspectorBtn.classList.add('collapsed');
    }
  });






});
