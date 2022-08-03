const ExcelJS = require('exceljs');

const saveExcel = async(data) => {
    const workbook = new ExcelJS.Workbook();

    const fileName = 'documentos.xlsx';
    const sheet = workbook.addWorksheet('Documentos');


    const reColumns = [
        { header: 'Nombre completo',     key: 'nombre' },
        { header: 'DNI',                 key: 'dni' },
        { header: 'Afiliado desde',      key: 'afiliadoDesde' },
        { header: 'Afiliado a',          key: 'afiliadoA' },
        { header: 'Fecha de nacimiento', key: 'fechaNacimiento' },
        { header: 'Codigo SPP',          key: 'codigoSPP' },
        { header: 'Situacion actual',    key: 'situacionActual' },
        { header: 'Fecha devengue',      key: 'fechaDevengue' },
        { header: 'Foto',                key: 'screenshot' }
    ];

    sheet.columns = reColumns;

    sheet.addRows(data);

    workbook.xlsx.writeFile(fileName).then(() => {
        console.log(`Excel guardado con exito`.green);
    });
}

module.exports = { saveExcel };