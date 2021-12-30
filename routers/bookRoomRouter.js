const router = require("express").Router();
const BookRoom = require("../models/bookRoomModel");
const Room = require("../models/roomModel");
const Customer = require("../models/customerModel");
const auth = require("../middleware/auth");

router.get("/",auth, async (req,res) => {
    try{
        const bRoom = await BookRoom.find();
        res.json(bRoom);
    }
    catch(err){
        res.status(500).send();
    }
})

router.post("/",auth, async (req, res) => {
    try{
        const {typeOfRoom,checkIn,checkOut,IDRoom,IDCus} = req.body;

        // Validate
        //1- Điển đủ thông tin

        if(!typeOfRoom||!checkIn||!checkOut||!IDRoom||!IDCus) {
            return res.status(400).json({errorMessage: 'Bạn phải điền đầy đủ các thông tin!'})
        }

        // 2- Kiểm tra Mã Phòng có Tồn Tại Hay Không

        const existedRoom = await Room.findById({IDRoom});
        if(!existedRoom)
            return res.status(400).json({errorMessage:"IDRoom is not existed"});
        
        //4- Mã Khách Hàng có Tồn Tại Không

        const existedCus = await Customer.findById({IDCus});
        if(!existedCus)
            return res.status(400).json({errorMessage:"IDCus is not existed"});
        

        // 3- Phòng chưa được dùng

        if(existedRoom.state===true)
            return res.status(400).json({errorMessage:"Room is busy. Please choose another Room"});
    
        const newBook = new BookRoom({
            typeOfRoom,checkIn,checkOut,IDRoom,IDCus,user: req.user
        });
    
        const saveBookRoom = await newBook.save();
    
        res.json(saveBookRoom);
    }
    catch(err){
        res.status(500).send();
    }
})

router.put("/:id",auth, async (req,res) => {
    try{

        const {typeOfRoom,checkIn,checkOut,IDRoom,IDCus} = req.body;
        
        const bRoomID = req.params.id;
        // Validate
        //1- Điển đủ thông tin

        if(!typeOfRoom||!checkIn||!checkOut||!IDRoom||!IDCus) {
            return res.status(400).json({errorMessage: 'Bạn phải điền đầy đủ các thông tin!'})
        }

        // 2- Kiểm tra Mã Phòng có Tồn Tại Hay Không

        const existedRoom = await Room.findById({IDRoom});
        if(!existedRoom)
            return res.status(400).json({errorMessage:"IDRoom is not existed"});
        
        //4- Mã Khách Hàng có Tồn Tại Không

        const existedCus = await Customer.findById({IDCus});
        if(!existedCus)
            return res.status(400).json({errorMessage:"IDCus is not existed"});
        

        // 3- Phòng chưa được dùng

        if(existedRoom.state===true)
            return res.status(400).json({errorMessage:"Room is busy. Please choose another Room"});
    
        const originalBRoom = await BookRoom.findById(bRoomID);

        if(!originalBRoom) 
            return res.status(400).json({errorMessage:"Not Booking Room with this ID was found. Please contact the developer"});

        if(originalBRoom.user.toString() !==req.user)
            return res.status(401).json({errorMessage: "Unauthorized"});

        originalBRoom.typeOfRoom = typeOfRoom;
        originalBRoom.checkIn = checkIn;
        originalBRoom.checkOut = checkOut;
        originalBRoom.IDRoom = IDRoom;
        originalBRoom.IDCus = IDCus;
        originalBRoom.user = req.user;

        const savedBRoom = await originalBRoom.save();

        res.json(savedBRoom);
    }
    catch(err){
        res.status(500).send();
    }
})

router.delete("/:id",auth, async (req, res) =>{
    try{
        const bRoomID = req.params.id;
        //validation
        
        if(!bRoomID) 
            return res.status(400).json({errorMessage:"Customer ID is not given. Please contact the developer"});
        
        const existingBRoom = await Customer.findById(bRoomID);

        if(!existingBRoom) 
            return res.status(400).json({errorMessage:"Not Customer with this ID was found. Please contact the developer"});

        if(existingBRoom.user.toString() !==req.user)
            return res.status(401).json({errorMessage: "Unauthorized"});
            
        await existingBRoom.delete();
        res.json(existingBRoom);
    }
    catch(err){
        res.status(500).send();
    }
})

module.exports = router;