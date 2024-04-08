import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {

    wishlistItem:
      {
        name: String,
        description: String,
        photo: String,
        price: Number,
        stock: Number,
        productId: {
          type: mongoose.Types.ObjectId,
          ref: "Product",
        },
      },

    // productId: {
    //     type: mongoose.Types.ObjectId,
    //     ref: "Product",
    // },
    // here we are passing the user id, but this user id is not in the format of mongodb id becaue this id is provided by us or provided by firebase hence we are using its type as string and not mongoose.types...
    user: {
        type: String,
        ref: "User",
        required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Wishlist = mongoose.model("Wishlist", schema);
