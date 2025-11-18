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
    this.sections = {
      beranda: document.getElementById('berandaSection'),
      cekKuota: document.getElementById('cekKuotaSection'),
      cekMyIp: document.getElementById('cekMyIpSection'),
      cekIpHost: document.getElementById('cekIpHostSection'),
      converter: document.getElementById('converterSection')
    };

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
    Object.keys(this.sections).forEach(key => {
      if (this.sections[key]) {
        if (key === page) {
          this.sections[key].classList.remove('hidden');
        } else {
          this.sections[key].classList.add('hidden');
        }
      }
    });

    Object.keys(this.navBtns).forEach(key => {
      const btns = this.navBtns[key];
      if (btns.desktop) {
        if (key === page) {
          btns.desktop.classList.add('nav-active');
        } else {
          btns.desktop.classList.remove('nav-active');
        }
      }
      if (btns.mobile) {
        if (key === page) {
          btns.mobile.classList.add('nav-active');
        } else {
          btns.mobile.classList.remove('nav-active');
        }
      }
    });

    this.closeSidebar();
  },

  openSidebar() {
    if (this.sidebar) this.sidebar.classList.remove('-translate-x-full');
    if (this.overlay) this.overlay.classList.remove('hidden');
  },

  closeSidebar() {
    if (this.sidebar) this.sidebar.classList.add('-translate-x-full');
    if (this.overlay) this.overlay.classList.add('hidden');
  },

  openAboutModal() {
    if (this.modal) this.modal.classList.remove('hidden');
    this.closeSidebar();
  },

  closeAboutModal() {
    if (this.modal) this.modal.classList.add('hidden');
  }
};
