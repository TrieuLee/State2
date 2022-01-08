const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const bookRoomSchema = new mongoose.Schema({
    checkIn: {type: String, required: true},
    checkOut: {type: String, required: true},
    IDRoom: {type: ObjectId, required: true},
    number: {type: Number, required: true},//
    floor: {type: Number, required: true},// tầng 
    price: {type: Number, required: true},//giá
    note: {type: String, required: true},// ghi chú
    typeofRoom: {type: String, required: true},
    stateGiveMoney: {type: Boolean, required: true},
    idCustomer:{type: ObjectId, required: true},
    name: {type: String, required: true},// tên
    phoneNumber: {type: String, required: true},// số điện thoại 
    email: {type: String, required: true},//email
    address:{type: String, required: true},// SDT
    IDCard: {type: String, required: true} ,
},{
    timestamps:true
});

const BookRoom = mongoose.model('bookRoom', bookRoomSchema);
module.exports = BookRoom;