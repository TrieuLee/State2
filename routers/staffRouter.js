const router = require("express").Router();
const Staff = require("../models/staffModel");

router.get("/", async (req,res) => {
    try{
        const staff = await Staff.find();
        res.json(staff);
    }
    catch(err){
        res.status(500).send();
    }
})

router.post("/", async (req, res) => {
    try{
        const {name,phoneNumber,email,role,nameOfRoom,salary} = req.body;

        // Validate
        //1- Điển đủ thông tin 
        if(!name||!phoneNumber||!email||!role||!nameOfRoom||!salary) {
            return res.status(400).json({errorMessage: 'You need to enter all information'})
        }

        // 2- Số vs floor phải khác nhau
        
        const newStaff = new Staff({
            name,phoneNumber,email,role,nameOfRoom,salary
        });
    
        const saveStaff = await newStaff.save();
    
        res.json(saveStaff);
    }
    catch(err){
        res.status(500).send();
    }
})

router.put("/:id", async (req,res) => {
    try{

        const {name,phoneNumber,email,role,nameOfRoom,salary} = req.body;
        const staffID = req.params.id;

        //validation

        if(!name||!phoneNumber||!email||!role||!nameOfRoom||!salary) {
            return res.status(400).json({errorMessage: 'You need to enter all information'})
        }
        
        if(!staffID) 
            return res.status(400).json({errorMessage:"Staff ID is not given. Please contact the developer"});
        
        
        const originalStaff = await Room.findById(staffID);

        if(!originalStaff) 
            return res.status(400).json({errorMessage:"Not Staff with this ID was found. Please contact the developer"});

        originalStaff.name = name;
        originalStaff.phoneNumber = phoneNumber;
        originalStaff.email = email;
        originalStaff.role = role;
        originalStaff.nameOfRoom = nameOfRoom;
        originalStaff.salary = salary;

        const savedStaff = await originalStaff.save();

        res.json(savedStaff);
    }
    catch(err){
        res.status(500).send();
    }
})

router.delete("/:id", async (req, res) =>{
    try{
        const staffID = req.params.id;
        //validation
        
        if(!staffID) 
            return res.status(400).json({errorMessage:"Staff ID is not given. Please contact the developer"});
        
            const existingStaff = await Staff.findById(staffID);

        if(!existingStaff) 
            return res.status(400).json({errorMessage:"Not Staff with this ID was found. Please contact the developer"});

        await existingStaff.delete();
        res.json(existingStaff);
    }
    catch(err){
        res.status(500).send();
    }
})

module.exports = router;