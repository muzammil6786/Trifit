const apiUrl = "https://trifit-s8k8.onrender.com"; // Your API URL

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

    console.log("Login response:", data); // Log response to confirm

    if (response.ok) {
      // Handle successful login
      showMessage("Login successful!");

      // Store user details in localStorage
      localStorage.setItem("jwtToken", data.token);
      localStorage.setItem("username", data.username);
      localStorage.setItem("accountNumber", data.accountNumber);
      localStorage.setItem("balance", data.balance);

      // Log the stored token
      console.log("Stored JWT Token:", localStorage.getItem("jwtToken"));

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




function refreshPage(delay = 2000) {
  // Delay the refresh to allow messages or modals to display
  setTimeout(() => {
    location.reload();
  }, delay);
}


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
      refreshPage();
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
        refreshPage();
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
       refreshPage();
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
const viewStatement = async () => {
  const token = localStorage.getItem("jwtToken");
  const statementContainer = document.getElementById("statement-container");

  if (!token) {
    alert("Please log in to view the account statement.");
    return;
  }

  try {
    const response = await fetch(`${apiUrl}/api/accountstatement`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch account statement.");
    }

    const data = await response.json();
    const transactions = data.transactions;
    const statementBody = document.getElementById("statement-body");
    statementBody.innerHTML = "";

    // Check if transactions exist, and display accordingly
    if (transactions.length > 0) {
      // Reverse the transactions array to show the latest transactions at the top
      transactions.reverse();

      transactions.forEach((transaction) => {
        const row = document.createElement("tr");

        // Format the timestamp
        const formattedDateTime = transaction.timestamp || "Invalid Date";

        // Amount (full amount before fee)
        const amount =
          typeof transaction.amount === "number" && !isNaN(transaction.amount)
            ? `₹${transaction.amount.toFixed(2)}`
            : "₹0.00"; // Default to "₹0.00" if amount is invalid or undefined

        const type = transaction.type || "Unknown"; // Fallback to "Unknown" if type is missing

        row.innerHTML = `
          <td>${formattedDateTime}</td>
          <td>${amount}</td> <!-- Only show the amount -->
          <td>${type}</td>
        `;

        statementBody.appendChild(row);
      });
    } else {
      // If no transactions, display a message for the user
      const emptyRow = document.createElement("tr");
      emptyRow.innerHTML = `<td colspan="3" style="text-align: center;">You have no transactions yet.</td>`;
      statementBody.appendChild(emptyRow);
    }

    // Toggle the visibility of the statement container
    statementContainer.style.display =
      statementContainer.style.display === "none" ? "block" : "none";
  } catch (error) {
    console.error("Error fetching account statement:", error);
  }
};





const updateBalanceInUI = (balance) => {
  document.getElementById(
    "user-balance"
  ).innerText = `Balance: $${balance.toFixed(2)}`;
};

/////////////
        // Function to fetch balance from the API
         const fetchBalance = async () => {
           const token = localStorage.getItem("jwtToken");
          //  console.log("Token:", token); // Check if the token is null, undefined, or incorrect

           if (!token) {
             console.error("Token is missing");
             return;
           }

           try {
             const response = await fetch(`${apiUrl}/api/balance`, {
               method: "GET",
               headers: {
                 Authorization: `Bearer ${token}`, // Send the token in the request
               },
             });

             if (!response.ok) {
               throw new Error("Failed to fetch balance");
             }

             const data = await response.json();
            //  console.log("Balance Response:", data); // Check the response data

             const balance = data.balance;
             updateBalanceInUI(balance);
           } catch (error) {
             console.error("Error fetching balance:", error);
           }
         };
         window.onload = function () {
           console.log("Page is loaded, calling fetchBalance");
           fetchBalance();
         };
