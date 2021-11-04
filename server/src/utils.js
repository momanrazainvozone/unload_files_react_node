const fs = require("fs");
const path = require("path");

const throrError = (res, error, code) => {
  res.status(code).json({
    code: code,
    error_message: error.error_message,
  });
};

const readFiles = async () => {
  const files_path = [];
  var files = fs.readdirSync(path.join(__dirname, "../", "my_uploads"));
  files.forEach((file) => {
    files_path.push(path.join(__dirname, "../", "my_uploads/" + file));
  });
  return files_path;
};

const deleteFiles = async (files_path, res) => {
  files_path.map(async (x) => {
    try {
      await fs.unlinkSync(x);
    } catch (error) {
      return throrError(
        res,
        { error_message: "Invalid File path or File does not exist" },
        400
      );
    }
  });
};

module.exports = {
  throrError,
  readFiles,
  deleteFiles,
};
