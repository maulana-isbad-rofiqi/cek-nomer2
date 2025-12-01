/**
 * Simple Navigation Module
 * Direct navigation to sections
 */

const Navigation = {
  init() {
    this.bindEvents();
    console.log('Navigation initialized');
  },

  bindEvents() {
    // Hamburger menu
    const hamburger = document.getElementById('hamburgerBtn');
    const closeSidebar = document.getElementById('closeSidebarBtn');
    const sidebar = document.getElementById('sidebarMenu');
    const overlay = document.getElementById('sidebarOverlay');

    if (hamburger) {
      hamburger.addEventListener('click', () => {
        sidebar?.classList.add('active');
        overlay?.classList.add('active');
      });
    }

    if (closeSidebar) {
      closeSidebar.addEventListener('click', () => {
        sidebar?.classList.remove('active');
        overlay?.classList.remove('active');
      });
    }

    if (overlay) {
      overlay.addEventListener('click', () => {
        sidebar?.classList.remove('active');
        overlay?.classList.remove('active');
      });
    }

    // Navigation buttons - direct scroll to sections
    this.bindNavButton('berandaNavBtnDesktop', 'beranda-content');
    this.bindNavButton('berandaNavBtnMobile', 'beranda-content');
    this.bindNavButton('cekKuotaNavBtnDesktop', 'cek-kuota-content');
    this.bindNavButton('cekKuotaNavBtnMobile', 'cek-kuota-content');
    this.bindNavButton('cekMyIpNavBtnDesktop', 'cek-myip-content');
    this.bindNavButton('cekMyIpNavBtnMobile', 'cek-myip-content');
    this.bindNavButton('cekIpHostNavBtnDesktop', 'cek-iphost-content');
    this.bindNavButton('cekIpHostNavBtnMobile', 'cek-iphost-content');
    this.bindNavButton('converterNavBtnDesktop', 'converter-content');
    this.bindNavButton('converterNavBtnMobile', 'converter-content');

    // Feature cards
    this.bindNavButton('cekKuotaCardBtn', 'cek-kuota-content');
    this.bindNavButton('cekMyIpCardBtn', 'cek-myip-content');
    this.bindNavButton('cekIpHostCardBtn', 'cek-iphost-content');
    this.bindNavButton('converterCardBtn', 'converter-content');

    // About modal
    this.bindModalButton('aboutNavBtnDesktop');
    this.bindModalButton('aboutNavBtnMobile');
    this.bindModalButton('aboutCardBtn');

    // Modal close
    const closeModal = document.getElementById('closeModalBtn');
    const modal = document.getElementById('aboutModal');

    if (closeModal) {
      closeModal.addEventListener('click', () => {
        modal?.classList.add('hidden');
      });
    }

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.add('hidden');
        }
      });
    }
  },

  bindNavButton(buttonId, targetId) {
    const button = document.getElementById(buttonId);
    if (button) {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        this.scrollToSection(targetId);
        this.closeSidebar();
      });
    }
  },

  bindModalButton(buttonId) {
    const button = document.getElementById(buttonId);
    const modal = document.getElementById('aboutModal');

    if (button && modal) {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        modal.classList.remove('hidden');
        this.closeSidebar();
      });
    }
  },

  scrollToSection(targetId) {
    const target = document.getElementById(targetId);
    if (target) {
      // Make sure the section is visible
      target.classList.remove('hidden');

      // Hide other tool sections
      const sections = ['cek-kuota-content', 'cek-myip-content', 'cek-iphost-content', 'converter-content'];
      sections.forEach(sectionId => {
        if (sectionId !== targetId) {
          const section = document.getElementById(sectionId);
          if (section) section.classList.add('hidden');
        }
      });

      // Scroll to the section
      setTimeout(() => {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    }
  },

  closeSidebar() {
    const sidebar = document.getElementById('sidebarMenu');
    const overlay = document.getElementById('sidebarOverlay');

    sidebar?.classList.remove('active');
    overlay?.classList.remove('active');
  }
};
