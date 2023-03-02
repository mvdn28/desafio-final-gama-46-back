import { Request, Response } from "express"
import { Types, Document } from "mongoose"
import Coupon, { ICoupon } from "../entities/Coupon"

export class CouponController{

    static findAll =async (req:Request,res:Response) => {
        try {
            const coupons = await Coupon.find({});
            res.status(200).json({ coupons });
        } catch (error) {
            res.status(500).json({ error, message: 'Ocorreu um erro ao listar os cupons.' });
        }
    }

    static findOne = async (req: Request, res: Response): Promise<void | Response> => {
        try {
            const id = req.params.id;
            const coupon = await Coupon
              .findById(id)
            coupon
              ? res.status(200).json({ coupon })
              : res.status(404).json({ message: "Cupom não encontrado." });
        } catch (error) {
            res.status(500).json({
              error,
              message: "Ocorreu um erro ao listar o cupom",
            });
        }
    }

    static create = async (req: Request, res: Response) => {
        try {
            const { name, discount } = req.body;
            const coupon = new Coupon({ name, discount });
            const savedCoupon = await coupon.save();
            res.status(201).json({ coupon: savedCoupon });
        } catch (error) {
            res.status(500).json({ error, message: 'Ocorreu um erro ao criar o cupom.' });
        }
    }

    static update = async (req: Request, res: Response) => {
        try {
            const { name, discount } = req.body;
            const coupon = await Coupon.findById(req.params.id);
            if (!coupon) {
              return res.status(404).json({ message: 'Cupom não encontrado.' });
            }
            coupon.name = name;
            coupon.discount = discount;
            const savedCoupon = await coupon.save();
            res.status(200).json({ updatedCoupon: savedCoupon });
        } catch (error) {
            res.status(500).json({error, message: 'Ocorreu um erro ao atualizar o cupom.' });
        }
    }

    static findAndDelete = async (req: Request, res: Response): Promise<void | Response> => {
        try {
            const id = req.params.id
            const coupon = await Coupon.findByIdAndDelete(id);
            coupon
                ? res.status(201).json({ message: 'Cupom removido com sucesso.' })
                : res.status(404).json({ message: 'Cupom não encontrado.' });
        } catch (error) {
            res.status(500).json({error, message: 'Ocorreu um erro ao remover o cupom.' });
        }
    }
}