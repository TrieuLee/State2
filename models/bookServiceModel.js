const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const bookServiceSchema = new mongoose.Schema({
    IDService: {type: ObjectId, required: true},// toàn bộ thông tin bên phòng
    state: {type: Boolean, required: true},
    quantity: {type: Number, required: true},
    user:{type: ObjectId, required: true},
    name: {type: String, required: true},// tên
    price: {type: Number, required: true},//giá
    nameCus: {type: String, required: true},// tên
    phoneNumber: {type: String, required: true},// số điện thoại 
    email: {type: String, required: true},//email
    address:{type: String, required: true},// SDT
    IDCard: {type: String, required: true} ,// CCCD/CMND
    unit: {type: String, required: true} ,// CCCD/CMND
    
},{
    timestamps:true
});

const BookService = mongoose.model('bookService', bookServiceSchema);
module.exports = BookService;