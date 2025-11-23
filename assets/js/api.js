const API = {
  formatPhone(number) {
    let c = number.replace(/\D/g, '');
    if (c.startsWith('0')) return '62' + c.slice(1);
    if (c.startsWith('8')) return '62' + c;
    return c;
  },

  async fetchProxy(url) {
    const proxies = [
      `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
      `https://corsproxy.io/?${encodeURIComponent(url)}`,
      `https://thingproxy.freeboard.io/fetch/${encodeURIComponent(url)}`
    ];
    for (const p of proxies) {
      try {
        const res = await fetch(p);
        if (res.ok) return await res.json();
      } catch (e) {}
    }
    throw new Error('Koneksi sibuk.');
  },

  async cekKuota(number) {
    const url = `https://bendith.my.id/end.php?check=package&number=${this.formatPhone(number)}&version=2`;
    return await this.fetchProxy(url);
  },

  async cekMyIp() {
    const res = await fetch('https://ipinfo.io/json');
    if (!res.ok) throw new Error('Gagal ambil IP');
    return await res.json();
  },

  async cekIpHost(host) {
    const res = await fetch(`https://dns.google/resolve?name=${host}`);
    const data = await res.json();
    if (!data.Answer) throw new Error('Host tidak valid.');
    
    const ips = data.Answer.filter(a => a.type === 1 || a.type === 28).map(a => a.data);
    return Promise.all(ips.map(async ip => {
      try {
        const info = await fetch(`https://ipinfo.io/${ip}/json`).then(r => r.json());
        return { ip, info };
      } catch { return { ip, info: null }; }
    }));
  }
};
