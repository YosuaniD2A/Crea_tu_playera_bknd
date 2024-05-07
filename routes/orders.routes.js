var express = require('express');
const { updateStatus, notifyOrderStatusSwiftPod, notifyOrderTrackingSwiftPod } = require('../controllers/orders.controller');
var router = express.Router();

router.put('/updateStatus/:orderID', updateStatus);

router.post('/notifyOrderStatusSwiftPod/', notifyOrderStatusSwiftPod)

router.post('/notifyOrderTrackingSwiftPod/', notifyOrderTrackingSwiftPod)



module.exports = router;
