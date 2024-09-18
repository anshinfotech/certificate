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
const DB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://anshinfotech1:f8QiKYpsDE53Cs6l@cluster0.iqayfbm.mongodb.net/certificate",
      {
        serverSelectionTimeoutMS: 30000, // 30 seconds
        socketTimeoutMS: 45000, // 45 seconds
      }
    );
    console.log("databse connected");
  } catch (error) {
    console.log(error);
  }
};
DB();

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  fatherName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  college: {
    type: String,
    required: true,
  },
  mobile: {
    type: Number,
    required: true,
  },
});

const userModel = mongoose.model("Users", userSchema);

server.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html")); // Corrected path
});

server.post("/get-certificate", async (req, res) => {
  const { name, fatherName, email, college, mobile } = req.body;
  try {
    const existingUser = await userModel.findOne({ email, mobile });
    if (existingUser) {
      return res.status(200).sendFile(path.join(__dirname, "./Error.html"));
    }

    const newUser = await userModel.create({
      name,
      fatherName,
      email,
      mobile,
      college,
    });

    // Set headers for PDF download and prevent caching
    res.setHeader(
      "Content-disposition",
      "attachment; filename=certificate.pdf"
    );
    res.setHeader("Content-type", "application/pdf");
    res.setHeader(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    );
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    const doc = new PDFDocument();
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

    // Finalize the PDF and end the stream
    doc.end();
  } catch (error) {
    console.log(error);
    res.status(500).send("Error generating certificate");
  }
});

server.listen(8000, () => {
  console.log("server running");
});
