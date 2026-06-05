# DineFlow - Virtual Restaurant Management System

DineFlow is a full-stack virtual restaurant management platform built with **Spring Boot, Angular, MySQL, JWT Authentication, and Role-Based Access Control**.

It is designed for restaurants to manage orders, tables, payments, staff, kitchen workflow, reservations, and dashboard analytics. It also provides customers with an easy way to order food, track order status, make payments, and book tables online.

---

## Live Demo

🌐 **Live Demo:** [DineFlow Website](https://dineflow-platform.netlify.app/)

> Note: The backend is hosted on Render free tier, so the first request may take a few seconds if the server is inactive.
---

## Project Screenshots

### Login Page
<img width="1919" height="973" alt="Screenshot 2026-06-05 162051" src="https://github.com/user-attachments/assets/bc98838d-0cbf-4754-a46f-118c000d782e" />


### Admin Home / Dashboard
<img width="1911" height="968" alt="Screenshot 2026-06-05 160313" src="https://github.com/user-attachments/assets/16b17c30-fc50-43d6-a2f5-c3037bc9284b" />


### Customer Home / Menu Page
<img width="1916" height="969" alt="Screenshot 2026-06-05 160442" src="https://github.com/user-attachments/assets/b7128675-1b4a-4357-8f51-c36443b98c8f" />


### Kitchen Home / Orders Page
<img width="1915" height="970" alt="Screenshot 2026-06-05 160534" src="https://github.com/user-attachments/assets/99dc912e-6798-46ae-87f9-e64ee0a0635c" />

---

## Project Overview

DineFlow digitizes restaurant operations by connecting **customers**, **kitchen staff**, and **administrators** in one platform.

The system supports:

- Customer online food ordering
- Table-based ordering
- Mock payment flow
- Table reservation
- Food preorder during reservation
- Kitchen order status updates
- Admin dashboard analytics
- Menu, table, staff, order, payment, and reservation management

---

## Tech Stack

### Backend

- Java
- Spring Boot
- Spring Security
- JWT Authentication
- Spring Data JPA
- MySQL
- Maven
- Lombok

### Frontend

- Angular
- TypeScript
- Standalone Components
- Reactive Forms
- Bootstrap
- CSS
- JWT Interceptor
- Auth Guard
- Role Guard

### Database

- MySQL
- Aiven MySQL for deployed database

### Deployment

- Frontend: Netlify
- Backend: Render
- Database: Aiven MySQL

---

## User Roles

### Admin

Admin can:

- View dashboard analytics
- Manage menu categories
- Manage menu items
- Manage restaurant tables
- View and manage orders
- View payments
- Create staff users
- View staff list
- Update staff status
- Manage table reservations
- Update profile
- Change password

### Customer

Customer can:

- Register and login
- View menu
- Select table
- Add food items to cart
- Place order
- View own orders
- Track order status
- Make mock payment
- Reserve table
- Preorder food with reservation
- View own reservations
- Update profile
- Change password
- Use forgot/reset password

### Kitchen Staff

Kitchen staff can:

- Login
- View kitchen orders
- Update order status
- View profile
- Change password

---

## Main Features

### Authentication and Authorization

- JWT-based login
- Role-based access control
- Admin, Customer, and Kitchen role separation
- Protected frontend routes
- JWT interceptor for authenticated API calls
- Forgot password and reset password flow
- Change password
- Profile management

---

### Admin Dashboard

Admin dashboard shows today/current operational status in a clean section-wise layout.

Dashboard sections include:

- Today Orders
  - Total Orders
  - Served Orders
  - Unserved Orders

- Today Reservations
  - Total Reservations
  - Served Reservations
  - Unserved Reservations

- Current Table Status
  - Total Tables
  - Reserved / Occupied Tables
  - Available Tables

- Today Bills / Payments
  - Total Bills
  - Paid Bills
  - Unpaid Bills

- Revenue & Business
  - Today Revenue
  - This Month Revenue
  - Total Customers

- Analytics
  - Revenue trend chart
  - Customer growth chart
  - Top selling dishes

---

### Menu Management

Admin can:

- Create menu categories
- Upload category images
- Activate/deactivate categories
- Create menu items
- Upload menu item images/videos
- Mark menu items as available/unavailable
- Edit menu item details

> Deployment note: For the live deployed version, demo images are served from Netlify static assets because Render free tier storage is temporary. In production, image upload can be integrated with Cloudinary or AWS S3.

---

### Table Management

Admin can:

- Create restaurant tables
- Set table capacity
- Update table status

Table statuses include:

```text
AVAILABLE
OCCUPIED
RESERVED
```

---

### Order Management

Customer can place orders by selecting a table and adding food items to cart.

Order status flow:

```text
PLACED → ACCEPTED → PREPARING → READY → SERVED → PAID
```

Admin and Kitchen staff can update order statuses based on their role.

Customer can view order status from the **My Orders** page.

---

### Payment Management

The current payment flow is implemented as a mock payment system.

Supported mock payment methods:

- UPI
- CARD
- CASH

When a customer makes payment:

- Payment record is created
- Payment status becomes SUCCESS
- Order status becomes PAID
- Table becomes available again

In production, this can be integrated with:

- Razorpay
- Stripe
- PayPal

---

### Staff Management

Admin can:

- Create ADMIN and KITCHEN users
- View staff users
- Filter staff by role
- Update staff status

Staff statuses:

```text
ACTIVE
ON_LEAVE
INACTIVE
EXITED
```

Only ACTIVE staff users should be allowed to continue normal access.

---

### Reservation Management

Customer can:

- Select table
- Select future date and time
- Enter guest count
- Preorder food items
- Book reservation
- View own reservations

Admin can:

- View today reservations
- View all reservations
- Search reservations by date
- Confirm reservations
- Complete reservations
- Cancel reservations
- View preordered food details

Reservation statuses:

```text
BOOKED
CONFIRMED
CANCELLED
COMPLETED
```

---

## Project Structure

### Backend Structure

```text
dineflow-backend/
├── src/main/java/com/dineflow/backend/
│   ├── config/
│   ├── controller/
│   ├── dto/
│   ├── entity/
│   ├── exception/
│   ├── repository/
│   ├── security/
│   ├── service/
│   └── DineflowBackendApplication.java
├── src/main/resources/
│   └── application.properties
├── Dockerfile
└── pom.xml
```

### Frontend Structure

```text
dineflow-frontend/
├── public/
│   ├── demo-images/
│   └── _redirects
├── src/app/
│   ├── core/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   ├── models/
│   │   └── services/
│   ├── features/
│   │   ├── admin/
│   │   ├── auth/
│   │   ├── customer/
│   │   ├── kitchen/
│   │   └── profile/
│   ├── layout/
│   └── app.routes.ts
├── src/environments/
└── package.json
```

---

## Database Setup

Create the database:

```sql
CREATE DATABASE IF NOT EXISTS dineflow_db;
USE dineflow_db;
```

Run your SQL schema file to create all tables.

Main tables:

```text
roles
users
password_reset_tokens
restaurant_tables
menu_categories
menu_items
orders
order_items
payments
table_reservations
reservation_items
```

Default roles:

```sql
INSERT INTO roles (role_name) VALUES
('ADMIN'),
('KITCHEN'),
('CUSTOMER');
```

For deployment, the project uses Aiven MySQL with `defaultdb`.

---

## Backend Setup

### 1. Configure database

Open:

```text
dineflow-backend/src/main/resources/application.properties
```

Use environment variables for safer deployment:

```properties
spring.application.name=dineflow-backend

server.port=${PORT:8080}

spring.datasource.url=${DB_URL}
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}

spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
spring.jpa.hibernate.ddl-auto=none
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.format_sql=false
spring.jpa.open-in-view=false

spring.servlet.multipart.max-file-size=50MB
spring.servlet.multipart.max-request-size=50MB

jwt.secret=${JWT_SECRET}
jwt.expiration=86400000
```

### 2. Run backend locally

```bash
cd dineflow-backend
mvn clean spring-boot:run
```

Backend runs on:

```text
http://localhost:8080
```

---

## Frontend Setup

### 1. Install dependencies

```bash
cd dineflow-frontend
npm install
```

### 2. Configure API URL

For local development, open:

```text
src/environments/environment.development.ts
```

Use:

```ts
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8080/api'
};
```

For production, open:

```text
src/environments/environment.ts
```

Use:

```ts
export const environment = {
  production: true,
  apiBaseUrl: 'https://dineflow-backend-zb9l.onrender.com/api'
};
```

### 3. Run frontend locally

```bash
ng serve
```

Frontend runs on:

```text
http://localhost:4200
```

---

## Build Commands

### Backend build

```bash
cd dineflow-backend
mvn clean package -DskipTests
```

### Frontend build

```bash
cd dineflow-frontend
npm run build
```

Angular build output:

```text
dist/dineflow-frontend/browser
```

---

## Deployment

### Backend Deployment - Render

Backend is deployed on Render using Docker.

Render settings:

```text
Runtime: Docker
Root Directory: dineflow-backend
Dockerfile Path: ./Dockerfile
Branch: main
```

Required Render environment variables:

```text
DB_URL=jdbc:mysql://AIVEN_HOST:AIVEN_PORT/defaultdb?sslMode=REQUIRED&serverTimezone=UTC
DB_USERNAME=avnadmin
DB_PASSWORD=your_aiven_password
JWT_SECRET=your_jwt_secret
```

### Frontend Deployment - Netlify

Frontend is deployed on Netlify.

Netlify build settings:

```text
Base directory: dineflow-frontend
Build command: npm run build
Publish directory: dist/dineflow-frontend/browser
```

Angular redirect file:

```text
dineflow-frontend/public/_redirects
```

Content:

```text
/* /index.html 200
```

---

## Important API Endpoints

### Auth APIs

```text
POST   /api/auth/login
POST   /api/auth/register-customer
POST   /api/auth/admin/create-staff
GET    /api/auth/profile
PUT    /api/auth/profile
PUT    /api/auth/change-password
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
GET    /api/auth/admin/staff
PATCH  /api/auth/admin/staff/{userId}/status
```

### Menu Category APIs

```text
GET    /api/menu-categories
POST   /api/menu-categories
PUT    /api/menu-categories/{id}
PATCH  /api/menu-categories/{id}/status
```

### Menu Item APIs

```text
GET    /api/menu-items
POST   /api/menu-items
PUT    /api/menu-items/{id}
PATCH  /api/menu-items/{id}/availability
```

### Table APIs

```text
GET    /api/tables
GET    /api/tables/available
POST   /api/tables
PATCH  /api/tables/{id}/status
```

### Order APIs

```text
POST   /api/orders
GET    /api/orders
GET    /api/orders/my-orders
GET    /api/orders/status/{status}
GET    /api/orders/today
GET    /api/orders/filter
PATCH  /api/orders/{orderId}/status
```

### Payment APIs

```text
POST   /api/payments
GET    /api/payments
GET    /api/payments/today
GET    /api/payments/filter
GET    /api/payments/order/{orderId}
```

### Reservation APIs

```text
POST   /api/reservations
GET    /api/reservations/my-reservations
GET    /api/reservations
GET    /api/reservations/date?reservationDate=YYYY-MM-DD
PATCH  /api/reservations/{reservationId}/status
```

### Dashboard APIs

```text
GET    /api/dashboard/admin/summary
GET    /api/dashboard/admin/analytics
```

---

## Screens / Modules

### Public Pages

- Login
- Register
- Forgot Password
- Reset Password
- Unauthorized Page

### Admin Pages

- Dashboard
- Menu Categories
- Menu Items
- Tables
- Orders
- Payments
- Create Staff
- Staff Management
- Reservations
- Profile

### Customer Pages

- Menu
- My Orders
- Payment
- Book Table
- My Reservations
- Profile

### Kitchen Pages

- Kitchen Orders
- Profile

---

## Sample Flow

### Customer Order Flow

```text
Customer Login
↓
View Menu
↓
Select Table
↓
Add Items to Cart
↓
Place Order
↓
View My Orders
↓
Make Mock Payment
↓
Order Status becomes PAID
```

### Kitchen Flow

```text
Kitchen Login
↓
View Orders
↓
Accept Order
↓
Mark Preparing
↓
Mark Ready
↓
Mark Served
```

### Reservation Flow

```text
Customer Login
↓
Book Table
↓
Select Date and Time
↓
Add Preorder Food
↓
Submit Reservation
↓
Admin Confirms / Cancels / Completes Reservation
```

---

## Testing Checklist

### Admin Testing

- Login as admin
- View dashboard
- Create category
- Upload category image
- Create menu item
- Upload menu item image
- Create table
- View all orders
- Update order status
- View payments
- Create staff user
- Update staff status
- View reservations
- Confirm/cancel/complete reservation
- Update profile
- Change password
- Logout

### Customer Testing

- Register customer
- Login
- View menu
- Add items to cart
- Place order
- View my orders
- Make payment
- Book table
- Preorder food
- View my reservations
- Update profile
- Change password
- Forgot/reset password
- Logout

### Kitchen Testing

- Login as kitchen staff
- View kitchen orders
- Update order status
- Update profile
- Change password
- Logout

---

## Future Enhancements

Possible improvements:

- Real payment gateway integration
- Email sending for reset password token
- SMS or WhatsApp notifications
- Invoice generation
- Coupon and discount system
- Table time-slot calendar
- Reservation advance payment
- Multi-branch restaurant support
- Export reports as PDF/Excel
- Real-time order updates using WebSocket
- Cloudinary or AWS S3 image storage
- Mobile responsive improvements

---

## Project Summary

DineFlow is a complete role-based virtual restaurant management system built using **Spring Boot, Angular, MySQL, and JWT Authentication**.

It supports restaurant ordering, mock payments, kitchen order handling, staff management, table reservations, food preordering, and admin analytics in one full-stack application.
