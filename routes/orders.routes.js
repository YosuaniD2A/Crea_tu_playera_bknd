var express = require('express');
const { updateStatus } = require('../controllers/orders.controller');
var router = express.Router();

router.put('/updateStatus/:orderID', updateStatus);


module.exports = router;
