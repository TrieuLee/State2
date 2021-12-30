const router = require("express").Router();
const Room = require("../models/roomModel");
const auth = require("../middleware/auth");

router.get("/",auth, async (req,res) => {
    try{
        const room = await Room.find();
        res.json(room);
    }
    catch(err){
        res.status(500).send();
    }
})

router.post("/",auth, async (req, res) => {
    try{
        const {number,floor,price,note,state,typeofRoom} = req.body;
    
        // Validate
        //1- Điển đủ thông tin 
        if(number===undefined||floor===undefined||price===undefined||!note===undefined||state===undefined||typeofRoom===undefined) {
            return res.status(400).json({errorMessage: 'Bạn phải điền đầy đủ các thông tin!'})
        }

        // 2- Số vs floor phải khác nhau
        const originalNumberRoom = await Room.findOne({number,floor});
        if(originalNumberRoom)
            return res.status(400).json({errorMessage:"Vị trí phòng đã có. Hãy đổi lại vị trí khác"});
    
        const newRoom = new Room({
            number,floor,price,note,state,typeofRoom,user: req.user
        });
    
        const saveRoom = await newRoom.save();
    
        res.json(saveRoom);
    }
    catch(err){
        res.status(500).send();
    }
})

router.put("/:id",auth, async (req,res) => {
    try{

        const {number, floor, price, note, state,typeofRoom} = req.body;
        const roomID = req.params.id;

        //validation

        if(number===undefined||floor===undefined||price===undefined||!note===undefined||state===undefined||typeofRoom===undefined) {
            return res.status(400).json({errorMessage: 'Bạn phải điền đầy đủ các thông tin!'})
        }
        
        if(!roomID) 
            return res.status(400).json({errorMessage:"ID phòng không tồn tại. Hãy liên hệ với nhà phát triển hệ thống của chúng tôi"});
        
        const originalNumberRoom = await Room.findOne({number,floor});
        
        const originalRoom = await Room.findById(roomID);
        if(originalNumberRoom && originalNumberRoom._id.toString()!==originalRoom._id.toString())
            return res.status(400).json({errorMessage:"Vị trí phòng đã có. Hãy đổi lại vị trí khác"});
        
        if(!originalRoom) 
            return res.status(400).json({errorMessage:"ID phòng không tồn tại. Hãy liên hệ với nhà phát triển hệ thống của chúng tôi"});

        originalRoom.number = number;
        originalRoom.floor = floor;
        originalRoom.price = price;
        originalRoom.note = note;
        originalRoom.state = state;
        originalRoom.typeofRoom = typeofRoom;

        const savedRoom = await originalRoom.save();

        res.json(savedRoom);
    }
    catch(err){
        res.status(500).send();
    }
})

router.delete("/:id",auth, async (req, res) =>{
    try{
        const roomID = req.params.id;
        //validation
        
        if(!roomID) 
            return res.status(400).json({errorMessage:"ID phòng không tồn tại. Hãy liên hệ với nhà phát triển hệ thống của chúng tôi"});
        
            const existingRoom = await Room.findById(roomID);

        if(!existingRoom) 
            return res.status(400).json({errorMessage:"ID phòng không tồn tại. Hãy liên hệ với nhà phát triển hệ thống của chúng tôi"});

            
        await existingRoom.delete();
        res.json(existingRoom);
    }
    catch(err){
        res.status(500).send();
    }
})

module.exports = router;