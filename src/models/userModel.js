let mongoose = require("mongoose")
let userSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    enum: ["Mr", "Mrs", "Miss"]
  },
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minLen: 8, maxLen: 15 },
  
},
  { timestamps: true })
module.exports = mongoose.model('User', userSchema)