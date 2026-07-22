import dotenv from "dotenv";
dotenv.config();

import { sendEmail } from "./src/utils/sendEmail.js";

(async () => {
  try {
    await sendEmail({
      to: "yrrealty9123@gmail.com",
      subject: "YR Reality Test Email",
      html: `
        <h1>Congratulations 🎉</h1>
        <p>Your SMTP is working successfully.</p>
      `,
    });

    console.log("✅ Email sent successfully");
  } catch (err) {
    console.error(err);
  }
})();