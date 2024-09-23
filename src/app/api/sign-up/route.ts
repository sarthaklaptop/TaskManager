import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/dbConnect';
import { UserModel } from '@/model/User';

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { email, password } = await request.json();

    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return Response.json(
        {
          success: false,
          message: "User already exists"
        },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({
        email,
        password: hashedPassword,
        tasks: [],
    });

    await newUser.save();


    return Response.json(
      {
        success: true,
        message: 'User registered successfully.',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error registering user:', error);
    return Response.json(
      {
        success: false,
        message: 'Error registering user',
      },
      { status: 500 }
    );
  }
}