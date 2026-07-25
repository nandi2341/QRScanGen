# QR Scanner & Generator Pro 📱⚡

A production-grade, 100% browser-based, offline-capable Progressive Web App (PWA) for QR Code and Barcode scanning, custom generation, log management, cryptographic tools, and analytics.

Built to run entirely in the user's browser with **zero backend dependencies**, zero tracking, zero external database requirements, and rock-solid deployment compatibility for **GitHub Pages**.

---

## 🌟 Key Features

### 📷 1. Live Camera & Image File Scanner
- **Real-Time Camera Scan**: Scans QR codes, Code 128, EAN-13, EAN-8, UPC-A, Code 39, ITF, Data Matrix, PDF 417.
- **Image File Reader**: Drag & drop or upload image files (PNG, JPG, WEBP) to decode codes offline.
- **Batch Scanning Mode**: Continuous back-to-back scanning with session tracking.
- **Session Management**: Group scan logs by custom named contexts (e.g. *"Inventory Week 12"*).
- **Non-Redirect Security**: Displays a toast notification (*"QR berhasil dipindai – data disimpan ke Log."*) and auto-resumes scanning immediately with **ZERO auto-redirects or tab launching**.
- **Duplicate Policy**: Configurable duplicate handling (Allow, Ignore within session, Alert).

### 🎨 2. Multi-Type Generator & Custom Aesthetics
- **Content Types Supported**:
  - Web URLs & Plain Text
  - Wi-Fi Networks (SSID, Password, Encryption WPA/WEP/None)
  - vCard Contacts (Name, Org, Title, Phone, Email)
  - Email, SMS, Phone Number
  - Geo Location coordinates
  - Calendar Events
  - Crypto / Payment Addresses (Bitcoin, Ethereum)
  - Barcodes (CODE128, EAN13, EAN8, UPC, CODE39, ITF, MSI, Pharmacode)
- **Advanced Styling Engine**: Custom dot shapes, eye frame corners, foreground/background color gradients, center logo icon overlay, error correction levels (L, M, Q, H).
- **Multi-Format Export**: PNG, SVG, JPG, PDF.
- **Reusable Templates**: Save custom generator configurations for quick loading.

### 📑 3. Log & Data Management
- **IndexedDB via Dexie.js**: All data stored locally in client-side IndexedDB repositories.
- **Indexed Search & Filter**: Search by text, format, session, or tags.
- **Multi-Select Bulk Actions**: Bulk export (CSV, TXT, JSON, PDF), bulk delete, bulk tagging.
- **Parsed Inspector View**: Detailed drawer inspecting extracted Wi-Fi, vCard, or URL parameters with one-click copy, share, and re-generate.
- **Full Backup & Restore**: Export full application database to a JSON file and restore offline.

### 📊 4. Statistics Dashboard
- Real-time scan volume metrics, daily activity distribution, code format breakdown graphs, and session statistics.

### 🛠️ 5. Utility Tools
- **Encoders & Decoders**: Base64, URL Encoding, Hexadecimal, Binary, HTML Entities.
- **Encryption & Hashing**: Web Crypto API & CryptoJS for AES-256 encryption/decryption with password key; SHA-256, SHA-512, MD5 hash calculation.
- **QR Compare Tool**: Side-by-side comparison of 2 scanned or generated codes with visual difference detection.

### ⌨️ 6. Desktop Shortcuts & Preferences
- `Space`: Start / Pause Scanner
- `Ctrl + F`: Focus Search in Logs
- `Ctrl + E`: Export Logs
- `Ctrl + S`: Go to Scanner
- `Ctrl + G`: Go to Generator
- Theme switcher (Dark / Light), audio beep synthesizer (Web Audio API), and haptic vibration support.

---

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript (Strict)
- **Build Tool**: Vite
- **Routing**: React Router (`HashRouter` for 100% GitHub Pages deep link & refresh stability)
- **State Management**: Zustand
- **Database**: Dexie.js (IndexedDB Repositories)
- **Forms & Validation**: React Hook Form + Zod
- **Styling**: Tailwind CSS + Framer Motion + Material 3 Glassmorphic Design
- **Scanning**: `html5-qrcode` & native Canvas decoders
- **Generation**: `qr-code-styling` & `jsbarcode`
- **PWA**: `vite-plugin-pwa` with Workbox Service Worker asset caching

---

## 🚀 Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run TypeScript compilation check
npm run lint

# Build production bundle
npm run build
```

---

## 🚢 Deployment to GitHub Pages

This project is pre-configured for automated continuous deployment to GitHub Pages via GitHub Actions (`.github/workflows/deploy.yml`).

1. Push code to your GitHub repository on `main` or `master` branch.
2. In your GitHub Repository, go to **Settings > Pages**.
3. Under **Source**, select **GitHub Actions**.
4. The GitHub Action will build and deploy the app automatically!
