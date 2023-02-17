import { ICategory } from "./Category";
import mongoose, {Schema} from 'mongoose';

export interface IProduct{
    name:string,
    description:string,
    price:number,
    image:string,
    category:ICategory
}


const productSchema:Schema<IProduct> = new Schema(
    {
        name:{type:String, required:true},
        description:{type:String, required:true},
        price:{type:Number, required:true},
        image:{type:String, required:true},
        category:{type:Schema.Types.ObjectId, required:true, ref:"Category"},
    },{
        timestamps:true
    }
)

export default mongoose.model<IProduct>("Product",productSchema)