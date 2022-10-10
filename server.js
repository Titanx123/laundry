const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer")();
const bodyParser = require( "body-parser");
const userController = require("./components/routes/user.js");
const orderController = require("./components/routes/order");

const app = express();

app.use(cors());
dotenv.config();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(multer.array());



const port = process.env.PORT;

app.listen(port, () => {
    console.log(`server started @ : ${port}`);
});


mongoose.connect(process.env.DATABASE, () => {
    console.log(`Connected to ${process.env.DATABASE}`)
});

app.get("/", (req, res) => {
    res.send("Backend works");
});

app.use("/user", userController);
app.use("/order", orderController);