const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const logController = require('../controllers/logController');

router.get('/logs', authMiddleware, logController.obtenerLogs);

module.exports = router;
