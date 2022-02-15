const { Router } = require("express");
const { check } = require("express-validator");
const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../controllers/category");
const { categoyExist } = require("../helpers/db-validators");
const { validateJWT, validateFields, validateRole } = require("../middlewares");
const router = Router();

// Get all categories - public
router.get("/", getCategories);

// Get one category by id - public
router.get(
  "/:id",
  [
    check("id", "No es un id valido").isMongoId(),
    check("id").custom(categoyExist),
    validateFields,
  ],
  getCategoryById
);

// Create category - private - valid token
router.post(
  "/",
  [
    validateJWT,
    check("name", "El nombre es obligatorio").not().isEmpty(),
    validateFields,
  ],
  createCategory
);

// Update - private - valid token
router.put(
  "/:id",
  [
    validateJWT,
    check("id", "El id es obligatorio").not().isEmpty(),
    check("id", "No es un id valido").isMongoId(),
    check("id").custom(categoyExist),
    check("name", "El nombre es obligatorio").not().isEmpty(),
    validateFields,
  ],
  updateCategory
);

// Delete category - admin
router.delete("/:id", [
    validateJWT,
    validateRole,
    check("id", "El id es obligatorio").not().isEmpty(),
    check("id", "No es un id valido").isMongoId(),
    check("id").custom(categoyExist),
    validateFields
], deleteCategory);

module.exports = router;
