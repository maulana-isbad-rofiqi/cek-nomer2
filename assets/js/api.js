const API = {
  // Format nomor HP 08/62/8 jadi 628...
  formatPhone(number) {
    let clean = number.replace(/\D/g, '');
    if (clean.startsWith('0')) return '62' + clean.slice(1);
    if (clean.startsWith('8')) return '62' + clean;
    return clean;
  },

  // Cek Kuota lewat Proxy
  async cekKuota(number) {
    const formatted = this.formatPhone(number);
    const targetUrl = `https://bendith.my.id/end.php?check=package&number=${formatted}&version=2`;
    
    // Gunakan beberapa proxy cadangan
    const proxies = [
      `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`,
      `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`,
      `https://thingproxy.freeboard.io/fetch/${encodeURIComponent(targetUrl)}`
    ];

    for (const proxy of proxies) {
      try {
        const res = await fetch(proxy);
        if (res.ok) return await res.json();
      } catch (e) { console.warn('Proxy skip:', proxy); }
    }
    throw new Error('Semua jalur sibuk, coba lagi nanti.');
  },

  // Cek IP Host
  async cekIpHost(hostname) {
    const dnsRes = await fetch(`https://dns.google/resolve?name=${hostname}`);
    const dnsData = await dnsRes.json();
    
    if (!dnsData.Answer) throw new Error('Host tidak ditemukan.');
    
    // Ambil semua IP
    const ips = dnsData.Answer.filter(a => a.type === 1 || a.type === 28).map(a => a.data);
    
    // Cek detail tiap IP di ipinfo
    return Promise.all(ips.map(async ip => {
       try {
         const info = await fetch(`https://ipinfo.io/${ip}/json`).then(r => r.json());
         return { ip, info };
       } catch { return { ip, info: null }; }
    }));
  }
};
