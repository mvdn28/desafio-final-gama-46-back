import dotenv from 'dotenv';

dotenv.config();

export default  {
    nameDbtest: process.env.MONGO_DBNAME_TEST as string,
}