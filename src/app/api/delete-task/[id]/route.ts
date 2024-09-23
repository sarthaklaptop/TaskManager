import { NextRequest, NextResponse } from 'next/server';
import { TaskModel, UserModel } from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function DELETE(request: NextRequest) { 
    await dbConnect();

    try {
        const session = await getServerSession(authOptions);
        console.log("Session: ", session);
        
        if (!session || !session.user || !session.user.email) {
            // Handle case where session or user email is not found
            return NextResponse.json(
                { message: 'Login Again, User not found in session' },
                { status: 401 }
            );
        }

        const url = new URL(request.url);
        const taskId = url.pathname.split('/').pop();

        if (!taskId) {
        return NextResponse.json(
            { message: 'Task ID is required' },
            { status: 400 }
        );
        }

        // Delete the task from the database
        await TaskModel.findByIdAndDelete(taskId);

        return NextResponse.json(
            { message: 'Task deleted successfully' },
            { status: 200 }
        );


    } catch (error) {
        console.error('Cant Delete Task', error);
        return NextResponse.json(
            { message: 'Internal server error in fetching tasks', success: false },
            { status: 500 }
        );
    }
}