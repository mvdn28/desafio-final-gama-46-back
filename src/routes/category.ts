import {Router} from "express"
import { CategoryController } from "../controller/CategoryController";
import { CheckAdmin } from "../middlewares/CheckAdmin";
import { CheckAuth } from "../middlewares/CheckAuth";

const router = Router()

router.get("/",[], CategoryController.findAll);
router.get("/:id",[], CategoryController.findOne);
router.post("/",[CheckAuth, CheckAdmin],CategoryController.create);
router.put("/:id",[CheckAuth, CheckAdmin], CategoryController.update);
router.delete("/:id",[CheckAuth, CheckAdmin], CategoryController.findAndDelete);


export default router