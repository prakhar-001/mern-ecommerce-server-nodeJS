import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    pincode: {
      type: Number,
      required: true,
    },
    // here we are passing the user id, but this user id is not in the format of mongodb id becaue this id is provided by us or provided by firebase hence we are uysing its type as string and not mongoose.types...
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

export const Address = mongoose.model("Address", schema);
