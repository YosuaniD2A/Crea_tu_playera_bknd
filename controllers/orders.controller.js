const { createOrderKornitXModel, getOrderKornitXModel, updateOrderKornitXModel, getKornitXResponsesModel, updateOrderSwiftPodModel, createOrderSwiftPodModel, getOrderSwiftPodModel } = require("../models/orders.model");

const updateStatus = async (req, res) => {
    try {
        const orderID = req.params.orderID
        const { id, external_ref, ref, status, status_name, shipping_tracking, shipping_method, shipping_carrier } = req.body;

        //Save KornitX Data in Railway DB
        const data = {
            ctp_id: id,
            external_ref,
            ref,
            status,
            status_name,
            shipping_tracking,
            shipping_method,
            shipping_carrier,
            order_id: orderID
        }

        const [exist] = await getOrderKornitXModel(orderID);
        let resulOrder;

        if (exist.length > 0) {
            await updateOrderKornitXModel(data, orderID);
            resulOrder = `La orden ${orderID} fue actualizada`
        } else {
            await createOrderKornitXModel(data);
            resulOrder = `Se inserto la orden ${orderID}`
        }         

        res.send({
            orderID,
            resulOrder
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: error.message,
        });
    }
}

const notifyOrderStatusSwiftPod = async (req, res) => {
    try {
        const { event, data } = req.body;
        const orderStatus = {
            order_id: data.order_id,
            swiftpod_id: data.id,
            status: data.status,
            date_change: event.timestamp
        }

        const [exist] = await getOrderSwiftPodModel(orderStatus.order_id);
        let resulOrder;

        if (exist.length > 0) {
            await updateOrderSwiftPodModel(orderStatus, orderStatus.order_id);
            resulOrder = `La orden ${orderStatus.order_id} fue actualizada`
        } else {
            await createOrderSwiftPodModel(orderStatus);
            resulOrder = `Se inserto la orden ${orderStatus.order_id}`
        } 

        res.send({
            orderID: orderStatus.order_id,
            resulOrder
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: error.message,
        });
    }
}

const notifyOrderTrackingSwiftPod = async (req, res) => {
    try {
        const { event, data } = req.body;
        const orderShipment = {
            tracking_number: event.tracking.tracking_number,
            tracking_status: event.tracking.tracking_status,
            tracking_code: event.tracking.carrier_code,
            tracking_url: event.tracking.tracking_url,
            date_tracking: event.timestamp
        };

        const [result] = await updateOrderSwiftPodModel(orderShipment, data.order_id);
        if(result.affectedRows == 0){
            res.send({
                orderID: data.order_id,
                resulOrder: 'No se encontraron coincidencias'
            });
        }else{
            res.send({
                orderID: data.order_id,
                resulOrder: `La orden ${data.order_id} fue actualizada`
            });
        }        

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: error.message,
        });
    }
}


module.exports = {
    updateStatus,
    notifyOrderStatusSwiftPod,
    notifyOrderTrackingSwiftPod
}

