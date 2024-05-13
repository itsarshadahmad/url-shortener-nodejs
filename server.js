const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");

const auth = require("./routes/auth.router");
const url = require("./routes/url.router");
const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(express.static("views"));
app.use(cookieParser());
app.use(helmet());

mongoose
    .connect("mongodb://localhost:27017/short-url")
    .catch((err) => console.log(err.message));

app.use("/", auth);
app.use("/", url);

app.listen(3000, () => console.log("Server started at http://localhost:3000"));
