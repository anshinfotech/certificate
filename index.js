const express = require("express");
const server = express();
const mongoose = require("mongoose");
const cors = require("cors");
const PDFDocument = require("pdfkit");
const fs = require("fs");

const path = require("path");

server.use(express.json());

server.use(
  cors({
    credentials: true,
    origin: "*",
  })
);
server.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));  // Corrected path
});

server.post("/get-certificate", async (req, res) => {
  const { name, fathername } = req.body;
  try {
    const doc = new PDFDocument();
    res.setHeader(
      "Content-disposition",
      "attachment; filename=certificate.pdf"
    );
    res.setHeader("Content-type", "application/pdf");

    doc.pipe(res);

    // Add certificate background
    doc.image(path.join(__dirname, "cert.jpg"), 0, 0, {
      width: 1395,
      height: 1942,
    });

    // Insert user's name
    doc.fontSize(25).text(name, 200, 300);

    // Insert additional text
    doc.fontSize(15).text("Congratulations on your achievement!", 200, 400);
    doc.end();
  } catch (error) {
    console.log(error);
    res.status(500).send("Error generating certificate");
  }
});

server.listen(8000, () => {
  console.log("server running");
});
