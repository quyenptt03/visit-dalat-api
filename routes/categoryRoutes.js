const express = require("express");
const router = express.Router();
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");
const {
  createCategory,
  getCategoriesTotal,
  getAllCategories,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

router
  .route("/")
  .post([authenticateUser, authorizePermissions("admin")], createCategory)
  .get(getAllCategories);
router.route("/total").get(getCategoriesTotal);
router
  .route("/:id")
  .patch([authenticateUser, authorizePermissions("admin")], updateCategory)
  .delete([authenticateUser, authorizePermissions("admin")], deleteCategory);
module.exports = router;
