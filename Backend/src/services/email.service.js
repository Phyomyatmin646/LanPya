const nodemailer = require("nodemailer");
const logger = require("../utils/logger");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendEmail = async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: `"AI Learning Roadmap" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    logger.info(`Email sent to ${to}: ${info.messageId}`);
    return info;
  } catch (error) {
    logger.error(`Email failed to ${to}: ${error.message}`);
    throw error;
  }
};

exports.sendWelcomeEmail = async (user) => {
  return exports.sendEmail({
    to: user.email,
    subject: "Welcome to AI Learning Roadmap!",
    html: `<h1>Hi ${user.full_name}!</h1><p>Welcome to <strong>AI Learning Roadmap</strong>. Start your learning journey today!</p>`,
  });
};

exports.sendPasswordResetEmail = async (user, resetUrl) => {
  return exports.sendEmail({
    to: user.email,
    subject: "Password Reset Request",
    html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. This link expires in 10 minutes.</p>`,
  });
};
