import { Router } from "express";
import { AuthController } from "../controller/AuthController";
import { CheckAuth } from "../middlewares/CheckAuth";

const router = Router();

router.post('/login',[],AuthController.login)
router.post('/change',[CheckAuth],AuthController.changePassword)

export default router