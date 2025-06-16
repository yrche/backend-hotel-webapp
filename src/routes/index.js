const Router = require('express')
const userRouter = require('./user.router.js');
const adminRouter = require('./admin.router.js')
const router = new Router()

router.use('/auth', userRouter);
router.use('/admin', adminRouter);

module.exports = router;
