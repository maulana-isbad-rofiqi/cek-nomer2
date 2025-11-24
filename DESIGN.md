# 🎨 Design System - XL & Axis Tools v2.0

## Modern Professional Design

Design baru ini menggunakan pendekatan **Modern Glassmorphism** dengan **Animated Background** dan **Premium UI Components**.

---

## 🎨 Color Palette

### Primary Colors
```css
--primary: #00d4ff        /* Cyan Electric */
--primary-dark: #0095ff   /* Blue Electric */
--secondary: #6366f1      /* Indigo */
--accent: #f97316         /* Orange */
```

### Status Colors
```css
--success: #10b981        /* Emerald */
--danger: #ef4444         /* Red */
```

### Background Colors
```css
--dark: #0a0e27          /* Deep Navy */
--dark-light: #141b3d    /* Navy */
--dark-lighter: #1e2749  /* Light Navy */
```

### Text Colors
```css
--text: #e2e8f0          /* Slate 200 */
--text-muted: #94a3b8    /* Slate 400 */
```

---

## ✨ Design Features

### 1. **Animated Background**
- Radial gradient dengan 3 warna yang bergerak
- Particle floating effect
- Smooth 30s animation loop

### 2. **Glassmorphism Effect**
- Backdrop blur 20px
- Semi-transparent background
- Subtle border & shadow
- Hover effects with glow

### 3. **Modern Navigation**
- Sticky navbar dengan blur effect
- Gradient logo
- Active state indicators
- Responsive hamburger menu

### 4. **Feature Cards**
- Hover lift effect (-8px)
- Top border gradient animation
- Radial gradient overlay
- Icon scale & glow on hover

### 5. **Progress Bars**
- Triple gradient (cyan → indigo → orange)
- Animated shine effect
- Shimmer overlay
- Glowing shadow

### 6. **Digital Clock**
- Gradient text effect
- Glowing pulse animation
- Monospace font
- Dynamic color shift

### 7. **Modal System**
- Backdrop blur 8px
- Slide-in animation
- Gradient border
- Close button with rotation

---

## 📐 Typography

### Font Family
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

### Headings
- **H1 (Section Title)**: 2rem (32px), Font weight 800
- **H2 (Result Title)**: 1.25rem (20px), Font weight 700
- **H3 (Feature Title)**: 1.25rem (20px), Font weight 700

### Body Text
- **Default**: 1rem (16px), Line height 1.6
- **Small**: 0.875rem (14px)
- **Muted**: 0.875rem (14px), Color: `var(--text-muted)`

---

## 🎭 Animations

### 1. **Background Animation**
```css
@keyframes backgroundMove {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  33% { transform: translate(5%, -5%) rotate(120deg); }
  66% { transform: translate(-5%, 5%) rotate(240deg); }
}
/* Duration: 30s, Infinite */
```

### 2. **Particle Float**
```css
@keyframes particleFloat {
  from { background-position: 0 0; }
  to { background-position: 200px 200px; }
}
/* Duration: 60s, Linear, Infinite */
```

### 3. **Fade In Up**
```css
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
/* Duration: 0.6s */
```

### 4. **Progress Shine**
```css
@keyframes progressShine {
  0% { background-position: 0% 50%; }
  100% { background-position: 200% 50%; }
}
/* Duration: 2s, Linear, Infinite */
```

### 5. **Glow Pulse**
```css
@keyframes glowPulse {
  0%, 100% { filter: drop-shadow(0 0 20px rgba(0, 212, 255, 0.3)); }
  50% { filter: drop-shadow(0 0 40px rgba(0, 212, 255, 0.6)); }
}
/* Duration: 3s, Infinite */
```

---

## 🎯 Component Specs

### Navigation Bar
```
Height: Auto (padding 1rem)
Border Radius: 2rem
Background: rgba(10, 14, 39, 0.8)
Backdrop Filter: blur(20px)
Border: 1px solid rgba(0, 212, 255, 0.2)
Box Shadow: Multiple layers with glow
Position: Sticky (top: 1rem)
```

### Feature Cards
```
Padding: 2.5rem 2rem
Border Radius: 1.5rem
Background: rgba(30, 39, 73, 0.4)
Border: 1px solid rgba(255, 255, 255, 0.05)
Hover Transform: translateY(-8px)
Hover Shadow: 0 20px 60px + glow
```

### Buttons
```
Primary Button:
  - Background: Linear gradient (cyan → indigo)
  - Padding: 0.75rem 1.5rem
  - Border Radius: 1rem
  - Box Shadow: 0 4px 20px rgba(0, 212, 255, 0.3)
  - Hover: translateY(-2px) + stronger shadow

Copy Button:
  - Background: Linear gradient (emerald)
  - Same size & radius as primary
```

