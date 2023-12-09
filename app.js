"use strict";
const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const multer = require("multer");
const path = require("path");
const app = express();
const port = process.env.PORT || 5000;

// tensorflow
const { exec } = require("child_process");
const pythonScriptPath = "catsanddogs.py";
var env = "tensorflow";
var condaActivateScript = "";
var condaPath = "";

if (process.env.NODE_ENV == "production") {
  condaActivateScript = "bash ~/miniconda3/etc/profile.d/conda.sh";
  condaPath = "~/miniconda3/bin/activate";
} else {
  // development
  condaActivateScript = "bash ~//miniconda3/etc/profile.d/conda.sh";
  condaPath = "~/miniconda3/bin/activate";
}

const condaEnvCommand = `${condaActivateScript} ${condaPath} ${env}`;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Please upload images only");
  }
}

var upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

app.use(express.static(path.join(__dirname, "frontend/build")));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "frontend/build", "index.html"));
});

app.post("/upload", upload.single("file"), (req, res, next) => {
  const file = req.file;
  if (!file) {
    const error = new Error('Please upload a file');
    error.status = 400;
    return next(error);
  }

  if(req.files != "") { 
    const command = `${condaEnvCommand} && python ${pythonScriptPath} ${req.file.filename}`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Fehler beim Ausführen des Skripts: ${error}`);
        return;
      }
      let responseText = stdout.replace(/(?:\r\n|\r|\n)/g, "");
      console.log(responseText);
      res.statusMessage = responseText;
      res.send(responseText);
      if (stderr) {
        console.error("Fehler im Python-Skript:");
        console.error(stderr);
      }
    });
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  let responseText =
  "Bild konnte beim ersten Versuch nicht uploaded werden, bitte gleich nochmals versuchen!"
  res.status(err.status || 500).send(responseText);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
