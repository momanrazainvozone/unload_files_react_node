const path = require("path");
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());
//app.set("views", path.join(__dirname, "views"));
//set view engine
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// Render front end
//app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "build")));
app.get("/",async (req, res) => {
    res.sendFile(path.join());
});

// For Multer Storage
var multerStorage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, path.join(__dirname, "my_uploads"));
  },
  filename: function (req, file, callback) {
    callback(null, Date.now() + "_" + file.originalname);
  },
});
// For Single File upload
var multerSigleUpload = multer({ storage: multerStorage });
// For Multiple File upload
var multerMultipleUpload = multer({ storage: multerStorage }).array(
  "multipleImage",
  3
);

app.post(
  "/singleFile",
  multerSigleUpload.single("singleImage"),
  function (req, res) {
    const file = req.file;
    if (!file) {
      return res.send("Please choose file to upload!");
    }
    req.app.locals.uploadStatus = true;
    return res.status(200).send({ message: "file uplaoded" });
  }
);
//route for multiple file upload
app.post("/multipleFile", function (req, res) {
  multerMultipleUpload(req, res, function (err) {
    if (err) {
      return res.end("Files uploading unsucessfully!");
    }
    req.app.locals.uploadStatus = true;
    res.redirect("/");
  });
});
// GET file Paths
app.get("/getfilepath", async (req, res) => {
  const files = await read_files();
  return res.status(200).send(files);
});
const read_files = async () => {
  let files_path = [];
  var files = fs.readdirSync(__dirname+'/my_uploads');
  files.forEach((file) => {
    files_path.push(String(__dirname +'/my_uploads'+"/"+ file));
  });
  return files_path;
};
// delete file
app.post("/delete_files",async (req,res)=>{
    const files_path=req.body.files;
    try {
        const promise=files_path.map((x=>{
            fs.unlink(x, function (err) {
                // if no error, file has been deleted successfully
                console.log('File deleted!');
            });
        })); 
        await Promise.all(promise);
        return res.status(200).send({message:"file deleted"});
    } catch (error) {
        return res.status(400).send({message:"Something went wrong"});
    }

   
})
// Server Listening
app.listen(5000, () => {
  console.log("Server is running at port 5000");
});
