import {Router} from "express"
import { ProductController } from "../controller/ProductController";


const router = Router()

router.get("/",[], ProductController.findAll);
router.get("/:id",[], ProductController.findOne);
router.post("/",[],ProductController.create);
router.put("/:id",[], ProductController.update);
router.delete("/:id",[], ProductController.findAndDelete);


export default router