// Nhân Viên
const mongoose = require('mongoose');
const staffSchema = new mongoose.Schema({
    name: {type: String, required: true},// tên
    phoneNumber: {type: String, required: true},// số điện thoại 
    email: {type: String, required: true},//email
    role: {type: String, required: true},// chức vụ
    nameOfRoom: {type: String, required: true},// tên phòng ban
    salary: {type: Number, required: true},// lương
    passwordHash: {type: String, required: true},//mật khẩu

},{
    timestamps:true
});

const Staff = mongoose.model('staff', staffSchema);
module.exports = Staff;