import moongose from "mongoose";

const orderSchema = new moongose.Schema({
  userName: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  userAddress: {
    type: String,
    required: true,
  },
  userPhone: {
    type: String,
    required: true,
  },
  products: [
    {
      product: {
        type: moongose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
    },
  ],
});
export default moongose.models.Order || moongose.model("Order", orderSchema);
