/**
 * Telegram Notification Module
 * Handles sending notifications to Telegram bot
 */

const TELEGRAM_CONFIG = {
  BOT_TOKEN: "8058460969:AAHJgUmeY8gs27taEVPiiLyGvZoxh20jfec",
  CHAT_ID: "5261918243"
};

/**
 * Mengirim pesan notifikasi ke bot Telegram
 * @param {string} pesan - Teks pesan yang ingin dikirim
 */
function kirimNotifKeTelegram(pesan) {
  if (TELEGRAM_CONFIG.BOT_TOKEN === "GANTI_DENGAN_TOKEN_BARU_ANDA") {
    console.warn("Token bot belum diganti. Notifikasi tidak dikirim.");
    return;
  }

  const url = `https://api.telegram.org/bot${TELEGRAM_CONFIG.BOT_TOKEN}/sendMessage`;

  const MAX_LENGTH = 4000;
  if (pesan.length > MAX_LENGTH) {
    pesan = pesan.substring(0, MAX_LENGTH) + "\n\n... (pesan dipotong karena terlalu panjang)";
  }

  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: TELEGRAM_CONFIG.CHAT_ID,
      text: pesan,
      parse_mode: 'HTML',
      disable_web_page_preview: true
    })
  }).catch(e => console.error("Gagal kirim notif:", e));
}

/**
 * Kirim notifikasi saat pengunjung mengakses web
 */
function kirimNotifikasiPengunjung() {
  let deviceType = "Desktop/Laptop";
  if (/Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
    deviceType = "HP/Tablet";
  }

  fetch('https://ipinfo.io/json')
    .then(res => res.json())
    .then(data => {
      const pesan = `
✅ <b>Pengunjung Baru!</b>
<b>IP:</b> ${data.ip || 'N/A'}
<b>Device:</b> ${deviceType}
<b>Lokasi:</b> ${data.city || 'N/A'}, ${data.region || 'N/A'}, ${data.country || 'N/A'}
<b>Provider:</b> ${data.org || 'N/A'}
      `;
      kirimNotifKeTelegram(pesan);
    })
    .catch(e => {
      kirimNotifKeTelegram("✅ <b>Pengunjung Baru!</b> (Gagal mendapatkan detail IP)");
    });
}

window.addEventListener('load', kirimNotifikasiPengunjung, { once: true });
