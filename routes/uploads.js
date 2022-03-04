const { Router } = require("express");
const { check } = require("express-validator");
const { uploadFile, updateFile, showImage, updateFileCloudinary } = require("../controllers/uploads");
const { allowedCollections } = require("../helpers");
const { validateFields } = require("../middlewares");
const { validate_file } = require('../middlewares/validate_file')
const router = Router();

router.post('/', [
    validate_file,
    validateFields,
] ,uploadFile)

router.put('/:collection/:id', [
    check('id', 'El id debe ser mongo').isMongoId(),
    check('collection').custom(c => allowedCollections(c, ['users', 'products'])),
    validate_file,
    validateFields,
] , updateFileCloudinary);

router.get('/:collection/:id', [
    check('id', 'El id debe ser mongo').isMongoId(),
    check('collection').custom(c => allowedCollections(c, ['users', 'products'])),
    validateFields,
], showImage);

module.exports = router;