const {User} = require("../models/modeles.js");
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const mailService = require("./mail.service");
const UserDto = require("../dtos/user.dto");
const tokenService = require("./token.service");
const ApiError = require('../exeptions/api.error.js');

class UserService {
    async registration(user_name, email, password) {
        const candidate = await User.findOne({where: {email}});
        if (candidate) {
            throw ApiError.BadRequest("User with this email already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 5);
        const activationLink = uuid.v4();

        const user = await User.create({user_name, password: hashedPassword, email, activationLink});
        await mailService.sendActivationMail(email, `${process.env.API_URL}/api/auth/activate/${activationLink}`);

        const userDto = new UserDto(user);
        const token = tokenService.generateToken({...userDto});
        await tokenService.saveToken(userDto.id, token.refreshToken);

        return{...token, user: userDto}
    }

    async login(email, password) {
        const user = await User.findOne({where: {email}});
        if (!user) {
            throw ApiError.BadRequest(`User with email address ${email} is not exists`);
        }
        let comparePasswords = bcrypt.compareSync(password, user.password);
        if (!comparePasswords) {
            throw ApiError.BadRequest("Wrong password");
        }
        const userDto = new UserDto(user)
        const token = tokenService.generateToken({...userDto});
        await tokenService.saveToken(userDto.id, token.refreshToken);

        return {...token, user: userDto}
    }

    async logout(refreshToken) {
        return await tokenService.removeToken(refreshToken);
    }

    async activate(activationLink){
        const user = await User.findOne({where: {activationLink}});
        if (!user) {
            throw ApiError.BadRequest("Invalid link");
        }
        await user.update({isActivated: true})
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.Unauthorized();
        }
        const userData = tokenService.validRefreshToken(refreshToken);
        const tokenData = await tokenService.findToken(refreshToken);
        if (!userData || !tokenData) {
            throw ApiError.Unauthorized();
        }
        const user = await User.findByPk(tokenData.user)

        const userDto = new UserDto(user);
        const token = tokenService.generateToken({...userDto});

        await tokenService.saveToken(userDto.id, token.refreshToken);
        return{...token, user: userDto}
    }
}

module.exports = new UserService();