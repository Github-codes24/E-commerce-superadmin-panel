# E-commerce Super Admin Panel - API Specification

This document outlines the API endpoints required to support the E-commerce Super Admin Panel. It serves as a contract between the frontend React application and the backend server.

---

## 1. Authentication & Security

### Admin Login
* **Endpoint:** `POST /api/auth/login`
* **Description:** Authenticates the super admin and returns a JWT token.
* **Request Body:**
  ```json
  {
    "email": "admin@example.com",
    "password": "securepassword"
  }
  ```
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIsIn...",
    "admin": {
      "id": 1,
      "name": "Michael Dell",
      "email": "admin@example.com",
      "role": "Super Admin",
      "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb"
    }
  }
  ```

### Forgot Password
* **Endpoint:** `POST /api/auth/forgot-password`
* **Description:** Initiates password recovery. Sends a 4-digit verification code (OTP) to the registered email.
* **Request Body:**
  ```json
  {
    "email": "admin@example.com"
  }
  ```
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "OTP sent successfully to your registered email address."
  }
  ```

### Verify OTP
* **Endpoint:** `POST /api/auth/verify-otp`
* **Description:** Validates the OTP entered by the user.
* **Request Body:**
  ```json
  {
    "email": "admin@example.com",
    "otp": "1234"
  }
  ```
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "OTP verified successfully. You may now reset your password.",
    "resetToken": "temp-reset-token-xyz"
  }
  ```

### Reset Password
* **Endpoint:** `POST /api/auth/reset-password`
* **Description:** Sets a new password using the temporary reset token.
* **Request Body:**
  ```json
  {
    "email": "admin@example.com",
    "resetToken": "temp-reset-token-xyz",
    "newPassword": "newSecurePassword123"
  }
  ```
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Password reset successful."
  }
  ```

### Resend OTP
* **Endpoint:** `POST /api/auth/resend-otp`
* **Description:** Regenerates and resends the 4-digit OTP code.
* **Request Body:**
  ```json
  {
    "email": "admin@example.com"
  }
  ```
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "OTP resent successfully."
  }
  ```

---

## 2. Dashboard Statistics & Overview

### Get Dashboard Stats Summary
* **Endpoint:** `GET /api/dashboard/stats`
* **Description:** Retrieves total metrics for the dashboard summary cards.
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "totalRevenue": 556879,
      "totalSales": 188879,
      "totalOrders": 506,
      "activeVendors": 240,
      "activeUsers": 1000
    }
  }
  ```

### Get Recent Activity Logs
* **Endpoint:** `GET /api/dashboard/recent-activities`
* **Description:** Lists recent system activities logged.
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "activities": [
      { "id": 1, "title": "New Vendor Verification Pending", "timestamp": "2026-08-17T22:23:00Z" },
      { "id": 2, "title": "Admin logged in", "timestamp": "2026-08-17T00:49:00Z" }
    ]
  }
  ```

### Get Recent Orders Feed
* **Endpoint:** `GET /api/dashboard/recent-orders`
* **Description:** Gets a short list of the most recent orders.
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "orders": [
      { "id": "#ORD_001", "customer": "Joss Butt", "time": "1h ago", "amount": 13000, "status": "delivered" }
    ]
  }
  ```

---

## 3. Super Admin Profile

### Get Admin Profile Details
* **Endpoint:** `GET /api/profile`
* **Description:** Gets details of the currently logged-in super admin.
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "profile": {
      "name": "Michael Dell",
      "role": "Super Admin",
      "phone": "9876543210",
      "email": "example@123@gmail.com",
      "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb"
    }
  }
  ```

### Update Admin Profile
* **Endpoint:** `PUT /api/profile`
* **Description:** Updates the profile information or avatar.
* **Request Body:** (multipart/form-data or JSON)
  ```json
  {
    "name": "Michael Dell",
    "phone": "9876543210",
    "email": "example@123@gmail.com",
    "avatar": "data:image/png;base64,..."
  }
  ```
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Profile updated successfully.",
    "profile": {
      "name": "Michael Dell",
      "role": "Super Admin",
      "phone": "9876543210",
      "email": "example@123@gmail.com",
      "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb"
    }
  }
  ```

