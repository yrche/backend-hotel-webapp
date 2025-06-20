const adminService = require("../services/admin.service");
const roomService = require('../services/room.service');
const bookingService = require("../services/booking.service");

class AdminController {

    async getUsers(req, res, next) {
        try {
            const users = await adminService.getUsers();
            res.json(users)
        } catch (err) {
            next(err)
        }
    }

    async promoteUserRole(req, res, next) {
        try {
            const id = req.params.id;
            const user = await adminService.promoteUserRole(id);
            res.json(user);
        } catch (err) {
            next(err)
        }
    }

    async demoteUserRole(req, res, next) {
        try {
            const id = req.params.id;
            const user = await adminService.demoteUserRole(id);
            res.json(user);
        } catch (err) {
            next(err)
        }
    }

    async addRoomType(req, res, next) {
        try {
            const {name, description, pricePerNight, capacity} = req.body;
            const roomType = await roomService.addRoomType(name, description, pricePerNight, capacity)
            res.json(roomType);
        } catch (err) {
            next(err)
        }
    }

    async changeRoomType(req, res, next) {
        try {
            const id = req.params.id;
            const data = req.body;
            const roomType = await roomService.changeRoomType(id, data);
            res.json(roomType);
        } catch (err) {
            next(err)
        }
    }

    async deleteRoomType(req, res, next) {
        try {
            const id = req.params.id;
            const roomType = await roomService.deleteRoomType(id);
            res.json({message: `Room Type with id: ${roomType.id} has been deleted`})
        } catch (err) {
            next(err)
        }
    }

    async getRoomTypes(req, res, next) {
        try {
            const roomTypes = await roomService.getRoomTypes();
            res.json(roomTypes)
        } catch (err) {
            next(err)
        }
    }

    async addRoom(req, res, next){
        try {
            const {type} = req.body;
            const room = await roomService.addRoom(type);
            res.json(room);
        } catch (err) {
            next(err)
        }
    }

    async changeRoomStatus(req, res, next) {
        try {
            const id = req.params.id;
            const {status} = req.body;
            const room = await roomService.changeRoomStatus(id, status);
            res.json(room)
        } catch (err) {
            next(err)
        }
    }

    async changeUserReservation(req, res, next) {
        try {
            const data = req.body;
            const id = req.params.id;
            const book = await bookingService.changeReservation(id, data);
            res.json(book);
        } catch (err) {
            next(err)
        }
    }

    async deleteUserReservation(req, res, next) {
        try {
            const id = req.params.id;
            await bookingService.deleteReservation(id);
            res.json({message: `Booking with id ${id} has been deleted`})
        } catch (err) {
            next(err)
        }
    }
}

module.exports = new AdminController();