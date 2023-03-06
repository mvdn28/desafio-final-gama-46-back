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
        res.status(500).json({ message: 'Ocorreu um erro ao autenticar o usuário.' });
      }
  }
  static changePassword = async (req:any, res:Response) => {
    try {
      const id = req.userId
      const {oldPassword, newPassword} = req.body
      if (!oldPassword || !newPassword || oldPassword===newPassword){
        return res.status(400).json({message:"Uma nova senha deve ser inserida"})
      }
      const user  =  await User.findById(id)
      const comparePassword = await bcrypt.compare(oldPassword,user!.password)

      if( user && comparePassword){
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.set("password",hashedPassword)
        await user.save()

        const token = jwt.sign(
          { userId: user._id, role: user.role },
          process.env.JWT as string,
          { expiresIn: '1h' }
        );

        res.status(201).json({token,message:'Senha modificada com sucesso'})
      }else{
        res.status(404).json({message:'Usuário não encontrado'})
      }
    } catch (error) {
      res.status(500).json({ message: 'Ocorreu um erro ao mudar a senha do usuário.' });
    }
  }
}