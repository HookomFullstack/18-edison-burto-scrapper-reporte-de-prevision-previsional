const fs = require('fs');

const documentos = fs.readFileSync('documentos.txt')
    .toString()
    .split('\n')
    .map(doc => doc.split('/'))
    .map(doc => {

        if (doc.length === 4) 
        
        return  {
            apellidoPaterno: doc[0],
            apellidoMaterno: doc[1],
            primerNombre:    doc[2],
            documento:       doc[3]
        }
        if (doc.length === 5)
        
        return  {
            apellidoPaterno: doc[0],
            apellidoMaterno: doc[1],
            primerNombre:    doc[2],
            segundoNombre:   doc[3],
            documento:       doc[4]
        }

        return null;
})

module.exports = { documentos };