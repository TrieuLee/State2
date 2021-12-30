const router = require("express").Router();
const Guest = require("../models/customerModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require('../middleware/auth');

router.get("/", async (req,res) => {
    try{
        const staff = await Guest.find();
        res.json(staff);
    }
    catch(err){
        res.status(500).send();
    }
})

router.post("/", async (req, res) => {
    try{
        const {name,phoneNumber,email,address,IDCard, password,passwordVerify} = req.body;
        
        // Validation

        if(!name||!phoneNumber||!email||!address||!IDCard||!password||!passwordVerify) {
            return res.status(400).json({errorMessage: 'Bạn phải điền đầy đủ các thông tin!'})
        }

        if(password.length <6){
            return res.status(400).json({errorMessage: 'Mật khẩu ít nhất là 6 ký tự!'})
        }

        if(password !==passwordVerify){
            return res.status(400).json({errorMessage: 'Mật khẩu xác thực không trùng khớp!'});
        }
        const existingUser = await Guest.findOne({email})
        if(existingUser){
            return res.status(400).json({
                errorMessage: 'Email đã được sử dụng. Hãy dùng email khác!'
            })  
        }

        //hashPassword
        
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);
        
        const newGuest = new Guest({
            name,phoneNumber,email,address,IDCard,passwordHash
        });
    
        const saveGuest = await newGuest.save();

        // create a JWT token

        const token = jwt.sign({
            id: saveGuest._id
        }, process.env.JWT_SECRET) // id from mongdb + đuôi password generator

        // tạo jsonwebtoken cho để lấy token cho user

        res.cookie("token", token, { httpOnly: true}).send();
    
        res.json(saveGuest);
    }
    catch(err){
        res.status(500).send();
    }
})

router.put("/:id", async (req,res) => {
    try{
        const {name,phoneNumber,address,IDCard} = req.body;
        const guestID = req.params.id;

        //validation

        if(!name||!phoneNumber||!address||!IDCard) {
            return res.status(400).json({errorMessage: 'Bạn phải điền đầy đủ các thông tin!'})
        }
        
        if(!guestID) 
            return res.status(400).json({errorMessage:"Mã Nhân viên không xác định. Hãy liên hệ với nhà phát triển hệ thống của chúng tôi"});

        const originalGuest = await Guest.findById(guestID);
        
        if(!originalGuest) 
            return res.status(400).json({errorMessage:"Không timf thấy ID này. Hãy liên hệ với nhà phát triển hệ thống của chúng tôi"});

        originalGuest.name = name;
        originalGuest.phoneNumber = phoneNumber;
        originalGuest.address = address;
        originalGuest.IDCard = IDCard;
        
        const savedGuest = await originalGuest.save();

        res.json(savedGuest);
    }
    catch(err){
        res.status(500).send();
    }
})

router.delete("/:id", async (req, res) =>{
    try{
        const guestID = req.params.id;
        //validation
        
        if(!guestID) 
            return res.status(400).json({errorMessage:"Mã khách hàng không xác định. Hãy liên hệ với nhà phát triển hệ thống của chúng tôi"});
        
            const existingGuest = await Guest.findById(guestID);

        if(!existingGuest) 
            return res.status(400).json({errorMessage:"Không tìm thấy ID khách hàng. Hãy liên hệ với nhà phát triển hệ thống của chúng tôi"});

        await existingGuest.delete();
        res.json(existingGuest);
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

        const existingUser = await Guest.findOne({email})
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

        const user = await Guest.findById(validatedUser.id);

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

        const existingUser = await Guest.findById(req.user.toString());

        if(!existingUser) {
            return res.status(400).json({
                errorMessage: 'Không tìm thấy ID Khách Hàng. Hãy liên hệ với nhà phát triển hệ thống của chúng tôi'
            });
        }

        if(existingUser.email !== email){
            return res.status(401).json({
                errorMessage: 'Sai tài khoản hoặc mật khẩu'
            });
        } 
        
        const correctPassword = await bcrypt.compare(password,existingUser.passwordHash);

        if(!correctPassword){
            return res.status(401).json({
                errorMessage: 'Sai tài khoản hoặc mật khẩu'
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
        
        const existingUser = await Guest.findById(req.user.toString());

        if(!existingUser) {
            return res.status(400).json({
                errorMessage: 'Không tìm thấy ID Khách Hàng. Hãy liên hệ với nhà phát triển hệ thống của chúng tôi'
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