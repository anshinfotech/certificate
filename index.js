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

const userSchema = new mongoose.Schema(
  {
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
    sem: {
      type: String,
      required: true,
    },
    stream: {
      type: String,
      required: true,
    },
    course: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model("Users", userSchema);

server.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html")); // Corrected path
});

server.post("/get-certificate", async (req, res) => {
  const { name, fatherName, email, college, mobile, sem, stream, course } =
    req.body;
  try {
    const existingUser = await userModel.findOne({ email, mobile });
    console.log(existingUser)
    if (!existingUser) {
      const newUser = await userModel.create({
        name,
        fatherName,
        email,
        mobile,
        college,
        sem,
        stream,
        course,
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

      // Add certificate background
      // Create a custom-sized page to fit the image size (2000x1414)
      const doc = new PDFDocument({
        size: [2000, 1414], // Custom page size matching the image
      });
      doc.pipe(res);

      // Add the image, positioning it at the top-left corner of the page
      doc.image(path.join(__dirname, "cert.jpg"), 0, 0, {
        width: 2000,
        height: 1414,
      });

      // Insert user's name
      doc.fontSize(100).text(name, 700, 610);
      // Finalize the PDF and end the stream
      doc.end();
    } else {
      res
        .status(500)
        .send({ success: false, message: "Email or Mobile already exists" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Error generating certificate");
  }
});

server.listen(8000, () => {
  console.log("server running");
});
