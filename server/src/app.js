const dotenv = require("dotenv");
const envFile =
  process.env.NODE_ENV === "production"
    ? ".env.production"
    : ".env.development";
dotenv.config({ path: envFile });
const express = require("express");
const app = express();
const indexRoutes = require("./routes/index");
const authRoutes = require("./routes/auth");
const usersRoutes = require("./routes/users");
const conversationsRoutes = require("./routes/conversations");
const messagesRoutes = require("./routes/messages");
const cors = require("cors");

const allowedOrigins = [process.env.CLIENT_HOST,process.env.MESSAGELY_CLIENT_HOST];

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

app.options("*", cors()); 

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/", indexRoutes);
app.use("/", authRoutes);
app.use("/users", usersRoutes);
app.use("/conversations", conversationsRoutes);
app.use("/conversations", messagesRoutes);
app.use("/messages", messagesRoutes);

app.listen(process.env.APP_PORT, () =>
  console.log(`App listening on port ${process.env.APP_PORT}!`)
);
