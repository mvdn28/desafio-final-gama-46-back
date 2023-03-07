import mongoose, { Schema } from "mongoose"

export interface ICupom {
    name:string,
    discount:number
}

const cupomSchema:Schema = new Schema(
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

export default mongoose.model<ICupom>("Cupom", cupomSchema)