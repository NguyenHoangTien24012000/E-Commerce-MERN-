const { generateToken } = require("../config/jwtToken");
const User = require("../models/userModel");
const asyncHandler = require('express-async-handler')
const createUser = asyncHandler(async (req, res) => {
    const {email, mobile} = req.body;
    const findUser = await User.findOne({email,mobile});
    console.log("Find user: ", findUser);
    if(!findUser){
        //Create a new user
        const newUser = await User.create(req.body);
        res.json(newUser);
    }else{
        throw new Error("User Already Exits!");
    }
});

const loginUser = asyncHandler(async (req, res) =>{
    const {email, password} = req.body;
    const findUser = await User.findOne({email});
    if(findUser){
        const matchedPassword = await findUser.isPasswordMatched(password);
        if(matchedPassword){
            console.log("Login success!!");
            res.json({
                _id : findUser?._id,
                firstname : findUser?.firstname,
                lastname : findUser?.lastname, 
                email : findUser?.email,
                mobile: findUser?.mobile,
                token: generateToken(findUser?._id)
            });
        }else{
            throw new Error("Password invalid!!")
        }
    }else{
        throw new Error("Email invalid!!")
    }
})

const getAllUser = asyncHandler(async (req, res)=>{
    try{
        const getUsers = await User.find();
        res.json(getUsers);
    }catch(error){
        throw new Error(error);
    }
})

const getUserById = asyncHandler(async (req, res) =>{
    try{
        const {_id} = req.user;
        const user = await User.findById({_id}); 
        res.json(user); 
    }catch(error){
        throw new Error(error);
    }
})

const updateUserByAdmin = asyncHandler(async (req, res) =>{
    try{
        const {_id} = req.params;
        const {firstname, lastname, email, mobile, password} = req.body;
        const updateUser = await User.findByIdAndUpdate(_id,{
            firstname : firstname,
            lastname : lastname,
            email : email,
            mobile : mobile,
            password : password
        }, {
            new : true,
        });
        res.json(updateUser);

    }catch(error){
        throw new Error(error);
    }
})

const updateInfo = asyncHandler(async (req, res) =>{
    try{
        const {_id} = req.user;
        const {firstname, lastname, email, mobile, oldPassword, newPassword} = req.body;
        const findUser = await User.findOne({_id})
        if(findUser){
            const matchedPassword = await findUser.isPasswordMatched(oldPassword);
            if(!matchedPassword){
                throw new Error("Password old invalid!!")
            }
        }
        const updateUser = await User.findByIdAndUpdate(_id,{
            firstname : firstname,
            lastname : lastname,
            email : email,
            mobile : mobile,
            password : newPassword
        }, {
            new : true,
        });
        res.json(updateUser);

    }catch(error){
        throw new Error(error);
    }
})

const deleteUserById = asyncHandler(async (req, res) =>{
    try{
        const {_id} = req.params;
        const userDeleted = await User.findByIdAndDelete({_id});
        res.json(userDeleted);
    }catch(error){
        throw new Error(error);
    }
})

const blockUser = asyncHandler(async function(req,res){
    try {
        const {_id} = req.params;
        const findUser = await User.findOne({_id});
        if(findUser){
            if(findUser.isBlocked){
                throw new Error("User was blocked!!");
            }else{
                const userBlock = await User.findByIdAndUpdate(_id,{
                    isBlocked : true
                })
                res.json({
                    message : "Block success!!"
                });
            }
        }else{
            throw new Error("User not found");
        }
    } catch (error) {
        throw new Error(error);
    }
})

const unblockUser = asyncHandler(async function(req, res){
    try {
        const {_id} = req.params;
        const findUser = await User.findOne({_id});
        if(findUser){
            if(!findUser.isBlocked){
                throw new Error("User was unblocked!!");
            }else{
                const userBlock = await User.findByIdAndUpdate(_id,{
                    isBlocked : false
                })
                res.json({
                    message: "Unblock success!"
                });
            }
        }else{
            throw new Error("User not found");
        }
    } catch (error) {
        throw new Error(error);
    }
})

// const update

module.exports = {
    createUser,
    loginUser,
    getAllUser,
    getUserById,
    deleteUserById,
    updateUserByAdmin,
    updateInfo,
    blockUser,
    unblockUser
}