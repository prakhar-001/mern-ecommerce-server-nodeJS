import express from "express"
import { errorMiddleware } from "./middlewares/error.js";
import { connectDB } from "./utils/features.js";
import NodeCache from "node-cache"
import {config} from "dotenv"
import morgan from "morgan"
import Stripe from "stripe";
import cors from "cors"
 


// Routes
import userRoute from "./routes/userRoute.js"
import productRoute from "./routes/productRoute.js"
import orderRoute from "./routes/orderRoute.js"
import wishlistRoute from "./routes/wishlistRoute.js"
import addressRoute from "./routes/addressRoute.js"
import paymentRoute from "./routes/paymentRoute.js"
import dashboardRoute from "./routes/statsRoute.js"

config({
    path: "./.env"
})

const port = process.env.PORT || 4000;
const mongoURI = process.env.MONGO_URI || "";
const stripeKey = process.env.STRIPE_KEY || "";


connectDB(mongoURI);

export const stripe = new Stripe(stripeKey);
export const myCache = new NodeCache();

const app = express();
const stripeA = new Stripe(stripeKey)

app.use(express.json())
app.use(morgan("dev"))
app.use(cors())

// Using Routes 
app.use("/api/v1/user", userRoute)
app.use("/api/v1/product", productRoute)
app.use("/api/v1/order", orderRoute)
app.use("/api/v1/wishlist", wishlistRoute)
app.use("/api/v1/address", addressRoute)
app.use("/api/v1/payment", paymentRoute)
app.use("/api/v1/dashboard", dashboardRoute)

// Stripe Route
app.post("/api/v1/create-checkout-session", async(req,res) => {
    const {products} = req.body;
    console.log(products)

    const lineItems = products.map((product) => ({
        price_data:{
            currency: "inr",
            product_data: {
                name:product.name
            },
            unit_amount: product.price * 100,
        },
        quantity: product.quantity
    }))

    const session = await stripeA.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode:"payment",
        success_url:"http://localhost:3000/orders",
        cancel_url:"http://localhost:3000/home",
    });
    res.json({id: session.id});
})

app.get("/",(req,res)=>{
    res.send("API Working")
})

app.use("/uploads", express.static("uploads"));
app.use(errorMiddleware)

app.listen(port, ()=> {
    console.log(`Server is working on port ${port}`)
})