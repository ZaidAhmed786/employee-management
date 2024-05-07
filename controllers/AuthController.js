const User = require("../models/UsersSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const util = require("util");

// Move token to environment variable
const loginToken = process.env.LOGIN_TOKEN || "leilani_login";

// Cookie options
const cookieOptions = {
    httpOnly: true,
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
};

exports.signup = async (req, res, next) => {
  try {
    const newUser = await new User(req.body).save();
    const token = jwt.sign({ id: newUser._id, name: newUser.name }, loginToken);
    res.cookie('jwt_review', token, cookieOptions);
    res.status(200).json({
      status: "success",
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    res.status(400).json({ status: "failed", message: err.message });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        status: "failed",
        message: "Please provide both email and password.",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        status: "failed",
        message: "No user found with this email.",
      });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password." });
    }
    const token = jwt.sign({ id: user._id }, loginToken);
    res.cookie('jwt_review', token, cookieOptions);
    res.status(200).json({ status: "success" });
  } catch (err) {
    res.status(400).json({ status: "failed", message: err.message });
  }
};

exports.protect = async (req, res, next) => {
  try {
    let token = req.headers["authorization"];
    if (!token || !token.startsWith("Bearer")) {
      return res.status(403).json({
        status: "failed",
        message: "You are not authorized. Please log in first.",
      });
    }
    token = token.split(" ")[1];
    const decoded = await util.promisify(jwt.verify)(token, loginToken);
    const freshUser = await User.findById(decoded.id);
    if (!freshUser) {
      return res.status(401).json({
        status: "failed",
        message: "Your session has expired. Please log in again.",
      });
    }
    req.user = freshUser;
    next();
  } catch (err) {
    res.status(400).json({ status: "failed", message: err.message });
  }
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(401).json({
        status: "failed",
        message: "You are not authorized to perform this action.",
      });
    }
    next();
  };
};
