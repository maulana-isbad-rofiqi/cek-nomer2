const API = {
  formatPhone(n) {
    let c = n.replace(/\D/g, '');
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
    throw new Error('Server sibuk, coba lagi nanti.');
  },
  async cekKuota(num) {
    const url = `https://bendith.my.id/end.php?check=package&number=${this.formatPhone(num)}&version=2`;
    return await this.fetchProxy(url);
  },
  async cekMyIp() {
    return await fetch('https://ipinfo.io/json').then(r => r.json());
  },
  async cekIpHost(host) {
    const data = await fetch(`https://dns.google/resolve?name=${host}`).then(r => r.json());
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
