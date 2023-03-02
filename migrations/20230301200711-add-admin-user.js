const { Db, Admin } = require("mongodb");
require('dotenv').config()
const bcrypt = require('bcrypt');

const hashPass = async() =>{
  return await bcrypt.hash(process.env.ADMPASSWORD,10)
}

module.exports = {
  async up(db) {
    await db.collection('users').insertOne({
      name: process.env.ADMNAME,
      email: process.env.ADMEMAIL,
      password: await hashPass(),
      isAdmin: true
    });
  },

  async down(db) {
    await db.collection('users').deleteOne({ email: process.env.ADMEMAIL });
  }
};