import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp(functions.config().firebase);
const ref = admin.database().ref();
const {google} = require('googleapis');
const OAuth2 = google.auth.OAuth2; 
const calendar = google.calendar('v3');
const TIME_ZONE = 'EST';
// --- Importo los modelos de los datos ------
  import { GescolarUser, Claims, GsuiteUser } from '../../src/app/models/data-models';
// -------------------------------------------
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
const oAuth2Client2 = new OAuth2(
  googleCredentials.web.client_id,
  googleCredentials.web.client_secret,
  googleCredentials.web.redirect_uris[0]
);

oAuth2Client2.setCredentials({
  refresh_token: googleCredentials.refresh_token
});
// const directory = google.admin({version: 'directory_v1', oAuth2Client2});
// --- Escrive data en un G Sheet ------------
  export const exportaFS = functions.https.onCall(async (data, context) => {

    // {
    //   "data": {
    //       "Titulo":"hola"
    //   }
    // }

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
// -------------------------------------------
// --- Get Firebase User ---------------------
  exports.getFirebaseUser = functions.https.onCall((uid, context) => {
    console.log('Data para consultar', uid);
    return admin.auth().getUser(uid).then(user => {
      console.log('Usuario consultado en Auth', user);
      return user;
    }).catch(error => {
      console.error('Error consultando user: ' + error.message);
      const CUSER_ERROR_RESPONSE = {
        status: "500",
        message: "Error consultando user: " + error.message
      };
      // response.status(500).send(CUSER_ERROR_RESPONSE);
      throw new functions.https.HttpsError('internal', CUSER_ERROR_RESPONSE.message);
    });
  });
// -------------------------------------------
// --- Crea Super Admin ----------------------
  exports.creaSuperUser = functions.https.onRequest((request, response) => {
    const user = {
      "kind": "admin#directory#user",
      "id": "116675950093144953544",
      "etag": "\"xW2YlxjdVEsAJNu_Hp5Dnespo8s/9Oeq-yHCE1GRJtHUrC_n1ly2fos\"",
      "primaryEmail": "stanley.illidge@lreginaldofischione.edu.co",
      "name": {
       "givenName": "Stanley",
       "familyName": "Illidge",
       "fullName": "Stanley Illidge"
      },
      "isAdmin": true,
      "isDelegatedAdmin": false,
      "lastLoginTime": "2020-01-06T23:31:20.000Z",
      "creationTime": "2017-07-04T19:50:18.000Z",
      "agreedToTerms": true,
      "suspended": false,
      "archived": false,
      "changePasswordAtNextLogin": false,
      "ipWhitelisted": false,
      "emails": [
       {
        "address": "Stanley.illidge@gmail.com",
        "type": "custom",
        "customType": ""
       },
       {
        "address": "stanley.illidge@lreginaldofischione.edu.co",
        "primary": true
       },
       {
        "address": "stanley.illidge@lreginaldofischione.edu.co.test-google-a.com"
       }
      ],
      "addresses": [
       {
        "type": "home",
        "formatted": "Calle 14D#19-50"
       }
      ],
      "organizations": [
       {
        "title": "Directivo(a) Docente",
        "primary": true,
        "customType": "",
        "description": "Coordinador"
       }
      ],
      "phones": [
       {
        "value": "3008479682",
        "type": "work"
       }
      ],
      "nonEditableAliases": [
       "stanley.illidge@lreginaldofischione.edu.co.test-google-a.com"
      ],
      "gender": {
       "type": "male"
      },
      "customerId": "C01q2wtti",
      "orgUnitPath": "/Directivos",
      "recoveryEmail": "stanley.illidge@gmail.com",
      "recoveryPhone": "+573008479682",
      "isMailboxSetup": true,
      "isEnrolledIn2Sv": true,
      "isEnforcedIn2Sv": false,
      "includeInGlobalAddressList": true,
      "thumbnailPhotoUrl": "https://www.google.com/s2/photos/private/AIbEiAIAAABECMilsNCbiLi25wEiC3ZjYXJkX3Bob3RvKigyYzg4ZDU0Yzk1YzU0MjA2NzQzNmZmZDg0NjAzY2NhZGRmNjBhYTgzMAGSQ8sVad_-_QZSuTH9z8s0dDlwOg",
      "thumbnailPhotoEtag": "\"xW2YlxjdVEsAJNu_Hp5Dnespo8s/tGTKU4DAYLqzy1118qZ8vBhiOg4\"",
      "customSchemas": {
       "Datos_Estudiantes": {
        "Fecha_de_nacimiento": "1982-08-07",
        "Grupo": "1101",
        "Numero_de_documento": "84091141",
        "Tipo_de_documento": "cedula",
        "Grado": "11",
        "Jornada": "Tarde"
       }
      }
    }
    const guser = new GsuiteUser(user); // recupero la data
    console.log('Usuario de Gsuite',guser);
    const geuser = new GescolarUser(guser);
    geuser.rol = 'Super';
    let t = '+57';
    if (geuser.telefonos) {
      t = '+57'+String(geuser.telefonos[0].value);
      geuser.telefonos[0].value = t;
    }
    console.log('Usuario a ser creado', t, geuser);
    // --- Creo el usuario en firebase ------
      admin.auth().createUser({
        uid: geuser.uid,
        email: geuser.email,
        emailVerified: false,
        phoneNumber: t,
        password: 'a123a456a',
        displayName: geuser.nombre,
        photoURL: user.thumbnailPhotoUrl,
        disabled: false
      })
      .then(function(userRecord) {
        console.log('Successfully created new user:', userRecord);
        // --- Definio los permisos por Rol ------
          const claims = new Claims;
          claims[geuser.rol] = true;
          // const fuser = new FirebaseUser(userRecord);
          // fuser.customClaims = claims;
          // fuser.photoURL = user.thumbnailPhotoUrl;
          // console.log('Fuser', fuser);
          // geuser = new GescolarUser(fuser);
          geuser.photoURL = user.thumbnailPhotoUrl;
          geuser.claims = claims;
          // console.log('Geuser', geuser);
          admin.auth().setCustomUserClaims(geuser.uid, claims ).then(() => {
            console.log("Successfully updated Claims to user:",geuser);
            // --- Guardo el usuario en la base de Datos ----
            ref.child(geuser.rol).child(geuser.uid).update(geuser)
              .then(()=>{
                console.log('El usuario fue creado correctamente',geuser);
                response.status(200).send(geuser)
              })
              .catch((error)=>{
                console.log('Error guardando el usuario en Firebase:', error);
                const e = 'Error guardando el usuario en Firebase:';
                console.error(e + error.message);
                const CUSER_ERROR_RESPONSE = {
                  status: "500",
                  message: e + " " + error.message
                };
                response.status(500).send(CUSER_ERROR_RESPONSE)
                // return CUSER_ERROR_RESPONSE;
              })
            // ----------------------------------------------
          }).catch(function (error) {
            console.log("Error definiendo los permisos del usuario en Firebase:", error);
            const e = "Error definiendo los permisos del usuario en Firebase:";
            console.error(e + error.message);
            const CUSER_ERROR_RESPONSE = {
              status: "500",
              message: e + " " + error.message
            };
            response.status(500).send(CUSER_ERROR_RESPONSE)
            // return CUSER_ERROR_RESPONSE;
          });
        // ---------------------------------------
      })
      .catch(function(error) {
        console.log('Error creando el usuario en Firebase:', error);
        const e = 'Error creando el usuario en Firebase:';
        console.error(e + error.message);
        const CUSER_ERROR_RESPONSE = {
          status: "500",
          message: e + " " + error.message
        };
        response.status(500).send(CUSER_ERROR_RESPONSE)
        // return CUSER_ERROR_RESPONSE;
      });
    // --------------------------------------
  });
// -------------------------------------------
// --- Crea un usuario en G SUite ------------
  exports.addGsuiteUser = functions.https.onRequest((request, response) => {
    const eventData = new GsuiteUser(request.body.data); // recupero la data
    createGsuiteUser(eventData, oAuth2Client2).then(data => {
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

  export const addGsuiteUsers = functions.https.onCall((request, response) => {
    const eventData = request;
    // console.log(response); // Google userId: 116675950093144953544
    creaUsuarios(eventData, oAuth2Client2).then(data => {
      // response.status(200).send(data);
      return data;
    }).catch(err => {
        console.error('Error create user: ' + err.message);
        const CUSER_ERROR_RESPONSE = {
          status: "500",
          message: "Error create user: " + err.message
        };
        // response.status(500).send(CUSER_ERROR_RESPONSE);
        throw new functions.https.HttpsError('internal', CUSER_ERROR_RESPONSE.message);
    });
  });

  function creaUsuarios(event: any, auth: any){
    return new Promise(function(resolve, reject) {
      const guser = event;//JSON.parse(event);
      console.log('Usuario a ser creado:',guser);
      const directory = google.admin({version: 'directory_v1', auth});
      return directory.users.insert({"resource":guser}).then((data:any) => {
        // console.log('Request successful',data);
        data.data.password = guser.password;
        const firebaseUser = new GescolarUser(data.data);
        // console.log('Usuario de firebasea ser creado',firebaseUser);
        // --- Creo el usuario en firebase ------
          return admin.auth().createUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            password: firebaseUser.password
          })
          .then(function(userRecord) {
            // console.log('Successfully created new user:', userRecord.uid);
            // --- Definio los permisos por Rol ------
              const claims = new Claims
              claims[firebaseUser.rol] = true
              return admin.auth().setCustomUserClaims(firebaseUser.uid, claims ).then(() => {
                // console.log("Successfully updated Claims to user:",firebaseUser);
                // --- Guardo el usuario en la base de Datos ----
                return ref.child(firebaseUser.rol).child(firebaseUser.uid).update(firebaseUser)
                  .then(()=>{
                    console.log('El usuario fue creado correctamente',firebaseUser);
                    resolve(event)
                  })
                  .catch((error)=>{
                    console.log('Error guardando el usuario en Firebase:', error);
                    const e = 'Error guardando el usuario en Firebase:';
                    console.error(e + error.message);
                    const CUSER_ERROR_RESPONSE = {
                      status: "500",
                      message: e + " " + error.message
                    };
                    reject(CUSER_ERROR_RESPONSE)
                    // return CUSER_ERROR_RESPONSE;
                  })
                // ----------------------------------------------
              }).catch(function (error) {
                console.log("Error definiendo los permisos del usuario en Firebase:", error);
                const e = "Error definiendo los permisos del usuario en Firebase:";
                console.error(e + error.message);
                const CUSER_ERROR_RESPONSE = {
                  status: "500",
                  message: e + " " + error.message
                };
                reject(CUSER_ERROR_RESPONSE)
                // return CUSER_ERROR_RESPONSE;
              });
            // ---------------------------------------
          })
          .catch(function(error) {
            console.log('Error creando el usuario en Firebase:', error);
            const e = 'Error creando el usuario en Firebase:';
            console.error(e + error.message);
            const CUSER_ERROR_RESPONSE = {
              status: "500",
              message: e + " " + error.message
            };
            reject(CUSER_ERROR_RESPONSE)
            // return CUSER_ERROR_RESPONSE;
          });
        // --------------------------------------
      }).catch((error:any) => {
        const e = 'Error creando el usuario en Gsuite:';
        console.error(e + error.message);
        const CUSER_ERROR_RESPONSE = {
          status: "500",
          message: e + " " + error.message
        };
        reject(CUSER_ERROR_RESPONSE)
        // return CUSER_ERROR_RESPONSE;
      });
    });
  }

  function createGsuiteUser(event: GsuiteUser, auth: any) {
    /*event:{
      "name": {
        "familyName": "picho",
        "givenName": "perez"
      },
      "password": "123456789",
      "primaryEmail": "picho@lreginaldofischione.edu.co",
      "organizations": [
        {
          "title": "Directivo(a) Docente",
          "primary": true,
          "customType": "",
          "description": "Coordinador"
        }
      ]
    } */
    return new Promise(function(resolve, reject) {
      console.log('Usuario a ser creado:',event)
      const directory = google.admin({version: 'directory_v1', auth});
      directory.users.insert({"resource":event}).then((data: any) => {
        // console.log('Request successful',data);
        const guser = new GsuiteUser(data.data)
        guser.password = event.password;
        // console.log('Data para crear el Usuario de firebase',guser);
        const gescolarUser = new GescolarUser(guser)
        // console.log('Usuario de firebasea ser creado', gescolarUser);
        createFirebaseUser(gescolarUser)
        resolve(data)
        // setTimeout(function(){ resolve(data); }, 10); // espero 10ms para continuar y no superar el limite de 10 usuarios por segundo
      }).catch((err: any) => {
        console.log('Rejecting because of error');
        reject(err)
        // setTimeout(function(){ reject(err); }, 10); // espero 10ms para continuar y no superar el limite de 10 usuarios por segundo
      });
    });
  }

  function createFirebaseUser(user: GescolarUser){
    admin.auth().createUser({
      uid: user.uid,
      email: user.email,
      password: user.password
    })
    .then(function(userRecord) {
      // console.log('Successfully created new user:', userRecord.uid);
      setClaims(user)
      .then(()=>{
        // console.log('ok')
      })
      .catch((error)=>{console.log('error',error)})
    })
    .catch(function(error) {
      console.log('Error creating new user:', error);
    });
  }

  function setClaims(user: GescolarUser){
    // console.log("Usuario a definir roles:", user);
    const claims = new Claims
    claims[user.rol] = true
    return admin.auth().setCustomUserClaims(user.uid, claims ).then(() => {
      // console.log("Successfully updated Claims to user:",user);
      ref.child(user.rol).child(user.uid).update(user)
      .then(()=>{
        console.log('El usuario fue creado correctamente',user);
      })
      .catch((error)=>{console.log('error',error)})
      return user
    }).catch(function (error) {
      // console.log("Error creating new user:", error);
      // return error;
      throw new functions.https.HttpsError('unknown', error.message, error);
    });
  }
// -------------------------------------------
// --- Crea un evento en G Calendar ----------
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
// -------------------------------------------
// --- Eliminar usuarios en Firebase ---------
  export const Eliminar = functions.https.onRequest((request, response) => {
    ref.child('Estudiante').remove().then(function() {
      console.log('Successfully deleted Database Estudiantes');
    })
    .catch(function(error) {
      console.log('Error deleting user:', error);
    });
    admin.auth().listUsers(1000)
    .then(function(listUsersResult) {
      listUsersResult.users.forEach(function(userRecord) {
        console.log('user', userRecord.toJSON());
        admin.auth().deleteUser(userRecord.uid)
        .then(function() {
          console.log('Successfully deleted user');
        })
        .catch(function(error) {
          console.log('Error deleting user:', error);
        });
      });
      response.send("Usuarios eliminados!");
    })
    .catch(function(error) {
      console.log('Error listing users:', error);
      response.send("Error eliminando usuarios! "+error);
    });
  });
// -------------------------------------------
