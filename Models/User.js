const mongoose = require('mongoose');

// schema
const usersSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    dni: {
        type: String,
        required: true
    },
    afiliadoDesde: {
        type: String,
        required: true
    },
    afiliadoA: {
        type: String,
        required: true
    },
    fechaNacimiento: {
        type: String,
        required: true
    },
    codigoSPP: {
        type: String,
        required: true
    },
    situacionActual: {
        type: String,
        required: true
    },
    fechaDevengue: {
        type: String,
        required: true
    },
    screenshot: {
        type: String,
    }
});

module.exports = mongoose.model('User', usersSchema);