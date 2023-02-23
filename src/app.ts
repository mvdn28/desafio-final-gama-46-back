import express from "express";
import cors from "cors";
import routes from "./routes";
import helmet from "helmet";
import dotenv from "dotenv";

dotenv.config();
const app = express();

//call midllewares
app.use(express.json());
app.use(cors());
app.use(helmet());

app.use("/",routes)


export default app