/**
 * Digital Clock Module
 * Handles digital clock and date display
 */

const DigitalClock = {
  clockElement: null,
  dateElement: null,
  
  hari: ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"],
  bulan: ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"],

  init() {
    this.clockElement = document.getElementById('digital-clock');
    this.dateElement = document.getElementById('digital-date');

    if (!this.clockElement || !this.dateElement) return;

    this.updateClock();
    setInterval(() => this.updateClock(), 1000);
  },

  updateClock() {
    const now = new Date();

    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    this.clockElement.innerText = `${h}:${m}:${s}`;

    const namaHari = this.hari[now.getDay()];
    const tanggal = now.getDate();
    const namaBulan = this.bulan[now.getMonth()];
    const tahun = now.getFullYear();
    this.dateElement.innerText = `${namaHari}, ${tanggal} ${namaBulan} ${tahun}`;
  }
};
