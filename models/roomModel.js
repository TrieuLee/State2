// Phòng Ban
const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const roomSchema = new mongoose.Schema({
    number: {type: Number, required: true},//
    floor: {type: Number, required: true},// tầng 
    price: {type: Number, required: true},//giá
    note: {type: String, required: true},// ghi chú
    state: {type: Boolean, required: true},// tình trạng phòng
    user:{type: ObjectId, required: true},
},{
    timestamps:true
});


const Room = mongoose.model('room', roomSchema);
module.exports = Room;