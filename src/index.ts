import express from "express";
import cors from "cors";
import routes from "./routes";
import helmet from "helmet";
import dotenv from "dotenv";
import connect from "./database/connect"

dotenv.config();
const app = express();

//call midllewares
app.use(express.json());
app.use(cors());
app.use(helmet());

app.use("/",routes)


app.listen(process.env.PORT || 5000, ()=> {
    console.log(`Server running on port ${process.env.PORT}`)
    connect()
})

export default app