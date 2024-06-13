const uploadToCloudinary = require("../../helpers/uploadToCloudinary.helper");

module.exports.uploadSingle = async (req, res, next) => {
  console.log(req.file);
  if(req.file) {
    const link = await uploadToCloudinary(req.file.buffer);
    req.body[req.file.fieldname] = link;
    next();
  } else {
    next();
  }
}