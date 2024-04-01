const db = require('../config/db.config').promise();

/*----------------------------- SQL Queries ---------------------------------------------- */

const getOrderKornitXModel = (order_id) => {
    return db.query("SELECT * FROM ctp_orders_kornitx WHERE order_id = ?", [order_id]);
}

const createOrderKornitXModel = (data) => {
    return db.query(
        `INSERT INTO ctp_orders_kornitx 
            (ctp_id, external_ref, ref, status, status_name, shipping_tracking, shipping_method, shipping_carrier, order_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
         [data.ctp_id, data.external_ref, data.ref, data.status, data.status_name, data.shipping_tracking, data.shipping_method, data.shipping_carrier, data.order_id]);
}

const updateOrderKornitXModel = (data, order_id) => {
    const fieldsToUpdate = Object.keys(data).map(key => `${key} = ?`).join(', ');

    return db.query(`UPDATE ctp_orders_kornitx SET ${fieldsToUpdate} WHERE order_id = ?`,
        [...Object.values(data), order_id]);
}

module.exports = {
    getOrderKornitXModel,
    createOrderKornitXModel,
    updateOrderKornitXModel
}