const { Router } = require("express");
const { check } = require("express-validator");
const { createProduct, getProducts, getProductById, updateProduct, deleteProduct } = require("../controllers/product");
const { categoyExist, productExist } = require("../helpers/db-validators");
const { validateJWT, validateFields, validateRole } = require("../middlewares");
const router = Router();

// Get all categories - public
router.get("/", getProducts);

// Get one category by id - public
router.get(
  "/:id",
  [
    check("id", "No es un id valido").isMongoId(),
    check("id").custom(productExist),
    validateFields,
  ],
  getProductById
);

// Create product - private - valid token
router.post(
  "/",
  [
    validateJWT,
    check("name","El nombre debe ser obligatorio").not().isEmpty(),
    check("price", "Debe ser un numero").isNumeric(),
    check("category").isMongoId(),
    check("category").custom(categoyExist),
    check("description", "la descripcion es obligatoria"),
    validateFields,
  ],
  createProduct
);

// Update - private - valid token
router.put(
  "/:id",
  [
    validateJWT,
    check("id", "El id es obligatorio").not().isEmpty(),
    check("id", "No es un id valido").isMongoId(),
    check("id").custom(productExist),
    validateFields,
  ],
  updateProduct
);

// Delete category - admin
router.delete("/:id", [
    validateJWT,
    validateRole,
    check("id", "El id es obligatorio").not().isEmpty(),
    check("id", "No es un id valido").isMongoId(),
    check("id").custom(productExist),
    validateFields
], deleteProduct);

module.exports = router;
