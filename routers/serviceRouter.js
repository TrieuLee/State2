const router = require("express").Router();
const Service = require("../models/serviceModel");
const auth = require("../middleware/auth");

router.get("/",auth, async (req,res) => {
    try{
        const service = await Service.find();
        res.json(service);
    }
    catch(err){
        res.status(500).send();
    }
})

router.post("/",auth, async (req, res) => {
    try{
        const {name,price} = req.body;
    
        // Validate
        //1- Điển đủ thông tin 
        if(name===undefined||price===undefined) {
            return res.status(400).json({errorMessage: 'Bạn phải điền đầy đủ các thông tin!'})
        }

        // 2- Số vs floor phải khác nhau
   
        const newService = new Service({
            name,price
        });
    
        const saveService = await newService.save();
    
        res.json(saveService);
    }
    catch(err){
        res.status(500).send(err);
    }
})

router.put("/:id",auth, async (req,res) => {
    try{

        const {name, price} = req.body;
        console.log(name,price);
        const serviceID = req.params.id;

        //validation

        if(name===undefined||price===undefined) {
            return res.status(400).json({errorMessage: 'Bạn phải điền đầy đủ các thông tin!'})
        }
        
        if(!serviceID) 
            return res.status(400).json({errorMessage:"ID dịch vụ không tồn tại. Hãy liên hệ với nhà phát triển hệ thống của chúng tôi"});
            
        const originalService = await Service.findById(serviceID);
        
        if(!originalService) 
            return res.status(400).json({errorMessage:"ID dịch vụ không tồn tại. Hãy liên hệ với nhà phát triển hệ thống của chúng tôi"});

        originalService.name = name;
        originalService.price = price;
        const savedService = await originalService.save();

        res.json(savedService);
    }
    catch(err){
        res.status(500).send(err);
    }
})

router.delete("/:id",auth, async (req, res) =>{
    try{
        const serviceID = req.params.id;
        //validation
        
        if(!serviceID) 
            return res.status(400).json({errorMessage:"ID dịch vụ không tồn tại. Hãy liên hệ với nhà phát triển hệ thống của chúng tôi"});
        
            const existingService = await Service.findById(serviceID);

        if(!existingService) 
            return res.status(400).json({errorMessage:"ID dịch vụ không tồn tại. Hãy liên hệ với nhà phát triển hệ thống của chúng tôi"});

            
        await existingService.delete();
        res.json(existingService);
    }
    catch(err){
        res.status(500).send();
    }
})

module.exports = router;