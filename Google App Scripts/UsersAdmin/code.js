function onOpen() {
  // hola GAS
    var ui = SpreadsheetApp.getUi();
    // Or DocumentApp or FormApp.
    ui.createMenu('Administracion de Usuarios')
        .addItem('Crear usuarios', 'menuItem1')
        .addSeparator()
        .addSubMenu(ui.createMenu('Cargas')
            .addItem('Carga consolidado', 'showPicker'))
        .addToUi();
  }
  
  function menuItem1() {
    SpreadsheetApp.getUi() // Or DocumentApp or FormApp.
       .alert('You clicked the first menu item!');
  }
  
  function menuItem2() {
    SpreadsheetApp.getUi() // Or DocumentApp or FormApp.
       .alert('You clicked the second menu item!');
  }
  
  function showPicker() {
    var html = HtmlService.createHtmlOutputFromFile('piker.html')
        .setWidth(600)
        .setHeight(425)
        .setSandboxMode(HtmlService.SandboxMode.IFRAME);
    SpreadsheetApp.getUi().showModalDialog(html, 'Select a file');
  }
  
  function fetchFromFirebaseFunctions() {
      // DriveApp.getRootFolder() included to make sure the scope is added to the project so that our 
      // token can be passed to the firebase function (this is obsolete as we call DriveApp later in the code)
      DriveApp.getRootFolder(); 
  
      var url = "https://upload.wikimedia.org/wikipedia/commons/e/e6/Clocktower_Panorama_20080622_20mb.jpg";
      var fnUrl = "https://us-central1-cloudfunctionsdemo-2230.cloudfunctions.net/answerTheFetch"; 
  
      var resp = JSON.parse(UrlFetchApp.fetch(fnUrl+"?url="+url+"&token="+ScriptApp.getOAuthToken()+"&filename=image.jpg").getContentText());
      var file_loaction = DriveApp.getFileById(resp.id).getUrl();
  
      Logger.log("The file "+resp.id+" can be viewed at "+file_loaction);
  }
  function createDialog(){
    var htmlOutput = HtmlService
         .createHtmlOutputFromFile('dialog')
         .setWidth(250)
         .setHeight(80);
     SpreadsheetApp.getUi().showModalDialog(htmlOutput, 'Loading');
  }
  
  function creaActa() {
    var temp = '1Y4F5cz2rj1oHpZEj_4eld4sAX9rj8OksHZXfPhYDnrA';
    var doct = DriveApp.getFileById(temp).makeCopy(DriveApp.getFolderById("1lfUp00NvXXd8v1e0f_TZjdV02UcjmTdL"));
    var sheet = SpreadsheetApp.getActive();
    var ciclo = sheet.getActiveSheet().getName().substring(0,3);
    var num = Number(ciclo);
    var tipoEdu = 'BASICA'
    if(num>499){
      tipoEdu = 'MEDIA'
    }
    doct.setName("Comision de evaluación Nocturna 2019 - "+ciclo)
  //  Logger.log(ciclo)
    var doc = DocumentApp.openById(doct.getId());
    var body = doc.getBody();
    var promovidos = body.findText("ESTUDIANTES PROMOVIDOS");
    var aplazados = body.findText("ESTUDIANTES APLAZADOS");
    var reprobados = body.findText("ESTUDIANTES REPROBADOS");
    var lc = sheet.getActiveSheet().getLastColumn();
    var headers = sheet.getActiveSheet().getRange(1, 1, 1, lc).getValues();
  
    // Colmunas a tener en cuenta
    var ei = headers[0].indexOf('Estado');
    var data = sheet.getActiveSheet().getDataRange().getValues();
    var array = {}  // "REPROBO";"APLAZADO";"APROBO"
    array["APROBO"] = [['APELLIDOS Y NOMBRES']];
    array["APLAZADO"] = [['APELLIDOS Y NOMBRES','ÁREA (ASIGNATURAS)']];
    array["REPROBO"] = [['APELLIDOS Y NOMBRES','ÁREA (ASIGNATURAS)']];
    var r = 0;
    var a = 0;
    var ap = 0;
  //  Logger.log(doc.getId())
  //  Logger.log(data)
    for(var f in data){
  //    Logger.log(data[f][ei])
      switch (data[f][ei])  {
          case "REPROBO":
              r += 1;
              var mat = '';
              for(var i = ei+1; i < lc; i++) {
                if(data[f][i] != ''){mat += data[f][i]+', '}
              }
              array["REPROBO"][r] = [data[f][0],mat];
  //            Logger.log(f+' '+data[f][ei])
              break;
          case "APLAZADO":
              ap += 1;
              var matp = '';
              for(var j = ei+1; j < lc; j++) {
                if(data[f][j] != ''){matp += data[f][j]+', '}
              }
              array["APLAZADO"][ap] = [data[f][0],matp];
  //            Logger.log(f+' '+data[f][ei])
              break;
          case "APROBO":
              a += 1;
              array["APROBO"][a] = [data[f][0]];
  //            Logger.log(f+' '+data[f][ei])
              break;
          default:
              break;
      }
    }
    
  //  Logger.log(array)
    // I added below ESTUDIANTES REPROBADOS DEL CICLO.
    var ele = reprobados.getElement();
    if (ele.getParent().getParent().getType() === DocumentApp.ElementType.BODY_SECTION) {
      var offset = body.getChildIndex(ele.getParent());
      body.insertTable(offset + 3, array["REPROBO"]);
    }
    var ele2 = aplazados.getElement();
    if (ele2.getParent().getParent().getType() === DocumentApp.ElementType.BODY_SECTION) {
      var offset = body.getChildIndex(ele2.getParent());
      body.insertTable(offset + 3, array["APLAZADO"]);
    }
    var ele3 = promovidos.getElement();
    if (ele3.getParent().getParent().getType() === DocumentApp.ElementType.BODY_SECTION) {
      var offset = body.getChildIndex(ele3.getParent());
      body.insertTable(offset + 3, array["APROBO"]);
    }
    body.replaceText('<<ciclo>>', ciclo)
    body.replaceText('<<tipoEdu>>', tipoEdu)
  }
  
  function showPicker() {
    var html = HtmlService.createHtmlOutputFromFile('piker.html')
        .setWidth(600)
        .setHeight(425)
        .setSandboxMode(HtmlService.SandboxMode.IFRAME);
    SpreadsheetApp.getUi().showModalDialog(html, 'Select a file');
  }
  
  function getOAuthToken() {
    DriveApp.getRootFolder();
    return ScriptApp.getOAuthToken();
  }
  
  function listFilesInFolder() {
    var file = DriveApp.getFolderById('1lmHADksYPYrvNITE0Z0M9BpkAdDg31q9');// Folder "Notas"
    var files = file.getFiles();
    while (files.hasNext()) {
      var file = files.next();
      Logger.log(file.getName() +' '+ file.getId());
  //    var fBlob = DriveApp.getFileById(file.getId()).getBlob();
  //    var file = {
  //      title: file.getName(),
  //      mimeType: 'application/vnd.google-apps.spreadsheet'
  //    };
  //    file = Drive.Files.insert(file, fBlob);
      var consolidado = SpreadsheetApp.openById(file.getId());
      var ConsolidadoSheets = consolidado.getSheets();
      // --- Estructura de los datos -----------
      var ConsolidadoLastRow = ConsolidadoSheets[0].getLastRow();
      var ConsolidadoLastColumn = ConsolidadoSheets[0].getLastColumn();
      var ConsolidadoRange  = ConsolidadoSheets[0].getRange(1, 1, ConsolidadoLastRow, ConsolidadoLastColumn);
      var ConsolidadoValues = ConsolidadoRange.getValues();
      for(var i =  0; i < ConsolidadoLastRow; i++){
        var nombre = ConsolidadoValues[i][3].toString();
        if(nombre != ''){
          var c = 0;
          var notas = new Array(9);
          for(var j = 12; j < 21; j++){ // numero de asignaturas 9 + inicio que es la coumna 12
            notas[c] = [ConsolidadoValues[i][j],ConsolidadoValues[i+1][j]];
            c = c + 1;
          }
          Logger.log(nombre+' '+notas);
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
  };