### Change Password (In-Profile)
* **Endpoint:** `PUT /api/profile/change-password`
* **Description:** Changes the password of the active logged-in user.
* **Request Body:**
  ```json
  {
    "currentPassword": "oldPassword123",
    "newPassword": "newPassword456"
  }
  ```
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Password changed successfully."
  }
  ```

---

## 4. Admins Management

### Get Admins List
* **Endpoint:** `GET /api/admins?search=&status=`
* **Description:** Retrieves all administrators list (with search query & status filter).
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "admins": [
      {
        "id": 1,
        "name": "Ankit Sharma",
        "email": "ankit.sharma@example.com",
        "phone": "+91 9876543258",
        "gender": "Male",
        "status": "active",
        "joinedDate": "12 Jan 2025",
        "lastLogin": "16/05/2026"
      }
    ]
  }
  ```

### Get Admin Details
* **Endpoint:** `GET /api/admins/:id`
* **Description:** View full profile details of a specific admin.
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "admin": {
      "id": 1,
      "name": "Ankit Sharma",
      "email": "ankit.sharma@example.com",
      "phone": "+91 9876543258",
      "gender": "Male",
      "status": "active",
      "joinedDate": "12 Jan 2025",
      "lastLogin": "16/05/2026",
      "image": "https://images.unsplash.com/photo-..."
    }
  }
  ```

### Create Admin
* **Endpoint:** `POST /api/admins`
* **Description:** Registers a new admin.
* **Request Body:**
  ```json
  {
    "name": "New Admin Name",
    "email": "new.admin@example.com",
    "phone": "+91 9988776655",
    "gender": "Male",
    "isActive": true,
    "image": "base64_encoded_string_or_multipart"
  }
  ```
* **Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "Admin added successfully."
  }
  ```

### Edit Admin
* **Endpoint:** `PUT /api/admins/:id`
* **Description:** Edits fields for an administrator.
* **Request Body:** Same parameters as Create Admin.
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Admin updated successfully."
  }
  ```

### Update Admin Status
* **Endpoint:** `PATCH /api/admins/:id/status`
* **Description:** Activates or deactivates an administrator profile.
* **Request Body:**
  ```json
  {
    "status": "active" // or "inactive"
  }
  ```
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Admin status updated successfully."
  }
  ```

### Delete Admin
* **Endpoint:** `DELETE /api/admins/:id`
* **Description:** Deletes an admin profile permanently.
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Admin deleted successfully."
  }
  ```

---

## 5. Category Management

### Get Category List
* **Endpoint:** `GET /api/categories?search=&status=`
* **Description:** Retrieves all category cards/list.
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "categories": [
      {
        "id": 2,
        "name": "Beauty",
        "subcatsCount": 5,
        "productsCount": 76,
        "status": "inactive",
        "image": "https://images.unsplash.com/photo-..."
      }
    ]
  }
  ```

### Get Category Details
* **Endpoint:** `GET /api/categories/:id`
* **Description:** Fetches details of a category along with all associated subcategories.
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "category": {
      "id": 2,
      "name": "Beauty",
      "status": "inactive",
      "image": "https://images.unsplash.com/photo-..."
    },
    "subcategories": [
      { "id": 101, "name": "Skincare", "status": "active", "products": 45, "image": "..." }
    ]
  }
  ```

### Create Category
* **Endpoint:** `POST /api/categories`
* **Description:** Creates a new category card.
* **Request Body:**
  ```json
  {
    "name": "Category Name",
    "subcatsCount": 0,
    "status": "active",
    "image": "base64_or_url"
  }
  ```
* **Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "Category added successfully."
  }
  ```

### Edit Category
* **Endpoint:** `PUT /api/categories/:id`
* **Description:** Updates category parameters.
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Category updated successfully."
  }
  ```

### Delete Category
* **Endpoint:** `DELETE /api/categories/:id`
* **Description:** Deletes category permanently.
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Category deleted successfully."
  }
  ```

---

## 6. Product Management

### Get Products List
* **Endpoint:** `GET /api/products?search=&category=&status=`
* **Description:** Fetches products list with filters.
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "products": [
      {
        "id": 1,
        "name": "Wireless Headphones Pro",
        "vendor": "Sony Center",
        "category": "Electronics",
        "status": "active",
        "price": 12000,
        "stock": 48,
        "brand": "SoundPro",
        "image": "https://images.unsplash.com/photo-..."
      }
    ]
  }
  ```

### Get Product Details
* **Endpoint:** `GET /api/products/:id`
* **Description:** Returns the complete details of a single product.
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "product": {
      "id": 1,
      "name": "Wireless Headphones Pro",
      "vendor": "Sony Center",
      "category": "Electronics",
      "status": "active",
      "price": 12000,
      "stock": 48,
      "brand": "SoundPro",
      "color": "White & Blue",
      "tag": "Wireless, Headphones, Noise Cancellation",
      "returnPolicy": "7 Days Replacement",
      "desc": "Premium wireless headphones with active noise cancellation.",
      "image": "https://images.unsplash.com/photo-...",
      "joinedOn": "20 April 2026",
      "sales": 128
    }
  }
  ```

