const roomService = require('../services/room.service');

class RoomController {
    async getAllRooms(req, res, next) {
        try {
            const {checkInDate, checkOutDate, capacity} = req.body;
            const id = req.params.id;
            const rooms = await roomService.getAvailableRooms(id, checkInDate, checkOutDate, capacity)
            res.json(rooms);
        } catch (err) {
            next(err)
        }
    }
}

module.exports = new RoomController()