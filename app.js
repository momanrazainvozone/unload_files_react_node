const path = require("path");
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
require("dotenv").config();

//==================={IMPORTS}======================\\

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//==================={RENDER BUILD}======================\\

app.use(express.static(path.join(__dirname, "build")));
app.get("/", async (req, res) => {
  res.sendFile(path.join());
});

//==================={MULTER}======================\\

var multerStorage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, path.join(__dirname, "my_uploads"));
  },
  filename: function (req, file, callback) {
    callback(null, Date.now() + "_" + file.originalname);
  },
});

//==================={MULTER UPLOAD SINGLE}======================\\

var multerSigleUpload = multer({ storage: multerStorage });

//==================={MULTER UPLOAD MULTIPLE}======================\\

var multerMultipleUpload = multer({ storage: multerStorage }).array(
  "multipleImage",
  3
);

//==================={UPLOAD SINGLE FILE}======================\\

app.post(
  "/singleFile",
  multerSigleUpload.single("singleImage"),
  function (req, res) {
    const file = req.file;
    if (!file) {
      return res.status(400).send("Please choose file to upload!");
    }
    req.app.locals.uploadStatus = true;
    return res.status(200).send({ message: "file uplaoded" });
  }
);

//==================={UPLOAD MULTIPLE FILE}======================\\

app.post("/multipleFile", function (req, res) {
  multerMultipleUpload(req, res, function (err) {
    if (err) {
      return res.end("Files uploading unsucessfully!");
    }
    req.app.locals.uploadStatus = true;
    res.redirect("/");
  });
});

//==================={GET FILE PATH API}======================\\

app.get("/getfilepath", async (req, res) => {
  try {
    const files = await read_files();
    return res.status(200).send(files);
  } catch (error) {
    return res.status(400).send({ message: "Something went wrong" });
  }
});
const read_files = async () => {
  let files_path = [];
  var files = fs.readdirSync(__dirname + "/my_uploads");
  files.forEach((file) => {
    files_path.push(String(__dirname + "/my_uploads" + "/" + file));
  });
  return files_path;
};

//==================={DELETE FILE API}======================\\

app.post("/delete_files", async (req, res) => {
  const files_path = req.body.files;
  try {
    files_path.map(async (x) => {
      try {
        await fs.unlinkSync(x);
      } catch (error) {
        return res.status(400).send({ message: "File not found" });
      }
    });
    return res.status(200).send({ message: "file deleted" });
  } catch (error) {
    return res.status(400).send({ message: "Something went wrong" });
  }
});

//==================={SERVER LISTENING}======================\\

app.listen(process.env.PORT || 5000, () => {
  console.log("Server is running at port ", process.env.PORT);
});
