// Khách
const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const customerSchema = new mongoose.Schema({
    name: {type: String, required: true},// tên
    phoneNumber: {type: String, required: true},// số điện thoại 
    email: {type: String, required: true},//email
    address:{type: String, required: true},// SDT
    IDCard: {type: String, required: true} ,// CCCD/CMND
    passwordHash: {type: String, required: true}
},{
    timestamps:true
});

const Customer = mongoose.model('customer', customerSchema);
module.exports = Customer;