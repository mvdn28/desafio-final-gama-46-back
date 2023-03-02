import mongoose from "mongoose";
import config  from "./config";

const connect = async() => {
    try {
        const dbUri = config.uri as string;
        mongoose.set('strictQuery',false);
        await mongoose.connect(dbUri, { retryWrites: true, w: 'majority' , dbName:config.nameDb});
        console.log("Database Connected");
    } catch (error) {
        console.log('db error', error)
        process.exit(1)
    }
}

export default connect