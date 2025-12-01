/**
 * Navigation Module
 * Handles page navigation and sidebar
 */

const Navigation = {
  sections: {},
  navBtns: {},
  sidebar: null,
  overlay: null,

  init() {
    // Initialize navigation buttons
    this.navBtns = {
      beranda: {
        desktop: document.getElementById('berandaNavBtnDesktop'),
        mobile: document.getElementById('berandaNavBtnMobile'),
        card: null
      },
      cekKuota: {
        desktop: document.getElementById('cekKuotaNavBtnDesktop'),
        mobile: document.getElementById('cekKuotaNavBtnMobile'),
        card: document.getElementById('cekKuotaCardBtn')
      },
      cekMyIp: {
        desktop: document.getElementById('cekMyIpNavBtnDesktop'),
        mobile: document.getElementById('cekMyIpNavBtnMobile'),
        card: document.getElementById('cekMyIpCardBtn')
      },
      cekIpHost: {
        desktop: document.getElementById('cekIpHostNavBtnDesktop'),
        mobile: document.getElementById('cekIpHostNavBtnMobile'),
        card: document.getElementById('cekIpHostCardBtn')
      },
      converter: {
        desktop: document.getElementById('converterNavBtnDesktop'),
        mobile: document.getElementById('converterNavBtnMobile'),
        card: document.getElementById('converterCardBtn')
      },
      about: {
        desktop: document.getElementById('aboutNavBtnDesktop'),
        mobile: document.getElementById('aboutNavBtnMobile'),
        card: document.getElementById('aboutCardBtn')
      }
    };

    this.sidebar = document.getElementById('sidebarMenu');
    this.overlay = document.getElementById('sidebarOverlay');
    this.modal = document.getElementById('aboutModal');

    this.bindEvents();
  },

  bindEvents() {
    const hamburger = document.getElementById('hamburgerBtn');
    const closeSidebar = document.getElementById('closeSidebarBtn');
    const closeModal = document.getElementById('closeModalBtn');

    if (hamburger) hamburger.addEventListener('click', () => this.openSidebar());
    if (closeSidebar) closeSidebar.addEventListener('click', () => this.closeSidebar());
    if (this.overlay) this.overlay.addEventListener('click', () => this.closeSidebar());
    if (closeModal) closeModal.addEventListener('click', () => this.closeAboutModal());
    if (this.modal) {
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) this.closeAboutModal();
      });
    }

    Object.keys(this.navBtns).forEach(page => {
      const btns = this.navBtns[page];
      
      if (btns.desktop) {
        btns.desktop.addEventListener('click', (e) => {
          e.preventDefault();
          if (page === 'about') {
            this.openAboutModal();
          } else {
            this.showPage(page);
          }
        });
      }

      if (btns.mobile) {
        btns.mobile.addEventListener('click', (e) => {
          e.preventDefault();
          if (page === 'about') {
            this.openAboutModal();
          } else {
            this.showPage(page);
          }
        });
      }

      if (btns.card) {
        btns.card.addEventListener('click', () => {
          if (page === 'about') {
            this.openAboutModal();
          } else {
            this.showPage(page);
          }
        });
      }
    });
  },

  showPage(page) {
    // Update URL hash for navigation
    window.location.hash = page;

    // Update active navigation states
    Object.keys(this.navBtns).forEach(key => {
      const btns = this.navBtns[key];
      const isActive = key === page;

      if (btns.desktop) {
        btns.desktop.classList.toggle('active', isActive);
      }
      if (btns.mobile) {
        btns.mobile.classList.toggle('active', isActive);
      }
    });

    // Scroll to section if it exists
    const sectionElement = document.getElementById(`${page}Section`) ||
                          document.getElementById(`${page}-content`) ||
                          document.querySelector(`[id*="${page}"]`);

    if (sectionElement) {
      sectionElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }

    this.closeSidebar();
  },

  openSidebar() {
    if (this.sidebar) this.sidebar.classList.add('active');
    if (this.overlay) this.overlay.classList.add('active');
  },

  closeSidebar() {
    if (this.sidebar) this.sidebar.classList.remove('active');
    if (this.overlay) this.overlay.classList.remove('active');
  },

  openAboutModal() {
    if (this.modal) this.modal.classList.remove('hidden');
    this.closeSidebar();
  },

  closeAboutModal() {
    if (this.modal) this.modal.classList.add('hidden');
  }
};
