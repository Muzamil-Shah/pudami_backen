import express from "express";
import data from "../data.js";
import User from "../model/userModel.js";
import bcrypt from "bcryptjs";
import expressAsyncHandler from "express-async-handler";
import { generateToken, isAdmin, isAuth } from "../utils.js";

const userRouter = express.Router();

// userRouter.get(
//   "/seed",
//   expressAsyncHandler(async (req, res) => {
//     // await User.remove();
//     const createUsers = await User.insertMany(data.users);

//     res.send({ createUsers });
//   })
// );

userRouter.post(
  "/signin",
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          token: generateToken(user),
          profile: {
            firstname: user.profile.firstname,
            lastname: user.profile.lastname,
            img: user.profile.img,
          },
        });
        return;
      }
    }
    res.status(401).send({ message: "Invalid email or password" });
  })
);

userRouter.post(
  "/register",
  expressAsyncHandler(async (req, res) => {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      profile: {
        img: "",
        firstname: "",
        lastname: "",
        gender: "",
        phone: "",
        business: "",
        shopCode: "",
      },
    });

    const createUser = await user.save();

    res.send({
      _id: createUser._id,
      name: createUser.name,
      email: createUser.email,
      isAdmin: createUser.isAdmin,
      token: generateToken(createUser),
      profile: {
        firstname: createUser.profile.firstname,
        lastname: createUser.profile.lastname,
        gender: createUser.profile.gender,
        phone: createUser.profile.phone,
        business: createUser.profile.business,
        shopCode: createUser.profile.licencecreateUser,
      },
    });
  })
);

userRouter.get(
  "/all",
  expressAsyncHandler(async (req, res) => {
    const users = await User.find({});
    res.send(users);
  })
);

userRouter.get(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      res.send(user);
    } else {
      res.status(404).send({ message: "User Not Found" });
    }
  })
);

userRouter.put(
  "/profile",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.body.userId || req.user._id);
    if (user) {
      user.profile.img = req.body.img || user.profile.img;
      user.profile.firstname = req.body.firstname || user.profile.firstname;
      user.profile.lastname = req.body.lastname || user.profile.lastname;
      user.profile.gender = req.body.gender || user.profile.gender;
      user.profile.phone = req.body.phone || user.profile.phone;
      user.profile.business = req.body.business || user.profile.business;
      user.profile.shopCode = req.body.shopCode || user.profile.shopCode;
      user.profile.stats = req.body.stats || user.profile.stats;
      user.profile.disable = req.body.disable || user.profile.disable;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        user.password = bcrypt.hashSync(req.body.password, 8);
      }

      const updateUser = await user.save();
      res.send({
        _id: updateUser._id,
        profile: {
          img: updateUser.profile.img,
          firstname: updateUser.profile.firstname,
          lastname: updateUser.profile.lastname,
          gender: updateUser.profile.gender,
          phone: updateUser.profile.phone,
          business: updateUser.profile.business,
          shopCode: updateUser.profile.shopCode,
          stats: updateUser.profile.stats,
          disable: updateUser.profile.disable,
        },
        email: updateUser.email,
        isAdmin: updateUser.isAdmin,
        token: generateToken(updateUser),
      });
    }
  })
);

userRouter.post(
  "/admin/remove",
  expressAsyncHandler(async (req, res) => {
    // console.log(req.body);
    await User.findByIdAndDelete(req.body._id);
    res.send("delete successfuly");
  })
);

export default userRouter;
