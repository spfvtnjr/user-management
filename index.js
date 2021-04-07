require("./Models/database");
const dotenv = require('dotenv');
dotenv.config()
const { formatResult } = require('./utilis/imports');
const express = require('express');
const app = express()
const bodyParser = require('body-parser');
const { userRoutes } = require("./routes/routes");
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json());
const port = process.env.PORT || 8000;
app.use('/api/users',userRoutes)
app.use("/",(req,res)=>{
    res.send(formatResult({
        status:200,
        message:"Welcome to our page"
    }))
})

app.listen(port, () => console.log(`Listening on port ${port} ....`))

