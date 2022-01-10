const router = require("express").Router();
const BookRoom = require("../models/bookRoomModel");
const Room = require("../models/roomModel");
const Customer = require("../models/customerModel");
const auth = require("../middleware/auth");

router.get("/",auth, async (req,res) => {
    try{
        const user = req.user;
        const bRoom = await BookRoom.find({idCustomer:user});
        if(!bRoom) return res.status(400).json({errorMessage: 'Bạn chưa đặt phòng. Hãy đặt phòng để tiếp tục.'})
        
        res.json(bRoom);
    }
    catch(err){
        res.status(500).send(err);
    }
})

router.get("/:id",auth, async (req,res) => {
    try{
        const user = req.params.id;
        const bRoom = await BookRoom.find({idCustomer:user});
        if(!bRoom) return res.status(400).json({errorMessage: 'Bạn chưa đặt phòng. Hãy đặt phòng để tiếp tục.'})
        
        res.json(bRoom);
    }
    catch(err){
        res.status(500).send(err);
    }
})

router.get("/room/manager",auth, async (req,res) => {
    try{
        const bRoom = await BookRoom.find();       
        res.json(bRoom);
    }
    catch(err){
        res.status(500).send(err);
    }
})

router.post("/",auth, async (req, res) => {
    try{
        const {checkIn,checkOut,IDRoom,number,floor,price,note,typeofRoom,name,phoneNumber,email,address,IDCard} = req.body;
        // Validate
        //1- Điển đủ thông tin

        if(!checkIn || !checkOut || !IDRoom ||  !number || !floor || !price || !note || !typeofRoom || !name || !phoneNumber || !email || !address || !IDCard) {
            return res.status(400).json({errorMessage: 'Bạn phải điền đầy đủ các thông tin!'})
        }

        // 2- Kiểm tra Mã Phòng có Tồn Tại Hay Không

        const existedRoom = await Room.findById({_id:IDRoom});
        if(!existedRoom)
            return res.status(400).json({errorMessage:"Mã phòng không tồn tại. Vui lòng liên hệ lập tình viên của chúng tôi"});

        // 3- Phòng chưa được dùng

        if(existedRoom.state===true)
            return res.status(400).json({errorMessage:"Phòng đang bận. Vui lòng chọn phòng khác"});
    
        const newBook = new BookRoom({
            checkIn,checkOut,IDRoom,number,floor,price,note,name,phoneNumber,email,address,IDCard,typeofRoom,stateGiveMoney:false,idCustomer: req.user
        });
        
        const saveBookRoom = await newBook.save();
        
        existedRoom.state = true;

        const savedRoom = await existedRoom.save();

        res.json(saveBookRoom);
    }
    catch(err){
        res.status(500).send(err);
    }
})

router.post("/directionRoom",auth, async (req, res) => {
    try{
        const {checkIn,checkOut,IDRoom,IDGuest,number,floor,price,note,typeofRoom,name,phoneNumber,email,address,IDCard} = req.body;
        // Validate
        //1- Điển đủ thông tin

        if(!checkIn || !checkOut || !IDRoom || !IDGuest ||  !number || !floor || !price || !note || !typeofRoom || !name || !phoneNumber || !email || !address || !IDCard) {
            return res.status(400).json({errorMessage: 'Bạn phải điền đầy đủ các thông tin!'})
        }

        // 2- Kiểm tra Mã Phòng có Tồn Tại Hay Không

        const existedRoom = await Room.findById({_id:IDRoom});
        if(!existedRoom)
            return res.status(400).json({errorMessage:"IDRoom is not existed"});

        // 3- Phòng chưa được dùng

        if(existedRoom.state===true)
            return res.status(400).json({errorMessage:"Room is busy. Please choose another Room"});
    
        const newBook = new BookRoom({
            checkIn,checkOut,IDRoom,number,floor,price,note,name,phoneNumber,email,address,IDCard,typeofRoom,stateGiveMoney:false,idCustomer: IDGuest
        });
        
        const saveBookRoom = await newBook.save();
        
        existedRoom.state = true;

        const savedRoom = await existedRoom.save();

        res.json(saveBookRoom);
    }
    catch(err){
        res.status(500).send(err);
    }
})

