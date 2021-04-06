const express = require('express');
const dotenv = require('dotenv');
dotenv.config()
require("./Models/database");
// const cors = require("cors");
const { userRoutes } = require('./routes/routes');
const { formatResult } = require('./utilis/imports');
const app = express()
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json);
const port = process.env.PORT || 8000;
app.use("/api/users",userRoutes)
app.use("/",(req,res)=>{
    res.send(formatResult({
        status:200,
        message:"Welcome to our page"
    }))
})

app.listen(port, () => console.log(`Listening on port ${port} ....`))