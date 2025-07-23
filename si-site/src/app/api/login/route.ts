import User from '@/models/userModel';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
        }

        const tokenData = {
            id: user.id,
            email: user.email,
            name: user.name
        };
        const token = jwt.sign(tokenData, process.env.JWT_SECRET!, { expiresIn: '1d' });

        const response = NextResponse.json({
            message: 'Logged in successfully!',
            success: true
        }, { status: 200 });

        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NEXT_ENV === 'production',
        });
        
        return response;
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
};