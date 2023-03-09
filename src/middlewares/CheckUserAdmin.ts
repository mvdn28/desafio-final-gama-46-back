import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv'
dotenv.config()

export const CheckUserAdmin = (req:any,res: Response, next: NextFunction) => {
    if (req.body.role != 'admin'){
        next()
    }else{
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                res.status(401).json({ message: 'Token de autenticação não fornecido.' });
            }
            const decodedToken = jwt.verify(authHeader, process.env.JWT as string) as any;
            if (!decodedToken){
                res.status(401).json({ message: 'Token de autenticação inválido.' });
            }
            req.userId = decodedToken.userId;
            req.userRole = decodedToken.role;
            if(req.userRole === 'admin'){
                next();
            }else{
                res.status(401).json({ message: 'Token de autenticação inválido.' });
            }
            
        } catch (error) {
            res.status(500).json({message:'Token de autenticação inválido.'})
        }
        
        
    }
    
    
}