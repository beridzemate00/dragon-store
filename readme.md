# 🐉 Dragon Store — Online Ordering System (Frontend)

Modern web application for **Dragon Store (Asian grocery in Batumi)** with:

- Customer online shop  
- Admin management panel  
- Staff order & inventory panel  

This frontend is fully prepared for real backend integration and real production use.

---

## 📍 About Dragon Store

**Dragon Store** is an Asian grocery shop located in **Batumi, Georgia**.

The system supports **two physical branches**:

- **Dragon Store · Parnavaz Mepe**
- **Dragon Store · Konstantine Gamsakhurdia**

When a customer enters the website, they select the most convenient branch and continue shopping only in that selected store.

---

## ✅ Main Features

### 👤 Customer Panel

- Home page with store information
- Product catalog with:
  - category filters
  - name search
  - price sorting
  - pagination
- Product details page:
  - price
  - stock
  - rating
  - category
- Shopping cart:
  - quantity control
  - item removal
  - automatic total calculation
- Checkout:
  - full name
  - phone number
  - delivery address
  - comment
  - **payment method: cash**
- Personal profile:
  - order history
  - order status tracking

All customer orders are stored in application state and visible for staff and admin.

---

### 👷 Staff Panel

- View active orders
- Update order status:
  - `new`
  - `processing`
  - `shipped`
  - `delivered`
  - `cancelled`
- Inventory overview:
  - stock levels
  - product prices
- No access to financial analytics or user management

---

### 🧑‍💼 Admin Panel

- Dashboard:
  - total revenue
  - number of orders
  - number of users
  - visual analytics chart
- Product management:
  - add new products
  - delete products
  - assign category, price and stock
- Order management:
  - view all orders
  - update order statuses
- User management:
  - list all users
  - change roles (ADMIN / STAFF / CLIENT)
- Settings page:
  - prepared for future store, payment and permissions configuration

---

## 🔐 Authentication

Authentication is implemented with **role-based access control**.

### Available Accounts

| Role  | Email | Password |
|--------|-----------------|------------|
| Admin  | admin@shop.com   | admin123   |
| Staff  | staff@shop.com   | staff123   |
| Client | client@shop.com  | client123  |

After login:
- **ADMIN** → `/admin`
- **STAFF** → `/staff`
- **CLIENT** → `/`

Protected routes are secured by role.

---

## 🏗 Technologies Used

- **React 18**
- **TypeScript**
- **Vite**
- **React Router v6**
- **Tailwind CSS**
- **Lucide React** (icons)
- **Recharts** (admin analytics charts)

---

## 🧠 State Management

All data is managed with **React Context API**:

- `AuthContext` — authentication & roles  
- `DataContext` — products, categories, users, orders  
- `CartContext` — shopping cart  
- `StoreContext` — selected store branch  

⚠️ No `localStorage` is used.  
All data is stored in **live React state only**.

---

## 🗺 Routes Overview

### Public / Client Routes

- `/store` — branch selection
- `/` — home
- `/catalog` — product catalog
- `/product/:slug` — product details
- `/cart` — shopping cart
- `/checkout` — order checkout
- `/profile` — profile & order history

---

### Admin Routes

- `/admin` — dashboard
- `/admin/products` — product management
- `/admin/orders` — order management
- `/admin/users` — user management
- `/admin/settings` — settings

---

### Staff Routes

- `/staff` — active orders
- `/staff/inventory` — inventory & stock

---

## 🗂 Project Structure