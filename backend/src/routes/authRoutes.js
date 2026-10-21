const express = require("express");
const router = express.Router();

const { login } = require("../controllers/authController");
const { register } = require("../controllers/registerController");
const { validateLogin } = require("../validators/authValidator");
const validateRegister = require("../validators/registerValidator");

router.post("/login", validateLogin, login);
router.post("/register", validateRegister, register);

module.exports = router;