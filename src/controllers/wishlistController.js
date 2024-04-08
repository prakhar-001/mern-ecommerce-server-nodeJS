import { myCache } from "../app.js";
import { TryCatch } from "../middlewares/error.js";
import {Order} from "../models/orderModel.js"
import {Wishlist} from "../models/wishlistModel.js"
import { invalidateCache, reduceStock } from "../utils/features.js";
import ErrorHandler from "../utils/utility-class.js";


export const myWishlist = TryCatch(async (req, res, next) => {
    const { id: user } = req.query;
    // const page = parseInt(req.query.page) || 1;
    // const size = parseInt(req.query.size) || 10;
    
    // // Calculate the number of documents to skip
    // const skip = size * (page - 1);

    // // Fetch the total number of documents for the user
    // const totalItems = await Wishlist.countDocuments({ user });

    // // Calculate the total number of pages
    // const totalPages = Math.ceil(totalItems / size);

    let wishlist = [];
    wishlist = await Wishlist.find({ user });
    
    return res.status(200).json({
      success: true,
      wishlist,
      // totalItems,
      // totalPages,
      // currentPage: page
    });
});


export const newItemWishlist = TryCatch(
    async (req, res, next) => {
      const {
        wishlistItem,
        user,
      } = req.body;
  
      if (!user || !wishlistItem)
        return next(new ErrorHandler("Please Enter All Fields", 400));

        console.log(wishlistItem)
      let productIdReceived = wishlistItem.productId
      console.log(productIdReceived)

      // Construct the query to find an existing item with the same product details
      const query = {
        user,
        'wishlistItem.name': wishlistItem.name,
        'wishlistItem.description': wishlistItem.description,
        'wishlistItem.price': wishlistItem.price,
        'wishlistItem.photo': wishlistItem.photo,
        'wishlistItem.stock': wishlistItem.stock,
        'wishlistItem.productId': wishlistItem.productId
      };

      // Check if the product already exists in the wishlist
      const existingItem = await Wishlist.findOne(query);

      if (existingItem) {
        // If the product is already in the wishlist, return a message
        return res.status(400).json({
          success: false,
          message: "Product is already in your wishlist",
        });
      }
      // If the product is not in the wishlist, create a new entry
      const wishlist = await Wishlist.create({
        wishlistItem,
        user,
      });
  
      return res.status(201).json({
        success: true,
        message: "Item Added to your Wishlist",
      });
    }
);

export const deleteItemFromWishlist = TryCatch(async (req, res, next) => {
    const { id } = req.params;
  
    const wishlistItem = await Wishlist.findById(id);
    if (!wishlistItem) return next(new ErrorHandler("Item Not Found", 404));
  
    await wishlistItem.deleteOne();
  
    return res.status(200).json({
      success: true,
      message: "Item Removed Successfully",
    });
  });