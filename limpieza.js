const { connectDB } = require("./DB/connectDB");
const { eliminarDB } = require("./helpers/eliminarDB");

connectDB();
eliminarDB();