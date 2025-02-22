const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const { connectToMongoDB } = require("./connect");
const {restrictToLoggedinUserOnly} = require("./middlewares/auth")
const URL = require("./models/url");

const urlRoute = require("./routes/url");
const staticRoute = require("./routes/staticRouter");
const userRoute = require("./routes/user");

const app = express();
const PORT = 8001;

connectToMongoDB('mongodb://localhost:27017/shorturl').then(()=> console.log('mongodb connected'));

app.set("view engine", "ejs");
app.set('views', path.resolve("./views"));


app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

// app.get("/test", async (req, res) => {
//     const allUrls = await URL.find({});
//     return res.render('home',{
//         urls: allUrls,

//     });
// })





app.use("/url",restrictToLoggedinUserOnly, urlRoute);
app.use("/user", userRoute);
app.use("/",staticRoute)
 
app.get('/url/:shortID', async (req,res)=>{
    const shortID = req.params.shortId;
    const entry = await URL.findOneAndUpdate({
        shortID
    },
    {
        $push:{
        visitHistory:{
            timestamp: Date.now(),
        } 
    },});
    res.redirect(entry.redirectURL);
})


app.listen(PORT, ()=>console.log(`Server started at PORT ${PORT}`));