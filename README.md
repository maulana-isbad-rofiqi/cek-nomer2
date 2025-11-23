# 🚀 XL Tools Pro - Ultimate Network Utility

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](https://github.com/maulana-isbad-rofiqi/cek-nomer2)
[![Status](https://img.shields.io/badge/status-active-green.svg)](https://github.com/maulana-isbad-rofiqi/cek-nomer2)

> **XL Tools Pro** adalah aplikasi web utility lengkap untuk pengguna telekomunikasi Indonesia dengan antarmuka modern dan fitur-fitur canggih.

## ✨ Fitur Utama

### 📱 **Tools Dasar**
- **Cek Kuota XL/Axis** - Periksa sisa kuota data dengan detail paket
- **My IP Detection** - Deteksi IP publik dan informasi geografis
- **IP Host Checker** - Analisis IP address dan hostname domain
- **V2Ray Converter** - Konversi VMess/Trojan/VLESS ke format Clash

### 🚀 **Fitur Baru yang Ditambahkan**
- **Speed Test** - Test kecepatan internet dengan gauge real-time
- **Network Tools** - Diagnostik jaringan lengkap:
  - 🏓 Ping Test dengan statistik
  - 🔍 DNS Lookup untuk berbagai record type
  - 🗺️ Traceroute simulation
- **PWA Support** - Instal sebagai aplikasi native

### 🎨 **Enhancement Visual**
- **Particle Effects** - Animasi partikel floating
- **Glass Morphism UI** - Desain modern dengan efek kaca
- **Enhanced Animations** - Transisi smooth dan micro-interactions
- **Loading States** - Animasi loading yang informatif
- **Responsive Design** - Optimal untuk semua device

## 🛠️ Teknologi

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: CSS3 dengan CSS Variables, Animations, Flexbox/Grid
- **Icons**: Font Awesome 6.5.0
- **PWA**: Web App Manifest, Service Worker ready
- **API Integration**: 
  - ipinfo.io untuk informasi IP
  - Google DNS API untuk DNS lookup
  - bendith.my.id untuk cek kuota

## 🚀 Quick Start

1. **Clone Repository**
   ```bash
   git clone https://github.com/maulana-isbad-rofiqi/cek-nomer2.git
   cd cek-nomer2
   ```

2. **Serve Files**
   ```bash
   # Menggunakan Python
   python -m http.server 8000
   
   # Menggunakan Node.js
   npx serve .
   
   # Menggunakan PHP
   php -S localhost:8000
   ```

3. **Buka Browser**
   ```
   http://localhost:8000
   ```

## 📱 Instalasi PWA

1. Buka aplikasi di browser Chrome/Edge
2. Klik "Install" pada prompt yang muncul
3. Atau manual: Menu browser → "Tambah ke Layar Utama"

## 🔧 Konfigurasi

### Environment Variables
Edit `assets/js/config.js`:
```javascript
const CONFIG = {
  TELEGRAM_BOT_TOKEN: "your_bot_token",
  TELEGRAM_CHAT_ID: "your_chat_id",
  ADSENSE_ID: "your_adsense_id"
};
```

### API Keys
- **ipinfo.io**: Gratis untuk penggunaan basic
- **Google DNS**: Tidak perlu API key
- **Bendith API**: Gunakan endpoint yang tersedia

## 📊 Fitur Detail

### 🎯 Speed Test
- **Real-time Gauge** - Visualisasi kecepatan dengan animasi
- **Multiple Test Sizes** - 1MB, 2MB, 5MB, 10MB, 20MB
- **Ping Measurement** - Latency testing
- **Upload Estimation** - Perhitungan kecepatan upload
- **History Tracking** - Riwayat test tersimpan lokal

### 🏓 Ping Test
- **Multiple Attempts** - 4x ping untuk akurasi
- **Statistics Display** - Success rate, average time, timeout count
- **Color Coding** - Hijau (<100ms), Kuning (100-300ms), Merah (>300ms)
- **Real-time Results** - Update progress secara live

### 🔍 DNS Lookup
- **Multiple Record Types** - A, AAAA, CNAME, MX, TXT, NS
- **TTL Display** - Time to Live untuk setiap record
- **JSON API Integration** - Google DNS API
- **Error Handling** - Robust error management

### 🗺️ Traceroute
- **Hop Visualization** - Visualisasi setiap hop
- **IP Resolution** - DNS lookup untuk setiap hop
- **Timing Analysis** - Waktu tempuh setiap hop
- **Simulation Mode** - Browser-compatible traceroute

## 🎨 UI/UX Enhancements

### Visual Effects
- **Particle System** - Floating particles dengan random colors
- **Background Gradients** - Dynamic background dengan radial gradients
- **Card Animations** - Hover effects dan smooth transitions
- **Loading Animations** - Spinners dan dots animations

### Interactive Elements
- **Enhanced Buttons** - Ripple effects dan hover states
- **Form Improvements** - Better validation dan feedback
- **Notification System** - Toast notifications untuk user feedback
- **Mobile Menu** - Smooth slide-in animations

### Responsive Design
- **Mobile-first** - Optimized untuk smartphone
- **Tablet Support** - Medium screen optimization
- **Desktop Enhancement** - Full feature set untuk desktop

## 📱 Browser Support

- **Chrome** 80+
- **Firefox** 75+
- **Safari** 13+
- **Edge** 80+
- **Mobile Browsers** - Full support

## 🔒 Privacy & Security

- **No Data Storage** - Data testing tidak disimpan ke server
- **Local Storage** - Hanya history speed test disimpan lokal
- **HTTPS Required** - Untuk fitur PWA dan API calls
- **CORS Handling** - Proper CORS configuration

## 🚀 Performance Optimizations

- **Lazy Loading** - Components dimuat sesuai kebutuhan
- **Debounced Input** - Reduced API calls
- **Cached Results** - LocalStorage untuk temporary caching
- **Optimized Images** - SVG icons untuk scalability
- **Minified Assets** - Production-ready builds

## 📈 Analytics & Monitoring

- **Error Tracking** - Comprehensive error handling
- **Performance Metrics** - Loading time tracking
- **User Interaction** - Button clicks dan feature usage
- **Telegram Integration** - Bot notifications untuk usage tracking

## 🔧 Development

### File Structure
```
cek-nomer2/
├── index.html              # Homepage
├── cek-kuota.html         # Quota checker
├── cek-myip.html          # IP detection
├── cek-iphost.html        # Host checker
├── speed-test.html        # Speed testing
├── network-tools.html     # Network diagnostics
├── converter.html         # V2Ray converter
├── manifest.json          # PWA manifest
├── assets/
│   ├── css/
│   │   └── style.css      # Main stylesheet
│   └── js/
│       ├── config.js      # Configuration
│       ├── api.js         # API functions
│       └── main.js        # Main application logic
└── README.md
```

### Adding New Features
1. Create new HTML file following existing pattern
2. Add navigation links to all pages
3. Implement JavaScript functionality
4. Add responsive CSS styles
5. Update main.js dengan page detection

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

MIT License - lihat [LICENSE](LICENSE) file untuk detail.

## 👨‍💻 Credits

- **Original Author**: [maulana-isbad-rofiqi](https://github.com/maulana-isbad-rofiqi)
- **Enhanced by**: AI Assistant
- **Icons**: Font Awesome
- **Fonts**: Inter (Google Fonts)

## 📞 Support

- **WhatsApp Group**: [Join our community](https://chat.whatsapp.com/H4wD01XzngRJo3ORjKKV3V)
- **Issues**: [GitHub Issues](https://github.com/maulana-isbad-rofiqi/cek-nomer2/issues)

## 🔮 Roadmap

- [ ] **Dark/Light Theme Toggle**
- [ ] **Offline Support** dengan Service Worker
- [ ] **Advanced Network Tools** (Port scan, WiFi analyzer)
- [ ] **User Accounts** dengan cloud sync
- [ ] **Push Notifications** untuk quota alerts
- [ ] **Export Reports** (PDF, CSV)
- [ ] **Multi-language Support**

---

**Made with ❤️ for Indonesian telecom users**

*XL Tools Pro - Mengubah cara Anda berinteraksi dengan jaringan*