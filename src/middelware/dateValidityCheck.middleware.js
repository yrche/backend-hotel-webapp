const ApiError = require("../exeptions/api.error");
const additionalService = require('../services/additional.service');
const bookingService = require('../services/booking.service');

module.exports = async function (req, res, next) {
    try {
        const id = req.params.id;
        const numberOfDays = await additionalService.calculateNumberOfNights(
            additionalService.getCurrentDate(),
            await bookingService.getReservationDates(id)
        )

        if (numberOfDays <= 31) {
            return next(ApiError.BadRequest('You cannot cancel or change your reservation one month before'))
        }

        res.valiidationDates = numberOfDays;
        next()
    } catch (err) {
        next(err)
    }
}