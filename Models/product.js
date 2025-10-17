const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: String,
    details:{
        type: String,
    },
    price: {
        type: Number,
    }
}, {timestamps: true});

module.exports = mongoose.model('prodcts',productSchema)