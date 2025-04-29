const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

require("dotenv").config();
const temperatureRoutes = require("./routes/temperature");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "x-api-key"],
}));
app.use(express.json());
app.use(helmet());

app.get("/", (req, res) => {
  res.send("IoT Temperature Sensor's backend");
});

app.use("/api/temperature", temperatureRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});