### Create Product
* **Endpoint:** `POST /api/products`
* **Description:** Creates a product listing.
* **Request Body:** Includes product name, brand, color, price, stock, category, tags, returnPolicy, status, and image files.
* **Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "Product created successfully."
  }
  ```

### Edit Product
* **Endpoint:** `PUT /api/products/:id`
* **Description:** Modifies product configuration.
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Product updated successfully."
  }
  ```

### Delete Product
* **Endpoint:** `DELETE /api/products/:id`
* **Description:** Deletes a product.
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Product deleted successfully."
  }
  ```

---

## 7. Vendor Management

### Get Vendors List
* **Endpoint:** `GET /api/vendors?search=&approval=&account=`
* **Description:** Lists onboarded shop vendors.
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "vendors": [
      {
        "id": 1,
        "name": "Sameer sharma",
        "shopName": "Sameer Shop",
        "category": "Fashion",
        "products": 540,
        "orders": 540,
        "joinedOn": "22 May 2026",
        "approval": "approved",
        "status": "active"
      }
    ]
  }
  ```

### Get Vendor Details
* **Endpoint:** `GET /api/vendors/:id`
* **Description:** Returns the details profile page for a single vendor.
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "vendor": {
      "id": 1,
      "name": "Sameer sharma",
      "shopName": "Sameer Shop",
      "category": "Fashion",
      "products": 540,
      "orders": 540,
      "joinedOn": "22 May 2026",
      "approval": "approved",
      "status": "active",
      "email": "sameer@gmail.com",
      "phone": "+91 9876543258",
      "dob": "11/09/2003",
      "gender": "Male",
      "bizType": "Individual seller",
      "gst": "22AAAAA0000A1Z5",
      "address": "456, Business Bay, T. Nagar, Pune",
      "revenue": "₹96,780"
    }
  }
  ```

### Create Vendor
* **Endpoint:** `POST /api/vendors`
* **Description:** Registers a new shop merchant.
* **Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "Vendor registered successfully."
  }
  ```

### Edit Vendor
* **Endpoint:** `PUT /api/vendors/:id`
* **Description:** Modifies shop metadata.
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Vendor details updated."
  }
  ```

### Approve/Reject Vendor
* **Endpoint:** `PATCH /api/vendors/:id/approval`
* **Description:** Performs vendor verification.
* **Request Body:**
  ```json
  {
    "approval": "approved" // or "rejected", "pending"
  }
  ```
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Vendor approval status updated."
  }
  ```

### Toggle Vendor Status
* **Endpoint:** `PATCH /api/vendors/:id/status`
* **Description:** Activates or deactivates the vendor store front.
* **Request Body:**
  ```json
  {
    "status": "active" // or "inactive"
  }
  ```
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Vendor account status updated."
  }
  ```

### Delete Vendor
* **Endpoint:** `DELETE /api/vendors/:id`
* **Description:** Deletes a vendor account record.
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Vendor removed."
  }
  ```

---

## 8. Customers Management

### Get Customers List
* **Endpoint:** `GET /api/customers?search=&status=`
* **Description:** Retrieves customers registry.
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "customers": [
      {
        "id": 1,
        "name": "Sameer Sharma",
        "phone": "9876543210",
        "email": "sameer@gmail.com",
        "joinedOn": "12 Jan 2025",
        "status": "active",
        "orders": 100,
        "spent": 45780,
        "returns": 34
      }
    ]
  }
  ```

### Get Customer Details
* **Endpoint:** `GET /api/customers/:id`
* **Description:** View full profile card, total spent details, orders and returns metrics.
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "customer": {
      "id": 1,
      "name": "Sameer Sharma",
      "phone": "9876543210",
      "email": "sameer@gmail.com",
      "joinedOn": "12 Jan 2025",
      "status": "active",
      "ordersCount": 100,
      "totalSpent": 45780,
      "totalReturns": 34
    }
  }
  ```

### Toggle Customer Ban Status
* **Endpoint:** `PATCH /api/customers/:id/status`
* **Description:** Block/Unblock customer access.
* **Request Body:**
  ```json
  {
    "status": "blocked" // or "active"
  }
  ```
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Customer status changed."
  }
  ```

### Delete Customer
* **Endpoint:** `DELETE /api/customers/:id`
* **Description:** Deletes customer profile.
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Customer record deleted."
  }
  ```

