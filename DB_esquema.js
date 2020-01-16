// --- Institucional ------------
    "institucion"= {
        "calendario":["calendarioA","calendarioB"], // Tipo de calendario segun MEN (A,B)
        "razonSocial": "String", // Nombre de la institución educativa
        "rut": "String", // URL del rut en Storage
        "nit":"string",
        "logo": "String", // URL de la imagen del escudo en Storage
        "dane": "Number",
        "resolucionAprobacion":"String", // URL del documento en Storage
        "generoAtendIDo":["mixto","masculino","femenino"],
        "nivelEnseñanza":{
            "Preescolar":"Boolean",
            "Basica Primaria":"Boolean",
            "Basica Secundaria":"Boolean",
            "Educacion basica para adultos":"Boolean",
            "Educacion media":"Boolean",
            "Educacion media para adultos":"Boolean"
        }
    },
    "sedes"={
        "sedeID":{
            "nombre": "String",
            "geolocalizacion":{
                "pais": "String",
                "departamento": "String",
                "municipio": "String",
                "direccion": "String",
                "telefono":"Number",
                "coordenadas":{
                    "latitud": "Number",
                    "longitud": "Number"
                }
            },
            "dane": "Number",
            "jornadas":{
                "mañana": "Boolean",
                "tarde": "Boolean",
                "nocturna": "Boolean",
                "sabatina": "Boolean",
                "unica": "Boolean"
            }
        }
    },
    "rol"={ // Usuarios
        "authID":{ // auth.uID
            "nombre":"String",
            "documentoNumero":"Number",
            "documentoTipo": "registroCivil" | 'tarjetaIdentidad' | 'cedula' | 'pasaporte',
            "direccion":"String",
            "telefono":"Number",
            "activo":"Boolean",
            "rol":"String",
            "sede":"sedeID"
        }
    },
    // se debe crear todo la lista de bytes de asignaciones, role, recursus entre otros
    // claims, el objeto claims no puede superar los 1k bytes
    "claims"={
        "rol":"String",
        "procesos":"Object"
    },
    "roles"=[ // auth.token['rol']
        "super",
        "rector",
        "admin",
        "auxiliar",
        "coordinador",
        "docente",
        "estudiante"
    ],
    "añolectivo"={
        "añoID":{ // 2019,2020 etc // en modo offline unicamente se sync data del año en curso
            "inicio":"Date",
            "fin":"Date",
            "activo":"Boolean"
        }
    },
    // falta por atender
    "InformacionFamiliar"
    "gestion documental"
