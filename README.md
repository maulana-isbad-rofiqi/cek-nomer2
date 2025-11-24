# XL & Axis Tools - Cek Nomer & Kuota

Tools profesional untuk pengecekan nomor, masa aktif, dan sisa kuota paket XL dan Axis.

## 📁 Struktur Proyek

```
cek nomer/
├── index.html                  # Halaman utama (clean & modular)
├── assets/
│   ├── css/
│   │   └── style.css          # Semua styling CSS
│   └── js/
│       ├── telegram.js        # Modul notifikasi Telegram
│       ├── api.js             # Modul API (cek kuota, IP, dll)
│       ├── converter.js       # Modul V2Ray converter
│       ├── slider.js          # Modul image slider
│       ├── clock.js           # Modul jam digital
│       ├── navigation.js      # Modul navigasi & sidebar
│       └── main.js            # Inisialisasi aplikasi
└── pages/
    ├── components.html        # Komponen umum (navbar, sidebar, footer)
    ├── beranda.html          # Halaman beranda
    ├── cek-kuota.html        # Halaman cek kuota XL/Axis
    ├── cek-myip.html         # Halaman cek IP publik
    ├── cek-iphost.html       # Halaman cek IP hostname
    └── converter.html        # Halaman V2Ray converter
```

## ✨ Fitur

1. **Cek Nomer XL & Axis**
   - Informasi detail nomer
   - Masa aktif & tenggang
   - Daftar paket aktif
   - Detail kuota per paket

2. **Cek MyIP**
   - IP Address publik
   - Lokasi geografis
   - Provider internet

3. **Cek IP Host**
   - DNS lookup (A/AAAA record)
   - Detail IP & lokasi
   - Provider hosting

4. **V2Ray Converter**
   - Support: vmess, vless, trojan, ss
   - Output: Clash (Full/Proxies) & JSON
   - Copy to clipboard

## 🚀 Cara Menggunakan

1. Buka `index.html` di browser
2. Pilih fitur yang ingin digunakan
3. Ikuti instruksi di setiap halaman

## 🛠️ Teknologi

- **Frontend**: HTML5, TailwindCSS, JavaScript (ES6+)
- **Libraries**: 
  - Font Awesome (Icons)
  - js-yaml (YAML conversion)
- **APIs**:
  - XL/Axis API (via proxy)
  - ipinfo.io (IP information)
  - Google DNS (DNS lookup)
  - Telegram Bot API (Notifications)

## 📝 Konfigurasi

### Telegram Notification

Edit `assets/js/telegram.js`:

```javascript
const TELEGRAM_CONFIG = {
  BOT_TOKEN: "YOUR_BOT_TOKEN",  // Ganti dengan token bot Anda
  CHAT_ID: "YOUR_CHAT_ID"        // Ganti dengan chat ID Anda
};
```

## 🎨 Customization

### Mengubah Warna Tema

Edit `assets/css/style.css`:

```css
.neon {
  color: #22d3ee;  /* Ubah warna neon */
  text-shadow: 0 0 8px #22d3ee, 0 0 18px #0ea5e9;
}
```

### Menambah Slider Image

Edit `pages/beranda.html`, tambahkan slide baru:

```html
<div class="slide" style="background-image: url('URL_GAMBAR_ANDA');"></div>
```

## 📱 Responsive Design

- Mobile-first approach
- Hamburger menu untuk mobile
- Adaptive grid layout
- Touch-friendly buttons

## 🔒 Keamanan

- No hardcoded credentials di frontend
- CORS proxy untuk API calls
- Input validation
- XSS protection

## 🤝 Kontribusi

Dibuat oleh: **【﻿ 𝕀𝕥𝕤𝕓𝕒𝕕 𝕤𝕥𝕠𝕣𝕖 】**

## 📄 License

© 2024 - All rights reserved

---

**Note**: Gunakan tools ini dengan bijak dan bertanggung jawab.
