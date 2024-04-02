const { base64EncodeRFC2045 } = require("../helpers/util");
const axios = require('axios');
const { createOrderKornitXModel, getOrderKornitXModel, updateOrderKornitXModel } = require("../models/orders.model");
const mongoose = require('mongoose');

const updateStatus = async (req, res) => {
    try {
        const orderID = req.params.orderID
        const { id, external_ref, ref, status, status_name, shipping_tracking, shipping_method, shipping_carrier } = req.body;

        // Verificar si todos los campos requeridos están presentes
        if (!(id && external_ref && ref && status && status_name && shipping_tracking && shipping_method && shipping_carrier)) {
            return res.status(400).json({ error: 'El cuerpo de la solicitud no tiene la estructura esperada.' });
        }

        //Make Order as Shipped in Shipstation
        if (status === 8) {
            const authorizationToken = base64EncodeRFC2045(process.env.SHIP_API_KEY, process.env.SHIP_API_SECRET);
            const payload = {
                orderId: orderID,
                carrierCode: shipping_carrier,
                shipDate: new Date().toISOString().split('T')[0],
                trackingNumber: shipping_tracking,
                notifyCustomer: true,
                notifySalesChannel: true
            };

            console.log(payload);
            axios.post(process.env.SHIP_URL_MARKASSHIPPED, payload, {
                headers: {
                    'Authorization': `Basic ${authorizationToken}`,
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                console.error('Error:', error.response ? error.response.data : error.message);
            });
        }

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

module.exports = {
    updateStatus
}

