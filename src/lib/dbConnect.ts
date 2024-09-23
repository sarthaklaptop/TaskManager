import mongoose from "mongoose";
import chalk from "chalk";


type ConnectionObject = {
    isConnected?: number;
}

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
    if(connection.isConnected) {
        console.log(chalk.bgGreenBright("Already connected to Database"));
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || '', {});
        
        connection.isConnected = db.connections[0].readyState;

        console.log(chalk.bgGreen("DB Connected Successfully"));
        
    } catch (error) {
        console.log(chalk.bgRed("Database connection failed"), error);
        process.exit();
    }


}

export default dbConnect;