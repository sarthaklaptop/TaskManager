import { NextRequest, NextResponse } from 'next/server';
import { UserModel } from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function GET(request: NextRequest) {
    await dbConnect();

    
    try {
        const session = await getServerSession(authOptions);
        
        if (!session || !session.user || !session.user.email) {
            return NextResponse.json(
                { message: 'Login Again, User not found in session' },
                { status: 401 }
            );
        }
        
        const userEmail = session?.user?.email;
        
        if (!userEmail) {
            return NextResponse.json(
                { message: 'Login Again, User not found in session' },
                { status: 401 }
            );
        }

        const user = await UserModel.findOne({ email: userEmail }).populate('tasks');

        if (!user) {
            return NextResponse.json(
                { message: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { tasks: user.tasks },
            { status: 200 }
        );

    } catch (error) {
        console.error('Error fetching all tasks:', error);
        return NextResponse.json(
            { message: 'Internal server error in fetching tasks', success: false },
            { status: 500 }
        );
    }
}
