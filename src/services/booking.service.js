const {User, Booking, Room, RoomType} = require("../models/modeles");
const ApiError = require('../exeptions/api.error');
const additionalService = require('./additional.service.js');
const {Op} = require("sequelize");
const BookingDto = require('../dtos/booking.dto');

class BookingService {
    async bookApartments(user, roomNumber, checkInDate, checkOutDate, totalPrice) {
        const userId = await User.findOne({where: {id: user}})
        if (!userId) {
            throw ApiError.BadRequest('User not found')
        }

        const booking = await Booking.create({
            user: user,
            room: roomNumber,
            checkInDate,
            checkOutDate,
            totalPrice
        });

        const bookingDto = new BookingDto(booking);
        return {booking: bookingDto};
    }

    async calculateTotalPrice(checkInDate, checkOutDate, roomNumber) {
        const room = await Room.findOne({where: {id: roomNumber}})

        const roomType = await RoomType.findOne({where: {id: room.type}})
        if (!roomType) {
            throw ApiError.BadRequest(`No such room type with number: ${roomNumber.type}`)
        }

        const numberOfNights = await additionalService.calculateNumberOfNights(checkInDate, checkOutDate)
        return numberOfNights * roomType.pricePerNight
    }

    async verifyUserDates(id, NewCheckInDate, NewCheckOutDate, roomNumber) {
        const room = await Room.findOne({where: {id: roomNumber}})
        if (!room) {
            throw ApiError.BadRequest(`No such room with number: ${roomNumber}`)
        }

        const booking = await Booking.findOne({where: {id}})
        if (!booking) {
            throw ApiError.BadRequest(`No such reservation with id: ${id}`)
        }

        const conflictingBooking = await Booking.findAll({
            where: {
                room: roomNumber,
                checkInDate: {
                    [Op.lte]: NewCheckOutDate
                },
                checkOutDate: {
                    [Op.gte]: NewCheckInDate
                },
                id: {
                    [Op.ne]: id
                }
            }
        })

        if (conflictingBooking.length > 0) {
            throw ApiError.BadRequest('This dates are busy')
        }

        return {
            NewCheckInDate,
            NewCheckOutDate,
            roomNumber
        }
    }

    async ensureDatesIsAvailable(NewCheckInDate, NewCheckOutDate, roomNumber) {
        const room = await Room.findOne({where: {id: roomNumber}})
        if (!room) {
            throw ApiError.BadRequest(`No such room with number: ${roomNumber}`)
        }

        const conflictingBooking = await Booking.findAll({
            where: {
                room: roomNumber,
                checkInDate: {
                    [Op.lte]: NewCheckOutDate
                },
                checkOutDate: {
                    [Op.gte]: NewCheckInDate
                }
            }
        })

        if (conflictingBooking.length > 0) {
            throw ApiError.BadRequest('This dates are busy')
        }

        return {
            NewCheckInDate,
            NewCheckOutDate,
            roomNumber
        }
    }

    async changeReservation(id, data) {
        const booking = await Booking.findOne({where: {id}})
        if (!booking) {
            throw ApiError.BadRequest(`No such reservation with id: ${id}`);
        }

        for (const key in data) {
            await booking.update({[key]: data[key]});
        }

        const bookingDto = new BookingDto(booking);
        return {booking: bookingDto};
    }

    async deleteReservation(id) {
        const bookingId = await Booking.findOne({where: {id}})
        if (!bookingId) {
            throw ApiError.BadRequest(`No such reservation with id: ${id}`)
        }

        return await bookingId.destroy({force: true});
    }

    async getAllUserReservation(user) {
        const userBooking = await Booking.findAll({where: {user}})
        if (userBooking <= 0) {
            throw ApiError.BadRequest('The user has no reservations yet')
        }

        return userBooking;
    }

    async getReservationDates(id) {
        const reservationId = await Booking.findOne({where: {id}})
        if (!reservationId) {
            throw ApiError.BadRequest(`No such reservation with id: ${id}`)
        }

        return reservationId.checkInDate
    }
}

module.exports = new BookingService()