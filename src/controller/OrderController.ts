import { Request, Response } from "express"
import { Types, Document } from "mongoose"
import Order, { IOrder } from "../entities/Order"
import { IProduct } from "../entities/Product"

export class OrderController {
    static findAll = async (req: Request, res: Response) => {
      try {
        const orders = await Order.find();
        res.status(200).json({ orders });
      } catch (error) {
        res.status(500).json({
          error,
          message: "Ocorreu um erro ao listar os pedidos.",
        });
      }
    };
  
    static findOne = async (req: Request, res: Response): Promise<void | Response> => {
      try {
        const id = req.params.id;
        const order = await Order.findById(id);
        order
          ? res.status(200).json({ order })
          : res.status(404).json({ message: "Pedido não encontrado." });
      } catch (error) {
        res.status(500).json({
          error,
          message: "Ocorreu um erro ao listar o pedido",
        });
      }
    };
  
    static create = async (req: any, res: Response) => {
      try {
        const { products } = req.body;
        const user = req.userId;
        let total = 0;
        products.forEach((element: { price: number }) => {
          total += element.price;
        });
        const newOrder = new Order({
          _id: new Types.ObjectId(),
          products,
          total,
          user,
        } as unknown as Document<IOrder>);
        const order = await newOrder.save();
        res.status(201).json({ order });
      } catch (error) {
        res.status(500).json({
          error,
          message: "Ocorreu um erro ao criar o pedido",
        });
      }
    };
  
    static update = async (req: any, res: Response) => {
      try {
        const id = req.params.id;
        const { products } = req.body;
        const user = req.userId;
        let total = 0;
        products.forEach((element: { price: number }) => {
          total += element.price;
        });
        await Order.findOneAndReplace({ _id: id }, { products, total, user });
        const updatedOrder = await Order.findById(id);
        updatedOrder
          ? res.status(200).json({ updatedOrder })
          : res.status(404).json({ message: "Pedido não encontrado" });
      } catch (error) {
        res.status(500).json({
          error,
          message: "Ocorreu um erro ao atualizar o pedido",
        });
      }
    };
  
    static findAndDelete = async (req: Request, res: Response): Promise<void | Response> => {
      try {
        const id = req.params.id;
        const order = await Order.findByIdAndDelete(id);
        order
          ? res.status(201).json({ order, message: "Pedido excluído com sucesso" })
          : res.status(404).json({ order, message: "Pedido não encontrado" });
      } catch (error) {
        res.status(500).json({
          error,
          message: "Ocorreu um erro ao deletar o pedido",
        });
      }
    };
  }