/**
 * Modern Main Application Script
 * Enhanced UX with smooth interactions and modern features
 */

class App {
  constructor() {
    this.initialized = false;
    this.modules = new Map();
  }

  async init() {
    if (this.initialized) return;

    try {
      // Show loading state
      this.showGlobalLoading();

      // Initialize PWA features first
      await this.initPWA();

      // Initialize core modules
      await this.initCoreModules();

      // Initialize page handlers
      this.initPageHandlers();

      // Initialize modern UX features
      this.initModernUX();

      // Initialize mobile-specific features
      this.initMobileFeatures();

      // Create floating elements
      this.createFloatingElements();

      // Mark as initialized
      this.initialized = true;

      // Hide loading and show app
      this.hideGlobalLoading();

      console.log('🚀 XL & Axis Tools PWA initialized successfully');

    } catch (error) {
      console.error('❌ App initialization failed:', error);
      this.showError('Failed to initialize application');
    }
  }

  showGlobalLoading() {
    const loader = document.getElementById('loading-screen');
    if (loader) loader.classList.remove('opacity-0');
  }

  hideGlobalLoading() {
    const loader = document.getElementById('loading-screen');
    if (loader) {
      loader.classList.add('opacity-0');
      setTimeout(() => loader.remove(), 500);
    }
  }

