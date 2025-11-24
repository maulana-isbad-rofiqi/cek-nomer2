/**
 * API Module
 * Handles all API calls for the application
 */

const API = {
  /**
   * Format nomor telepon ke format yang benar
   * @param {string} phone - Nomor telepon
   * @returns {string} - Nomor telepon yang sudah diformat
   */
  formatNumber(phone) {
    let cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('62')) return cleaned;
    if (cleaned.startsWith('0')) return '62' + cleaned.substring(1);
    if (cleaned.startsWith('8')) return '62' + cleaned;
    return cleaned;
  },

  /**
   * Fetch data melalui proxy untuk menghindari CORS
   * @param {string} number - Nomor telepon
   * @returns {Promise} - Data hasil fetch
   */
  async fetchWithProxy(number) {
    const formatted = this.formatNumber(number);
    const url = `https://bendith.my.id/end.php?check=package&number=${formatted}&version=2`;
    const proxies = [
      `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
      `https://corsproxy.io/?${encodeURIComponent(url)}`,
      `https://thingproxy.freeboard.io/fetch/${encodeURIComponent(url)}`
    ];

    for (const proxy of proxies) {
      try {
        const res = await fetch(proxy);
        if (res.ok) return await res.json();
      } catch (e) {
        console.error(`Proxy failed: ${proxy}`, e);
      }
    }
    throw new Error('Semua proxy gagal.');
  },

  /**
   * Cek kuota nomor XL/Axis
   * @param {string} number - Nomor telepon
   * @returns {Promise} - Data kuota
   */
  async cekKuota(number) {
    try {
      const data = await this.fetchWithProxy(number);
      return data;
    } catch (error) {
      throw new Error('Gagal mengambil data kuota: ' + error.message);
    }
  },

  /**
   * Cek IP publik user
   * @returns {Promise} - Data IP
   */
  async cekMyIp() {
    try {
      const response = await fetch('https://ipinfo.io/json');
      if (!response.ok) {
        throw new Error('Respon jaringan tidak OK');
      }
      return await response.json();
    } catch (error) {
      throw new Error('Gagal mengambil informasi IP: ' + error.message);
    }
  },

  /**
   * Cek IP dari hostname
   * @param {string} hostname - Nama host
   * @returns {Promise} - Data IP dan detail
   */
  async cekIpHost(hostname) {
    try {
      const dnsResponse = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(hostname)}`);
      if (!dnsResponse.ok) {
        throw new Error('Respon DNS tidak OK');
      }
      const dnsData = await dnsResponse.json();

      if (dnsData.Status !== 0) {
        throw new Error(`Hostname tidak ditemukan (Status: ${dnsData.Status})`);
      }

      if (!dnsData.Answer || dnsData.Answer.length === 0) {
        throw new Error("Tidak ada jawaban DNS untuk host tersebut.");
      }

      const ipAddresses = dnsData.Answer
        .filter(ans => ans.type === 1 || ans.type === 28)
        .map(ans => ans.data);

      if (ipAddresses.length === 0) {
        throw new Error("Tidak ditemukan record A atau AAAA.");
      }

      const fetchPromises = ipAddresses.map(ip =>
        fetch(`https://ipinfo.io/${ip}/json`)
          .then(res => {
            if (!res.ok) throw new Error(`Status ${res.status}`);
            return res.json();
          })
          .then(ipDetails => ({ ip, details: ipDetails }))
          .catch(e => ({ ip, error: e.message }))
      );

      return await Promise.all(fetchPromises);
    } catch (error) {
      throw new Error('Gagal DNS lookup: ' + error.message);
    }
  }
};
