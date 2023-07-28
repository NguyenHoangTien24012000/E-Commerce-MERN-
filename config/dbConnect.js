const {default:mongoose} = require('mongoose');
const dbConnect = ()=>{
    try {
        const connect = mongoose.connect(process.env.URL_MONGODB);
        console.log("Connect DB success");
    } catch (error) {
        console.log("Connect DB error ", error);
    }
}

module.exports = dbConnect;