---

## 9. Orders Management

### Get Orders List
* **Endpoint:** `GET /api/orders?search=&status=`
* **Description:** Retrieves all client orders.
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "orders": [
      {
        "id": "#ORD_001",
        "customer": "Neha Trivedi",
        "vendor": "Sameer Sharma",
        "amount": 12000,
        "payment": "Paid",
        "status": "Pending"
      }
    ]
  }
  ```

### Get Order Details
* **Endpoint:** `GET /api/orders/:id`
* **Description:** View detailed specifications of an order, including shipment status.
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "order": {
      "id": "#ORD_001",
      "orderNo": "#28456876",
      "status": "Ordered",
      "customer": {
        "name": "Neha Trivedi",
        "phone": "+91 9876543210"
      },
      "address": "456, Business Bay, Pune",
      "paymentMethod": "Credit Card",
      "product": {
        "name": "Sony Camera",
        "size": "Free Size",
        "color": "Black",
        "qty": 1,
        "price": 7198
      },
      "totalAmount": 7213
    }
  }
  ```

### Update Order Status
* **Endpoint:** `PATCH /api/orders/:id/status`
* **Description:** Changes order tracking stage.
* **Request Body:**
  ```json
  {
    "status": "Shipped" // "Ordered" | "Processing" | "Shipped" | "Out Of Delivery" | "Delivered" | "Cancelled"
  }
  ```
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Order status updated successfully."
  }
  ```

---

## 10. Offers & Coupon Banners

### Get Offers List
* **Endpoint:** `GET /api/offers`
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "offers": [
      {
        "id": 1,
        "name": "Season Sale",
        "value": "20% off Fashion",
        "status": "Sheduled",
        "startDate": "2026-06-01",
        "endDate": "2026-06-11",
        "image": "..."
      }
    ]
  }
  ```

### Create Offer
* **Endpoint:** `POST /api/offers`
* **Description:** Creates a promotional campaign.
* **Request Body:** Includes campaign name, value description, status, timeline dates, category target tags, and banner background image.
* **Response (210 Created):**
  ```json
  {
    "success": true,
    "message": "Offer created."
  }
  ```

### Get Coupons List
* **Endpoint:** `GET /api/coupons`
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "coupons": [
      {
        "id": 101,
        "code": "SUMMER25",
        "discount": "25%",
        "status": "Sheduled"
      }
    ]
  }
  ```

### Create Coupon
* **Endpoint:** `POST /api/coupons`
* **Request Body:**
  ```json
  {
    "code": "WELCOME20",
    "discount": "20%",
    "startDate": "2026-09-01",
    "endDate": "2026-09-30",
    "status": "Active"
  }
  ```
* **Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "Coupon registered successfully."
  }
  ```

### Create Offer / Coupon (Super Admin API)
* **Endpoint:** `POST /api/super-admin/offers-coupons/create`
* **Authentication:** Bearer Token
* **Authorization:** Super Admin
* **Request Body:**
  ```json
  {
    "type": "OFFER", // "OFFER" | "COUPON"
    "title": "Festival Sale",
    "discount": 20,
    "status": true
  }
  ```
* **Success Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "OFFER created successfully",
    "data": {
      "_id": "65abc123",
      "title": "Festival Sale",
      "discount": 20,
      "status": true
    }
  }
  ```
* **Error Response (400 Bad Request):**
  ```json
  {
    "success": false,
    "message": "Invalid type. Use OFFER or COUPON"
  }
  ```

### Get All Offers / Coupons (Super Admin API)
* **Endpoint:** `GET /api/super-admin/offers-coupons/get-all`
* **Authentication:** Bearer Token
* **Authorization:** Super Admin
* **Optional Query Parameters:** `type` (OFFER / COUPON), `status`, `search`
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Offers and coupons fetched successfully",
    "data": {
      "offers": [],
      "coupons": []
    }
  }
  ```
* **Error Response (400 Bad Request):**
  ```json
  {
    "success": false,
    "message": "Invalid type. Use OFFER or COUPON"
  }
  ```

