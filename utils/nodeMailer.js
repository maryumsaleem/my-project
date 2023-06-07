const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "maryumsaleem51@gmail.com", // generated gmail user
    pass: 'tlzibjbsehhtgpsn', // generated gmail password
  },
});
module.exports = { transporter };
