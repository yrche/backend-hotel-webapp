const ApiError = require("../exeptions/api.error");
const bookingService = require('../services/booking.service');

module.exports = async function (req, res, next) {
    try {
        const {room, checkInDate, checkOutDate} = req.body;
        const id = req.params.id;

        if (!room) {
            return next(ApiError.BadRequest('Provide room numbers'))
        }

        if (!checkInDate || !checkOutDate) {
            return next(ApiError.BadRequest('Provide dates'));
        }

        const dates = await bookingService.verifyUserDates(id, checkInDate, checkOutDate, room);

        req.body.room = dates.roomNumber;
        next();
    } catch (err) {
        return next(err)
    }
}