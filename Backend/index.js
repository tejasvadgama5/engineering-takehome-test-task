require("dotenv").config();
const express = require("express");
const multer = require("multer");
const HL7 = require("hl7-standard");
const cors = require("cors");

const connection = require("./connection");
const { importCSVData, interpretPathologyReport } = require("./service");

const app = express();
const port = process.env.PORT;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.json());
app.use(cors());

app.get("/import-csv", async (req, res) => {
  try {
    await importCSVData(connection);
    res.status(200).send("CSV data imported successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/upload-oru", upload.single("oruFile"), async (req, res) => {
  try {
    const oruFileBuffer = req.file.buffer.toString();
    let hl7 = new HL7(oruFileBuffer);
    hl7.transform(async (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to parse ORU file" });
        return;
      }

      // Interpret pathology report data
      const interpretationResult = await interpretPathologyReport(
        hl7?.transformed?.OBX,
        connection
      );

      // Send the interpretation result to the client
      res.status(200).json({
        message: "ORU file parsed successfully",
        data: interpretationResult,
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
