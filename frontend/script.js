const apiUrl = "http://localhost:4500"; // Your API URL

// Function to show messages (success/error)
const showMessage = (message, isError = false) => {
  const messageElement = document.getElementById("message");
  messageElement.textContent = message;
  messageElement.classList.toggle("success", !isError);
  messageElement.classList.toggle("error", isError);
  messageElement.style.display = "block";
};

// Register a new user
const register = async () => {
  const username = document.getElementById("reg-username").value;
  const pin = document.getElementById("reg-pin").value;
  const initialDeposit = document.getElementById("reg-deposit").value || 0;

  // Input Validation
  if (!username || !pin) {
    showMessage("Username and PIN are required.", true);
    return;
  }

  try {
    const response = await fetch(`${apiUrl}/api/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, pin, initialDeposit }),
    });

    const data = await response.json();

    if (response.ok) {
      showMessage("Registration successful! Please log in.");
      document.getElementById("registration-form").style.display = "none"; // Hide registration form
      document.getElementById("login-form").style.display = "block"; // Show login form
    } else {
      showMessage(
        data.message || "An error occurred during registration.",
        true
      );
    }
  } catch (error) {
    console.error("Registration error:", error);
    showMessage("An error occurred during registration.", true);
  }
};

// Login a user
const login = async () => {
  const username = document.getElementById("login-username").value;
  const pin = document.getElementById("login-pin").value;

  // Check if both fields are filled
  if (!username || !pin) {
    showMessage("Please provide both username and PIN.", true);
    return;
  }

  try {
    const response = await fetch(`${apiUrl}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, pin }),
    });

    const data = await response.json();

    if (response.ok) {
      // Handle successful login
      showMessage("Login successful!");

      // Store user details in localStorage
      localStorage.setItem("jwtToken", data.token);
      localStorage.setItem("username", data.username);
      localStorage.setItem("accountNumber", data.accountNumber);
      localStorage.setItem("balance", data.balance);

      // Update UI with user details
      updateUserInfo(data.username, data.accountNumber, data.balance);

      // Hide the login form and show account actions
      document.getElementById("login-form").style.display = "none"; // Hide login form
      document.getElementById("registration-form").style.display = "none"; // Hide registration form
      document.getElementById("account-actions").style.display = "block"; // Show account actions
      document.getElementById("back-button").style.display = "block";
    } else {
      showMessage(data.message || "An error occurred during login.", true);
    }
  } catch (error) {
    console.error("Error during login:", error);
    showMessage("An error occurred during login.", true);
  }
};

// Update user info on the page after login
const updateUserInfo = (username, accountNumber, balance) => {
  // Display user info in the UI
  document.getElementById("user-name").innerText = ` ${username}`;
  document.getElementById(
    "user-account"
  ).innerText = `Account Number: ${accountNumber}`;
  document.getElementById("user-balance").innerText = `Balance: $${balance}`;
};

// Deposit money
const deposit = async () => {
  const amount = parseFloat(document.getElementById("deposit-amount").value);
  const pin = document.getElementById("deposit-pin").value;

  // Validate amount
  if (isNaN(amount) || amount <= 0) {
    showMessage("Please enter a valid deposit amount.", true);
    return;
  }

  try {
    const response = await fetch(`${apiUrl}/api/deposit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
      },
      body: JSON.stringify({ amount, pin }),
    });

    const data = await response.json();

    if (response.ok) {
      showMessage(data.message);
      updateBalance(data.balanceAfterTransaction);
    } else {
      showMessage(data.message || "An error occurred during deposit.", true);
    }
  } catch (error) {
    console.error("Deposit error:", error);
    showMessage("An error occurred during deposit.", true);
  }
};

// Withdraw money
const withdraw = async () => {
  const amount = parseFloat(document.getElementById("withdraw-amount").value);
  const pin = document.getElementById("withdraw-pin").value;

  if (isNaN(amount) || amount <= 0) {
    showMessage("Please enter a valid withdrawal amount.", true);
    return;
  }

  try {
    const response = await fetch(`${apiUrl}/api/withdraw`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
      },
      body: JSON.stringify({ amount, pin }),
    });

    const data = await response.json();

    if (response.ok) {
      showMessage(data.message);
      updateBalance(data.balanceAfterTransaction);
    } else {
      showMessage(data.message || "An error occurred during withdrawal.", true);
    }
  } catch (error) {
    console.error("Withdrawal error:", error);
    showMessage("An error occurred during withdrawal.", true);
  }
};

// Transfer money
const transfer = async () => {
  const recipientAccount = document.getElementById("recipient-account").value;
  const amount = parseFloat(document.getElementById("transfer-amount").value);
  const pin = document.getElementById("transfer-pin").value;

  if (isNaN(amount) || amount <= 0 || !recipientAccount) {
    showMessage("Please enter a valid amount and recipient account.", true);
    return;
  }

  try {
    const response = await fetch(`${apiUrl}/api/transfer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
      },
      body: JSON.stringify({ recipientAccount, amount, pin }),
    });

    const data = await response.json();

    if (response.ok) {
      showMessage(data.message);
      updateBalance(data.balanceAfterTransaction);
    } else {
      showMessage(data.message || "An error occurred during transfer.", true);
    }
  } catch (error) {
    console.error("Transfer error:", error);
    showMessage("An error occurred during transfer.", true);
  }
};

