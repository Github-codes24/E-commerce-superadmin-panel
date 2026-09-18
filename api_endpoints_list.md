# E-commerce Super Admin Panel - Project API Endpoints List

This file lists all the API endpoints required to support the frontend Super Admin Panel. The URLs use `http://localhost:5000/api` as the base, and the payloads are structured to match the dummy data currently used in the React application.

---

## 1. Authentication & Super Admin Profile
These endpoints handle login, password recovery, and super admin account settings.

* **POST** `http://localhost:5000/api/super-admin/create`
  * *Description:* Creates a new super admin account.
* **POST** `http://localhost:5000/api/super-admin/login`
  * *Description:* Authenticates super admin credentials and returns a JWT token.
  * *Response Data:* `name: "Michael Dell"`, `role: "Super Admin"`, `email: "example@123@gmail.com"`, `phone: "9876543210"`
* **POST** `http://localhost:5000/api/super-admin/forgot-password`
  * *Description:* Sends a 4-digit OTP to the registered email.
* **POST** `http://localhost:5000/api/super-admin/verify-otp`
  * *Description:* Verifies the OTP.
* **GET** `http://localhost:5000/api/super-admin/profile`
  * *Description:* Retrieves the current profile data of the logged-in admin.
* **PUT** `http://localhost:5000/api/super-admin/profile/update`
  * *Description:* Updates current super admin profile details (name, email, phone, avatar).
* **POST** `http://localhost:5000/api/super-admin/change-password`
  * *Description:* Updates the password (validates old password, applies new password).

---

## 2. Dashboard
Endpoints for rendering the main dashboard viewport statistics and activity logs.

* **GET** `http://localhost:5000/api/dashboard/stats`
  * *Description:* Retrieves count summary statistics.
  * *Values:* Total Revenue (`₹ 5,56,879`), Total Sales (`₹ 1,88,879`), Total Orders (`506`), Total Products (`497`), Total Vendors (`210`), Total Customers (`1000`).
* **GET** `http://localhost:5000/api/dashboard/recent-activities`
  * *Description:* Lists recent feed activities.
* **GET** `http://localhost:5000/api/dashboard/recent-orders`
  * *Description:* Lists the latest 4-5 orders to show in the recent orders table.

---

## 3. Reports
Endpoints for loading graphical visual representations and analytics.

* **GET** `http://localhost:5000/api/reports/stats`
  * *Description:* Returns stats summary for the Reports page (Revenue, Sales, Orders, Active Vendors, Active Customers).
* **GET** `http://localhost:5000/api/reports/revenue-chart`
  * *Description:* Returns monthly sales/revenue data for the line chart (This year vs Last year).
* **GET** `http://localhost:5000/api/reports/category-chart`
  * *Description:* Returns category-wise distribution percentages for the donut chart (Fashion, Beauty, Kids, Electronics).

---

## 4. Admins Management
Endpoints for adding, editing, listing, and deleting panel administrators.

* **GET** `http://localhost:5000/api/admins`
  * *Description:* Lists all admins.
  * *Initial Count:* 6 admins (Total: 6, Active: 5, Inactive: 1).
* **POST** `http://localhost:5000/api/admins/add`
  * *Description:* Adds a new administrator.
* **PUT** `http://localhost:5000/api/admins/edit/:id`
  * *Description:* Updates admin information and status (Active/Inactive).
* **DELETE** `http://localhost:5000/api/admins/delete/:id`
  * *Description:* Deletes a single administrator.
* **POST** `http://localhost:5000/api/admins/bulk-delete`
  * *Description:* Deletes multiple selected admins at once.

---

## 5. Vendors Management
Endpoints for listing, updating, verifying, and checking vendor accounts.

* **GET** `http://localhost:5000/api/vendors`
  * *Description:* Lists all vendors.
  * *Initial Count:* 210 vendors (Total: 210, Active: 196, Inactive: 13, Pending: 1).
* **POST** `http://localhost:5000/api/vendors/add`
  * *Description:* Registers/Adds a new vendor.
* **PUT** `http://localhost:5000/api/vendors/edit/:id`
  * *Description:* Updates vendor info and details.
* **PUT** `http://localhost:5000/api/vendors/status/:id`
  * *Description:* Changes vendor account status (Active/Inactive/Suspended).
* **PUT** `http://localhost:5000/api/vendors/approve/:id`
  * *Description:* Approves a pending vendor.
