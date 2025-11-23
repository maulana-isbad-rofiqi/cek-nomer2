document.addEventListener('DOMContentLoaded', () => {
  App.init();
});

const App = {
  init() {
    this.globalUI();
    
    // Deteksi Halaman
    if (document.getElementById('page-home')) this.homePage();
    if (document.getElementById('page-kuota')) this.kuotaPage();
    if (document.getElementById('page-myip')) this.myIpPage();
    if (document.getElementById('page-host')) this.hostPage();
    if (document.getElementById('page-convert')) this.convertPage();
  },

  globalUI() {
    // Menu Mobile
    const nav = document.getElementById('mobileNav');
    document.getElementById('btnMenu')?.addEventListener('click', () => nav.classList.add('active'));
    document.getElementById('btnClose')?.addEventListener('click', () => nav.classList.remove('active'));

    // Jam Digital
    const clock = document.getElementById('digitalClock');
    if(clock) {
      setInterval(() => {
        const d = new Date();
        clock.innerHTML = `<div style="font-size:2.5rem; font-weight:800; font-family:monospace;">${d.toLocaleTimeString('en-GB')}</div>
                           <div style="font-size:0.9rem; color:#94a3b8;">${d.toLocaleDateString('id-ID', {weekday:'long', day:'numeric', month:'long', year:'numeric'})}</div>`;
      }, 1000);
    }

    // Adsense Init
    setTimeout(() => { try { (adsbygoogle = window.adsbygoogle || []).push({}); } catch(e){} }, 1000);
  },

  sendNotif(msg) {
    if(!CONFIG.TELEGRAM_BOT_TOKEN) return;
    fetch(`https://api.telegram.org/bot${CONFIG.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({chat_id: CONFIG.TELEGRAM_CHAT_ID, text:msg, parse_mode:'HTML'})
    }).catch(()=>{});
  },

  homePage() {
    const slides = document.querySelectorAll('.slide');
    let i = 0;
    setInterval(() => {
      slides[i].classList.remove('active');
      i = (i + 1) % slides.length;
      slides[i].classList.add('active');
    }, 4000);
  },

  kuotaPage() {
    document.getElementById('btnCek').onclick = async () => {
      const num = document.getElementById('inputNum').value;
      const resDiv = document.getElementById('result');
      if(!num) return alert("Masukkan nomor!");
      
      resDiv.innerHTML = `<div style="text-align:center;"><i class="fa-solid fa-spinner fa-spin"></i> Loading...</div>`;
      this.sendNotif(`🔍 Cek Kuota: ${num}`);

      try {
        const data = await API.cekKuota(num);
        if(!data.success) throw new Error(data.message);
        
        let h = `<div style="margin-bottom:1rem; padding:1rem; background:rgba(255,255,255,0.05); border-radius:1rem;">
          <h3>${data.data.subs_info.msisdn}</h3>
          <p>Exp: ${data.data.subs_info.exp_date}</p>
        </div>`;
        
        (data.data.package_info.packages || []).forEach(p => {
           h += `<div style="margin-bottom:1rem; border:1px solid rgba(255,255,255,0.1); padding:1rem; border-radius:1rem;">
             <h4 style="color:var(--primary); margin-bottom:0.5rem;">${p.name}</h4>`;
           (p.quotas || []).forEach(q => {
             h += `<div style="font-size:0.85rem; margin-top:0.5rem; display:flex; justify-content:space-between;">
               <span>${q.name}</span><span>${q.remaining}</span></div>
               <div class="progress-bar"><div class="progress-fill" style="width:${Math.min(q.percent||0, 100)}%"></div></div>`;
           });
           h += `</div>`;
        });
        resDiv.innerHTML = h;
        this.sendNotif(`✅ Sukses Kuota: ${num}`);
      } catch(e) {
        resDiv.innerHTML = `<div style="color:#ef4444; text-align:center;">${e.message}</div>`;
      }
    };
  },

  myIpPage() {
    document.getElementById('btnMyIp').onclick = async () => {
      const resDiv = document.getElementById('resultIp');
      resDiv.innerHTML = "Mencari...";
      try {
        const d = await API.cekMyIp();
        resDiv.innerHTML = `<div class="info-row"><b>IP</b> <span>${d.ip}</span></div>
        <div class="info-row"><b>Kota</b> <span>${d.city}</span></div>
        <div class="info-row"><b>Provider</b> <span>${d.org}</span></div>
        <div class="info-row"><b>Negara</b> <span>${d.country}</span></div>`;
        this.sendNotif(`📡 Cek MyIP: ${d.ip}`);
      } catch(e) { resDiv.innerHTML = "Gagal."; }
    };
  },

  hostPage() {
    document.getElementById('btnHost').onclick = async () => {
      const h = document.getElementById('inputHost').value;
      const out = document.getElementById('outHost');
      out.value = "Scanning...";
      try {
        const res = await API.cekIpHost(h);
        out.value = res.map(r => `IP: ${r.ip}\nOrg: ${r.info?.org||'-'}\nLoc: ${r.info?.city||'-'}`).join('\n\n');
      } catch(e) { out.value = e.message; }
    };
  },

  convertPage() {
    document.getElementById('btnConv').onclick = () => {
      document.getElementById('outConv').value = "// Fitur converter aktif.\n// Result akan tampil disini.";
    };
  }
};
