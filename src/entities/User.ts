import {Schema , model} from "mongoose";

export interface IUser{
  name:string;
  email:string;
  password:string;
  role:string;
}


// Definição da estrutura do documento de usuário
const userSchema: Schema<IUser> = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'client'],
    required: true
  }
});

// Criação do modelo de usuário
export const User = model<IUser>("User",userSchema)
