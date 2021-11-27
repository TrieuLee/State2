// Phòng Ban
const mongoose = require('mongoose');
const roomSchema = new mongoose.Schema({
    number: {type: Number, required: true},// số phòng
    floor: {type: Number, required: true},// tầng 
    price: {type: Number, required: true},//giá
    note: {type: String, required: true},// ghi chú
    state: {type: String, required: true},// tình trạng phòng
},{
    timestamps:true
});

const Room = mongoose.model('room', roomSchema);
module.exports = Room;