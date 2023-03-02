import dotenv from 'dotenv';

dotenv.config();

export default  {
    uri:process.env.MONGO_URL as string,
    port: process.env.DBPORT as string,
    host: process.env.DBHOST as string,
    nameDb: process.env.MONGO_DBNAME as string,
}