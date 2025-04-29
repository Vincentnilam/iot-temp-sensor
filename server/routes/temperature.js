const express = require("express");
const router = express.Router();
const prisma = require('../prisma');


// receive data from raspberry pi
router.post("/", async (req, res) => {
  const apiKey = req.headers["x-api-key"];
  if (apiKey !== process.env.PI_SECRET) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { temperature, humidity } = req.body;
  if (typeof temperature !== "number" || typeof humidity !== "number") {
    return res.status(400).json({ error: "Invalid data format"});
  }
  try {
    const reading = await prisma.temperatureReading.create({
      data: { temperature, humidity },
    });
    res.status(201).json({ message: "Temperature data saved to db."});
  } catch (err) {
    console.error("Error inserting temperature: ", err);
    res.status(500).json({ error: "Failed to save temperature data"});
  }
});

router.get("/latest", async (req, res) => {
  try {
    const latest = await prisma.temperatureReading.findFirst({
      orderBy: { createdAt : "desc" },
    });

    if (!latest) {
      return res.status(404).json({ message: "No temperature data found."});
    }
    res.json(latest);
  } catch (err) {
    res.status(500).json({ error: "Failed to get latest temp."});
  }
});

// get initial 100 first, I'll think of React side later prolly, maybe month to month basis?
router.get("/", async (req, res) => {
  try {
    const readings = await prisma.temperatureReading.findMany({
      orderBy: { createdAt: "desc"},
      take: 100,
    });
    res.json(readings);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch temps."});
  }
})


module.exports = router;
