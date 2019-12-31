// --- Data Models ------------------
    import { GsuiteName, GsuiteUser, GsuiteOrganizations } from './DataModel';
    import { GsuiteRelations, GsuiteAddresses, GsuitePhones } from './DataModel';
    import { GsuiteGender, CustomSchemas } from './DataModel';
// --- Global Variables -------------
    const url = 'https://us-central1-g-escolar-plus-demo.cloudfunctions.net/addGsuiteUsers';
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Estudiantes');
    const data = sheet.getRange(2, 1, sheet.getLastRow()-1, sheet.getLastColumn()).getValues();
    Logger.log('Data:');
    Logger.log(data);
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues();

    // --- Colmunas a tener en cuenta ---
    const Apellido1Index = headers[0].indexOf('Apellido1');
    const Apellido2Index = headers[0].indexOf('Apellido2');
    const Nombre1Index = headers[0].indexOf('Nombre1');
    const Nombre2Index = headers[0].indexOf('Nombre2');
    const FechaNacimientoIndex = headers[0].indexOf('Fecha de nacimiento');
    const EmailIndex = headers[0].indexOf('Email');
    const PasswordIndex = headers[0].indexOf('Password');
    const RolIndex = headers[0].indexOf('Rol');
    const DocTipoIndex = headers[0].indexOf('Doc Tipo');
    const DocNumIndex = headers[0].indexOf('Doc Num');
    const SedeIndex = headers[0].indexOf('Sede');
    const JornadaIndex = headers[0].indexOf('Jornada');
    const GradoIndex = headers[0].indexOf('Grado');
    const GrupoIndex = headers[0].indexOf('Grupo');
    const DireccionIndex = headers[0].indexOf('Direccion');
    const BarrioIndex = headers[0].indexOf('Barrio');
    const MunicipioIndex = headers[0].indexOf('Municipio');
    const DepartamentoIndex = headers[0].indexOf('Departamento');
    const GeneroIndex = headers[0].indexOf('Genero');
    const ACApellido1Index = headers[0].indexOf('AC-Apellido1');
    const ACApellido2Index = headers[0].indexOf('AC-Apellido2');
    const ACNombre1Index = headers[0].indexOf('AC-Nombre1');
    const ACNombre2Index = headers[0].indexOf('AC-Nombre2');
    const ACFechaNacimientoIndex = headers[0].indexOf('AC-Fecha de nacimiento');
    const ACEmailIndex = headers[0].indexOf('AC-Email');
    const ACPasswordIndex = headers[0].indexOf('AC-Password');
    const ACRolIndex = headers[0].indexOf('AC-Rol');
    const ACParentezcoIndex = headers[0].indexOf('AC-Parentezco');
    const ACDocTipoIndex = headers[0].indexOf('AC-Doc Tipo');
    const ACDocNumIndex = headers[0].indexOf('AC-Doc Num');
    const ACTelefonoIndex = headers[0].indexOf('AC-Telefono');
    const ACDireccionIndex = headers[0].indexOf('AC-Direccion');
    const ACBarrioIndex = headers[0].indexOf('AC-Barrio');
    const ACMunicipioIndex = headers[0].indexOf('AC-Municipio');
    const ACDepartamentoIndex = headers[0].indexOf('AC-Departamento');
    const ACGeneroIndex = headers[0].indexOf('AC-Genero');
