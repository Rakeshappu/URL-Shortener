const express = require('express');
const { connectToMongoDB } = require("./connect");
const urlRoute = require("./routes/url")
const URL = require("./models/url");


const app = express();
const PORT = 8001;

connectToMongoDB('mongodb://localhost:27017/short-url').then(()=> console.log('mongodb connected'));

app.use(express.json());

app.use("/use", urlRoute);
 
app.get('/:shortID', async (req,res)=>{
    const shortID = req.params.shortId;
    const entry = await URL.findOneAndUpdate({
        shortID
    },{$push:{
        visitHistory:{
            timestamp: Date.now(),
        } 
    },});
    res.redirect(entry.redirectURL);
})


app.listen(PORT, ()=>console.log(`Server started at PORT ${PORT}`));