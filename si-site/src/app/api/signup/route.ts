import { connectDB } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { sendEmail } from "@/utils/mailer";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function POST(req: NextRequest) {
    try {
        const { name, email, password, role="freelancer" } = await req.json();
        if (!name || !email || !password) {
            return NextResponse.json({ status: "error", message: "All fields are required" }, { status: 400 });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return NextResponse.json({ status: "error", message: "User already exists" }, { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role
        });
        const savedUser = await newUser.save();

        await sendEmail(email as string, "VERIFY", savedUser._id as mongoose.Schema.Types.ObjectId);

        return NextResponse.json({
            status: "success",
            message: "User created successfully!",
            user: {
                id: savedUser.id,
                name: savedUser.name,
                email: savedUser.email
            }
        }, { status: 201 });
    } catch (error) {
        console.error("Error during sign up:", error);
        return NextResponse.json({
            status: "error",
            message: "Sign up failed"
        }, { status: 500 });
    }
};