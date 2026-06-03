# DineFlow - Virtual Restaurant Management System

DineFlow is a full-stack virtual restaurant management platform built with **Spring Boot, Angular, MySQL, JWT authentication, and role-based access control**.

It allows customers to browse menu items, place food orders, make mock payments, reserve tables, and preorder food. Admin users can manage restaurant operations such as menu items, tables, staff, orders, payments, reservations, and dashboard analytics. Kitchen staff can manage food preparation statuses.

---

## Live Website

Add your deployed website link here:

**Live Demo:** [DineFlow Website](YOUR_WEBSITE_LINK_HERE)

Example:

```md
**Live Demo:** [DineFlow Website](https://your-dineflow-site.com)
````

---

## Project Overview

DineFlow digitizes restaurant operations by connecting customers, kitchen staff, and administrators in one platform.

The system supports:

* Customer online ordering
* Table-based food ordering
* Mock payment flow
* Table reservation
* Food preorder during reservation
* Kitchen order status updates
* Admin dashboard analytics
* Menu, table, staff, order, payment, and reservation management

---

## Tech Stack

### Backend

* Java
* Spring Boot
* Spring Security
* JWT Authentication
* Spring Data JPA
* MySQL
* Maven
* Lombok

### Frontend

* Angular
* TypeScript
* Standalone Components
* Reactive Forms
* Bootstrap
* CSS
* JWT Interceptor
* Auth Guard
* Role Guard

### Database

* MySQL

---

## User Roles

### Admin

Admin can:

* View dashboard analytics
* Manage menu categories
* Manage menu items
* Manage restaurant tables
* View and manage orders
* View payments
* Create staff users
* View staff list
* Update staff status
* Manage table reservations
* Update profile
* Change password

### Customer

Customer can:

* Register and login
* View menu
* Select table
* Add food items to cart
* Place order
* View own orders
* Make mock payment
* Reserve table
* Preorder food with reservation
* View own reservations
* Update profile
* Change password
* Use forgot/reset password

### Kitchen Staff

Kitchen staff can:

* Login
* View kitchen orders
* Update order status
* View profile
* Change password

---

## Main Features

### Authentication and Authorization

* JWT-based login
* Role-based access control
* Admin, Customer, and Kitchen role separation
* Protected frontend routes
* JWT interceptor for authenticated API calls
* Forgot password and reset password flow
* Change password
* Profile management

---

### Admin Dashboard

Admin dashboard shows:

* Today Revenue
* This Month Revenue
* Total Revenue
* Today Orders
* Orders Awaiting Action
* Unpaid Orders
* Paid Orders
* Total Customers
* Revenue trend chart
* Customer growth chart
* Top selling dishes

---

### Menu Management

Admin can:

* Create menu categories
* Upload category images
* Activate/deactivate categories
* Create menu items
* Upload menu item images/videos
* Mark menu items as available/unavailable
* Edit menu item details

---

### Table Management

Admin can:

* Create restaurant tables
* Set table capacity
* Update table status

Table statuses include:

* AVAILABLE
* OCCUPIED
* RESERVED

---

### Order Management

Customer can place orders by selecting a table and adding food items to cart.

Order status flow:

```text
PLACED → ACCEPTED → PREPARING → READY → SERVED → PAID
```

Admin and Kitchen staff can update order statuses based on their role.

---

### Payment Management

The current payment flow is implemented as a mock payment system.

Supported mock payment methods:

* UPI
* CARD
* CASH

When a customer makes payment:

* Payment record is created
* Payment status becomes SUCCESS
* Order status becomes PAID
* Table becomes available again

In production, this can be integrated with:

* Razorpay
* Stripe
* PayPal

---

### Staff Management

Admin can:

* Create ADMIN and KITCHEN users
* View staff users
* Filter staff by role
* Update staff status

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

* Select table
* Select future date and time
* Enter guest count
* Preorder food items
* Book reservation
* View own reservations

Admin can:

* View today reservations
* View all reservations
* Search reservations by date
* Confirm reservations
* Complete reservations
* Cancel reservations
* View preordered food details

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
└── pom.xml
```

### Frontend Structure

```text
dineflow-frontend/
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

Run your `schema.sql` file to create all tables.

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

---

## Backend Setup

### 1. Configure database

Open:

```text
dineflow-backend/src/main/resources/application.properties
```

Example configuration:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/dineflow_db
spring.datasource.username=root
spring.datasource.password=your_mysql_password

spring.jpa.hibernate.ddl-auto=none
spring.jpa.show-sql=true

server.port=8080
```

### 2. Run backend

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

Open:

```text
src/environments/environment.ts
```

Use:

```ts
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8080/api'
};
```

### 3. Run frontend

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
mvn clean compile
```

### Frontend build

```bash
ng build
```

Build output:

```text
dist/dineflow-frontend
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

* Login
* Register
* Forgot Password
* Reset Password
* Unauthorized Page

### Admin Pages

* Dashboard
* Menu Categories
* Menu Items
* Tables
* Orders
* Payments
* Create Staff
* Staff Management
* Reservations
* Profile

### Customer Pages

* Menu
* My Orders
* Payment
* Book Table
* My Reservations
* Profile

### Kitchen Pages

* Kitchen Orders
* Profile

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

* Login as admin
* View dashboard
* Create category
* Upload category image
* Create menu item
* Upload menu item image
* Create table
* View all orders
* Update order status
* View payments
* Create staff user
* Update staff status
* View reservations
* Confirm/cancel/complete reservation
* Update profile
* Change password
* Logout

### Customer Testing

* Register customer
* Login
* View menu
* Add items to cart
* Place order
* View my orders
* Make payment
* Book table
* Preorder food
* View my reservations
* Update profile
* Change password
* Forgot/reset password
* Logout

### Kitchen Testing

* Login as kitchen staff
* View kitchen orders
* Update order status
* Update profile
* Change password
* Logout

---

## Future Enhancements

Possible improvements:

* Real payment gateway integration
* Email sending for reset password token
* SMS or WhatsApp notifications
* Invoice generation
* Coupon and discount system
* Table time-slot calendar
* Reservation advance payment
* Multi-branch restaurant support
* Export reports as PDF/Excel
* Real-time order updates using WebSocket
* Mobile responsive improvements

---

## Project Summary

DineFlow is a complete role-based virtual restaurant management system built using Spring Boot, Angular, MySQL, and JWT authentication. It supports restaurant ordering, mock payments, kitchen order handling, staff management, table reservations, food preordering, and admin analytics in one full-stack application.

````

Replace:

```text
YOUR_WEBSITE_LINK_HERE
````

with your actual deployed website link.
