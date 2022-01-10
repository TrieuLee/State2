// Phòng Ban
const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    name: {type: String, required: true},// tên
    price: {type: Number, required: true},//giá
    unit: {type: String, required: true} // đơn vị 
},{
    timestamps:true
});


const Service = mongoose.model('service', serviceSchema);
module.exports = Service;