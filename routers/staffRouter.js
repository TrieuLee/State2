const router = require("express").Router();
const Staff = require("../models/staffModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require('../middleware/auth');

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
            return res.status(400).json({errorMessage: 'Bạn phải điền đầy đủ các thông tin!'})
        }

        if(password.length <6){
            return res.status(400).json({errorMessage: 'Mật khẩu ít nhất là 6 ký tự!'})
        }

        if(password !==passwordVerify){
            return res.status(400).json({errorMessage: 'Mật khẩu xác thực không trùng khớp!'});
        }
        const existingUser = await Staff.findOne({email})
        if(existingUser){
            return res.status(400).json({
                errorMessage: 'Email đã được sử dụng. Hãy dùng email khác!'
            })  
        }

        //hashPassword
        
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);
        
        const newStaff = new Staff({
            name,phoneNumber,email,role,nameOfRoom,salary,passwordHash,decentralize:2
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
        const {name,phoneNumber,role,nameOfRoom,salary} = req.body;
        const staffID = req.params.id;

        //validation

        if(!name||!phoneNumber||!role||!nameOfRoom||!salary) {
            return res.status(400).json({errorMessage: 'Bạn phải điền đầy đủ các thông tin!'})
        }
        
        if(!staffID) 
            return res.status(400).json({errorMessage:"Staff ID is not given. Please contact the developer"});

        const originalStaff = await Staff.findById(staffID);
        
        if(!originalStaff) 
            return res.status(400).json({errorMessage:"ID Nhân viên không tồn tại. Hãy liên hệ với nhà phát triển hệ thống của chúng tôi"});

        originalStaff.name = name;
        originalStaff.phoneNumber = phoneNumber;
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
            return res.status(400).json({errorMessage:"ID Nhân viên không tồn tại. Hãy liên hệ với nhà phát triển hệ thống của chúng tôi"});
        
            const existingStaff = await Staff.findById(staffID);

        if(!existingStaff) 
            return res.status(400).json({errorMessage:"ID Nhân viên không tồn tại. Hãy liên hệ với nhà phát triển hệ thống của chúng tôi"});

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
            return res.status(400).json({errorMessage: 'Bạn phải điền đầy đủ các thông tin!'})
        }

        if(password.length <6){
            return res.status(400).json({errorMessage: 'Mật khẩu ít nhất là 6 ký tự!'})
        }

        // get account

        const existingUser = await Staff.findOne({email})
        if(!existingUser){
            return res.status(400).json({
                errorMessage: 'Sai tài khoản hoặc mật khẩu. Vui lòng nhập lại.'
            })  
        }

        const correctPassword = await bcrypt.compare(password,existingUser.passwordHash);

        if(!correctPassword){
            return res.status(400).json({
                errorMessage: 'Sai tài khoản hoặc mật khẩu. Vui lòng nhập lại.'
            })  
        }

        // create a JWT token

        const token = jwt.sign({
            id: existingUser._id
        }, process.env.JWT_SECRET) // id from mongdb + đuôi password generator

        // tạo jsonwebtoken cho để lấy token cho user

        res.cookie("token", token, { httpOnly: true}).send();
    
        
    }
    catch(err){
        res.status(500).send();
    }
})

router.get("/loggedIn", async(req, res) => {
    try{
        const token = req.cookies.token;
        if(!token) return res.json(null);

        const validatedUser = jwt.verify(token, process.env.JWT_SECRET);

        const user = await Staff.findById(validatedUser.id);

        res.json(user);
    }
    catch(err){
        return res.json(null);
    }
})

router.get("/logOut", (req,res) =>{
    try{
        res.clearCookie("token").send();
    }
    catch (err){
        return res.json(null)
    }
})

router.put("/change/password", auth, async (req, res) => {
    try{
        const {email, password, newPassword} = req.body;
        // Validation

        if(!email || !password ||!newPassword){
            return res.status(400).json({
                errorMessage: 'Bạn phải điền đầy đủ các thông tin!'
            });
        }

        if(password === newPassword){
            return res.status(400).json({
                errorMessage: 'Mật khẩu mới trùng khớp với mật khẩu hiện tại'
            });
        }

        if(newPassword.length < 6){
            return res.status(400).json({
                errorMessage: 'Mật khẩu ít nhất có độ dài 6 ký tự'
            });
        }

        const existingUser = await Staff.findById(req.user.toString());

        if(!existingUser) {
            return res.status(400).json({
                errorMessage: 'ID Nhân viên không tồn tại. Hãy liên hệ với nhà phát triển hệ thống của chúng tôi'
            });
        }

        if(existingUser.email !== email){
            return res.status(401).json({
                errorMessage: 'Sai thông tin tài khoản hoặc mật khẩu'
            });
        } 
        
        const correctPassword = await bcrypt.compare(password,existingUser.passwordHash);

        if(!correctPassword){
            return res.status(401).json({
                errorMessage: 'Sai thông tin tài khoản hoặc mật khẩu'
            });
        }

        // hash the password

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(newPassword, salt);

        // update the user in the database

        existingUser.passwordHash = passwordHash;

        const savedUser = await existingUser.save();
        
        // create the JWT token

        const token = jwt.sign({
            id: savedUser._id
        }, process.env.JWT_SECRET) // id from mongdb + đuôi password generator

        // tạo jsonwebtoken cho để lấy token cho user

        res.cookie("token", token, { httpOnly: true}).send();      
    }
    catch (err) {
        res.status(500).send();
    }
})

router.put("/reset/password", auth, async (req, res) => {
    try{
        
        const existingUser = await Staff.findById(req.user.toString());

        if(!existingUser) {
            return res.status(400).json({
                errorMessage: 'ID Nhân viên không tồn tại. Hãy liên hệ với nhà phát triển hệ thống của chúng tôi'
            });
        }

        // hash the password

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash("123456", salt);

        // update the user in the database

        existingUser.passwordHash = passwordHash;

        const savedUser = await existingUser.save();
        
        // create the JWT token

        const token = jwt.sign({
            id: savedUser._id
        }, process.env.JWT_SECRET) // id from mongdb + đuôi password generator

        // tạo jsonwebtoken cho để lấy token cho user

        res.cookie("token", token, { httpOnly: true}).send();      
    }
    catch (err) {
        res.status(500).send();
    }
})

module.exports = router;