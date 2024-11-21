# Banking System

## Overview
This project is a Banking System API that supports various features including user authentication, account management, transaction handling (deposit, withdrawal, transfer), and more. It is built with **Node.js** and **Express** for the backend, and the frontend is built using **HCJ**.

## Features
- User signup and login
- Deposit money into the user's account
- Withdraw money from the user's account
- Transfer money to another user
- JWT authentication for secure endpoints
- Full documentation via Swagger

## Tech Stack
- **Frontend**: HCJ (html,css,js)
- **Backend**: Node.js, Express, JWT Authentication
- **Database**: MongoDB
- **Swagger**: For API documentation

## Installation

1. Clone the repository to your local machine:

   ```bash
   git clone https://github.com/muzammil6786/Trifit.git
2. Install the dependencies: npm install

3. Run the application: node index.js


## Frontend Deployment

The frontend is deployed and can be accessed at:

**Frontend URL**: [https://preeminent-jelly-db8274.netlify.app/]

---

## Backend Deployment

The backend is deployed and can be accessed at:

**Backend URL**: [https://trifit-oueu.onrender.com"]

---

## API Documentation (Swagger)

You can access the **API documentation** via Swagger at the following endpoint after starting the Server: http://localhost:4500/api-docs/#/


  ## Endpoints

### **1. User Registration**

- **Endpoint**: `POST /api/register`  
- **Request Body**:
  ```json
  {
    "username": "john_doe",
    "pin": "1234",
    "initialDeposit": 1000
  }
Example Response:
{
  "message": "User registered successfully",
  "accountNumber": "BANK-1234567"
}
Responses:
200 OK: User registered successfully.
400 Bad Request: Missing fields or invalid data.
500 Internal Server Error: Server-side error.

### **2. User Login
Endpoint: POST /api/login
Request Body:
{
  "username": "john_doe",
  "pin": "1234"
}
Responses:
200 OK: Login successful, returns JWT token.
400 Bad Request: Invalid credentials.
500 Internal Server Error: Server-side error.

### **3. Deposit Money
Endpoint: POST /api/deposit
Request Body:
{
  "amount": 1000,
  "pin": "1234"
}
Responses:
200 OK: Deposit successful.
400 Bad Request: Missing amount or PIN.
401 Unauthorized: Invalid token or PIN.
500 Internal Server Error: Server-side error.

### **4. Withdraw Money
Endpoint: POST /api/withdraw
Request Body:
{
  "amount": 500,
  "pin": "1234"
}
Responses:
200 OK: Withdrawal successful.
400 Bad Request: Invalid PIN or insufficient balance.
500 Internal Server Error: Server-side error.

### **5. Transfer Money
Endpoint: POST /api/transfer
Request Body:
{
  "recipientAccount": "BANK-1234567",
  "amount": 500,
  "pin": "1234"
}
Responses:
200 OK: Transfer successful.
400 Bad Request: Invalid PIN, insufficient balance, or recipient not found.
500 Internal Server Error: Server-side error.

### **6. Account Statement
Endpoint: GET /api/account-statement
Responses:
200 OK: Account statement returned.
401 Unauthorized: Invalid or expired JWT token.
500 Internal Server Error: Server-side error.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

