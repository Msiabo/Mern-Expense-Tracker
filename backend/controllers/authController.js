const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Generate JWT Token
const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
};

// @desc    Register User
// @route   POST /api/auth/register
exports.registerUser = async (req, res) => {
  const { fullName, email, password, profileImageUrl } = req.body;

  console.log('Register request received:', { fullName, email }); // debug

  if (!fullName || !email || !password) {
    console.warn('Missing required fields'); // debug
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  if (password.length < 6) {
    console.warn('Password too short'); // debug
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  try {
    console.log('Checking if user already exists...'); // debug
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.warn('User already exists:', email); // debug
      return res.status(400).json({ message: 'User already exists' });
    }

    console.log('Creating new user...'); // debug
    const user = await User.create({
      fullName,
      email,
      password, // plain password, schema hook will hash
      profileImageUrl,
    });

    if (!user) {
      console.error('User creation returned null'); // debug
      return res.status(500).json({ message: 'Failed to create user' });
    }

    console.log('User created successfully:', user._id); // debug

    // remove password from response
    const { password: _, ...userData } = user.toObject();

    res.status(201).json({
      id: user._id,
      user: userData,
      token: generateToken(user),
      message: 'User registered successfully',
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Registration Error', error: error.message });
  }
};


// @desc    Get User Info
// @route   GET /api/auth/me
exports.getUserInfo = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user info:', error);
        res.status(500).json({ message: 'Error fetching user info', error: error.message });
    }
};

// @desc    Update User Info
// @route   PUT /api/auth/update
exports.updateUserInfo = async (req, res) => {
    const { fullName, email, password, profileImageUrl } = req.body;

    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update fields if provided
        if (fullName) user.fullName = fullName;
        if (email) user.email = email;
        if (profileImageUrl) user.profileImageUrl = profileImageUrl;
        if (password) {
            user.password = await bcrypt.hash(password, 10); // hash new password
        }

        await user.save();

        res.status(200).json({
            message: 'User updated successfully',
            user
        });
    } catch (error) {
        console.error('Error updating user info:', error);
        res.status(500).json({ message: 'Error updating user info', error: error.message });
    }
};

// @desc    Login User
// @route   POST /api/auth/login
exports.loginUser = async (req, res) => {
  console.log("🔑 JWT_SECRET length:", process.env.JWT_SECRET?.length || "undefined");

  const { email, password } = req.body;
  console.log("📩 Incoming login request:", { email, passwordEntered: !!password });

  if (!email || !password) {
    console.warn("⚠️ Missing credentials");
    return res.status(400).json({ message: "Please provide email and password" });
  }

  try {
    // Check user
    const user = await User.findOne({ email });
    if (!user) {
      console.warn(`❌ User not found for email: ${email}`);
      return res.status(401).json({ message: "Invalid email or password" });
    }
    console.log("👤 User found:", { id: user._id, email: user.email });

    // Compare passwords
    console.log("🔒 Stored password hash:", user.password);
    const isMatch = await user.comparePassword(password);
    console.log("✅ Password comparison result:", isMatch);

    if (!isMatch) {
      console.warn(`❌ Password mismatch for user: ${email}`);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Exclude password
    const { password: _, ...userData } = user.toObject();

    // Generate token
    const token = generateToken(user);
    console.log("🎫 Token generated successfully for:", email);

    res.status(200).json({
      id: user._id,
      user: userData,
      token,
      message: "Login successful",
    });
  } catch (error) {
    console.error("🔥 Error logging in user:", error);
    res.status(500).json({ message: "Login Error", error: error.message });
  }
};