// --------------------------------
    function onOpen() {
        const ui = SpreadsheetApp.getUi();
        ui.createMenu('Administracion de Usuarios')
            .addItem('Crear usuarios', 'menuItem1')
            .addSeparator()
            .addSubMenu(ui.createMenu('Cargas')
                .addItem('Carga consolidado', 'showPicker'))
            .addToUi();
    }

    function menuItem1() {
        for (const i in data) {
            if (data.hasOwnProperty(i)) {
                const estudiante = new GsuiteUser({
                    name: new GsuiteName({
                        familyName: data[i][Apellido1Index] + ' ' + data[i][Apellido2Index],
                        givenName: ((data[i][Nombre2Index] !== '') ?
                        data[i][Nombre1Index] + ' ' + data[i][Nombre2Index] : data[i][Nombre1Index])
                    }),
                    password: data[i][PasswordIndex]+'',
                    primaryEmail: data[i][EmailIndex],
                    organizations: [new GsuiteOrganizations({
                        title: data[i][RolIndex]
                    })],
                    orgUnitPath: '/' + data[i][SedeIndex],
                    relations: [new GsuiteRelations({
                        value: data[i][ACNombre1Index] + ' ' + data[i][ACApellido1Index],
                        type: 'father'
                    })],
                    addresses: [new GsuiteAddresses({
                        streetAddress: data[i][DireccionIndex],
                        extendedAddress: data[i][BarrioIndex],
                        locality: data[i][DepartamentoIndex],
                        region: data[i][MunicipioIndex]
                    })],
                    phones: [new GsuitePhones({
                        value: data[i][ACTelefonoIndex]+''
                    })],
                    gender: new GsuiteGender({
                        type: ((data[i][GeneroIndex] === 'masculino') ? 'male' : 'female')
                    }),
                    customSchemas: {
                        Datos_Estudiantes: {
                            Fecha_de_nacimiento: formatDate(data[i][FechaNacimientoIndex]),
                            Tipo_de_documento: data[i][DocTipoIndex],
                            Numero_de_documento: data[i][DocNumIndex]+'',
                            Jornada: data[i][JornadaIndex],
                            Grupo: data[i][GrupoIndex]+'',
                            Grado: data[i][GradoIndex]+'',
                        }
                    }
                    /* customSchemas: new CustomSchemas({
                        Fecha_de_nacimiento: data[i][FechaNacimientoIndex],
                        Tipo_de_documento: data[i][DocTipoIndex],
                        Numero_de_documento: data[i][DocNumIndex]+'',
                        Jornada: data[i][JornadaIndex],
                        Grupo: data[i][GrupoIndex]+'',
                        Grado: data[i][GradoIndex]+'',
                    }) */
                });
                const acudiente = new GsuiteUser({
                    name: new GsuiteName({
                        familyName: data[i][ACApellido1Index] + ' ' + data[i][ACApellido2Index],
                        givenName: ((data[i][ACNombre2Index] !== '') ?
                        data[i][ACNombre1Index] + ' ' + data[i][ACNombre2Index] : data[i][ACNombre1Index])
                    }),
                    password: data[i][ACPasswordIndex],
                    primaryEmail: data[i][ACEmailIndex],
                    organizations: new GsuiteOrganizations({
                        title: data[i][ACRolIndex]
                    }),
                    orgUnitPath: '/' + data[i][SedeIndex],
                    relations: new GsuiteRelations({
                        value: data[i][Nombre1Index] + ' ' + data[i][Apellido1Index],
                        type: 'father'
                    }),
                    addresses: new GsuiteAddresses({
                        streetAddress: data[i][ACDireccionIndex],
                        extendedAddress: data[i][ACBarrioIndex],
                        locality: data[i][ACDepartamentoIndex],
                        region: data[i][ACMunicipioIndex]
                    }),
                    phones: new GsuitePhones({
                        value: data[i][ACTelefonoIndex]
                    }),
                    gender: new GsuiteGender({
                        type: ((data[i][ACGeneroIndex] === 'masculino') ? 'male' : 'female')
                    }),
                    /* customSchemas: new CustomSchemas({
                        Identificacion: {
                            tipo: data[i][ACDocTipoIndex],
                            numero: data[i][ACDocNumIndex],
                            fechaNacim: data[i][ACFechaNacimientoIndex]
                        }
                    }), */
                });
                // send the request and parse the response message.
                const message = UrlFetchApp.fetch(url, {
                    method: 'post',
                    contentType: 'application/json',
                    payload: JSON.stringify(estudiante)
                }).getContentText();
                const systemMessage = JSON.parse(message).message;
                Logger.log(systemMessage);
                Logger.log('Usuario ' + i);
                Logger.log(estudiante.primaryEmail);
                // Logger.log(acudiente.primaryEmail);
            }
        }
        SpreadsheetApp.getUi()
            .alert('Usuarios creados con exito! - 8');
    }
    function formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
    
        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;
    
        return [year, month, day].join('-');
    }
    function menuItem2() {
        SpreadsheetApp.getUi() // Or DocumentApp or FormApp.
            .alert('You clicked the second menu item!');
    }

    function showPicker() {
        const html = HtmlService.createHtmlOutputFromFile('piker.html')
        .setWidth(600)
        .setHeight(425)
        .setSandboxMode(HtmlService.SandboxMode.IFRAME);
        SpreadsheetApp.getUi().showModalDialog(html, 'Select a file');
    }

    function createDialog() {
        const htmlOutput = HtmlService
            .createHtmlOutputFromFile('dialog')
            .setWidth(250)
            .setHeight(80);
        SpreadsheetApp.getUi().showModalDialog(htmlOutput, 'Loading');
    }

    function getOAuthToken() {
        DriveApp.getRootFolder();
        return ScriptApp.getOAuthToken();
    }

    function listFilesInFolder() {
        const file = DriveApp.getFolderById('1lmHADksYPYrvNITE0Z0M9BpkAdDg31q9'); // Folder "Notas"
        const files = file.getFiles();
        while (files.hasNext()) {
            const File = files.next();
            Logger.log(File.getName() + ' ' + File.getId());
            //    var fBlob = DriveApp.getFileById(File.getId()).getBlob();
            //    var File = {
            //      title: File.getName(),
            //      mimeType: 'application/vnd.google-apps.spreadsheet'
            //    };
            //    File = Drive.Files.insert(File, fBlob);
            const consolidado = SpreadsheetApp.openById(File.getId());
            const ConsolidadoSheets = consolidado.getSheets();
            // --- Estructura de los datos -----------
            const ConsolidadoLastRow = ConsolidadoSheets[0].getLastRow();
            const ConsolidadoLastColumn = ConsolidadoSheets[0].getLastColumn();
            const ConsolidadoRange  = ConsolidadoSheets[0].getRange(1, 1, ConsolidadoLastRow, ConsolidadoLastColumn);
            const ConsolidadoValues = ConsolidadoRange.getValues();
            for (let i =  0; i < ConsolidadoLastRow; i++) {
                const nombre = ConsolidadoValues[i][3].toString();
                if (nombre !== '') {
                    let c = 0;
                    const notas = new Array(9);
                    for (let j = 12; j < 21; j++) { // numero de asignaturas 9 + inicio que es la coumna 12
                        notas[c] = [ConsolidadoValues[i][j], ConsolidadoValues[i + 1][j]];
                        c = c + 1;
                    }
                    Logger.log(nombre + ' ' + notas);
                }
            }
            // ---------------------------------------
            //    for(var i =  0; i < sheets.length; i++){
            //      var range  = sheets[i].getRange(1, 1, sheets[i].getLastRow(), sheets[i].getLastColumn());
            //      var values = range.getValues();
            //      for(var j = 0; j < sheets[i].getLastRow(); j++){
            //        Logger.log(values[j][0].toString());
            //      }
            //    }
        }
    }
