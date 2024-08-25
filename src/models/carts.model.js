import mongoose from "mongoose";

const cartsCollection = "carts";

const cartsSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  products: {
    type: [
      {
        product: {
          type: Number,
          ref: "products",
        },
        quantity: { type: Number },
      },
    ],
    default: [],
  },
});

const cartsModel = mongoose.model(cartsCollection, cartsSchema);

export default cartsModel;