  async initPWA() {
    // Register service worker
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('📱 Service Worker registered:', registration.scope);

        // Handle updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              this.showUpdateNotification();
            }
          });
        });
      } catch (error) {
        console.error('❌ Service Worker registration failed:', error);
      }
    }

    // Handle PWA install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.showInstallPrompt();
    });

    // Handle successful installation
    window.addEventListener('appinstalled', () => {
      console.log('📱 PWA installed successfully');
      this.hideInstallPrompt();
    });

    // Handle online/offline status
    window.addEventListener('online', () => this.handleOnlineStatus(true));
    window.addEventListener('offline', () => this.handleOnlineStatus(false));
  }

  async initCoreModules() {
    const modules = [
      { name: 'DigitalClock', init: () => initDigitalClock() },
      { name: 'Slider', init: () => initSlider() },
      { name: 'Navigation', init: () => initNavigation() }
    ];

    for (const module of modules) {
      try {
        await module.init();
        this.modules.set(module.name, true);
        console.log(`✅ ${module.name} initialized`);
      } catch (error) {
        console.warn(`⚠️ ${module.name} failed to initialize:`, error);
        this.modules.set(module.name, false);
      }
    }
  }

  initPageHandlers() {
    const handlers = [
      { name: 'CekKuota', init: initCekKuota },
      { name: 'CekMyIp', init: initCekMyIp },
      { name: 'CekIpHost', init: initCekIpHost },
      { name: 'Converter', init: initConverter }
    ];

    handlers.forEach(handler => {
      try {
        handler.init();
        console.log(`✅ ${handler.name} handler initialized`);
      } catch (error) {
        console.warn(`⚠️ ${handler.name} handler failed:`, error);
      }
    });
  }

  initModernUX() {
    // Smooth scrolling for anchor links
    this.initSmoothScrolling();

    // Enhanced form interactions
    this.initFormEnhancements();

    // Keyboard shortcuts
    this.initKeyboardShortcuts();

    // Back to top button
    this.initBackToTop();

    // Loading screen
    this.initLoadingScreen();

    // Progressive enhancement
    this.initProgressiveEnhancement();

    // Performance monitoring
    this.initPerformanceMonitoring();
  }

  initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  initFormEnhancements() {
    // Auto-focus first input
    const firstInput = document.querySelector('input:not([type="hidden"])');
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 1000);
    }

    // Enhanced input validation feedback
    document.querySelectorAll('input, textarea').forEach(input => {
      input.addEventListener('blur', () => {
        this.validateInput(input);
      });

      input.addEventListener('input', () => {
        if (input.classList.contains('invalid')) {
          this.validateInput(input);
        }
      });
    });
  }

  validateInput(input) {
    const isValid = input.checkValidity();
    input.classList.toggle('invalid', !isValid);
    input.classList.toggle('valid', isValid && input.value.trim() !== '');
  }

  initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Ctrl/Cmd + K: Focus search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('input[type="text"], input[type="tel"]');
        if (searchInput) searchInput.focus();
      }

      // Escape: Close modals/overlays
      if (e.key === 'Escape') {
        this.closeActiveOverlays();
      }
    });
  }

  closeActiveOverlays() {
    const overlays = document.querySelectorAll('.sidebar-overlay.active, .modal-overlay:not(.hidden)');
    overlays.forEach(overlay => {
      overlay.classList.remove('active');
      overlay.classList.add('hidden');
    });
  }

  initBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');

    if (!backToTopBtn) return;

    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  initLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');

    if (loadingScreen) {
      // Hide loading screen after page loads
      window.addEventListener('load', () => {
        setTimeout(() => {
          loadingScreen.classList.add('hide');
        }, 500);
      });
    }
  }

  initProgressiveEnhancement() {
    // Add modern features only if supported
    if ('IntersectionObserver' in window) {
      this.initLazyLoading();
    }

    if ('serviceWorker' in navigator) {
      this.registerServiceWorker();
    }
  }

  initLazyLoading() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          element.classList.add('animate-fade-in');
          observer.unobserve(element);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.feature-card, .stat-card, .content-section').forEach(card => {
      observer.observe(card);
    });
  }

  async registerServiceWorker() {
    try {
      // Service worker registration would go here
      console.log('📱 Service Worker support detected');
    } catch (error) {
      console.warn('⚠️ Service Worker registration failed:', error);
    }
  }

  initPerformanceMonitoring() {
    // Monitor performance
    if ('performance' in window) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const perfData = performance.getEntriesByType('navigation')[0];
          console.log(`⚡ Page loaded in ${Math.round(perfData.loadEventEnd - perfData.fetchStart)}ms`);
        }, 0);
      });
    }
  }

  showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-msg animate-fade-in';
    errorDiv.innerHTML = `<i class="fa-solid fa-exclamation-triangle"></i> ${message}`;
    document.body.appendChild(errorDiv);

    setTimeout(() => {
      errorDiv.remove();
    }, 5000);
  }

  showInstallPrompt() {
    // Create install prompt banner
    const banner = document.createElement('div');
    banner.id = 'pwa-install-banner';
    banner.innerHTML = `
      <div class="install-content">
        <i class="fas fa-mobile-alt"></i>
        <div class="install-text">
          <strong>Install XL Tools</strong>
          <span>Install sebagai aplikasi untuk pengalaman terbaik</span>
        </div>
        <div class="install-actions">
          <button id="install-btn" class="btn-install">Install</button>
          <button id="dismiss-btn" class="btn-dismiss">Nanti</button>
        </div>
      </div>
    `;

    banner.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 20px;
      right: 20px;
      background: rgba(10, 14, 39, 0.95);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(0, 212, 255, 0.3);
      border-radius: 1rem;
      padding: 1rem;
      z-index: 1000;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
      display: none;
    `;

    // Add responsive styles
    const style = document.createElement('style');
    style.textContent = `
      .install-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }
      .install-content i {
        font-size: 1.5rem;
        color: #00d4ff;
      }
      .install-text {
        flex: 1;
      }
      .install-text strong {
        display: block;
        color: white;
        font-size: 0.875rem;
      }
      .install-text span {
        display: block;
        color: #94a3b8;
        font-size: 0.75rem;
      }
      .install-actions {
        display: flex;
        gap: 0.5rem;
      }
      .btn-install, .btn-dismiss {
        padding: 0.375rem 0.75rem;
        border-radius: 0.375rem;
        font-size: 0.75rem;
        font-weight: 600;
        cursor: pointer;
        border: none;
        transition: all 0.2s ease;
      }
      .btn-install {
        background: #00d4ff;
        color: white;
      }
      .btn-install:hover {
        background: #0095ff;
      }
      .btn-dismiss {
        background: rgba(255, 255, 255, 0.1);
        color: #94a3b8;
      }
      .btn-dismiss:hover {
        background: rgba(255, 255, 255, 0.2);
      }
      @media (max-width: 480px) {
        .install-content {
          flex-direction: column;
          text-align: center;
          gap: 0.5rem;
        }
        .install-actions {
          width: 100%;
          justify-content: center;
        }
      }
    `;

    document.head.appendChild(style);
    document.body.appendChild(banner);

    // Show banner with animation
    setTimeout(() => {
      banner.style.display = 'block';
      banner.style.animation = 'slideUp 0.3s ease';
    }, 2000); // Show after 2 seconds

    // Handle install button
    document.getElementById('install-btn').addEventListener('click', async () => {
      if (this.deferredPrompt) {
        this.deferredPrompt.prompt();
        const { outcome } = await this.deferredPrompt.userChoice;
        console.log('📱 Install prompt outcome:', outcome);
        this.deferredPrompt = null;
      }
      this.hideInstallPrompt();
    });

    // Handle dismiss button
    document.getElementById('dismiss-btn').addEventListener('click', () => {
      this.hideInstallPrompt();
      // Don't show again for 24 hours
      localStorage.setItem('pwa-install-dismissed', Date.now().toString());
    });
  }

  hideInstallPrompt() {
    const banner = document.getElementById('pwa-install-banner');
    if (banner) {
      banner.style.animation = 'slideDown 0.3s ease';
      setTimeout(() => banner.remove(), 300);
    }
  }

  showUpdateNotification() {
    const notification = document.createElement('div');
    notification.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(16, 185, 129, 0.9);
        color: white;
        padding: 1rem;
        border-radius: 0.5rem;
        z-index: 1000;
        backdrop-filter: blur(10px);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        max-width: 300px;
      ">
        <p style="margin: 0 0 0.5rem 0; font-weight: 600;">Update Tersedia</p>
        <p style="margin: 0 0 1rem 0; font-size: 0.875rem;">Versi terbaru XL Tools telah tersedia.</p>
        <button id="update-btn" style="
          background: white;
          color: #10b981;
          border: none;
          padding: 0.375rem 0.75rem;
          border-radius: 0.25rem;
          font-weight: 600;
          cursor: pointer;
        ">Update Sekarang</button>
      </div>
    `;

    document.body.appendChild(notification);

    document.getElementById('update-btn').addEventListener('click', () => {
      window.location.reload();
    });

    // Auto-hide after 10 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 10000);
  }

  handleOnlineStatus(isOnline) {
    this.isOnline = isOnline;
    console.log(isOnline ? '🌐 Online' : '📴 Offline');

    // Show offline indicator
    if (!isOnline) {
      this.showOfflineIndicator();
    } else {
      this.hideOfflineIndicator();
    }
  }

  showOfflineIndicator() {
    let indicator = document.getElementById('offline-indicator');
    if (!indicator) {
      indicator = document.createElement('div');
      indicator.id = 'offline-indicator';
      indicator.innerHTML = '<i class="fas fa-wifi-slash"></i> Offline Mode';
      indicator.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: #ef4444;
        color: white;
        text-align: center;
        padding: 0.5rem;
        font-size: 0.875rem;
        z-index: 1000;
      `;
      document.body.appendChild(indicator);
    }
  }

  hideOfflineIndicator() {
    const indicator = document.getElementById('offline-indicator');
    if (indicator) {
      indicator.remove();
    }
  }

  initMobileFeatures() {
    // Add mobile-specific event listeners
    if (this.touchSupported) {
      this.initTouchGestures();
    }

    // Handle orientation changes
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        this.handleOrientationChange();
      }, 100);
    });

    // Handle viewport height changes (iOS Safari)
    this.initViewportHeightFix();

    // Add pull-to-refresh for mobile
    this.initPullToRefresh();
  }

  initTouchGestures() {
    // Swipe gestures for slider
    let startX = 0;
    let startY = 0;

    document.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
      if (!startX || !startY) return;

      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const diffX = startX - endX;
      const diffY = startY - endY;

      // Horizontal swipe (more significant than vertical)
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        if (diffX > 0) {
          // Swipe left - next slide
          const nextBtn = document.getElementById('nextSlideBtn');
          if (nextBtn) nextBtn.click();
        } else {
          // Swipe right - previous slide
          const prevBtn = document.getElementById('prevSlideBtn');
          if (prevBtn) prevBtn.click();
        }
      }
    }, { passive: true });
  }

  initViewportHeightFix() {
    // Fix for iOS Safari viewport height issues
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setVH();
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', () => {
      setTimeout(setVH, 100);
    });
  }

  initPullToRefresh() {
    let startY = 0;
    let isPulling = false;

    document.addEventListener('touchstart', (e) => {
      startY = e.touches[0].clientY;
    }, { passive: true });

    document.addEventListener('touchmove', (e) => {
      if (window.pageYOffset === 0 && !isPulling) {
        const currentY = e.touches[0].clientY;
        const diff = currentY - startY;

        if (diff > 80) { // Pull threshold
          isPulling = true;
          this.showPullIndicator();
        }
      }
    }, { passive: true });

    document.addEventListener('touchend', () => {
      if (isPulling) {
        isPulling = false;
        this.hidePullIndicator();
        window.location.reload(); // Refresh page
      }
      startY = 0;
    }, { passive: true });
  }

  showPullIndicator() {
    let indicator = document.getElementById('pull-indicator');
    if (!indicator) {
      indicator = document.createElement('div');
      indicator.id = 'pull-indicator';
      indicator.innerHTML = '<i class="fas fa-arrow-down"></i> Lepaskan untuk refresh';
      indicator.style.cssText = `
        position: fixed;
        top: 60px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 212, 255, 0.9);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 2rem;
        font-size: 0.875rem;
        z-index: 1000;
        backdrop-filter: blur(10px);
      `;
      document.body.appendChild(indicator);
    }
    indicator.style.display = 'block';
  }

  hidePullIndicator() {
    const indicator = document.getElementById('pull-indicator');
    if (indicator) {
      indicator.style.display = 'none';
    }
  }

  handleOrientationChange() {
    // Handle orientation changes for mobile
    console.log('📱 Orientation changed');
    // Force layout recalculation
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 100);
  }

  createFloatingElements() {
    const container = document.createElement('div');
    container.className = 'floating-elements';
    document.body.appendChild(container);

    const colors = ['var(--primary)', 'var(--secondary)', 'var(--accent)', 'var(--success)', 'var(--purple)'];
    const shapes = ['circle', 'square', 'triangle'];

    for (let i = 0; i < 20; i++) {
      const element = document.createElement('div');
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      const color = colors[Math.floor(Math.random() * colors.length)];

      element.className = `floating-element floating-${shape}`;
      element.style.left = Math.random() * 100 + '%';
      element.style.background = color;
      element.style.animationDelay = Math.random() * 20 + 's';
      element.style.animationDuration = (Math.random() * 15 + 15) + 's';
      element.style.opacity = Math.random() * 0.6 + 0.2;

      container.appendChild(element);
    }
  }
}

// Enhanced error handling
window.addEventListener('error', (e) => {
  console.error('🚨 JavaScript Error:', e.error);
  kirimNotifKeTelegram(`<b>JavaScript Error</b>\n<code>${e.error?.message || 'Unknown error'}</code>`);
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('🚨 Unhandled Promise Rejection:', e.reason);
  kirimNotifKeTelegram(`<b>Unhandled Promise Rejection</b>\n<code>${e.reason?.message || 'Unknown rejection'}</code>`);
});

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new App().init());
} else {
  new App().init();
}

/**
 * Create floating decorative elements
 */
function createFloatingElements() {
  const container = document.createElement('div');
  container.className = 'floating-elements';
  document.body.appendChild(container);
  
  const colors = ['var(--primary)', 'var(--secondary)', 'var(--accent)', 'var(--success)', '#8b5cf6'];
  
  for (let i = 0; i < 15; i++) {
    const element = document.createElement('div');
    element.className = 'floating-element';
    element.style.left = Math.random() * 100 + '%';
    element.style.background = colors[Math.floor(Math.random() * colors.length)];
    element.style.animationDelay = Math.random() * 20 + 's';
    element.style.animationDuration = (Math.random() * 10 + 10) + 's';
    container.appendChild(element);
  }
}

/**
 * Initialize Cek Kuota functionality
 */
function initCekKuota() {
  const nomor = document.getElementById('nomor');
  const cekBtn = document.getElementById('cekBtn');
  const hasil = document.getElementById('hasil');
  const info = document.getElementById('info');
  const kuotaList = document.getElementById('kuotaList');
  const loading = document.getElementById('loading');
  const errorDiv = document.getElementById('error');

  if (!nomor || !cekBtn) return;

  nomor.addEventListener('input', (e) => {
    const target = e.target;
    const originalValue = target.value;
    const cursorPosition = target.selectionStart;
    const cleanedValue = originalValue.replace(/\D/g, '');
    
    if (originalValue !== cleanedValue) {
      const nonDigitsBeforeCursor = (originalValue.substring(0, cursorPosition).match(/\D/g) || []).length;
      target.value = cleanedValue;
      const newCursorPosition = cursorPosition - nonDigitsBeforeCursor;
      target.selectionStart = newCursorPosition;
      target.selectionEnd = newCursorPosition;
    }
  });

  cekBtn.addEventListener('click', async () => {
    const no = nomor.value.trim();
    
    kirimNotifKeTelegram(`<b>Aksi: Cek Kuota</b>\nInput: <code>${no || 'Kosong'}</code>`);
    
    if (!no) return alert('Masukkan nomor terlebih dahulu.');
    if (!/^(08|62|8)\d{7,12}$/.test(no)) return alert('Format nomor salah. (Harus diawali 08, 62, atau 8)');
    
    hasil.classList.add('hidden');
    errorDiv.classList.add('hidden');
    loading.classList.remove('hidden');
    
    try {
      const data = await API.cekKuota(no);
      loading.classList.add('hidden');
      
      if (!data.success) {
        kirimNotifKeTelegram(`<b>Gagal Cek Kuota</b>\nInput: <code>${no}</code>\nError: <code>${data.message || 'Gagal mengambil data.'}</code>`);
        errorDiv.textContent = data.message || 'Gagal mengambil data.';
        errorDiv.classList.remove('hidden');
        return;
      }
      
      hasil.classList.remove('hidden');
      const subs = data.data.subs_info;
      const paket = data.data.package_info;
      
      let outputPesan = `<b>Nomer:</b> ${subs.msisdn}\n<b>Aktif:</b> ${subs.exp_date}\n<b>Tenggang:</b> ${subs.grace_until}\n\n`;
      if (paket.packages && paket.packages.length > 0) {
        outputPesan += `<b>Paket Aktif (${paket.packages.length}):</b>\n`;
        paket.packages.forEach(p => {
          outputPesan += `- ${p.name}\n`;
        });
      } else {
        outputPesan += "Tidak ada paket aktif.";
      }
      
      kirimNotifKeTelegram(`<b>Sukses Cek Kuota</b>\nInput: <code>${no}</code>\n\n<b>Output:</b>\n<pre>${outputPesan}</pre>`);

      info.innerHTML = `
        <div class="info-item"><i class="fa-solid fa-phone"></i><span><b>Nomer:</b> ${subs.msisdn}</span></div>
        <div class="info-item"><i class="fa-solid fa-signal"></i><span><b>Operator:</b> ${subs.operator}</span></div>
        <div class="info-item"><i class="fa-solid fa-wifi"></i><span><b>Jaringan:</b> ${subs.net_type}</span></div>
        <div class="info-item"><i class="fa-solid fa-calendar-check"></i><span><b>Umur Kartu:</b> ${subs.tenure}</span></div>
        <div class="info-item"><i class="fa-solid fa-calendar-day"></i><span><b>Aktif Sampai:</b> ${subs.exp_date}</span></div>
        <div class="info-item"><i class="fa-solid fa-hourglass-half"></i><span><b>Masa Tenggang:</b> ${subs.grace_until}</span></div>
        <div class="info-item"><i class="fa-solid fa-mobile-screen-button"></i><span><b>VoLTE:</b> Device: ${subs.volte.device?'Ya':'Tidak'}, Area: ${subs.volte.area?'Ya':'Tidak'}, SIM: ${subs.volte.simcard?'Ya':'Tidak'}</span></div>
      `;
      
      kuotaList.innerHTML = '';
      if (paket.packages && paket.packages.length > 0) {
        paket.packages.forEach(p => {
          let quotaHTML = '';
          if (p.quotas && p.quotas.length) {
            p.quotas.forEach(q => {
              const percent = q.percent !== null && !isNaN(q.percent) ? Math.min(q.percent, 100) : 0;
              quotaHTML += `
                <div class="progress-container">
                  <div class="progress-header">
                    <span class="progress-label">${q.name}</span>
                    <span class="progress-value">${q.remaining} / ${q.total}</span>
                  </div>
                  <div class="progress-track">
                    <div class="progress-bar" style="width:${percent}%;"></div>
                  </div>
                  <div style="text-align: right; margin-top: 0.5rem;">
                    <span style="color: var(--text-muted); font-size: 0.875rem;">${percent}% tersisa</span>
                  </div>
                </div>
              `;
            });
          } else {
            quotaHTML = `<p style="color: var(--text-muted); text-align: center;">Tidak ada detail kuota.</p>`;
          }
          const exp = p.expiry_date || p.expiry || p.end_date || 'Tidak diketahui';
          kuotaList.innerHTML += `
            <div class="feature-card" style="text-align: left;">
              <h3 style="font-size: 1.125rem; font-weight: 700; margin-bottom: 1rem; color: white; display: flex; align-items: center; gap: 0.5rem;">
                <i class="fa-solid fa-box"></i>
                <span>${p.name}</span>
              </h3>
              <p style="color: var(--text-muted); font-size: 0.875rem; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.5rem;">
                <i class="fa-regular fa-calendar" style="color: var(--primary);"></i>
                <span>Aktif sampai: <b style="color: white;">${exp}</b></span>
              </p>
              ${quotaHTML}
            </div>
          `;
        });
      } else {
        kuotaList.innerHTML = '<p class="text-slate-400 text-center">Tidak ada paket aktif.</p>';
      }
    } catch (e) {
      kirimNotifKeTelegram(`<b>Gagal Cek Kuota</b>\nInput: <code>${no}</code>\nError: <code>${e.message}</code>`);
      loading.classList.add('hidden');
      errorDiv.textContent = 'Koneksi gagal, coba lagi.';
      errorDiv.classList.remove('hidden');
      console.error(e);
    }
  });

  nomor.addEventListener('keypress', e => {
    if (e.key === 'Enter') cekBtn.click();
  });
}

/**
 * Initialize Cek MyIP functionality
 */
function initCekMyIp() {
  const cekMyIpBtn = document.getElementById('cekMyIpBtn');
  const myIpLoading = document.getElementById('myIpLoading');
  const myIpError = document.getElementById('myIpError');
  const myIpHasil = document.getElementById('myIpHasil');
  const myIpInfo = document.getElementById('myIpInfo');

  if (!cekMyIpBtn) return;

  cekMyIpBtn.addEventListener('click', async () => {
    kirimNotifKeTelegram("Aksi: <b>Cek MyIp</b>");
    
    myIpHasil.classList.add('hidden');
    myIpError.classList.add('hidden');
    myIpLoading.classList.remove('hidden');
    
    try {
      const data = await API.cekMyIp();
      myIpLoading.classList.add('hidden');

      let outputPesan = `<b>IP:</b> ${data.ip || 'N/A'}\n<b>Lokasi:</b> ${data.city || 'N/A'}, ${data.country || 'N/A'}\n<b>Provider:</b> ${data.org || 'N/A'}`;
      kirimNotifKeTelegram(`<b>Sukses Cek MyIp</b>\n<pre>${outputPesan}</pre>`);

      myIpInfo.innerHTML = `
        <div class="info-item"><i class="fa-solid fa-map-pin"></i><span><b>IP Address:</b> ${data.ip || 'N/A'}</span></div>
        <div class="info-item"><i class="fa-solid fa-city"></i><span><b>Kota:</b> ${data.city || 'N/A'}</span></div>
        <div class="info-item"><i class="fa-solid fa-map-location-dot"></i><span><b>Wilayah:</b> ${data.region || 'N/A'}</span></div>
        <div class="info-item"><i class="fa-solid fa-globe"></i><span><b>Negara:</b> ${data.country || 'N/A'}</span></div>
        <div class="info-item"><i class="fa-solid fa-building"></i><span><b>Provider:</b> ${data.org || 'N/A'}</span></div>
        <div class="info-item"><i class="fa-solid fa-location-crosshairs"></i><span><b>Koordinat:</b> ${data.loc || 'N/A'}</span></div>
      `;
      myIpHasil.classList.remove('hidden');
    } catch (e) {
      kirimNotifKeTelegram(`<b>Gagal Cek MyIp</b>\nError: <code>${e.message}</code>`);
      console.error('Gagal fetch IP:', e);
      myIpLoading.classList.add('hidden');
      myIpError.textContent = 'Gagal mengambil informasi IP. Silakan coba lagi.';
      myIpError.classList.remove('hidden');
    }
  });
}

/**
 * Initialize Cek IP Host functionality
 */
function initCekIpHost() {
  const hostnameInput = document.getElementById('hostnameInput');
  const cekHostBtn = document.getElementById('cekHostBtn');
  const hostLoading = document.getElementById('hostLoading');
  const hostError = document.getElementById('hostError');
  const hostHasil = document.getElementById('hostHasil');
  const hostOutput = document.getElementById('hostOutput');
  const copyHostBtn = document.getElementById('copyHostBtn');

  if (!cekHostBtn) return;

  async function handleCekHost() {
    const hostname = hostnameInput.value.trim();
    
    kirimNotifKeTelegram(`<b>Aksi: Cek IP Host</b>\nInput: <code>${hostname || 'Kosong'}</code>`);
    
    if (!hostname) {
      alert('Silakan masukkan hostname terlebih dahulu.');
      return;
    }
    
    hostHasil.classList.add('hidden');
    hostError.classList.add('hidden');
    hostLoading.classList.remove('hidden');

    try {
      const results = await API.cekIpHost(hostname);
      
      let outputString = `Hostname: ${hostname}\n\n`;
      results.forEach(res => {
        outputString += `IP: ${res.ip}\n`;
        if (res.details) {
          outputString += `  Provider: ${res.details.org || 'N/A'}\n`;
          outputString += `  Lokasi  : ${res.details.city || 'N/A'}, ${res.details.region || 'N/A'}, ${res.details.country || 'N/A'}\n`;
        } else {
          outputString += `  (Gagal mengambil detail IP: ${res.error})\n`;
        }
        outputString += `\n`;
      });

      kirimNotifKeTelegram(`<b>Sukses Cek IP Host</b>\nInput: <code>${hostname}</code>\n\n<b>Output:</b>\n<pre>${outputString}</pre>`);

      hostLoading.classList.add('hidden');
      hostOutput.value = outputString;
      hostHasil.classList.remove('hidden');
    } catch (e) {
      kirimNotifKeTelegram(`<b>Gagal Cek IP Host</b>\nInput: <code>${hostname}</code>\nError: <code>${e.message}</code>`);
      console.error('Gagal DNS lookup:', e);
      hostLoading.classList.add('hidden');
      hostError.textContent = e.message || 'Gagal melakukan DNS lookup.';
      hostError.classList.remove('hidden');
    }
  }

  cekHostBtn.addEventListener('click', handleCekHost);
  hostnameInput.addEventListener('keypress', e => {
    if (e.key === 'Enter') cekHostBtn.click();
  });

  if (copyHostBtn) {
    copyHostBtn.addEventListener('click', () => {
      const textToCopy = hostOutput.value;
      if (!textToCopy) return;

      navigator.clipboard.writeText(textToCopy).then(() => {
        const originalText = copyHostBtn.innerHTML;
        copyHostBtn.innerHTML = '<i class="fa-solid fa-check mr-1"></i>Tersalin!';
        copyHostBtn.classList.remove('bg-emerald-600', 'hover:bg-emerald-700');
        copyHostBtn.classList.add('bg-blue-500');
        
        setTimeout(() => {
          copyHostBtn.innerHTML = originalText;
          copyHostBtn.classList.remove('bg-blue-500');
          copyHostBtn.classList.add('bg-emerald-600', 'hover:bg-emerald-700');
        }, 2000);
      }).catch(err => {
        console.error('Gagal menyalin:', err);
        alert('Gagal menyalin ke clipboard.');
      });
    });
  }
}

/**
 * Initialize Converter functionality
 */
function initConverter() {
  const convertBtn = document.getElementById('convertBtn');
  const convertUrls = document.getElementById('convertUrls');
  const convertOutputFormat = document.getElementById('convertOutputFormat');
  const convertLoading = document.getElementById('convertLoading');
  const convertError = document.getElementById('convertError');
  const convertHasil = document.getElementById('convertHasil');
  const convertOutput = document.getElementById('convertOutput');
  const copyBtn = document.getElementById('copyBtn');

  if (!convertBtn) return;

  convertBtn.addEventListener('click', () => {
    const links = convertUrls.value.split('\n').filter(Boolean);
    const outputFormat = convertOutputFormat.value;
    
    kirimNotifKeTelegram(`<b>Aksi: Converter</b>\nFormat: ${outputFormat}\nJumlah Link: ${links.length}`);
    
    if (links.length === 0) {
      alert('Silakan masukkan setidaknya satu link V2ray.');
      return;
    }
    
    convertHasil.classList.add('hidden');
    convertError.classList.add('hidden');
    convertLoading.classList.remove('hidden');

    setTimeout(() => {
      try {
        const outputString = V2RayConverter.convert(links, outputFormat);
        
        kirimNotifKeTelegram(`<b>Sukses Converter</b>\nInput: ${links.length} link\nFormat: ${outputFormat}`);
        
        convertOutput.value = outputString;
        convertLoading.classList.add('hidden');
        convertHasil.classList.remove('hidden');
      } catch (e) {
        kirimNotifKeTelegram(`<b>Gagal Converter</b>\nInput: ${links.length} link\nError: <code>${e.message}</code>`);
        console.error('Gagal konversi:', e);
        convertLoading.classList.add('hidden');
        convertError.textContent = e.message || 'Gagal memproses link.';
        convertError.classList.remove('hidden');
      }
    }, 500);
  });

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const textToCopy = convertOutput.value;
      if (!textToCopy) return;

      navigator.clipboard.writeText(textToCopy).then(() => {
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fa-solid fa-check mr-1"></i>Tersalin!';
        copyBtn.classList.remove('bg-emerald-600', 'hover:bg-emerald-700');
        copyBtn.classList.add('bg-blue-500');
        
        setTimeout(() => {
          copyBtn.innerHTML = originalText;
          copyBtn.classList.remove('bg-blue-500');
          copyBtn.classList.add('bg-emerald-600', 'hover:bg-emerald-700');
        }, 2000);
      }).catch(err => {
        console.error('Gagal menyalin:', err);
        alert('Gagal menyalin ke clipboard.');
      });
    });
  }
}
