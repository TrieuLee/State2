const router = require("express").Router();
const BookService = require("../models/bookServiceModel");
const Service = require("../models/serviceModel");
const Customer = require("../models/customerModel");
const auth = require("../middleware/auth");

router.get("/",auth, async (req,res) => {
    try{
        const user = req.user;
        const bService = await BookService.find({user:user});
        res.json(bService);
    }
    catch(err){
        res.status(500).send();
    }
})

router.get("/:id",auth, async (req,res) => {
    try{
        const user = req.params.id;
        const bService = await BookService.find({user:user});
        res.json(bService);
    }
    catch(err){
        res.status(500).send();
    }
})

router.get("/manager",auth, async (req,res) => {
    try{
        const bRoom = await BookService.find();       
        res.json(bRoom);
    }
    catch(err){
        res.status(500).send(err);
    }
})

router.post("/",auth, async (req, res) => {
    try{
        const {quantity,IDService,name,price, nameCus, phoneNumber, email, address, IDCard, unit} = req.body;
        // Validate
        //1- Điển đủ thông tin

        if(!unit ||!quantity || !IDService || !name || !price || !nameCus|| !phoneNumber || !email || !address || !IDCard) {
            return res.status(400).json({errorMessage: 'Bạn phải điền đầy đủ các thông tin!'})
        }

        // 2- Kiểm tra Mã dịch vụ có Tồn Tại Hay Không

        const existedService = await Service.findById({_id:IDService});
        if(!existedService)
            return res.status(400).json({errorMessage:"Dịch vụ này không tồn tại"});

        // 3- Phòng chưa được dùng

        const newBook = new BookService({
            unit,quantity,IDService,name,price,state:false,user: req.user, nameCus, phoneNumber, email, address, IDCard
        });
        
        const saveBookService = await newBook.save();

        res.json(saveBookService);
    }
    catch(err){
        console.log(err);
        res.status(500).send(err);
    }
})

router.post("/directionService",auth, async (req, res) => {
    try{
        const {unit,quantity,IDService,name,price,IDUser, nameCus, phoneNumber, email, address, IDCard} = req.body;
        // Validate
        //1- Điển đủ thông tin

        if(!unit || !quantity || !IDService || !name || !price || !IDUser|| !nameCus|| !phoneNumber || !email || !address || !IDCard) {
            return res.status(400).json({errorMessage: 'Bạn phải điền đầy đủ các thông tin!'})
        }

        // 2- Kiểm tra Mã dịch vụ có Tồn Tại Hay Không

        const existedService = await Service.findById({_id:IDService});
        if(!existedService)
            return res.status(400).json({errorMessage:"Dịch vụ này không tồn tại"});

        // 3- Phòng chưa được dùng

        const newBook = new BookService({
            unit,quantity,IDService,name,price,state:false,user: IDUser, nameCus, phoneNumber, email, address, IDCard
        });
        
        const saveBookService = await newBook.save();

        res.json(saveBookService);
    }
    catch(err){
        console.log(err);
        res.status(500).send(err);
    }
})

router.put("/:id",auth, async (req,res) => {
    try{

        const {unit, quantity,IDService,name,price, nameCus, phoneNumber, email, address, IDcard} = req.body;
        
        
        const bRoomID = req.params.id;
        // Validate
        //1- Điển đủ thông tin

        if(!unit||!quantity || !IDService || !name || !price || !nameCus|| !phoneNumber || !email || !address || !IDcard) {
            return res.status(400).json({errorMessage: 'Bạn phải điền đầy đủ các thông tin!'})
        }

        // 2- Kiểm tra Mã Phòng có Tồn Tại Hay Không

        const existedRoom = await Service.findById({IDRoom: IDService});
        if(!existedRoom)
            return res.status(400).json({errorMessage:"Mã dịch vụ không tồn tại"});
        
        //4- Mã Khách Hàng có Tồn Tại Không


        // 3- Phòng chưa được dùng

    
        const originalBRoom = await BookService.findById(bRoomID);

        if(!originalBRoom) 
            return res.status(400).json({errorMessage:"Không tìm thấy dịch vụ"});

        if(originalBRoom.user.toString() !==req.user)
            return res.status(401).json({errorMessage: "Unauthorized"});

        originalBRoom.quantity = quantity;
        originalBRoom.IDService = IDService;
        originalBRoom.nameCus = nameCus;
        originalBRoom.phoneNumber = phoneNumber;
        originalBRoom.email = email;
        originalBRoom.address = address;
        originalBRoom.IDcard = IDcard;
        originalBRoom.unit = unit;

        const savedBRoom = await originalBRoom.save();

        res.json(savedBRoom);
    }
    catch(err){
        res.status(500).send();
    }
})

router.put("/payService/:id",auth, async (req,res) => {
    try{
  
        const bRoomID = req.params.id;      

        // 3- Phòng chưa được dùng
    
        const originalBRoom = await BookService.findById({_id:bRoomID});


        if(!originalBRoom) 
            return res.status(400).json({errorMessage:"Not Booking Room with this ID was found. Please contact the developer"});
    
        originalBRoom.state = true;

        const savedBRoom = await originalBRoom.save();

        res.json(savedBRoom);
    }
    catch(err){
        res.status(505).send(err);
    }
})

router.put("/payService/manager/:id",auth, async (req,res) => {
    try{
  
        const bRoomID = req.params.id;      

        // 3- Phòng chưa được dùng
    
        const originalBRoom = await BookService.findById({_id:bRoomID});


        if(!originalBRoom) 
            return res.status(400).json({errorMessage:"Not Booking Room with this ID was found. Please contact the developer"});
    
        originalBRoom.state = true;

        const savedBRoom = await originalBRoom.save();

        res.json(savedBRoom);
    }
    catch(err){
        res.status(505).send(err);
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