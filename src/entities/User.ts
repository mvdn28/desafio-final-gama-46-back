import {Schema , model} from "mongoose";
import bcrypt from "bcrypt"

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
userSchema.pre("save", async function(next){
  let user = this;

  if (!user.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);

  const hash = await bcrypt.hashSync(user.password, salt)

  user.password=hash
})

// Criação do modelo de usuário
export const User = model<IUser>("User",userSchema)