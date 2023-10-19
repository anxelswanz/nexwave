const User = require("../model/userModel");
const bcrypt = require("bcrypt")

module.exports.register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const usernameCheck = await User.findOne({ username });
        if (usernameCheck) {
            return res.json({ msg: "Username is already used", status: false });
        }
        const emailCheck = await User.findOne({ email });
        if (emailCheck) {
            return res.json({ msg: "Email is already used", status: false });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('log', username + " " + email);
        const user = await User.create({
            email,
            username,
            password: hashedPassword,
        });
        delete user.password;
        return res.json({ status: true, user });
    } catch (e) {
        next(e);
    }
}

module.exports.login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user)
            return res.json({ msg: 'Incorrect username or password', status: false });
        const isPasswordValied = await bcrypt.compare(password, user.password);
        if (!isPasswordValied) {
            return res.json({ msg: 'Incorrect username or password', status: false });
        }
        delete user.password;
        return res.json({ status: true, user });
    } catch (e) {
        next(e);
    }
}


module.exports.setAvatar = async (req, res, next) => {
    console.log('enter setAvatar', req.body);
    try {
        const userId = req.params.id;
        const avatarImage = req.body.image;
        console.log('userid =>', userId);
        const userData1 = await User.findByIdAndUpdate(userId, {
            isAvatarImageSet: true,
            avatarImage: avatarImage,
        }, {
            new: true
        });

        return res.json({ isSet: userData1.isAvatarImageSet, image: userData1.avatarImage });
    } catch (e) {
        next(e);
    }
}

module.exports.getAllUsers = async (req, res, next) => {

    try {
        const users = await User.find({ _id: { $ne: req.params.id } }).select(
            [
                "email",
                "username",
                "avatarImage",
                "_id",
            ]
        );
        return res.json(users);
    } catch (e) {
        next(e);
    }
}