// --- Academico ----------------
    "periodosAcademicos"={
        "añoID":{
            "periodoAcademicoPushID":{
                "nombre":"String",
                "estado":["inscripciones","abierto","cerrado","nivelaciones","promocion"], // posibles estados
                "activo":"Boolean",
                "inicio":"Date",
                "fin":"Date"
            }
        }
    },
    "estadosPA"={
        "añoID":{
            "PushID":{ // registro de ventanas de tiempo de habilitacion del estado del periodo
                "estado":"String", //"inscripciones","abierto","cerrado","nivelaciones","promocion" // posibles estados
                "inicio":"Date",
                "fin":"Date",
                "periodo":"periodoID"
            }
        }
    },
    "grados"={
        "GradoPushID":{
            "nivelEnseñanza":["Preescolar","Basica Primaria","Basica Secundaria","Educacion basica para adultos","Educacion media","Educacion media para adultos"],// segun eleccion en la configuracion institucional
            "nombre":"String",
            "planEstudios":"planEstudiosPushID",
            "gradoSiguienteTest":"Boolean",
            "gradoSiguiente":"String"
        }
    },
    "grupos"={
        "añoID":{
            "GrupoPushID":{
                "sede":"sedeID",
                "jornada":"String",
                "grado":"GradoPushID",
                "grupo":"String",
                "nombre":"String",
                "planEstudios":"planEstudiosPushID",
                "limiteEstudiantes":"Number",
                "direccionGrupo":"DocenteAuthID",
                "docentes":{"DocenteAuthID":"Boolean"}, // el boleano establece su estado, true para activo, false para inactivo
                "estudiantes":{"EstudianteAuthID":"Boolean"} // el boleano establece su estado, true para activo, false para inactivo
            }
        }
    },
    "areas"={
        "añoID":{
            "AreaPushID":{
                "nombre":"String",
                "obligatoria":"Boolean"
            }
        }
    },
    "Asignaturas"={
        "añoID":{
            "AsignaturaPushID":{
                "nombre":"String",
                "area":"AreaPushID"
            }
        }
    },
    "planEstudios"={
        "añoID":{
            "PlanEstudiosPushID":{
                "nombre":"String",
                "fecha":"Date",
                "grado":["GradoPushID","GradoPushID","GradoPushID"],
                "nivelEnseñanza":["Preescolar","Basica Primaria","Basica Secundaria","Educacion basica para adultos","Educacion media","Educacion media para adultos"],// segun eleccion en la configuracion institucional
                "AsignaturasPlan":["AsignaturasPlanPushID","AsignaturasPlanPushID","AsignaturasPlanPushID"],
                "siee":"sieePushID"
            }
        }
    },
    "AsignaturasPlan"={
        "añoID":{
            "AsignaturasPlanPushID":{
                "plan":"PlanPushID",
                "area":"AreaPushID",
                "asignatura":"AsignaturaPushID",
                "ih":"Number",
                "porcentaje":"Number"
            }
        }
    },
    "asignacionAcademica"={
        "añoID":{
            "PushID":{
                "docente":"DocenteAuthID",
                "sede":"sedeID",
                "jornada":"String",
                "AsignaturasPlan":"AsignaturasPlanPushID",
                "area":"AreaPushID", // automatico segun la asignatura del plan
                "asignatura":"AsignaturaPushID", // automatico segun la asignatura del plan
                "ih":"Number", // automatico segun la asignatura del plan
                "porcentaje":"Number", // automatico segun la asignatura del plan
                "grupo":"GrupoPushID",
                "grado":"GradoPushID" // automatico segun el grupo
            }
        }
    },
    // ---- Sistema de evalucion -------------
        "siee"={
            "añoID":{
                "sieePushID":{
                    "escalaCalificacion":{
                        "escalaCalificacionPushID":{
                            "tipo":["Numerico","Simbolico","Literal"],
                            "nombre":"String",
                            "nivelEnseñanza":["Preescolar","Basica Primaria","Basica Secundaria","Educacion basica para adultos","Educacion media","Educacion media para adultos"],// segun eleccion en la configuracion institucional
                            // porcentajes 0% - 100%
                            "desempeñoSuperior":{
                                "limiteSuperior":"Number",
                                "limiteInferior":"Number"
                            },
                            "desempeñoAlto":{
                                "limiteSuperior":"Number",
                                "limiteInferior":"Number"
                            },
                            "desempeñoBasico":{
                                "limiteSuperior":"Number",
                                "limiteInferior":"Number"
                            },
                            "desempeñoBajo":{
                                "limiteSuperior":"Number",
                                "limiteInferior":"Number"
                            },
                            // porcentajes 0% - 100%
                            "calificacionAprovacion":"Number"
                        }
                    },
                    "criteriosEvaluacion":{
                        // los criterios son un objeto dinamico de N dimensiones, pero una sola estructura repetida para cada dimension.
                        "critEvaPushID":{
                            "nombre":"String",
                            "porcentaje":"Number",
                            "docente":"DocentePushID",  // en el caso de los de segundo nivel
                            "area":"AreaPushID",  // en el caso de los de segundo nivel
                            "asignatura":"AsignaturaPushID",  // en el caso de los de segundo nivel
                            "periodoAcademico":"periodoAcademicoPushID",  // en el caso de los de segundo nivel
                            "child":"critEvaPushID" // en el caso de los de segundo nivel
                        }
                    },
                    "mecanismoSeguimiento":{},
                    "criteriosPromocion":{
                        "PushID":{
                            "nombre":"String",
                            "tipo":["promocion","reprobacion","nivelacion"],
                            "cantidad":"Number",
                            "orientado":["Areas","Asignaturas"]
                        }
                    },
                    "registroEvaluacion":{/*formato del boletin*/},
                    "reportes":{}
                }
            }
        },
    // ---- Calificaciones y asistencias -----
        "actividades"={
            "añoID":{
                "ActividadPushID":{
                    "periodoAcademico":"periodoAcademicoPushID",
                    "criterioEvaluacion":"critEvaPushID",
                    "fecha":"Date",
                    "nombre":"String",
                    "porcentaje":"Number",
                    "docente":"DocentePushID",
                    "area":"AreaPushID",
                    "asignatura":"AsignaturaPushID",
                    "grupo":"GrupoPushID",
                    "grado":"GradoPushID"
                }
            }
        },
        "calificaciones"={
            "añoID":{
                "calificacionPushID":{
                    "periodoAcademico":"periodoAcademicoPushID",
                    "criterioEvaluacion":"critEvaPushID",
                    "actividad":"ActividadPushID",
                    "escalaCalificacion":"escalaCalificacionPushID",
                    "Estudiante":"EstudiantePushID",
                    "docente":"DocentePushID",
                    "area":"AreaPushID",
                    "asignatura":"AsignaturaPushID",
                    "grado":"GradoPushID",
                    "grupo":"GrupoPushID",
                    "fecha":"Date",
                    "calificacion":"Number",
                    "desempeño":"String"
                }
            }
        },
        "asistencias"={
            "añoID":{
                "AsistenciasPushID":{
                    "periodoAcademico":"periodoAcademicoPushID",
                    "Estudiante":"EstudiantePushID",
                    "docente":"DocentePushID",
                    "area":"AreaPushID",
                    "asignatura":"AsignaturaPushID",
                    "grado":"GradoPushID",
                    "grupo":"GrupoPushID",
                    "fecha":"Date",
                    "asistencia":["asistio","asistio y no entro","no asistio","excusa"]
                }
            }
        },
    // ---- Certificaciones y Constancias ----
        "calificacionesFinales"={
            "añoID":{
                "calificacionPushID":{
                    "periodoAcademico":"periodoAcademicoPushID",
                    "siee":"sieePushID",
                    "criterioEvaluacion":"critEvaPushID",
                    "actividad":"ActividadPushID",
                    "escalaCalificacion":"escalaCalificacionPushID",
                    "Estudiante":"EstudiantePushID",
                    "docente":"DocentePushID",
                    "area":"AreaPushID",
                    "asignatura":"AsignaturaPushID",
                    "grado":"GradoPushID",
                    "grupo":"GrupoPushID",
                    "fecha":"Date",
                    "calificacion":"Number",
                    "desempeño":"String"
                }
            }
        },
        "certificaciones"={
            "añoID":{
                "EstudiantePushID":{
                    "fecha":"Date",
                    "grado":"GradoPushID",
                    "grupo":"GrupoPushID",
                    "estado":["aprobo","reprobo","aplazado","retirado"]
                }
            }
        },
