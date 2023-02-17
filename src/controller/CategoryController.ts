import { Request, Response } from "express"
import { Types, Document } from "mongoose"
import { ICategory } from "../entities/Category"
import Category from "../entities/Category"

export class CategoryController{

    static findAll =async (req:Request,res:Response) => {
        return await Category.find()
            .then((categories)=> res.status(200).json({categories}))
            .catch((error)=>res.status(500).json({error}))
    }

    static findOne = async (req: Request, res: Response): Promise<void | Response> => {
        const id = req.params.id

        return Category.findById(id)
            .then((category)=>{category ? res.status(200).json(category) : res.status(404).json({message:"Category not found"})})
            .catch((error) => res.status(500).json({error}))
    }

    static create = async (req: Request, res: Response): Promise<Response> => {
        const { name } = req.body
        const newCategory = new Category({
            _id:new Types.ObjectId(),
            name
        }as unknown as Document<ICategory>)

        return newCategory.save()
            .then((category) => res.status(201).json({category}))
            .catch((error) => res.status(500).json({error}))
    }

    static update = async (req: Request, res: Response): Promise<Response> => {
        const id = req.params.id
        const { name } = req.body

        return Category.findOneAndReplace({_id:id},{ name })
            .then((updatedCategory)=>updatedCategory ? res.status(200).json({updatedCategory}) : res.status(404).json({message:"Category not found"}))
            .catch((error)=>res.status(500).json({error}))
    }

    static findAndDelete = async (req: Request, res: Response): Promise<void | Response> => {
        const id = req.params.id

        return Category.findByIdAndDelete(id)
            .then((category)=> category ? res.status(201).json({category,message:"deleted"}) : res.status(404).json({category,message:"Category not found"}))
            .catch((error)=> res.status(500).json({error}))
    }
}