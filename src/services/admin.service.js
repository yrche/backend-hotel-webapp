const {User} = require('../models/modeles.js');
const ApiError = require('../exeptions/api.error.js');
const {RoomType, Booking} = require("../models/modeles");

class AdminService {
    async getUsers() {
        return await User.findAll();
    }

    async promoteUserRole(id) {
        const user = await User.findOne({where: {id}});
        if (!user) {
            throw ApiError.BadRequest(`No user with such id ${id}`)
        }

        return await user.update({role: process.env.ADMIN_ROLE});
    }

    async demoteUserRole(id) {
        const user = await User.findOne({where: {id}});
        if (!user) {
            throw ApiError.BadRequest(`No user with such id ${id}`)
        }

        return await user.update({role: "USER"});
    }

    async getAllReservations() {
        return await Booking.findAll()
    }
}

module.exports = new AdminService();