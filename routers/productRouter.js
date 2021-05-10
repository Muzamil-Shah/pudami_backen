import express from "express";
import expressAsyncHandler from "express-async-handler";
import Product from "../model/productsModel.js";
import data from "../data.js";
import { isAdmin, isAuth } from "../utils.js";
import { createProduct } from "../controllers/productController.js";
// import { getProduct } from "../controllers/productController.js";

const productRouter = express.Router();

// productRouter.get(
//   "/seed",
//   expressAsyncHandler(async (req, res) => {
//     await Product.remove({});
//     const createProducts = await Product.insertMany(data.products);
//     res.send({ createProducts });
//   })
// );

productRouter.get(
  "/",
  expressAsyncHandler(async (req, res) => {
    const products = await Product.find({});
    res.send(products);
  })
);

productRouter.get(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.send(product);
    } else {
      res.status(404).send("product is not exist");
    }
  })
);

//admin
productRouter.post("/", isAuth, createProduct);

productRouter.put(
  "/update",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.body.productId);
    // console.log("afdgadsfg", product);

    if (product) {
      product.image = req.body.image || product.image;
      product.name = req.body.name || product.name;
      product.price = req.body.price || product.price;
      product.orderLimit = req.body.orderLimit || product.orderLimit;
      product.status = req.body.status || product.status;

      const updateProduct = await product.save();

      res.send({
        _id: updateProduct._id,
        image: updateProduct.image,
        name: updateProduct.name,
        price: updateProduct.price,
        orderLimit: updateProduct.orderLimit,
        status: updateProduct.status,
      });
    }
  })
);

productRouter.post(
  "/admin/remove",
  expressAsyncHandler(async (req, res) => {
    await Product.findByIdAndDelete(req.body._id);
  })
);

export default productRouter;
