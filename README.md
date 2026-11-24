# ShopEase — Full-Stack E-Commerce Platform

ShopEase is a modern, responsive, full-stack footwear e-commerce application built with **Python 3**, **Django REST Framework (DRF)**, **MySQL**, and **React (Vite + Tailwind CSS)**. 

The application implements a strict two-tier role-based authorization model (**Customer** vs **Admin**), server-side price calculation, row-level locking with atomic stock decrement to prevent overselling, JWT authentication with token rotation, and multipart image uploads.

---

## 1. Features Overview

### Customer Experience
- **Interactive Storefront**: Filter shoes by categories, live search by product name/brand, and sort by price or recency.
- **Shopify/Amazon-Style Product Cards**: High-res shoe cards with stock status badges ("In Stock" / "Low Stock" / "Out of Stock").
- **Real-Time Purchase Flow**: "Buy Now" drawer with quantity selector respecting live inventory constraints.
- **Server-Side Price Integrity**: Order totals are strictly calculated server-side from direct database prices — client-tampered totals are rejected/ignored.
- **Atomic Stock Decrement**: Transactions lock database rows (`select_for_update`) to prevent race conditions or overselling.
- **Order History**: Personal order ledger displaying purchased items, quantities, and historical purchase-time unit prices.

### Admin Console (`/admin`)
- **Executive Dashboard**: Real-time metrics for Total Products, Total Categories, Total Orders, Total Customers, and Gross Revenue.
- **Category Management**: Full CRUD (Create, Read, Update, Delete) with validation preventing deletion of categories containing active products.
- **Product Catalog Management**: Create, edit, and delete shoe products with multipart/form-data image uploads, price validation, and stock control.
- **Order Fulfillment Center**: View all customer orders, inspect buyer details, examine purchased items, and mark orders as "Completed".

### Security & Architecture
- **Custom User Model**: Django `accounts.User` supporting `admin` and `customer` roles.
- **Role-Based Server Authorization**: Custom DRF permissions (`IsAdminUserRole`, `IsCustomerUserRole`) enforced on all API endpoints.
- **SimpleJWT Authentication**: Secure token pairs (access token + refresh token), token rotation, and blacklisting on logout.
- **Axios Interceptor**: Automatically injects JWT Bearer headers and refreshes expired access tokens seamlessly without logging the user out.

---

## 2. Technology Stack

### Backend
- **Python 3.14**
- **Django 5.x / 6.x**
- **Django REST Framework (DRF)**
- **MySQL** (via `PyMySQL` adapter with fallback to SQLite for immediate local testing if MySQL service is offline)
- **django-cors-headers**
- **djangorestframework-simplejwt** (with token blacklist)
- **Pillow** (Image processing & validation)
- **python-dotenv**

### Frontend
- **React 19**
- **Vite**
- **Tailwind CSS v4**
- **React Router DOM v7**
- **Axios** (with token interceptors)
- **Lucide React** (Modern iconography)

---

## 3. Project Structure

```text
shopease/
│
├── backend/
│   ├── config/                     # Django core settings, URL routing, WSGI/ASGI
│   ├── accounts/                   # Custom User model, JWT authentication, permissions
│   ├── categories/                 # Category models, serializers, and views
│   ├── products/                   # Product catalog, multipart image uploads
│   ├── orders/                     # Orders, items, atomic stock transactions, stats
│   ├── media/                      # Uploaded and seeded product images
│   ├── manage.py                   # Django management executable
│   ├── requirements.txt            # Python dependencies
│   ├── test_verification.py        # Automated test suite covering 20 scenarios
│   └── .env.example                # Backend environment template
│
├── frontend/
│   ├── public/                     # Static assets & favicon
│   ├── src/
│   │   ├── components/             # Navbar, Footer, ProductCard, Modals, Skeleton
│   │   ├── context/                # AuthContext (JWT state), ToastContext
│   │   ├── pages/                  # Storefront, Orders, Login, Register
│   │   │   └── admin/              # Admin Dashboard, Products, Categories, Orders
│   │   ├── services/               # Axios API client, auth, products, categories, orders
│   │   ├── styles/                 # Tailwind CSS styles and animations
│   │   ├── App.jsx                 # Routing configuration & route protection
│   │   └── main.jsx                # Application root mount
│   ├── package.json                # Frontend dependencies
│   ├── vite.config.js              # Vite configuration with Tailwind CSS plugin
│   └── .env.example                # Frontend environment template
│
├── .gitignore
└── README.md
```

---

## 4. Quick Start Guide

### 1. Backend Startup

In terminal 1:
```bash
cd shopease/backend
.\venv\Scripts\Activate.ps1
python manage.py migrate
python manage.py seed_data
python manage.py runserver 127.0.0.1:8000
```

### 2. Frontend Startup

In terminal 2:
```bash
cd shopease/frontend
npm run dev
```
Open your browser at `http://localhost:5173`.

### 3. Login Credentials

- **Customer Account**: `customer` / `customer123`
- **Admin Account**: `admin` / `admin123`
*(Or use the 1-click demo login buttons on the login page)*
