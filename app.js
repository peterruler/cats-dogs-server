"use strict";
const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const util = require("util");
const unlinkFile = util.promisify(fs.unlink);

const app = express();
const port = process.env.PORT || 8080;

// tensorflow
const { exec } = require("child_process");
const pythonScriptPath = "catsanddogs.py";
var env = "tensorflow";
var condaPath = "";
var condaActivateScript = "";

if (process.env.NODE_ENV == "production") {
  condaPath = "bash ~/miniconda3/etc/profile.d/conda.sh";
  condaActivateScript = "~/miniconda3/bin/activate";
} else {
  // development
  condaPath = "bash ~/miniconda3/etc/profile.d/conda.sh";
  condaActivateScript = "~/miniconda3/bin/activate";
}

const condaEnvCommand = `${condaPath} ${condaActivateScript} ${env}`;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

var upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 10 },
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|gif|png/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      cb(null, true);
    } else {
      cb(new Error("Only jpeg images are allowed!"), false);
    }
  },
});

app.use(express.static(path.join(__dirname, "frontend/build")));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "frontend/build", "index.html"));
});

app.post("/upload", upload.single("file"), (req, res, next) => {
  var file = "";
  let responseText = "Nur JPG ist erlaubt!";
  res.statusMessage = responseText;
  try {
    file = req.file;
    let filetypes = /jpeg|jpg/;
    let extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (!extname) {
      unlinkFile("./uploads/" + req.file.filename);
      res.status(200).send(responseText);
      return;
    }
  } catch (e) {
    res.status(200).send(responseText);
    return;
  }

  if (file != "") {
    const command = `${condaEnvCommand} && python ${pythonScriptPath} ${req.file.filename}`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        let responseText = "Fehler beim Scriptaufruf";
        res.status(500).send(responseText);
        return;
      }
      let responseText = stdout.replace(/(?:\r\n|\r|\n)/g, "");
      res.statusMessage = responseText;
      unlinkFile("./uploads/" + req.file.filename);
      res.send(responseText);
      if (stderr) {
        let responseText = "Fehler beim Scriptaufruf";
        res.status(500).send(responseText);
        return;
      }
    });
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  const responseText = err.message;
  res.statusMessage = responseText;
  res.status(200).send(responseText);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
