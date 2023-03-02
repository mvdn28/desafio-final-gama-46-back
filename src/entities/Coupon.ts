import mongoose, { Schema } from "mongoose"

export interface ICoupon {
    name:string,
    discount:number
}

const couponSchema:Schema = new Schema(
    {
        name:{type:String, required:true},
        discount: {
            type: Number,
            required: true,
            min: 0,
            max: 100,
          },
    },{
        timestamps:true
    }
)

export default mongoose.model<ICoupon>("Coupon", couponSchema)
