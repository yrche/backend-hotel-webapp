const {Router} = require("express");
const verifyUserBooking = require('../middelware/verifyUserBooking.middleware');
const ensureBookingIsAvailable = require('../middelware/ensureBookingIsAvailable.middleware');
const calculateTotalPrice = require('../middelware/calculateTotalPrice.middleware');
const dateValidityCheckMiddleware = require('../middelware/dateValidityCheck.middleware.js');
const bookingController = require('../controllers/booking.controller');

const router = Router();

router.post('/:id/book', ensureBookingIsAvailable, calculateTotalPrice, bookingController.bookApartments);
router.patch('/:id/change', dateValidityCheckMiddleware, verifyUserBooking, calculateTotalPrice, bookingController.changeReservation);
router.delete('/:id/delete', dateValidityCheckMiddleware, bookingController.deleteReservation);
router.get('/get-all-suites', bookingController.getAllUserReservation);

module.exports = router;