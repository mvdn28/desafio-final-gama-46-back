import {Router} from "express"
import { CouponController } from "../controller/CouponController";
import { CheckAdmin } from "../middlewares/CheckAdmin";
import { CheckAuth } from "../middlewares/CheckAuth";

const router = Router()

router.get("/",[], CouponController.findAll);
router.get("/:id",[], CouponController.findOne);
router.post("/",[CheckAuth,CheckAdmin],CouponController.create);
router.put("/:id",[CheckAuth, CheckAdmin], CouponController.update);
router.delete("/:id",[CheckAuth, CheckAdmin], CouponController.findAndDelete);


export default router