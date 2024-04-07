import express from "express";
import { adminOnly } from "../middlewares/auth.js";
import { newAddress, myAddresses, allAddresses, deleteAddress, updateAddress} from "../controllers/addressController.js";
import { singleUpload } from "../middlewares/multer.js";


const app = express.Router();

// route - /api/v1/order/new
app.post("/new", newAddress);

// route - /api/v1/order/my
app.get("/my", myAddresses);

// // route - /api/v1/order/my
app.get("/all", adminOnly, allAddresses);

app
  .route("/:id")
//   .get(getSingleOrder)
  .put(singleUpload, updateAddress)
  .delete(deleteAddress);

export default app;
