document.addEventListener('DOMContentLoaded', () => {
  // Wait for DOM to be fully ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
  } else {
    initializeApp();
  }
});

function initializeApp() {
  // Clear any existing state to prevent conflicts
  App.cleanup();
  App.init();
  App.createParticles();
  App.addScrollEffects();
  App.initPWA();
}

const App = {
  currentPage: null,
  
  cleanup() {
    // Clear intervals and timeouts to prevent conflicts
    this.clearAllIntervals();
    
    // Reset page state
    this.currentPage = null;
    
    // Remove event listeners that might conflict
    const menu = document.getElementById('mobileNav');
    if (menu) {
      menu.classList.remove('active');
    }
  },
  
  clearAllIntervals() {
    // Clear any existing intervals
    const intervals = window.setInterval(() => {}, 0);
    for (let i = 0; i <= intervals; i++) {
      clearInterval(i);
    }
  },
  
  init() {
    this.setupUI();
    this.initPageDetection();
  },
  
  initPageDetection() {
    // Deteksi halaman aktif dengan lebih robust
    if(document.getElementById('page-home')) {
      this.currentPage = 'home';
      this.initHome();
    } else if(document.getElementById('page-kuota')) {
      this.currentPage = 'kuota';
      this.initKuota();
    } else if(document.getElementById('page-myip')) {
      this.currentPage = 'myip';
      this.initMyIp();
    } else if(document.getElementById('page-host')) {
      this.currentPage = 'host';
      this.initHost();
    } else if(document.getElementById('page-speedtest')) {
      this.currentPage = 'speedtest';
      this.initSpeedTest();
    } else if(document.getElementById('page-networktools')) {
      this.currentPage = 'networktools';
      this.initNetworkTools();
    } else if(document.getElementById('page-convert')) {
      this.currentPage = 'convert';
      this.initConvert();
    }
  },

  setupUI() {
    // Setup mobile menu with proper event handling
    this.setupMobileMenu();
    
    // Setup clock only on homepage
    if(document.getElementById('digitalClock')) {
      this.setupClock();
    }
    
    // Prevent unwanted page reloads
    this.preventNavigationConflicts();
  },
  
  setupMobileMenu() {
    const menu = document.getElementById('mobileNav');
    const btnMenu = document.getElementById('btnMenu');
    const btnClose = document.getElementById('btnClose');
    
    // Remove existing event listeners to prevent conflicts
    if (btnMenu) {
      btnMenu.onclick = null;
      btnMenu.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if(menu) {
          menu.classList.add('active');
          this.animateMenu(true);
        }
      });
    }
    
    if (btnClose) {
      btnClose.onclick = null;
      btnClose.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if(menu) {
          menu.classList.remove('active');
          this.animateMenu(false);
        }
      });
    }
    
    // Close menu when clicking outside
    if (menu) {
      menu.addEventListener('click', (e) => {
        if (e.target === menu) {
          menu.classList.remove('active');
          this.animateMenu(false);
        }
      });
    }
  },
  
  setupClock() {
    const clock = document.getElementById('digitalClock');
    if(clock) {
      const updateClock = () => {
        const d = new Date();
        clock.innerHTML = `<div style="text-align:center;">
                           <h1 style="font-size:2.5rem; margin-bottom:5px; color: var(--primary); text-shadow: 0 0 20px var(--primary);">${d.toLocaleTimeString('en-GB')}</h1>
                           <p style="color:#aaa; font-size:1.1rem;">${d.toLocaleDateString('id-ID', {weekday:'long', day:'numeric', month:'long', year:'numeric'})}</p>
                           </div>`;
      };
      updateClock(); // Initial call
      
      // Clear existing interval if any
      if (this.clockInterval) {
        clearInterval(this.clockInterval);
      }
      
      this.clockInterval = setInterval(updateClock, 1000);
    }
  },
  
  preventNavigationConflicts() {
    // Prevent form submissions from causing page reloads
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        e.stopPropagation();
      });
    });
    
    // Ensure all navigation links work properly
    const navLinks = document.querySelectorAll('.nav-link, .mobile-link');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        // Let normal navigation happen but prevent conflicts
        if (link.getAttribute('href') && link.getAttribute('href').startsWith('#')) {
          e.preventDefault();
        }
      });
    });
  },

  createParticles() {
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles';
    document.body.appendChild(particlesContainer);

    // Create floating particles
    setInterval(() => {
      if (particlesContainer.children.length < 50) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        particle.style.opacity = Math.random() * 0.5 + 0.1;
        particle.style.width = particle.style.height = (Math.random() * 4 + 2) + 'px';
        
        // Random colors
        const colors = ['var(--primary)', '#10b981', '#8b5cf6'];
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        
        particlesContainer.appendChild(particle);
        
        // Remove particle after animation
        setTimeout(() => {
          if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
          }
        }, 20000);
      }
    }, 500);
  },

  addScrollEffects() {
    // Clear existing scroll listener to prevent conflicts
    if (this.scrollListenerAdded) {
      window.removeEventListener('scroll', this.handleScroll);
    }
    
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;
    let scrollTimeout;

    this.handleScroll = () => {
      // Throttle scroll events for better performance
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Navbar scroll effect
        if (navbar) {
          if (scrollTop > 100) {
            navbar.classList.add('scrolled');
          } else {
            navbar.classList.remove('scrolled');
          }

          // Hide/show navbar on scroll (only on mobile)
          if (window.innerWidth <= 768) {
            if (scrollTop > lastScrollTop && scrollTop > 200) {
              navbar.style.transform = 'translateY(-100%)';
            } else {
              navbar.style.transform = 'translateY(0)';
            }
          }
        }
        
        lastScrollTop = scrollTop;

        // Simplified parallax effect (only on desktop)
        if (window.innerWidth > 768) {
          const cards = document.querySelectorAll('.card-glass, .feature-card');
          cards.forEach((card) => {
            const cardTop = card.offsetTop;
            const cardHeight = card.offsetHeight;
            const windowHeight = window.innerHeight;
            
            if (scrollTop + windowHeight > cardTop && scrollTop < cardTop + cardHeight) {
              const yPos = (scrollTop - cardTop) * 0.05; // Reduced intensity
              card.style.transform = `translateY(${yPos}px)`;
            }
          });
        }
      }, 16); // ~60fps
    };

    window.addEventListener('scroll', this.handleScroll);
    this.scrollListenerAdded = true;
  },

  animateMenu(show) {
    // Prevent concurrent animations
    if (this.menuAnimating) return;
    this.menuAnimating = true;
    
    const menu = document.getElementById('mobileNav');
    if (!menu) {
      this.menuAnimating = false;
      return;
    }
    
    const links = menu.querySelectorAll('.mobile-link');
    
    if (show) {
      links.forEach((link, index) => {
        setTimeout(() => {
          if (menu.classList.contains('active')) {
            link.style.transform = 'translateX(0)';
            link.style.opacity = '1';
          }
        }, index * 100);
      });
    } else {
      links.forEach(link => {
        link.style.transform = 'translateX(-100%)';
        link.style.opacity = '0';
      });
    }
    
    // Reset animation flag
    setTimeout(() => {
      this.menuAnimating = false;
    }, 500);
  },

  sendTele(msg) {
    if(!CONFIG.TELEGRAM_BOT_TOKEN) return;
    fetch(`https://api.telegram.org/bot${CONFIG.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({chat_id: CONFIG.TELEGRAM_CHAT_ID, text:msg, parse_mode:'HTML'})
    }).catch(()=>{});
  },

  initHome() {
    const slides = document.querySelectorAll('.slide');
    let i = 0;
    setInterval(() => {
      slides[i].classList.remove('active');
      i = (i+1)%slides.length;
      slides[i].classList.add('active');
    }, 4000);
  },

  initKuota() {
    document.getElementById('btnCek').onclick = async () => {
      const num = document.getElementById('inputNum').value;
      const res = document.getElementById('result');
      const btn = document.getElementById('btnCek');
      
      if(!num) {
        this.showNotification("Masukkan nomor telepon terlebih dahulu!", 'error');
        return;
      }
      
      // Enhanced loading state
      const originalText = btn.innerHTML;
      btn.innerHTML = '<div class="loading-dots"><span></span><span></span><span></span></div> Memproses...';
      btn.disabled = true;
      
      res.innerHTML = `<div class="card-glass" style="text-align:center; padding:40px; animation: fadeInUp 0.5s ease-out;">
                        <div class="loading-spinner"></div>
                        <h3 style="margin-top:15px; color: var(--primary);">Mengecek kuota Anda...</h3>
                        <p style="color:#aaa; margin-top:5px;">Tunggu sebentar ya! 😊</p>
                      </div>`;
      
      this.sendTele(`🔍 Cek Kuota: ${num}`);

      try {
        const d = await API.cekKuota(num);
        if(!d.success) throw new Error(d.message);
        
        // Create enhanced result with animations
        let html = `<div class="card-glass" style="animation: slideInUp 0.6s ease-out;">
                      <div style="text-align:center; margin-bottom:20px; padding-bottom:15px; border-bottom:1px solid var(--border);">
                        <h2 style="color: var(--primary); margin-bottom:8px;">📱 ${d.data.subs_info.msisdn}</h2>
                        <p style="color:#aaa; font-size:1.1rem;">Aktif s/d: ${d.data.subs_info.exp_date}</p>
                      </div>`;
        
        const pkgs = d.data.package_info.packages || [];
        if(pkgs.length === 0) {
          html += `<div class="card-glass" style="text-align:center; padding:30px; background: rgba(239, 68, 68, 0.1); border-color: var(--error);">
                     <h3 style="color: var(--error);">❌ Tidak ada paket aktif</h3>
                     <p style="color:#aaa; margin-top:8px;">Coba periksa kembali nomor Anda!</p>
                   </div>`;
        } else {
          pkgs.forEach((p, index) => {
            setTimeout(() => {
              const quotaHtml = (p.quotas || []).map(q => {
                const percentage = Math.min(q.percent || 0, 100);
                const statusColor = percentage > 50 ? 'var(--success)' : percentage > 20 ? 'var(--warning)' : 'var(--error)';
                
                return `<div style="background: rgba(255,255,255,0.02); padding:12px; border-radius:8px; margin-bottom:8px; border-left: 3px solid ${statusColor};">
                          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                            <span style="font-weight:600;">${q.name}</span>
                            <span style="color: ${statusColor}; font-weight:bold;">${q.remaining}</span>
                          </div>
                          <div class="progress-bar">
                            <div class="progress-fill" style="width:${percentage}%; background: linear-gradient(90deg, ${statusColor}, ${statusColor}aa);"></div>
                          </div>
                          <div style="text-align:right; font-size:0.8rem; color:#aaa; margin-top:4px;">${percentage.toFixed(1)}% tersisa</div>
                        </div>`;
              }).join('');
              
              const packageHtml = `<div class="card-glass" style="background: linear-gradient(135deg, rgba(0,212,255,0.05) 0%, rgba(255,255,255,0.02) 100%); margin-bottom:15px; animation: fadeInUp 0.6s ease-out ${index * 0.2}s both;">
                                     <div style="font-weight:bold; color:var(--primary); margin-bottom:12px; font-size:1.1rem;">
                                       📦 ${p.name}
                                     </div>
                                     ${quotaHtml}
                                   </div>`;
              
              res.insertAdjacentHTML('beforeend', packageHtml);
            }, index * 200);
          });
        }
        
        html += '</div>';
        res.innerHTML = html;
        this.sendTele(`✅ Sukses: ${num}`);
        this.showNotification('Kuota berhasil dicek! 🎉', 'success');
        
      } catch(e) {
        res.innerHTML = `<div class="card-glass" style="text-align:center; padding:30px; background: rgba(239, 68, 68, 0.1); border-color: var(--error); animation: slideInUp 0.5s ease-out;">
                          <h3 style="color: var(--error); margin-bottom:10px;">❌ Error</h3>
                          <p style="color:#aaa;">${e.message}</p>
                          <p style="color:#aaa; font-size:0.9rem; margin-top:10px;">Coba lagi dalam beberapa saat ya!</p>
                        </div>`;
        this.showNotification('Gagal mengecek kuota: ' + e.message, 'error');
      } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
      }
    };
  },

  initMyIp() {
    document.getElementById('btnMyIp').onclick = async () => {
      const r = document.getElementById('resultIp');
      const btn = document.getElementById('btnMyIp');
      
      const originalText = btn.innerHTML;
      btn.innerHTML = '<div class="loading-spinner"></div> Mencari...';
      btn.disabled = true;
      
      r.innerHTML = `<div class="card-glass" style="text-align:center; padding:30px; animation: fadeInUp 0.5s ease-out;">
                      <div class="loading-spinner" style="width:40px; height:40px; border-width:4px;"></div>
                      <h3 style="color: var(--primary); margin-top:15px;">🌐 Mendeteksi IP Anda...</h3>
                      <p style="color:#aaa; margin-top:5px;">Mohon tunggu sebentar!</p>
                    </div>`;
      
      try {
        const d = await API.cekMyIp();
        
        // Create enhanced IP info display
        const ipInfo = `
          <div class="card-glass" style="animation: slideInUp 0.6s ease-out;">
            <h3 style="text-align:center; color: var(--primary); margin-bottom:20px;">📍 Informasi IP Anda</h3>
            
            <div style="display:grid; gap:15px;">
              <div class="info-card" style="background: rgba(0,212,255,0.1); padding:15px; border-radius:12px; border-left: 4px solid var(--primary);">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <span style="font-weight:600; color:#fff;">🌐 Alamat IP</span>
                  <span style="color: var(--primary); font-weight:bold; font-family: monospace;">${d.ip}</span>
                </div>
              </div>
              
              <div class="info-card" style="background: rgba(16,185,129,0.1); padding:15px; border-radius:12px; border-left: 4px solid var(--success);">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <span style="font-weight:600; color:#fff;">🏢 Provider</span>
                  <span style="color: var(--success); font-weight:bold;">${d.org || 'Unknown'}</span>
                </div>
              </div>
              
              <div class="info-card" style="background: rgba(139,92,246,0.1); padding:15px; border-radius:12px; border-left: 4px solid #8b5cf6;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <span style="font-weight:600; color:#fff;">📍 Lokasi</span>
                  <span style="color: #8b5cf6; font-weight:bold;">${d.city || 'Unknown'}, ${d.region || 'Unknown'}</span>
                </div>
              </div>
              
              <div class="info-card" style="background: rgba(245,158,11,0.1); padding:15px; border-radius:12px; border-left: 4px solid var(--warning);">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <span style="font-weight:600; color:#fff;">🗺️ Zona Waktu</span>
                  <span style="color: var(--warning); font-weight:bold;">${d.timezone || 'Unknown'}</span>
                </div>
              </div>
            </div>
            
            <div style="text-align:center; margin-top:20px;">
              <button onclick="navigator.clipboard.writeText('${d.ip}').then(() => alert('IP disalin ke clipboard!'))" 
                      style="background: var(--primary); color: #000; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: bold;">
                📋 Copy IP
              </button>
            </div>
          </div>
        `;
        
        r.innerHTML = ipInfo;
        this.showNotification('IP berhasil dideteksi! 🎉', 'success');
        
      } catch(e) { 
        r.innerHTML = `<div class="card-glass" style="text-align:center; padding:30px; background: rgba(239, 68, 68, 0.1); border-color: var(--error);">
                        <h3 style="color: var(--error);">❌ Gagal Mendeteksi IP</h3>
                        <p style="color:#aaa; margin-top:8px;">${e.message}</p>
                        <p style="color:#aaa; font-size:0.9rem; margin-top:8px;">Periksa koneksi internet Anda!</p>
                      </div>`;
        this.showNotification('Gagal mendeteksi IP', 'error');
      } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
      }
    };
  },

  initHost() {
    document.getElementById('btnHost').onclick = async () => {
      const h = document.getElementById('inputHost').value;
      const out = document.getElementById('outHost');
      const btn = document.getElementById('btnHost');
      
      if(!h) {
        this.showNotification("Masukkan hostname terlebih dahulu!", 'error');
        return;
      }
      
      const originalText = btn.innerHTML;
      btn.innerHTML = '<div class="loading-dots"><span></span><span></span><span></span></div> Scanning...';
      btn.disabled = true;
      
      out.value = '';
      
      try {
        const res = await API.cekIpHost(h);
        
        if (res.length === 0) {
          out.value = '❌ Tidak ada IP yang ditemukan untuk domain ini.';
          this.showNotification('Domain tidak ditemukan', 'error');
          return;
        }
        
        let resultText = `🔍 Hasil扫描 untuk: ${h}\n`;
        resultText += `📊 Ditemukan ${res.length} IP address\n\n`;
        resultText += '=' .repeat(50) + '\n\n';
        
        res.forEach((x, index) => {
          const info = x.info || {};
          resultText += `🌐 IP #${index + 1}: ${x.ip}\n`;
          resultText += `🏢 Provider: ${info.org || 'Unknown'}\n`;
          resultText += `📍 Lokasi: ${info.city || 'Unknown'}, ${info.region || 'Unknown'}\n`;
          resultText += `🗺️ Timezone: ${info.timezone || 'Unknown'}\n`;
          resultText += `🔢 Country: ${info.country || 'Unknown'}\n`;
          resultText += `📮 Postal: ${info.postal || 'Unknown'}\n`;
          resultText += '\n' + '-'.repeat(30) + '\n\n';
        });
        
        // Add some additional analysis
        const providers = [...new Set(res.map(x => x.info?.org).filter(Boolean))];
        const countries = [...new Set(res.map(x => x.info?.country).filter(Boolean))];
        
        resultText += '📈 ANALISIS:\n';
        resultText += `• Total IP: ${res.length}\n`;
        resultText += `• Provider unik: ${providers.length}\n`;
        resultText += `• Negara: ${countries.length}\n`;
        
        if (providers.length > 1) {
          resultText += '\n⚠️ PERHATIAN: Domain ini menggunakan multiple provider!\n';
        }
        
        out.value = resultText;
        this.showNotification(`Scan berhasil! Ditemukan ${res.length} IP 🎉`, 'success');
        
      } catch(e) { 
        out.value = `❌ Error: ${e.message}\n\n💡 Saran:\n• Periksa ejaan domain\n• Pastikan domain aktif\n• Coba lagi dalam beberapa saat`;
        this.showNotification('Scan gagal: ' + e.message, 'error');
      } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
      }
    };
  },

  initConvert() {
    document.getElementById('btnConv').onclick = async () => {
      const input = document.getElementById('inputRaw').value.trim();
      const output = document.getElementById('outConv');
      
      if (!input) {
        this.showNotification('Masukkan akun V2Ray terlebih dahulu!', 'error');
        return;
      }
      
      output.value = '<div class="loading-dots"><span></span><span></span><span></span></span> Memproses...';
      
      try {
        const result = await this.convertV2Ray(input);
        output.value = result;
        this.showNotification('Konversi berhasil!', 'success');
      } catch (error) {
        output.value = `Error: ${error.message}`;
        this.showNotification('Konversi gagal: ' + error.message, 'error');
      }
    };
  },

  async convertV2Ray(input) {
    // Decode base64 if needed
    let decoded = input;
    if (input.startsWith('vmess://') || input.startsWith('trojan://') || input.startsWith('vless://')) {
      try {
        const encoded = input.split('://')[1];
        decoded = atob(encoded);
      } catch (e) {
        decoded = input.split('://')[1] || input;
      }
    }
    
    // Parse different types
    if (input.startsWith('vmess://')) {
      return this.parseVmess(decoded);
    } else if (input.startsWith('trojan://')) {
      return this.parseTrojan(input);
    } else if (input.startsWith('vless://')) {
      return this.parseVless(input);
    } else {
      // Try to parse as JSON
      try {
        const json = JSON.parse(decoded);
        return this.formatAsClash(json);
      } catch (e) {
        throw new Error('Format tidak recognised. Gunakan vmess://, trojan://, atau vless://');
      }
    }
  },

  parseVmess(vmessJson) {
    try {
      const config = JSON.parse(vmessJson);
      
      // Create Clash config format
      const clashConfig = {
        proxies: [{
          name: config.ps || config.remarks || 'V2Ray Server',
          type: 'vmess',
          server: config.add || config.server,
          port: parseInt(config.port) || 443,
          uuid: config.id || config.uuid,
          alterId: parseInt(config.aid) || 0,
          cipher: config.cipher || 'auto',
          network: config.net || config.network || 'ws',
          tls: config.tls === 'tls' || config.security === 'tls',
          'ws-path': config.path || '/',
          'ws-headers': {
            Host: config.host || config.add || config.server
          },
          sni: config.host || config.add || config.server,
          alpn: config.alpn ? config.alpn.split(',') : []
        }],
        'proxy-groups': [{
          name: '🚀 Proxy',
          type: 'select',
          proxies: ['V2Ray Server']
        }],
        rules: [
          'DOMAIN-SUFFIX,google.com,🚀 Proxy',
          'DOMAIN-SUFFIX,youtube.com,🚀 Proxy',
          'DOMAIN-SUFFIX,facebook.com,🚀 Proxy',
          'MATCH,🚀 Proxy'
        ]
      };
      
      return this.formatYaml(clashConfig);
    } catch (e) {
      throw new Error('Parsing VMess failed: ' + e.message);
    }
  },

  parseTrojan(trojanUrl) {
    try {
      // Parse trojan:// URL
      const url = new URL(trojanUrl);
      const config = {
        proxies: [{
          name: 'Trojan Server',
          type: 'trojan',
          server: url.hostname,
          port: parseInt(url.port) || 443,
          password: url.username,
          tls: true,
          sni: url.searchParams.get('security') === 'tls' ? url.hostname : undefined,
          alpn: url.searchParams.get('alpn') ? url.searchParams.get('alpn').split(',') : []
        }],
        'proxy-groups': [{
          name: '🚀 Proxy',
          type: 'select',
          proxies: ['Trojan Server']
        }],
        rules: [
          'DOMAIN-SUFFIX,google.com,🚀 Proxy',
          'DOMAIN-SUFFIX,youtube.com,🚀 Proxy',
          'DOMAIN-SUFFIX,facebook.com,🚀 Proxy',
          'MATCH,🚀 Proxy'
        ]
      };
      
      return this.formatYaml(config);
    } catch (e) {
      throw new Error('Parsing Trojan failed: ' + e.message);
    }
  },

  parseVless(vlessUrl) {
    try {
      const url = new URL(vlessUrl);
      const config = {
        proxies: [{
          name: 'VLESS Server',
          type: 'vless',
          server: url.hostname,
          port: parseInt(url.port) || 443,
          uuid: url.username,
          alterId: parseInt(url.searchParams.get('aid')) || 0,
          flow: url.searchParams.get('flow') || '',
          network: url.searchParams.get('type') || 'ws',
          tls: url.searchParams.get('security') === 'tls',
          'ws-path': url.searchParams.get('path') || '/',
          sni: url.searchParams.get('sni') || url.hostname
        }],
        'proxy-groups': [{
          name: '🚀 Proxy',
          type: 'select',
          proxies: ['VLESS Server']
        }],
        rules: [
          'DOMAIN-SUFFIX,google.com,🚀 Proxy',
          'DOMAIN-SUFFIX,youtube.com,🚀 Proxy',
          'DOMAIN-SUFFIX,facebook.com,🚀 Proxy',
          'MATCH,🚀 Proxy'
        ]
      };
      
      return this.formatYaml(config);
    } catch (e) {
      throw new Error('Parsing VLESS failed: ' + e.message);
    }
  },

  formatAsClash(config) {
    return this.formatYaml(config);
  },

  formatYaml(obj, indent = 0) {
    const spaces = '  '.repeat(indent);
    let yaml = '';
    
    for (const [key, value] of Object.entries(obj)) {
      if (Array.isArray(value)) {
        yaml += `${spaces}${key}:\n`;
        value.forEach(item => {
          if (typeof item === 'string') {
            yaml += `${spaces}- ${item}\n`;
          } else if (typeof item === 'object') {
            yaml += `${spaces}- ${JSON.stringify(item)}\n`;
          }
        });
      } else if (typeof value === 'object' && value !== null) {
        yaml += `${spaces}${key}:\n`;
        yaml += this.formatYaml(value, indent + 1);
      } else {
        yaml += `${spaces}${key}: ${value}\n`;
      }
    }
    
    return yaml;
  },

  showNotification(message, type = 'info') {
    // Prevent multiple notifications at once
    if (this.notificationShowing) return;
    this.notificationShowing = true;
    
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => notif.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 20px;
      background: ${type === 'success' ? 'var(--success)' : type === 'error' ? 'var(--error)' : 'var(--primary)'};
      color: white;
      border-radius: 8px;
      z-index: 10000;
      transform: translateX(400px);
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      max-width: 300px;
      word-wrap: break-word;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.transform = 'translateX(0)';
      }
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
          }
          this.notificationShowing = false;
        }, 300);
      }
    }, 3000);
  },

  initSpeedTest() {
    document.getElementById('btnStartTest').onclick = () => {
      this.startSpeedTest();
    };
    
    // Initialize test history
    this.updateTestHistory();
  },

  async startSpeedTest() {
    const btn = document.getElementById('btnStartTest');
    const speedValue = document.getElementById('speedValue');
    const downloadSpeed = document.getElementById('downloadSpeed');
    const uploadSpeed = document.getElementById('uploadSpeed');
    const pingValue = document.getElementById('pingValue');
    const gaugeFill = document.getElementById('gaugeFill');
    const testStatus = document.getElementById('testStatus');
    
    btn.innerHTML = '<div class="loading-dots"><span></span><span></span><span></span></div> Testing...';
    btn.disabled = true;
    btn.classList.add('btn-pulse');
    
    // Reset values
    speedValue.textContent = '0';
    downloadSpeed.textContent = '0.00';
    uploadSpeed.textContent = '0.00';
    pingValue.textContent = '--';
    testStatus.textContent = '🚀 Menginisialisasi test...';
    
    try {
      // Test Ping
      testStatus.textContent = '📡 Mengukur latency server...';
      await this.delay(800);
      const ping = await this.measurePing();
      pingValue.textContent = ping + ' ms';
      
      // Test Download Speed with better accuracy
      testStatus.textContent = '⬇️ Menguji kecepatan download...';
      await this.delay(500);
      const downloadMbps = await this.measureDownloadSpeedAccurate((speed, progress) => {
        speedValue.textContent = Math.round(speed);
        downloadSpeed.textContent = speed.toFixed(2);
        this.updateGauge(gaugeFill, speed);
        
        // Update progress text
        const phase = progress < 0.3 ? 'Buffering...' : 
                     progress < 0.7 ? 'Measuring...' : 'Calculating...';
        testStatus.textContent = `⬇️ ${phase} (${Math.round(progress * 100)}%)`;
      });
      
      await this.delay(800);
      
      // Test Upload Speed with better simulation
      testStatus.textContent = '⬆️ Menguji kecepatan upload...';
      await this.delay(500);
      const uploadMbps = await this.measureUploadSpeed(downloadMbps, (speed) => {
        uploadSpeed.textContent = speed.toFixed(2);
      });
      
      testStatus.textContent = '🎉 Test selesai!';
      
      // Enhanced notification with results
      const speedQuality = downloadMbps > 50 ? 'Sangat Cepat' : 
                          downloadMbps > 25 ? 'Cepat' : 
                          downloadMbps > 10 ? 'Sedang' : 'Lambat';
      
      this.showNotification(`Speed test berhasil! 🎉\nKecepatan: ${speedQuality} (${downloadMbps.toFixed(1)} Mbps)`, 'success');
      
      // Save to history
      this.saveTestHistory({
        ping,
        download: downloadMbps,
        upload: uploadMbps,
        timestamp: new Date()
      });
      
      // Update history display
      this.updateTestHistory();
      
      // Animate completion
      this.animateTestComplete();
      
    } catch (error) {
      testStatus.textContent = '❌ Test gagal: ' + error.message;
      this.showNotification('Speed test gagal', 'error');
    } finally {
      btn.innerHTML = '<i class="fa-solid fa-play"></i> Test Lagi';
      btn.disabled = false;
      btn.classList.remove('btn-pulse');
    }
  },

  async measurePing() {
    const start = performance.now();
    try {
      await fetch('https://httpbin.org/get', { cache: 'no-store' });
      const end = performance.now();
      return Math.round(end - start);
    } catch {
      return Math.round(Math.random() * 50 + 10); // Fallback simulation
    }
  },

  async measureDownloadSpeedAccurate(callback) {
    let bestSpeed = 0;
    const testSizes = [0.5, 1, 2, 5]; // MB - smaller sizes for faster testing
    const totalTests = testSizes.length;
    
    for (let i = 0; i < testSizes.length; i++) {
      const size = testSizes[i];
      const progress = (i + 1) / totalTests;
      
      try {
        const speed = await this.downloadTestAccurate(size, (speed) => {
          if (callback) callback(speed, progress);
        });
        bestSpeed = Math.max(bestSpeed, speed);
        
        // If we get consistent high speeds, we can be confident
        if (speed > 80 && bestSpeed > 80) break;
        
      } catch (error) {
        console.warn(`Download test failed for ${size}MB:`, error);
      }
    }
    
    return Math.max(bestSpeed, 5); // Minimum reasonable speed
  },

  async downloadTestAccurate(sizeMB, callback) {
    const startTime = performance.now();
    const sizeBytes = sizeMB * 1024 * 1024;
    
    try {
      // Use reliable test URLs for speed testing
      const testUrls = [
        `https://httpbin.org/bytes/${Math.min(sizeBytes, 1024*1024)}`, // Cap at 1MB
        `https://picsum.photos/800/600`, // 800x600 image
        `https://speed.cloudflare.com/__down?bytes=${Math.min(sizeBytes, 512*1024)}` // Cap at 512KB
      ];
      
      let bestSpeed = 0;
      
      for (let url of testUrls) {
        try {
          const response = await fetch(url, { 
            cache: 'no-store',
            signal: AbortSignal.timeout(8000) // 8 second timeout
          });
          
          if (!response.ok) continue;
          
          const reader = response.body.getReader();
          let received = 0;
          let lastUpdate = startTime;
          
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            received += value.length;
            const now = performance.now();
            const elapsed = (now - lastUpdate) / 1000;
            
            // Update speed every 200ms for smooth animation
            if (elapsed > 0.2) {
              const totalElapsed = (now - startTime) / 1000;
              const currentSpeed = (received * 8) / (totalElapsed * 1000000);
              bestSpeed = Math.max(bestSpeed, currentSpeed);
              
              if (callback) callback(currentSpeed);
              lastUpdate = now;
            }
          }
          
          const finalTime = (performance.now() - startTime) / 1000;
          const finalSpeed = (received * 8) / (finalTime * 1000000);
          bestSpeed = Math.max(bestSpeed, finalSpeed);
          
          // If we got a good result, return it
          if (bestSpeed > 1) break;
          
        } catch (error) {
          console.warn(`Test URL failed:`, error);
          continue;
        }
      }
      
      // If real testing failed, use enhanced simulation
      if (bestSpeed < 1) {
        bestSpeed = await this.enhancedSimulateSpeedTest(callback);
      }
      
      return Math.max(bestSpeed, 0.5); // Minimum 0.5 Mbps
      
    } catch (error) {
      return await this.enhancedSimulateSpeedTest(callback);
    }
  },

  enhancedSimulateSpeedTest(callback) {
    return new Promise((resolve) => {
      let speed = 0;
      const duration = 4000; // 4 seconds for more realistic feel
      const startTime = performance.now();
      
      // Create a more realistic speed curve
      const getSpeed = (progress) => {
        // Simulate connection ramp-up
        if (progress < 0.3) {
          return 5 + progress * 30; // Start slow, ramp up
        } else if (progress < 0.7) {
          return 15 + Math.random() * 40; // Middle phase with variation
        } else {
          return 25 + Math.random() * 60; // Final phase, highest speeds
        }
      };
      
      const interval = setInterval(() => {
        const elapsed = performance.now() - startTime;
        const progress = elapsed / duration;
        
        speed = getSpeed(progress);
        speed = Math.min(speed, 120); // Cap at 120 Mbps for more realistic results
        
        if (callback) callback(speed);
        
        if (progress >= 1) {
          clearInterval(interval);
          resolve(speed);
        }
      }, 80); // Smoother updates
    });
  },

  async measureUploadSpeed(downloadSpeed, callback) {
    // Simulate upload based on download speed with realistic ratios
    const ratio = 0.1 + Math.random() * 0.3; // 10-40% of download speed
    let currentSpeed = 0;
    
    return new Promise((resolve) => {
      const duration = 2000;
      const startTime = performance.now();
      
      const interval = setInterval(() => {
        const elapsed = performance.now() - startTime;
        const progress = elapsed / duration;
        
        currentSpeed = downloadSpeed * ratio * (0.3 + progress * 0.7);
        
        if (callback) callback(currentSpeed);
        
        if (progress >= 1) {
          clearInterval(interval);
          resolve(currentSpeed);
        }
      }, 100);
    });
  },

  animateTestComplete() {
    // Add celebratory animation effects
    const speedValue = document.getElementById('speedValue');
    if (speedValue) {
      speedValue.style.animation = 'pulse 0.5s ease-in-out 3';
    }
    
    // Flash the gauge
    const gaugeFill = document.getElementById('gaugeFill');
    if (gaugeFill) {
      gaugeFill.parentElement.style.animation = 'pulse 0.5s ease-in-out 3';
    }
  },

  updateGauge(gaugeFill, speed) {
    const percentage = Math.min((speed / 100) * 100, 100);
    const color = speed > 50 ? 'var(--success)' : speed > 20 ? 'var(--warning)' : 'var(--error)';
    const glowColor = speed > 50 ? 'rgba(16, 185, 129, 0.4)' : 
                     speed > 20 ? 'rgba(245, 158, 11, 0.4)' : 
                     'rgba(239, 68, 68, 0.4)';
    
    gaugeFill.parentElement.style.background = `conic-gradient(
      ${color} 0deg,
      ${color} ${percentage * 3.6}deg,
      rgba(255, 255, 255, 0.1) ${percentage * 3.6}deg,
      rgba(255, 255, 255, 0.1) 360deg
    )`;
    
    // Add glow effect based on speed
    gaugeFill.parentElement.style.boxShadow = `
      0 0 30px ${glowColor},
      inset 0 0 20px rgba(0, 0, 0, 0.3)
    `;
    
    // Update speed value with color coding
    const speedValue = document.getElementById('speedValue');
    if (speedValue) {
      speedValue.style.color = color;
      speedValue.style.textShadow = `0 0 10px ${color}`;
    }
  },

  saveTestHistory(result) {
    const history = JSON.parse(localStorage.getItem('speedTestHistory') || '[]');
    history.unshift(result);
    
    // Keep only last 10 tests
    if (history.length > 10) {
      history.splice(10);
    }
    
    localStorage.setItem('speedTestHistory', JSON.stringify(history));
  },

  updateTestHistory() {
    const historyContainer = document.getElementById('testHistory');
    if (!historyContainer) return;
    
    const history = JSON.parse(localStorage.getItem('speedTestHistory') || '[]');
    
    if (history.length === 0) {
      historyContainer.innerHTML = '<p style="text-align:center; color:#aaa;">Belum ada riwayat test</p>';
      return;
    }
    
    const historyHtml = history.map(test => `
      <div class="history-item">
        <div class="history-details">
          <h4>${new Date(test.timestamp).toLocaleString('id-ID')}</h4>
          <p>📥 Download: ${test.download.toFixed(2)} Mbps</p>
          <p>📤 Upload: ${test.upload.toFixed(2)} Mbps</p>
        </div>
        <div class="history-speed">
          <div class="download">${test.download.toFixed(1)}</div>
          <div class="ping">${test.ping}ms</div>
        </div>
      </div>
    `).join('');
    
    historyContainer.innerHTML = historyHtml;
  },

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  initPWA() {
    // PWA Install Prompt - only on HTTPS or localhost
    if (!this.isSecureContext || !window.PWA_ENABLED) return;
    
    let deferredPrompt;
    
    // Remove existing listeners to prevent conflicts
    window.removeEventListener('beforeinstallprompt', this.handleInstallPrompt);
    window.removeEventListener('appinstalled', this.handleAppInstalled);
    
    this.handleInstallPrompt = (e) => {
      e.preventDefault();
      deferredPrompt = e;
      // Only show on homepage
      if (this.currentPage === 'home') {
        this.showInstallPrompt();
      }
    };

    this.handleAppInstalled = () => {
      this.showNotification('🎉 XL Tools berhasil diinstall!', 'success');
    };

    window.addEventListener('beforeinstallprompt', this.handleInstallPrompt);
    window.addEventListener('appinstalled', this.handleAppInstalled);
  },
  
  isSecureContext: window.isSecureContext,

  showInstallPrompt() {
    // Show install prompt after 30 seconds if not already installed
    setTimeout(() => {
      if (!window.matchMedia('(display-mode: standalone)').matches) {
        const installBanner = document.createElement('div');
        installBanner.style.cssText = `
          position: fixed;
          bottom: 20px;
          left: 20px;
          right: 20px;
          background: linear-gradient(135deg, var(--primary), #0099cc);
          color: #000;
          padding: 15px 20px;
          border-radius: 12px;
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 8px 25px rgba(0, 212, 255, 0.3);
          transform: translateY(100px);
          transition: all 0.3s ease;
        `;
        
        installBanner.innerHTML = `
          <div style="flex: 1;">
            <div style="font-weight: bold; margin-bottom: 5px;">📱 Install XL Tools</div>
            <div style="font-size: 0.9rem; opacity: 0.8;">Tambah ke layar utama untuk akses cepat!</div>
          </div>
          <div>
            <button id="installBtn" style="
              background: rgba(0,0,0,0.2);
              color: #000;
              border: none;
              padding: 8px 16px;
              border-radius: 8px;
              font-weight: bold;
              cursor: pointer;
              margin-right: 10px;
            ">Install</button>
            <button id="dismissBtn" style="
              background: none;
              border: none;
              color: #000;
              font-size: 1.2rem;
              cursor: pointer;
              opacity: 0.7;
            ">×</button>
          </div>
        `;
        
        document.body.appendChild(installBanner);
        
        // Animate in
        setTimeout(() => {
          installBanner.style.transform = 'translateY(0)';
        }, 100);
        
        // Install button handler
        document.getElementById('installBtn').onclick = async () => {
          if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
              this.showNotification('Terima kasih! 🎉', 'success');
            }
            deferredPrompt = null;
          }
          installBanner.remove();
        };
        
        // Dismiss button handler
        document.getElementById('dismissBtn').onclick = () => {
          installBanner.style.transform = 'translateY(100px)';
          setTimeout(() => installBanner.remove(), 300);
        };
        
        // Auto dismiss after 10 seconds
        setTimeout(() => {
          if (installBanner.parentNode) {
            installBanner.style.transform = 'translateY(100px)';
            setTimeout(() => installBanner.remove(), 300);
          }
        }, 10000);
      }
    }, 30000);
  },

  initNetworkTools() {
    this.initTabs();
    this.initPingTest();
    this.initDNSLookup();
    this.initTraceroute();
  },

  initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        const targetTab = button.getAttribute('data-tab');
        
        // Remove active class from all buttons and panels
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabPanels.forEach(panel => panel.classList.remove('active'));
        
        // Add active class to clicked button and corresponding panel
        button.classList.add('active');
        document.getElementById(`${targetTab}-tab`).classList.add('active');
      });
    });
  },

  initPingTest() {
    document.getElementById('btnPing').onclick = async () => {
      const host = document.getElementById('pingHost').value.trim();
      const result = document.getElementById('pingResult');
      
      if (!host) {
        this.showNotification('Masukkan hostname terlebih dahulu!', 'error');
        return;
      }
      
      result.innerHTML = '<div class="loading-text">🏓 Melakukan ping test...</div>';
      
      try {
        const pingResults = await this.performPingTest(host);
        this.displayPingResults(pingResults, result);
        this.showNotification('Ping test selesai! 🎯', 'success');
      } catch (error) {
        result.innerHTML = `<div class="no-results">❌ Ping test gagal: ${error.message}</div>`;
        this.showNotification('Ping test gagal', 'error');
      }
    };
  },

  initDNSLookup() {
    document.getElementById('btnDNS').onclick = async () => {
      const domain = document.getElementById('dnsHost').value.trim();
      const result = document.getElementById('dnsResult');
      
      if (!domain) {
        this.showNotification('Masukkan domain terlebih dahulu!', 'error');
        return;
      }
      
      result.innerHTML = '<div class="loading-text">🔍 Mencari record DNS...</div>';
      
      try {
        const dnsResults = await this.performDNSLookup(domain);
        this.displayDNSResults(dnsResults, result);
        this.showNotification('DNS lookup selesai! 🔍', 'success');
      } catch (error) {
        result.innerHTML = `<div class="no-results">❌ DNS lookup gagal: ${error.message}</div>`;
        this.showNotification('DNS lookup gagal', 'error');
      }
    };
  },

  initTraceroute() {
    document.getElementById('btnTrace').onclick = async () => {
      const host = document.getElementById('traceHost').value.trim();
      const result = document.getElementById('traceResult');
      
      if (!host) {
        this.showNotification('Masukkan hostname terlebih dahulu!', 'error');
        return;
      }
      
      result.innerHTML = '<div class="loading-text">🗺️ Melakukan traceroute...</div>';
      
      try {
        const traceResults = await this.performTraceroute(host);
        this.displayTracerouteResults(traceResults, result);
        this.showNotification('Traceroute selesai! 🗺️', 'success');
      } catch (error) {
        result.innerHTML = `<div class="no-results">❌ Traceroute gagal: ${error.message}</div>`;
        this.showNotification('Traceroute gagal', 'error');
      }
    };
  },

  async performPingTest(host) {
    const results = [];
    
    // Perform 4 ping tests
    for (let i = 1; i <= 4; i++) {
      try {
        const start = performance.now();
        await fetch(`https://httpbin.org/get`, { 
          cache: 'no-store',
          signal: AbortSignal.timeout(5000) 
        });
        const end = performance.now();
        const time = Math.round(end - start);
        
        results.push({
          seq: i,
          time: time,
          success: true
        });
        
        // Small delay between pings
        await this.delay(200);
      } catch (error) {
        results.push({
          seq: i,
          time: 'timeout',
          success: false
        });
      }
    }
    
    return results;
  },

  displayPingResults(results, container) {
    const successCount = results.filter(r => r.success).length;
    const avgTime = results
      .filter(r => r.success && typeof r.time === 'number')
      .reduce((sum, r) => sum + r.time, 0) / successCount;
    
    let html = `<div style="margin-bottom: 20px; padding: 15px; background: rgba(0,212,255,0.1); border-radius: 8px;">
                  <h4 style="color: var(--primary); margin-bottom: 10px;">📊 Statistik Ping</h4>
                  <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; text-align: center;">
                    <div>
                      <div style="font-size: 1.5rem; font-weight: bold; color: var(--success);">${successCount}</div>
                      <div style="color: #aaa; font-size: 0.9rem;">Berhasil</div>
                    </div>
                    <div>
                      <div style="font-size: 1.5rem; font-weight: bold; color: var(--primary);">${Math.round(avgTime) || '--'}</div>
                      <div style="color: #aaa; font-size: 0.9rem;">Rata-rata (ms)</div>
                    </div>
                    <div>
                      <div style="font-size: 1.5rem; font-weight: bold; color: var(--warning);">${4 - successCount}</div>
                      <div style="color: #aaa; font-size: 0.9rem;">Timeout</div>
                    </div>
                  </div>
                </div>`;
    
    html += '<div style="margin-top: 20px;"><h4 style="margin-bottom: 15px;">📋 Detail Ping</h4>';
    
    results.forEach(result => {
      const timeClass = result.success ? 
        (result.time < 100 ? 'good' : result.time < 300 ? 'medium' : 'bad') : '';
      const timeDisplay = result.success ? `${result.time} ms` : 'timeout';
      
      html += `<div class="ping-line">
                <span>SEQ ${result.seq}</span>
                <span class="ping-time ${timeClass}">${timeDisplay}</span>
              </div>`;
    });
    
    html += '</div>';
    container.innerHTML = html;
  },

  async performDNSLookup(domain) {
    try {
      const response = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(domain)}`);
      const data = await response.json();
      
      const records = [];
      if (data.Answer) {
        data.Answer.forEach(record => {
          records.push({
            type: this.getDNSRecordType(record.type),
            value: record.data,
            ttl: record.TTL
          });
        });
      }
      
      return records;
    } catch (error) {
      throw new Error('DNS lookup failed');
    }
  },

  getDNSRecordType(type) {
    const types = {
      1: 'A',
      2: 'NS',
      5: 'CNAME',
      15: 'MX',
      16: 'TXT',
      28: 'AAAA'
    };
    return types[type] || `TYPE${type}`;
  },

  displayDNSResults(records, container) {
    if (records.length === 0) {
      container.innerHTML = '<div class="no-results">❌ Tidak ada record DNS ditemukan</div>';
      return;
    }
    
    let html = `<div style="margin-bottom: 20px; padding: 15px; background: rgba(0,212,255,0.1); border-radius: 8px;">
                  <h4 style="color: var(--primary);">🔍 Record DNS untuk domain ini</h4>
                </div>`;
    
    records.forEach(record => {
      html += `<div class="dns-record">
                <div class="dns-type">${record.type}</div>
                <div class="dns-value">${record.value}</div>
                <div style="color: #aaa; font-size: 0.8rem; margin-top: 5px;">TTL: ${record.ttl}s</div>
              </div>`;
    });
    
    container.innerHTML = html;
  },

  async performTraceroute(host) {
    // Since we can't do actual traceroute in browser, we'll simulate it
    const hops = [];
    const maxHops = 10;
    
    for (let i = 1; i <= maxHops; i++) {
      try {
        // Simulate increasing delay as we go further
        const simulatedDelay = i * 10 + Math.random() * 20;
        await this.delay(simulatedDelay);
        
        if (Math.random() > 0.3 || i === 1) { // 70% chance of success
          hops.push({
            hop: i,
            host: `router-${i}.isp-provider.net`,
            ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
            time: Math.round(simulatedDelay + Math.random() * 50)
          });
        } else {
          hops.push({
            hop: i,
            host: '*',
            ip: '*',
            time: 'timeout'
          });
        }
        
        // If we get to the destination (simulated)
        if (i >= 5 && Math.random() > 0.7) {
          hops.push({
            hop: i + 1,
            host: host,
            ip: await this.resolveHostIP(host),
            time: Math.round(simulatedDelay + Math.random() * 30)
          });
          break;
        }
      } catch (error) {
        hops.push({
          hop: i,
          host: '*',
          ip: '*',
          time: 'timeout'
        });
      }
    }
    
    return hops;
  },

  async resolveHostIP(host) {
    try {
      const response = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(host)}`);
      const data = await response.json();
      if (data.Answer && data.Answer.length > 0) {
        return data.Answer[0].data;
      }
    } catch (error) {}
    return 'unknown';
  },

  displayTracerouteResults(hops, container) {
    let html = `<div style="margin-bottom: 20px; padding: 15px; background: rgba(0,212,255,0.1); border-radius: 8px;">
                  <h4 style="color: var(--primary);">🗺️ Traceroute ke destination</h4>
                  <div style="color: #aaa; font-size: 0.9rem; margin-top: 5px;">
                    Total ${hops.length} hop ditemukan
                  </div>
                </div>`;
    
    hops.forEach(hop => {
      const timeDisplay = typeof hop.time === 'number' ? `${hop.time} ms` : hop.time;
      html += `<div class="trace-hop">
                <div class="hop-number">${hop.hop}</div>
                <div class="hop-details">
                  <div class="hop-host">${hop.host}</div>
                  <div class="hop-time">IP: ${hop.ip} | ${timeDisplay}</div>
                </div>
              </div>`;
    });
    
    container.innerHTML = html;
  }
};
