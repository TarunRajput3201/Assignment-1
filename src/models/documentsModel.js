let mongoose = require("mongoose")
let objectId = mongoose.Schema.Types.ObjectId
let documentsSchema = new mongoose.Schema({
    document:{type:String},
    title: { type: String, required: true, unique: true },
    userId: { type: objectId, required: true, ref: "User" },
    isDeleted:{type:Boolean ,default:false}
},
    { timestamps: true })
module.exports = mongoose.model('Document', documentsSchema)