const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const bookServiceSchema = new mongoose.Schema({
    IDService: {type: ObjectId, required: true},// toàn bộ thông tin bên phòng
    state: {type: Boolean, required: true},
    quantity: {type: Number, required: true},
    user:{type: ObjectId, required: true},
    name: {type: String, required: true},// tên
    price: {type: Number, required: true}//giá
},{
    timestamps:true
});

const BookService = mongoose.model('bookService', bookServiceSchema);
module.exports = BookService;