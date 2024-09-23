import { NextRequest, NextResponse } from 'next/server';
import { TaskModel, UserModel } from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import chalk from 'chalk';


export async function PATCH(request: NextRequest, { params }: { params: { taskId: string } }) {
    await dbConnect();

    // const { taskId } = params;
    const taskId = request.nextUrl.pathname.split("/").pop();
    const { newStatus } = await request.json();

    console.log("Received taskId:", taskId);
    console.log("Received newStatus:", newStatus);

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
                { message: 'User not found' },
                { status: 401 }
            );
        }

        // const taskId = request.nextUrl.pathname.split("/").pop();

        // const { newStatus } = await request.json();

        // if (!taskId || !newStatus) {
        //     return NextResponse.json(
        //         { message: 'Task ID or new status not provided' },
        //         { status: 400 }
        //     );
        // }

        const user = await UserModel.findOne({ email: userEmail });

        if (!user) {
            return NextResponse.json(
                { message: 'User not found' },
                { status: 404 }
            );
        }

        console.log(chalk.green(taskId));
        const task = await TaskModel.findById(taskId);

        if (!task) {
            return NextResponse.json(
                { message: 'Task not found' },
                { status: 404 }
            );
        }

        // task.status = newStatus;

        const updatedTask = await TaskModel.findByIdAndUpdate(taskId, { status: newStatus }, { new: true });


        await user.save();

        return NextResponse.json(
            { message: 'Task status updated successfully', updatedTask },
            { status: 200 }
        );

    } catch (error) {
        console.error('Error updating task:', error);
        return NextResponse.json(
            { message: 'Internal server error || Coundnt update the state' },
            { status: 500 }
        );       
    }
}