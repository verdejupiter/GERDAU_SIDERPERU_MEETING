/*================================================================================================================================================================================*/
/**
 * @fileOverview    Librería de métodos genéricos de ayuda
 * @author          ANGELY YAHAYRA MENDEZ CRUZ
 * @version         1.1.1
 * @updatedAt       11/09/2025
*/
/*================================================================================================================================================================================*/
// Variables globales

//TODO: Configuración de Api Pre-Uso
// const UrlApi = "/api/v1.0/pre-uso"; //@AMENDEZ5
const UrlApi   = "http://localhost/PreUsoWS/api/v1.0/pre-uso"; //ANTES
//const UrlApi   = "http://WEBSDPCP01/PreUsoWS/api/v1.0/pre-uso";

var headersApi = {"X-ApiKey":"123", "Authorization": "Basic " + btoa("jean:123")};
notificationsActionPlan();
setInterval(function () {
    notificationsActionPlan();
}, 300000);
/*================================================================================================================================================================================*/
$(document).on("click", "#card-alert .close", function() {$(this).closest('#card-alert').fadeOut('slow'); });
$("#txt-meeting-start-time, #txt-meeting-end-time").on('mousedown', function (event) { event.preventDefault(); });
/*================================================================================================================================================================================*/
function checkSessionExpired() {
    window.onfocus = function (e) {
        var userId = localStorage.getItem("UserId");
        if (userId == null || userId == 0 || userId == undefined) {
            location.reload();
        }
    };
}
/*================================================================================================================================================================================*/
function getGeneratedCode(type) {
    var text = "";
    var possible = "abcdefghijklmnopqrstuvwxyz";
    for(var i = 0; i < 2; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    var d = new Date(); var meses=""; var dias=""; var horas=""; var minutos=""; var segundos=""; var date = "";
    meses    = d.getMonth() + 1;    if (meses < 10)   {  meses    = "0" + meses; };
    dias     = d.getDate();     if (dias < 10)    {  dias     = "0" + dias;  };
    horas    = d.getHours();      if (horas < 10)   {  horas    = "0" + horas;  };
    minutos  = d.getMinutes();    if (minutos < 10) {  minutos  = "0" + minutos;  };
    segundos = d.getSeconds();    if (segundos < 10){  segundos   = "0" + segundos;  };
    date = d.getFullYear().toString().substr(-2) +  meses + dias +  horas + minutos + segundos;
    return type + "-" + date + text;
}
/*================================================================================================================================================================================*/
function initPickadate(selector, container, onClose) {
    selector.pickadate({
        monthsFull: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        monthsShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        weekdaysFull: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
        weekdaysShort: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
        showWeekdaysFull: true,
        format: 'dd/mm/yyyy',
        selectMonths: true,
        today: 'Hoy',
        clear: '',
        close: 'Aceptar',
        container: container,
        onClose: onClose
    });

    return selector.pickadate("picker");
}
/*================================================================================================================================================================================*/
function initPickatime(selector, time) {
    var timeToSend =  selector.pickatime({
        default      : time,
        fromnow      : 0,
        twelvehour   : true,
        donetext     : 'Aceptar',
        cleartext    : '',
        canceltext   : 'Cerrar',
        container    : 'body',
        autoclose    : false,
        ampmclickable: true,
        afterDone: function() {
            var pickatime = timeToSend.data().clockpicker;
            var time = convertStringToTime(pickatime);
            selector.attr("data-time24h", time);
        }
    });
    return timeToSend;
}
/*================================================================================================================================================================================*/
function initDateAndPick() {
    $('.date-meeting').pickadate({
        monthsFull: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        monthsShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        // weekdaysFull: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
        weekdaysFull: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
        weekdaysShort: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
        // showMonthsShort: true,
        showWeekdaysFull: true,
        format: 'dd/mm/yyyy',
        selectMonths: true, // Creates a dropdown to control month
        // selectYears: 15,    // Creates a dropdown of 15 years to control year,
        today: 'Hoy',
        clear: '',
        close: 'Aceptar',
        // closeOnSelect: true, // Close upon selecting a date,
        container: '.div-info-meeting' // ex. 'body' will append picker to body
    });

    $('#time-start-meeting').pickatime({
        default: 'now', // Set default time: 'now', '1:30AM', '16:30'
        fromnow: 0,       // set default time to * milliseconds from now (using with default = 'now')
        twelvehour: false, // Use AM/PM or 24-hour format
        donetext: 'Aceptar', // text for done-button
        cleartext: '', // text for clear-button
        canceltext: 'Cerrar', // Text for cancel-button,
        container: 'body',// ex. 'body' will append picker to body
        autoclose: false, // automatic close timepicker
        ampmclickable: true, // make AM PM clickable
        aftershow: function(){} //Function for after opening timepicker
    });

    $('#time-finish-meeting').pickatime({
        default: 'now', // Set default time: 'now', '1:30AM', '16:30'
        fromnow: 0,       // set default time to * milliseconds from now (using with default = 'now')
        twelvehour: false, // Use AM/PM or 24-hour format
        donetext: 'Aceptar', // text for done-button
        cleartext: '', // text for clear-button
        canceltext: 'Cerrar', // Text for cancel-button,
        container: 'body',// ex. 'body' will append picker to body
        autoclose: false, // automatic close timepicker
        ampmclickable: true, // make AM PM clickable
        aftershow: function(){} //Function for after opening timepicker
    });

    $(".txt-meeting-ap-scheduleddate").pickadate({
        monthsFull: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        monthsShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        // weekdaysFull: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
        weekdaysFull: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
        weekdaysShort: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
        // showMonthsShort: true,
        showWeekdaysFull: true,
        format: 'dd/mm/yyyy',
        selectMonths: true, // Creates a dropdown to control month
        // selectYears: 15,    // Creates a dropdown of 15 years to control year,
        today: 'Hoy',
        clear: '',
        close: '',
        // closeOnSelect: true, // Close upon selecting a date,
        container: '.div-actionplan' // ex. 'body' will append picker to body
    });
}
/*================================================================================================================================================================================*/
function isAssistant() {
    return window.IsAssistant === true ||
        window.IsAssistant === "true" ||
        window.IsAssistant === "True" ||
        window.IsAssistant === 1 ||
        window.IsAssistant === "1";
}
/*================================================================================================================================================================================*/
/**
 * Agregar input text area (comentarios)
 */
function addInputTextArea(iconClass, inputClass, name, label, $divSelector) {
    var isAssistantUser = isAssistant();
    var deleteIconHtml = !isAssistantUser ?
        '<i class="material-icons prefix i-delete ' + iconClass + '" ' +
        'style="color:#e53935;cursor:pointer;margin-right:8px;font-size:24px;align-self:center;" ' +
        'title="Eliminar">delete_forever</i>' : '';

    var disabledAttr = isAssistantUser ? 'disabled' : '';

    var newDiv = $(/*html*/`
        <div style="display: flex; align-items: center; width: 100%; margin-bottom: 10px; padding-top: 30px;">
            ${deleteIconHtml}
            <div style="flex:1;">
                <div class="input-field-with-icon" style="margin:0;">
                    <input name="${name}" class="${inputClass}" type="text" autocomplete="off" placeholder="Escribir ${label}" style="width:100%;" ${disabledAttr}>
                    <label style="left:0;">${label}</label>
                </div>
            </div>
        </div>
    `).hide();

    $divSelector.append(newDiv);
    newDiv.show("slow");

    // Solo añadir tooltip si no es asistente
    if (!isAssistantUser) {
        $("." + iconClass).tooltip({ delay: 50, tooltip: "Eliminar", position: "left" });
    }
}

/*==========================================================================================================================================================================*/
/**
 * Agregar input text
 */
function addInputText(iconClass, inputClass, name, label, $divSelector) {
    var newDiv = $('<div class="input-field-with-icon">'
                        +'<i class="material-icons prefix i-delete ' + iconClass + '">delete_forever</i>'
                        +'<input name="' + name +'" class="' + inputClass + '" type="text" autocomplete="off">'
                        +'<label>' + label + '</label>'
                    +'</div>').hide();

    $divSelector.append(newDiv);
    newDiv.show("slow");
    $("." + iconClass).tooltip({delay: 50, tooltip: "Eliminar", position: "left"});
}
/*================================================================================================================================================================================*/

/**
 * Agregar input text Pauta (agenda)
 */
function addInputPauta(iconClass, inputClass, name, label, $divSelector) {
    var isAssistantUser = isAssistant();
    var deleteIconHtml = !isAssistantUser ?
        '<i class="material-icons prefix i-delete ' + iconClass + '" ' +
        'style="color:#e53935;cursor:pointer;margin-right:8px;font-size:24px;" ' +
        'title="Eliminar">delete_forever</i>' : '';

    var disabledAttr = isAssistantUser ? 'disabled' : '';

    var newDiv = $(/*html*/`
        <div style="display: flex; align-items: center; width: 100%; margin-bottom: 10px; padding-top: 30px;">
            ${deleteIconHtml}
            <div style="flex:1;">
                <div class="input-field-with-icon" style="margin:0;">
                    <input name="${name}" class="${inputClass}" type="text" autocomplete="off" placeholder="Escribir ${label}" style="width:100%;" ${disabledAttr}>
                    <label style="left:0;">${label}</label>
                </div>
            </div>
        </div>
    `).hide();

    $divSelector.append(newDiv);
    newDiv.show("slow");

    // Solo añadir tooltip si no es asistente
    if (!isAssistantUser) {
        $("." + iconClass).tooltip({ delay: 50, tooltip: "Eliminar", position: "left" });
    }
}

/*================================================================================================================================================================================*/
/**
 * Eliminar input text Pauta
 */
function removeInputPauta() {
    $(this).closest("div[style*='display: flex']").hide("slow", function () {
        $(this).remove();
    });
}
/*================================================================================================================================================================================*/
/**
 * Eliminar input text (pauta, descripción de desarrollo)
 */
function removeInput() {
    $(this).closest("div[style*='display: flex']").hide("slow", function () {
        $(this).remove();
    });
}
/*================================================================================================================================================================================*/
/**
 * Agregar acción
 */
function addAction(nro, users) {
    var newDiv = $('<div class="row div-action-detail">'
                        +'<div class="col s1" style="width:auto;">'
                            +'<i class="material-icons prefix font-size-2rem i-delete i-delete-action">delete_forever</i>'
                        +'</div>'
                         +'<div class="col s3">'
                            +'<div class="input-field col s12">'
                                +'<i class="material-icons prefix">assignment</i>'
                                +'<textarea class="materialize-textarea textarea-material-normal txt-meeting-ap-action"></textarea>'
                            +'</div>'
                        +'</div>'
                        +'<div class="col s3">'
                            +'<div class="input-field col s12">'
                                +'<i class="material-icons prefix">assignment</i>'
                                +'<textarea class="materialize-textarea textarea-material-normal txt-meeting-ap-action"></textarea>'
                            +'</div>'
                        +'</div>'
                        +'<div class="col s3">'
                            +'<div class="input-field col s12">'
                                +'<i class="material-icons prefix">person</i>'
                                +'<textarea class="materialize-textarea textarea-material-normal txt-ap-responsible txt-ap-responsible-'+nro+'"></textarea>'
                            +'</div>'
                        +'</div>'
                        +'<div class="col s2">'
                            +'<div class="input-field col s12">'
                                +'<i class="material-icons prefix">date_range</i>'
                                +'<textarea class="materialize-textarea textarea-material-normal txt-ap-scheduleddate txt-ap-scheduleddate-'+nro+'"></textarea>'
                            +'</div>'
                        +'</div>'
                    +'</div>').hide();

   $("#div-action").append(newDiv);
   newDiv.show("slow");
   $(".i-delete-action").tooltip({delay: 50, tooltip: "Eliminar", position: "left"});

   // Inicializar fecha programada con el plugin pickadate
   var pickadate = initPickadate($(".txt-ap-scheduleddate-" + nro), '.div-actionplan');
   pickadate.set('select', getCurrentDatetime(1), { format: 'dd/mm/yyyy' });

   // Inicializar el autocompletado de responsables de acción
   initAutocompleteUser(".txt-ap-responsible-" + nro, users);
}
/*================================================================================================================================================================================*/
/**
 * Eliminar acción
 */
function deleteAction() {
    $(this).blur();
    $(this).parents(".div-action-detail").hide("slow", function(e) {
        e.preventDefault();
        $(this).remove();
    });
}
/*================================================================================================================================================================================*/
/**
 * Inicializar el plugin modal
 */
function initModal() {
    $('.modal').modal({
        dismissible: false, // Modal can be dismissed by clicking outside of the modal
        opacity: .5, // Opacity of modal background
        inDuration: 300, // Transition in duration
        outDuration: 200, // Transition out duration
        startingTop: '4%', // Starting top style attribute
        endingTop: '10%', // Ending top style attribute
        ready: function(modal, trigger) {
        },
        complete: function() {
            // alert('Closed');
        }
    });
}
/*================================================================================================================================================================================*/
/**
 * Inicializar el plugin Dropify para subir imagen
 */
/*function initDropify() {
    // Translated
    var drEvent = $('.dropify-es').dropify({
        messages: {
            default: 'Arrastra y suelte un archivo aquí o haga click',
            replace: 'Arrastra y suelta un archivo o haz click para reemplazar',
            remove:  'Quitar',
            error:   'Error'
        },
        error: {
            'fileSize': 'El tamaño de la imágen es muy grande ({{ value }} max).',
            'fileExtension':'El archivo no está permitido (Sólo imágenes)'
        },
        tpl: {
            wrap:            '<div class="dropify-wrapper"></div>',
            loader:          '<div class="dropify-loader"></div>',
            message:         '<div class="dropify-message"><span class="file-icon" /> <p>{{ default }}</p></div>',
            preview:         '<div class="dropify-preview"><span class="dropify-render"></span><div class="dropify-infos"><div class="dropify-infos-inner"><p class="dropify-infos-message">{{ replace }}</p></div></div></div>',
            filename:        '<p class="dropify-filename"><span class="file-icon"></span> <span class="dropify-filename-inner"></span></p>',
            clearButton:     '<button type="button" class="dropify-clear">{{ remove }}</button>',
            errorLine:       '<p class="dropify-error">{{ error }}</p>',
            errorsContainer: '<div class="dropify-errors-container"><ul></ul></div>'
        }
    });

    // Used events
    /*drEvent.on('dropify.beforeClear', function(event, element){
        return confirm("¿Desea eliminar este imagen \"" + element.filename + "\" ?");
    });

    drEvent.on('dropify.afterClear', function(event, element){
        alert('Imagen eliminado');
    });*/
//} // ANTES
/*================================================================================================================================================================================*/
/**
 * Inicializar el plugin Dropify para subir imagen
 */
/*function initDropifyByselector(selector) {
    var drEvent = $(selector).each(function () {
        var $input = $(this);

        // Si el input tiene el atributo multiple, usar la versión múltiple
        if ($input.attr('multiple')) {
            return $input.dropifyMultipleModern({
                messages: {
                    'default': 'Arrastra y suelta archivos aquí o haz clic',
                    'replace': 'Arrastra y suelta o haz clic para reemplazar',
                    'remove': 'Quitar',
                    'error': 'Ha ocurrido un error.',
                    'fileCount': 'archivos seleccionados',
                    'noFilesSelected': 'No se ha seleccionado ningún archivo'
                },
                error: {
                    'fileSize': 'El tamaño del archivo es demasiado grande ({{ value }} máx).',
                    'fileExtension': 'El archivo no está permitido ({{ value }} solo).'
                },
                showRemove: true,
                showLoader: true,
                showErrors: true
            });
        } else {
            // Para inputs sin múltiples archivos, usar Dropify normal (o la versión múltiple si quieres unificar)
            return $input.dropifyMultipleModern({
                messages: {
                    default: 'Arrastra y suelte un archivo aquí o haga click',
                    replace: 'Arrastra y suelta un archivo o haz click para reemplazar',
                    remove: 'Quitar',
                    error: 'Error'
                },
                error: {
                    'fileSize': 'El tamaño de la imágen es muy grande ({{ value }} max).',
                    'fileExtension': 'El archivo no está permitido'
                },
                showRemove: true,
                showLoader: true,
                showErrors: true
            });
        }
    });

    return drEvent;
}*/ //ANTES
/*================================================================================================================================================================================*/
/**
 * Agregar imagen con descripción
 */
function addDescriptionImage() {
    var newDiv = $('<div class="row div-dimage" style="padding-bottom:20px;">'
                        +'<div class="divider"></div><br>'
                        +'<div style="padding-top:20px;">'
                            +'<div class="col s1" style="width: auto;">'
                                +'<i class="material-icons prefix font-size-2rem i-delete i-delete-dimage">delete_forever</i>'
                            +'</div>'
                            +'<div class="col s5">'
                                +'<div class="input-field">'
                                    +'<i class="material-icons prefix">title</i>'
                                    +'<textarea id="txt-dimage-title" class="materialize-textarea textarea-material-normal txt-meeting-dev-title"></textarea>'
                                    +'<label>Título de la imagen</label>'
                                +'</div>'
                                +'<div class="input-field">'
                                    +'<i class="material-icons prefix">description</i>'
                                    +'<textarea id="txt-dimage-title" class="materialize-textarea textarea-material-normal txt-meeting-dev-description"></textarea>'
                                    +'<label>Descripción de la imagen</label>'
                                +'</div>'
                            +'</div>'
                            +'<div class="col s5">'
                                +'<input type="file" accept="image/*" class="file-meetingDevImage dropify-es" data-allowed-file-extensions="png jpg jpeg" data-max-file-size="5M"/>'
                            +'</div>'
                        +'</div>'
                    +'</div>').hide();

    $("#div-meeting-dimage").append(newDiv);
    newDiv.show("slow");
    $(".i-delete-dimage").tooltip({delay: 50, tooltip: "Eliminar", position: "left"});
    initDropify();
}
/*================================================================================================================================================================================*/
/**
 * Eliminar imagen con descripción
 */
function removeDescriptionImage() {
    $(this).blur();
    $(this).parents(".div-dimage").hide("slow", function(e) {
        $(this).remove();
    });
}
/*================================================================================================================================================================================*/
/**
 * Eliminar anexo
 */
function removeAttachFile() {
    $(this).blur();
    $(this).parents(".div-attached").hide("slow", function(e) {
        $(this).remove();
    });
}
/*================================================================================================================================================================================*/
function showAlertMessage(selector, divClass, icon, title, description, duration) {
    var newDiv = $('<div id="card-alert" class="card '+ divClass +' lighten-1">'
    +'<div class="card-content white-text">'
    +'<p><i class="material-icons">' + icon + '</i> <b>' + title + '</b> ' + description + '.</p>'
    +'</div>'
    +'<button type="button" class="close white-text" aria-label="Close">'
    +'<span aria-hidden="true">×</span>'
    +'</button>'
    +'</div>').hide();

    selector.html(newDiv).show();
    newDiv.fadeIn("slow");
    if(duration > 0) {
        setTimeout(function(){ newDiv.fadeOut("slow", function(){
            newDiv.remove();
        });}, duration);
    }
}
/*==============================================================================================================================================================================*/
function getStringCurrentDatetime() {
    var date        = new Date();
    var month       = "";
    var day         = "";
    var hour        = "";
    var minute      = "";
    var second      = "";
    var strDate     = "";
    var strDatetime = "";

    month           = date.getMonth() + 1; if (month < 10) {month = "0" + month; };
    day             = date.getDate();  if (day < 10) {  day = "0" + day;  };
    hour            = date.getHours();  if (hour < 10) {  hour = "0" + hour;  };
    minute          = date.getMinutes();  if (minute < 10) {  minute = "0" + minute;  };
    second          = date.getSeconds();  if (second < 10) {  second = "0" + second;  };

    strDate         = day + "/" + month + "/" + date.getFullYear();
    // strDatetime     = date.getFullYear() + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
    return strDate;
}
/*==============================================================================================================================================================================*/
/**
 * Obtener la fecha y hora actual.
 */
function getCurrentDatetime(type) {
    var date        = new Date();
    var month       = "";
    var day         = "";
    var hour        = "";
    var minute      = "";
    var second      = "";

    month           = date.getMonth() + 1;  if (month < 10) {month = "0" + month; };
    day             = date.getDate();       if (day < 10) {  day = "0" + day;  };
    hour            = date.getHours();      if (hour < 10) {  hour = "0" + hour;  };
    minute          = date.getMinutes();    if (minute < 10) {  minute = "0" + minute;  };
    second          = date.getSeconds();    if (second < 10) {  second = "0" + second;  };

    var currentDate;
    switch(type) {
      case 0:
        currentDate = date.getFullYear() + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
      break;
      case 1:
        currentDate = day + "/" +  month + "/" + date.getFullYear();
      break;
    }
    return currentDate;
}
/*================================================================================================================================================================================*/
function convertStringToDate(_date,_format,_delimiter) {
    var formatLowerCase =   _format.toLowerCase();
    var formatItems     =   formatLowerCase.split(_delimiter);
    var dateItems       =   _date.split(_delimiter);
    var monthIndex      =   formatItems.indexOf("mm");
    var dayIndex        =   formatItems.indexOf("dd");
    var yearIndex       =   formatItems.indexOf("yyyy");
    var month           =   parseInt(dateItems[monthIndex]);
    month-= 1;
    var formatedDate    =    new Date(dateItems[yearIndex],month,dateItems[dayIndex]);
    return formatedDate;
}
/*================================================================================================================================================================================*/
function formatStrDate(_date,_format,_delimiter) {
    var formatLowerCase =   _format.toLowerCase();
    var formatItems     =   formatLowerCase.split(_delimiter);
    var dateItems       =   _date.split(_delimiter);
    var monthIndex      =   formatItems.indexOf("mm");
    var dayIndex        =   formatItems.indexOf("dd");
    var yearIndex       =   formatItems.indexOf("yyyy");
    var month           =   dateItems[monthIndex];
    var formatedDate    =   dateItems[yearIndex] + "-" + month + "-" + dateItems[dayIndex];
    return formatedDate;
}
/*================================================================================================================================================================================*/
function InitSelect2(selector, placeholder, data) {
    $(selector).select2({
        data: data,
        theme: "bootstrap",
        placeholder: placeholder,
        language: {
            noResults: function () {
                return 'No se encontró datos';
            }
        }
    })
        .val(null).trigger('change');
}
/*================================================================================================================================================================================*/
function initAutocompleteUser(selector, users) {
  $(selector).autoComplete({
    minChars: 1,
    autoFocus: true,
    source: function(term, suggest){
      var selectedUserIds = '';
      if(users != null) {
          $.each(users, function(i, item) {
            if(item.UserId) {
              selectedUserIds += item.UserId + ",";
            }
          });
      }
      term = term.toLowerCase();
      $.ajax({
        type: "POST",
        url: baseUrl + '/getUserByUserName',
        data:  {
          UserName: term,
          selectedUserIds: selectedUserIds == '' ? 0 : selectedUserIds + "0"
        },
        timeout: (60*1000),
        success     : function (response) {
            var responseJson = $.parseJSON(response);
            var UserArray = [];
            if(responseJson.User && responseJson.User.length > 0){
                $.each(responseJson.User, function( i, item ) {
                    var itemArray = [item.UserName, item.UserId, item.AreaName, item.CellName, item.EnterpriseName];
                    UserArray.push(itemArray);
                });
                var choices = UserArray;
                var suggestions = [];
                var searchWords = term.split(' ');
                for (i = 0; i < choices.length; i++) {
                    var userName = (choices[i][0] + ' ' + choices[i][1]).toLowerCase();
                    var allMatch = searchWords.every(function (word) {
                        return userName.indexOf(word) !== -1;
                    });
                    if (allMatch) suggestions.push(choices[i]);
                }
                suggest(suggestions);
            }
        }
      })
      },
    /*
    renderItem: function (item, search){
      search = search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      var re = new RegExp("(" + search.split(' ').join('|') + ")", "gi");
      return '<div class="autocomplete-suggestion" data-text="'+item[0]+'" data-id="'+item[1]+'" data-val="'+search+'" data-area="'+item[2]+'" data-cell="'+item[3]+'" data-enterprise="'+item[4]+'">'+item[0].replace(re, "<b>$1</b>")+'</div>';
    },*/
    //21/8
      renderItem: function (item, search) {
          search = search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
          var re = new RegExp("(" + search.split(' ').join('|') + ")", "gi");
          // Iniciales para el círculo
          var initials = item[0].split(' ').map(x => x[0]).join('').substring(0, 2).toUpperCase();
          return `
    <div class="autocomplete-suggestion"
         data-text="${item[0]}"
         data-id="${item[1]}"
         data-val="${search}"
         data-area="${item[2]}"
         data-cell="${item[3]}"
         data-enterprise="${item[4]}"
         style="display:flex;align-items:center;">
      <span style="display:inline-block;width:32px;height:32px;border-radius:50%;background:#e0e0e0;color:#444;text-align:center;line-height:32px;font-weight:bold;margin-right:10px;">
        ${initials}
      </span>
      <div style="display:flex;flex-direction:column;">
        <span style="font-weight:bold;">${item[0].replace(re, "<b>$1</b>")}</span>
        <span style="font-size:12px;color:#888;">
          ${item[2] ? `<span>${item[2]}</span>` : ''}
          ${item[3] ? ` | <span>${item[3]}</span>` : ''}
          ${item[4] ? ` | <span>${item[4]}</span>` : ''}
        </span>
      </div>
    </div>
  `;
      },
    onSelect: function(e, term, item) {
      $(selector).val(item.data('text'))
      .attr("data-userid", item.data('id'))
      .attr("data-username", item.data('text'))
      .attr("data-area", item.data('area'))
      .attr("data-cell", item.data('cell'))
      .attr("data-enterprise", item.data('enterprise'));
    }
  });

  $(selector).on('blur', function() {
    var userId   = $(this).attr("data-userid");
    var userName = $(this).attr("data-username");
    if($(this).val() != userName) {
        $(this).val("");
        $(this).attr("data-userid", "0");
        $(this).attr("data-username", "0");
    }
  });
}
/*================================================================================================================================================================================*/
function validateFormModal() {
    return $("#form-modal").validate({
            errorClass: "error2", //@AMENDEZ5
            errorElement : 'div',
            errorPlacement: function(error, element) {
                var placement = $(element).data('error');
                if (placement) {
                    $(placement).append(error)
                } else {
                    error.insertAfter(element);
                }
            },
            submitHandler: function() {
            }
        });
}
/*================================================================================================================================================================================*/
function getAllTypeMeeting(withAll) {
    $.getJSON(baseUrl + "/getAllTypeMeeting", function (response) {
        var responseJson = $.parseJSON(response);
        var arrayTM = [];
        if (withAll) {
            $("#cbo-type-meeting").append('<option value="0">* Todos</option>');
        }
        $.each(responseJson.TypeMeeting, function (i, item) {
            var objectTM = {};
            objectTM.id = item.TypeMeetingCode;
            objectTM.text = item.TypeMeetingDescription;
            arrayTM.push(objectTM);
        });
        $(".select-wrapper .caret").remove();
        $(".select-wrapper input[type=text].select-dropdown").remove();
        $("#cbo-type-meeting").select2({
            data: arrayTM,
            theme: "bootstrap",
            allowClear: withAll,
            placeholder: "Seleccione...",
            language: { noResults: function () { return 'No se encontró datos'; } }
        });
    });
}
/*================================================================================================================================================================================*/
function getAllArea(withAll, callback) { //16/8
    $.ajax({
        url: baseUrl + '/getAllArea',
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            var $select = $("#cbo-area");
            // Si el select está dentro de un select-wrapper de Materialize, lo sacamos
            if ($select.parent().hasClass("select-wrapper")) {
                var $wrapper = $select.parent();
                $wrapper.after($select);
                $wrapper.remove();
            }
            $select.empty();

            // Agrega el placeholder "Seleccione..." inhabilitado y seleccionado
            $select.append('<option value="" disabled selected>Seleccionar...</option>');

            if (withAll) {
                $select.append('<option value="0">* Todos</option>');
            }
            if (response.Area && response.Area.length > 0) {
                $.each(response.Area, function (i, item) {
                    $select.append('<option value="' + item.AreaId + '">' + item.AreaName + '</option>');
                });
            }

            // Eliminar la clase y los elementos generados por Materialize
            if ($select.hasClass("initialized")) {
                try {
                    var instance = M.FormSelect.getInstance($select[0]);
                    if (instance) instance.destroy();
                } catch (e) { }
                $select.removeClass("initialized");
                $select.siblings("input.select-dropdown").remove();
                $select.siblings("ul.dropdown-content").remove();
            }
            $select.select2({ theme: "bootstrap", minimumResultsForSearch: 0 });
            setTimeout(function () {
                $('.select2-container--bootstrap .select2-selection--single').css({
                    'background': '#fff',
                    'border': '1px solid #ced4da',
                    'padding-left': '12px'
                });
                //16/8
                if (typeof callback === "function") callback();

            }, 0);
        },
        error: function (xhr, status, error) {
            console.error("Error al obtener áreas:", error);
        }
    });
} //@AMENDEZ5
/*================================================================================================================================================================================*/
function getCellByAreaId(areaId, callback) {
    $.ajax({
        url: UrlApi + '/getCellByAreaId/' + areaId,
        type: 'GET',
        dataType: 'json',
        headers: headersApi,
        success: function (response) {
            var $select = $("#cbo-cell");
            // Si el select está dentro de un select-wrapper de Materialize, lo sacamos
            if ($select.parent().hasClass("select-wrapper")) {
                var $wrapper = $select.parent();
                $wrapper.after($select);
                $wrapper.remove();
            }

            $select.empty();
            $select.append('<option value="" disabled selected>Seleccionar...</option>');
            $select.append('<option value="0">* Todas</option>');
            if (response.Cell && response.Cell.length > 0) {
                $.each(response.Cell, function (i, item) {
                    $select.append('<option value="' + item.CellId + '">' + item.CellName + '</option>');
                });
            }

            // Si el área es "GERENCIA INDUSTRIAL", elimina la opción "DESMONTAJE DE ACTIVOS"
            var areaText = $("#cbo-area option:selected").text().trim().toUpperCase();
            if (areaText === "GERENCIA INDUSTRIAL") {
                $("#cbo-cell option").filter(function () {
                    return $(this).text().trim().toUpperCase() === "DESMONTAJE DE ACTIVOS";
                }).remove();
            }

            // Eliminar la clase y los elementos generados por Materialize
            if ($select.hasClass("initialized")) {
                try {
                    var instance = M.FormSelect.getInstance($select[0]);
                    if (instance) instance.destroy();
                } catch (e) { }
                $select.removeClass("initialized");
                $select.siblings("input.select-dropdown").remove();
                $select.siblings("ul.dropdown-content").remove();
            }
            $select.select2({ theme: "bootstrap", minimumResultsForSearch: 0 });
            setTimeout(function () {
                $('.select2-container--bootstrap .select2-selection--single').css({
                    'background': '#fff',
                    'border': '1px solid #ced4da',
                    'padding-left': '12px'
                });
                if (typeof callback === "function") callback();
            }, 0);
        },
        error: function (xhr, status, error) {
            console.error("Error al obtener células:", error);
        }
    });
}
/*================================================================================================================================================================================*/
function addFile() {
    $(this).blur();
    var newDiv = $('<div class="col s3 div-file-dropify" style="padding-bottom: 20px;margin-top: -25px;">'
        +'<a href="javascript:void(0);" class="btn-delete-file" title="Eliminar">'
        +'<img  style="width: 30px; float: right; top: 19px; right: -8px; z-index: 99; position:relative;" src="' + baseUrl + '/Content/MeetingRecordAppWeb/img/ic_cancel_48.png">'
        +'</a>'
        +'<input type="file" accept="*" class="file-ap-detail dropify-es" data-max-file-size="100M"/>'
        +'</div>').hide("fast", function() {
        initDropify();
    });
    $(".div-input-file").append(newDiv);
    newDiv.show("slow");
    $('.card-reveal').animate({scrollTop: $('.card-reveal').prop("scrollHeight") }, 2000);
}
/*================================================================================================================================================================================*/
function deleteFile() {
    $(this).parents(".div-file-dropify").hide("slow", function() {
        $(this).remove();
    });
}
/*================================================================================================================================================================================*/
function getIconfile(extension) {
    var iconfile = "";
    switch(extension) {
        case ".xlsx":
        case ".xls":
            iconfile = baseUrl + "/Content/MeetingRecordAppWeb/iconfile/ic_excel.svg"
            break;
        case ".docx":
             iconfile = baseUrl + "/Content/MeetingRecordAppWeb/iconfile/ic_word.svg"
            break;
        case ".pptx":
             iconfile = baseUrl + "/Content/MeetingRecordAppWeb/iconfile/ic_powerpoint.svg"
            break;
        case ".pdf":
             iconfile = baseUrl + "/Content/MeetingRecordAppWeb/iconfile/ic_pdf.svg"
            break;
        case ".rar":
             iconfile = baseUrl + "/Content/MeetingRecordAppWeb/iconfile/ic_rar.svg"
            break;
        case ".zip":
             iconfile = baseUrl + "/Content/MeetingRecordAppWeb/iconfile/ic_zip.svg"
            break;
        case ".7zip":
             iconfile = baseUrl + "/Content/MeetingRecordAppWeb/iconfile/ic_7zip.svg"
            break;
        default:
             iconfile = baseUrl + "/Content/MeetingRecordAppWeb/iconfile/ic_file.svg"
            break;
    }
    return iconfile;
}
/*================================================================================================================================================================================*/
function initDateRange(emptyOnInit) {
    var onClose = function (thingSet) {
        $('html, body').animate({ scrollTop: $("html").offset().top - 50 });
        $(":focus").blur();
    }

    // Verificamos que los elementos existan antes de inicializarlos
    if ($("#txt-start-date").length === 0 || $("#txt-end-date").length === 0) {
        console.warn("Los selectores de fecha no están disponibles en el DOM");
        return;
    }

    var pickaStartDate = initPickadate($("#txt-start-date"), "html", onClose);
    var pickaEndDate = initPickadate($("#txt-end-date"), "html", onClose);

    if (emptyOnInit) {
        pickaStartDate.clear();
        pickaEndDate.clear();
    } else {
        try {
            pickaStartDate.set('select', getCurrentDatetime(1), { format: 'dd/mm/yyyy' });
            pickaEndDate.set('select', getCurrentDatetime(1), { format: 'dd/mm/yyyy' });
            pickaEndDate.set('min', getCurrentDatetime(1), { format: 'dd/mm/yyyy' });
        } catch (e) {
            console.error("Error al configurar las fechas:", e);
        }
    }

    pickaStartDate.on({
        set: function (thingSet) {
            try {
                var startDateVal = $("#txt-start-date").val();
                if (startDateVal) {
                    pickaEndDate.set('min', startDateVal, { format: 'dd/mm/yyyy' });

                    var startDate = convertStringToDate(getCurrentDatetime(1), 'dd/mm/yyyy', '/');
                    var endDate = convertStringToDate(startDateVal, 'dd/mm/yyyy', '/');

                    if (startDate && endDate && startDate < endDate) {
                        pickaEndDate.set('select', startDateVal, { format: 'dd/mm/yyyy' });
                    }
                }
            } catch (e) {
                console.error("Error al actualizar la fecha de fin:", e);
            }
        }
    });

    return { startDate: pickaStartDate, endDate: pickaEndDate };
}//@AMENDEZ5
/*================================================================================================================================================================================*/
function notificationsActionPlan() {
    var data = {};
    var userId = localStorage.getItem("UserId");
    data.responsibleUserId = userId != null ? parseInt(userId) : 0;
    return $.ajax({
        type: "POST",
        url: baseUrl + "/ActionPlan/getActionPlanByUserId",
        data: JSON.stringify(data),
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        async: false,
        success: function (response) {
            var responseJson = $.parseJSON(response);
            $("#notifications-dropdown").empty();
            $("#notification-small").empty();

            if (localStorage.getItem("UserName")) {
                var userName = localStorage.getItem("UserName").toLowerCase().split(" ");
                userName[0] = userName[0].charAt(0).toUpperCase() + userName[0].slice(1);
                if (userName.length > 2) {
                    userName[2] = userName[2].charAt(0).toUpperCase() + userName[2].slice(1);
                }
                var formattedUserName = userName[0];
                if (userName.length > 2) {
                    formattedUserName += " " + userName[2];
                }
                $("#span-username").text(formattedUserName);
            }

            if (localStorage.getItem("UserRole")) {
                var userRole = localStorage.getItem("UserRole");
                var rolText = (userRole == "1" || userRole == "2") ? "Administrador" : "Colaborador";
                $("#span-rol").text(rolText);
            }

            $("#notifications-dropdown").append(
                '<li><h6>NOTIFICACIONES<span class="new badge notification-count"></span></h6></li>' +
                '<li class="divider"></li>'
            );

            var countActionPlan = responseJson.ActionPlan?.length || 0;
            if (countActionPlan > 0) {
                $("#notification-small").html('<small class="notification-count notification-badge red">' + countActionPlan + '</small>');
                $(".notification-count").text(countActionPlan);

                // Mostramos solo las primeras 3 notificaciones
                var notificationsToShow = responseJson.ActionPlan.slice(0, 3);

                $.each(notificationsToShow, function (index, item) {
                    var statusColor, statusText;

                    if (item.ActionPlanStatus == 1 || item.ActionPlanStatus == "1") {
                        statusColor = "yellow";
                        statusText = "En Proceso";
                    } else if (item.ActionPlanStatus == 2 || item.ActionPlanStatus == "2") {
                        statusColor = "red";
                        statusText = "Fuera de Plazo";
                    }

                    var priorityColor = "grey";
                    var priorityText = item.ActionPlanPriority || "No definida";

                    if (item.ActionPlanPriority === "ALTA") {
                        priorityColor = "red";
                        priorityText = "ALTA";
                    } else if (item.ActionPlanPriority === "MEDIA") {
                        priorityColor = "orange darken-1";
                        priorityText = "MEDIA";
                    } else if (item.ActionPlanPriority === "BAJA") {
                        priorityColor = "green";
                        priorityText = "BAJA";
                    }

                    $("#notifications-dropdown").append(
                        '<li>' +
                        '<a href="'+ baseUrl +'/ActionPlan" class="grey-text text-darken-2">' +
                        '<div style="display:flex; align-items:center; margin-bottom:5px;">' +
                        '<span class="material-icons icon-bg-circle ' + statusColor + ' small" style="margin-right:8px;">check</span>' +
                        '<span style="font-weight:bold; flex:1;">' + item.ActionPlanWhat + '</span>' +
                        '</div>' +
                        '<div style="margin-left:30px; font-size:11px;">' +
                        '<div><b>Fecha programada:</b> ' + item.ActionPlanScheduledDate + '</div>' +
                        '<div style="display:flex; justify-content:space-between; margin-top:4px;">' +
                        '<span class="new badge ' + statusColor + '" style="margin-right:5px; white-space:nowrap; font-weight:bold;">' + statusText + '</span>' +
                        '<span class="new badge ' + priorityColor + '" style="font-weight:bold;">' + priorityText + '</span>' +
                        '</div>' +
                        (item.ActionPlanCategoryName ? '<div style="margin-top:4px;"><b>Categoría:</b> ' + item.ActionPlanCategoryName + '</div>' : '') +
                        '</div>' +
                        '</a>' +
                        '</li>' +
                        '<li class="divider" style="margin:2px 0;"></li>'
                    );
                });

                // Si hay más de 3 notificaciones, agregamos el enlace "Ver todas"
                if (countActionPlan > 3) {
                    $("#notifications-dropdown").append(
                        '<li>' +
                        '<a href="' + baseUrl +'/ActionPlan" class="grey-text text-darken-2 view-all-notifications" style="text-align:center; font-weight:bold; background-color:#f5f5f5; padding:8px;">' +
                        'Ver todas (' + countActionPlan + ')' +
                        '</a>' +
                        '</li>' +
                        '<li class="divider notifications-scroll-container" style="margin:0;"></li>'
                    );

                    // Añadir contenedor para las notificaciones adicionales (inicialmente oculto)
                    $("#notifications-dropdown").append('<div id="all-notifications-container" style="display:none; max-height:300px; overflow-y:auto;"></div>');

                    // Añadir todas las notificaciones al contenedor oculto
                    $.each(responseJson.ActionPlan, function (index, item) {
                        var statusColor, statusText;

                        if (item.ActionPlanStatus == 1 || item.ActionPlanStatus == "1") {
                            statusColor = "yellow";
                            statusText = "En Proceso";
                        } else if (item.ActionPlanStatus == 2 || item.ActionPlanStatus == "2") {
                            statusColor = "red";
                            statusText = "Fuera de Plazo";
                        }

                        var priorityColor = "grey";
                        var priorityText = item.ActionPlanPriority || "No definida";

                        if (item.ActionPlanPriority === "ALTA") {
                            priorityColor = "red";
                            priorityText = "ALTA";
                        } else if (item.ActionPlanPriority === "MEDIA") {
                            priorityColor = "orange darken-1";
                            priorityText = "MEDIA";
                        } else if (item.ActionPlanPriority === "BAJA") {
                            priorityColor = "green";
                            priorityText = "BAJA";
                        }

                        $("#all-notifications-container").append(
                            '<li>' +
                            '<a href="' + baseUrl +'/ActionPlan" class="grey-text text-darken-2">' +
                            '<div style="display:flex; align-items:center; margin-bottom:5px;">' +
                            '<span class="material-icons icon-bg-circle ' + statusColor + ' small" style="margin-right:8px;">check</span>' +
                            '<span style="font-weight:bold; flex:1;">' + item.ActionPlanWhat + '</span>' +
                            '</div>' +
                            '<div style="margin-left:30px; font-size:11px;">' +
                            '<div><b>Fecha programada:</b> ' + item.ActionPlanScheduledDate + '</div>' +
                            '<div style="display:flex; justify-content:space-between; margin-top:4px;">' +
                            '<span class="new badge ' + statusColor + '" style="margin-right:5px; white-space:nowrap; font-weight:bold;">' + statusText + '</span>' +
                            '<span class="new badge ' + priorityColor + '" style="font-weight:bold;">' + priorityText + '</span>' +
                            '</div>' +
                            (item.ActionPlanCategoryName ? '<div style="margin-top:4px;"><b>Categoría:</b> ' + item.ActionPlanCategoryName + '</div>' : '') +
                            '</div>' +
                            '</a>' +
                            '</li>' +
                            '<li class="divider" style="margin:2px 0;"></li>'
                        );
                    });

                    // Agregar evento click para mostrar todas las notificaciones
                    $(document).off('click', '.view-all-notifications').on('click', '.view-all-notifications', function (e) {
                        e.preventDefault();
                        e.stopPropagation();

                        // Si las notificaciones adicionales están ocultas, mostrarlas
                        if ($("#all-notifications-container").is(":hidden")) {
                            $("#all-notifications-container").slideDown();
                            $(this).text("Ocultar");
                        } else {
                            // Si están visibles, ocultarlas
                            $("#all-notifications-container").slideUp();
                            $(this).text("Ver todas (" + countActionPlan + ")");
                        }

                        return false;
                    });
                }
            } else {
                $("#notifications-dropdown").append(
                    '<li><a href="javascript:void(0);" class="grey-text text-darken-2">No hay planes de acción pendientes</a></li>'
                );
            }
        },
        error: function (response) {
            console.error("Error en notificationsActionPlan:", response);
        }
    });
}
/*================================================================================================================================================================================*/
function isNumber(e) {
    var charCode = (e.which) ? e.which : e.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
}
/*================================================================================================================================================================================*/
/**
 * Convertir string (obtenido del plugin pickatime) al formato de tiempo
 */
