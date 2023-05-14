const express = require("express");
const router = express.Router();
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");
const {
  createDestination,
  getAllDestinations,
  getSingleDestination,
  updateDestination,
  deleteDestination,
  uploadImage,
} = require("../controllers/destinationController");
const {
  getSingleDestinationReviews,
} = require("../controllers/reviewController");

router
  .route("/")
  .post([authenticateUser, authorizePermissions("admin")], createDestination)
  .get(getAllDestinations);
router
  .route("/uploadImage")
  .post([authenticateUser, authorizePermissions("admin")], uploadImage);
router
  .route("/:id")
  .get(getSingleDestination)
  .patch([authenticateUser, authorizePermissions("admin")], updateDestination)
  .delete([authenticateUser, authorizePermissions("admin")], deleteDestination);
router.route("/:id/reviews").get(getSingleDestinationReviews);
module.exports = router;
