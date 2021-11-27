// Khách
const mongoose = require('mongoose');
const customerSchema = new mongoose.Schema({
    name: {type: String, required: true},// tên
    phoneNumber: {type: Number, required: true},// số điện thoại 
    email: {type: Number, required: true},//email
    IDCard: {type: String, required: true}, // CCCD/CMND
},{
    timestamps:true
});

const Staff = mongoose.model('staff', staffSchema);
module.exports = Staff;