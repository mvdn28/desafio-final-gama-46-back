import {Router} from "express"
import { ProductController } from "../controller/ProductController";
import { CheckAdmin } from "../middlewares/CheckAdmin";
import { CheckAuth } from "../middlewares/CheckAuth";


const router = Router()

router.get("/",[], ProductController.findAll);
router.get("/:id",[], ProductController.findOne);
router.get("/category/:id",[], ProductController.findByCategory);
router.post("/",[CheckAuth, CheckAdmin],ProductController.create);
router.put("/:id",[CheckAuth, CheckAdmin], ProductController.update);
router.delete("/:id",[CheckAuth, CheckAdmin], ProductController.findAndDelete);


export default router