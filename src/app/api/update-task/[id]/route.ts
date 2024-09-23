import { NextRequest, NextResponse } from 'next/server';
import { TaskModel, UserModel } from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function PATCH(request: NextRequest) { 
    await dbConnect();

    const { title, description, status, priority, DueDate } = await request.json();

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

        // const url = new URL(request.url);
        const taskId = request.nextUrl.pathname.split("/").pop();

        if (!taskId) {
            return NextResponse.json(
                { message: 'Task ID is required' },
                { status: 400 }
            );
        }

        const updatedTask = await TaskModel.findByIdAndUpdate(
            taskId,
            { title, description, status, priority, DueDate },
            { new: true }
        );

        if (!updatedTask) {
            return NextResponse.json(
                { message: 'Task not found' },
                { status: 404 }
            );
        }
        

        return NextResponse.json(
            { message: 'Task Updated successfully', task: updatedTask},
            { status: 200 }
        );


    } catch (error) {
        console.error('Internal Server Error || Cant Update Task', error);
        return NextResponse.json(
            { message: 'Internal server error in fetching tasks', success: false },
            { status: 500 }
        );
    }
}