const apiUrl = "https://trifit-vy10.onrender.com"; // Your API URL
let token = ""; // For storing the JWT token

const showMessage = (message, isError = false) => {
  const messageDiv = document.getElementById("message");
  messageDiv.textContent = message;
  messageDiv.style.color = isError ? "red" : "green";
};

const register = async () => {
  const username = document.getElementById("reg-username").value;
  const pin = document.getElementById("reg-pin").value;
  const initialDeposit = document.getElementById("reg-deposit").value || 0;

  const response = await fetch(`${apiUrl}/api/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, pin, initialDeposit }),
  });

  const data = await response.json();

  if (response.ok) {
    showMessage("Registration successful! Please log in.");
    document.getElementById("registration-form").style.display = "none";
    document.getElementById("login-form").style.display = "block";
  } else {
    showMessage(data.message, true);
  }
};

const login = async () => {
  const username = document.getElementById("login-username").value;
  const pin = document.getElementById("login-pin").value;

  const response = await fetch(`${apiUrl}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, pin }),
  });

  const data = await response.json();

  if (response.ok) {
    token = data.token;
    document.getElementById("login-form").style.display = "none";
    document.getElementById("account-actions").style.display = "block";
    document.getElementById("user-name").textContent = username;
  } else {
    showMessage(data.message, true);
  }
};

const logout = async () => {
  const response = await fetch(`${apiUrl}/api/logout`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await response.json();

  if (response.ok) {
    showMessage(data.message);
    token = "";
    document.getElementById("login-form").style.display = "block";
    document.getElementById("account-actions").style.display = "none";
  } else {
    showMessage(data.message, true);
  }
};

const deposit = async () => {
  const amount = parseFloat(document.getElementById("deposit-amount").value);
  const pin = document.getElementById("deposit-pin").value;
  const token = localStorage.getItem("jwtToken"); // Or use sessionStorage if you prefer

  try {
    const response = await fetch(`${apiUrl}/api/deposit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ amount, pin }),
    });

    const data = await response.json();

    if (response.ok) {
      showMessage(data.message);
      updateBalance(data.balanceAfterTransaction);
    } else {
      showMessage(data.message, true);
    }
  } catch (error) {
    console.error("Error during deposit:", error);
    showMessage("An error occurred while processing the deposit", true);
  }
};


const withdraw = async () => {
  const amount = parseFloat(document.getElementById("withdraw-amount").value);
  const pin = document.getElementById("withdraw-pin").value;
  const token = localStorage.getItem("jwtToken");

  try {
    const response = await fetch(`${apiUrl}/api/withdraw`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ amount, pin }),
    });

    const data = await response.json();

    if (response.ok) {
      showMessage(data.message);
      updateBalance(data.balanceAfterTransaction);
    } else {
      showMessage(data.message, true);
    }
  } catch (error) {
    console.error("Error during withdrawal:", error);
    showMessage("An error occurred while processing the withdrawal", true);
  }
};


const transfer = async () => {
  const recipientAccount = document.getElementById("recipient-account").value;
  const amount = parseFloat(document.getElementById("transfer-amount").value);
  const pin = document.getElementById("transfer-pin").value;
  const token = localStorage.getItem("jwtToken");

  try {
    const response = await fetch(`${apiUrl}/api/transfer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ recipientAccount, amount, pin }),
    });

    const data = await response.json();

    if (response.ok) {
      showMessage(data.message);
      updateBalance(data.balanceAfterTransaction);
    } else {
      showMessage(data.message, true);
    }
  } catch (error) {
    console.error("Error during transfer:", error);
    showMessage("An error occurred while processing the transfer", true);
  }
};


const viewStatement = async () => {
  const response = await fetch(`${apiUrl}/api/statement`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await response.json();

  if (response.ok) {
    const statementList = document.getElementById("statement-list");
    statementList.innerHTML = "";
    data.transactions.forEach((txn) => {
      const li = document.createElement("li");
      li.textContent = `${txn.type}: ${txn.amount} on ${txn.timestamp}`;
      statementList.appendChild(li);
    });
  } else {
    showMessage(data.message, true);
  }
};
