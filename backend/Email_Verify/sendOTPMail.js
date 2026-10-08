import nodemailer from "nodemailer";
import "dotenv/config";

export const sendOTPEmail = async (
  otp,
  email,
  purpose = "registration"
) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",

    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const isRegistration = purpose === "registration";

  const subject = isRegistration
    ? "ManojMart - Verify Your Email"
    : "ManojMart - Password Reset OTP";

  const title = isRegistration
    ? "Verify Your ManojMart Account"
    : "Reset Your ManojMart Password";

  const message = isRegistration
    ? "Use the OTP below to verify your email address and activate your ManojMart account."
    : "Use the OTP below to reset your ManojMart password.";

  const mailConfiguration = {
    from: process.env.MAIL_USER,
    to: email,
    subject,

    html: `
      <div style="
        font-family: Arial, sans-serif;
        max-width: 500px;
        margin: auto;
        padding: 30px;
        border: 1px solid #e5e7eb;
        border-radius: 15px;
      ">

        <h2 style="color:#2563eb;">
          ManojMart
        </h2>

        <h3>
          ${title}
        </h3>

        <p>
          ${message}
        </p>

        <div style="
          background:#eff6ff;
          padding:20px;
          text-align:center;
          border-radius:10px;
          margin:20px 0;
        ">

          <div style="
            font-size:32px;
            font-weight:bold;
            letter-spacing:8px;
            color:#2563eb;
          ">
            ${otp}
          </div>

        </div>

        <p>
          This OTP is valid for <strong>10 minutes</strong>.
        </p>

        <p style="color:#6b7280;font-size:13px;">
          If you did not request this OTP, you can safely ignore this email.
        </p>

        <hr />

        <p style="color:#6b7280;font-size:12px;">
          © ManojMart
        </p>

      </div>
    `,
  };

  await transporter.sendMail(mailConfiguration);
};