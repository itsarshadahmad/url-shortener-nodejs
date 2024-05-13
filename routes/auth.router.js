const express = require("express");
const {
    renderLoginPage,
    renderSignupPage,
    handleUserLogin,
    handleUserSignup,
    handleUserLogout,
} = require("../controllers/auth.controller");

const router = express.Router();

router.get("/login", renderLoginPage);
router.post("/login", handleUserLogin);

router.get("/signup", renderSignupPage);
router.post("/signup", handleUserSignup);

router.post("/logout", handleUserLogout);

module.exports = router;
