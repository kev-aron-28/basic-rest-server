const path = require("path");
const { v4: uuidv4 } = require('uuid')

const uploadFile = (files, validExtensions = ["png", "jpg", "jpeg", "gif"], folder = '') => {
  return new Promise((resolve, reject) => {
    const { file } = files;
    const nameFile = file.name.split(".");
    const ext = nameFile[nameFile.length - 1];

    if (!validExtensions.includes(ext)) {
      return reject("Invalid extension " + validExtensions)
    }
    const tempName = uuidv4() + "." + ext;
    const uploadPath = path.join(__dirname, "../uploads/", folder ,tempName);

    file.mv(uploadPath, (err) => {
      if (err) {
        return reject(err);
      }

      resolve(tempName);
    });
  });
};

module.exports = {
  uploadFile,
};
