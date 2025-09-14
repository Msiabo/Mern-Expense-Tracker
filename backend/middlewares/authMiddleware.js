// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware to protect routes
const protect = async (req, res, next) => {
    let token;
    console.log("Protect middleware invoked");

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
        console.log("Token received in header:", token);

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log("Token decoded:", decoded);

            req.user = await User.findById(decoded.id).select("-password");
            console.log("User found:", req.user);

            return next();
        } catch (error) {
            console.error("JWT verification failed:", error.message);
            return res.status(401).json({ message: "Not authorized, token failed", error: error.message });
        }
    }

    if (!token) {
        console.warn("No token provided in request");
        return res.status(401).json({ message: "Not authorized, no token" });
    }
};

module.exports = { protect };
