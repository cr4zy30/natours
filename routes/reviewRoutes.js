const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

// get access to tourId from tourRoutes
const router = express.Router({ mergeParams: true });

// POST /tours/234/reviews
// GET /tours/234/reviews
// POST /reviews

// again, routes after this line of code are protected
router.use(authController.protect);

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.createReview,
  );

router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(
    authController.restrictTo('user', 'admin'),
    reviewController.updateReview,
  )
  .delete(
    authController.restrictTo('user', 'admin'),
    reviewController.deleteReview,
  );

module.exports = router;