### Get Offer / Coupon By ID (Super Admin API)
* **Endpoint:** `GET /api/super-admin/offers-coupons/get-byid/:id?type=OFFER`
* **Authentication:** Bearer Token
* **Authorization:** Super Admin
* **Query Parameters:** `type` = `OFFER` or `COUPON`
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "OFFER fetched successfully",
    "data": {
      "_id": "65abc123",
      "title": "Festival Sale",
      "discount": 20,
      "status": true
    }
  }
  ```
* **Error Response (404 Not Found):**
  ```json
  {
    "success": false,
    "message": "OFFER not found"
  }
  ```

### Update Offer / Coupon (Super Admin API)
* **Endpoint:** `PUT /api/super-admin/offers-coupons/update/:id`
* **Authentication:** Bearer Token
* **Authorization:** Super Admin
* **Request Body:**
  ```json
  {
    "type": "OFFER",
    "title": "Updated Festival Sale",
    "discount": 30,
    "status": true
  }
  ```
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "OFFER updated successfully",
    "data": {
      "_id": "65abc123",
      "title": "Updated Festival Sale",
      "discount": 30,
      "status": true
    }
  }
  ```
* **Error Response (404 Not Found):**
  ```json
  {
    "success": false,
    "message": "OFFER not found"
  }
  ```

### Update Offer / Coupon Status (Super Admin API)
* **Endpoint:** `PATCH /api/super-admin/offers-coupons/status/:id`
* **Authentication:** Bearer Token
* **Authorization:** Super Admin
* **Request Body:**
  ```json
  {
    "type": "OFFER", // "OFFER" | "COUPON"
    "status": false // boolean
  }
  ```
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "OFFER status updated successfully",
    "data": {
      "_id": "65abc123",
      "title": "Festival Sale",
      "discount": 20,
      "status": false
    }
  }
  ```
* **Error Response (404 Not Found):**
  ```json
  {
    "success": false,
    "message": "OFFER not found"
  }
  ```

*(Additional standard REST endpoints for editing and deleting offers/coupons are supported: `PUT /api/offers/:id`, `DELETE /api/offers/:id`, `PUT /api/coupons/:id`, `DELETE /api/coupons/:id`)*

---

## 11. Commission Management

### Get Commissions List
* **Endpoint:** `GET /api/commissions`
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "commissions": [
      { "id": 1, "category": "Fashion", "rate": "8%", "vendors": 42, "status": "Active" }
    ]
  }
  ```

### Create Commission Rate
* **Endpoint:** `POST /api/commissions`
* **Request Body:**
  ```json
  {
    "category": "New Category",
    "rate": "10%",
    "status": "Active"
  }
  ```
* **Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "Commission rate established."
  }
  ```

### Delete / Update Commissions
* **Endpoints:** `PUT /api/commissions/:id` and `DELETE /api/commissions/:id`

---

## 12. Payment Monitoring & Refunds

### Get Payments List
* **Endpoint:** `GET /api/payments?search=&method=&status=`
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "payments": [
      {
        "id": 1,
        "paymentId": "Pay_101",
        "orderId": "Order#28456876",
        "customerName": "John Doe",
        "method": "Apple Pay",
        "status": "Success",
        "amount": "₹5000"
      }
    ]
  }
  ```

### Process Payment Refund
* **Endpoint:** `POST /api/payments/:id/refund`
* **Description:** Initiates refund processing back to the payment provider.
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Refund processed successfully."
  }
  ```

---

## 13. Permissions Management

### Get Roles & Permissions Map
* **Endpoint:** `GET /api/permissions`
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "modules": [
      {
        "id": "admins",
        "name": "Admins Management",
        "permissions": ["Add Admin", "Edit Admin", "Delete Admin"]
      }
    ]
  }
  ```

### Add Permission
* **Endpoint:** `POST /api/permissions`
* **Request Body:**
  ```json
  {
    "moduleId": "admins",
    "permission": "Reset Admin Password"
  }
  ```
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Permission added successfully."
  }
  ```

---

## 14. Notifications & Alerts

### Get Notifications
* **Endpoint:** `GET /api/notifications`
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "notifications": [
      { "id": 1, "title": "New Customer Registered", "description": "Lacus commodo in elementum facilisis...", "time": "8h ago" }
    ]
  }
  ```

---

## 15. Reports & Analytical Insights

### Get Revenue Overview Analytics
* **Endpoint:** `GET /api/reports/revenue`
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "revenueData": {
      "thisYear": [1000, 2000, 1500, 3000, 2500, 4000],
      "lastYear": [800, 1500, 1200, 2500, 2000, 3500],
      "months": ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
    }
  }
  ```

### Get Sales Breakdown by Category
* **Endpoint:** `GET /api/reports/sales-categories`
* **Response (200 OK):**
  ```json
  {
    "success": true,
    "categories": [
      { "name": "Fashion", "value": "20%", "color": "#ff2d55" },
      { "name": "Beauty", "value": "25%", "color": "#00b0ff" }
    ]
  }
  ```
