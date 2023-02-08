import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectMongoDB from "./config/connect-mongo.js";
import authRoute from "./routes/auth.js";
import usersRoute from "./routes/users.js";
import productsRoute from "./routes/products.js";
import blogsRoute from "./routes/blogs.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  return res.status(200).json({ msg: "Hello world!" });
});

app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/products", productsRoute);
app.use("/api/blogs", blogsRoute);

app.use((req, res, next) => {
  return res.status(404).json({ err: "Page not found!" });
});

connectMongoDB();

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
