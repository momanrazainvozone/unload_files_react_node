const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const { readFiles, throrError, deleteFiles } = require("./src/utils.js");
const { uplaodingFile } = require("./src/controller/uploadFile.js");
require("dotenv").config();

//==================={IMPORTS}======================\\

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//==================={RENDER BUILD}======================\\

app.use(express.static(path.join(__dirname, "build")));
app.get("/", async (_req, res) => {
  res.sendFile(path.join());
});

//==================={MULTER}======================\\

const multerStorage = multer.diskStorage({
  destination: function (_req, _file, callback) {
    callback(null, path.join(__dirname, "my_uploads"));
  },
  filename: function (_req, file, callback) {
    callback(null, Date.now() + "_" + file.originalname);
  },
});

//==================={MULTER UPLOAD SINGLE}======================\\

const multerSigleUpload = multer({ storage: multerStorage });

//==================={UPLOAD SINGLE FILE}======================\\

app.post(
  "/singleFile",
  multerSigleUpload.single("singleImage"),
  function (req, res) {
    uplaodingFile(req, res);
  }
);

//==================={GET FILE PATH API}======================\\

app.get("/getfilepath", async (_req, res) => {
  try {
    const files = await readFiles();
    return res.status(200).send({ code: 200, files: files });
  } catch (error) {
    return throrError(
      res,
      { error_message: "Something Went Wrong Please Contact Support!" },
      400
    );
  }
});

//==================={DELETE FILE API}======================\\

app.post("/deleteFiles", async (req, res) => {
  try {
    await deleteFiles(req.body.files, res);
    return res.status(200).send({ message: "file deleted" });
  } catch (error) {
    return res.status(400).send({ message: "Something went wrong" });
  }
});

//==================={SERVER LISTENING}======================\\

app.listen(process.env.PORT || 5000, () => {
  console.log("Server is running at port ", process.env.PORT);
});
