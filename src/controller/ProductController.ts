import { Request, Response } from "express"
import { Types, Document } from "mongoose"
import { IProduct } from "../entities/Product"
import Product from "../entities/Product"

export class ProductController{

    static findAll =async (req:Request,res:Response) => {
        return await Product.find()
            .then((products)=> res.status(200).json({products}))
            .catch((error)=>res.status(500).json({error}))
    }

    static findOne = async (req: Request, res: Response): Promise<void | Response> => {
        const id = req.params.id

        return await Product.findById(id)
            .then((product)=>{product ? res.status(200).json({product}) : res.status(404).json({message:"Product not found"})})
            .catch((error) => res.status(500).json({error}))
    }

    static create = async (req: Request, res: Response): Promise<Response> => {
        const { name, description, price, image,category } = req.body
        const newProduct =new Product({
            _id: new Types.ObjectId(),
            name,
            description,
            price,
            image,
            category
        } as unknown as Document<IProduct>)

        return await newProduct.save()
            .then((product) => res.status(201).json({product}))
            .catch((error) => res.status(500).json({error}))
    }

    static update = async (req: Request, res: Response): Promise<Response> => {
        const id = req.params.id
        const { name, description, price, image,category } = req.body

        await Product.findOneAndReplace({_id:id},{ name, description, price, image,category })

        return await Product.findById(id)
            .then((updatedProduct)=>updatedProduct ? res.status(200).json({updatedProduct}) : res.status(404).json({message:"Product not found"}))
            .catch((error)=>res.status(500).json({error}))
    }

    static findAndDelete = async (req: Request, res: Response): Promise<void | Response> => {
        const id = req.params.id

        return await Product.findByIdAndDelete(id)
            .then((product)=> product ? res.status(201).json({product,message:"deleted"}) : res.status(404).json({product,message:"Product not found"}))
            .catch((error)=> res.status(500).json({error}))
    }
}