const User = require("../Models/User");

const eliminarDB = async() => {
    // eliminar toda la bd
    return await User.deleteMany({});
}


module.exports = { eliminarDB };