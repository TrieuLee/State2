// Khách
const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const bookRoomSchema = new mongoose.Schema({
    typeOfRoom: {type: String, required: true},
    checkIn: {type: Date, required: true},
    checkOut: {type: Date, required: true},
    IDRoom: {type: ObjectId, required: true},// toàn bộ thông tin bên phòng
    IDCus: {type: ObjectId, required: true},
    state: {type: Boolean, required: true},
    user:{type: ObjectId, required: true},
},{
    timestamps:true
});

const BookRoom = mongoose.model('bookRoom', bookRoomSchema);
module.exports = BookRoom;