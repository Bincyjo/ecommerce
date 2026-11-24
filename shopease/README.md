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

## 4. Prerequisites

Before running the application, ensure you have:
1. **Python 3.10+** (Available from [python.org](https://www.python.org))
2. **Node.js 18+ & npm** (Available from [nodejs.org](https://nodejs.org))
3. **MySQL Server** (Optional for local testing; default settings automatically fall back to SQLite if MySQL is not running on port 3306)

---

## 5. MySQL Database Setup

1. Start your local MySQL service (e.g. via MySQL Command Line, MySQL Workbench, or XAMPP).
2. Create the database and user:
   ```sql
   CREATE DATABASE shopease_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
3. If using root without password or a specific user:
   ```sql
   GRANT ALL PRIVILEGES ON shopease_db.* TO 'root'@'localhost';
   FLUSH PRIVILEGES;
   ```

---

## 6. Backend Setup & Startup

### Step 1: Navigate to the backend directory
```bash
cd shopease/backend
```

### Step 2: Create and activate a Python virtual environment
- **On Windows (PowerShell):**
  ```powershell
  python -m venv venv
  .\venv\Scripts\Activate.ps1
  ```
- **On Linux / macOS:**
  ```bash
  python3 -m venv venv
  source venv/bin/activate
  ```

### Step 3: Install backend dependencies
```bash
pip install -r requirements.txt
```

### Step 4: Configure environment variables
Create `.env` inside `shopease/backend/`:
```env
SECRET_KEY=django-insecure-shopease-ecommerce-production-secret-key-change-in-prod
DEBUG=True
DB_NAME=shopease_db
DB_USER=root
DB_PASSWORD=
DB_HOST=localhost
DB_PORT=3306
# Set USE_SQLITE=True if you wish to run on SQLite instead of MySQL
USE_SQLITE=False
```

### Step 5: Run database migrations
```bash
python manage.py makemigrations accounts categories products orders
python manage.py migrate
```

### Step 6: Seed initial demo data (Admin, Customer, Categories, Products & Images)
Run the automated seed command:
```bash
python manage.py seed_data
```
This automatically sets up:
- **Admin account**: `username: admin`, `password: admin123`
- **Customer account**: `username: customer`, `password: customer123`
- 5 Product categories ("Running Shoes", "Casual Sneakers", etc.)
- 8 Footwear products with generated images in `media/products/`
- Initial sample order

### Step 7: Start the Django development server
```bash
python manage.py runserver 127.0.0.1:8000
```
The DRF API is now live at: `http://127.0.0.1:8000/api/`

---

## 7. Frontend Setup & Startup

### Step 1: Open a new terminal and navigate to the frontend directory
```bash
cd shopease/frontend
```

### Step 2: Install Node dependencies
```bash
npm install
```

### Step 3: Configure frontend environment
Create `.env` inside `shopease/frontend/`:
```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

### Step 4: Start the Vite development server
```bash
npm run dev
```
The React frontend will be accessible at: `http://localhost:5173/`

---

## 8. Application Demo Credentials

| Role | Username | Password | Purpose |
| :--- | :--- | :--- | :--- |
| **Customer** | `customer` | `customer123` | Browse store, filter categories, purchase shoes, view personal order history. |
| **Admin** | `admin` | `admin123` | Access Admin Console (`/admin`), manage categories, products (with images), view all orders, complete orders. |

*(Quick-fill buttons for both roles are available directly on the `/login` page).*

---

## 9. REST API Endpoint Reference

### Authentication (`/api/auth/`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register/` | Public | Register customer account (always sets role `customer`). |
| `POST` | `/api/auth/login/` | Public | Obtain JWT `access` and `refresh` tokens + user profile. |
| `POST` | `/api/auth/token/refresh/` | Public | Refresh expired access token with valid refresh token. |
| `POST` | `/api/auth/logout/` | Authenticated | Blacklist refresh token and invalidate session. |
| `GET` | `/api/auth/me/` | Authenticated | Fetch current user details. |

### Categories (`/api/categories/`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/categories/` | Public | List all categories with product counts. |
| `POST` | `/api/categories/` | Admin | Create a new category. |
| `PUT` | `/api/categories/{id}/` | Admin | Update category details. |
| `DELETE` | `/api/categories/{id}/` | Admin | Delete category (blocked if active products exist). |

### Products (`/api/products/`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/products/` | Public | List products (supports `?category=id`, `?search=term`, `?ordering=price`). |
| `GET` | `/api/products/{id}/` | Public | Retrieve single product details. |
| `POST` | `/api/products/` | Admin | Create product with multipart image upload. |
| `PUT` | `/api/products/{id}/` | Admin | Update product details and/or replace image. |
| `DELETE` | `/api/products/{id}/` | Admin | Delete product. |

### Orders & Analytics (`/api/orders/`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/orders/` | Customer | Place order with atomic stock decrement and server-side pricing. |
| `GET` | `/api/orders/` | Authenticated | Customers view only their orders; Admins view all orders. |
| `GET` | `/api/orders/{id}/` | Authenticated | Retrieve order details with items and purchase prices. |
| `PATCH` | `/api/orders/{id}/complete/` | Admin | Mark placed order as completed. |
| `GET` | `/api/orders/dashboard-stats/` | Admin | Aggregated analytics for admin overview dashboard. |

---

## 10. Automated Test Verification

A test script is included in `shopease/backend/test_verification.py`. It executes 20 scenarios verifying:
1. Customer registration creates `role='customer'`
2. Customer login returns JWT token pair
3. Admin login returns admin role
4. JWT token refresh
5. Admin category creation
6. Non-admin category creation rejection (403)
7. Product creation & edit
8. Customer product browsing
9. Category filtering
10. Insufficient stock rejection (400)
11. Server-side total calculation (never trusts frontend payload)
12. Frontend total tampering resistance
13. Stock decrement inside `transaction.atomic()` with row-locking
14. Customer order history isolation
15. Admin access to all orders
16. Admin order completion (`PATCH /complete/`)
17. Customer blocked from completing orders (403)
18. Foreign key database protection constraints

To execute the verification test:
```bash
cd shopease/backend
.\venv\Scripts\python.exe test_verification.py
```
Expected output:
```text
ALL 20 VERIFICATION CHECKS PASSED WITH ZERO ERRORS!
```
