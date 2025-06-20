const Router = require('express')
const userRouter = require('./user.router.js');
const adminRouter = require('./admin.router.js')
const bookingRouter = require('./booking.router');
const roomRouter = require('./room.router')
const checkMiddleware = require("../middelware/check.middleware");
const authMiddleware = require("../middelware/auth.middleware");

const router = new Router()

router.use('/auth', userRouter);
router.use('/admin', checkMiddleware, adminRouter);
router.use('/reservation', authMiddleware, bookingRouter);
router.use('/suites', authMiddleware, roomRouter)

module.exports = router;
