# Theme Customization Guide

## 🎨 Current Theme

Your website now features a **Black & Gold** elegant theme with custom UI elements.

---

## 🖼️ Background

### Image Background
- **Location**: `/public/bg/1.png`
- **Effect**: Full-screen background with dark overlay
- **Overlay**: Black with 75% opacity (`rgba(0, 0, 0, 0.75)`)
- **Applied to**: All pages (12 routes)

### Sparkle Animation
- Animated gold and teal sparkles overlay
- Creates an elegant, magical effect
- Subtle animation (8s infinite alternate)

---

## 🎨 Color Scheme

### Primary Colors
```css
--royal: #0a0a0a        /* Dark black */
--deep: #000000         /* Pure black */
--mid: #1a1a1a          /* Dark gray */
--soft: #2a2a2a         /* Medium gray */
```

### Accent Colors
```css
--accent-gold: #c9a227         /* Primary gold */
--accent-gold-light: #f0c84a   /* Light gold */
--accent-teal: #00b4d8         /* Teal (for text highlights) */
--accent-teal-light: #48e0ff   /* Light teal */
```

### Text Colors
```css
--text-primary: #f5f0e8              /* Cream white */
--text-muted: rgba(245, 240, 232, 0.6)  /* Muted cream */
```

### Card Colors
```css
--card-bg: rgba(20, 20, 20, 0.72)    /* Semi-transparent black */
--card-border: rgba(201, 162, 39, 0.3)  /* Gold border */
```

---

## 📜 Custom Scrollbar

### Design
- **Track**: Black with subtle gold border
- **Thumb**: Gold gradient with rounded corners
- **Hover**: Brighter gold with glow effect
- **Width**: 12px (desktop), 8px (mobile)

### Browser Support
- ✅ Chrome, Safari, Edge (Webkit)
- ✅ Firefox (scrollbar-width)
- ✅ All modern browsers

### Customization
Edit in `public/assets/styles.css`:
```css
::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, var(--accent-gold), #a07d18);
  /* Change colors here */
}
```

---

## ⏳ Loading Screen

### Features
- **Logo**: "Welcome 10th Batch" with gold gradient
- **Spinner**: Gold circular spinner
- **Text**: "Loading" with animated dots
- **Duration**: 1 second (adjustable)
- **Animation**: Smooth fade out

