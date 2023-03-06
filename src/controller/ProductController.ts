import { Request, Response } from "express"
import { Types, Document } from "mongoose"
import { IProduct } from "../entities/Product"
import Product from "../entities/Product"

export class ProductController{

    static findAll = async (req: Request, res: Response): Promise<Response> => {
        try {
            const products = await Product
                .find()
                .populate("category")
            return res.status(200).json({ products });
        } catch (error) {
            return res.status(500).json({ error, message: "Ocorreu um erro ao listar os produtos" });
        }
    }

    static findOne = async (req: Request, res: Response): Promise<Response> => {
        try {
            const id = req.params.id;
            const product = await Product
                .findById(id)
                .populate("category")
            if (product) {
                return res.status(200).json({ product });
            } else {
                return res.status(404).json({ message: "Produto não encontrado." });
            }
        } catch (error) {
            return res.status(500).json({ error, message: "Ocorreu um erro ao listar o produto" });
        }
    }

    static findByCategory = async (req: Request, res: Response): Promise<Response> => {
        try {
            const id = req.params.id;
            const products = await Product
                .find({category:id})
                .populate("category")
            if (products.length) {
                return res.status(200).json({ products });
            } else {
                return res.status(404).json({ message: "Categoria não encontrada encontrada." });
            }
        } catch (error) {
            return res.status(500).json({ error, message: "Ocorreu um erro ao listar os produtos" });
        }
    }

    static create = async (req: Request, res: Response): Promise<Response> => {
        try {
            const { name, description, price, image, category } = req.body;
            const newProduct = new Product({
                _id: new Types.ObjectId(),
                name,
                description,
                price,
                image,
                category
            } as unknown as Document<IProduct>);
            const product = await (await newProduct
                .save())
                .populate("category")
            return res.status(201).json({ product });
        } catch (error) {
            return res.status(500).json({ error, message: "Ocorreu um erro ao cadastrar o produto" });
        }
    }

    static update = async (req: Request, res: Response): Promise<Response> => {
        try {
            const id = req.params.id;
            const { name, description, price, image, category } = req.body;
            const update = await Product.findOneAndReplace({ _id: id }, { name, description, price, image, category });
            const updatedProduct = await Product
                .findById(id)
                .populate("category");
            if (update) {
                return res.status(200).json({ updatedProduct });
            } else {
                return res.status(404).json({ message: "Produto não encontrado" });
            }
        } catch (error) {
            return res.status(500).json({ error, message: "Ocorreu um erro ao atualizar o produto" });
        }
    }

    static findAndDelete = async (req: Request, res: Response): Promise<Response> => {
        try {
            const id = req.params.id;
            const product = await Product.findByIdAndDelete(id);
            if (product) {
                return res.status(201).json({ product, message: "Produto deletado com sucesso" });
            } else {
                return res.status(404).json({ product, message: "Produto não encontrado" });
            }
        } catch (error) {
            return res.status(500).json({ error, message: "Ocorreu um erro ao deletar o produto" });
        }
    }
}