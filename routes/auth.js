const { Router } = require("express");
const { check } = require("express-validator");
const { login } = require("../controllers/auth");
const { validateFields } = require("../middlewares/validate_fields");

const router = Router();

router.post("/login", [
    check('email', 'Es obligatorio el correo').isEmail(),
    check('password', 'password obligatorio').not().isEmpty(),
    validateFields
] ,login );



module.exports = router;