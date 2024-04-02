const User = require("../model/userModel");
const bcrypt = require("bcryptjs");

module.exports.register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        // Check for existing username
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ error: "Username already exists" });
        }
        // Check for existing email
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ error: "Email already exists" });
        }
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create new user
        const user = await User.create({
            username,
            email,
            password: hashedPassword
        });
        // Return success response
        return res.status(201).json({ user });
    } catch (error) {
        next(error);
    }
};

module.exports.login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        // Find user by username
        const user = await User.findOne({ username });
        console.log(4);
        if (!user) {
            console.log(1);
            return res.status(401).json({ error: "Invalid credentials" });
        }
        // Check password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            console.log(3);
            return res.status(401).json({ error: "Invalid credentials" });
        }
        // Return success response
        return res.status(200).json({ user });
    } catch (error) {
        console.log(2);
        next(error);
    }
};

module.exports.setAvatar = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const avatarImage = req.body.image;
        // Update user with avatar image
        const updatedUser = await User.findByIdAndUpdate(userId, {
            isAvatarImageSet: true,
            avatarImage
        }, { new: true });
        // Return success response
        return res.json({ 
           isSet : updatedUser.isAvatarImageSet,
           image: updatedUser.avatarImage,
         });
    } catch (ex) {
        next(ex);
    }
};

module.exports.getAllUsers= async (req, res, next) => {
    try {
        const users = await User.find({ _id: { $ne: req.params.id} }).select([
            "email",
            "username",
            "avatarImage",
            "_id",
        ]);
        return res.json(users);
    }catch(ex){
        next(ex);
    }
};

module.exports.logOut = (req, res, next) => {
    try {
      if (!req.params.id) return res.json({ msg: "User id is required " });
      onlineUsers.delete(req.params.id);
      return res.status(200).send();
    } catch (ex) {
      next(ex);
    }
  };