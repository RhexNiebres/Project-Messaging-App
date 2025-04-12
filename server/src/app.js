require("dotenv").config();
const express = require("express");
const app = express();
const indexRoutes = require("./routes/index");
const authRoutes = require("./routes/auth");
const cors = require("cors");

app.use(cors({ origin: "*", credentials: true }));
app.options("*", cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/comments", commentRoutes);
app.use("/posts", postRoutes);
app.use("/", indexRoutes);
app.use("/", authRoutes);

app.listen(process.env.APP_PORT, () =>
  console.log(`App listening on port ${process.env.APP_PORT}!`)
);
