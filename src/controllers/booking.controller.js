const bookingService = require('../services/booking.service');

class BookingController {
    async bookApartments(req, res, next) {
        try {
            const {room, checkInDate, checkOutDate, totalPrice} = req.body;
            const user = req.user;
            const book = await bookingService.bookApartments(user, room, checkInDate, checkOutDate, totalPrice);
            res.json(book);
        } catch (err) {
            next(err)
        }
    }

    async changeReservation(req, res, next) {
        try {
            const data = req.body;
            const id = req.params.id;
            const book = await bookingService.changeReservation(id, data);
            res.json(book);
        } catch (err) {
            next(err)
        }
    }

    async deleteReservation(req, res, next) {
        try {
            const id = req.params.id;
            await bookingService.deleteReservation(id)
            res.json({message: `Booking with id ${id} has been deleted`})
        } catch (err) {
            next(err)
        }
    }

    async getAllUserReservation(req, res, next) {
        try {
            const user = req.user;
            const userReservation = await bookingService.getAllUserReservation(user);
            res.json(userReservation);
        } catch (err) {
            next(err)
        }
    }
}

module.exports = new BookingController()