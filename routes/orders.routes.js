var express = require('express');
const { updateStatus } = require('../controllers/orders.controller');
var router = express.Router();

router.post('/updateStatus/:orderID', updateStatus);


module.exports = router;
