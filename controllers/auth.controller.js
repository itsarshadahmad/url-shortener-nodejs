const User = require("../models/user.model");
const {
    isAlreadyLoggedIn,
    validatePasswordFromHash,
    generateAccessToken,
    generateEncryptedPassword,
} = require("../services/auth.service");

function renderLoginPage(req, res) {
    const { token } = req.cookies;
    if (isAlreadyLoggedIn(token)) return res.redirect("/");
    return res.render("login", { isLoggedIn: false });
}

function renderSignupPage(req, res) {
    const { token } = req.cookies;
    if (isAlreadyLoggedIn(token)) return res.redirect("/");
    return res.render("signup", { isLoggedIn: false });
}

async function handleUserLogin(req, res) {
    const { email, password } = req.body;

    if (email && password) {
        try {
            const user = await User.findOne({ email });
            if (user) {
                const isCorrectPassword = await validatePasswordFromHash(
                    password,
                    user.password
                );

                if (isCorrectPassword) {
                    const token = await generateAccessToken({
                        id: user.id,
                        email: user.email,
                    });
                    return await res.cookie("token", token).redirect("/");
                } else {
                    return res.redirect("/login");
                }
            } else {
                return res.redirect("/signup");
            }
        } catch (err) {
            console.log(err);
        }
    }
    return res.redirect("/login");
}

async function handleUserSignup(req, res) {
    const { username, email, password } = req.body;
    if (username && email && password) {
        try {
            const hashedPassword = await generateEncryptedPassword(password);
            const user = await User.create({
                username,
                email,
                password: hashedPassword,
            });

            const token = await generateAccessToken({
                id: user.id,
                email: user.email,
            });
            return res.cookie("token", token).redirect("/");
        } catch (error) {
            console.log(error.message);
        }
    }
    return res.redirect("/signup");
}

function handleUserLogout(req, res) {
    res.clearCookie("token").redirect("/login");
}

module.exports = {
    renderLoginPage,
    renderSignupPage,
    handleUserLogin,
    handleUserSignup,
    handleUserLogout,
};
