import mongoose, { Schema } from "mongoose";
import { IProduct } from "./Product";

export interface IOrder{
    products:IProduct[],
    total:number,
    user: any,
    couponId?: any,
}

const orderSchema: Schema<IOrder> = new Schema(
    {
        products:[{type:Schema.Types.ObjectId,required:true,ref:'Product'}],
        total:{type:Number},
        user:{type:Schema.Types.ObjectId,required:true,ref:'User'},
        couponId:{type:Schema.Types.ObjectId,ref:'Coupon'}
    }
)

export default mongoose.model<IOrder>("Order",orderSchema)