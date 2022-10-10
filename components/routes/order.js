const express = require("express");
const orderModel = require("../modals/ordermodal");
const userModel = require("../modals/usermodal");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");


const router = express.Router();


router.post("/create", asyncHandler(async (req, res) => {
    const authorize = req.headers.authorization;
    const { orderid, producttype, datetime, subtotal } = req.body;
    if(authorize) {
        try {
            let sum=parseInt(0)
            for(let i=0;i<req.body.producttype.length;i++){
                sum+=req.body.producttype[i].count
            }
            const email = jwt.verify(authorize, process.env.SECRET_KEY);
            userModel.find({email:email}).then((data)=>{
                orderModel.create({email:data[0].email,orderid:orderid,producttype:producttype,items:sum,datetime:datetime,subtotal:subtotal})
                .then((data)=>{
                    res.status(200).json({ "successfully order created": data });
                }).catch((err)=>{
                    console.log(err)
                })
            })
        } catch(err) {
            res.status(403).send("User Not Authorized")
        }
    } else {
        res.status(400).send("Missing Authorization token")
    }
}));


router.get("/history", asyncHandler(async (req, res) => {
    const authorize = req.headers.authorization;
    if (authorize) {
        try {
            const email = jwt.verify(authorize, process.env.SECRET_KEY);
            const orders = await orderModel.findOne({ email: email });
            if (!orders) {
                res.status(403).send("User Not Authorized");
            } else {
                res.status(200).send(orders);
            }

        } catch (error) {
            
        }
    } else {
        res.status(400).send("Missing Authorization Token");
    }
}));

router.delete("/cancel/:id", asyncHandler(async (req, res) => {
    const id = req.params.id;
    const cancelledOrder = await orderModel.deleteOne({ _id: id });
    if (!cancelledOrder) {
        res.status(401).send("Cannot Cancel Order");
    }
    res.status(200).send({ "order Cancelled Successfully": cancelledOrder });
}));

module.exports = router;