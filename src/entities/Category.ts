import { Schema, model } from "mongoose"

export interface ICategory {
    name:string
}

const categorySchema:Schema = new Schema(
    {
        name:{type:String, required:true, unique:true}
    },{
        timestamps:true
    }
)

export default model<ICategory>("Category", categorySchema)