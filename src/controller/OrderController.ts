import { Request, Response } from "express"
import { Types, Document } from "mongoose"
import Order, { IOrder } from "../entities/Order"
import { IProduct } from "../entities/Product"

export class OrderController{
    static findAll =async (req:Request,res:Response) => {
        return await Order.find()
            .then((orders)=> res.status(200).json({orders}))
            .catch((error)=>res.status(500).json({error}))
    }

    static findOne = async (req: Request, res: Response): Promise<void | Response> => {
        const id = req.params.id

        return await Order.findById(id)
            .then((order)=>{order ? res.status(200).json({order}) : res.status(404).json({message:"Order not found"})})
            .catch((error) => res.status(500).json({error}))
    }

    static create = async (req: Request, res: Response): Promise<Response> => {
        const { products, user } = req.body
        const total = products.reduce((a:IProduct,b:IProduct)=>a.price + b.price)
        const newOrder = new Order({
            _id:new Types.ObjectId(),
            products,
            total,
            user
        }as unknown as Document<IOrder>)

        return await newOrder.save()
            .then((Order) => res.status(201).json({Order}))
            .catch((error) => res.status(500).json({error}))
    }

    static update = async (req: Request, res: Response): Promise<Response> => {
        const id = req.params.id
        const { products, user } = req.body
        const total = products.reduce((a:IProduct,b:IProduct)=>a.price + b.price)
        await Order.findOneAndReplace({_id:id},{products,total,user})
        
        return await Order.findById(id)
            .then((updatedOrder)=>updatedOrder ? res.status(200).json({updatedOrder}) : res.status(404).json({message:"Order not found"}))
            .catch((error)=>res.status(500).json({error}))
    }

    static findAndDelete = async (req: Request, res: Response): Promise<void | Response> => {
        const id = req.params.id

        return await  Order.findByIdAndDelete(id)
            .then((order)=> order ? res.status(201).json({order,message:"deleted"}) : res.status(404).json({order,message:"Order not found"}))
            .catch((error)=> res.status(500).json({error}))
    }
}