* **DELETE** `http://localhost:5000/api/vendors/delete/:id`
  * *Description:* Deletes a vendor record.

---

## 6. Customers Management
Endpoints for checking, blocking, and managing customer accounts.

* **GET** `http://localhost:5000/api/customers`
  * *Description:* Lists all registered customers.
  * *Initial Count:* 1000 customers (Total: 1000, Active: 900, Blocked: 100).
* **PUT** `http://localhost:5000/api/customers/toggle-block/:id`
  * *Description:* Toggles customer status between Active and Blocked.
* **DELETE** `http://localhost:5000/api/customers/delete/:id`
  * *Description:* Removes customer account.

---

## 7. Product Management
Endpoints for handling the catalog products inventory.

* **GET** `http://localhost:5000/api/products`
  * *Description:* Lists all products.
  * *Initial Count:* 497 products (Total: 497, Active: 448, Out Of Stock: 49).
* **POST** `http://localhost:5000/api/products/add`
  * *Description:* Adds a new product to the catalog.
* **PUT** `http://localhost:5000/api/products/edit/:id`
  * *Description:* Updates product details (name, price, stock, variants).
* **PUT** `http://localhost:5000/api/products/toggle-status/:id`
  * *Description:* Toggles product between Active and Inactive.
* **DELETE** `http://localhost:5000/api/products/delete/:id`
  * *Description:* Deletes a product.

---

## 8. Category Management
Endpoints for handling catalog categories.

* **GET** `http://localhost:5000/api/categories`
  * *Description:* Lists all categories.
  * *Initial Count:* 19 categories (Total: 19, Active: 17, Inactive: 1).
* **POST** `http://localhost:5000/api/categories/add`
  * *Description:* Creates a new category.
* **PUT** `http://localhost:5000/api/categories/edit/:id`
  * *Description:* Updates category name, image, and status.
* **DELETE** `http://localhost:5000/api/categories/delete/:id`
  * *Description:* Deletes a category.

---

## 9. Orders Management
Endpoints for order fulfillment and status monitoring.

* **GET** `http://localhost:5000/api/orders`
  * *Description:* Lists all orders.
  * *Initial Count:* 12,645 orders (Total: 12,645, Delivered: 10,245, Processing: 1,823, Cancelled: 377).
* **GET** `http://localhost:5000/api/orders/details/:id`
  * *Description:* Retrieves full order, shipping, timeline, and pricing details.
* **PUT** `http://localhost:5000/api/orders/update-status/:id`
  * *Description:* Updates order fulfillment stage (Ordered, Shipped, Out For Delivery, Delivered, Cancelled).
* **PUT** `http://localhost:5000/api/orders/update-address/:id`
  * *Description:* Updates the shipping destination address.

---

## 10. Permissions Management
Endpoints for managing access control list roles.

* **GET** `http://localhost:5000/api/permissions/roles`
  * *Description:* Lists roles and their active permissions modules (Orders, Products, Vendors, etc.).
* **PUT** `http://localhost:5000/api/permissions/roles/:id`
  * *Description:* Modifies a role's read/write permissions checkmarks.

---

## 11. Offers & Coupons
Endpoints for promotional discount codes and banner offers.

* **POST** `http://localhost:5000/api/super-admin/offers-coupons/create`
  * *Description:* Creates a new Offer or Coupon.
  * *Request Body:* `{ type: "OFFER" | "COUPON", title: "Festival Sale", discount: 20, status: true }`
  * *Response (201):* `{ success: true, message: "OFFER created successfully", data: { _id: "65abc123", title: "Festival Sale", discount: 20, status: true } }`
* **GET** `http://localhost:5000/api/super-admin/offers-coupons/get-all`
  * *Description:* Retrieves all offers and coupons.
  * *Response (200):* `{ success: true, message: "Offers and coupons fetched successfully", data: { offers: [], coupons: [] } }`
* **GET** `http://localhost:5000/api/super-admin/offers-coupons/get-byid/:id?type=OFFER`
  * *Description:* Retrieves single Offer or Coupon details by ID.
  * *Response (200):* `{ success: true, message: "OFFER fetched successfully", data: { _id: "65abc123", title: "Festival Sale", discount: 20, status: true } }`
* **PUT** `http://localhost:5000/api/super-admin/offers-coupons/update/:id`
  * *Description:* Updates an Offer or Coupon by ID.
  * *Request Body:* `{ type: "OFFER" | "COUPON", title: "Updated Festival Sale", discount: 30, status: true }`
  * *Response (200):* `{ success: true, message: "OFFER updated successfully", data: { _id: "65abc123", title: "Updated Festival Sale", discount: 30, status: true } }`
