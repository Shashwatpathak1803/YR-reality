import nodemailer from "nodemailer";
import { env } from "../config/env.js";

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: false,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

export const sendEmail = async ({ to, subject, html }) => {

  console.log("SMTP USER:", env.SMTP_USER);
  console.log("Sending email to:", to);

  const info = await transporter.sendMail({
    from: env.EMAIL_FROM,
    to,
    subject,
    html,
  });

  console.log("EMAIL SENT:", info.messageId);
};