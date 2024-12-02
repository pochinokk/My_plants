const {Schema, model} = require('mongoose');

const customerSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    full_name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    role: {
        type: String,
        default: 'USER',
        required: true,
    }
});

module.exports = model('Customer', customerSchema);



