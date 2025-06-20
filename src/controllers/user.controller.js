const {validationResult} = require('express-validator');
const userService = require('../services/user.service.js');
const ApiError = require('../exeptions/api.error.js');

class UserController {
    async registration(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Validation error', errors.array()))
            }
            const {user_name, email, password} = req.body
            const userData = await userService.registration(user_name, email, password);
            res.cookie('refreshToken', userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
                secure: true
            });

            return res.json(userData)
        } catch (err) {
            next(err)
        }
    }

    async login(req, res, next) {
        try {
            const {email, password} = req.body
            const userData = await userService.login(email, password);
            res.cookie('refreshToken', userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
                secure: true
            });

            return res.json(userData)
        } catch (err) {
            next(err)
        }
    }

    async logout(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const token = await userService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.json(token);
        } catch (err) {
            next(err)
        }
    }

    async activate(req, res, next){
        try {
            await userService.activate(req.params.link)
                .then(() => {
                    res.redirect(process.env.CLIENT_API)
                })
                .catch()
        } catch (err) {
            next(err)
        }
    }

    async refresh(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const userData = await userService.refresh(refreshToken)
            res.cookie('refreshToken', userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true
            });
            return res.json(userData)
        } catch (err) {
            next(err)
        }
    }
}


module.exports = {
    UserController
};