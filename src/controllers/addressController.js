import { myCache } from "../app.js";
import { TryCatch } from "../middlewares/error.js";
import {Address} from "../models/addressModel.js";
import ErrorHandler from "../utils/utility-class.js";



export const myAddresses = TryCatch(async (req, res, next) => {
    const { id: user } = req.query;
  
    const key = `my-addresses-${user}`;
  
    let addresses = [];
  
    // if (myCache.has(key)) addresses = JSON.parse(myCache.get(key));
    // else {
      addresses = await Address.find({ user });
      myCache.set(key, JSON.stringify(addresses));
    // }
    return res.status(200).json({
      success: true,
      addresses,
    });
});

export const allAddresses = TryCatch(async (req, res, next) => {
    const key = `all-addresses`;
  
    let addresses = [];
  
    // if (myCache.has(key)) addresses = JSON.parse(myCache.get(key));
    // else {
        addresses = await Address.find().populate("user", "name");
      myCache.set(key, JSON.stringify(addresses));
    // }
    return res.status(200).json({
      success: true,
      addresses,
    });
});

export const newAddress = TryCatch(
    async (req, res, next) => {
      const {
        address,
        city,
        state,
        country,
        pincode,
        user,
      } = req.body;
  
      if (!address || !city || !state || !country || !pincode || !user)
        return next(new ErrorHandler("Please Enter All Fields", 400));
      
      // Check if an address with the same details already exists
      const existingAddress = await Address.findOne({
        address,
        city,
        state,
        country,
        pincode,
        user,
      });

      if (existingAddress) {
        // If an address already exists, return an error message
        return next(new ErrorHandler("Order Will be Delivered to your Selected Address", 400));
      }
  
      const addressData = await Address.create({
        address,
        city,
        state,
        country,
        pincode,
        user,
      });
  
      return res.status(201).json({
        success: true,
        message: "Address Created Successfully",
      });
    }
);


    export const updateAddress = TryCatch(async (req, res, next) => {
        const { id } = req.params;
        const { address, city, state, country, pincode } = req.body;

        const addressData = await Address.findById(id);

        if (!addressData) return next(new ErrorHandler("Product Not Found", 404));
    
        if (address) addressData.address = address;
        if (city) addressData.city = city;
        if (state) addressData.state = state;
        if (country) addressData.country = country;
        if (pincode) addressData.pincode = pincode;
    
        await addressData.save();
    
        return res.status(200).json({
        success: true,
        message: "Address Updated Successfully",
        });
    });

export const deleteAddress = TryCatch(async (req, res, next) => {
    const { id } = req.params;
    console.log(id)
  
    const address = await Address.findById(id);
    if (!address) return next(new ErrorHandler("Address Not Found", 404));
  
    await address.deleteOne();
  
    return res.status(200).json({
      success: true,
      message: "Address Deleted Successfully",
    });
  });