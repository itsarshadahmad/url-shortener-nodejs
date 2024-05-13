const express = require("express");
const {
    renderHomePage,
    redirectShortUrl,
    handleAddNewUrl,
    handleUrlDeleteRequest,
} = require("../controllers/url.controller");

const router = express.Router();

router.get("/", renderHomePage);
router.post("/add", handleAddNewUrl);
router.get("/:shortId", redirectShortUrl);
router.post("/delete/:shortId", handleUrlDeleteRequest);

module.exports = router;
