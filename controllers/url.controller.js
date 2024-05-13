const crypto = require("crypto");
const {
    isAlreadyLoggedIn,
    validateAccessToken,
} = require("../services/auth.service");
const URL = require("../models/url.model");

async function renderHomePage(req, res) {
    const { token } = req.cookies;
    if (isAlreadyLoggedIn(token)) {
        const user = validateAccessToken(token);
        const generateUrls = await URL.where({ createdBy: user.id })
            .find()
            .catch((err) => console.log(err));

        return res.render("home", { isLoggedIn: true, urls: generateUrls });
    } else return res.redirect("/login");
}

async function redirectShortUrl(req, res) {
    const shortId = req.path.slice(1);
    const url = await URL.where({ shortId })
        .findOneAndUpdate({
            $push: {
                visitHistory: {
                    timestamp: Date.now(),
                },
            },
        })
        .catch((err) => console.log(err.message));
    const redirectUrl = url.redirectUrl;
    if (redirectUrl.includes("https://")) {
        return res.redirect(redirectUrl);
    } else {
        return res.redirect("https://" + redirectUrl);
    }
}

async function handleAddNewUrl(req, res) {
    const { url } = req.body;
    const { token } = req.cookies;
    const shortId = crypto.randomUUID().slice(0, 8);

    const user = validateAccessToken(token);
    await URL.create({
        redirectUrl: url,
        shortId,
        createdBy: user.id,
    }).catch((err) => console.log(err.message));
    return res.redirect("/");
}

async function handleUrlDeleteRequest(req, res) {
    const { token } = req.cookies;
    if (token) {
        const user = validateAccessToken(token);
        const shortId = req.path.split("/")[2];
        await URL.deleteOne({ shortId, createdBy: user.id }).catch((err) =>
            console.log(err.message)
        );
        return res.redirect("/");
    }
    return res.redirect("/login");
}

module.exports = {
    renderHomePage,
    redirectShortUrl,
    handleAddNewUrl,
    handleUrlDeleteRequest,
};
