import { Request, Response } from "express";
import { User } from "../entities/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config()


export class AuthController{
    static login = async (req:Request, res:Response) => {
        try {
            const { email, password } = req.body;
        
            const user = await User.findOne({ email });
            if (!user) {
              return res.status(401).json({ message: 'E-mail ou senha inválidos.' });
            }
        
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
              return res.status(401).json({ message: 'E-mail ou senha inválidos.' });
            }
        
            const token = jwt.sign(
              { userId: user._id, role: user.role },
              process.env.JWT as string,
              { expiresIn: '1h' }
            );
        
            res.status(200).json({ token });
          } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Ocorreu um erro ao autenticar o usuário.' });
          }
    }
}