// --- Disciplina ---------------
    "debidoProceso"={ // proceso obligatorio comun a cada paso que emita una sancion
        "añoID":{
            "debidoProcesoPushID":{ // se debe verificar el estricto cumplimiento de cada paso
                "fecha de inicio" : "firebase.database.ServerValue.TIMESTAMP",
                "fecha de cierre" : "firebase.database.ServerValue.TIMESTAMP",
                "activo":Boolean,
                "Estudiante":"EstudiantePushID",
                "acta":"ActaPushID",
                "Comunicación formal":{ //Apertura del proceso disciplinario
                    // Persona a quien se le imputan las conductas pasibles de sanción
                    "tipo":"citacion de padres",
                    "campos":{ // campos relevantes para crear documentos y formularios
                        "campo#1":"tipo" // "string", "date", "boolean", "number" etc...
                    }
                },
                "Formulación de cargos imputados":{ 
                    // claridad y precisión de las conductas , las “faltas disciplinarias” y la norma
                    "tipo":"acta",
                    "campos":{ // campos relevantes para crear documentos y formularios
                        "campo#1":"tipo" // "string", "date", "boolean", "number" etc...
                    }
                },
                "Traslado al imputado de las pruebas":{ 
                    // pruebas que fundamentan los cargos
                    "tipo":"version libre",
                    "campos":{ // campos relevantes para crear documentos y formularios
                        "campo#1":"tipo" // "string", "date", "boolean", "number" etc...
                    }
                },
                "Indicación del término para formular descargos":{ 
                    // Controvertir pruebas en su contra Y allegar las que considere necesarias
                    "tipo":"version libre",
                    "campos":{ // campos relevantes para crear documentos y formularios
                        "campo#1":"tipo" // "string", "date", "boolean", "number" etc...
                    }
                },
                "Pronunciamiento definitivo":{ 
                    // Expedido por autoridad competente
                    "tipo":"acta",
                    "campos":{ // campos relevantes para crear documentos y formularios
                        "campo#1":"tipo" // "string", "date", "boolean", "number" etc...
                    }
                },
                "Imposición de una sanción proporcional":{ 
                    // Proporcional a los hechos
                    "tipo":"acta",
                    "campos":{ // campos relevantes para crear documentos y formularios
                        "campo#1":"tipo" // "string", "date", "boolean", "number" etc...
                    }
                },
                "Posibilidad de controvertir":{ 
                    // Mediante Recursos Pertinentes, recurso de Reposición
                    "tipo":"acta",
                    "campos":{ // campos relevantes para crear documentos y formularios
                        "campo#1":"tipo" // "string", "date", "boolean", "number" etc...
                    }
                }
            }
        }
    },
    "proceso de convivencia[objeto de control]"={ // objeto variable, que establece la estructura del proceso de convivencia
        "añoID":{
            "tipo1":{ // obligatorio por ley 1620 de 2013
                "pasos":{
                    // Decreto 1965 de 2013
                    "paso#1":{
                        // 1. Reunir inmediatamente a las partes involucradas en el conflicto y mediar de manera pedagógica para que estas expongan sus puntos de vista y busquen la reparación de los daños causados, el restablecimiento de los derechos y la reconciliación dentro de un clima de relaciones constructivas en el establecimiento educativo.
                        // 2. Fijar la forma de solución de manera imparcial, equitativa y justa, encaminada a buscar la reparación de los daños causados, el restablecimiento de los derechos y la reconciliación dentro de un clima de relaciones constructivas en el grupo involucrado o en el establecimiento educativo. De esta actuación se dejará constancia.
                        // 3. Realizar seguimiento del caso y de los compromisos a fin de verificar si la solución fue efectiva o si se requiere acudir a los protocolos consagrados en los artículos 2.3.5.4.2.9 y 2.3.5.4.2.10 del presente decreto. 
                        "accion#1":{
                            // Acta de reunion para la la reparación de los daños causados, el restablecimiento de los derechos y la reconciliación dentro de un clima de relaciones constructivas en el establecimiento educativo
                            "nombre":"Acta de reunion",
                            "campos":{ // campos relevantes para crear documentos y formularios
                                "campo#1":"tipo" // "string", "date", "boolean", "number" etc...
                            },
                            "tipo de resultado para evaluar la accion":"URL del documento generado y escaneado", // se verifica la existencia del acta escaneada, donde reposen las firmas de las partes
                            "criterio logico de validacion":{
                                // estructura logica compuesta de las acciones requeridas para para dar como cumplido el paso
                                // la estructura debe presentar opciones logicas como 
                                // 'igual a','mayos que','menor que' etc segun sea el tipo de dato
                            },
                            "emite sancion":false,
                            "emite compromisos":true
                        },
                        "accion#2":{
                            // Acta de reunion para la la reparación de los daños causados, el restablecimiento de los derechos y la reconciliación dentro de un clima de relaciones constructivas en el establecimiento educativo
                            "nombre":"Notificacion a los acudientes",
                            "campos":{ // campos relevantes para crear documentos y formularios
                                "campo#1":"tipo" // "string", "date", "boolean", "number" etc...
                            },
                            "tipo de resultado para evaluar la accion":"URL del documento generado y escaneado", // se verifica la existencia del acta escaneada, donde reposen las firmas de las partes
                            "criterio logico de validacion":{
                                // estructura logica compuesta de las acciones requeridas para para dar como cumplido el paso
                                // la estructura debe presentar opciones logicas como 
                                // 'igual a','mayos que','menor que' etc segun sea el tipo de dato
                            },
                            "emite sancion":false,
                            "emite compromisos":false
                        },
                        "accion#":{
                            "nombre":"String",
                            "campos":{ // campos relevantes para crear documentos y formularios
                                "campo#1":"tipo" // "string", "date", "boolean", "number" etc...
                            },
                            "tipo de resultado para evaluar la accion":"tipo", // "string", "date", "boolean", "number" etc...
                            "criterio logico de validacion":{
                                // estructura logica compuesta de las acciones requeridas para para dar como cumplido el paso
                                // la estructura debe presentar opciones logicas como 
                                // 'igual a','mayos que','menor que' etc segun sea el tipo de dato
                            },
                            "emite sancion":"Boolean",
                            "emite compromisos":"Boolean"
                        }
                    },
                    "paso#":{
                        "acciones":{
                            "nombre":String,
                            "campos":{ // campos relevantes para crear documentos y formularios
                                "campo#1":"tipo" // "string", "date", "boolean", "number" etc...
                            },
                            "tipo de resultado para evaluar la accion":"tipo" // "string", "date", "boolean", "number" etc...
                        },
                        "criterio logico de validacion":{
                            // estructura logica compuesta de las acciones requeridas para para dar como cumplido el paso
                            // la estructura debe presentar opciones logicas como 
                            // 'igual a','mayos que','menor que' etc segun sea el tipo de dato
                        },
                        "emite sancion":Boolean,
                        "emite compromisos":Boolean
                    }
                    // Parágrafo. Los estudiantes que hayan sido capacitados como mediadores o conciliadores escolares podrán participar en el manejo de estos casos en los términos fijados en el Manual de Convivencia.
                },
                "responsables":{ // se seleccionan los roles que podran intervenir
                    "super":Boolean,
                    "rector":Boolean,
                    "admin":Boolean,
                    "auxiliar":Boolean,
                    "coordinador":Boolean,
                    "docente":Boolean,
                    "estudiante":Boolean,
                },
                "formatos":["URL del template en GDOC"]
            },
            "tipo2":{ // obligatorio por ley 1620 de 2013
                "pasos":{
                    // Decreto 1965 de 2013
                    "paso#1":{
                        // 1. En casos de daño al cuerpo o a la salud, garantizar la atención inmediata en salud física y mental de los involucrados, mediante la remisión a las entidades competentes, actuación de la cual se dejará constancia.
                        // 2. Cuando se requieran medidas de restablecimiento de derechos, remitir la situación a las autoridades administrativas, en el marco de la Ley 1098 de 2006, actuación de la cual se dejará constancia.
                        // 3. Adoptar las medidas para proteger a los involucrados en la situación de posibles acciones en su contra, actuación de la cual se dejará constancia.
                        // 4. Informar de manera inmediata a los padres, madres o acudientes de todos los estudiantes involucrados, actuación de la cual se dejará constancia.
                        "accion#1":{
                            // Acta de remisión a las entidades competentes
                            "nombre":"Acta remisión a las entidades competentes",
                            "campos":{ // campos relevantes para crear documentos y formularios
                                "campo#1":"tipo" // "string", "date", "boolean", "number" etc...
                            },
                            "tipo de resultado para evaluar la accion":"URL del documento generado y escaneado", // se verifica la existencia del acta escaneada, donde reposen las firmas de las partes
                            "criterio logico de validacion":{
                                // estructura logica compuesta de las acciones requeridas para para dar como cumplido el paso
                                // la estructura debe presentar opciones logicas como 
                                // 'igual a','mayos que','menor que' etc segun sea el tipo de dato
                            },
                            "emite sancion":false,
                            "emite compromisos":false
                        },
                        "accion#2":{
                            // Acta de remisión a las entidades competentes
                            "nombre":"Acta medidas de proteccion",
                            "campos":{ // campos relevantes para crear documentos y formularios
                                "campo#1":"tipo" // "string", "date", "boolean", "number" etc...
                            },
                            "tipo de resultado para evaluar la accion":"URL del documento generado y escaneado", // se verifica la existencia del acta escaneada, donde reposen las firmas de las partes
                            "criterio logico de validacion":{
                                // estructura logica compuesta de las acciones requeridas para para dar como cumplido el paso
                                // la estructura debe presentar opciones logicas como 
                                // 'igual a','mayos que','menor que' etc segun sea el tipo de dato
                            },
                            "emite sancion":false,
                            "emite compromisos":true
                        },
                        "accion#3":{
                            "nombre":"Notificacion a los acudientes",
                            "campos":{ // campos relevantes para crear documentos y formularios
                                "campo#1":"tipo" // "string", "date", "boolean", "number" etc...
                            },
                            "tipo de resultado para evaluar la accion":"URL del documento generado y escaneado", // se verifica la existencia del acta escaneada, donde reposen las firmas de las partes
                            "criterio logico de validacion":{
                                // estructura logica compuesta de las acciones requeridas para para dar como cumplido el paso
                                // la estructura debe presentar opciones logicas como 
                                // 'igual a','mayos que','menor que' etc segun sea el tipo de dato
                            },
                            "emite sancion":false,
                            "emite compromisos":false
                        },
                        "accion#":{
                            "nombre":"String",
                            "campos":{ // campos relevantes para crear documentos y formularios
                                "campo#1":"tipo" // "string", "date", "boolean", "number" etc...
                            },
                            "tipo de resultado para evaluar la accion":"tipo", // "string", "date", "boolean", "number" etc...
                            "criterio logico de validacion":{
                                // estructura logica compuesta de las acciones requeridas para para dar como cumplido el paso
                                // la estructura debe presentar opciones logicas como 
                                // 'igual a','mayos que','menor que' etc segun sea el tipo de dato
                            },
                            "emite sancion":"Boolean",
                            "emite compromisos":"Boolean"
                        }
                    },
                    "paso#2":{
                        // 5. Generar espacios en los que las partes involucradas y los padres, madres o acudientes de los estudiantes, puedan exponer y precisar lo acontecido, preservando, en cualquier caso, el derecho a la intimidad, confidencialidad y demás derechos.
                        // 6. Determinar las acciones restaurativas que busquen la reparación de los daños causados, el restablecimiento de los derechos y la reconciliación dentro de un clima de relaciones constructivas en el establecimiento educativo; así como las consecuencias aplicables a quienes han promovido, contribuido o participado en la situación reportada.
                        "accion#1":{
                            "nombre":"Acta de compromiso",
                            "campos":{ // campos relevantes para crear documentos y formularios
                                "campo#1":"tipo" // "string", "date", "boolean", "number" etc...
                            },
                            "tipo de resultado para evaluar la accion":"tipo", // "string", "date", "boolean", "number" etc...
                            "criterio logico de validacion":{
                                // estructura logica compuesta de las acciones requeridas para para dar como cumplido el paso
                                // la estructura debe presentar opciones logicas como 
                                // 'igual a','mayos que','menor que' etc segun sea el tipo de dato
                            },
                            "emite sancion":true,
                            "emite compromisos":true
                        },
                        "accion#2":{
                            "nombre":"Acta de seguimiento de compromiso",
                            "campos":{ // campos relevantes para crear documentos y formularios
                                "campo#1":"tipo" // "string", "date", "boolean", "number" etc...
                            },
                            "tipo de resultado para evaluar la accion":"tipo", // "string", "date", "boolean", "number" etc...
                            "criterio logico de validacion":{
                                // estructura logica compuesta de las acciones requeridas para para dar como cumplido el paso
                                // la estructura debe presentar opciones logicas como 
                                // 'igual a','mayos que','menor que' etc segun sea el tipo de dato
                            },
                            "emite sancion":false, // en caso de incumplimiento, afecta el acta de compromiso
                            "emite compromisos":false // en caso de incumplimiento, afecta el acta de compromiso
                        },
                        "accion#":{
                            "nombre":"String",
                            "campos":{ // campos relevantes para crear documentos y formularios
                                "campo#1":"tipo" // "string", "date", "boolean", "number" etc...
                            },
                            "tipo de resultado para evaluar la accion":"tipo", // "string", "date", "boolean", "number" etc...
                            "criterio logico de validacion":{
                                // estructura logica compuesta de las acciones requeridas para para dar como cumplido el paso
                                // la estructura debe presentar opciones logicas como 
                                // 'igual a','mayos que','menor que' etc segun sea el tipo de dato
                            },
                            "emite sancion":"Boolean",
                            "emite compromisos":"Boolean"
                        }
                    },
                    "paso#3":{
                        // 7. El Presidente del Comité Escolar de Convivencia informará a los demás integrantes de este comité, sobre la situación ocurrida y las medidas adoptadas. El comité realizará el análisis y seguimiento, a fin de verificar si la solución fue efectiva o si se requiere acudir al protocolo consagrado en el artículo 2.3.5.4.2.10 del presente Decreto.
                        // 8. El Comité Escolar de Convivencia dejará constancia en acta de todo lo ocurrido y de las decisiones adoptadas, la cual será suscrita por todos los integrantes e intervinientes.
                        // 9. El Presidente del Comité Escolar de Convivencia reportará la información del caso al aplicativo que para el efecto se haya implementado en el Sistema de Información Unificado de Convivencia Escolar.
                        "accion#1":{
                            "nombre":"Citacion del comite escoar de convivencia",
                            "campos":{ // campos relevantes para crear documentos y formularios
                                "campo#1":"tipo" // "string", "date", "boolean", "number" etc...
                            },
                            "tipo de resultado para evaluar la accion":"tipo", // "string", "date", "boolean", "number" etc...
                            "criterio logico de validacion":{
                                // estructura logica compuesta de las acciones requeridas para para dar como cumplido el paso
                                // la estructura debe presentar opciones logicas como 
                                // 'igual a','mayos que','menor que' etc segun sea el tipo de dato
                            },
                            "emite sancion":false,
                            "emite compromisos":false
                        },
                        "accion#2":{
                            "nombre":"Acta de comite escoar de convivencia",
                            "campos":{ // campos relevantes para crear documentos y formularios
                                "campo#1":"tipo" // "string", "date", "boolean", "number" etc...
                            },
                            "tipo de resultado para evaluar la accion":"tipo", // "string", "date", "boolean", "number" etc...
                            "criterio logico de validacion":{
                                // estructura logica compuesta de las acciones requeridas para para dar como cumplido el paso
                                // la estructura debe presentar opciones logicas como 
                                // 'igual a','mayos que','menor que' etc segun sea el tipo de dato
                            },
                            "emite sancion":true,
                            "emite compromisos":true
                        },
                        "accion#3":{
                            "nombre":"Acta de seguimiento de compromiso",
                            "campos":{ // campos relevantes para crear documentos y formularios
                                "campo#1":"tipo" // "string", "date", "boolean", "number" etc...
                            },
                            "tipo de resultado para evaluar la accion":"tipo", // "string", "date", "boolean", "number" etc...
                            "criterio logico de validacion":{
                                // estructura logica compuesta de las acciones requeridas para para dar como cumplido el paso
                                // la estructura debe presentar opciones logicas como 
                                // 'igual a','mayos que','menor que' etc segun sea el tipo de dato
                            },
                            "emite sancion":false, // en caso de incumplimiento, afecta el acta de compromiso
                            "emite compromisos":false // en caso de incumplimiento, afecta el acta de compromiso
                        },
                        "accion#":{
                            "nombre":"String",
                            "campos":{ // campos relevantes para crear documentos y formularios
                                "campo#1":"tipo" // "string", "date", "boolean", "number" etc...
                            },
                            "tipo de resultado para evaluar la accion":"tipo", // "string", "date", "boolean", "number" etc...
                            "criterio logico de validacion":{
                                // estructura logica compuesta de las acciones requeridas para para dar como cumplido el paso
                                // la estructura debe presentar opciones logicas como 
                                // 'igual a','mayos que','menor que' etc segun sea el tipo de dato
                            },
                            "emite sancion":"Boolean",
                            "emite compromisos":"Boolean"
                        }
                    },
                    // Parágrafo. Cuando el Comité Escolar de Convivencia adopte como acciones o medidas la remisión de la situación al Instituto Colombiano de Bienestar Familiar para el restablecimiento de derechos, o al Sistema de Seguridad Social para la atención en salud integral, estas entidades cumplirán con lo dispuesto en el artículo 2.3.5.4.2.11. del presente decreto. 
                    "paso#":{
                        "acciones":{
                            "nombre":String,
                            "campos":{ // campos relevantes para crear documentos y formularios
                                "campo#1":"tipo" // "string", "date", "boolean", "number" etc...
                            },
                            "tipo de resultado para evaluar la accion":"tipo" // "string", "date", "boolean", "number" etc...
                        },
                        "criterio logico de validacion":{
                            // estructura logica compuesta de las acciones requeridas para para dar como cumplido el paso
                            // la estructura debe presentar opciones logicas como 
                            // 'igual a','mayos que','menor que' etc segun sea el tipo de dato
                        },
                        "emite sancion":Boolean,
                        "emite compromisos":Boolean
                    }
                },
                "responsables":{ // se seleccionan los roles que podran intervenir
                    "super":Boolean,
                    "rector":Boolean,
                    "admin":Boolean,
                    "auxiliar":Boolean,
                    "coordinador":Boolean,
                    "docente":Boolean,
                    "estudiante":Boolean,
                },
                "formatos":["URL del template en GDOC"]
            },
            "tipo3":{ // obligatorio por ley 1620 de 2013
                "pasos":{
                    // Decreto 1965 de 2013
                    "paso1":{
                        // 1. En casos de daño al cuerpo o a la salud, garantizar la atención inmediata en salud física y mental de los involucrados, mediante la remisión a las entidades competentes, actuación de la cual se dejará constancia. 
                        // 2. Informar de manera inmediata a los padres, madres o acudientes de todos los estudiantes involucrados, actuación de la cual se dejará constancia.
                        // 3. El Presidente del Comité Escolar de Convivencia de manera inmediata y por el medio más expedito, pondrá la situación en conocimiento de la Policía Nacional, actuación de la cual se dejará constancia.
                        "accion#1":{
                            // Acta de remisión a las entidades competentes
                            "nombre":"Acta remisión a las entidades competentes",
                            "campos":{ // campos relevantes para crear documentos y formularios
                                "campo#1":"tipo" // "string", "date", "boolean", "number" etc...
                            },
                            "tipo de resultado para evaluar la accion":"URL del documento generado y escaneado", // se verifica la existencia del acta escaneada, donde reposen las firmas de las partes
                            "criterio logico de validacion":{
                                // estructura logica compuesta de las acciones requeridas para para dar como cumplido el paso
                                // la estructura debe presentar opciones logicas como 
                                // 'igual a','mayos que','menor que' etc segun sea el tipo de dato
                            },
                            "emite sancion":false,
                            "emite compromisos":false
                        },
                        "accion#2":{
                            "nombre":"Notificacion a los acudientes",
                            "campos":{ // campos relevantes para crear documentos y formularios
                                "campo#1":"tipo" // "string", "date", "boolean", "number" etc...
                            },
                            "tipo de resultado para evaluar la accion":"URL del documento generado y escaneado", // se verifica la existencia del acta escaneada, donde reposen las firmas de las partes
                            "criterio logico de validacion":{
                                // estructura logica compuesta de las acciones requeridas para para dar como cumplido el paso
                                // la estructura debe presentar opciones logicas como 
                                // 'igual a','mayos que','menor que' etc segun sea el tipo de dato
                            },
                            "emite sancion":false,
                            "emite compromisos":false
                        },
                        "accion#":{
                            "nombre":"String",
                            "campos":{ // campos relevantes para crear documentos y formularios
                                "campo#1":"tipo" // "string", "date", "boolean", "number" etc...
                            },
                            "tipo de resultado para evaluar la accion":"tipo", // "string", "date", "boolean", "number" etc...
                            "criterio logico de validacion":{
                                // estructura logica compuesta de las acciones requeridas para para dar como cumplido el paso
                                // la estructura debe presentar opciones logicas como 
                                // 'igual a','mayos que','menor que' etc segun sea el tipo de dato
                            },
                            "emite sancion":"Boolean",
                            "emite compromisos":"Boolean"
                        }
                    },
                    "paso#2":{
                        // 4. No obstante, lo dispuesto en el numeral anterior, se citará a los integrantes del Comité Escolar de Convivencia en los términos fijados en el manual de convivencia. De la citación se dejará constancia.
                        // 5. El Presidente del Comité Escolar de Convivencia informará a los participantes en el comité, de los hechos que dieron lugar a la convocatoria, guardando reserva de aquella información que pueda atentar contra el derecho a la intimidad y confidencialidad de las partes involucradas, así como del reporte realizado ante la autoridad competente.
                        // 6. Pese a que una situación se haya puesto en conocimiento de las autoridades competentes, el Comité Escolar de Convivencia adoptará, de manera inmediata, las medidas propias del establecimiento educativo, tendientes a proteger dentro del ámbito de sus competencias a la víctima, a quien se le atribuye la agresión y a las personas que hayan informado o hagan parte de la situación presentada, actuación de la cual se dejará constancia.
                        // 7. El Presidente del Comité Escolar de Convivencia reportará la información del caso al aplicativo que para el efecto se haya implementado en el Sistema de Información Unificado de Convivencia Escolar.
                        // 8. Los casos sometidos a este protocolo serán objeto de seguimiento por parte del Comité Escolar de Convivencia, de la autoridad que asuma el conocimiento y del comité municipal, distrital o departamental de Convivencia Escolar que ejerza jurisdicción sobre el establecimiento educativo en el cual se presentó el hecho.
                        "accion#1":{
                            "nombre":"Citacion del comite escoar de convivencia",
                            "campos":{ // campos relevantes para crear documentos y formularios
                                "campo#1":"tipo" // "string", "date", "boolean", "number" etc...
                            },
                            "tipo de resultado para evaluar la accion":"tipo", // "string", "date", "boolean", "number" etc...
                            "criterio logico de validacion":{
                                // estructura logica compuesta de las acciones requeridas para para dar como cumplido el paso
                                // la estructura debe presentar opciones logicas como 
                                // 'igual a','mayos que','menor que' etc segun sea el tipo de dato
                            },
                            "emite sancion":false,
                            "emite compromisos":false
                        },
                        "accion#2":{
                            "nombre":"Acta de comite escoar de convivencia",
                            "campos":{ // campos relevantes para crear documentos y formularios
                                "campo#1":"tipo" // "string", "date", "boolean", "number" etc...
                            },
                            "tipo de resultado para evaluar la accion":"tipo", // "string", "date", "boolean", "number" etc...
                            "criterio logico de validacion":{
                                // estructura logica compuesta de las acciones requeridas para para dar como cumplido el paso
                                // la estructura debe presentar opciones logicas como 
                                // 'igual a','mayos que','menor que' etc segun sea el tipo de dato
                            },
                            "emite sancion":true,
                            "emite compromisos":true
                        },
                        "accion#3":{
                            "nombre":"Acta de seguimiento de compromiso",
                            "campos":{ // campos relevantes para crear documentos y formularios
                                "campo#1":"tipo" // "string", "date", "boolean", "number" etc...
                            },
                            "tipo de resultado para evaluar la accion":"tipo", // "string", "date", "boolean", "number" etc...
                            "criterio logico de validacion":{
                                // estructura logica compuesta de las acciones requeridas para para dar como cumplido el paso
                                // la estructura debe presentar opciones logicas como 
                                // 'igual a','mayos que','menor que' etc segun sea el tipo de dato
                            },
                            "emite sancion":false, // en caso de incumplimiento, afecta el acta de compromiso
                            "emite compromisos":false // en caso de incumplimiento, afecta el acta de compromiso
                        },
                        "accion#":{
                            "nombre":"String",
                            "campos":{ // campos relevantes para crear documentos y formularios
                                "campo#1":"tipo" // "string", "date", "boolean", "number" etc...
                            },
                            "tipo de resultado para evaluar la accion":"tipo", // "string", "date", "boolean", "number" etc...
                            "criterio logico de validacion":{
                                // estructura logica compuesta de las acciones requeridas para para dar como cumplido el paso
                                // la estructura debe presentar opciones logicas como 
                                // 'igual a','mayos que','menor que' etc segun sea el tipo de dato
                            },
                            "emite sancion":"Boolean",
                            "emite compromisos":"Boolean"
                        }
                    },
                    "paso#":{
                        "acciones":{
                            "nombre":String,
                            "campos":{ // campos relevantes para crear documentos y formularios
                                "campo#1":"tipo" // "string", "date", "boolean", "number" etc...
                            },
                            "tipo de resultado para evaluar la accion":"tipo" // "string", "date", "boolean", "number" etc...
                        },
                        "criterio logico de validacion":{
                            // estructura logica compuesta de las acciones requeridas para para dar como cumplido el paso
                            // la estructura debe presentar opciones logicas como 
                            // 'igual a','mayos que','menor que' etc segun sea el tipo de dato
                        },
                        "emite sancion":Boolean,
                        "emite compromisos":Boolean
                    }
                },
                "responsables":{ // se seleccionan los roles que podran intervenir
                    "super":Boolean,
                    "rector":Boolean,
                    "admin":Boolean,
                    "auxiliar":Boolean,
                    "coordinador":Boolean,
                    "docente":Boolean,
                    "estudiante":Boolean,
                },
                "formatos":["URL del template en GDOC"]
            }
        }
    },
    "manualConvivencia"={ // objeto variable
        "añoID":{
            "tipo de situaciones":{ // lista de criterios para clasificar las situaciones
                "tipo":{ // tipologia anidada de criterios relacionados
                    "sub-tipo":"String"
                }
            }, 
            "situacion":{
                "descripcion":"String", // situacion descrita en el MCE
                // caracterizacion de la situacion
                "tipo":["tipo1","tipo2","tipo3"], // obligatorio por ley 1620
                "tipo de situacion":"String" // otros que la institucion cree
            }
        }
    },
    "disciplina"={
        "añoID":{
            "EstudiantePushID":{
                "faltasTipo1":"Number",
                "faltasTipo2":"Number",
                "faltasTipo3":"Number",
                "actas":["ActaPushID"],
                "excusas":["ExcusaPushID"],
                "pendiente":"Boolean",
                "citasciones":["citascionPushID"],
                "proceso de convivencia":{
                    tipo:{ // tipo1, tipo2, tipo3
                        "PushID":{
                            "paso":"paso#PushID",
                            "accion":"accion#PushID",
                            "fecha":"firebase.database.ServerValue.TIMESTAMP",
                            "acta":"ActaPushID",
                            "citascion":"citascionPushID",
                            "documento":"URL del documento generado y escaneado",
                            "debidoProceso":"debidoProcesoPushID"
                        }
                    }
                }
            }
        }
    },
    // acta es el docuemnto en el que se relacionan las situaciones disciplinares que comete el estudiante
    // estas reflejan el seguimiento a las acciones y al debido proceso, segun el tipo de situacion
    "actas"={
        "añoID":{
            "ActaPushID" : {
                "tipo":[
                    "convivencia", // para casos tipo 1 y 2, emitidas por el coordinador o docente, en ella se relacionan las situaciones referidas en el manual y sus respectivas sanciones o compromisos
                    "seguimiento", // acta para constar el seguimiento de una acta en la que se hagan compromisos o sanciones
                    "comite escolar de convivencia", // acta de reunion del comite, en ella se relacionan las situaciones referidas en el manual y sus respectivas sanciones o compromisos
                    "remisión a las entidades competentes", // se remite a las instancias de apoyo ley 1620 de 2013
                    "medidas de proteccion", // Adoptar las medidas para proteger a los involucrados en la situación de posibles acciones en su contra ley 1620 de 2013
                    "acta de recurso de Reposición"
                ],
                "Estudiante":["EstudiantePushID"],
                "descargos" : "Portan el uniforme de forma inadecuada segun el MCE",
                "version libre":["versionLibrePushID"],
                "faltasTipo1":0,
                "faltasTipo2":0,
                "faltasTipo3":0,
                "situaciones":["situacionPushID"],
                "fecha" : "firebase.database.ServerValue.TIMESTAMP",
                "compromisos":["compromisoPushID"],
                "sanciones":["sancionPushID"],
                "debidoProceso":["debidoProcesoPushID"],
                "observaciones":["ObservacionesPushID"]
            }
        }
    },
    "pendientes"={
        "añoID":{
            "pendientePushID":{
                "documento":["ActaPushID","citascionPushID"],
                "tipo":[
                    "citacion de padres",
                    "citacion de comite escolar de convivencia",
                    "compromiso de convivencia",
                    "sancion",
                    "acta de recurso de Reposición"
                ],
                "Estudiante":"EstudiantePushID",
                "fecha" : "firebase.database.ServerValue.TIMESTAMP",
                "inicio" : "firebase.database.ServerValue.TIMESTAMP",
                "fin" : "firebase.database.ServerValue.TIMESTAMP",
                "atendido":"Boolean", // si se atendio el tema sin importar la fecha
                "atendido a tiempo":"Boolean" // si se atendio dentro del tiempo propuesto
            }
        }
    },
    "citaciones"={
        "añoID":{
            "citascionPushID":{
                "documento":"URL del archivo generado y escaneado",
                "fecha" : "firebase.database.ServerValue.TIMESTAMP",
                "Estudiante":"EstudiantePushID"
            }
        }
    },
    "excusas"={
        "añoID":{
            "ExcusaPushID":{
                "documento":"URL del archivo generado y escaneado",
                "fecha" : "firebase.database.ServerValue.TIMESTAMP",
                "Estudiante":"EstudiantePushID"
            }
        }
    },
    "versiones libres"={
        "añoID":{
            "versionLibrePushID":{
                "documento":"URL del archivo generado y escaneado",
                "fecha" : "firebase.database.ServerValue.TIMESTAMP",
                "Estudiante":"EstudiantePushID",
                "acta":"ActaPushID"
            }
        }
    },
    "sanciones"={
        "añoID":{
            "sancionPushID":{
                "Estudiante":"EstudiantePushID",
                "pendiente":Boolean,
                "acta":"ActaPushID",
                "acudiente":"AcudientePushID",
                "fecha":"firebase.database.ServerValue.TIMESTAMP",
                "fechaInicio":"TIMESTAMP",
                "fechaFin":"TIMESTAMP",
                "sancion":"String",
                "observaciones":"ObservacionesPushID"
            }
        }
    },
    "compromisos"={
        "añoID":{
            "compromisoPushID":{
                "Estudiante":"EstudiantePushID",
                "pendiente":Boolean,
                "acta":"ActaPushID",
                "acudiente":"AcudientePushID",
                "fecha":"firebase.database.ServerValue.TIMESTAMP",
                "fechaInicio":"TIMESTAMP",
                "fechaFin":"TIMESTAMP",
                "compromiso":"String",
                "observaciones":"ObservacionesPushID"
            }
        }
    },
    "observaciones"={
        "añoID":{
            "ObservacionesPushID":{
                "observacion":String,
                "Estudiante":"EstudiantePushID",
                "acudiente":"AcudientePushID",
                "fecha":"firebase.database.ServerValue.TIMESTAMP",
                "acta":"ActaPushID"
            }
        }
    }
// ------------------------------

