import { Types, Document } from "mongoose"
import { ICategory } from "../entities/Category"
import Category from "../entities/Category"

export class CategoryController{

    static findAll =async (req:any,res:any) => {
        return await Category.find()
            .then((categories)=> res.status(200).json({categories}))
            .catch((error)=>res.status(500).json({error}))
    }

    static findOne = async (req: any, res: any): Promise<void | any> => {
        const id = req.params.id

        return await Category.findById(id)
            .then((category)=>{category ? res.status(200).json({category}) : res.status(404).json({message:"Categoria não encontrada"})})
            .catch((error) => res.status(500).json({error,message:'Ocorreu um erro ao buscar os detalhes da categoria.'}))
    }

    static create = async (req: any, res: any): Promise<any> => {
        const { name } = req.body
        const newCategory = new Category({
            _id:new Types.ObjectId(),
            name
        }as unknown as Document<ICategory>)

        return await newCategory.save()
            .then((category) => res.status(201).json({category}))
            .catch((error) => res.status(500).json({error,message:'Ocorreu um erro ao cadastrar a categoria.'}))
    }

    static update = async (req: any, res: any): Promise<any> => {
        const id = req.params.id
        const { name } = req.body
        const update = await Category.findOneAndReplace({_id:id},{ name })

        return await Category.findById(id)
            .then((updatedCategory)=>update ? res.status(200).json({updatedCategory}) : res.status(404).json({message:"Categoria não encontrada"}))
            .catch((error)=>res.status(500).json({error, message: 'Ocorreu um erro ao atualizar a categoria'}))
    }

    static findAndDelete = async (req: any, res: any): Promise<void | any> => {
        const id = req.params.id

        return await Category.findByIdAndDelete(id)
            .then((category)=> category ? res.status(201).json({category,message: 'Categoria excluída com sucesso.'}) : res.status(404).json({category,message:"Categoria não encontrada"}))
            .catch((error)=> res.status(500).json({error, message: 'Ocorreu um erro ao deletar a categoria'}))
    }
}