function convertStringToTime(pickatime) {
    var time = '';
    var minute;
    if(pickatime.minutes != null) {
        if(pickatime.minutes >= 10) {minute = pickatime.minutes; } else {minute = "0" + pickatime.minutes; }
        if(pickatime.amOrPm == 'AM') {
            var hour;
            if(pickatime.hours >= 10) {hour = pickatime.hours; } else {hour = "0" + pickatime.hours; }
            time = (hour == 12 ? "00" : hour) + ':' + minute + ":00";
        }
        else {
            time = (pickatime.hours == 12 ? pickatime.hours : (pickatime.hours + 12)) + ':' + minute + ":00";
        }
        return time;
    }
    return false;
}
/*================================================================================================================================================================================*/
function timeTo12HrFormat(time) { //21/8
    if (!time) return "";
    var time_part_array = time.split(":");
    var hour = parseInt(time_part_array[0], 10);
    var minute = time_part_array[1];
    var ampm = 'AM';
    if (hour >= 12) ampm = 'PM';
    if (hour > 12) hour = hour - 12;
    if (hour === 0) hour = 12;
    // Agrega un cero a la izquierda solo si la hora es menor a 10
    var hourStr = hour < 10 ? "0" + hour : hour.toString();
    return hourStr + ':' + minute + ' ' + ampm;
}
/*================================================================================================================================================================================*/
function isAssistant() {
    return window.IsAssistant === true ||
        window.IsAssistant === "true" ||
        window.IsAssistant === "True" ||
        window.IsAssistant === 1 ||
        window.IsAssistant === "1";
}
/*================================================================================================================================================================================*/
function getDaysArrayByMonthYear(month, year) {
    var daysArray    = [];
    var daysObject   = {}
    var quantityDays = new Date(year, month, 0).getDate();
    var daysInWeek   = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
    var daysIndex    = { 'Sun': 0, 'Mon': 1, 'Tue': 2, 'Wed': 3, 'Thu': 4, 'Fri': 5, 'Sat': 6 }
    var index        = daysIndex[(new Date(year, month - 1, 1)).toString().split(' ')[0]];
    for (var i = 0; i < quantityDays; i++) {
        daysObject = {'number_day' : (i + 1) , 'name_day' : daysInWeek[index++]};
        daysArray.push(daysObject);
        if (index == 7) index = 0;
    }
    return daysArray;
}
/*================================================================================================================================================================================*/
function resetFormMeeting() {
    $('#cbo-type-meeting').val(null);
    $('#txt-meeting-start-time').val('');
    $('#txt-meeting-end-time').val('');
    $('.text-meeting-description').val('');
    $('.txt-meeting-dev-title').val('');
    $('.txt-meeting-dev-description').val('');
    $('.txt-attach-file-title').val('');
}
/*================================================================================================================================================================================*/
function getAllActionPlanCategoryActive() {
    $.ajax({
        url: baseUrl + '/getAllActionPlanCategoryActive',
        type: 'GET',
        dataType: 'json',
        success: function (responseJson) {
            var $select = $("#txt-ap-category");
            // Si el select está dentro de un select-wrapper de Materialize, lo sacamos
            if ($select.parent().hasClass("select-wrapper")) {
                var $wrapper = $select.parent();
                $wrapper.after($select); // Mueve el select fuera del wrapper
                $wrapper.remove();       // Elimina el wrapper y la flecha
            }
            $select.empty();

            // Agrega el placeholder "Seleccione..." inhabilitado y seleccionado
            $select.append('<option value="" disabled selected>Seleccionar...</option>');

            // Llenar con las categorías activas
            if (responseJson.ActionPlanCategory) {
                $.each(responseJson.ActionPlanCategory, function (i, item) {
                    $select.append('<option value="' + item.ActionPlanCategoryId + '">' + item.ActionPlanCategoryName + '</option>');
                });
            }

            // Eliminar la clase y los elementos generados por Materialize
            if ($select.hasClass("initialized")) {
                try {
                    var instance = M.FormSelect.getInstance($select[0]);
                    if (instance) instance.destroy();
                } catch (e) { }
                $select.removeClass("initialized");
                $select.siblings("input.select-dropdown").remove();
                $select.siblings("ul.dropdown-content").remove();
            }
            $select.select2({ theme: "bootstrap", dropdownParent: $('#modal-confirmation') });
            setTimeout(function () {
                $('.select2-container--bootstrap .select2-selection--single').css({
                    'background': '#fff',
                    'border': '1px solid #ced4da',
                    'height': '36px',
                    'min-height': '36px',
                    'color': '#222',
                    'padding-left': '12px'
                });
            }, 0);
        },
        error: function (xhr, status, error) {
            console.error("Error al obtener categorías activas:", error);
        }
    });
} //@AMENDEZ5
/*================================================================================================================================================================================*/
function getAllTypeMeetingActive(areaId, withAll) { //21/8
    $.ajax({
        url: baseUrl + '/getAllTypeMeetingActive',
        type: 'GET',
        dataType: 'json',
        data: { areaId: areaId }, // <-- Envía el área seleccionada
        success: function (responseJson) {
            var $select = $("#cbo-type-meeting");
            // Si el select está dentro de un select-wrapper de Materialize, lo sacamos
            if ($select.parent().hasClass("select-wrapper")) {
                var $wrapper = $select.parent();
                $wrapper.after($select);
                $wrapper.remove();
            }
            $select.empty();

            // Agrega el placeholder "Seleccione..." inhabilitado y seleccionado
            $select.append('<option value="" disabled selected>Seleccionar...</option>');

            if (withAll) {
                $select.append('<option value="0">* Todos</option>');
            }
            if (responseJson.TypeMeeting && responseJson.TypeMeeting.length > 0) {
                $.each(responseJson.TypeMeeting, function (i, item) {
                    $select.append('<option value="' + item.TypeMeetingCode + '">' + item.TypeMeetingDescription + '</option>');
                });
            }

            // Eliminar la clase y los elementos generados por Materialize
            if ($select.hasClass("initialized")) {
                try {
                    var instance = M.FormSelect.getInstance($select[0]);
                    if (instance) instance.destroy();
                } catch (e) { }
                $select.removeClass("initialized");
                $select.siblings("input.select-dropdown").remove();
                $select.siblings("ul.dropdown-content").remove();
            }
            $select.select2({ theme: "bootstrap", minimumResultsForSearch: 0 });
            setTimeout(function () {
                $('.select2-container--bootstrap .select2-selection--single').css({
                    'background': '#fff',
                    'border': '1px solid #ced4da',
                    'padding-left': '12px'
                });
            }, 0);

        },
        error: function (xhr, status, error) {
            console.error("Error al obtener tipos de reunión:", error);
        }
    });
}
 //@AMENDEZ5
