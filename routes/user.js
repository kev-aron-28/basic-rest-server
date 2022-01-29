const { Router } = require("express");
const { check } = require("express-validator");
const {
  getUsuarios,
  putUsuarios,
  postUsuarios,
  deleteUsuarios,
} = require("../controllers/users");
const {
  validRole,
  existsEmail,
  userByIdExists,
} = require("../helpers/db-validators");

// const { validateFields } = require("../middlewares/validate_fields");
// const { validateJWT } = require("../middlewares/validate_jwt");
// const { hasRole } = require("../middlewares/validate_roles");

const { validateJWT, validateFields , hasRole } = require('../middlewares');

const router = Router();

router.get("/", getUsuarios);

router.put(
  "/:id",
  [
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom(userByIdExists),
    check("role").custom(validRole),
    validateFields,
  ],
  putUsuarios
);

router.post(
  "/",
  [
    check("email", "El correo no es valido").isEmail(),
    check("name", "El nombre es obligatorio").not().isEmpty(),
    check("password", "La password debe de ser de mas de 6 letras").isLength({
      min: 6,
    }),
    // check('role', 'No es un role valido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check("role").custom(validRole),
    check("email").custom(existsEmail),
    validateFields,
  ],
  postUsuarios
);

router.delete(
  "/:id",
  [
    validateJWT,
    // validateRole,
    hasRole('ADMIN_ROLE','VENTAS_ROLE'),
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom(userByIdExists),
    validateFields,
  ],
  deleteUsuarios
);

module.exports = router;
