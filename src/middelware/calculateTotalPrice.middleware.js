const ApiError = require('../exeptions/api.error');
const bookingService = require('../services/booking.service');

module.exports = async function (req, res, next) {
    try {
        const {room, checkInDate, checkOutDate} = req.body;
        req.body.totalPrice = await bookingService.calculateTotalPrice(checkInDate, checkOutDate, room)
        next();
    } catch (err) {
        return next(err)
    }
}