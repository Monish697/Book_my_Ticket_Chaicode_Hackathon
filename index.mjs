import dotenv from "dotenv";
dotenv.config();

import express from "express";

import { dirname } from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import { getPool } from "./common/utils/db.config.js";
import authRouter from "./modules/auth/auth.routes.js";
import bookingRouter from "./modules/TicketBookingService/booking.routes.js";
import cookieParser from "cookie-parser";
const __dirname = dirname(fileURLToPath(import.meta.url));

const port = process.env.PORT || 8080;
const app = new express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/register.html");
});

app.get("/booking", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.get("/register", (req, res) => {
    res.sendFile(__dirname + "/register.html");
});

app.use("/auth", authRouter);

app.use("/seat", bookingRouter);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal server error";
    res.status(statusCode).json({ error: message });
});

app.listen(port, async () => {
    console.log("Server starting on port: " + port);
    try {
        const pool = getPool();
        const client = await pool.connect();
        console.log("Connected to PostgreSQL database successfully!");
        client.release();
    } catch (error) {
        console.error("Database connection failed:", error);
    }
});
