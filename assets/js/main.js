document.addEventListener('DOMContentLoaded', () => {
  App.init();
});

const App = {
  init() {
    this.globalSetup(); // Jam, Navbar Mobile, Notif Telegram
    
    // Cek halaman mana yang aktif berdasarkan elemen yang ada
    if (document.getElementById('page-home')) this.initHome();
    if (document.getElementById('page-cek-kuota')) this.initCekKuota();
    if (document.getElementById('page-ip-host')) this.initIpHost();
    if (document.getElementById('page-converter')) this.initConverter();
  },

  // --- FITUR GLOBAL (Jalan di semua halaman) ---
  globalSetup() {
    // 1. Mobile Menu Toggle
    const btn = document.getElementById('hamburgerBtn');
    const menu = document.getElementById('mobileMenu');
    const close = document.getElementById('closeMobile');
    
    if(btn) btn.onclick = () => menu.classList.add('active');
    if(close) close.onclick = () => menu.classList.remove('active');

    // 2. Jam Digital
    const timeEl = document.getElementById('clockTime');
    const dateEl = document.getElementById('clockDate');
    if(timeEl) {
        setInterval(() => {
            const now = new Date();
            timeEl.innerText = now.toLocaleTimeString('en-GB');
            dateEl.innerText = now.toLocaleDateString('id-ID', {weekday:'long', day:'numeric', month:'long', year:'numeric'});
        }, 1000);
    }

    // 3. Notifikasi Pengunjung (Sekali per sesi)
    if (!sessionStorage.getItem('visited')) {
      fetch('https://ipinfo.io/json')
        .then(r => r.json())
        .then(d => {
          this.sendTelegram(`🔔 <b>Pengunjung Baru</b>\nIP: ${d.ip}\nKota: ${d.city}\nDevice: ${navigator.platform}`);
          sessionStorage.setItem('visited', 'true');
        });
    }

    // 4. Init Adsense
    setTimeout(() => {
       try { (adsbygoogle = window.adsbygoogle || []).push({}); } catch(e){}
    }, 1000);
  },

  // --- HALAMAN BERANDA ---
  initHome() {
    const slides = document.querySelectorAll('.slide');
    if(!slides.length) return;
    
    let current = 0;
    setInterval(() => {
        slides[current].classList.remove('active');
        current = (current + 1) % slides.length;
        slides[current].classList.add('active');
    }, 4000);
  },

  // --- HALAMAN CEK KUOTA ---
  initCekKuota() {
    const btn = document.getElementById('btnCek');
    const input = document.getElementById('inputNomor');
    const output = document.getElementById('hasilOutput');
    const loading = document.getElementById('loadingBox');

    btn.onclick = async () => {
      const num = input.value;
      if(!num) return alert("Masukkan nomor HP!");

      loading.classList.remove('hidden');
      output.innerHTML = '';
      this.sendTelegram(`🔎 <b>Cek Kuota</b>\nInput: ${num}`);

      try {
        const res = await API.cekKuota(num);
        loading.classList.add('hidden');

        if(!res.success) throw new Error(res.message);

        // Render HTML Hasil
        let html = `<div class="info-box"><h3>Nomor: ${res.data.subs_info.msisdn}</h3>`;
        html += `<p>Masa Aktif: ${res.data.subs_info.exp_date}</p></div>`;
        
        const pkgs = res.data.package_info.packages || [];
        if(pkgs.length === 0) html += `<p>Tidak ada paket aktif.</p>`;
        
        pkgs.forEach(p => {
          html += `<div class="paket-card"><h4>${p.name}</h4>`;
          if(p.quotas) {
            p.quotas.forEach(q => {
               const pct = Math.min(q.percent || 0, 100);
               html += `<div class="quota-row"><span>${q.name}</span><span>${q.remaining}/${q.total}</span></div>
                        <div class="bar-bg"><div class="bar-fill" style="width:${pct}%"></div></div>`;
            });
          }
          html += `</div>`;
        });

        output.innerHTML = html;
        this.sendTelegram(`✅ <b>Sukses Kuota</b>\n${num}`);

      } catch (e) {
        loading.classList.add('hidden');
        output.innerHTML = `<div class="error-box">${e.message}</div>`;
        this.sendTelegram(`❌ <b>Gagal Kuota</b>\n${e.message}`);
      }
    };
  },

  // --- HALAMAN IP HOST ---
  initIpHost() {
    const btn = document.getElementById('btnHost');
    const input = document.getElementById('inputHost');
    const out = document.getElementById('textOutput');

    btn.onclick = async () => {
       const host = input.value;
       if(!host) return alert("Isi hostname!");
       out.value = "Sedang mencari...";
       
       try {
         const data = await API.cekIpHost(host);
         let txt = `Host: ${host}\n\n`;
         data.forEach(d => {
            txt += `IP: ${d.ip}\nOrg: ${d.info ? d.info.org : '-'}\nLoc: ${d.info ? d.info.city : '-'}\n\n`;
         });
         out.value = txt;
       } catch(e) {
         out.value = "Error: " + e.message;
       }
    };
  },

  // --- HALAMAN CONVERTER ---
  initConverter() {
    document.getElementById('btnConvert').onclick = () => {
        const raw = document.getElementById('inputRaw').value;
        const mode = document.getElementById('selectMode').value;
        
        if(!raw) return alert("Kosong!");
        
        // Logika dummy (bisa diganti kode converter lengkap V2RayConverter)
        const lines = raw.split('\n').filter(x=>x);
        document.getElementById('outputConvert').value = `// Sukses convert ${lines.length} akun ke ${mode}.\n\n(Logika konversi disederhanakan untuk demo)`;
    };
  },

  // --- UTILS ---
  sendTelegram(msg) {
    if(!CONFIG.TELEGRAM_BOT_TOKEN) return;
    fetch(`https://api.telegram.org/bot${CONFIG.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({chat_id: CONFIG.TELEGRAM_CHAT_ID, text:msg, parse_mode:'HTML'})
    }).catch(()=>{});
  }
};
