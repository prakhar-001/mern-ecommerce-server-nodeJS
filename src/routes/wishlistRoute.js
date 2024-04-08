import express from "express";
import {deleteItemFromWishlist, myWishlist, newItemWishlist} from "../controllers/wishlistController.js"

const app = express.Router();

// route - /api/v1/order/new
app.post("/new", newItemWishlist);

// route - /api/v1/order/my
app.get("/my", myWishlist);

// route - /api/v1/order/my
// app.get("/all", adminOnly, allOrders);

app
  .route("/:id")
//   .get(getSingleOrder)
//   .put(adminOnly, processOrder)
  .delete(deleteItemFromWishlist);

export default app;
