const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const tokenSecret = "THIS SHOULD NOT BE IN PRODUCTION";
const saltRounds = 10;

function isAlreadyLoggedIn(token) {
    if (token) {
        const user = validateAccessToken(token);
        if (user) return true;
    } else return false;
}

function generateAccessToken(data) {
    return new Promise((resolve, reject) => {
        const token = jwt.sign(data, tokenSecret);
        resolve(token);
    });
}

function validateAccessToken(token) {
    return jwt.verify(token, tokenSecret, (err, user) => {
        if (err) return null;
        return user;
    });
}

function generateEncryptedPassword(password) {
    return new Promise((resolve, reject) => {
        return bcrypt.hash(password, saltRounds, function (err, hash) {
            if (err) return reject(null);
            else return resolve(hash);
        });
    });
}

function validatePasswordFromHash(textPassword, hashedPassword) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(textPassword, hashedPassword, function (err, result) {
            if (err) reject(null);
            else resolve(result);
        });
    });
}

module.exports = {
    generateAccessToken,
    generateEncryptedPassword,
    validatePasswordFromHash,
    isAlreadyLoggedIn,
    validateAccessToken,
};