* **PATCH** `http://localhost:5000/api/super-admin/offers-coupons/status/:id`
  * *Description:* Updates status (Active/Inactive) of an Offer or Coupon.
  * *Request Body:* `{ type: "OFFER" | "COUPON", status: false }`
  * *Response (200):* `{ success: true, message: "OFFER status updated successfully", data: { _id: "65abc123", title: "Festival Sale", discount: 20, status: false } }`
* **DELETE** `http://localhost:5000/api/super-admin/offers-coupons/delete/:id?type=OFFER`
  * *Description:* Deletes an Offer or Coupon by ID.
  * *Query Parameter:* `type=OFFER` or `type=COUPON`
  * *Response (200):* `{ success: true, message: "OFFER deleted successfully", data: null }`
* **GET** `http://localhost:5000/api/offers`
  * *Description:* Lists active/scheduled offers. (Total: 8, Active: 3).
* **POST** `http://localhost:5000/api/offers/add`
  * *Description:* Creates a new promo offer campaign.
* **PUT** `http://localhost:5000/api/offers/edit/:id`
  * *Description:* Updates offer details.
* **DELETE** `http://localhost:5000/api/offers/delete/:id`
  * *Description:* Removes offer.
* **GET** `http://localhost:5000/api/coupons`
  * *Description:* Lists promotional coupons. (Total: 8, Active: 3).
* **POST** `http://localhost:5000/api/coupons/add`
  * *Description:* Generates a new coupon code.
* **PUT** `http://localhost:5000/api/coupons/edit/:id`
  * *Description:* Edits coupon properties.
* **DELETE** `http://localhost:5000/api/coupons/delete/:id`
  * *Description:* Deletes coupon code.

---

## 12. Commission Management
Endpoints for vendor billing and super admin payouts.

* **GET** `http://localhost:5000/api/commissions`
  * *Description:* Lists all vendor commission histories and payout details.
* **PUT** `http://localhost:5000/api/commissions/rate/:vendorId`
  * *Description:* Updates the global/specific commission rate (%).
* **PUT** `http://localhost:5000/api/commissions/payout-status/:id`
  * *Description:* Updates a vendor payout line status (e.g. Paid, Unpaid).

---

## 13. Payment Monitoring
Endpoints for tracking customer transactions.

* **GET** `http://localhost:5000/api/super-admin/payments`
  * *Description:* Retrieves all payments list with pagination.
  * *Authentication:* Bearer Token
  * *Authorization:* Super Admin
  * *Response (200):*
    ```json
    {
      "success": true,
      "statusCode": 200,
      "message": {
        "payments": [],
        "pagination": {
          "currentPage": 1,
          "totalPages": 1,
          "totalPayments": 0,
          "limit": 10
        }
      },
      "data": "Payments fetched successfully."
    }
    ```
* **GET** `http://localhost:5000/api/super-admin/payments/stats`
  * *Description:* Retrieves payment statistics (counts and amounts for total, paid, pending, failed).
  * *Authentication:* Bearer Token
  * *Authorization:* Super Admin
  * *Response (200):*
    ```json
    {
      "success": true,
      "statusCode": 200,
      "message": {
        "totalPayments": 0,
        "totalAmount": 0,
        "paid": {
          "count": 0,
          "amount": 0
        },
        "pending": {
          "count": 0,
          "amount": 0
        },
        "failed": {
          "count": 0,
          "amount": 0
        }
      },
      "data": "Payment statistics fetched successfully."
    }
    ```
* **GET** `http://localhost:5000/api/super-admin/payments/failed`
  * *Description:* Retrieves all failed payments list with count and total amount.
  * *Authentication:* Bearer Token
  * *Authorization:* Super Admin
  * *Response (200):*
    ```json
    {
      "success": true,
      "statusCode": 200,
      "message": {
        "count": 0,
        "totalAmount": 0,
        "payments": []
      },
      "data": "Failed payments fetched successfully."
    }
    ```
* **GET** `http://localhost:5000/api/payments/details/:id`
  * *Description:* Retrieves specific transaction details, payment logs, and invoice details.
* **POST** `http://localhost:5000/api/payments/process-refund/:id`
  * *Description:* Initiates a refund for the transaction.
