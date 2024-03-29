const { base64EncodeRFC2045 } = require("../helpers/util");
const axios = require('axios');

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
                Mark_as_Shipped = error.message || error.response.Message;
                console.error('Error:', error.response ? error.response.data : error.message);
            });
        }
        
        //Save KornitX Data in Railway DB

        //Update Database in MongoDB

        res.send({
            orderID,
        });

    } catch (error) {
        res.status(500).json({
            msg: error.message,
        });
    }
}

module.exports = {
    updateStatus
}

