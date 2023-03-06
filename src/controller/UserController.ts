import { Request, Response } from 'express'
import {User} from '../entities/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';

dotenv.config()

export class UserController{
    static findAll = async(req:Request,res:Response) => {
        try {
            const users = await User.find({}, { password: 0 });
            res.status(200).json({ users });
          } catch (error) {
            res.status(500).json({error, message: 'Ocorreu um erro ao listar os usuários.' });
          }
    }
    static findOne = async (req:Request,res:Response) => {
        try {
            const user = await User.findById(req.params.id, { password: 0 });
            if (!user) {
              return res.status(404).json({ message: 'Usuário não encontrado.' });
            }
        
            res.status(200).json({ user });
          } catch (error) {
            res.status(500).json({error, message: 'Ocorreu um erro ao buscar os detalhes do usuário.' });
          }
    }
    static create = async(req:Request,res:Response) =>{
        try {        
            const { name, email, password, role } = req.body;
        
            const user = new User({ name, email, password, role });
            await user.save();
        
            const token = jwt.sign(
              { userId: user._id, role: user.role },
              process.env.JWT as string,
              { expiresIn: '1h' }
            );
        
            res.status(201).json({ user, token });
          } catch (error) {
            res.status(500).json({error, message: 'Ocorreu um erro ao cadastrar o usuário.' });
          }
    }
    static update = async(req:Request, res:Response) =>{
        try {
            const { name, email, password, role } = req.body;
        
            await User.findByIdAndUpdate(
              req.params.id,
              { name, email, password, role },
              { new: true, runValidators: true }
            );

            const updatedUser = await User.findById(req.params.id)
        
            if (!updatedUser) {
              return res.status(404).json({ message: 'Usuário não encontrado.' });
            }
        
            res.status(201).json({ updatedUser });
          } catch (error) {
            res.status(500).json({error, message: 'Ocorreu um erro ao atualizar o usuário.' });
          }
    }
    static findAndDelete = async (req:Request,res:Response) =>{
        try {
            const deletedUser = await User.findByIdAndDelete(req.params.id);
            if (!deletedUser) {
              return res.status(404).json({ message: 'Usuário não encontrado.' });
            }
        
            res.status(200).json({user:deletedUser, message: 'Usuário excluído com sucesso.' });
          } catch (error) {
            res.status(500).json({error, message: 'Ocorreu um erro ao excluir o usuário.' });
          }
    }
}