const {Router} = require("express");
const roomController = require("../controllers/room.controller");
const authMiddleware = require('../middelware/auth.middleware.js');

const router = Router();

router.get('/:id/get-available-rooms', roomController.getAllRooms);

module.exports = router;