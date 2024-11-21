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

**Frontend URL**: [https://helpful-druid-f852f8.netlify.app/]

---

## Backend Deployment

The backend is deployed and can be accessed at:

**Backend URL**: [https://trifit-vy10.onrender.com]

---

## API Documentation (Swagger)

You can access the **API documentation** via Swagger at the following endpoint after starting the Server: http://localhost:4500/api-docs/#/


  ## Endpoints
  POST /api/register
  {
  "username": "john_doe",
  "pin": "1234",
  "initialDeposit": 1000
}
Request body: 
{
  "message": "User registered successfully",
  "accountNumber": "BANK-1234567"
}

Responses:
200 OK: User registered successfully
400 Bad Request: Missing fields or invalid data
500 Internal Server Error: Server-side error


POST /api/login
Logs in a user and returns a JWT token for authentication.
Request body:
{
  "username": "john_doe",
  "pin": "1234",
}
Responses:
200 OK: Login successful, returns JWT token
400 Bad Request: Invalid credentials
500 Internal Server Error: Server-side error



POST /api/deposit
Deposits an amount into the user's account after verifying the PIN.
Request body:
{
  "amount": 1000,
  "pin": "1234"
}
Responses:
200 OK: Deposit successful
400 Bad Request: Missing amount or pin
401 Unauthorized: Invalid token or PIN
500 Internal Server Error: Server-side error



POST /api/withdraw
Withdraws an amount from the user's account after verifying the PIN and JWT token.
Request body:
{
  "amount": 500,
  "pin": "1234"
}
Responses:
200 OK: Withdrawal successful
400 Bad Request: Invalid PIN or Insufficient balance
500 Internal Server Error: Server-side error



POST /api/transfer
Transfers money to another user's account after verifying the PIN and JWT token.
Request body:
{
  "recipientAccount": "BANK-1234567",
  "amount": 500,
  "pin": "1234"
}
Responses:
200 OK: Transfer successful
400 Bad Request: Invalid PIN, Insufficient balance, or Recipient not found
500 Internal Server Error: Server-side error



GET /api/account-statement
Retrieves the user's account statement.
Responses:
200 OK: Account statement returned
401 Unauthorized: Invalid or expired JWT token
500 Internal Server Error: Server-side error

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

