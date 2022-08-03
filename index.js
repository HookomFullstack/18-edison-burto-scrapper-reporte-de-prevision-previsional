const puppeteer      = require('puppeteer');
const { connectDB }  = require('./DB/connectDB');
const { documentos } = require("./helpers/leerDocumentos");
const { saveUser }   = require('./helpers/saveUser');
const colors         = require('colors'); 

connectDB();

const scrap = async() => {

    let recorrido = 0;
    let numUser   = 1;
    const formPaterno       = '#ctl00_ContentPlaceHolder1_txtAp_pat';
    const formMaterno       = '#ctl00_ContentPlaceHolder1_txtAp_mat';
    const formPrimerNombre  = '#ctl00_ContentPlaceHolder1_txtPri_nom';
    const formSegundoNombre = '#ctl00_ContentPlaceHolder1_txtSeg_nom';
    
    const browser = await puppeteer.launch({
        headless: false,
        args: ['--start-maximized', '--disable-notifications', '--disable-infobars', '--disable-extensions', '--disable-gpu', '--disable-dev-shm-usage', '--no-sandbox']
        // max screen
        , defaultViewport: {
            width: 1920,
            height: 1080
        }
    });

    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(0);
    page.setDefaultTimeout(0);
    
    await page.goto('https://servicios.sbs.gob.pe/ReporteSituacionPrevisional/Afil_Consulta.aspx');
    await page.waitForSelector('#ctl00_ContentPlaceHolder1_RadioButton2');
    await page.click('#ctl00_ContentPlaceHolder1_RadioButton2');
    await page.waitForSelector('#cphContent_div_dni2');
    await page.waitForTimeout(2000);

    for (const usuario of documentos) {
        // verifica si el txt es valido
        if (usuario === null) {
            console.log(`Corregir estructura del usuario ${numUser} txt `.red +  
            `
apellidoPaterno/apellidoMaterno/primerNombre/segundoNombre/documento 

(segundo nombre opcional)`.yellow);
            numUser++;
            continue; 
        }

        if (isNaN(usuario.documento)) {
            console.log(`El documento ${usuario.documento} de la linea ${numUser} no es un número, por favor revisar el txt`.red);
            numUser++;
            continue;
        };  

        console.log(`${numUser} - ${usuario.primerNombre} ${usuario.documento}`);

        if(recorrido > 0) { 
            await page.goto('https://servicios.sbs.gob.pe/ReporteSituacionPrevisional/Afil_Consulta.aspx')
            await page.waitForSelector('#ctl00_ContentPlaceHolder1_RadioButton2');
            await page.click('#ctl00_ContentPlaceHolder1_RadioButton2');
            await page.waitForSelector('#cphContent_div_dni2');
            await page.waitForTimeout(2000);
            recorrido = 0;
        };
        // apellido paterno
        await page.type(formPaterno, `${usuario.apellidoPaterno}`);    
        
        // apellido materno
        await page.type(formMaterno, `${usuario.apellidoMaterno}`);   
        
        // primer nombre
        await page.type(formPrimerNombre, `${usuario.primerNombre}`);
        
        // segundo nombre (opcional)
        usuario.segundoNombre && await page.type(formSegundoNombre, `${usuario.segundoNombre}`);

        await page.click('#ctl00_ContentPlaceHolder1_btnBuscar')
        
        // verifica si encuentra el usuario
        let error = false;
        await page.waitForTimeout(8000);

        const err = await page.$('#ctl00_ContentPlaceHolder1_lblErrorTxt');        
        if(err) error = await page.$eval('#ctl00_ContentPlaceHolder1_lblErrorTxt', el => el.innerText);
        
        if(error == 'No se encontraron resultados') {
            await page.evaluate( () => document.getElementById('ctl00_ContentPlaceHolder1_txtAp_pat' ).value = "")
            await page.evaluate( () => document.getElementById('ctl00_ContentPlaceHolder1_txtAp_mat' ).value = "")
            await page.evaluate( () => document.getElementById('ctl00_ContentPlaceHolder1_txtPri_nom').value = "")
            await page.evaluate( () => document.getElementById('ctl00_ContentPlaceHolder1_txtSeg_nom').value = "")
            console.log(`${usuario.documento} no encontrado`.red);
            recorrido++;
            continue;
        }

        // -------

        await page.waitForSelector('#tb_nom');
        const verificarIdentificaciones = await page.$$('#tb_nom');
        
        for (const id of verificarIdentificaciones) {

            const textId = await id.$eval('#tb_nom > td:nth-child(2) > span', el => el.innerText);

            if (textId == usuario.documento) {
                console.log(`usuario ${usuario.documento} encontrado`.green);
                // da click
                await id.$eval('td:nth-child(4) > input', el => el.click());
                break;
            }

        }

        await page.waitForSelector('#ctl00_ContentPlaceHolder1_Label1');
        const nombre                 = await page.$eval('#ctl00_ContentPlaceHolder1_Label2', el => el.innerText);
        const dni                    = await page.$eval('#ctl00_ContentPlaceHolder1_Label1', el => el.innerText.split(' ')[1]);
        const afiliadoDesde          = await page.$eval('#ctl00_ContentPlaceHolder1_lblFec_ing', el => el.innerText);
        const afiliadoA              = await page.$eval('#ctl00_ContentPlaceHolder1_lblAfp_act', el => el.innerText);
        const fechaNacimiento        = await page.$eval('#ctl00_ContentPlaceHolder1_lblFecNac', el => el.innerText);
        const codigoSPP              = await page.$eval('#ctl00_ContentPlaceHolder1_lblCod_afi', el => el.innerText);
        const situacionActual        = await page.$eval('#ctl00_ContentPlaceHolder1_lblSituacion', el => el.innerText);
        const fechaDevengue          = await page.$eval('#ctl00_ContentPlaceHolder1_lblFec_dev', el => el.innerText);

        await page.screenshot({path: `./screenshots/${usuario.documento}.png`});

        await saveUser({
            nombre,
            dni,
            afiliadoDesde,
            afiliadoA,
            fechaNacimiento,
            codigoSPP,
            situacionActual,
            fechaDevengue,
            screenshot: `./screehnshots/${usuario.documento}.png`
        })

        // toma screenshot 
        recorrido = 1;
        numUser++;
    }
}

scrap()