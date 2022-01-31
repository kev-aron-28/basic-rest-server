const { Router } = require("express");
const { check } = require("express-validator");
const { login, googleSignIn } = require("../controllers/auth");
const { validateFields } = require("../middlewares/validate_fields");

const router = Router();

router.post("/login", [
    check('email', 'Es obligatorio el correo').isEmail(),
    check('password', 'password obligatorio').not().isEmpty(),
    validateFields
] ,login );

router.post("/google", [
    check('id_token', 'Token de google es necesario').not().isEmpty(),
    validateFields
] , googleSignIn );



module.exports = router;