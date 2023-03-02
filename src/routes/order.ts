import {Router} from "express"
import { OrderController } from "../controller/OrderController";
import { CheckAdmin } from "../middlewares/CheckAdmin";
import { CheckAuth } from "../middlewares/CheckAuth";

const router = Router()

router.get("/",[], OrderController.findAll);
router.get("/:id",[], OrderController.findOne);
router.post("/",[CheckAuth, CheckAdmin],OrderController.create);
router.put("/:id",[CheckAuth, CheckAdmin], OrderController.update);
router.delete("/:id",[CheckAuth, CheckAdmin], OrderController.findAndDelete);


export default router