const express = require("express");
const router = express.Router();
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");
const {
  createArticle,
  getArticlesTotal,
  getAllArticles,
  getFeaturedArticles,
  getSingleArticle,
  updateArticle,
  deleteArticle,
  uploadImage,
} = require("../controllers/articleController");

router
  .route("/")
  .post([authenticateUser, authorizePermissions("admin")], createArticle)
  .get(getAllArticles);
router.route("/total").get(getArticlesTotal),
  router.route("/featured").get(getFeaturedArticles);
router
  .route("/uploadImage")
  .post([authenticateUser, authorizePermissions("admin")], uploadImage);
router
  .route("/:id")
  .get(getSingleArticle)
  .patch([authenticateUser, authorizePermissions("admin")], updateArticle)
  .delete([authenticateUser, authorizePermissions("admin")], deleteArticle);

module.exports = router;