router.put("/:id",auth, async (req,res) => {
    try{

        const {checkIn,checkOut,IDRoom,number,floor,price,note,typeofRoom,name,phoneNumber,email,address,IDCard} = req.body;
        
        const bRoomID = req.params.id;
        // Validate
        //1- Điển đủ thông tin

        if(!checkIn || !checkOut || !IDRoom ||  !number || !floor || !price || !note || !typeofRoom || !name || !phoneNumber || !email || !address || !IDCard) {
            return res.status(400).json({errorMessage: 'Bạn phải điền đầy đủ các thông tin!'})
        }

        // 2- Kiểm tra Mã Phòng có Tồn Tại Hay Không

        const existedRoom = await Room.findById({IDRoom});
        if(!existedRoom)
            return res.status(400).json({errorMessage:"IDRoom is not existed"});
        

        // 3- Phòng chưa được dùng

        if(existedRoom.state===true)
            return res.status(400).json({errorMessage:"Room is busy. Please choose another Room"});
    
        const originalBRoom = await BookRoom.findById(bRoomID);

        if(!originalBRoom) 
            return res.status(400).json({errorMessage:"Not Booking Room with this ID was found. Please contact the developer"});

        if(originalBRoom.idCustomer.toString() !==req.user)
            return res.status(401).json({errorMessage: "Unauthorized"});

        originalBRoom.checkIn = checkIn;
        originalBRoom.checkOut = checkOut;
        originalBRoom.IDRoom = IDRoom;
        originalBRoom.number = number;
        originalBRoom.floor = floor;
        originalBRoom.price = price;
        originalBRoom.note = note;
        originalBRoom.name = name;
        originalBRoom.typeofRoom = typeofRoom;
        originalBRoom.phoneNumber = phoneNumber;
        originalBRoom.email = email;
        originalBRoom.address = address;
        originalBRoom.IDCard = IDCard;

        const savedBRoom = await originalBRoom.save();

        res.json(savedBRoom);
    }
    catch(err){
        res.status(500).send();
    }
})

router.put("/payBill/:id",auth, async (req,res) => {
    try{

        
        const bRoomID = req.params.id;        

        // 3- Phòng chưa được dùng
    
        const originalBRoom = await BookRoom.findById(bRoomID);

        if(!originalBRoom) 
            return res.status(400).json({errorMessage:"Not Booking Room with this ID was found. Please contact the developer"});
        if(originalBRoom.idCustomer.toString() !==req.user)
            return res.status(401).json({errorMessage: "Unauthorized"});

        const existedRoom = await Room.findById({_id:originalBRoom.IDRoom});
        if(!existedRoom)
            return res.status(400).json({errorMessage:"IDRoom is not existed"});
    

        originalBRoom.stateGiveMoney = true;
        existedRoom.state=false;

        const savedBRoom = await originalBRoom.save();
        const savedRoom = await existedRoom.save();

        res.json({savedBRoom, savedRoom});
    }
    catch(err){
        res.status(500).send(err);
    }
})

router.put("/payBill/manager/:id",auth, async (req,res) => {
    try{

        
        const bRoomID = req.params.id;        

        // 3- Phòng chưa được dùng
    
        const originalBRoom = await BookRoom.findById(bRoomID);

        if(!originalBRoom) 
            return res.status(400).json({errorMessage:"Not Booking Room with this ID was found. Please contact the developer"});

        const existedRoom = await Room.findById({_id:originalBRoom.IDRoom});
        if(!existedRoom)
            return res.status(400).json({errorMessage:"IDRoom is not existed"});
    

        originalBRoom.stateGiveMoney = true;
        existedRoom.state=false;

        const savedBRoom = await originalBRoom.save();
        const savedRoom = await existedRoom.save();

        res.json({savedBRoom, savedRoom});
    }
    catch(err){
        res.status(500).send(err);
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

        if(existingBRoom.idCustomer.toString() !==req.user)
            return res.status(401).json({errorMessage: "Unauthorized"});
            
        await existingBRoom.delete();
        res.json(existingBRoom);
    }
    catch(err){
        res.status(500).send();
    }
})

module.exports = router;