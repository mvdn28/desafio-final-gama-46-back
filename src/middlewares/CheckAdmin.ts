import { NextFunction, Request, Response } from "express";

export const CheckAdmin =  (req:any,res: Response, next: NextFunction) => {
    if (req.userRole !="admin")
        return res.status(401).send({ message: "Ação proíbida, usuário não é admin" });

    next();
}