# Architecture Documentation

## 🏗️ Modular Architecture

Aplikasi ini dibangun dengan prinsip **separation of concerns** dan **modular design** untuk kemudahan maintenance dan scalability.

## 📦 Module Breakdown

### 1. **telegram.js** - Notification Module
**Tanggung Jawab:**
- Mengirim notifikasi ke Telegram bot
- Tracking pengunjung website
- Logging aktivitas user

**Exported Functions:**
- `kirimNotifKeTelegram(pesan)` - Send message to Telegram
- `kirimNotifikasiPengunjung()` - Auto-send visitor info

**Dependencies:** None

---

### 2. **api.js** - API Module
**Tanggung Jawab:**
- Handle semua API calls
- Data formatting & validation
- Error handling

**Exported Object:**
```javascript
API = {
  formatNumber(phone),      // Format phone number
  fetchWithProxy(number),   // Fetch with CORS proxy
  cekKuota(number),        // Check XL/Axis quota
  cekMyIp(),               // Check public IP
  cekIpHost(hostname)      // DNS lookup
}
```

**Dependencies:**
- External APIs (XL/Axis, ipinfo.io, Google DNS)

---

### 3. **converter.js** - V2Ray Converter Module
**Tanggung Jawab:**
- Parse V2Ray links (vmess, vless, trojan, ss)
- Convert to Clash/JSON format
- YAML generation

**Exported Object:**
```javascript
V2RayConverter = {
  parseV2rayLink(link),           // Parse any V2Ray link
  parseVmess(link),               // Parse VMess
  parseVless(link),               // Parse VLess
  parseTrojan(link),              // Parse Trojan
  parseShadowsocks(link),         // Parse Shadowsocks
  createFullClashConfig(proxies), // Generate full Clash config
  convert(links, format)          // Main converter function
}
```

**Dependencies:**
- js-yaml library

---

### 4. **slider.js** - Image Slider Module
**Tanggung Jawab:**
- Image carousel functionality
- Auto-slide feature
- Dot navigation

**Exported Object:**
```javascript
Slider = {
  init(),              // Initialize slider
  createDots(),        // Create navigation dots
  showSlide(n),        // Show specific slide
  nextSlide(),         // Next slide
  prevSlide(),         // Previous slide
  startAutoSlide(),    // Start auto-slide
  resetAutoSlide()     // Reset auto-slide timer
}
```

**Dependencies:** None

---

### 5. **clock.js** - Digital Clock Module
**Tanggung Jawab:**
- Real-time clock display
- Date formatting (Indonesian)

**Exported Object:**
```javascript
DigitalClock = {
  init(),           // Initialize clock
  updateClock()     // Update time & date
}
```

**Dependencies:** None

---

### 6. **navigation.js** - Navigation Module
**Tanggung Jawab:**
- Page routing (SPA-like behavior)
- Sidebar toggle
- Modal management
- Active state management

**Exported Object:**
```javascript
Navigation = {
  init(),              // Initialize navigation
  bindEvents(),        // Bind all event listeners
  showPage(page),      // Show specific page
  openSidebar(),       // Open mobile sidebar
  closeSidebar(),      // Close mobile sidebar
  openAboutModal(),    // Open about modal
  closeAboutModal()    // Close about modal
}
```

**Dependencies:** None

---

### 7. **main.js** - Application Entry Point
**Tanggung Jawab:**
- Initialize all modules
- Bind page-specific event handlers
- Coordinate between modules

**Main Functions:**
- `initCekKuota()` - Initialize quota checker
- `initCekMyIp()` - Initialize IP checker
- `initCekIpHost()` - Initialize host lookup
- `initConverter()` - Initialize converter

**Dependencies:**
- All other modules

---

## 🔄 Data Flow

```
User Action
    ↓
Event Handler (main.js)
    ↓
API Module (api.js)
    ↓
External API
    ↓
Response Processing
    ↓
Telegram Notification (telegram.js)
    ↓
UI Update (DOM manipulation)
```

## 🎯 Design Patterns

### 1. **Module Pattern**
Each JS file exports an object/function that encapsulates its functionality.

### 2. **Singleton Pattern**
Modules like `Slider`, `DigitalClock`, `Navigation` are singletons.

### 3. **Observer Pattern**
Event-driven architecture using addEventListener.

### 4. **Facade Pattern**
`API` object provides simple interface to complex API interactions.

## 📊 Component Loading Strategy

```javascript
// Dynamic component loading
Promise.all([
  loadComponent('./pages/components.html', 'components-container'),
  loadComponent('./pages/beranda.html', 'beranda-content'),
  // ... other components
]).then(() => {
  // Initialize after all loaded
  document.dispatchEvent(new Event('DOMContentLoaded'));
});
```

**Benefits:**
- Faster initial load
- Better code organization
- Easy to maintain individual pages

## 🔐 Security Considerations

### 1. **CORS Handling**
```javascript
// Multiple proxy fallback
const proxies = [
  'https://api.allorigins.win/raw?url=...',
  'https://corsproxy.io/?...',
  'https://thingproxy.freeboard.io/fetch/...'
];
```

### 2. **Input Validation**
```javascript
// Phone number validation
if (!/^(08|62|8)\d{7,12}$/.test(no)) {
  return alert('Format nomor salah.');
}
```

### 3. **XSS Protection**
- Using textContent instead of innerHTML where possible
- Sanitizing user inputs

## 🚀 Performance Optimizations

1. **Lazy Loading**: Components loaded on-demand
2. **Event Delegation**: Minimize event listeners
3. **Debouncing**: Input validation debounced
4. **Caching**: Store API responses when appropriate

## 🧪 Testing Strategy

### Unit Testing (Recommended)
- Test each module independently
- Mock external dependencies

### Integration Testing
- Test module interactions
- Verify API calls

### E2E Testing
- Test complete user flows
- Cross-browser compatibility

## 📈 Scalability

### Adding New Features
1. Create new page in `pages/`
2. Create module in `assets/js/` if needed
3. Add initialization in `main.js`
4. Update navigation in `navigation.js`

### Example: Adding "Cek Pulsa" Feature

```javascript
// 1. Create pages/cek-pulsa.html
// 2. Create assets/js/pulsa.js (if complex logic)
// 3. In main.js:
function initCekPulsa() {
  // Your logic here
}
// 4. In navigation.js:
this.sections.cekPulsa = document.getElementById('cekPulsaSection');
```

## 🔧 Maintenance Guide

### Updating API Endpoints
Edit `assets/js/api.js`:
```javascript
const API_ENDPOINTS = {
  XL_AXIS: 'https://bendith.my.id/end.php',
  IP_INFO: 'https://ipinfo.io/json',
  DNS: 'https://dns.google/resolve'
};
```

### Updating Styles
Edit `assets/css/style.css` - all styles centralized

### Updating Telegram Config
Edit `assets/js/telegram.js`:
```javascript
const TELEGRAM_CONFIG = {
  BOT_TOKEN: "your_token",
  CHAT_ID: "your_chat_id"
};
```

## 📚 Best Practices Implemented

✅ Separation of Concerns
✅ DRY (Don't Repeat Yourself)
✅ Single Responsibility Principle
✅ Progressive Enhancement
✅ Mobile-First Design
✅ Semantic HTML
✅ Accessible UI
✅ Error Handling
✅ Loading States
✅ User Feedback

---

**Last Updated:** 2024
**Maintained By:** 【﻿ 𝕀𝕥𝕤𝕓𝕒𝕕 𝕤𝕥𝕠𝕣𝕖 】
