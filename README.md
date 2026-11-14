# UrbanKart E-Commerce Platform

A full-stack JavaScript web application built with Node.js, Express, and React. It features Indian Rupee (INR) currency display, separate customer and administrative portals, live order management, and promotional discount capabilities.

## Architecture & Features

- **Storefront**: Product catalog browsing, search, cart management, Indian postal code delivery estimates, and checkout options including simulated UPI and cards.
- **Admin Portal**: Independent dark-themed dashboard located at `/admin` for tracking orders, updating shipment statuses, managing product stock, and reviewing inquiries.
- **Indian Rupee (INR) Display**: All pricing is presented in Indian Rupees across products, carts, invoices, and analytics.
- **Invoice Generation**: Printable tax invoices with itemized tax and shipment data.
- **Persistent Data Store**: Atomic JSON file-backed data storage located in `backend/data/ecommerce_db.json`.

## Credentials (Demo)

- **Admin Email**: `admin@urbankart.com`
- **Admin Password**: `Admin@123`

## Running Locally

### Backend
```bash
cd backend
npm install
node server.js
```
Runs on `http://localhost:8000`.

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Runs on `http://localhost:5173`.

## Active Discount Codes
- `FIRST20` - 20% discount on orders
- `SAVE10` - 10% discount on orders over 999 INR
- `DIWALI500` - Flat 500 INR discount
- `MEGA1000` - Flat 1000 INR discount
