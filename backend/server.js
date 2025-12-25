import express from "express"
import http from 'http'
import userRouter from "./routes/user.js";
import { connectDB } from "./lib/connection.js";
import bodyParser from "body-parser"
import  cors from 'cors'

import dotenv from "dotenv";
import urlRouter from "./routes/url.js";
import paymentRouter from "./routes/payment.js";
import { redirectShortUrl } from "./controllers/url.js";
import adminRouter from "./routes/admin.js";

dotenv.config();


const app = express();
const server = http.createServer(app);
app.use(cors());
// app.use((req, res, next) => {
//   res.setHeader(`Content-Security-Policy", "connect-src 'self' ${process.env.BACKEND_URL} ;`);
//   next();
// });

app.use(bodyParser.json())
app.use("/api/status", (req, res)=>res.json({success : true , message : "The backend is running properly"}))
app.use("/api/auth", userRouter)
app.use("/api/url", urlRouter)
app.use("/api/payment", paymentRouter);
app.use("/api/admin", adminRouter);

await connectDB()

if (process.env.NODE_ENV !== "production") {
   const PORT = process.env.PORT || 8000;
   server.listen(PORT, ()=> console.log("Server is Running on port :" + PORT));
}

export default server;

