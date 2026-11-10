require("dotenv").config();

module.exports = {
  secret: process.env.JWT_SECRET || "abcTTT6543uzzzyyyuccccr434cvewqjhgder",
  expiresIn: 60000000
};
  