const express = require("express");
const cors = require("cors");
require("dotenv").config();
const temperatureRoutes = require("./routes/temperature");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("IoT Temperature Sensor's backend");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.use("/api/temperature", temperatureRoutes);