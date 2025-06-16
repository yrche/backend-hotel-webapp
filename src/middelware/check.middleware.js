const ApiError = require('../exeptions/api.error.js');
const tokenService = require('../services/token.service.js');

module.exports = function (req, res, next) {
    try {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            return next(ApiError.Unauthorized());
        }

        const accessToken = authorizationHeader.split(' ')[1];
        if (!accessToken) {
            return next(ApiError.Unauthorized());
        }

        const userData = tokenService.validAccessToken(accessToken);
        if (!userData) {
            return next(ApiError.Unauthorized());
        }

        const tokenData = tokenService.decodeToken(accessToken);
        if (tokenData.role !== process.env.ADMIN_ROLE) {
            return next(ApiError.BadRequest("Permission denied"))
        }

        next();
    }
    catch (err) {
        return next(ApiError.Unauthorized());
    }
}

