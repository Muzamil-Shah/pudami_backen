import express from "express";
import expressAsyncHandler from "express-async-handler";
import Order from "../model/orderModel.js";
import { isAuth } from "../utils.js";
const orderRouter = express.Router();

// Admin
orderRouter.put(
  "/update",
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.body.orderId);
    // console.log(order);
    if (order) {
      order.status = req.body.status || order.status;
      order.isPaid = req.body.isPaid || order.isPaid;
      const orderUpdate = await order.save();

      res.send({
        _id: orderUpdate._id,
        status: orderUpdate.status,
        isPaid: orderUpdate.isPaid,
      });
    }
  })
);
orderRouter.get(
  "/admin",
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.find({}).sort({ createAt: "desc" });
    res.send(orders);
  })
);

orderRouter.get(
  "/orders",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    // req.user._id ||
    const order = await Order.find({ user: req.user._id }).sort({
      createAt: "desc",
    });
    res.send(order);
  })
);

orderRouter.post(
  "/",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    // console.log(req.body);
    if (req.body.orderItems.length === 0) {
      res.status(400).send({ message: "Cart is empty" });
    } else {
      const order = new Order({
        orderItems: req.body.orderItems,
        informationAddress: req.body.informationAddress,
        shippingAddress: req.body.shippingAddress,
        paymentMethod: req.body.paymentMethod,
        // itemsPrice: req.body.itemsPrice,
        // taxPrice: req.body.taxPrice,
        // totalPrice: req.body.totalPrice,
        user: req.user._id,
      });
      const createdOrder = await order.save();
      res
        .status(201)
        .send({ message: "New Order Created", order: createdOrder });
    }
  })
);

orderRouter.get(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      res.send(order);
    } else {
      res.status(404).send({ messageT: "order not found" });
    }
  })
);

orderRouter.post(
  "/admin/remove",
  expressAsyncHandler(async (req, res) => {
    console.log(req.body);
    await Order.findByIdAndDelete(req.body._id);
  })
);

export default orderRouter;
