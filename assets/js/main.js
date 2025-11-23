document.addEventListener('DOMContentLoaded', () => {
  App.init();
});

const App = {
  init() {
    this.setupUI();
    // Deteksi halaman aktif
    if(document.getElementById('page-home')) this.initHome();
    if(document.getElementById('page-kuota')) this.initKuota();
    if(document.getElementById('page-myip')) this.initMyIp();
    if(document.getElementById('page-host')) this.initHost();
    if(document.getElementById('page-convert')) this.initConvert();
  },

  setupUI() {
    // Menu Mobile
    const menu = document.getElementById('mobileNav');
    document.getElementById('btnMenu')?.addEventListener('click', () => menu.classList.add('active'));
    document.getElementById('btnClose')?.addEventListener('click', () => menu.classList.remove('active'));
    
    // Jam
    const clock = document.getElementById('digitalClock');
    if(clock) {
      setInterval(() => {
        const d = new Date();
        clock.innerHTML = `<h1 style="font-size:2.5rem; margin-bottom:5px;">${d.toLocaleTimeString('en-GB')}</h1>
                           <p style="color:#aaa;">${d.toLocaleDateString('id-ID', {weekday:'long', day:'numeric', month:'long', year:'numeric'})}</p>`;
      }, 1000);
    }
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
      if(!num) return alert("Nomor kosong!");
      
      res.innerHTML = `<div style="text-align:center; padding:20px;"><i class="fa-solid fa-spinner fa-spin"></i> Loading...</div>`;
      this.sendTele(`🔍 Cek Kuota: ${num}`);

      try {
        const d = await API.cekKuota(num);
        if(!d.success) throw new Error(d.message);
        
        let html = `<div style="text-align:center; margin-bottom:15px; padding-bottom:10px; border-bottom:1px solid #333;">
                      <h3>${d.data.subs_info.msisdn}</h3>
                      <p style="color:#aaa;">Aktif s/d: ${d.data.subs_info.exp_date}</p>
                    </div>`;
        
        const pkgs = d.data.package_info.packages || [];
        if(pkgs.length === 0) html += `<p style="text-align:center;">Tidak ada paket aktif.</p>`;
        
        pkgs.forEach(p => {
          html += `<div style="background:rgba(255,255,255,0.05); padding:15px; border-radius:10px; margin-bottom:10px;">
                     <div style="font-weight:bold; color:var(--primary); margin-bottom:5px;">${p.name}</div>`;
          (p.quotas || []).forEach(q => {
             html += `<div style="font-size:0.85rem; display:flex; justify-content:space-between; margin-top:5px;">
                        <span>${q.name}</span><span>${q.remaining}</span>
                      </div>
                      <div class="progress-bar"><div class="progress-fill" style="width:${Math.min(q.percent||0, 100)}%"></div></div>`;
          });
          html += `</div>`;
        });
        
        res.innerHTML = html;
        this.sendTele(`✅ Sukses: ${num}`);
      } catch(e) {
        res.innerHTML = `<div style="color:#ff4d4d; text-align:center; padding:20px;">Error: ${e.message}</div>`;
      }
    };
  },

  initMyIp() {
    document.getElementById('btnMyIp').onclick = async () => {
      const r = document.getElementById('resultIp');
      r.innerHTML = "Mencari...";
      try {
        const d = await API.cekMyIp();
        r.innerHTML = `<div class="info-row"><b>IP</b> <span>${d.ip}</span></div>
                       <div class="info-row"><b>Provider</b> <span>${d.org}</span></div>
                       <div class="info-row"><b>Kota</b> <span>${d.city}, ${d.region}</span></div>`;
      } catch(e) { r.innerHTML = "Gagal."; }
    };
  },

  initHost() {
    document.getElementById('btnHost').onclick = async () => {
      const h = document.getElementById('inputHost').value;
      const out = document.getElementById('outHost');
      if(!h) return alert("Isi host!");
      out.value = "Scanning...";
      try {
        const res = await API.cekIpHost(h);
        out.value = res.map(x => `IP: ${x.ip}\nOrg: ${x.info?.org||'-'}\nLoc: ${x.info?.city||'-'}`).join('\n\n');
      } catch(e) { out.value = e.message; }
    };
  },

  initConvert() {
    document.getElementById('btnConv').onclick = () => {
       document.getElementById('outConv').value = "// Fitur converter ini hanya simulasi UI.\n// Silakan integrasikan library V2Ray jika perlu.";
    };
  }
};
