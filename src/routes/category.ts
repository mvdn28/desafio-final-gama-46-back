import {Router} from "express"
import { CategoryController } from "../controller/CategoryController";

const router = Router()

router.get("/",[], CategoryController.findAll);
router.get("/:id",[], CategoryController.findOne);
router.post("/",[],CategoryController.create);
router.put("/:id",[], CategoryController.update);
router.delete("/:id",[], CategoryController.findAndDelete);


export default router