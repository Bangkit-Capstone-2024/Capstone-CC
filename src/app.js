import express from "express";
import helmet from "helmet";
import path from "path";
import env from "dotenv";
import cors from "cors";
const cookieParser = require('cookie-parser');
env.config();

const app = express();
app.set('trust proxy', 1);
// const PORT = process.env.PORT;

// RATE LIMIT, THE PROCESS OF LIMITING THE NUMBER OF USER/CLIENT REQUSET ON CERTAIN RESOURCES
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too much pressing the screen, please wait a moment",
});

// MIDDLEWARE
app.use((req, res, next) => {
  // WEBSITE YOU WISH TO ALLOW TO CONNECT
  req.headers["Access-control-allow-origin"] = "*";

  // REQUEST METHOD YOU WISH TO ALLOW
  req.headers["Access-control-allow-methods"] = "GET, POST, OPTIONS, PUT, PATCH, DELETE";

  // REQUEST HEADERS YOU WISH TO ALLOW

  req.headers["Access-control-allow-headers"] = "Authorization, Content-Type";
  // PASS TO NEXT LAYER OF MIDDLEWARE
  next();
});

app.use(
  cors({
    origin: "*",
  })
);

app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
  })
);

app.use(cookieParser());

app.use(limiter);
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "../static")));

import { rateLimit } from "express-rate-limit";
import users_controllers from "./routes/UsersRoutes";
import tenant_controllers from "./routes/tenantRoutes";
import category_controllers from "./routes/categoryRoutes";
import product_controllers from "./routes/productRoutes";
import booking_controllers from "./routes/bookingRoutes";


// ROUTES

app.use("/api/v1", users_controllers);
app.use("/api/v1", tenant_controllers);
app.use("/api/v1", category_controllers);
app.use("/api/v1", product_controllers);
app.use("/api/v1", booking_controllers);

export { app };
