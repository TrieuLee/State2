// Khách
const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const customerSchema = new mongoose.Schema({
    name: {type: String, required: true},// tên
    phoneNumber: {type: Number, required: true},// số điện thoại 
    email: {type: Number, required: true},//email
    IDCard: {type: String, required: true}, // CCCD/CMND
    user:{type: ObjectId, required: true}
},{
    timestamps:true
});

const Customer = mongoose.model('customer', customerSchema);
module.exports = Customer;