const userService = require('../services/userService');

exports.createUser = async(req,res) => {
    try{

        const userData = req.body;
        const userresponse = await userService.createUser(userData);
        res.status(200).json({
            message: "User registered succesfully",
            user: userresponse
        })
    } catch(error){
        res.status(500).json({
            error: error.message
        })
    }
}