/*================================================================================================================================================================================*/
//16/8
function getAllLocationMeetingActive(areaId) {
    $.ajax({
        url: baseUrl + '/getAllLocationMeetingActive',
        type: 'GET',
        dataType: 'json',
        //16/8
        data: { areaId: areaId },
        success: function (response) {
            var $select = $("#txt-meeting-location");
            if ($select.parent().hasClass("select-wrapper")) {
                var $wrapper = $select.parent();
                $wrapper.after($select);
                $wrapper.remove();
            }
            $select.empty();

            $select.append('<option value="" disabled selected>Seleccionar...</option>');
            //16/8

            if (response && response.LocationMeeting && response.LocationMeeting.length > 0) {
                $.each(response.LocationMeeting, function (i, item) {
                    $select.append('<option value="' + item.LocationCode + '">' + item.LocationName + '</option>');
                });
            }
            //16/8

            if ($select.hasClass("initialized")) {
                try {
                    var instance = M.FormSelect.getInstance($select[0]);
                    if (instance) instance.destroy();
                } catch (e) { }
                $select.removeClass("initialized");
                $select.siblings("input.select-dropdown").remove();
                $select.siblings("ul.dropdown-content").remove();
            }
            $select.select2({ theme: "bootstrap" });
            setTimeout(function () {
                $('.select2-container--bootstrap .select2-selection--single').css({
                    'background': '#fff',
                    'border': '1px solid #ced4da',
                    'padding-left': '12px'
                });
            }, 0);
        },
        error: function (xhr, status, error) {
            console.error("Error al obtener lugares activos:", error);
        }
    });
} //@AMENDEZ5
/*================================================================================================================================================================================*/
function initAutocompleteMeetingCode(selector) {
    $(selector).autoComplete({
        minChars: 1,
        autoFocus: true,
        source: function (term, suggest) {
            term = term.toLowerCase();
            $.ajax({
                type: "POST",
                url: baseUrl + '/getMeetingCodesAutocomplete',
                data: { term: term },
                dataType: "json",
                timeout: (60 * 1000),
                success: function (response) {
                    var codes = [];
                    if (response.MeetingCodes && response.MeetingCodes.length > 0) {
                        $.each(response.MeetingCodes, function (i, item) {
                            codes.push(item);
                        });
                        suggest(codes);
                    }
                }
            });
        },
        renderItem: function (item, search) {
            search = search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
            var re = new RegExp("(" + search.split(' ').join('|') + ")", "gi");
            return '<div class="autocomplete-suggestion" data-text="' + item + '" data-val="' + search + '">' + item.replace(re, "<b>$1</b>") + '</div>';
        },
        onSelect: function (e, term, item) {
            $(selector).val(item.data('text'));
        }
    });
}//@AMENDEZ5
/*================================================================================================================================================================================*/
//16/8
function getAllTypeMeetingByArea(areaId, cellId) { //21/8
    $.ajax({
        url: baseUrl +'/getTypeMeetingByArea',
        type: 'GET',
        data: { areaId: areaId, cellId: cellId }, //21/8
        success: function (response) {
            var $select = $("#cbo-type-meeting");
            // Si el select está dentro de un select-wrapper de Materialize, lo sacamos
            if ($select.parent().hasClass("select-wrapper")) {
                var $wrapper = $select.parent();
                $wrapper.after($select);
                $wrapper.remove();
            }
            $select.empty();
            $select.append('<option value="" disabled selected>Seleccionar...</option>');
            if (response && response.TypeMeeting && response.TypeMeeting.length > 0) {
                $.each(response.TypeMeeting, function (i, item) {
                    $select.append('<option value="' + item.TypeMeetingCode + '">' + item.TypeMeetingDescription + '</option>');
                });
            }
            // Eliminar la clase y los elementos generados por Materialize
            if ($select.hasClass("initialized")) {
                try {
                    var instance = M.FormSelect.getInstance($select[0]);
                    if (instance) instance.destroy();
                } catch (e) { }
                $select.removeClass("initialized");
                $select.siblings("input.select-dropdown").remove();
                $select.siblings("ul.dropdown-content").remove();
            }
            $select.select2({ theme: "bootstrap", minimumResultsForSearch: 0 });
            setTimeout(function () {
                $('.select2-container--bootstrap .select2-selection--single').css({
                    'background': '#fff',
                    'border': '1px solid #ced4da',
                    'height': '36px',
                    'min-height': '36px',
                    'color': '#222',
                    'padding-left': '12px'
                });
            }, 0);
        },
        error: function (xhr, status, error) {
            console.error("Error al obtener tipos de reunión:", error);
        }
    });
}
