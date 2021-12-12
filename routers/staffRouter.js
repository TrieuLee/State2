const router = require("express").Router();
const Staff = require("../models/staffModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
        const {name,phoneNumber,email,role,nameOfRoom,salary,password,passwordVerify} = req.body;
        
        // Validation

        if(!name||!phoneNumber||!email||!role||!nameOfRoom||!salary||!password||!passwordVerify) {
            return res.status(400).json({errorMessage: 'You need to enter all information'})
        }

        if(password.length <6){
            return res.status(400).json({errorMessage: 'Password must be at least 6 characters'})
        }

        if(password !==passwordVerify){
            return res.status(400).json({errorMessage: 'Please enter the same twice Password'});
        }
        const existingUser = await Staff.findOne({email})
        if(existingUser){
            return res.status(400).json({
                errorMessage: 'User already exists. Please use another email'
            })  
        }

        //hashPassword
        
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);
        
        console.log(passwordHash);
        

        const newStaff = new Staff({
            name,phoneNumber,email,role,nameOfRoom,salary,passwordHash
        });
    
        const saveStaff = await newStaff.save();

        // create a JWT token

        const token = jwt.sign({
            id: saveStaff._id
        }, process.env.JWT_SECRET) // id from mongdb + đuôi password generator

        // tạo jsonwebtoken cho để lấy token cho user

        res.cookie("token", token, { httpOnly: true}).send();
    
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

        const existingUser = await Staff.findOne({email})
        if(existingUser){
            return res.status(400).json({
                errorMessage: 'User already exists. Please use another email'
            })  
        }
        
        const originalStaff = await Staff.findById(staffID);

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

router.post("/login", async (req, res) => {
    try{
        const {email,password} = req.body;
        
        // Validation

        if(!email || !password) {
            return res.status(400).json({errorMessage: 'You need to enter all information'})
        }

        if(password.length <6){
            return res.status(400).json({errorMessage: 'Password must be at least 6 characters'})
        }

        // get account

        const existingUser = await Staff.findOne({email})
        if(!existingUser){
            return res.status(400).json({
                errorMessage: 'Wrong password or email'
            })  
        }

        const correctPassword = await bcrypt.compare(password,existingUser.passwordHash);

        if(!correctPassword){
            return res.status(400).json({
                errorMessage: 'Wrong password or email'
            })  
        }

        // create a JWT token

        const token = jwt.sign({
            id: existingUser._id
        }, process.env.JWT_SECRET) // id from mongdb + đuôi password generator

        // tạo jsonwebtoken cho để lấy token cho user

        res.cookie("token", token, { httpOnly: true}).send();
    
        // res.json(saveStaff);
    }
    catch(err){
        res.status(500).send();
    }
})

module.exports = router;