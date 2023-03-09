import {Router} from "express"
import { UserController } from "../controller/UserController";
import { CheckAdmin } from "../middlewares/CheckAdmin";
import { CheckAuth } from "../middlewares/CheckAuth";
import { CheckUserAdmin } from "../middlewares/CheckUserAdmin";

const router = Router()

router.get("/",[], UserController.findAll);
router.get("/:id",[], UserController.findOne);
router.post("/",[CheckUserAdmin],UserController.create);
router.put("/:id",[CheckUserAdmin], UserController.update);
router.delete("/:id",[CheckAuth], UserController.findAndDelete);


export default router