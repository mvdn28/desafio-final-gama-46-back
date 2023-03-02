import mongoose, { Schema } from "mongoose";
import { IProduct } from "./Product";

export interface IOrder{
    products:IProduct[],
    total:number,
    user: any,
    cupom?: any,
}

const orderSchema: Schema<IOrder> = new Schema(
    {
        products:[{type:Schema.Types.ObjectId,required:true,ref:'Product'}],
        total:{type:Number,required:true},
        user:{type:Schema.Types.ObjectId,required:true,ref:'User'}
    }
)

export default mongoose.model<IOrder>("Order",orderSchema)