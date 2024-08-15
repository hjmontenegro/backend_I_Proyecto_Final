import mongoose from "mongoose";
//import mongoosePaginate from "mongoose-paginate-v2";

const productCollection = "products";

const productSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  code: { type: String, required: true },
  price: { type: Number, required: true },
  status: { type: Boolean, required: true },
  stock: { type: Number, required: true },
  category: { type: String, required: true },
  thumbnail: String,
});

//productsSchema.plugin(mongoosePaginate);
const productModel = mongoose.model(productCollection, productSchema);

//module.exports = {productModel};
export default productModel;