const express = require("express");
const router = express.Router();
const { register, login, setAvatar,getAllUsers,logOut } = require("../controllers/userController");
const userModel = require("../model/userModel");


router.post("/register", register);
router.post("/login", login);
router.post("/setAvatar/:id", setAvatar); // Assuming setAvatar is the route handler function
router.get("/allusers/:id", getAllUsers); // Using getAllUsers route handler function
router.get("/logout/:id", logOut);
module.exports = router;
