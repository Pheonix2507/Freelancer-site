import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { name, email, password, role="USER" } = await req.json();
        if (!name || !email || !password) {
            return NextResponse.json({ status: "error", message: "All fields are required" }, { status: 400 });
        }

        const existingUser = await prisma.user.findUnique({
            where: { email: email.toLowerCase() }
        });

        if (existingUser) {
            return NextResponse.json({ status: "error", message: "User already exists" }, { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                name: name.trim(),
                email: email.toLowerCase(),
                password: hashedPassword,
                role
            }
        });

        return NextResponse.json({
            status: "success",
            message: "User created successfully!",
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email
            }
        }, { status: 201 });
    } catch (error) {
        console.error("Error during sign up:", error);
        return NextResponse.json({
            status: "error",
            message: "Sign up failed"
        }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
};