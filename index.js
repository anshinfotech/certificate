const express = require("express");
const server = express();
const mongoose = require("mongoose");
const cors = require("cors");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
require('dotenv').config();

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
      process.env.MONGODB_URI,
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

// Function to validate mobile number
const isValidMobileNumber = (mobile) => {
  // Regular expression for a 10-digit mobile number (Indian format)
  const mobileRegex = /^[6-9]\d{9}$/;
  return mobileRegex.test(mobile);
};

server.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html")); // Corrected path
});

server.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "Error.html")); // Error path
});

server.post("/get-certificate", async (req, res) => {
  const { name, fatherName, email, college, mobile, sem, stream, course } =
    req.body;

  // Validate mobile number
  if (!isValidMobileNumber(mobile)) {
    return res.status(400).send({ success: false, message: "Invalid mobile number" });
  }

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

    // Uncomment the desired college template below:

    // *********   Lyallpur Khalsa College  ***********
    // doc.image(path.join(__dirname, "cert.jpg"), 0, 0, {
    //   width: 2000,
    //   height: 1414,
    // });
    // doc.fontSize(100).text(name, 0, 610 , {align : "center"});

    // ********   Grur Nanak Dev Engineering College    ************
    // doc.image(path.join(__dirname, "GNE.jpg"), 0, 0, {
    //   width: 2000,
    //   height: 1414,
    // });
    // doc.fontSize(100).text(name, 0, 720, { align: "center" });

    // ********   Ramgarhia Institue of engeniring and technology (Riet)    ************
    // doc.image(path.join(__dirname, "Riet.jpg"), 0, 0, {
    //   width: 2000,
    //   height: 1414,
    // });
    // doc.fontSize(100).text(name, 0, 720, { align: "center" });

    // ********  Gulzar Group Of Institutions    ************
    // doc.image(path.join(__dirname, "GGI.jpg"), 0, 0, {
    //   width: 2000,
    //   height: 1414,
    // });
    // doc.fontSize(75).text(name, 0, 720, { align: "center" });

    // ********   Digital Marketing Arya College    ************
    // doc.image(path.join(__dirname, "DM_ARYA.png"), 0, 0, {
    //   width: 2000,
    //   height: 1414,
    // });
    // doc.fontSize(75).text(name, 0, 720, { align: "center" });

    // ********  Cyber Security DAV University    ************
    // doc.image(path.join(__dirname, "CS_DAV.png"), 0, 0, {
    //   width: 2000,
    //   height: 1414,
    // });
    // doc.fontSize(75).text(name, 0, 720, { align: "center" });


     // ********  RIMT College Mandi Gobindgarh    ************
    // doc.image(path.join(__dirname, "RIMT.png"), 0, 0, {
    //   width: 2000,
    //   height: 1414,
    // });
    // doc.fontSize(75).text(name, 0, 720, { align: "center" });

    // ********  Baba Farid Group Of Institutions    ************
    // doc.image(path.join(__dirname, "BFGI.png"), 0, 0, {
    //   width: 2000,
    //   height: 1414,
    // });
    // doc.fontSize(75).text(name, 0, 720, { align: "center" });

    // // ********  Baba Farid Group Of Institutions    ************
    // doc.image(path.join(__dirname, "SBBSU.jpg"), 0, 0, {
    //   width: 2000,
    //   height: 1414,
    // });
    // doc.fontSize(75).text(name, 0, 720, { align: "center" });

    // ********  Maharaja Ranjit Singh Punjab Technical University   ************
    // doc.image(path.join(__dirname, "MRSPTU.png"), 0, 0, {
    //   width: 2000,
    //   height: 1414,
    // });
    // doc.fontSize(75).text(name, 0, 720, { align: "center" });

    // ********  GNIMT College    ************
    // doc.image(path.join(__dirname, "gnimt.png"), 0, 0, {
    //   width: 2000,
    //   height: 1414,
    // });
    // doc.fontSize(75).text(name, 0, 720, { align: "center" });

     // ********  SCD Boys College    ************
    // doc.image(path.join(__dirname, "SCD.jpg"), 0, 0, {
    //   width: 2000,
    //   height: 1414,
    // });
    // doc.fontSize(75).text(name, 0, 720, { align: "center" });

    // ********  SCD Boys College    ************
    // doc.image(path.join(__dirname, "Modern.png"), 0, 0, {
    //   width: 2000,
    //   height: 1414,
    // });
    // doc.fontSize(75).text(name, 0, 720, {align:"center"});

    // ********  Government College for Girls   ************
    // doc.image(path.join(__dirname, "certificate (8).pdf.jpg"), 0, 0, {
    //   width: 2000,
    //   height: 1414,
    // });
    // doc.fontSize(65).text(name, 0, 700, {align:"center"});

    //MGC AI/ML
    //  doc.image(path.join(__dirname, "MGC.png"), 0, 0, {
    //   width: 2000,
    //   height: 1414,
    // });
    // doc.fontSize(75).text(name, 0, 720, { align: "center" });

     //DAVIET AI/ML
     doc.image(path.join(__dirname, "DAVIET.png"), 0, 0, {
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
      .send({ success: false, message: error.message });
  }
});

server.listen(8000, () => {
  console.log("server running");
});
