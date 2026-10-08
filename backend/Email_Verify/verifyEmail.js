import nodemailer from "nodemailer";
import "dotenv/config";

export const verifyEmail = (token, email) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
    });

    const mailConfiguration = {
        from: process.env.MAIL_USER,
        to: email,
        subject: "Email Verification",
        text: `Please verify your email by clicking the following link:
https://localhost:5173/verify/${token}

Thank you for registering with us!`
    };

    transporter.sendMail(mailConfiguration, (error, info) => {
        if (error) {
            console.log("Error sending email:", error);
        } else {
            console.log("Email sent:", info.response);
        }
    });
};
