const {Schema, model} = require('mongoose');

const orderSchema = new Schema({
    customer_id: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
    products: [{
        name: { type: String, required: true },
        quantity: { type: Number, required: true }
    }]
});

module.exports = model('Order', orderSchema);