### Design Elements
1. **Logo Glow**: Pulsing gold glow effect
2. **Spinner**: Rotating gold ring
3. **Dots**: Bouncing animation (3 dots)
4. **Background**: Pure black (#000000)

### Customization

#### Change Loading Duration
Edit `app/components/LoadingScreen.tsx`:
```typescript
const timer = setTimeout(() => {
  setIsLoading(false);
}, 1000); // Change this value (in milliseconds)
```

#### Change Logo Text
Edit `app/components/LoadingScreen.tsx`:
```tsx
<div className="loading-logo">
  Welcome 10th Batch  {/* Change this text */}
</div>
```

#### Change Loading Text
Edit `app/components/LoadingScreen.tsx`:
```tsx
<div className="loading-text">
  Loading  {/* Change this text */}
  <span className="loading-dots">...</span>
</div>
```

---

## 🎯 Applied To All Routes

Both custom scrollbar and loading screen are applied to:

### Public Pages
- ✅ Home (`/`)
- ✅ Quiz (`/quiz`)
- ✅ Leaderboard (`/leaderboard`)
- ✅ Questions (`/questions`)
- ✅ All Questions (`/all-questions`)
- ✅ Feedback (`/feedback`)

### Admin Pages
- ✅ Admin Login (`/admin/login`)
- ✅ Admin Dashboard (`/admin`)
- ✅ Admin Questions (`/admin/questions`)
- ✅ Admin Scores (`/admin/scores`)
- ✅ Admin Feedback (`/admin/feedback`)
- ✅ Admin Test DB (`/admin/test-db`)

---

## 🔧 Customization Options

### 1. Change Background Image
Replace `/public/bg/1.png` with your image, or update CSS:
```css
.bg-canvas {
  background-image: url('/bg/your-image.png');
}
```

### 2. Adjust Background Darkness
Edit overlay opacity in `public/assets/styles.css`:
```css
.bg-canvas::after {
  background: rgba(0, 0, 0, 0.75); /* Change 0.75 to 0.5-0.9 */
}
```

### 3. Change Gold Color
Update the gold accent in `public/assets/styles.css`:
```css
:root {
  --accent-gold: #c9a227;        /* Change this */
  --accent-gold-light: #f0c84a;  /* And this */
}
```

### 4. Disable Loading Screen
Remove from `app/layout.tsx`:
```tsx
// Remove this line:
<LoadingScreen />
```

### 5. Change Scrollbar Width
Edit in `public/assets/styles.css`:
```css
::-webkit-scrollbar {
  width: 12px; /* Change this value */
}
```

---

## 📱 Mobile Responsiveness

### Scrollbar
- Automatically thinner on mobile (8px)
- Touch-friendly design

### Loading Screen
- Responsive logo size (clamp 2rem to 3.5rem)
- Centered layout
- Works on all screen sizes

---

## 🎨 Animation Details

### Loading Logo Glow
```css
@keyframes logoGlow {
  0% { filter: drop-shadow(0 0 10px rgba(201, 162, 39, 0.3)); }
  100% { filter: drop-shadow(0 0 20px rgba(201, 162, 39, 0.6)); }
}
```
- Duration: 2s
- Easing: ease-in-out
- Loop: infinite alternate

### Spinner Rotation
```css
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
```
- Duration: 1s
- Easing: linear
- Loop: infinite

### Loading Text Pulse
```css
@keyframes pulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}
```
- Duration: 1.5s
- Easing: ease-in-out
- Loop: infinite

### Dot Bounce
```css
@keyframes dotBounce {
  0%, 80%, 100% { transform: scale(0); opacity: 0.5; }
  40% { transform: scale(1); opacity: 1; }
}
```
- Duration: 1.4s
- Easing: ease-in-out
- Loop: infinite
- Staggered delay: 0s, 0.2s, 0.4s

---

## 🎯 Best Practices

### Performance
- ✅ Loading screen uses CSS animations (GPU accelerated)
- ✅ Smooth transitions with cubic-bezier easing
- ✅ Minimal JavaScript for loading logic
- ✅ Optimized for 60fps animations

### Accessibility
- ✅ High contrast text (cream on black)
- ✅ Clear loading indicators
- ✅ Smooth transitions (no jarring effects)
- ✅ Keyboard navigation friendly

### Browser Compatibility
- ✅ Modern browsers (Chrome, Firefox, Safari, Edge)
- ✅ Fallback for older browsers
- ✅ Mobile browsers supported

---

## 🐛 Troubleshooting

### Loading Screen Doesn't Disappear
- Check browser console for errors
- Verify JavaScript is enabled
- Increase timeout duration in `LoadingScreen.tsx`

### Scrollbar Not Showing
- Ensure content is scrollable (height > viewport)
- Check browser compatibility
- Clear browser cache

### Background Image Not Loading
- Verify image exists at `/public/bg/1.png`
- Check file permissions
- Clear Next.js cache: `rm -rf .next`

---

## 📝 Files Modified

### New Files
- `app/components/LoadingScreen.tsx` - Loading screen component

### Modified Files
- `public/assets/styles.css` - Added scrollbar and loading styles
- `app/layout.tsx` - Added LoadingScreen component

---

## 🎉 Summary

Your website now features:
- ✨ Custom black & gold theme
- 🖼️ Background image with dark overlay
- 📜 Elegant gold scrollbar
- ⏳ Professional loading screen
- 🎨 Smooth animations throughout
- 📱 Fully responsive design

All elements work together to create a cohesive, elegant user experience! 🚀

---

**Last Updated**: May 23, 2026
