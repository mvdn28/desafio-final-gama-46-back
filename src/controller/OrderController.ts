import { Request, Response } from "express"
import { Types, Document, ObjectId } from "mongoose"
import Order, { IOrder } from "../entities/Order"
import Product, { IProduct } from "../entities/Product"
import Coupon from "../entities/Coupon"

export class OrderController {
    static findAll = async (req: Request, res: Response) => {
      try {
        const orders = await Order
          .find()
          .populate('products')
          .populate('user')
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
        const order = await Order
          .findById(id)
          .populate('products')
          .populate('user')
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
        const { products , couponId } = req.body;

        let coupon = null;
        if (couponId) {
          coupon = await Coupon.findById(couponId);
          if (!coupon) {
            return res.status(400).json({ message: 'Cupom inválido.' });
          }
        }

        const productObject = await Promise.all(
          products.map(async(product:ObjectId)=>{
            return await Product.findById(product)
          })
        )
        const user = req.userId;
        let total = 0;
        productObject.forEach((element: { price: number }) => {
          total += element.price;
        });

        if (coupon) {
          total = total - (total * coupon.discount) / 100;
        }
        
        const newOrder = new Order({
          _id: new Types.ObjectId(),
          products,
          total,
          user,
        } as unknown as Document<IOrder>);
        const order = await (await (await newOrder
          .save())
          .populate("products"))
          .populate("user")
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
        const { products , couponId } = req.body;

        let productsFound
        if (!products){
          const order =await  Order.findById(id)
          productsFound = order?.products
        }else{
          productsFound = products
        }

        let coupon = null;
        if (couponId) {
          coupon = await Coupon.findById(couponId);
          if (!coupon) {
            return res.status(400).json({ message: 'Cupom inválido.' });
          }
        }
        const productObject = await Promise.all(
          productsFound.map(async(product:ObjectId)=>{
            return await Product.findById(product)
          })
        )
        const user = req.userId;
        let total = 0;
        productObject.forEach((element: { price: number }) => {
          total += element.price;
        });

        if (coupon) {
          total = total - (total * coupon.discount) / 100;
        }

        await Order.findOneAndUpdate({ _id: id }, { products, total, user, couponId });
        const updatedOrder = await Order
          .findById(id)
          .populate("products")
          .populate('user')
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