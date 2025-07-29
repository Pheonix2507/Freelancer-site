import User from "@/models/userModel";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const sendEmail = async (to: string, emailType: string, userId: mongoose.Schema.Types.ObjectId) => {
    try {
        const tokenData = {
            id: userId
        }

        const token = jwt.sign(tokenData, process.env.JWT_SECRET!, { expiresIn: '1h' });

        if(emailType === "VERIFY") {
            await User.findByIdAndUpdate(userId, {
                verificationToken: token,
                verificationTokenExpiry: Date.now() + 60 * 60 * 1000 // 1 hour
            });
        } else if(emailType === "RESET") {
            await User.findByIdAndUpdate(userId, {
                forgotPasswordToken: token,
                forgotPasswordTokenExpiry: Date.now() + 60 * 60 * 1000 // 1 hour
            });
        }

        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const path = emailType === "VERIFY" ? "verify-email" : "forgot-password";

        const mailOptions = {
            from: process.env.EMAIL_FROM_ADDRESS,
            to: to,
            subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password",
            html: `<p>Click <a href="${process.env.DOMAIN}/${path}?token=${token}">here</a> to ${emailType === "VERIFY" ? "verify your email" : "reset your password"}.</p>`
        };

        const mailresponse = await transport.sendMail(mailOptions);
        return mailresponse;
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Failed to send email!");
    }
};