import {Router} from "express"
import { UserController } from "../controller/UserController";
import { CheckAdmin } from "../middlewares/CheckAdmin";
import { CheckAuth } from "../middlewares/CheckAuth";

const router = Router()

router.get("/",[], UserController.findAll);
router.get("/:id",[], UserController.findOne);
router.post("/",[CheckAuth, CheckAdmin],UserController.create);
router.put("/:id",[CheckAuth, CheckAdmin], UserController.update);
router.delete("/:id",[CheckAuth, CheckAdmin], UserController.findAndDelete);


export default router