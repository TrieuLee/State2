const router = require("express").Router();
const Customer = require("../models/customerModel");
const auth = require("../middleware/auth");

router.get("/",auth, async (req,res) => {
    try{
        console.log(req.user)
        const cus = await Customer.find();
        res.json(cus);
    }
    catch(err){
        res.status(500).send();
    }
})

router.post("/",auth, async (req, res) => {
    try{
        const {name,phoneNumber,email,IDCard} = req.body;

        // Validate
        //1- Điển đủ thông tin

        if(!name||!phoneNumber||!email||!IDCard) {
            return res.status(400).json({errorMessage: 'You need to enter all information'})
        }

        // 2- IDCard phải khác nhau

        const originalIDCard = await Customer.findOne({IDCard});
        if(originalIDCard)
            return res.status(400).json({errorMessage:"IDCard was existed. Please change name or floor of room"});
    
        const newCus = new Customer({
            name,phoneNumber,email,IDCard,user: req.user
        });
    
        const saveCus = await newCus.save();
    
        res.json(saveCus);
    }
    catch(err){
        res.status(500).send();
    }
})

router.put("/:id",auth, async (req,res) => {
    try{

        const {name,phoneNumber,email,IDCard} = req.body;
        const cusID = req.params.id;

        //validation

        if(!name||!phoneNumber||!email||!IDCard) {
            return res.status(400).json({errorMessage: 'You need to enter all information'})
        }
        
        if(!cusID) 
            return res.status(400).json({errorMessage:"Customer ID is not given. Please contact the developer"});
        
        // 2- IDCard phải khác nhau

        const originalIDCard = await Customer.findOne({IDCard});
        if(originalIDCard)
            return res.status(400).json({errorMessage:"IDCard was existed. Please change name or floor of room"});
    
        const originalCus = await Customer.findById(cusID);

        if(!originalCus) 
            return res.status(400).json({errorMessage:"Not Customer with this ID was found. Please contact the developer"});

        if(originalCus.user.toString() !==req.user)
            return res.status(401).json({errorMessage: "Unauthorized"});

        originalCus.name = name;
        originalCus.phoneNumber = phoneNumber;
        originalCus.email = email;
        originalCus.IDCard = IDCard;
        originalCus.user = req.user;

        const savedCus = await originalCus.save();

        res.json(savedCus);
    }
    catch(err){
        res.status(500).send();
    }
})

router.delete("/:id",auth, async (req, res) =>{
    try{
        const cusID = req.params.id;
        //validation
        
        if(!cusID) 
            return res.status(400).json({errorMessage:"Customer ID is not given. Please contact the developer"});
        
        const existingCus = await Customer.findById(cusID);

        if(!existingCus) 
            return res.status(400).json({errorMessage:"Not Customer with this ID was found. Please contact the developer"});

        if(existingCus.user.toString() !==req.user)
            return res.status(401).json({errorMessage: "Unauthorized"});
            
        await existingCus.delete();
        res.json(existingCus);
    }
    catch(err){
        res.status(500).send();
    }
})

module.exports = router;