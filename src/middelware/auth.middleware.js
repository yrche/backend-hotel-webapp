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

        req.user = userData.id;
        res.user = userData;
        next();
    } catch (err) {
        return next(ApiError.Unauthorized())
    }
}