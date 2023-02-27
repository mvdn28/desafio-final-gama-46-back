import {Router} from "express"
import { OrderController } from "../controller/OrderController";

const router = Router()

router.get("/",[], OrderController.findAll);
router.get("/:id",[], OrderController.findOne);
router.post("/",[],OrderController.create);
router.put("/:id",[], OrderController.update);
router.delete("/:id",[], OrderController.findAndDelete);


export default router