const jwt = require('jsonwebtoken');
const {Token} = require('../models/modeles.js');

class TokenService {
    generateToken(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '15m'});
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '30d'})
        return {
            accessToken,
            refreshToken
        }
    }

    validAccessToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        } catch (err) {
            return null
        }
    }

    validRefreshToken(token) {
        try {
            return jwt.verify(token, process.env.JWT_REFRESH_SECRET)
        } catch (err) {
            return null
        }
    }

    async saveToken(user, refreshToken) {
        const tokenData = await Token.findOne({where: {user}});
        if (tokenData) {
            tokenData.refreshToken = refreshToken;
            return tokenData.update({ refreshToken });
        }
        return await Token.create({user: user, refreshToken: refreshToken});
    }

    async removeToken(refreshToken) {
        const token = await Token.findOne({where: {refreshToken}})
        await token.destroy({force: true})
        return token;
    }

    async findToken(refreshToken) {
        return await Token.findOne({where: {refreshToken}});
    }

    decodeToken(accessToken) {
        const tokenData = jwt.decode(accessToken);
        return tokenData || null;
    }
}

module.exports = new TokenService();