### Input Fields
```
Padding: 1rem 1.5rem
Border Radius: 1rem
Background: rgba(255, 255, 255, 0.03)
Border: 1px solid rgba(255, 255, 255, 0.1)
Focus Border: var(--primary)
Focus Shadow: 0 0 0 3px rgba(0, 212, 255, 0.1)
```

### Progress Bar
```
Track Height: 10px
Bar Height: 100%
Border Radius: 10px
Background: Triple gradient (animated)
Shadow: 0 0 20px rgba(0, 212, 255, 0.5)
```

### Modal
```
Background: Linear gradient (dark-light → dark)
Border: 1px solid rgba(0, 212, 255, 0.3)
Border Radius: 2rem
Padding: 3rem
Max Width: 500px
Shadow: Multiple layers + glow
Animation: Slide in from top
```

---

## 📱 Responsive Breakpoints

### Desktop
```
1024px+ : Full navigation menu visible
```

### Tablet
```
768px - 1023px : 
  - Hamburger menu visible
  - Sidebar navigation
  - 2-column feature grid
```

### Mobile
```
< 768px :
  - Full mobile layout
  - 1-column feature grid
  - Smaller text & spacing
  - 100% width sidebar
```

---

## 🎨 Gradient Formulas

### Primary Gradient
```css
background: linear-gradient(135deg, #00d4ff 0%, #6366f1 100%);
```

### Accent Gradient
```css
background: linear-gradient(135deg, #00d4ff 0%, #6366f1 50%, #f97316 100%);
```

### Success Gradient
```css
background: linear-gradient(135deg, #10b981 0%, #059669 100%);
```

### Progress Gradient
```css
background: linear-gradient(90deg, #06b6d4, #3b82f6, #22d3ee);
background-size: 200% 100%;
```

---

## 💫 Special Effects

### Glassmorphism
```css
background: rgba(255, 255, 255, 0.03);
backdrop-filter: blur(20px) saturate(180%);
border: 1px solid rgba(255, 255, 255, 0.08);
```

### Text Gradient
```css
background: linear-gradient(135deg, var(--primary), var(--secondary));
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
background-clip: text;
```

### Neon Glow
```css
text-shadow: 0 0 8px #22d3ee, 0 0 18px #0ea5e9;
filter: drop-shadow(0 0 20px rgba(0, 212, 255, 0.3));
```

### Box Glow
```css
box-shadow: 
  0 20px 60px rgba(0, 0, 0, 0.5),
  0 0 60px rgba(0, 212, 255, 0.2);
```

---

## 🎯 Interactive States

### Hover States
- Cards: Lift -8px + glow
- Buttons: Lift -2px + stronger shadow
- Nav Links: Background overlay 15% opacity
- Icons: Scale 1.1 + stronger glow

### Active States
- Nav Links: Cyan color + background + glow
- Sidebar Links: Gradient background + shadow

### Focus States
- Inputs: Border color change + ring shadow
- Buttons: Same as hover

### Loading States
- Spinning icon
- Cyan color
- Border + background

### Error States
- Red background 10% opacity
- Red border 30% opacity
- Red text

---

## 🎬 Animation Delays

Staggered fade-in for beranda cards:
```
Card 1: 0.2s
Card 2: 0.3s
Card 3: 0.4s
Card 4: 0.5s
Card 5: 0.6s
Card 6: 0.7s
```

---

## 🔧 Custom Scrollbar

```css
Width: 10px
Track: var(--dark)
Thumb: Linear gradient (cyan → indigo)
Thumb Border Radius: 10px
Thumb Border: 2px solid var(--dark)
Hover: Gradient (indigo → orange)
```

---

## 🎨 Best Practices

1. **Consistent Spacing**
   - Use rem units
   - 0.5rem increments

2. **Smooth Transitions**
   - Duration: 0.3s - 0.4s
   - Easing: cubic-bezier(0.4, 0, 0.2, 1)

3. **Accessible Colors**
   - High contrast ratios
   - Readable text on all backgrounds

4. **Performance**
   - GPU-accelerated animations (transform, opacity)
   - Optimized backdrop-filter usage
   - Debounced interactions

5. **Mobile-First**
   - Start with mobile layout
   - Progressive enhancement for larger screens

---

## 📊 Performance Metrics

- **First Paint**: ~300ms
- **Time to Interactive**: ~800ms
- **Lighthouse Score**: 95+
- **Animation FPS**: 60fps

---

**Design Version**: 2.0
**Last Updated**: 2024
**Designer**: 【﻿ 𝕀𝕥𝕤𝕓𝕒𝕕 𝕤𝕥𝕠𝕣𝕖 】
