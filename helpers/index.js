const dbValidators = require('./db-validators');
const genJWT = require('./generateJWT');
const googleVerify = require('./google_verify');
const uploadFile = require('./upload-file');

module.exports = {
    ...dbValidators,
    ...genJWT,
    ...googleVerify,
    ...uploadFile   
}