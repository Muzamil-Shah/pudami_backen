import expressAsyncHandler from "express-async-handler";
import Product from "../model/productsModel.js";

// export const getProduct = expressAsyncHandler(async (req, res) => {
//   const products = await Product.find({});
//   console.log(products);
//   res.send(products);
// });

export const createProduct = expressAsyncHandler(async (req, res) => {
  const post = req.body;
  const newPost = new Product(post);

  const createProduct = await newPost.save();

  res.status(201).send({ Product: createProduct });
});
