import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import productRouter from "./routers/productRouter.js";
import userRouter from "./routers/userRouter.js";
import orderRouter from "./routers/orderRouter.js";
import Order from "./model/orderModel.js";
import paymentRouter from "./routers/paymentRouter.js";
import Razorpay from "razorpay";
import shortid from "shortid";
import crypto from "crypto";

//env config
dotenv.config();

const app = express();
const PORT = process.env.PORT || "4000";

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

mongoose.connect(process.env.MONGODB_URL || "mongodb://localhost/pudamifresh", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

app.use("/api", productRouter);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);
app.use("/api/payment", paymentRouter);

app.get("/", (req, res) => {
  res.status(200).send("hellooo pudami fresh");
});

// app.post("/razorpay", async (req, res) => {
//   const instance = new Razorpay({
//     key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_aH1LU7eVK1YOb0",
//     key_secret: process.env.RAZORPAY_SECRET || "tr10venim63pFJmsofLINZFd",
//   });

//   const amount = 499;
//   const currency = "INR";

//   const options = {
//     amount: (amount * 100), // amount in smallest currency unit
//     currency: currency,
//     receipt: shortid.generate(),
//     payment_capture: 1,
//   };

//   try {
//     const order = await instance.orders.create(options);

//     console.log(order);
//     res.json({
//       id: order.id,
//       currency: order.currency,
//       amount: order.amount,

//     });
//     if (!order) return res.status(500).send("Some error occured");

//     // res.json(order);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

app.post("/razorpay", async (req, res) => {
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_aH1LU7eVK1YOb0",
      key_secret: process.env.RAZORPAY_SECRET || "tr10venim63pFJmsofLINZFd",
    });

    const options = {
      amount: 300 * 1000, // amount in smallest currency unit
      currency: "INR",
      receipt: shortid.generate(),
    };

    const order = await instance.orders.create(options);

    console.log(order);

    if (!order) return res.status(500).send("Some error occured");

    res.json(order);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post("/success", async (req, res) => {
  try {
    // getting the details back from our font-end
    console.log(req.body);
    const {
      orderCreationId,
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
    } = req.body;

    // Creating our own digest
    // The format should be like this:
    digest = hmac_sha256(orderCreationId + "|" + razorpayPaymentId, secret);
    const shasum = crypto.createHmac("sha256", "w2lBtgmeuDUfnJVp43UpcaiT");

    shasum.update(`${orderCreationId}|${razorpayPaymentId}`);

    const digest = shasum.digest("hex");

    // comaparing our digest with the actual signature
    if (digest !== razorpaySignature)
      return res.status(400).json({ msg: "Transaction not legit!" });

    // THE PAYMENT IS LEGIT & VERIFIED
    // YOU CAN SAVE THE DETAILS IN YOUR DATABASE IF YOU WANT

    res.json({
      msg: "success",
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId,
    });
    // generated_signature = hmac_sha256(
    //   orderCreationId + "|" + razorpayPaymentId,
    //   secret
    // );
    // if (generated_signature == razorpaySignature) {
    //   res.json({
    //     msg: "success",
    //     orderId: razorpayOrderId,
    //     paymentId: razorpayPaymentId,
    //   });
    // }
  } catch (error) {
    res.status(500).send(error);
  }
});

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

app.listen(PORT, (req, res) => {
  console.log(`sever started in port : ${PORT}`);
});
