import { Router } from "express";
import category from './category'
import order from './order'
import product from './product'
import user from './user'
import auth from './auth'
import coupon from './coupon'

const routes = Router();

routes.use('/category',category )
routes.use('/order', order)
routes.use('/product', product)
routes.use('/user',user)
routes.use('/auth',auth)
routes.use('/coupon', coupon)

export default routes