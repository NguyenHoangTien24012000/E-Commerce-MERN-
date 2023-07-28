const express = require("express");
const app = express();
const dotenv = require('dotenv').config();
const PORT = process.env.PORT || 4000;
const connectDB = require("./config/dbConnect");
const bodyParser = require('body-parser');
const authRoute = require('./routes/userRoute');
const {errorHandler, notFound} = require('./middlewares/errorHandler');
connectDB();

// ----------------------------------------------------------------------
//add framework
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));
// ----------------------------------------------------------------------
//add 
//router user
app.use('/api/user', authRoute);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, ()=>{
    console.log(`Server is running PORT ${PORT}`)
})