import dotenv from 'dotenv'
dotenv.config()
import express from "express"
import connectDb from "./connectionDB.js";
import userrouter from './routes/userRoutes.js'
import adminrouter from "./routes/adminRoutes.js"
import productRouter from "./routes/productRoutes.js";
import cartrouter from "./routes/cartRoutes.js"
import orderrouter from "./routes/orderRoutes.js"
import categoryRouter from "./routes/categoryRoutes.js";
import session from "express-session"
import cors from "cors"
import MongoStore from "connect-mongo";

const app = express()
app.use(express.json())
app.use(cors({
    origin:["http://localhost:5173","http://4.213.100.69"],
    credentials:true
}))

app.use(
    session({
        secret: "mySecretKey",
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: process.env.DBCONNECTIONSTRING,
            collectionName: "session",
        }),
        cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
        },
    })
)





connectDb()
app.use("/uploads", express.static("uploads"))

app.get('/', (req, res) => {
    res.send("server created successfully");

})
app.use("/user", userrouter);
app.use("/admin",  adminrouter);

// app.use("/user", userrouter);

app.use("/", productRouter);
app.use("/userCart", cartrouter)
app.use("/order", orderrouter)
app.use("/", categoryRouter)



const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server created at http://localhost:${PORT}`);

})