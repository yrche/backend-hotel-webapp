const {RoomType, Room, Booking} = require("../models/modeles");
const ApiError = require("../exeptions/api.error");
const roomAvailability = require('../helpers/room.availability');
const RoomDto = require('../dtos/room.dto');
const {Op} = require("sequelize");
const {sequelize} = require("../database/db.create");


class RoomService {
    async addRoomType(name, description, pricePerNight, capacity) {
        const roomType =  await RoomType.findOne({where: {name}});
        if (roomType) {
            throw ApiError.BadRequest(`Room type with name ${name} exists`);
        }

        return await RoomType.create({name, description, pricePerNight, capacity});
    }

    async changeRoomType(id, data) {
        const roomTypeId = await RoomType.findOne({where: {id}});
        if (!roomTypeId) {
            throw ApiError.BadRequest(`Room type with ${id} not found`);
        }

        if (roomTypeId.name === data.name) {
            throw ApiError.BadRequest(`Room with name ${data.name} exists`);
        }

        for (const key in data) {
            if (key === 'name') {
                const roomType = await RoomType.findOne({where: {[key]: data[key]}})
                if (roomType) {
                    throw ApiError.BadRequest(`Room type with ${key}: ${data[key]} already exists`)
                }
            }
            await roomTypeId.update({[key]: data[key]});
        }

        return roomTypeId;
    }

    async deleteRoomType(id) {
        const roomType = await RoomType.findOne({where: {id}});
        if (!roomType) {
            throw ApiError.BadRequest(`Room type with ${id} not found`);
        }

        return await roomType.destroy({force: true})
    }

    async getRoomTypes() {
        return await RoomType.findAll();
    }

    async addRoom(type) {
        const roomType = await RoomType.findOne({where: {id: type}});
        if (!roomType) {
            throw ApiError.BadRequest(`Room type with ${type} not found`);
        }

        return await Room.create({type})
    }

    async changeRoomStatus(id, status) {
        const room = await Room.findOne({where: {id}});
        if (!room) {
            throw ApiError.BadRequest(`Room with id: ${id} not found`);
        }

        return await room.update({status: status})
    }

    async getAvailableRooms(id, NewCheckInDate, NewCheckOutDate, capacity) {
        const roomTypeAvailability = await roomAvailability.validateRoomType(id);
        await roomAvailability.validateNumberOfGuests(id, capacity);
        const overlaps = await roomAvailability.verifyRoomAvailability(NewCheckInDate, NewCheckOutDate)

        const rooms = (await Room.findAll({
            where: {
                type: id,
                id: {
                    [Op.notIn]: overlaps
                }
            },
        })).map((e) => e.dataValues.id)

        if (rooms.length <= 0) {
            throw ApiError.BadRequest(`There are no rooms available on these dates`)
        }

        return rooms.map((value) => {
            let exception = roomTypeAvailability[0].dataValues
            return {
                id: value, roomType: exception.name, description: exception.description,
                pricePerNight: exception.pricePerNight, capacity: exception.capacity,
            }
        })
    }
}

module.exports = new RoomService();