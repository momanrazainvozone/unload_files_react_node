const { THROW_ERROR } = require("../utils");
const uplaodingFile = async (req, res) => {
  const file = req.file;
  if (!file) {
    return THROW_ERROR(res, { error_message: "Please Upload file!" }, 400);
  }
  req.app.locals.uploadStatus = true;
  return res.status(200).send({ success_message: "file uplaod successfully!" });
};

module.exports = { uplaodingFile };
