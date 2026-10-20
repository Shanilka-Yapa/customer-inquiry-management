const express = require("express");
const cors = require("cors");

const app = express();

const authRoutes = require("./routes/authRoutes");
const inquiryRoutes = require("./routes/inquiryRoutes");

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Customer Inquiry Management API is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/inquiries", inquiryRoutes);

module.exports = app;