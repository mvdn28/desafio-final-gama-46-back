import dotenv from 'dotenv';

dotenv.config()

export default {
    jwtSecret: process.env.JWT as string
}