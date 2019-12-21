import * as functions from 'firebase-functions';
const {google} = require('googleapis');
const OAuth2 = google.auth.OAuth2; 

const googleCredentials = {
  "web":{
    "client_id":"395322918531-r0ss9he8te2mavf9bjta12pv8rstgcvt.apps.googleusercontent.com",
    "project_id":"g-escolar-plus-demo",
    "auth_uri":"https://accounts.google.com/o/oauth2/auth",
    "token_uri":"https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs",
    "client_secret":"-GxlNTTVpeu02zbwmn278nrY",
    "redirect_uris":["https://g-escolar-plus-demo.firebaseapp.com/__/auth/handler"],
    "javascript_origins":["http://localhost","http://localhost:5000","https://g-escolar-plus-demo.firebaseapp.com"]
  },
  "refresh_token":"1//04KwVAUfuTxuyCgYIARAAGAQSNwF-L9Ir2D4FcekieaCgH276vzuMWQ-pYVRGHGMlpNHx-n-ybgQUqBurkLjgDyfEO0AG3cgoPdM"
};
const calendar = google.calendar('v3');


const TIME_ZONE = 'EST';
//--- Escrive data en un G Sheet -------------
  export const exportaFS = functions.https.onCall(async (data, context) => {

    const oAuth2Client = new OAuth2(
      googleCredentials.web.client_id,
      googleCredentials.web.client_secret,
      googleCredentials.web.redirect_uris[0]
    );
    
    oAuth2Client.setCredentials({
      refresh_token: googleCredentials.refresh_token
    });

    const sheets = google.sheets('v4');
    // const slides = google.slides({version:'v1',oAuth2Client});
    // const Gdocs = google.docs({version: 'v1',oAuth2Client});
    const drive = google.drive('v3');

    console.log('Titulo',data.Titulo)
    const TemplateId = "1FpxWQUUFMRUu0x432BjYCDahZ94k5XJJ9CmNPhHbBzI";
    const copyParameters = {
        auth: oAuth2Client,
        fileId: TemplateId,
        resource: {
            parents: ['1GU3AyBfpNkvISFXJCSlgpBe9B_Er-pWc'],
            name: "Usuarios "+ data.Titulo +" "+ Date.now().toLocaleString()
        }
    }
    return await drive.files.copy(copyParameters).then(async function(sheetCopy:any){
      console.log(sheetCopy);
      const update = {
          auth: oAuth2Client,
          spreadsheetId: sheetCopy.data.id,
          resource: {
            valueInputOption: 'RAW',
            data: [
              {
                range: "Resumen!A1:D5",
                majorDimension: "ROWS",
                values: [
                  ["Item", "Cost", "Stocked", "Ship Date"],
                  ["Wheel", "$20.50", "4", "3/1/2016"],
                  ["Door", "$15", "2", "3/15/2016"],
                  ["Engine", "$100", "1", "3/20/2016"],
                  ["Totals", "=SUM(B2:B4)", "=SUM(C2:C4)", "=MAX(D2:D4)"]
                ],
              }
            ]
          }
      }
      return await sheets.spreadsheets.values.batchUpdate(update).then((resp:any)=>{
          const respuesta = {sheet:sheetCopy.data, update:resp.data};
          console.log(respuesta);
          return respuesta
      }).catch((error:any) => {
          console.error("No se pudo escribir en el documento de Id ",sheetCopy.data.id);
          throw new functions.https.HttpsError('internal', error.message);
      })
    }).catch((error:any) => {
      console.error("No se pudo copiar la spreadsheet");
      throw new functions.https.HttpsError('internal', error.message);
    });
  });
//--------------------------------------------
//--- Crea un usuario en G SUite -------------
  exports.addGsuiteUser = functions.https.onRequest((request, response) => {
    const eventData = request.body;
    const oAuth2Client = new OAuth2(
        googleCredentials.web.client_id,
        googleCredentials.web.client_secret,
        googleCredentials.web.redirect_uris[0]
    );

    oAuth2Client.setCredentials({
        refresh_token: googleCredentials.refresh_token
    });

    createGsuiteUser(eventData, oAuth2Client).then(data => {
        response.status(200).send(data);
        return;
    }).catch(err => {
        console.error('Error create user: ' + err.message);
        const CUSER_ERROR_RESPONSE = {
          status: "500",
          message: "Error: " + err.message
        };
        response.status(500).send(CUSER_ERROR_RESPONSE); 
        return;
    });
  });

  function createGsuiteUser(event:any, auth:any) {
    return new Promise(function(resolve, reject) {
      console.log('Usuario a ser creado:',event)
      const directory = google.admin({version: 'directory_v1', auth});
      directory.users.insert({"resource":event}).then((data:any) => {
        console.log('Request successful');
        resolve(data);
      }).catch((err:any) => {
        console.log('Rejecting because of error');
        reject(err);
      });
    });
  }
//--------------------------------------------
//--- Crea un evento en G Calendar -----------
  function addEvent(event:any, auth:any) {
    return new Promise(function(resolve, reject) {
        calendar.events.insert({
            auth: auth,
            calendarId: 'primary',
            resource: {
                'summary': event.eventName,
                'description': event.description,
                'start': {
                    'dateTime': event.startTime,
                    'timeZone': TIME_ZONE,
                },
                'end': {
                    'dateTime': event.endTime,
                    'timeZone': TIME_ZONE,
                },
            },
        }, (err:any, res:any) => {
            if (err) {
                console.log('Rejecting because of error');
                reject(err);
            }
            console.log('Request successful');
            resolve(res.data);
        });
    });
  }
  exports.addEventToCalendar = functions.https.onRequest((request, response) => {
    const eventData = {
        eventName: request.body.eventName,
        description: request.body.description,
        startTime: request.body.startTime,
        endTime: request.body.endTime
    };
    const oAuth2Client = new OAuth2(
        googleCredentials.web.client_id,
        googleCredentials.web.client_secret,
        googleCredentials.web.redirect_uris[0]
    );

    oAuth2Client.setCredentials({
        refresh_token: googleCredentials.refresh_token
    });

    addEvent(eventData, oAuth2Client).then(data => {
        response.status(200).send(data);
        return;
    }).catch(err => {
        console.error('Error adding event: ' + err.message);
        const CALENDAR_ERROR_RESPONSE = {
          status: "500",
          message: "Error: " + err.message
        }; 
        response.status(500).send(CALENDAR_ERROR_RESPONSE); 
        return;
    });
  });
//--------------------------------------------

