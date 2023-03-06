import {Router} from "express"
import { OrderController } from "../controller/OrderController";
import { CheckAdmin } from "../middlewares/CheckAdmin";
import { CheckAuth } from "../middlewares/CheckAuth";

const router = Router()

router.get("/",[], OrderController.findAll);
router.get("/:id",[], OrderController.findOne);
router.post("/",[CheckAuth],OrderController.create);
router.put("/:id",[CheckAuth], OrderController.update);
router.delete("/:id",[CheckAuth], OrderController.findAndDelete);


export default router