# 🛍️ UrbanKart - 100% Full-Stack JavaScript E-Commerce Platform (India Edition ₹)

A production-ready, fully responsive, high-converting E-Commerce Web Application built **100% in JavaScript (Node.js + Express + React)** with **Indian Rupee (₹)** currency, dynamic cart checkout, live order tracking, and **completely separated Admin Management Panel & Customer Storefront**.

---

## 🚀 Live Working Links

| Portal | URL | Description |
|---|---|---|
| 🛒 **Customer Storefront** | [http://localhost:5173](http://localhost:5173) | Main shopping website (Catalog, Cart Drawer, Express Checkout, Live Tracking, WhatsApp Concierge) |
| 🔐 **Independent Admin Console** | [http://localhost:5173/admin](http://localhost:5173/admin) | Completely separate Admin Dashboard with dedicated sidebar, KPI revenue cards, dynamic order status updater, inventory manager & messages |
| 🔑 **Admin Standalone Login** | [http://localhost:5173/admin/login](http://localhost:5173/admin/login) | Dedicated Admin Authentication screen with 1-click Demo auto-fill |
| 📦 **Live Order Tracking Demo** | [http://localhost:5173/track-order?order=UK-261113-1001](http://localhost:5173/track-order?order=UK-261113-1001) | 4-step live status timeline (Order Placed ➔ Processing ➔ Shipped ➔ Delivered) |
| ⚡ **Node.js Express REST API** | [http://localhost:8000](http://localhost:8000) | Pure JavaScript backend REST API |

### 🔑 Admin Credentials:
- **Email**: `admin@urbankart.com`
- **Password**: `Admin@123`
*(Or click the **"Auto-fill Demo Credentials"** button on the admin login page)*

---

## 🌟 What Makes This Project Special

### 1. ⚡ 100% Full-Stack JavaScript
- **Backend**: Pure Node.js + Express.js (`backend/server.js`, `backend/db.js`, `backend/routes/`).
- **Frontend**: Modern React 18, Vite, TypeScript/JavaScript, Tailwind CSS, Lucide Icons, Canvas Confetti.
- No Python required anymore! Everything is unified in the JavaScript ecosystem.

### 2. 🇮🇳 Indian Rupee (₹) Everywhere
- Replaced all `$` symbols with the official Indian Rupee symbol `₹`.
- Localized Indian number formatting (`₹1,499`, `₹11,995`, `₹1,14,900`).
- Indian payment options:
  - 📱 Instant UPI & QR Code (Google Pay, PhonePe, Paytm, BHIM)
  - 💵 Cash on Delivery (COD)
  - 💳 RuPay / Visa / Mastercard Debit & Credit Cards
  - 🏦 Net Banking (SBI, HDFC, ICICI, Axis Bank)
- Free express delivery across India on orders above ₹999.

### 3. 🛡️ Completely Separated Admin Panel & Main Website
- **Main Customer Website** (`/`):
  - Dedicated Storefront Header with search, categories, Wishlist, Cart Drawer, customer navigation.
  - Storefront Footer with trust badges, policies, and newsletter.
  - Floating WhatsApp concierge for direct support.
- **Admin Management Portal** (`/admin`):
  - **Completely separate layout**: Dedicated dark-theme Admin Sidebar, Topbar, and Control Canvas.
  - NO customer storefront header or footer in the admin area.
  - Separate authentication protection via JWT tokens.

### 4. 🔄 Fully Dynamic & Persistent
- **Live Stock Sync**: When an order is placed on the customer website, product stock units are immediately decremented in the database.
- **Instant Admin Alerts**: Placed orders appear in the Admin Orders table in real time with the unique Order Number (`UK-261113-XXXX`).
- **1-Click Status Updater**: When the Admin changes an order's status from `Processing` to `Shipped` or `Delivered`, the customer's Live Order Tracking page reflects the new status instantly.
- **Dynamic Inventory Management**: Add new products with image, title, price, and stock from the admin modal — they appear immediately on the customer catalog!

---

## 🛠️ How to Start Both Servers Manually

### 1. Start Backend (Node.js Express):
```powershell
node backend\server.js
```
*(Runs on `http://localhost:8000`)*

### 2. Start Frontend (React Vite):
```powershell
npm run dev --prefix frontend
```
*(Runs on `http://localhost:5173`)*
