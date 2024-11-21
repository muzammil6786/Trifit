const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied, no token provided" });
  }

  // Extract the token from "Bearer <token>"
  const bearerToken = token.split(" ")[1];

  if (!bearerToken) {
    return res.status(401).json({ message: "Invalid token format" });
  }

  try {
    // Verify the token with your secret key (use the secret that was used to sign the token)
    const decoded = jwt.verify(bearerToken, "muz"); 

    // Find the user by ID
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Attach the user to the request object
    req.user = user;
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Invalid or expired token" });
  }
};


module.exports = authMiddleware;

