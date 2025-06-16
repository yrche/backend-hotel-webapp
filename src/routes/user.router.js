const {Router} = require('express');
const {UserController} = require("../controllers/user.controller");
const {body} = require('express-validator');
const router = Router();
const userController = new UserController();

router.post('/signup', [
    body('email').isEmail(),
    body('password').isLength({min: 4, max: 20}),
    body('user_name', 'Username cannot be empty').notEmpty()
], userController.registration);
router.post('/signin', userController.login);
router.post('/logout', userController.logout);
router.get('/activate/:link', userController.activate);
router.get('/refresh', userController.refresh);

module.exports = router;