const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json({ limit: "20mb" }));

// health check
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// routes
app.use("/api/pdf", require("./routes/pdf"));

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
