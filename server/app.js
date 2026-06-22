require("dotenv").config({ path: ".env" });

const fs = require("fs");
const path = require("path");

const express = require("express");
const cors = require("cors");

require("./config/db.config");

const router = require("./routes");

const app = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

const uploadDirectory = path.join(__dirname, "public/uploads/covers");

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/api", router);

app.get("/404", (req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use("*", (req, res) => {
  res.status(400).redirect("/404");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});
