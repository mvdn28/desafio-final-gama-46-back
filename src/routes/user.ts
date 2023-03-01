import {Router} from "express"
import { UserController } from "../controller/UserController";
import { CheckAuth } from "../middlewares/CheckAuth";

const router = Router()

router.get("/",[], UserController.findAll);
router.get("/:id",[], UserController.findOne);
router.post("/",[CheckAuth],UserController.create);
router.put("/",[CheckAuth], UserController.update);
router.delete("/",[CheckAuth], UserController.findAndDelete);


export default router