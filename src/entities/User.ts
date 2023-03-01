import mongoose from "mongoose";


// Definição da estrutura do documento de usuário
const userSchema = new mongoose.Schema({
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
export const User = mongoose.model('User', userSchema);