const express = require("express");
const { ProductModel } = require("../models/product.model");
require('dotenv').config();
const productRouter = express.Router();

// new product registration thing are working here
productRouter.post("/add", async (req, res) => {
    try {
        // console.log(req.body.product);
        let prod = await ProductModel.insertMany([req.body]);
        console.log(prod);
        res.send({ msg: `New Product: ${req.body.title} is Added.` })
    } catch (error) {
        res.send({ err: error.message })
    }
});

// Product Update Routes Admin
productRouter.patch("/update/:id", async (req, res) => {
    const { id } = req.params;
    await ProductModel.findByIdAndUpdate({ _id: id }, req.body);
    res.send({ msg: `Product: ${req.body.title} is updated.` })
});

// Product Delete Route for admin
productRouter.delete("/delete/:id", async (req, res) => {
    const { id } = req.params;
    try {
        let product = await ProductModel.findById(id);
        await ProductModel.findByIdAndDelete(id);
        res.send({ msg: `Product: ${product.title} is deleted.` })
    } catch (error) {
        res.send({ err: error.message })
    }
});

module.exports = {productRouter}