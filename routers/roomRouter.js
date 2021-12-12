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
        const {number,floor,price,note,state} = req.body;

        // Validate
        //1- Điển đủ thông tin 
        if(!number||!floor||!price||!note||!state) {
            return res.status(400).json({errorMessage: 'You need to enter all information'})
        }

        // 2- Số vs floor phải khác nhau
        const originalNumberRoom = await Room.findOne({number,floor});
        if(originalNumberRoom)
            return res.status(400).json({errorMessage:"Floor and Room was existed. Please change name or floor of room"});
    
        const newRoom = new Room({
            number,floor,price,note,state,user: req.user
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

        const {number, floor, price, note, state} = req.body;
        const roomID = req.params.id;

        //validation

        if(!number||!floor||!price||!note||!state) {
            return res.status(400).json({errorMessage: 'You need to enter all information'})
        }
        
        if(!roomID) 
            return res.status(400).json({errorMessage:"Room ID is not given. Please contact the developer"});
        
        const originalNumberRoom = await Room.findOne({number,floor});
        if(originalNumberRoom)
            return res.status(400).json({errorMessage:"Floor and Room was existed. Please change name or floor of room"});
        
        const originalRoom = await Room.findById(roomID);

        if(!originalRoom) 
            return res.status(400).json({errorMessage:"Not Room with this ID was found. Please contact the developer"});

        if(originalRoom.user.toString() !==req.user)
            return res.status(401).json({errorMessage: "Unauthorized"});

        originalRoom.number = number;
        originalRoom.floor = floor;
        originalRoom.price = price;
        originalRoom.note = note;
        originalRoom.state = state;

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
            return res.status(400).json({errorMessage:"Room ID is not given. Please contact the developer"});
        
            const existingRoom = await Room.findById(roomID);

        if(!existingRoom) 
            return res.status(400).json({errorMessage:"Not Room with this ID was found. Please contact the developer"});

        if(existingRoom.user.toString() !==req.user)
            return res.status(401).json({errorMessage: "Unauthorized"});
            
        await existingRoom.delete();
        res.json(existingRoom);
    }
    catch(err){
        res.status(500).send();
    }
})

module.exports = router;