const User = require("../Models/User")
const colors = require("colors");
const { saveExcel } = require("./saveExcel");
const saveUser = async(
    {
        nombre,
        dni,
        afiliadoDesde,
        afiliadoA,
        fechaNacimiento,
        codigoSPP,
        situacionActual,
        fechaDevengue,
        screenshot
    }) => {


    const newUser = new User({
        nombre,
        dni,
        afiliadoDesde,
        afiliadoA,
        fechaNacimiento,
        codigoSPP,
        situacionActual,
        fechaDevengue,
        screenshot
    });

    // verifica si el usuario existe
    const user = await User.findOne({ dni });
    if (user) {
        console.log(`${dni} este usuario ya existe en la base de datos`.yellow);
        return false;
    }
    await newUser.save();

    const allUser = await User.find({});
    await saveExcel(allUser);

    return console.log(`Excel y usuario ${nombre} guardado con exito`.green);
}

module.exports = {saveUser}