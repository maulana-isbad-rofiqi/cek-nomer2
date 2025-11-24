/**
 * Main Application Script
 * Initializes all modules and handles user interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all modules
  DigitalClock.init();
  Slider.init();
  Navigation.init();
  
  // Initialize page handlers
  initCekKuota();
  initCekMyIp();
  initCekIpHost();
  initConverter();
  
  // Create floating elements
  createFloatingElements();
});

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
