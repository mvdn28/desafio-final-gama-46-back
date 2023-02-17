import dotenv from 'dotenv';

dotenv.config();

export default  {
    uri:process.env.DBURI as string,
    port: process.env.DBPORT as string,
    host: process.env.DBHOST as string
}