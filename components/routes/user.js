const express = require("express");
const bcrypt = require("bcryptjs");
const userModel = require("../modals/usermodal");
const { CheckExistingUser, generatePasswordHash } = require("../utility");
const asyncHandler = require("express-async-handler");
const router = express.Router();
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
    const { name, email, phone, password, address, district, state, pincode } = req.body;

    if (await CheckExistingUser(email)) {
        res.status(400).send("Email exists.Please Try with different Email-Id");
    }
    else if (phone.length != 10) {
        res.status(402).send("Phone Number must Contains 10 Digits");
    }
    else if (password.length < 6) {
        res.status(402).send("Password must contains minimum 6 Characters")
    }
    else if (await CheckExistingUser(phone)) {
        res.status(401).send("Phone number exists.Please try with different Phone Number");
    }
    else if (!(email.includes("@"))) {
        res.status(403).send("Invalid Email-id");
    }
    else {
        const passwordHash = await generatePasswordHash(password);
        const user = await userModel.create({
            name, email, phone, password:passwordHash, address, district, state, pincode
        });
        try {
            if (user) {
                res.status(200).send(user);
            }
        } catch (error) {
            res.status(400).send(error);
        }
        
    }

});  

router.post("/login", asyncHandler(async (req, res) => {
    const { email, phone ,password} = req.body;
    const userData = await userModel.find({ $or: [{ email: email }, { phone: phone }] });
    try {
        if (userData.length) {
            const value = await bcrypt.compare(password, userData[0].password);
            if (value) {
                const authToken =  jwt.sign(userData[0].email, process.env.SECRET_KEY);
                let username = userData[0].name;
                res.status(200).send({ authToken, username });
            }
            else {
                res.status(401).send("Invalid Password");
            }
        }
        else {
            res.status(401).send("Unauthorized User");
        }
    } catch (error) {
        res.status(403).send(error);
    }
}));

module.exports = router;
