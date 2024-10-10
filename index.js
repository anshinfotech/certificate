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

server.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "Error.html")); // Error path
});

server.post("/get-certificate", async (req, res) => {
  const { name, fatherName, email, college, mobile, sem, stream, course } =
    req.body;
  try {
    let user = await userModel.findOne({ email, mobile });

    if (!user) {
      user = await userModel.create({
        name,
        fatherName,
        email,
        mobile,
        college,
        sem,
        stream,
        course,
      });
    }

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

    const doc = new PDFDocument({
      size: [2000, 1414], // Custom page size matching the image
    });
    doc.pipe(res);

    // Generate the certificate PDF based on the college
    // Use the appropriate college template

    // 1)
    // *********   Lyallpur Khalsa College  ***********
    // doc.image(path.join(__dirname, "cert.jpg"), 0, 0, {
    //   width: 2000,
    //   height: 1414,
    // });
    // doc.fontSize(100).text(name, 0, 610 , {align : "center"});

    // 2)
    //********   Grur Nanak Dev Engineering College    ************
    // doc.image(path.join(__dirname, "GNE.jpg"), 0, 0, {
    //   width: 2000,
    //   height: 1414,
    // });
    // doc.fontSize(100).text(name, 0, 720, { align: "center" });

    // 3)
    //********   Ramgarhia Institue of engeniring and technology (Riet)    ************

    // doc.image(path.join(__dirname, "Riet.jpg"), 0, 0, {
    //   width: 2000,
    //   height: 1414,
    // });
    // doc.fontSize(100).text(name, 0, 720, { align: "center" });

    // 4)
    //********  Gulzar Group Of Institutions    ************
    // doc.image(path.join(__dirname, "GGI.jpg"), 0, 0, {
    //   width: 2000,
    //   height: 1414,
    // });
    // doc.fontSize(75).text(name, 0, 720, { align: "center" });

    // 5)
    //********   Gulzar Group Of Institutions    ************
    // doc.image(path.join(__dirname, "GGSU.jpg"), 0, 0, {
    //   width: 2000,
    //   height: 1414,
    // });
    // doc.fontSize(75).text(name, 0, 720, { align: "center" });

     // 6)
    //********   Digital Marketing Arya College    ************
    // doc.image(path.join(__dirname, "DM_ARYA.png"), 0, 0, {
    //   width: 2000,
    //   height: 1414,
    // });
    // doc.fontSize(75).text(name, 0, 720, { align: "center" });

     // 6)
    //********  Cyber Security DAV University    ************
    doc.image(path.join(__dirname, "CS_DAV.png"), 0, 0, {
      width: 2000,
      height: 1414,
    });
    doc.fontSize(75).text(name, 0, 720, { align: "center" });

    // Finalize the PDF and end the stream
    doc.end();
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: false, message: "Error generating certificate" });
  }
});

server.listen(8000, () => {
  console.log("server running");
});
