const adminController = require('../controllers/admin.controller.js');
const {Router} = require('express');
const checkMiddleware = require('../middelware/check.middleware.js');
const dateValidityCheckMiddleware = require("../middelware/dateValidityCheck.middleware");
const verifyUserBooking = require("../middelware/verifyUserBooking.middleware");
const calculateTotalPrice = require("../middelware/calculateTotalPrice.middleware");
const bookingController = require("../controllers/booking.controller");

const router = Router();

router.get('/users', adminController.getUsers);
router.patch('/users/:id/promote', adminController.promoteUserRole);
router.patch('/users/:id/demote', adminController.demoteUserRole);
router.post('/room-type/add', adminController.addRoomType);
router.patch('/room-type/:id/change', adminController.changeRoomType);
router.delete('/room-type/:id/delete', adminController.deleteRoomType);
router.get('/room-types', adminController.getRoomTypes);
router.post('/room/add', adminController.addRoom);
router.patch('/room/:id/change', adminController.changeRoomStatus);
router.patch('/reservation/:id/change', verifyUserBooking, calculateTotalPrice, adminController.changeUserReservation)
router.delete('/reservation/:id/delete', adminController.deleteUserReservation)

module.exports = router;