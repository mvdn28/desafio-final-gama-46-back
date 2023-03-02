import mongoose from "mongoose";
import config  from "./config";

const connect = async() => {
    try {
        const dbUri = config.uri as string;
        const dbName = config.environment != "test"
            ? config.nameDb
            : config.nameDbtest
        mongoose.set('strictQuery',false);
        await mongoose.connect(dbUri, { 
            retryWrites: true, 
            w: 'majority' , 
            dbName
        });
        console.log(`Database ${dbName} Connected`);
    } catch (error) {
        console.log('db error', error)
        process.exit(1)
    }
}

export default connect