import app from "./app";
import connect from "./database/connect";
import dotenv from 'dotenv';

dotenv.config()

const server = app.listen(process.env.PORT || 5000, ()=> {
    console.log(`Server running on port ${process.env.PORT}`)
    connect()
})

export default server