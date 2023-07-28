const mongoose = require('mongoose'); // Erase if already required
const bcrypt = require('bcrypt');
// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true,
    },
    lastname:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    mobile:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    isBlocked:{
        type: Boolean,
        default: false,
    },
    role:{
        type : String, 
        default : "user"
    },
    cart:{
        type: Array, 
        default: [],
    }, 
    address:[{type: mongoose.Schema.Types.ObjectId, ref: "Address"}],
    wishList:[{type: mongoose.Schema.Types.ObjectId, ref: "Product"}],
},{
    timestamps:true
});

userSchema.pre("save", async function(next){
    const salt = await bcrypt.genSaltSync(10);
    this.password = await bcrypt.hash(this.password, salt);
    console.log("password ", this.password);
});
userSchema.pre(["updateOne", "findByIdAndUpdate", "findOneAndUpdate"], async function (next) {
    const data = this.getUpdate();
    const salt = await bcrypt.genSaltSync(10);
    if (data.password) {
        data.password = await bcrypt.hash(data.password, salt);
    }
    next()

});
userSchema.methods.isPasswordMatched = async function (enterPassword){
    return await bcrypt.compare(enterPassword, this.password);
}

//Export the model
module.exports = mongoose.model('User', userSchema);