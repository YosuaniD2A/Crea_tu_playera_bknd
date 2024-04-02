var express = require('express');
const { updateStatus, getKornitXResponses } = require('../controllers/orders.controller');
var router = express.Router();

router.post('/updateStatus/:orderID', updateStatus);

router.get('/getKornitXResponses/', getKornitXResponses);


module.exports = router;