// Update balance display after transaction
const updateBalance = (newBalance) => {
  document.getElementById("user-balance").innerText = `Balance: $${newBalance}`;
};

// Logout user
const logout = () => {
  localStorage.removeItem("jwtToken");
  localStorage.removeItem("username");
  localStorage.removeItem("accountNumber");
  localStorage.removeItem("balance");

  document.getElementById("account-actions").style.display = "none"; // Hide account actions
  document.getElementById("login-form").style.display = "block"; // Show login form
  document.getElementById("back-button").style.display = "block";
  
  showMessage("You have logged out successfully.");
};

// Set up the initial UI state
document.addEventListener("DOMContentLoaded", () => {
  // Retrieve data from localStorage to maintain user state after page refresh
  if (localStorage.getItem("jwtToken")) {
    document.getElementById("login-form").style.display = "none";
    document.getElementById("registration-form").style.display = "none";
    document.getElementById("account-actions").style.display = "block"; // Show account actions
    updateUserInfo(
      localStorage.getItem("username"),
      localStorage.getItem("accountNumber"),
      localStorage.getItem("balance")
    );
  } else {
    document.getElementById("login-form").style.display = "block"; // Show login form
  }
});
// Function to navigate back to the previous page
const goBack = () => {
  // Check if there's a history entry (browser back) or return to login page if not
  if (window.history.length > 1) {
    window.history.back();
  } else {
    // If there's no history, navigate to the login page
    document.getElementById("account-actions").style.display = "none";
    document.getElementById("login-form").style.display = "block"; 
    document.getElementById("registration-form").style.display = "block";
  }
};





/////

// Function to fetch and display the account statement
async function viewStatement() {
  const token = localStorage.getItem("jwtToken"); // Get JWT token from localStorage

  if (!token) {
    alert("Please log in to view your account statement.");
    return;
  }

  try {
    // Show loading state
    document.getElementById('statement-container').style.display = 'none'; // Hide statement initially
    document.getElementById('loadingMessage').style.display = 'block'; // Show loading message
    const response = await fetch("/api/account/statement", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Add JWT token to Authorization header
      },
    });

    if (response.ok) {
      const data = await response.json();
      const transactions = data.transactions;

      // Hide loading message and display the statement container
      document.getElementById('loadingMessage').style.display = 'none';
      document.getElementById('statement-container').style.display = 'block';

      const statementBody = document.getElementById('statement-body');
      statementBody.innerHTML = ''; // Clear any existing statement data

      if (transactions.length === 0) {
        const noTransactionsMessage = document.createElement('tr');
        const noTransactionsMessageContent = document.createElement('td');
        noTransactionsMessageContent.colSpan = 4;
        noTransactionsMessageContent.innerText = 'No transactions found.';
        noTransactionsMessage.appendChild(noTransactionsMessageContent);
        statementBody.appendChild(noTransactionsMessage);
      } else {
        // Populate the statement table with transaction data
        transactions.forEach(transaction => {
          const row = document.createElement('tr');
          
          // Create and append Date cell
          const dateCell = document.createElement('td');
          dateCell.textContent = new Date(transaction.timestamp).toLocaleString();
          row.appendChild(dateCell);
          
          // Create and append Amount cell
          const amountCell = document.createElement('td');
          amountCell.textContent = `$${transaction.amount.toFixed(2)}`;
          row.appendChild(amountCell);
          
          // Create and append Type cell
          const typeCell = document.createElement('td');
          typeCell.textContent = transaction.type;
          row.appendChild(typeCell);
          
          // Create and append Description cell
          const descriptionCell = document.createElement('td');
          descriptionCell.textContent = transaction.description || 'N/A';
          row.appendChild(descriptionCell);

          statementBody.appendChild(row);
        });
      }
    } else {
      const errorData = await response.json();
      console.error("Error fetching statement:", errorData.message);
      alert("An error occurred: " + errorData.message);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred while fetching the account statement.");
  }
}

// Example of how to show a loading message when the account statement is being fetched
document.getElementById('view-statement-button').addEventListener('click', function() {
  viewStatement();
});


