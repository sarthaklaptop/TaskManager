import { NextRequest, NextResponse } from 'next/server';
import { UserModel } from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function GET(request: NextRequest) {
    await dbConnect();

    try {
        const session = await getServerSession(authOptions);

        if(!session || !session.user || !session.user.email) {
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

        // const filtered_tasks = 
    } catch (error) {
        return NextResponse.json(
            {message: "Cant Get filtered Tasks"},
            {status: 500}
        )
    }

}