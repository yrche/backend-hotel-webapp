const {Room, Booking, RoomType} = require("../models/modeles");
const ApiError = require("../exeptions/api.error");
const {Op} = require("sequelize");

class RoomAvailability {
    async validateRoomType(id) {
        const rooms = await RoomType.findAll({
            where: {
                id: id
            }
        })
        if (rooms.length <= 0) {
            throw ApiError.BadRequest(`Room type with id: ${id} doesnt exists`)
        }

        return rooms
    }

    async verifyRoomAvailability(NewCheckInDate, NewCheckOutDate) {
        const dateOverlaps = await Booking.findAll({
            where: {
                checkInDate: {
                    [Op.lte]: NewCheckOutDate
                },
                checkOutDate: {
                    [Op.gte]: NewCheckInDate
                }
            }
        })

        return dateOverlaps.map((e) => e.dataValues.room)
    }

    async validateNumberOfGuests(id, capacity) {
        const numberOfGuests = await RoomType.findAll({
            where: {
                id: id,
                capacity: {
                    [Op.gte]: capacity
                }
            }
        })

        if (numberOfGuests.length <= 0) {
            throw ApiError.BadRequest(`Unacceptable number of guests`)
        }

        return numberOfGuests;
    }
}

module.exports = new RoomAvailability()