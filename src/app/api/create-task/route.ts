import { UserModel, TaskModel } from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { TaskStatus, PriorityStatus } from "@/model/User";
import { timeStamp } from "console";

export async function POST(request: Request) {
    await dbConnect();

    // Parse request body
    const { title, description, status, priority, DueDate } = await request.json();

    try {
        // Get session from request
        const session = await getServerSession(authOptions);

        const userEmail = session?.user?.email;

        if (!userEmail) {
            return new Response(JSON.stringify({ message: 'Login Again, User not found in session' }), {
                status: 401,
            });
        }

        // Find user by email
        const user = await UserModel.findOne({ email: userEmail });

        if (!user) {
            return new Response(JSON.stringify({ message: 'User not found' }), {
                status: 404,
            });
        }

        // Create new task
        const newTask = new TaskModel({
            title,
            description,
            status: status || TaskStatus.ToDo,
            priority: priority || PriorityStatus.Medium,
            DueDate: DueDate ? new Date(DueDate) : undefined,
        });

        // Save the task to the database
        const savedTask = await newTask.save();

        // Push the task's ID to the user's tasks array
        user.tasks.push(savedTask._id);

        // Save the updated user document
        await user.save();

        return new Response(JSON.stringify({ message: 'Task created successfully', task: savedTask }), {
            status: 201,
        });

    } catch (error) {
        console.error('Error creating task:', error);
        return new Response(JSON.stringify({ message: 'Internal server error' }), {
            status: 500,
        });
    }
}
