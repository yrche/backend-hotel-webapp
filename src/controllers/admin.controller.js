const adminService = require("../services/admin.service");


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
}

module.exports = new AdminController();