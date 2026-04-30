import nodemailer from "nodemailer";
import * as dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function test() {
  console.log("Testing SMTP connection with:");
  console.log("Host:", process.env.SMTP_HOST);
  console.log("Port:", process.env.SMTP_PORT || "587");
  console.log("Secure:", process.env.SMTP_SECURE);
  console.log("User:", process.env.SMTP_USER);
  
  try {
    await transporter.verify();
    console.log("Success! SMTP connection is verified.");
  } catch (error: any) {
    console.error("Verification failed:", error.message);
    if (error.response) console.error("Response:", error.response);
  }
}

test();
