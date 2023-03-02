import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv'
dotenv.config()

export const CheckAuth = (req:any,res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'Token de autenticação não fornecido.' });
    }
    try {
        const decodedToken = jwt.verify(authHeader, process.env.JWT as string) as any;
        req.userId = decodedToken.userId;
        req.userRole = decodedToken.role;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token de autenticação inválido.' });
    }
}