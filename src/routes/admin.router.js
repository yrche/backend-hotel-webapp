const adminController = require('../controllers/admin.controller.js');
const {Router} = require('express');
const authMiddleware = require('../middelware/auth.middleware.js');
const checkMiddleware = require('../middelware/check.middleware.js');

const router = Router();

router.get('/users', checkMiddleware, adminController.getUsers);
router.patch('/users/:id/promote', checkMiddleware, adminController.promoteUserRole);
router.patch('/users/:id/demote', checkMiddleware, adminController.demoteUserRole);

module.exports = router;