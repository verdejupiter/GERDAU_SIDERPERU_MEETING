/*================================================================================================================================================================================*/
/**
 * @fileOverview    Script Registro de acta de reunión
 * @author          ANGELY YAHAYRA MENDEZ CRUZ
 * @version         1.1.1
 * @updatedAt       11/09/2025
*/
/*================================================================================================================================================================================*/
// Variables globales
var datatableAssistance;
var datatableActionPlan;
var nroPauta = 0;
var nroDev   = 0;
var startPickatime;
var endPickatime;
/*================================================================================================================================================================================*/
/**
 * Inicializa jquery eventos y funciones
 */
$(document).ready(function() {

    resetFormMeeting();

    // Verificar si la sesión ha expirado
    checkSessionExpired();

    initFormSelect2(); //@AMENDEZ5 se movió

    validateFormMeeting();

    //Inicializar titulos de botones con el plugin tooltip
    initTooltipButtom();

    datatableActionPlan = initDatatableActionPlan();

    // Agregar pauta=agenda
    $("#btn-add-pauta").on("click", function() {
        addInputPautaAutoGrow("i-delete-pauta", "text-meeting-pauta","text-meeting-pauta-"+nroPauta, "Agenda", $("#div-meeting-pauta"));
        //$("input[name=text-meeting-pauta-"+nroPauta+"]").rules( "add",{required:   true, messages: {required: "Agenda es obligatorio"} } );
        nroPauta++
    });

    // Agregar descripción=Acuerdos
    $("#btn-add-description").on("click", function() {
        addInputTextAreaAutoGrow("i-delete-description", "text-meeting-description", "text-meeting-description-" + nroDev, "Acuerdos", $("#div-meeting-development"));
        //$("input[name=text-meeting-description-" + nroDev + "]").rules("add", { required: true, messages: { required: "Comentarios es obligatorio"} } );
        nroDev++;
    });

    //21/8
    $('textarea.text-meeting-pauta, textarea.text-meeting-description').on('input', function () {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });

    // Eliminar input text (pauta, descripción de desarrollo)
    $(document).on("click",".i-delete-pauta", removeInputPauta);
    $(document).on("click",".i-delete-description", removeInput);

    // Agregar acción
    $("#btn-add-action").on("click", showModalAddActionPlan);

    // Eliminar acción
    $(document).on("click", ".i-delete-action", deleteAction);

    $("#btn-add-guest").on("click", showModalAddGuest);

    // Eliminar usuario(s) asistente(s) en la tabla
    $("#btn-delete-assistance").on("click", function () {
        var selectedRows = $('.row-select-assistance:checked');

        if (selectedRows.length === 0) {
            // Mostrar mensaje si no hay filas seleccionadas
            $('.div-modal').load('Home/Modal', {
                ModalId: "modal-warning",
                ModalClass: "modal-message modal-warning2",
                ModalHeader: '<span><i class="material-icons">warning</i><label>ADVERTENCIA</label></span>',
                ModalTitle: "",
                ModalBody: "Por favor, seleccione al menos un participante para eliminar.",
                ModalButtonOk: ''
            }, function () {
                $(".modal-close").text("Cerrar");
                $('#modal-warning').modal({ dismissible: false }).modal('open');
            });
            return;
        }

        // Confirmar eliminación
        $('.div-modal').load('Home/Modal', {
            ModalId: "modal-delete-confirm",
            ModalClass: "modal-message modal-info2",
            ModalHeader: '<span><i class="blue-dark-text material-icons">help_outline</i><label>CONFIRMACIÓN</label></span>',
            ModalTitle: "",
            ModalBody: "¿Está seguro de eliminar los participantes seleccionados?",
            ModalButtonOk: '<button type="button" id="btn-modal-aceppt" class="modal-action waves-effect btn-flat blue white-text">Aceptar</button>'
        }, function () {
            $('#modal-delete-confirm').modal({ dismissible: false }).modal('open')
                .on('click', '#btn-modal-aceppt', function () {
                    // Eliminar cada fila seleccionada
                    selectedRows.each(function () {
                        datatableAssistance.row($(this).closest('tr')).remove();
                    });

                    // Redibujar la tabla
                    datatableAssistance.draw(false);

                    // Desmarcar checkbox "seleccionar todos"
                    $('#select-all-assistance').prop('checked', false);

                    $('#modal-delete-confirm').modal('close');
                });
        });
    }); //@AMENDEZ5

    $(document).on("click","#chck-type-user", showAddFormGuest);

    $(document).on('keyup', '#txt-ap-what, #txt-user-assistance, #txt-desc-user-assistance, #txt-meeting-subject, #txt-ap-responsible',
        function () {
            const cursorPosition = this.selectionStart;

            // Convertir a mayúsculas
            const upperValue = $(this).val().toUpperCase();

            if ($(this).val() !== upperValue) {
                $(this).val(upperValue);

                this.setSelectionRange(cursorPosition, cursorPosition);
            }
        }
    );

    var pickadate = initPickadate($("#txt-meeting-date"), ".div-info-meeting");
    pickadate.set('select', getCurrentDatetime(1), { format: 'dd/mm/yyyy' });

    //21/8
    $(document).on('click', '.icon-calendar', function () {
        $("#txt-meeting-date").focus();
    });

    startPickatime = initPickatime($("#txt-meeting-start-time"), "0");
    endPickatime = initPickatime($("#txt-meeting-end-time"), "0");

    //21/8
    $(document).on('click', '.icon-clock', function () {
        $(this).siblings('input[type="text"]').focus();
    });

    $("#txt-meeting-end-time, #txt-meeting-start-time").on("change", validateStartEndTime);

    datatableAssistance = getUserByTypeMeeting(0);

    $("#btn-insert-meeting").on("click", function (e) {
        e.preventDefault();

        try {
            $("#form-meeting").find(".text-meeting-pauta, .text-meeting-description").each(function () {
                var fieldName = $(this).attr("name");
                if (fieldName) {
                    try {
                        $(this).rules("remove", "required");
                    } catch (e) {
                    }
                }
            });

            try {
                $("#file-meeting-attached-list").rules("remove", "accept");
            } catch (e) {
            }
        } catch (e) {
        }

        // Validaciones personalizadas
        if ($("#txt-meeting-start-time").val() !== "" && $("#txt-meeting-end-time").val() !== "") {
            validateStartEndTime();
        }

        // Validar tipo de reunión
        if ($("#cbo-type-meeting").val() === "" || $("#cbo-type-meeting").val() === null) {
            $("#cbo-type-meeting-error").show().html('<div class="error2">Tipo de reunión es obligatorio</div>');
        } else {
            $("#cbo-type-meeting-error").empty();
        }

        // Validar lugar
        if ($("#txt-meeting-location").val() === "" || $("#txt-meeting-location").val() === null) {
            $("#txt-meeting-location-error").show().html('<div class="error2">Lugar es obligatorio</div>');
        } else {
            $("#txt-meeting-location-error").empty();
        }

        var fileUploadErrors = checkForFileErrors();
        if (fileUploadErrors) {
            return; // Detener la validación si hay errores en archivos
        }

        var validator = $("#form-meeting").validate();
        if (validator) {
            validator.settings.ignore = "#file-meeting-attached-list";
        }

        //21/8
        $("#form-meeting").find("input, select, textarea").each(function () {
            $(this).valid();
        });

        var formIsValid = $("#form-meeting").valid();

        // Condición modificada para considerar agenda y comentarios como opcionales
        if (formIsValid) {
			try {
				showModalInsertMeeting();
			} catch (error) {
				alert("Error: " + error.message);
			}
        } else {
            scrollToFirstError();
        }
    });

    $(document).on("click",".a-edit-action-plan", showModalEditActionPlan);
    $(document).on("click",".a-delete-action-plan", showModalDeleteActionPlan);
    $(document).on("click",".switch-option-check", checkJustificationAssistance);

    // Agregar este listener para el botón de anexos
    $("#btn-add-attached").on("click", function () {
        showAttachFileSelector();
        setTimeout(function () {
            if ($("#file-meeting-attached-list").length > 0) {
                try {
                    $("#file-meeting-attached-list").rules("remove", "accept");
                } catch (e) {
                    console.error("No se pudo eliminar la regla 'accept':", e.message);
                }
            }
        }, 100);
    });

    // Agregar este listener para cuando se seleccionan archivos
    $(document).on("change", "#file-meeting-attached-list", handleFileSelection);

    // Agregar este listener para eliminar archivos
    $(document).on("click", ".remove-attach-file", removeAttachFile);

    $(document).on("click", ".check-justification", function() {
        var index = $(this).attr("data-index");
        $("#div-reason-justification-"+index).html($(this).is(":checked") ? '<textarea id="txt-reason-justification-'+index+'" class="txt-reason-justification" data-index="'+index+'" maxlength="500"></textarea>' : '');
        setTimeout(() => { $("#txt-reason-justification-"+index).focus(); }, 500);
    });
    $(document).on("keyup",".txt-reason-justification", function() {
        if($(this).val() != "") {
            $(".rj-error-" + $(this).attr("data-index")).remove();
        }
    });

    // Al dar clic en la tardanza check de asistencia
    $(document).on("click", ".check-delay", function () {
    }); //@AMENDEZ5

    //Código de reunión generado
    getNewMeetingCode(); //@AMENDEZ5

    //Eliminar asistentes
    $("#cbo-type-meeting").on("change", function () {
        var typeMeetingCode = $(this).val();
        if (typeMeetingCode && typeMeetingCode !== "") {
            if ($.fn.DataTable.isDataTable("#datatable-user-assistance")) {
                $("#datatable-user-assistance").DataTable().destroy();
            }
            datatableAssistance = getUserByTypeMeeting(typeMeetingCode, function () {
                var count = datatableAssistance.data().count();
                if (count > 0) {
                    $("#btn-delete-assistance").fadeIn("slow");
                    $("#cbo-type-meeting-error").empty();
                }
                else {
                    $("#btn-delete-assistance").fadeOut("slow");
                    $("#cbo-type-meeting-error").empty();
                }
            });
            $("#datatable-user-assistance_wrapper").show();
        } else {
            $("#datatable-user-assistance_wrapper").hide();
            $("#btn-delete-assistance").fadeOut("slow");
        }
    }); //@AMENDEZ5

    //Desglosable de opcionales
    /*$('#btn-toggle-opcionales').on('click', function () {
        var $content = $('#opcionales-content');
        var $icon = $('#icon-toggle-opcionales');
        $content.slideToggle(200, function () {
            $icon.text($content.is(':visible') ? 'expand_less' : 'expand_more');
        });
    });*/ //@AMENDEZ5

    // Desglosable de opcionales
    $('#opcionales-header').on('click', function (e) {
        if ($(e.target).closest('#btn-toggle-opcionales').length > 0 || e.target.id === 'btn-toggle-opcionales') {
            return;
        }
        toggleOpcionalesContent();
    });

    $('#btn-toggle-opcionales').on('click', function (e) {
        e.stopPropagation();
        toggleOpcionalesContent();
    });

    // Estilos para filas seleccionadas
    $("<style>")
        .prop("type", "text/css")
        .html(`
            /* Un único estilo para todas las filas seleccionadas */
            tr.selected-row {
                background-color: #90caf9 !important; /* Color azul más intenso para todas las filas */
                transition: background-color 0.2s ease;
            }

            /* Asegurar que los textos dentro de la fila seleccionada sean legibles */
            tr.selected-row td {
                color: black !important;
            }

            /* Efecto hover para filas seleccionadas */
            tr.selected-row:hover {
                background-color: #1976d2 !important; /* Un poco más oscuro al pasar el mouse */
            }`)
        .appendTo("head"); //@AMENDEZ5



    if (!$("#attachment-grid-styles").length) {
        $("<style id='attachment-grid-styles'>")
            .prop("type", "text/css")
            .html(`
                #div-meeting-attached {
                    min-height: 50px;
                    padding: 10px;
                    border: 1px dashed #ccc;
                    border-radius: 5px;
                }

                #div-meeting-attached:empty {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

                #div-meeting-attached:empty:before {
                    content: "No hay anexos seleccionados";
                    color: #999;
                    font-style: italic;
                }

                .attach-file-item {
                    margin-bottom: 15px;
                    transition: transform 0.2s;
                }

                .attach-file-item:hover {
                    transform: translateY(-5px);
                }

                .remove-attach-file {
                    opacity: 0.7;
                    transition: opacity 0.2s, transform 0.2s;
                }

                .remove-attach-file:hover {
                    opacity: 1;
                    transform: scale(1.1);
                }
            `)
            .appendTo("head");
    }
});
/*================================================================================================================================================================================*/
function addInputPautaAutoGrow(iconClass, inputClass, name, label, $divSelector) {
    var isAssistantUser = isAssistant();
    var deleteIconHtml = !isAssistantUser ?
        '<i class="material-icons prefix i-delete ' + iconClass + '" ' +
        'style="color:#e53935;cursor:pointer;margin-right:8px;font-size:24px;" ' +
        'title="Eliminar">delete_forever</i>' : '';

    var disabledAttr = isAssistantUser ? 'disabled' : '';

    var newDiv = $(`
        <div style="display: flex; align-items: center; width: 100%; margin-bottom: 10px; padding-top: 30px;">
            ${deleteIconHtml}
            <div style="flex:1;">
                <div class="input-field-with-icon" style="margin:0;">
                    <textarea name="${name}" class="${inputClass}" autocomplete="off" placeholder="Escribir ${label}" style="width:100%;resize:none;overflow:hidden;" rows="1" ${disabledAttr}></textarea>
                    <label style="left:0;">${label}</label>
                </div>
            </div>
        </div>
    `).hide();

    $divSelector.append(newDiv);
    newDiv.show("slow");

    newDiv.find('textarea.text-meeting-pauta, textarea[class^="text-meeting-pauta"]').on('input', function () {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });

    if (!isAssistantUser) {
        $("." + iconClass).tooltip({ delay: 50, tooltip: "Eliminar", position: "left" });
    }
}
/*================================================================================================================================================================================*/
function addInputTextAreaAutoGrow(iconClass, inputClass, name, label, $divSelector) {
    var isAssistantUser = isAssistant();
    var deleteIconHtml = !isAssistantUser ?
        '<i class="material-icons prefix i-delete ' + iconClass + '" ' +
        'style="color:#e53935;cursor:pointer;margin-right:8px;font-size:24px;align-self:center;" ' +
        'title="Eliminar">delete_forever</i>' : '';

    var disabledAttr = isAssistantUser ? 'disabled' : '';

    var newDiv = $(`
        <div style="display: flex; align-items: center; width: 100%; margin-bottom: 10px; padding-top: 30px;">
            ${deleteIconHtml}
            <div style="flex:1;">
                <div class="input-field-with-icon" style="margin:0;">
                    <textarea name="${name}" class="${inputClass}" autocomplete="off" placeholder="Escribir ${label}" style="width:100%;resize:none;overflow:hidden;" rows="1" ${disabledAttr}></textarea>
                    <label style="left:0;">${label}</label>
                </div>
            </div>
        </div>
    `).hide();

    $divSelector.append(newDiv);
    newDiv.show("slow");

    newDiv.find('textarea.text-meeting-description, textarea[class^="text-meeting-description"]').on('input', function () {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });

    if (!isAssistantUser) {
        $("." + iconClass).tooltip({ delay: 50, tooltip: "Eliminar", position: "left" });
    }
}
/*================================================================================================================================================================================*/
function toggleOpcionalesContent() {
    var $content = $('#opcionales-content');
    var $icon = $('#icon-toggle-opcionales');
    $content.slideToggle(200, function () {
        $icon.text($content.is(':visible') ? 'expand_less' : 'expand_more');
    });
}
/*================================================================================================================================================================================*/
function checkJustificationAssistance() {
    var $switch = $(this);
    var dataIndex = $switch.attr("data-index");
    var isChecked = $switch.is(":checked");

    $("#div-delay-" + dataIndex).empty();
    $("#div-justification-" + dataIndex).empty();

    if (isChecked) {
        $("#div-delay-" + dataIndex).html('<input type="checkbox" data-index="' + dataIndex + '" class="check-delay filled-in" id="check-delay-' + dataIndex +
            '"/><label for="check-delay-' + dataIndex + '">Tardanza</label>');
    } else {
        $("#div-justification-" + dataIndex).html('<input type="checkbox" data-index="' + dataIndex + '" class="check-justification filled-in" id="check-justification-' + dataIndex +
            '"/><label for="check-justification-' + dataIndex + '">Justificado</label>' +
            '<div id="div-reason-justification-' + dataIndex + '"></div>');
    }
} //@AMENDEZ5
/*================================================================================================================================================================================*/
function scrollToFirstError() {
    var firstError = $(".error2:visible").first();
    if (firstError.length > 0) {
        $('html, body').animate({
            scrollTop: firstError.offset().top - 100
        }, 500);
    }
}
function checkForFileErrors() {
    // Verificar si hay errores en los archivos seleccionados
    var hasErrors = false;
    var fileCount = Object.keys(selectedFiles).length;

    if (fileCount === 0) {
        // Si no hay archivos, no hay errores
        return false;
    }

    Object.keys(selectedFiles).forEach(function (fileId) {
        var file = selectedFiles[fileId];

        //21/8
        // Revalidar tamaño
        if (file.size > 15000 * 1024) {
            var mensaje = 'El archivo "' + file.name + '" excede el tamaño máximo permitido de 15 MB.';
            $('.div-modal').load('Home/Modal', {
                ModalId: "modal-warning",
                ModalClass: "modal-message modal-warning2",
                ModalHeader: '<span><i class="material-icons">warning</i><label>ADVERTENCIA</label></span>',
                ModalTitle: "",
                ModalBody: mensaje,
                ModalButtonOk: ''
            }, function () {
                $(".modal-close").text("Cerrar");
                $('#modal-warning').modal({ dismissible: false }).modal('open');
            });
            hasErrors = true;
            return;
        }

        // Verificar por extensión
        var extension = file.name.split('.').pop().toLowerCase();
        var extensionesPermitidas = ['png', 'jpg', 'jpeg', 'xlsx', 'xls', 'docx', 'pptx', 'pdf', 'rar', 'zip', '7z', 'dwg'];

        if (extensionesPermitidas.indexOf(extension) === -1) {
            var mensaje = 'El archivo "' + file.name + '" tiene un formato no permitido. Solo se aceptan los siguientes formatos: ' + extensionesPermitidas.join(', ');
            $('.div-modal').load('Home/Modal', {
                ModalId: "modal-warning",
                ModalClass: "modal-message modal-warning2",
                ModalHeader: '<span><i class="material-icons">warning</i><label>ADVERTENCIA</label></span>',
                ModalTitle: "",
                ModalBody: mensaje,
                ModalButtonOk: ''
            }, function () {
                $(".modal-close").text("Cerrar");
                $('#modal-warning').modal({ dismissible: false }).modal('open');
            });
            hasErrors = true;
            return;
        }
        //21/8

    });

    return hasErrors;
}
function showAttachFileSelector() {
    // Si el input ya existe, solo activarlo
    if ($("#file-meeting-attached-list").length > 0) {
        // Eliminar cualquier regla de validación antes de usar el input
        try {
            $("#file-meeting-attached-list").rules("remove", "accept");
        } catch (e) { }

        $("#file-meeting-attached-list").val("").trigger("click");
    } else {
        // Crear el input si no existe
        var $fileInput = $('<input id="file-meeting-attached-list" type="file" multiple accept=".png,.jpg,.jpeg,.xlsx,.xls,.docx,.pptx,.pdf,.rar,.zip,.7z,.dwg" style="display:none;">');
        $("body").append($fileInput);

        // Eliminar reglas de validación que puedan haberse aplicado automáticamente
        setTimeout(function () {
            try {
                $fileInput.rules("remove", "accept");
            } catch (e) { }
        }, 50);

        $fileInput.trigger("click");

        // Agregar el listener si es la primera vez
        $fileInput.on("change", handleFileSelection);
    }
}
function handleFileSelection() {
    var files = this.files;

    if (files && files.length > 0) {
        for (var i = 0; i < files.length; i++) {
            var file = files[i];

            // Validar tamaño (máximo 15MB)
            if (file.size > 15000 * 1024) {
                showErrorModal('El archivo "' + file.name + '" (' + Math.round(file.size / 1024) + ' KB) excede el tamaño máximo permitido de 15 MB.');
                continue;
            }

            // Validar extensión
            var extension = file.name.split('.').pop().toLowerCase();
            var extensionesPermitidas = ['png', 'jpg', 'jpeg', 'xlsx', 'xls', 'docx', 'pptx', 'pdf', 'rar', 'zip', '7z', 'dwg'];
            if (extensionesPermitidas.indexOf(extension) === -1) {
                showErrorModal('El archivo "' + file.name + '" tiene un formato no permitido. Solo se aceptan los siguientes formatos: ' + extensionesPermitidas.join(', '));
                continue;
            }

            // Generar un ID único para este archivo
            var fileId = 'file-' + Date.now() + '-' + Math.floor(Math.random() * 1000);

            // Obtener el icono adecuado según la extensión
            var icon = getIconfile('.' + extension);
            var size = (extension === "pdf") ? "width:40px;height:50px;" : "width:50px;height:50px;";

            // Crear el elemento visual para este archivo
            var divFile = '<div class="col s3 row attach-file-item" id="' + fileId + '" data-filename="' + file.name + '">' +
                '<div style="padding:5px;border:1px #4285f4 solid;border-radius:15px;height:150px;display:flex;flex-direction:column;align-items:center;justify-content:space-between;">' +
                '<div style="width:100%;text-align:right;">' +
                '<span class="new-file-badge blue white-text" style="padding:2px 8px;border-radius:10px;font-size:10px;">Nuevo</span>' +
                '<a href="javascript:void(0);" class="remove-attach-file" data-fileid="' + fileId + '" style="padding-left:5px;">' +
                '<i class="material-icons red-text" style="font-size:24px;">delete_forever</i></a>' +
                '</div>' +
                '<div class="text-center-vh" style="flex:1;display:flex;align-items:center;justify-content:center;width:100%;">' +
                '<img class="responsive-img" style="' + size + 'max-height:90px;" src="' + icon + '" title="' + file.name + '">' +
                '</div>' +
                '<div class="text-center-vh" style="font-size:12px;font-weight:bold;color:#333;margin-top:5px;width:100%;word-break:break-all;white-space:normal;text-align:center;max-width:100%;overflow-wrap:break-word;">' +
                file.name +
                '</div>' +
                '</div>' +
                '</div>';

            // Agregar a la vista
            $("#div-meeting-attached").append(divFile);

            // Almacenar el archivo en un objeto para usarlo al guardar
            storeFileForUpload(fileId, file);
        }
    }
}
function removeAttachFile() {
    var fileId = $(this).attr("data-fileid");
    $("#" + fileId).remove();
    removeStoredFile(fileId);
}

var selectedFiles = {};

function storeFileForUpload(fileId, file) {
    selectedFiles[fileId] = file;
}

function removeStoredFile(fileId) {
    if (selectedFiles[fileId]) {
        delete selectedFiles[fileId];
    }
}

function showErrorModal(message) {
    $('.div-modal').load('Home/Modal', {
        ModalId: "modal-error",
        ModalClass: "modal-message modal-error2",
        ModalHeader: '<span><i class="material-icons">error</i><label>ERROR</label></span>',
        ModalTitle: "",
        ModalBody: message,
        ModalButtonOk: ''
    }, function () {
        $(".modal-close").text("Cerrar");
        $('#modal-error').modal({ dismissible: false }).modal('open');
    });
}

/*================================================================================================================================================================================*/
function getNewMeetingCode() {
    $.ajax({
        url: baseUrl + '/GetNewMeetingCode',
        type: 'GET',
        success: function (data) {
            $('#txt-meeting-code').val(data);
        },
        error: function () {
            $('#txt-meeting-code').val("REU-000001");
        }
    });
} //@AMENDEZ5
/*================================================================================================================================================================================*/
function validateStartEndTime() {
    var startTime12h = startPickatime.data().clockpicker;
    var endTime12h = endPickatime.data().clockpicker;
    var startTime24h = convertStringToTime(startTime12h);
    var endTime24h = convertStringToTime(endTime12h);

    if ($("#txt-meeting-end-time").val() != "") {
        $("#txt-meeting-end-time-error").empty();

        // Verificar si la hora final es menor o igual a la hora inicial
        if (endTime24h <= startTime24h) {

            // Mensaje personalizado según el caso
            if (endTime24h < startTime24h) {
                $("#txt-meeting-end-time-error").text("La hora final tiene que ser mayor a la hora inicial");
            } else {
                $("#txt-meeting-end-time-error").text("La hora final no puede ser igual a la hora inicial");
            }

            // Marcar el campo como inválido para el validador sin borrar el valor
            if ($("#form-meeting").data("validator")) {
                var validator = $("#form-meeting").validate();
                validator.showErrors({
                    "txt-meeting-end-time": endTime24h < startTime24h ?
                        "La hora final tiene que ser mayor a la hora inicial" :
                        "La hora final no puede ser igual a la hora inicial"
                });
                // Marcar el campo como inválido manualmente
                $("#txt-meeting-end-time").addClass("error");
            }
        }
    }
} //@AMENDEZ5
/*================================================================================================================================================================================*/
function getAllUserAssistance() {
    var users = [];
    $('.switch-option-check').each(function (index, value) {
        var user                      = {};
        user.UserId                   = $(this).attr("data-userid");
        user.UserAssistanceStatus     = $(this).is(":checked");
        user.UserAssistanceGuestEmail = $(this).attr("data-email");
        users.push(user);
    });
    return users;
}
/*================================================================================================================================================================================*/
function initFormSelect2() {

    InitSelect2("#txt-meeting-location", 'Seleccionar...', null);

    getAllArea(false, function () {
        const areaId = localStorage.getItem('AreaId');
        const cellId = localStorage.getItem('CellId');
        if (areaId) {
            $("#cbo-area").val(areaId).trigger("change");
            $("#txt-meeting-location").val(areaId).trigger("change");

            getCellByAreaId(areaId, function () {
                limpiarComboCell(cellId);

                setTimeout(function () {
                    var selectedCellId = $("#cbo-cell").val();
                    getAllTypeMeetingByArea(areaId, selectedCellId);
                }, 200); // 100ms suele ser suficiente, ajusta si es necesario
            });
        }
    });


    // Cuando cambia el área
    $("#cbo-area").on("change", function () {
        var areaId = $(this).val();
        if (areaId) {
            getCellByAreaId(areaId, function () {
                limpiarComboCell();
                // Al terminar de cargar las células, obtener el valor actual
                var cellId = $("#cbo-cell").val();
                getAllTypeMeetingByArea(areaId, cellId);
            });
            getAllLocationMeetingActive(areaId);
        } else {
            $("#cbo-type-meeting").empty().append('<option value="" selected>Seleccionar...</option>').val("").trigger("change");
            $("#txt-meeting-location").empty().append('<option value="" selected>Seleccionar...</option>').val("").trigger("change");
            $("#cbo-cell").empty().append('<option value="" selected>Seleccionar...</option>').val("").trigger("change");
        }
    });

    // Cuando cambia la célula
    $("#cbo-cell").on("change", function () {
        var areaId = $("#cbo-area").val();
        var cellId = $(this).val();
        if (areaId) {
            getAllTypeMeetingByArea(areaId, cellId);
        }
    });

    // Función para limpiar el combo de células
    function limpiarComboCell(cellId) {
        var $cell = $("#cbo-cell");
        // Eliminar opciones "Todas" o "* Todas"
        $cell.find("option").each(function () {
            var text = $(this).text().trim().toUpperCase();
            if (text === "TODAS" || text === "*TODAS" || $(this).val() === "0") {
                $(this).remove();
            }
        });
        // Eliminar la opción "Seleccionar..." previa (por si acaso)
        $cell.find("option[value='']").remove();
        // Agregar la opción "Seleccionar..." habilitada y seleccionada
        $cell.prepend('<option value="" selected>Seleccionar...</option>');
        // Asegurar que el select esté habilitado
        $cell.prop("disabled", false);

        // Refrescar Select2 para que tome la nueva opción
        $cell.trigger('change.select2');

        // Seleccionar el valor guardado si existe
        if (cellId) {
            $cell.val(cellId).trigger("change");
        } else {
            $cell.val("").trigger("change");
        }
    }

}
/*================================================================================================================================================================================*/
function getUserByTypeMeeting(typeMeetingCode, functionComplete) {
    return $("#datatable-user-assistance").DataTable({
        "bDestroy" : true,
        "responsive": true,
        "bAutoWidth": false,
        "bFilter": false,
        "paging":   false,
        "ordering": false,
        "info":     false,
        "bLengthChange" : false,
        "language": {"url": "Content/library/datatable/language/Spanish.json"},
        "ajax":{
            dataSrc: function (json) {
                json = JSON.parse(json);
                return json.TypeMeetingDetail;
            },
            "data": function(d) {
                d.TypeMeetingCode = typeMeetingCode;
            },
            "complete": functionComplete,
            "type"   : "POST",
            "url"    : 'getTypeMeetingDetailByCode',
            "async"  : false,
        },
        "aoColumns": [
                { "data": null,
                    "title": '<input type="checkbox" id="select-all-assistance" class="checkbox-native"/>',
                    "orderable": false,
                    "sClass": "text-center-vh checkbox-narrow-column",
                    "sWidth": "2%",
                    "render": function (data, type, full, meta) {
                        var id = 'row-select-assistance-' + meta.row;
                        return '<input type="checkbox" class="row-select-assistance checkbox-native" id="' + id + '" data-row="' + meta.row + '"/>';
                    }
                }, //@AMENDEZ5
                { "data": "UserName", "title": "Colaborador", "sClass": "text-center-vh", "sWidth": "8%" },
                /*{
                    "data": null, "title": "Descripción", "sClass": "text-center-vh", "sWidth": "50%",
                    "mRender": function (data, type, full) {
                        if (data['UserAssistanceGuestDesc'] != null) {
                            return '<div class="row">'
                                + '<div class="desc-detail col s12 center">' + data['UserAssistanceGuestDesc'] + '</div>'
                                + '</div>';
                        }
                        else if (data['AreaName'] == "--") {
                            return '<div class="row">'
                                + '<div class="desc-detail col s12 center">' + data['EnterpriseName'] + '</div>'
                                + '</div>';
                        }

                        return '<div class="row">'
                            + '<div class="title-detail col s12 m3 l3">Área: </div><div class="desc-detail col s12 m9 l9">' + data['AreaName'] + '</div>'
                            + '</div>'
                            + '<div class="row" style="padding-top:5px;">'
                            + '<div class="title-detail col s12 m3 l3">Célula: </div><div class="desc-detail col s12 m9 l9">' + data['CellName'] + '</div>'
                            + '</div>';
                    }
                },*/ //ANTES
                { "data": null, "title": "Asistencia", "sClass": "text-center-vh", "sWidth": "90%",
                    "mRender": function (data, type, full, meta) {
                        var email = data['UserAssistanceGuestEmail'] == null ? 0 : data['UserAssistanceGuestEmail'];
                        return '<div class="row" style="margin-bottom: 0;">'
                            + '<div class="col s4">'
                            + '<div class="switch-preview">'
                            + '<label class="switch black-text"> '
                            + '<input type="checkbox" class="switch-option-check" data-userid="' + data['UserId'] + '" '
                            + ' data-email="' + email + '" data-index="' + meta.row + '" checked>'
                            + '<span class="slider round"></span>'
                            + '</label>'
                            + '</div>'
                            + '</div>'
                            + '<div class="col s8" style="padding-top:5px; padding-left:9px;">'
                            + '<div id="div-justification-' + meta.row + '" class="hidden-option justification-option"></div>'
                            + '<div id="div-delay-' + meta.row + '" class="hidden-option delay-option"></div>'
                            + '</div>'
                            + '</div>';
                    }
                    },//@AMENDEZ5
                    /*{
                        "data": null, "title": "Asistencia", "sClass": "text-center-vh", "sWidth": "40%",
                        "mRender": function (data, type, full, meta) {
                            var email = data['UserAssistanceGuestEmail'] == null ? 0 : data['UserAssistanceGuestEmail'];
                            return '<div class="switch-preview">'
                                + '<label class="switch"> '
                                + '<input type="checkbox" class="switch-option-check" data-userid="' + data['UserId'] + '" '
                                + ' data-email="' + email + '" data-index="' + meta.row + '">'
                                + '<span class="slider round"></span>'
                                + '</label>'
                                + '</div>'

                                + '<div id="div-justification-' + meta.row + '"><input type="checkbox" data-index="' + meta.row + '" class="check-justification filled-in" id="check-justification-' + meta.row + '"/><label for="check-justification-' + meta.row + '">Justificado</label></div>'
                                + '<div id="div-reason-justification-' + meta.row + '"></div>';
                        }
                    },*/
                    ],
        select: {
            style:    'os',
            selector: 'td'
        },
        "fnRowCallback": function( nRow ) { //Estilos contenidos de cada fila en columna
            $('td:eq(0)', nRow).removeClass("text-hv-center").addClass( "text-left black-text").css("font-size","11px");
            $('td:eq(1)', nRow).removeClass("text-hv-center").addClass( "text-left black-text").css("font-size","11px");
        },
        "drawCallback": function () {
            $('.switch-option-check').each(function () {
                checkJustificationAssistance.call(this);
            });//@AMENDEZ5

            $('.row-select-assistance').off('change').on('change', function () {
                var $row = $(this).closest('tr');
                if ($(this).is(':checked')) {
                    $row.addClass('selected');
                    $row.addClass('selected-row');
                    $row.find('td').css('color', 'white');
                } else {
                    $row.removeClass('selected');
                    $row.removeClass('selected-row');
                    $row.find('td').css('color', '');
                }
            });//@AMENDEZ5

            $('.row-select-assistance').each(function () {
                if ($(this).is(':checked')) {
                    $(this).closest('tr').addClass('selected selected-row');
                    $(this).closest('tr').find('td').css('color', 'white');
                }
            }); //@AMENDEZ5

            $('#select-all-assistance').off('change').on('change', function () {
                var checked = $(this).is(':checked');
                $('.row-select-assistance').prop('checked', checked).trigger('change');
            });//@AMENDEZ5
        }
    });
}
/*================================================================================================================================================================================*/
/**
 * Inicializar titulos de botones con el plugin tooltip
 */
function initTooltipButtom() {
    /*$("#btn-add-pauta").tooltip({delay: 50, tooltip: "Agregar agenda", position: "left"});
    $("#btn-add-description").tooltip({delay: 50, tooltip: "Agregar descripción", position: "left"});
    $("#btn-add-description-image").tooltip({delay: 50, tooltip: "Agregar imagen", position: "left"});*/ //ANTES
    $("#btn-add-guest").tooltip({delay: 50, tooltip: "Agregar Asistentes", position: "left"}); //@AMENDEZ5
    $("#btn-add-action").tooltip({delay: 50, tooltip: "Agregar Acción", position: "left"});
    $("#btn-insert-meeting").tooltip({ delay: 50, tooltip: "Guardar Reunión", position: "left" });
    $("#btn-add-attached").tooltip({ delay: 50, tooltip: "Agregar Anexos", position: "left" });
    $("#btn-add-description").tooltip({ delay: 50, tooltip: "Agregar Acuerdos", position: "left" });
    $("#btn-add-pauta").tooltip({ delay: 50, tooltip: "Agregar Agenda", position: "left" });

    //$("#fab-show-meeting-register").tooltip({delay: 50, tooltip: "Nuevo", position: "top"}); //ANTES
    //$(".i-delete").tooltip({delay: 50, tooltip: "Eliminar", position: "left"}); //ANTES
}
/*================================================================================================================================================================================*/
function showModalAddGuest() {
    var count = datatableAssistance.data().count();
    if(count > 0) {
        var body = '<div class="col s12">'
        +'<div class="col s12" style="padding-bottom:20px;padding-left:7px;">'
        +'<div class="switch material">'
        +'<label>Interno<input type="checkbox" id="chck-type-user"><span class="lever"></span>Externo</label>'
        +'</div></div>'
        +'<div id="div-user-assistance"></div>'
        +'</div>';

        $('.div-modal').load('Home/Modal',
            {
                ModalId       :    "modal-confirmation",
                ModalClass    :    "modal modal-info2" ,
                ModalHeader   :    '<div style="border-bottom:1px solid #e0e6ed; margin-bottom:18px;"><span><label>Agregar Asistentes</label></span></div>',
                ModalTitle    :    "",
                ModalBody     :    body,
                ModalButtonOk:    '<button type="submit" id="btn-modal-aceppt" class="modal-action waves-effect btn-flat blue white-text">Aceptar</button>'
            },
            function() {
                validateFormModal();
                showAddFormGuest();
                $('#modal-confirmation').modal({dismissible: false}).modal('open')
                .on('click', '#btn-modal-aceppt', function () {
                    if($("#form-modal").valid()) {
                        var areaName   = $("#txt-user-assistance").attr("data-area") == "" ? "--" : $("#txt-user-assistance").attr("data-area");
                        //var cellName   = $("#txt-user-assistance").attr("data-cell") == "" ? "--" : $("#txt-user-assistance").attr("data-cell"); ANTES
                        var enterprise = $("#txt-user-assistance").attr("data-enterprise") == "" ? "--" : $("#txt-user-assistance").attr("data-enterprise");
                        datatableAssistance.row.add({
                            "UserName"                 : $("#txt-user-assistance").val(),
                            "AreaName"                 : areaName,
                            //"CellName"                 : cellName, ANTES
                            "UserId"                   : $("#txt-user-assistance").attr("data-userid"),
                            "EnterpriseName"           : enterprise,
                            "UserAssistanceGuestDesc"  : $("#txt-desc-user-assistance").val(),
                            "UserAssistanceGuestEmail" : $("#txt-email-user-assistance").val(),
                        }).draw();
                        $('#modal-confirmation').modal('close');
                        $(".card-content-assistance").animate({ scrollTop: $('.card-content-assistance').prop("scrollHeight")}, 1000);
                    }
                });
            }
        );
    }
    //21/8
    else {
        var tipoReunion = $("#cbo-type-meeting").val();
        var mensaje = "";

        if (tipoReunion && tipoReunion !== "") { //27/8
            mensaje = 'Debe registrar previamente el listado de participantes para este tipo de reunión.<br>' +
                'Haz clic en <a href="' + baseUrl +'/TypeMeeting" target="_blank" style="font-weight:bold; color:#1976d2; text-decoration:underline;">' +
                '<i class="material-icons" style="font-size:16px;vertical-align:middle;">open_in_new</i> Mantenimiento &gt; Tipo de reunión</a> para registrar participantes.';
        } else {
            mensaje = "Es obligatorio seleccionar un tipo de reunión";
        }

        $('.div-modal').load('Home/Modal',
            {
                ModalId: "modal-confirmation",
                ModalClass: "modal-message modal-warning2",
                ModalHeader: '<span><i class="material-icons">warning</i><label>ADVERTENCIA</label></span>',
                ModalTitle: "",
                ModalBody: mensaje,
                ModalButtonOk: ''
            },
            function () {
                $(".modal-close").text("Cerrar");
                $('#modal-confirmation').modal({ dismissible: false }).modal('open')
                    .on('click', '#btn-modal-aceppt', function () {
                        $('#modal-confirmation').modal('close');
                    });
            }
        );
    }
    //21/8
}
/*================================================================================================================================================================================*/
function validateFormMeeting() {
    // Los contenedores de error existen y tienen IDs adecuados
    if ($("#cbo-type-meeting-error").length === 0) {
        $(".input-field-with-icon:has(#cbo-type-meeting)").after('<div id="cbo-type-meeting-error" class="error2"></div>');
    }

    if ($("#txt-meeting-location-error").length === 0) {
        $(".input-field-with-icon:has(#txt-meeting-location)").after('<div id="txt-meeting-location-error" class="error2"></div>');
    }

    if ($("#txt-meeting-end-time-error").length === 0) {
        $(".input-field-with-icon:has(#txt-meeting-end-time)").after('<div id="txt-meeting-end-time-error" class="error2"></div>');
    }

    if ($("#txt-meeting-start-time-error").length === 0) {
        $(".input-field-with-icon:has(#txt-meeting-start-time)").after('<div id="txt-meeting-start-time-error" class="error2"></div>');
    }

    // Añadir regla personalizada para comparar horas
    $.validator.addMethod("endTimeGreaterThanStartTime", function (value, element) {
        var startTime12h = startPickatime.data().clockpicker;
        var endTime12h = endPickatime.data().clockpicker;
        var startTime24h = convertStringToTime(startTime12h);
        var endTime24h = convertStringToTime(endTime12h);

        if (!startTime24h || !endTime24h) return true;

        return endTime24h > startTime24h;
    }, function () {
        // Mensaje personalizado según si las horas son iguales o la final es menor
        var startTime12h = startPickatime.data().clockpicker;
        var endTime12h = endPickatime.data().clockpicker;
        var startTime24h = convertStringToTime(startTime12h);
        var endTime24h = convertStringToTime(endTime12h);

        if (startTime24h && endTime24h && endTime24h === startTime24h) {
            return "La hora final no puede ser igual a la hora inicial";
        } else {
            return "La hora final tiene que ser mayor a la hora inicial";
        }
    });

    $("#form-meeting").validate({
        errorClass: "error2",
        rules: {
            "txt-meeting-subject": { required: true },
            "txt-meeting-date": { required: true },
            "txt-meeting-start-time": { required: true },
            "txt-meeting-end-time": {
                required: true,
                endTimeGreaterThanStartTime: true
            },
            "txt-meeting-location": { required: true },
            "cbo-type-meeting": { required: true },
            "cbo-area": { required: true },
            //21/8
            //"cbo-cell": { required: true }
        },
        messages: {
            "txt-meeting-subject": { required: "Nombre de reunión es obligatorio" },
            "txt-meeting-date": { required: "Día es obligatorio" },
            "txt-meeting-start-time": { required: "Hora inicio es obligatorio" },
            "txt-meeting-end-time": { required: "Hora fin es obligatorio" },
            "txt-meeting-location": { required: "Lugar es obligatorio" },
            "cbo-type-meeting": { required: "Tipo de reunión es obligatorio" },
            "cbo-area": { required: "Área es obligatorio" },
            //21/8
            //"cbo-cell": { required: "Célula es obligatorio" }
        },
        errorElement: 'div',
        errorPlacement: function (error, element) {
            var elementId = element.attr("id");

            // Manejo especial para elementos Select2
            if (elementId === "cbo-type-meeting") {
                $("#cbo-type-meeting-error").html(error);
            } else if (elementId === "txt-meeting-location") {
                $("#txt-meeting-location-error").html(error);
            } else if (element.hasClass("select2-hidden-accessible")) {
                error.insertAfter(element.next('.select2'));
            } else if (elementId === "txt-meeting-end-time") {
                $("#txt-meeting-end-time-error").html(error);
            } else if (elementId === "txt-meeting-start-time") {
                $("#txt-meeting-start-time-error").html(error);
            } else {
                error.insertAfter(element);
            }
        },
        submitHandler: function () {
            return false;
        },
        // Forzar validación de campos Select2
        ignore: []
    });

    $("#txt-meeting-end-time, #txt-meeting-start-time").on("change", validateStartEndTime);

    $("#cbo-type-meeting").on("change", function () {
        if ($(this).val() !== "" && $(this).val() !== null) {
            $("#cbo-type-meeting-error").empty();
        } else {
            $("#cbo-type-meeting-error").html('<div class="error2">Tipo de reunión es obligatorio</div>');
        }
    });
    //21/8
    /*$("#txt-meeting-location").on("change", function () {
        if ($(this).val() !== "" && $(this).val() !== null) {
            $("#txt-meeting-location-error").empty();
        } else {
            $("#txt-meeting-location-error").html('<div class="error2">Lugar es obligatorio3</div>');
        }
    });*/

    // Para inputs de texto
    $("#txt-meeting-subject").on("input", function () {
        if ($(this).val().trim() !== "") {
            $(this).valid();
        }
    });

    // Para el campo de fecha
    $("#txt-meeting-date").on("change", function () {
        $(this).valid();
    });

    // Para campos de hora
    $("#txt-meeting-start-time").on("change", function () {
        $(this).valid();
        if ($(this).val() !== "") {
            $("#txt-meeting-start-time-error").empty();
        }
    });

    $("#txt-meeting-end-time").on("change", function () {
        $(this).valid();
        if ($(this).val() !== "") {
            $("#txt-meeting-end-time-error").empty();
        }
    });

    // Área
    $("#cbo-area").on("change", function () {
        $(this).valid();
    });

    $("<style>")
        .prop("type", "text/css")
        .html(`
            .error2 {
                color: #F44336;
                font-size: 12px;
                display: block;
                margin-top: 3px;
            }
        `)
        .appendTo("head");
} //@AMENDEZ5
/*function validateFormMeeting() {
    return $("#form-meeting").validate({
            rules: {
                "txt-meeting-subject"       : {required: true },
                "txt-meeting-location"      : {required: true },
                "txt-meeting-date"          : {required: true },
                "txt-meeting-start-time"    : {required: true },
                "txt-meeting-end-time"      : {required: true },
                "text-meeting-pauta"        : {required: true },
                "text-meeting-description"  : {required: true },
            },
            messages: {
                "txt-meeting-subject"       : {required: "Asunto es obligatorio"},
                "txt-meeting-location"      : {required: "Lugar es obligatorio"},
                "txt-meeting-date"          : {required: "Fecha es obligatorio"},
                "txt-meeting-start-time"    : {required: "Hora inicio es obligatorio"},
                "txt-meeting-end-time"      : {required: "Hora fin es obligatorio"},
                "text-meeting-pauta"        : {required: "Agenda es obligatorio" },
                "text-meeting-description"  : {required: "Descripción es obligatorio" },
            },
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
        }
    );
}*/ //ANTES
/*================================================================================================================================================================================*/
function validateFormActionPlan() {
    $("#form-modal").validate({
        errorClass: "error2", //@AMENDEZ5
        rules: {
            "txt-ap-what": { required: true },
            "txt-ap-responsible": { required: true },
            "txt-ap-date": { required: true },
            "txt-ap-priority": { required: true }, //@AMENDEZ5
            "txt-ap-category": { required: true } //@AMENDEZ5
        },
        messages: {
            "txt-ap-what": { required: "Acción es obligatorio" },
            "txt-ap-responsible": { required: "Responsable es obligatorio" },
            "txt-ap-date": { required: "Fecha programada es obligatorio" },
            "txt-ap-priority": { required: "Prioridad es obligatorio" }, //@AMENDEZ5
            "txt-ap-category": { required: "Categoría es obligatorio" } //@AMENDEZ5
        },
        errorElement: 'div',
        errorPlacement: function (error, element) {
            if (element.attr("name") === "txt-ap-priority" || element.attr("name") === "txt-ap-category") { //@AMENDEZ5
                error.insertAfter(element.parent());
            } else {
                var placement = $(element).data('error');
                if (placement) {
                    $(placement).append(error)
                } else {
                    error.insertAfter(element);
                }
            }
        }
    });
    // Forzar validación y limpiar error al cambiar la categoría
    $("#txt-ap-category").on("change", function () {
        $(this).valid();
    }); //@AMENDEZ5
}
/*================================================================================================================================================================================*/
function showAddFormGuest() {
    $("#div-user-assistance").empty();
    if($("#chck-type-user").is(':checked')) {
        $("#div-user-assistance")
            .append(
                '<div class="row input-field-with-icon" style="margin-bottom:0;">'
                + '<div class="col s1" style="display:flex;align-items:center;justify-content:center;">'
                + '<i class="material-icons prefix" style="color:#1a237e;font-size:2.5rem;padding-top:13px;">person</i>'
                + '</div>'
                + '<div class="col s11" style="padding-top:5px;">'
                + '<label for="txt-user-assistance" class="active" style="padding-left:0px;" >Nombre</label>'
                + '<input name="txt-user-assistance" id="txt-user-assistance" type="text" autocomplete="off" data-userid="0" placeholder="Escribir el nombre">'
                + '</div>'
                + '</div>'
            )
            .append(
                '<div class="row input-field-with-icon" style="margin-bottom:0;margin-top:28px;">'
                + '<div class="col s1" style="display:flex;align-items:center;justify-content:center;">'
                + '<i class="material-icons prefix" style="color:#1a237e;font-size:2.5rem;padding-top:13px;">email</i>'
                + '</div>'
                + '<div class="col s11" style="padding-top:5px;">'
                + '<label for="txt-email-user-assistance" class="active" style="padding-left:0px;">E-mail</label>'
                + '<input name="txt-email-user-assistance" id="txt-email-user-assistance" type="text" autocomplete="off" placeholder="Escribir el E-mail">'
                + '</div>'
                + '</div>'
            )
            .append(
                '<div class="row input-field-with-icon" style="margin-bottom:0;margin-top:28px;">'
                + '<div class="col s1" style="display:flex;align-items:center;justify-content:center;">'
                + '<i class="material-icons prefix" style="color:#1a237e;font-size:2.5rem;padding-top:13px;">description</i>'
                + '</div>'
                + '<div class="col s11" style="padding-top:5px;">'
                + '<label for="txt-desc-user-assistance" class="active" style="padding-left:0px;">Detalles</label>'
                + '<input name="txt-desc-user-assistance" id="txt-desc-user-assistance" type="text" autocomplete="off" placeholder="Escribir detalles">'
                + '</div>'
                + '</div>'
            )

        $("input[name=txt-desc-user-assistance]").rules( "add",{required:true,messages: {required: "Detalles es obligatorio"} });

        $("input[name=txt-email-user-assistance]").rules( "add",{
            required:true,email:true, messages: {required: "E-mail es obligatorio", email:"Por favor, introduce un e-mail válido."}
        });
    }
    else {
        $("#div-user-assistance").html(
            '<div class="row input-field-with-icon" style="margin-bottom:0;">'
            + '<div class="col s1" style="display:flex;align-items:center;justify-content:center;">'
            + '<i class="material-icons prefix" style="color:#1a237e;font-size:2.5rem;padding-top:13px;">person</i>'
            + '</div>'
            + '<div class="col s11" style="padding-top:5px;">'
            + '<label for="txt-user-assistance" class="active" style="padding-left:0px;">Nombre</label>'
            + '<input name="txt-user-assistance" id="txt-user-assistance" class="" type="text" autocomplete="off" placeholder="Escribir el nombre">'
            + '</div>'
            + '</div>'
        );
        $("#div-email-user-assistance").empty();
        initAutocompleteUser("#txt-user-assistance", getAllUserAssistance());
    }

    $("input[name=txt-user-assistance]").rules("add", {required: true, messages: {required: "Colaborador es obligatorio"} } );
    setTimeout(function() { $("input[name=txt-user-assistance]").focus();}, 200);
} //@AMENDEZ5
/*function showAddFormGuest() {
    $("#div-user-assistance").empty();
    if ($("#chck-type-user").is(':checked')) {
        $("#div-user-assistance")
            .append('<div class="input-field withicon">'
                + '<i class="material-icons prefix">person</i>'
                + '<input name="txt-user-assistance" id="txt-user-assistance" type="text" autocomplete="off" data-userid="0">'
                + '<label for="txt-user-assistance">Colaborador</label>'
                + '</div>')
            .append('<div class="input-field withicon">'
                + '<i class="material-icons prefix">description</i>'
                + '<input name="txt-desc-user-assistance" id="txt-desc-user-assistance" type="text" autocomplete="off">'
                + '<label for="txt-desc-user-assistance">Descripción</label>'
                + '</div>')
            .append('<div class="input-field withicon">'
                + '<i class="material-icons prefix">email</i>'
                + '<input name="txt-email-user-assistance" id="txt-email-user-assistance" type="text" autocomplete="off">'
                + '<label for="txt-email-user-assistance">E-mail</label>'
                + '</div>');

        $("input[name=txt-desc-user-assistance]").rules("add", { required: true, messages: { required: "Descripción es obligatorio" } });

        $("input[name=txt-email-user-assistance]").rules("add", {
            required: true, email: true, messages: { required: "E-mail es obligatorio", email: "Por favor, introduce un e-mail válido." }
        });
    }
    else {
        $("#div-user-assistance").html('<div class="input-field withicon">'
            + '<i class="material-icons prefix">person</i>'
            + '<input name="txt-user-assistance" id="txt-user-assistance" class="" type="text" autocomplete="off">'
            + '<label for="txt-user-assistance" class="">Colaborador</label>'
            + '</div>');
        $("#div-email-user-assistance").empty();
        initAutocompleteUser("#txt-user-assistance", getAllUserAssistance());
    }

    $("input[name=txt-user-assistance]").rules("add", { required: true, messages: { required: "Colaborador es obligatorio" } });
    setTimeout(function () { $("input[name=txt-user-assistance]").focus(); }, 200);
}*/ //ANTES
/*================================================================================================================================================================================*/
/*function showModalInsertMeeting() {
    console.log("Entrando a showModalInsertMeeting");

    // Verificar que los componentes modales están disponibles
    if (typeof $ === 'undefined' || !$.fn.modal) {
        console.error("jQuery o la función modal no están disponibles");
        alert("Error al mostrar el modal. Recargue la página.");
        return;
    }

    var modalBody = '<div class="text-question">¿Desea guardar esta acta de reunión?</div>' +
        '<div style="padding-top:15px;"><p><input type="checkbox" class="filled-in" id="check-send-email"/><label for="check-send-email">Enviar e-mail a los participantes</label></p></div>';

    var startTime = $("#txt-meeting-start-time").val();
    var endTime = $("#txt-meeting-end-time").val();
    var typeMeetingCode = $("#cbo-type-meeting").val();
    var validateJustification = true;

    console.log("Valores para guardar:", {
        startTime: startTime,
        endTime: endTime,
        typeMeetingCode: typeMeetingCode
    });

    $(".txt-reason-justification-error").remove();
    $(".txt-reason-justification").each(function (index) {
        if ($(this).val() == '') {
            $("#div-reason-justification-" + index).append('<div class="error2 txt-reason-justification-error rj-error-' + index + '" style="padding-top:10px;text-align:left;">Motivo es obligatorio</div>');
            validateJustification = false;
        }
    });

    if (!validateJustification) {
        console.log("Justificación inválida");
        $('html, body').animate({ scrollTop: 0 }, 'slow');
        return false;
    }

    var count = datatableAssistance.data().count();
    console.log("Cantidad de asistentes:", count);
    if (count > 0) {
        // Cargar modal usando una promesa para evitar problemas de sincronización
        var loadModalPromise = new Promise(function (resolve, reject) {
            $('.div-modal').load('Home/Modal',
                {
                    ModalId: "modal-confirmation",
                    ModalClass: "modal-message-2 modal-info2",
                    ModalHeader: '<span><i class="blue-dark-text material-icons">help_outline</i><label>CONFIRMACIÓN</label></span>',
                    ModalTitle: " ",
                    ModalBody: modalBody,
                    ModalButtonOk: '<button type="button" id="btn-modal-aceppt" class="modal-action waves-effect btn-flat blue white-text">Aceptar</button>'
                },
                function (response, status, xhr) {
                    if (status == "error") {
                        console.error("Error al cargar el modal:", xhr.status, xhr.statusText);
                        reject(xhr.statusText);
                    } else {
                        console.log("Modal cargado correctamente");
                        resolve();
                    }
                }
            );
        });

        loadModalPromise.then(function () {
            console.log("Abriendo modal de confirmación");

            // Asegúrate de que el modal existe
            if ($('#modal-confirmation').length === 0) {
                console.error("El modal no se cargó correctamente");
                alert("Error al mostrar el modal de confirmación. Intente nuevamente.");
                return;
            }

            // Inicializa y abre el modal
            $('#modal-confirmation').modal({
                dismissible: false,
                opacity: 0.9,
                inDuration: 300,
                outDuration: 200,
                startingTop: '4%',
                endingTop: '10%',
                ready: function () {
                    console.log("Modal abierto y listo");
                }
            }).modal('open');

            // Maneja el click en el botón de aceptar
            $('#btn-modal-aceppt').off('click').on('click', function () {
                console.log("Botón aceptar clickeado");
                var isCheckedSendEmail = $("#check-send-email").is(":checked");
                $("#check-send-email").attr("disabled", "disabled");
                var meetingCode = $("#txt-meeting-code").val();

                console.log("Guardando reunión con código:", meetingCode);

                // Comenzar proceso de guardado
                insertMeeting(meetingCode, typeMeetingCode)
                    .done(function (response) {
                        console.log("Respuesta insertMeeting:", response);
                        try {
                            response = $.parseJSON(response);
                            var message = response.Message[0].Description;
                            if (message == "Success") {
                                console.log("Reunión guardada con éxito");

                                // Continuar con el resto del proceso
                                insertActionPlan(meetingCode)
                                    .done(function () {
                                        console.log("Plan de acción guardado");
                                        insertMeetingDevWithImage(meetingCode)
                                            .done(function () {
                                                console.log("Imágenes guardadas");
                                                insertUserAssistance(meetingCode)
                                                    .done(function () {
                                                        console.log("Asistencia guardada");
                                                        insertGuide(meetingCode)
                                                            .done(function () {
                                                                console.log("Guía guardada");
                                                                insertMeetingDev(meetingCode)
                                                                    .done(function () {
                                                                        console.log("Desarrollo guardado");
                                                                        getMeetingByCodeSavePdf(meetingCode, isCheckedSendEmail)
                                                                            .done(function () {
                                                                                console.log("PDF generado");
                                                                                insertAttachFile(meetingCode)
                                                                                    .done(function () {
                                                                                        console.log("Todo guardado, redirigiendo...");
                                                                                        window.location.href = "MeetingList";
                                                                                    });
                                                                            });
                                                                    });
                                                            });
                                                    });
                                            });
                                    });
                            } else {
                                console.error("Error:", message);
                                alert("Error: " + message);
                            }
                        } catch (e) {
                            console.error("Error al procesar la respuesta:", e);
                            alert("Error al procesar la respuesta del servidor");
                        }
                    })
                    .fail(function (xhr, status, error) {
                        console.error("Error al guardar la reunión:", status, error);
                        alert("Error al guardar la reunión: " + error);
                    });
            });
        }).catch(function (error) {
            console.error("Error en la promesa del modal:", error);
            alert("Error al preparar la confirmación: " + error);
        });
    } else {
        console.log("No hay asistentes");
        $('.div-modal').load('Home/Modal',
            {
                ModalId: "modal-confirmation",
                ModalClass: "modal-message modal-warning2",
                ModalHeader: '<span><i class="material-icons">warning</i><label>ADVERTENCIA</label></span>',
                ModalTitle: "",
                ModalBody: "Es obligatorio tener participantes",
                ModalButtonOk: ''
            },
            function () {
                $(".modal-close").text("Cerrar");
                $('#modal-confirmation').modal({ dismissible: false }).modal('open');
            });
    }
}*/
function showModalInsertMeeting() {
    var modalBody = '<div class="text-question">¿Desea guardar esta acta de reunión?</div>'
    +'<div style="padding-top:15px;"><p><input type="checkbox" class="filled-in" id="check-send-email"/><label for="check-send-email">Enviar e-mail a los participantes</label></p></div>';

    var startTime = $("#txt-meeting-start-time").val();
    var endTime = $("#txt-meeting-end-time").val();
    var typeMeetingCode = $("#cbo-type-meeting").val();
    //var typeMeetingCode = $("#cbo-type-meeting").select2("val"); //ANTES
    var validateJustification = true;

    if($("#form-meeting").valid()) {
        if(typeMeetingCode != null) {
            $(".txt-reason-justification-error").remove();
            $(".txt-reason-justification").each(function(index) {
                if($(this).val() == '') {
                    $("#div-reason-justification-"+index).append('<div class="error2 txt-reason-justification-error rj-error-'+index+'" style="padding-top:10px;text-align:left;">Motivo es obligatorio</div>');
                    validateJustification = false;
                }
            });

            if(!validateJustification) {
                $('html, body').animate({scrollTop: 0}, 'slow');
                return false;
            }

            var count = datatableAssistance.data().count();
            if(count > 0) {
                $('.div-modal').load('Home/Modal',
                    {
                        ModalId:        "modal-confirmation",
                        ModalClass:     "modal-message-2 modal-info2",
                        ModalHeader:    '<span><i class="blue-dark-text material-icons ">help_outline</i><label>CONFIRMACIÓN</label></span>',
                        ModalTitle:     " ",
                        ModalBody:      modalBody,
                        ModalButtonOk:  '<button type="button" id="btn-modal-aceppt" class="modal-action waves-effect btn-flat blue white-text">Aceptar</button>'
                    },
                    function() {
                        $('#modal-confirmation').modal({dismissible: false}).modal('open')
						.one('click', '#btn-modal-aceppt', function () {

                            const isCheckedSendEmail = $("#check-send-email").is(":checked");

                            $("#check-send-email").attr("disabled", "disabled");

                            var meetingCode = $("#txt-meeting-code").val();

                            // Registrar acta de reunion
                            var ajax = insertMeeting(meetingCode, typeMeetingCode);
                            ajax.done(function (response) {

                                response = $.parseJSON(response);
                                var message = response.Message[0].Description;
                                if(message == "Success") {

                                    // Registrar plan de accion
                                    var ajaxap = insertActionPlan(meetingCode);
                                    ajaxap.done(function() {

                                        // Registrar imagenes
                                        var ajaxmdi = insertMeetingDevWithImage(meetingCode);
                                        ajaxmdi.done(function() {

                                            // Registrar asistencia
                                            var ajaxu = insertUserAssistance(meetingCode);
                                            ajaxu.done(function() {

                                                // Registrar agenda
                                                var ajaxg = insertGuide(meetingCode);
                                                ajaxg.done(function() {

                                                    // Registrar desarrollo
                                                    var ajaxMD = insertMeetingDev(meetingCode);
                                                    ajaxMD.done(function() {

                                                        // Enviar acta en pdf al correo
                                                        var ajaxPdf = getMeetingByCodeSavePdf(meetingCode, isCheckedSendEmail);
                                                        ajaxPdf.done(function() {

                                                            // Archivos adjuntos
                                                            var ajaxAttach = insertAttachFile(meetingCode);
                                                            ajaxAttach.done(function() {
                                                                window.location.href = "MeetingList";
                                                            });
                                                        });
                                                    });
                                                });
                                            });
                                        });
                                    });
                                }
                                else {
                                    alert(message);
                                }
                            });
                        });
                    }
                );
            }
            else {
                $('.div-modal').load('Home/Modal',
                {
                    ModalId       :    "modal-confirmation",
                    ModalClass    :    "modal-message modal-warning2",
                    ModalHeader   :    '<span><i class="material-icons">warning</i><label>ADVERTENCIA</label></span>',
                    ModalTitle    :    "",
                    ModalBody     :    "Es obligatorio tener participantes",
                    ModalButtonOk :    ''
                },
                function() {
                    $(".modal-close").text("Cerrar");
                    $('#modal-confirmation').modal({dismissible: false}).modal('open')
                    .on('click', '#btn-modal-aceppt', function () {$('#modal-confirmation').modal('close'); });
                });
            }
        }
        else {
            $("#cbo-type-meeting-error").text("Tipo de reunión es obligatorio");
        }
    }
    else {
        var countIndex = 0;
        $("div.error").each(function(index, item) {
            if($(item).text() != "") {
                if(countIndex == 0) {
                    $('html, body').animate({scrollTop: $(item).offset().top - 150 }, 'slow');
                    countIndex ++;
                }
            }
        });

        if(typeMeetingCode == null) {
            $("#cbo-type-meeting-error").text("Tipo de reunión es obligatorio");


            $('html, body').animate({scrollTop: 0 }, 100);
        }
    }
}
/*================================================================================================================================================================================*/
function getActionPlanModalBody() {
    return `
    <div class="col s12 m12 l12">
        <div class="row" style="padding-top: 0px;">
            <div class="col s12 m6 l6" style="padding-left: 0px;">
                <div class="input-field-with-icon">
                    <select id="txt-ap-category" name="txt-ap-category" class="browser-default" style="background-color: white !important; border: 1px solid #ccc; height: 36px;">
                        <option value="" disabled selected>Seleccionar...</option>
                    </select>
                    <label for="txt-ap-category" style="margin-bottom: 8px; display: block;">Categoría</label>
                </div>
            </div>
        </div>
        <div class="row" style="padding-top: 12px;">
                <div class="input-field-with-icon">
                    <input type="text" id="txt-ap-what" name="txt-ap-what" class="txt-ap-what" placeholder="Escribir la acción">
                    <label for="txt-ap-what">Acción</label>
                </div>
        </div>
        <div class="row" style="padding-top: 12px;">
            <div class="input-field-with-icon">
                <input type="text" id= "txt-ap-responsible" name="txt-ap-responsible" class="txt-ap-responsible" placeholder="Escribir el nombre">
                <label for="txt-ap-responsible">Responsable</label>
            </div>
        </div>
        <div class="row" style="padding-top: 12px;">
            <div class="col s12 m12 l6" style="padding-top: 8px; padding-left: 0px;">
                <div class="input-field-with-icon">
                    <input type="text" name="txt-ap-date" id="txt-ap-date">
                    <label for="txt-ap-date">Fecha Programada</label>
                    <i class="material-icons suffix icon-calendar">date_range</i>
                </div>
            </div>
            <div class="col s12 m12 l6" style="padding-top: 8px; padding-left: 0px;">
                <div class="input-field-with-icon">
                    <select id="txt-ap-priority" name="txt-ap-priority" class="browser-default" style="background-color: white; border: 1px solid #ccc; height: 36px;">
                        <option value="" disabled selected>Seleccione...</option>
                        <option value="ALTA" style="color:#F44336 !important;font-weight:bold !important;">Alta</option>
                        <option value="MEDIA" style="color:#FF9800 !important;font-weight:bold !important;">Media</option>
                        <option value="BAJA" style="color:#4CAF50 !important;font-weight:bold !important;">Baja</option>
                    </select>
                    <label for="txt-ap-priority" style="margin-bottom: 8px; display: block;">Prioridad</label>
                </div>
            </div>
        </div>
    </div>
    `;
} //@AMENDEZ5
/*================================================================================================================================================================================*/
function showModalAddActionPlan() {
    $('.div-modal').load('Home/Modal',
        {
            ModalId: "modal-confirmation",
            ModalClass: "modal modal-info2",
            ModalHeader: '<div style="border-bottom:1px solid #e0e6ed; margin-bottom:18px;"><span><label>Agregar Plan de Acción</label></span></div>',
            ModalTitle: "",
            ModalBody: '<div id="div-form-ap"></div>',
            ModalButtonOk: '<button type="submit" id="btn-modal-aceppt" class="modal-action waves-effect btn-flat blue white-text">Aceptar</button>'
        },
        function () {
            $("#div-form-ap").html(getActionPlanModalBody()); //@AMENDEZ5
            validateFormActionPlan();
            getAllActionPlanCategoryActive(); //@AMENDEZ5
            $('#txt-ap-priority').material_select(); //@AMENDEZ5

            $('#modal-confirmation').modal({
                dismissible: false,
                ready: function () {
                    var onClose = function () {
                        $('html, body').animate({ scrollTop: $(".div-actionplan").offset().top - 50 }, 'slow');
                    }
                    var pickadate = initPickadate($("#txt-ap-date"), "body", onClose);
                    pickadate.set('select', getCurrentDatetime(1), { format: 'dd/mm/yyyy' });
                    initAutocompleteUser(".txt-ap-responsible", null);
                    $(".txt-ap-what").focus();
                }
            })
                .modal('open')
                .on('click', '#btn-modal-aceppt', function () {
                    $('#txt-ap-priority').valid(); //@AMENDEZ5

                    if ($("#form-modal").valid()) {
                        if ($(".txt-ap-responsible").attr("data-userid")) {
                            var count = datatableActionPlan.data().count();
                            var categoryId = $("#txt-ap-category").val(); //@AMENDEZ5
                            var categoryName = $("#txt-ap-category option:selected").text(); //@AMENDEZ5

                            var fechaProgramada = $("#txt-ap-date").val();
                            var partes = fechaProgramada.split('/');
                            var fechaPlan = new Date(partes[2], partes[1] - 1, partes[0]);
                            var hoy = new Date();
                            hoy.setHours(0, 0, 0, 0);

                            var nuevoEstado = (fechaPlan < hoy) ? 2 : 1; // 2 = Fuera de Plazo, 1 = En Proceso

                            datatableActionPlan.row.add({
                                "RowNumber": count + 1,
                                "ActionPlanWhat": $(".txt-ap-what").val(),
                                "ActionPlanCategoryId": categoryId,
                                "ActionPlanCategoryName": categoryName,
                                "ResponsibleUserName": $(".txt-ap-responsible").val(),
                                "ResponsibleUserId": $(".txt-ap-responsible").attr("data-userid"),
                                "ActionPlanScheduledDate": $("#txt-ap-date").val(),
                                "ActionPlanPriority": $("#txt-ap-priority").val(),
                                "ActionPlanStatus": nuevoEstado,
                            }).draw();
                            $('#modal-confirmation').modal('close');
                        }
                        else {
                            $(".txt-ap-responsible").blur();
                        }
                    }
                });
        }
    );
} //@AMENDEZ5
/* function showModalAddActionPlan() {
    var body = '<div class="col s12">'
    +'<div class="row">'

    +'<div class="input-field withicon col s12"><i class="material-icons prefix">assignment</i>'
    +'<textarea  name="txt-ap-what" class="materialize-textarea textarea-material-normal txt-ap-what"></textarea><label for="txt-ap-what">¿Que?</label></div>'
    +'</div>'
    +'<div class="row">'
    +'<div class="input-field withicon col s12"><i class="material-icons prefix">assignment</i>'
    +'<textarea  name="txt-ap-why" class="materialize-textarea textarea-material-normal txt-ap-why"></textarea><label for="txt-ap-why">¿Porque?</label></div>'
    +'</div>'
    +'<div class="row">'
    +'<div class="input-field withicon col s12 m6 l6"><i class="material-icons prefix">person</i>'
    +'<input type="text" name="txt-ap-responsible" class="txt-ap-responsible"><label for="txt-ap-responsible">Responsable</label></div>'

    +'<div class="input-field withicon col s12 m6 l6"><i class="material-icons prefix">today</i>'
    +'<input type="text" name="txt-ap-date" id="txt-ap-date"><label for="txt-ap-date">Fecha Programada</label></div>'

    +'</div>'
    +'</div>';

    $('.div-modal').load('Home/Modal',
        {
            ModalId       :    "modal-confirmation",
            ModalClass    :    "modal modal-info2",
            ModalHeader   :    '<span><i class="material-icons">assignment</i><label>AGREGAR PLAN DE ACCIÓN</label></span>',
            ModalTitle    :    "",
            ModalBody     :    '<div id="div-form-ap"></div>',
            ModalButtonOk :    '<button type="submit" id="btn-modal-aceppt" class="modal-action waves-effect btn-flat blue white-text">Aceptar</button>'
        },
        function() {
            validateFormActionPlan();
            $("#div-form-ap").html(body);

            $('#modal-confirmation').modal({dismissible: false,
                ready: function(modal, trigger) {
                    var onClose = function(thingSet) {
                       $('html, body').animate({scrollTop: $(".div-actionplan").offset().top - 50 }, 'slow');
                    }
                    var pickadate = initPickadate($("#txt-ap-date"), "body", onClose);
                    pickadate.set('select', getCurrentDatetime(1), { format: 'dd/mm/yyyy' });
                    initAutocompleteUser(".txt-ap-responsible", null);
                    $(".txt-ap-what").focus();
                }
            })
            .modal('open')
            .on('click', '#btn-modal-aceppt', function (e) {
                if($("#form-modal").valid()) {
                    if($(".txt-ap-responsible").attr("data-userid")) {
                        var count = datatableActionPlan.data().count();
                        datatableActionPlan.row.add({
                            "RowNumber"                 : count + 1,
                            "ActionPlanWhat"            : $(".txt-ap-what").val(),
                            "ActionPlanWhy"             : $(".txt-ap-why").val(),
                            "ResponsibleUserName"       : $(".txt-ap-responsible").val(),
                            "ResponsibleUserId"         : $(".txt-ap-responsible").attr("data-userid"),
                            "ActionPlanScheduledDate"   : $("#txt-ap-date").val()
                        }).draw();
                        $('#modal-confirmation').modal('close');
                    }
                    else{
                        $(".txt-ap-responsible").blur();
                    }
                }
            });
        }
    );
}*/ //ANTES
/*================================================================================================================================================================================*/
function showModalEditActionPlan() {
    var index = $(this).attr("data-index");
    var actionPlan = datatableActionPlan.row(index).data();

    $('.div-modal').load('Home/Modal',
        {
            ModalId: "modal-confirmation",
            ModalClass: "modal modal-info2",
            ModalHeader: '<div style="border-bottom:1px solid #e0e6ed; margin-bottom:18px;"><span><label>Editar Plan de Acción</label></span></div>',
            ModalTitle: "",
            ModalBody: '<div id="div-form-ap"></div>',
            ModalButtonOk: '<button type="submit" id="btn-modal-aceppt" class="modal-action waves-effect btn-flat blue white-text">Aceptar</button>'
        },
        function () {
            $("#div-form-ap").html(getActionPlanModalBody());
            validateFormActionPlan();

            // Llenar los campos con datos existentes (excepto categoría y prioridad)
            initAutocompleteUser(".txt-ap-responsible", null);
            $(".txt-ap-what").val(actionPlan.ActionPlanWhat);
            $(".txt-ap-responsible").val(actionPlan.ResponsibleUserName);
            $(".txt-ap-responsible").attr("data-userid", actionPlan.ResponsibleUserId);

            var pickadate = initPickadate($("#txt-ap-date"), "body", function () {
                $('html, body').animate({ scrollTop: $(".div-actionplan").offset().top - 50 }, 'slow');
            });
            $("#txt-ap-date").val(actionPlan.ActionPlanScheduledDate);

            // Cargar categorías con AJAX y asegurar que se selecciona el valor correcto
            $.ajax({
                url: baseUrl + '/getAllActionPlanCategoryActive',
                type: 'GET',
                dataType: 'json',
                success: function (response) {
                    if (typeof response === 'string') {
                        response = JSON.parse(response);
                    }

                    // Llenar selector de categorías
                    var $categorySelect = $("#txt-ap-category");
                    $categorySelect.empty();
                    $categorySelect.append('<option value="" disabled>Seleccionar...</option>');

                    if (response.ActionPlanCategory && response.ActionPlanCategory.length > 0) {
                        $.each(response.ActionPlanCategory, function (i, category) {
                            var selected = (category.ActionPlanCategoryId == actionPlan.ActionPlanCategoryId) ? 'selected' : '';
                            $categorySelect.append('<option value="' + category.ActionPlanCategoryId + '" ' + selected + '>' +
                                category.ActionPlanCategoryName + '</option>');
                        });
                    }

                    // Inicializar y llenar campo de prioridad
                    $('#txt-ap-priority').material_select();
                    setTimeout(function () {
                        $("#txt-ap-priority").val(actionPlan.ActionPlanPriority);
                        $('#txt-ap-priority').material_select('refresh');
                    }, 100);

                },
                error: function (xhr, status, error) {
                }
            });

            $('#modal-confirmation').modal({
                dismissible: false
            }).modal('open')
                .on('click', '#btn-modal-aceppt', function () {
                    $('#txt-ap-priority').valid();
                    if ($("#form-modal").valid()) {
                        var categoryId = $("#txt-ap-category").val();
                        var categoryName = $("#txt-ap-category option:selected").text();

                        var fechaProgramada = $("#txt-ap-date").val();
                        var partes = fechaProgramada.split('/');
                        var fechaPlan = new Date(partes[2], partes[1] - 1, partes[0]);
                        var hoy = new Date();
                        hoy.setHours(0, 0, 0, 0);

                        var nuevoEstado = (fechaPlan < hoy) ? 2 : 1; // 2 = Fuera de Plazo, 1 = En Proceso

                        datatableActionPlan.row(index).data({
                            "RowNumber": actionPlan.RowNumber,
                            "ActionPlanWhat": $(".txt-ap-what").val(),
                            "ActionPlanCategoryId": categoryId,
                            "ActionPlanCategoryName": categoryName,
                            "ResponsibleUserName": $(".txt-ap-responsible").val(),
                            "ResponsibleUserId": $(".txt-ap-responsible").attr("data-userid"),
                            "ActionPlanScheduledDate": $("#txt-ap-date").val(),
                            "ActionPlanPriority": $("#txt-ap-priority").val(),
                            "ActionPlanStatus": nuevoEstado
                        }).draw();

                        $('#modal-confirmation').modal('close');
                    }
                });
        }
    );
}   //@AMENDEZ5
/*
function showModalEditActionPlan() {
    var index = $(this).attr("data-index");
    var actionPlan = datatableActionPlan.row(index).data();

    var body = '<div class="col s12">'
    +'<div class="row">'

    +'<div class="input-field withicon col s12"><i class="material-icons prefix">assignment</i>'
    +'<textarea  name="txt-ap-what" class="materialize-textarea textarea-material-normal txt-ap-what">'
    +'</textarea><label class="active" for="txt-ap-what">¿Que?</label></div>'
    +'</div>'
    +'<div class="row">'
    +'<div class="input-field withicon col s12"><i class="material-icons prefix">assignment</i>'
    +'<textarea  name="txt-ap-why" class="materialize-textarea textarea-material-normal txt-ap-why"></textarea><label class="active" for="txt-ap-why">¿Porque?</label></div>'
    +'</div>'
    +'<div class="row">'
    +'<div class="input-field withicon col s12 m6 l6"><i class="material-icons prefix">person</i>'
    +'<input type="text" name="txt-ap-responsible" class="txt-ap-responsible"><label class="active" for="txt-ap-responsible">Responsable</label></div>'

    +'<div class="input-field withicon col s12 m6 l6"><i class="material-icons prefix">today</i>'
    +'<input type="text" name="txt-ap-date" id="txt-ap-date"><label for="txt-ap-date">Fecha Programada</label></div>'

    +'</div>'
    +'</div>';

    $('.div-modal').load('Home/Modal',
        {
            ModalId       :    "modal-confirmation",
            ModalClass    :    "modal modal-info2",
            ModalHeader   :    '<span><i class="material-icons">assignment</i><label>EDITAR PLAN DE ACCIÓN</label></span>',
            ModalTitle    :    "",
            ModalBody     :    body,
            ModalButtonOk :    '<button type="submit" id="btn-modal-aceppt" class="modal-action waves-effect btn-flat blue white-text">Aceptar</button>'
        },
        function() {
            validateFormActionPlan();
            $('#modal-confirmation').modal({dismissible: false,
                ready: function(modal, trigger) {
                    var onClose = function(thingSet) {
                       $('html, body').animate({scrollTop: $(".div-actionplan").offset().top - 50 }, 'slow');
                    }
                    var pickadate = initPickadate($("#txt-ap-date"), "body", onClose);
                    pickadate.set('select', getCurrentDatetime(1), { format: 'dd/mm/yyyy' });
                    initAutocompleteUser(".txt-ap-responsible", null);

                    $(".txt-ap-what").val(actionPlan.ActionPlanWhat);
                    $(".txt-ap-why").val(actionPlan.ActionPlanWhy);
                    $(".txt-ap-responsible").val(actionPlan.ResponsibleUserName);
                    $(".txt-ap-responsible").attr("data-userid", actionPlan.ResponsibleUserId);
                    $("#txt-ap-date").val(actionPlan.ActionPlanScheduledDate);
                    validateFormModal();
                }
            })
            .modal('open')
            .on('click', '#btn-modal-aceppt', function (e) {
                if($("#form-modal").valid()) {
                    datatableActionPlan.row(index).data({
                        "RowNumber"                 : (parseInt(index) + 1),
                        "ActionPlanWhat"            : $(".txt-ap-what").val(),
                        "ActionPlanWhy"             : $(".txt-ap-why").val(),
                        "ResponsibleUserName"       : $(".txt-ap-responsible").val(),
                        "ResponsibleUserId"         : $(".txt-ap-responsible").attr("data-userid"),
                        "ActionPlanScheduledDate"   : $("#txt-ap-date").val()
                    }).draw();
                    $('#modal-confirmation').modal('close');
                }
            });
        }
    );
}*/ //ANTES
/*================================================================================================================================================================================*/
function showModalDeleteActionPlan() {
    var index = $(this).attr("data-index");
    $('.div-modal').load('Home/Modal',
        {
            ModalId: "modal-confirmation",
            ModalClass: "modal-message modal-info2",
            ModalHeader: '<span><i class="blue-dark-text material-icons">help_outline</i><label>CONFIRMACIÓN</label></span>',
            ModalTitle: "",
            ModalBody: "¿Desea eliminar este plan de acción?",
            ModalButtonOk: '<button type="button" id="btn-modal-aceppt" class="modal-action waves-effect btn-flat blue white-text">Aceptar</button>'
        },
        function () {
            $('#modal-confirmation').modal({ dismissible: false }).modal('open')
                .on('click', '#btn-modal-aceppt', function () {
                    datatableActionPlan.row(index).remove().draw(false);
                    $('#modal-confirmation').modal('close');
                });
        }
    );
} //@AMENDEZ5
/*function showModalDeleteActionPlan() {
    var index = $(this).attr("data-index");
    $('.div-modal').load('Home/Modal',
        {
            ModalId: "modal-confirmation",
            ModalClass: "modal-message modal-info2",
            ModalHeader: '<span><i class="material-icons">help_outline</i><label>CONFIRMACIÓN</label></span>',
            ModalTitle: " ",
            ModalBody: "¿Desea eliminar este plan de acción?",
            ModalButtonOk: '<button type="button" id="btn-modal-aceppt" class="modal-action waves-effect btn-flat blue white-text">Aceptar</button>'
        },
        function () {
            $('#modal-confirmation').modal({ dismissible: false }).modal('open')
                .on('click', '#btn-modal-aceppt', function (e) {

                    //Redefinir el nro de fila
                    $.each(datatableActionPlan.rows().data(), function (i, item) {
                        datatableActionPlan.row(i).data({
                            "RowNumber": i,
                            "ActionPlanWhat": item.ActionPlanWhat,
                            "ActionPlanWhy": item.ActionPlanWhy,
                            "ResponsibleUserName": item.ResponsibleUserName,
                            "ResponsibleUserId": item.ResponsibleUserId,
                            "ActionPlanScheduledDate": item.ActionPlanScheduledDate
                        }).draw();
                    });
                    datatableActionPlan.row(index).remove().draw(false);
                    $('#modal-confirmation').modal("close");
                });
        }
    );
}*/
/*================================================================================================================================================================================*/
function initDatatableActionPlan() {
    return $("#datatable-action-plan").DataTable({
        "bDestroy" : true,
        "responsive": true,
        "bAutoWidth": true,
        "bFilter": false,
        "paging":   false,
        "ordering": false,
        "info":     false,
        "bLengthChange" : false,
        "language": {"url": "Content/library/datatable/language/Spanish.json"},
        "aoColumns": [
            //{"data":"RowNumber", "title": "N°","sClass": "text-center-vh", "sWidth": "1%"}, //ANTES
            { "data": "ActionPlanWhat", "title": "Acción", "sClass": "text-center-vh", "sWidth": "20%",
                "mRender": function (data) {
                    return '<div style="display:flex;justify-content:center;align-items:center;height:100%;">' + (data || '') + '</div>';
                }
            }, //@AMENDEZ5
            //{"data":"ActionPlanWhy", "title": "¿Porque?","sClass": "text-center-vh", "sWidth": "20%"}, //ANTES
            { "data": "ActionPlanCategoryName", "title": "Categoría", "sClass": "text-center-vh", "sWidth": "5%",
                "mRender": function (data) {
                    return '<div style="display:flex;justify-content:center;align-items:center;height:100%;">' + (data || '') + '</div>';
                }
            }, //@AMENDEZ5
            { "data": "ResponsibleUserName", "title": "Responsable", "sClass": "text-center-vh", "sWidth": "20%",
                "mRender": function (data) {
                    return '<div style="display:flex;justify-content:center;align-items:center;height:100%;">' + (data || '') + '</div>';
                }
            }, //@AMENDEZ5
            { "data": "ActionPlanScheduledDate", "title": "Fecha Programada", "sClass": "text-center-vh", "sWidth": "3%",
                "mRender": function (data) {
                    return '<div style="display:flex;justify-content:center;align-items:center;height:100%;">' + (data || '') + '</div>';
                }
            }, //@AMENDEZ5
            {   "data": null,
                "title": "Prioridad",
                "sClass": "text-center-vh",
                "sWidth": "10%",
                "mRender": function (data) {
                    var prioridad = data["ActionPlanPriority"];
                    var color = "";
                    switch (prioridad) {
                        case "ALTA": color = "red"; break;
                        case "MEDIA": color = "orange darken-1"; break;
                        case "BAJA": color = "green"; break;
                        default: color = "";
                    }
                    var stylePrioridad = "font-size:12px;font-weight:bold;color:#fff;";
                    return '<div style="display:flex;justify-content:center;align-items:center;height:100%;">'
                        + (prioridad
                            ? '<span class="text-center-vh new badge ' + color + '" style="' + stylePrioridad + '">' + prioridad + '</span>'
                            : '')
                        + '</div>';
                }
            }, //@AMENDEZ5
            {   "data": null,
                "title": "Estado",
                "sClass": "text-center-vh",
                "sWidth": "10%",
                "mRender": function (data) {
                    var status = data["ActionPlanStatus"];
                    var statusHtml = "";
                    var styleEstado = "white-space:nowrap;min-width:90px;font-weight:bold;color:#fff;";
                    switch (status) {
                        case 1:
                        case "1":
                            statusHtml = "<span class='new badge yellow darken-1' style='" + styleEstado + "'>En Proceso</span>";
                            break;
                        case 2:
                        case "2":
                            statusHtml = "<span class='new badge red' style='" + styleEstado + "'>Fuera de Plazo</span>";
                            break;
                        case 3:
                        case "3":
                            statusHtml = "<span class='new badge green' style='" + styleEstado + "'>Cerrado</span>";
                            break;
                        case 4:
                        case "4":
                            statusHtml = "<span class='new badge orange darken-1' style='" + styleEstado + "'>Cerrado Fuera de Plazo</span>";
                            break;
                        default:
                            statusHtml = "";
                    }
                    return "<div style='display:flex;justify-content:center;align-items:center;height:100%;'>" + statusHtml + "</div>";
                }
            },  //@AMENDEZ5
            {"data":null, "title": "Opciones","sClass": "text-center-vh","sWidth": "5%",
                "mRender": function() {
                    return '<div class="buttons-preview">'
                    +'<a href="javascript:void(0);" class="a-edit a-edit-action-plan activator"><i class="material-icons">mode_edit</i></a>'
                    +'<a href="javascript:void(0);" class="a-delete a-delete-action-plan"><i class="material-icons">delete_forever</i></a>'
                    +'</div>';
                }
            }
        ],
        "fnRowCallback": function (nRow, aData, iDisplayIndex) {
            $('td:not(:nth-last-child(-n+2))', nRow).addClass('black-text'); //@AMENDEZ5
            /* $('td:eq(1)', nRow).removeClass("text-hv-center").addClass("text-left");
            $('td:eq(2)', nRow).removeClass("text-hv-center").addClass("text-left");
            $('td:eq(3)', nRow).removeClass("text-hv-center").addClass("text-left");*/ //ANTES

            $('.a-edit-action-plan', nRow).attr("data-index", iDisplayIndex);
            $('.a-delete-action-plan', nRow).attr("data-index", iDisplayIndex);
        }
    });
}
/*================================================================================================================================================================================*/
function insertMeeting(meetingCode, typeMeetingCode) {
    const data = {};
    data.MeetingCode        = meetingCode;
    data.TypeMeetingCode    = typeMeetingCode;
    data.AreaId             = $("#cbo-area").val(); //@AMENDEZ5
    data.CellId             = $("#cbo-cell").val(); //@AMENDEZ5
    data.RegisteredByUserId = localStorage.getItem("UserId");
    data.MeetingSubject     = $("#txt-meeting-subject").val();
    data.LocationCode       = $("#txt-meeting-location").val(); //@AMENDEZ5
    data.MeetingDate        = formatStrDate($("#txt-meeting-date").val(), 'dd/mm/yyyy', "/");
    data.MeetingStartTime   = $("#txt-meeting-start-time").attr("data-time24h");
    data.MeetingEndTime     = $("#txt-meeting-end-time").attr("data-time24h");

    return $.ajax({
        type        : "POST",
        url         : "insertMeeting",
        data        : JSON.stringify(data),
        dataType    : 'json',
        contentType : 'application/json; charset=utf-8',
        async       : true,
        beforeSend: function() {
            $("#btn-modal-aceppt").html('<img src="'+ baseUrl + '/Content/MeetingRecordAppWeb/img/ic_spinner_50.svg" style="width:35px;">'
                +'<span style="position:  relative;float: right;">Aceptar</span>');
            $(".modal-close").addClass("disabled");
            $(".text-question").text("Guardando...");
        },
        error: function (response) {
        }
    });
}
/*================================================================================================================================================================================*/
function insertUserAssistance(meetingCode) {
    var entityList = [];
    $.each(datatableAssistance.rows().data(), function(i, item) {
        var obj                         = {};
        obj.MeetingCode                 = meetingCode;
        obj.UserAssistanceCode          = getGeneratedCode("M-AP");
        obj.UserId                      = item.UserId;
        obj.UserAssistanceGuest         = item.UserId == 0 ? item.UserName : null;
        obj.UserAssistanceGuestDesc     = item.UserId == 0 ? item.UserAssistanceGuestDesc : null;
        obj.UserAssistanceGuestEmail    = item.UserId == 0 ? item.UserAssistanceGuestEmail : null;
        obj.UserAssistanceStatus        = $('.switch-option-check').eq(i).is(":checked");
        // Si la asistencia está marcada, verificar tardanza
        if (obj.UserAssistanceStatus) {
            obj.UserAssistanceJustification = false; // No justificación si asistió
            obj.UserAssistanceDelay = $('#check-delay-' + i).is(":checked");
            obj.UserAssistanceReasonJustification = null;
        } else {
            // Si no asistió, verificar justificación
            obj.UserAssistanceJustification = $('#check-justification-' + i).is(":checked");
            obj.UserAssistanceDelay = false; // No tardanza si no asistió
            obj.UserAssistanceReasonJustification = $('#txt-reason-justification-' + i).val();
        } //@AMENDEZ5
        /*obj.UserAssistanceJustification = $('#check-justification-' + i).is(":checked");
        obj.UserAssistanceReasonJustification = $('#txt-reason-justification-' + i).val();*/ //ANTES
        entityList.push(obj);
    });

    var data = {};
    data.entityList =  entityList;

    return $.ajax({
        type        : "POST",
        url         : "insertUserAssistance",
        data        : JSON.stringify(data),
        dataType    : 'json',
        contentType : 'application/json; charset=utf-8',
        async       : true,
        error: function() {
        }
    });
}
/*================================================================================================================================================================================*/
function insertGuide(meetingCode) {
    var entityList = [];
    $(".text-meeting-pauta").each(function () {
        var obj = {};
        var obj              = {};
        obj.MeetingCode      = meetingCode;
        obj.GuideCode        = getGeneratedCode("M-G");
        obj.GuideDescription = $(this).val();
        entityList.push(obj);

    });

    var data = {};
    data.entityList  =  entityList;
    return $.ajax({
        type        : "POST",
        url         : "insertGuide",
        data        : JSON.stringify(data),
        dataType    : 'json',
        contentType : 'application/json; charset=utf-8',
        async       : true,
        error: function() {
        }
    });
}
/*================================================================================================================================================================================*/
function insertMeetingDev(meetingCode) {
    var entityList = [];
    $(".text-meeting-description").each(function () {
        var obj                   = {};
        obj.MeetingCode           = meetingCode;
        obj.MeetingDevCode        = getGeneratedCode("M-D");
        obj.MeetingDevDescription = $(this).val();
        entityList.push(obj);

    });

    var data = {};
    data.entityList =  entityList;

    return $.ajax({
        type        : "POST",
        url         : "insertMeetingDev",
        data        : JSON.stringify(data),
        dataType    : 'json',
        contentType : 'application/json; charset=utf-8',
        async       : true,
        error: function() {
        }
    });
}
/*================================================================================================================================================================================*/
function insertMeetingDevWithImage(meetingCode) {
    var data          = new FormData();
    var validateImage = false;
    $(".file-meetingDevImage").each(function (index) {
        var files = $(this).get(0).files;
        if (files.length > 0) {
            validateImage = true;
            data.append("entityList[" + index + "].MeetingCode", meetingCode);
            data.append("entityList[" + index + "].MeetingDevCode", getGeneratedCode("M-D"));
            data.append("entityList[" + index + "].MeetingDevTitle", $(".txt-meeting-dev-title").eq(index).val());
            data.append("entityList[" + index + "].MeetingDevDescription", $(".txt-meeting-dev-description").eq(index).val());
            data.append("entityList[" + index + "].MeetingDevFileImage", files[0]);

            data.append("entityList[" + index + "].MeetingDevImage",        "");
            data.append("entityList[" + index + "].MeetingDevExtImage",     "");
            data.append("entityList[" + index + "].MeetingDevNameImage",    "");
       }
    });
    if(validateImage) {
        return $.ajax({
            type        : "POST",
            url         : "insertMeetingDevWithImage",
            processData : false,
            contentType : false,
            data        : data,
            async       : true,
            error       : function() {
            }
        });
    }
    return notificationsActionPlan();
}
/*================================================================================================================================================================================*/
function insertAttachFile(meetingCode) {
    var fileIds = Object.keys(selectedFiles);

    if (fileIds.length === 0) {
        return $.Deferred().resolve().promise();
    }

    var uploadPromises = [];
    var uploadErrors = [];

    fileIds.forEach(function (fileId) {
        var file = selectedFiles[fileId];
        var extension = file.name.split('.').pop().toLowerCase();

        var data = new FormData();
        data.append("AttachFileCode", getGeneratedCode("ATF"));
        data.append("MeetingCode", meetingCode);
        data.append("AttachFileTitle", ""); // Título vacío por defecto

        // No transformar el archivo, mantenerlo como está
        data.append("AttachFileBase", file);

        var deferred = $.Deferred();

        $.ajax({
            type: "POST",
            url: baseUrl + "/insertAttachFile",
            processData: false,
            contentType: false,
            data: data,
            async: true,
            success: function (response) {
                deferred.resolve();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                var errorMsg = "Error al subir el archivo '" + file.name + "': " + (errorThrown || textStatus);
                console.error(errorMsg, jqXHR);
                console.error("Detalles de la respuesta:", jqXHR.responseText);
                uploadErrors.push(errorMsg);

                // A pesar del error, resolvemos la promesa para continuar con los demás archivos
                deferred.resolve();
            }
        });

        uploadPromises.push(deferred.promise());
    });

    return $.when.apply($, uploadPromises)
        .then(function () {
            if (uploadErrors.length === 0) {
                console.log("Todos los archivos se subieron correctamente");
            } else {
                console.error("Errores en la subida de archivos:", uploadErrors);

                if (uploadErrors.length > 0) {
                    showErrorModal("Ocurrieron errores al subir algunos archivos:<br>" +
                        uploadErrors.join("<br>"));
                }
            }

            // Siempre resolvemos la promesa para no interrumpir el flujo
            return $.Deferred().resolve().promise();
        });
}

/*function insertAttachFile(meetingCode) {
    var hasFiles = false;
    var requests = [];

    $(".file-meeting-attached").each(function (index) {
        var $fileInput = $(this);
        var files = $fileInput.get(0).files;
        var title = $fileInput.closest('.div-attached').find('.txt-attach-file-title').val() || '';

        if (files && files.length > 0) {
            hasFiles = true;

            for (var i = 0; i < files.length; i++) {
                var data = new FormData();
                data.append("AttachFileCode", getGeneratedCode("ATF"));
                data.append("MeetingCode", meetingCode);
                data.append("AttachFileTitle", title);
                data.append("AttachFileBase", files[i]);

                var request = $.ajax({
                    type: "POST",
                    url: "insertAttachFile",
                    processData: false,
                    contentType: false,
                    data: data,
                    async: true
                }).fail(function (jqXHR, textStatus, errorThrown) {
                    // Mostrar error en modal
                    $('.div-modal').load('Home/Modal', {
                        ModalId: "modal-error",
                        ModalClass: "modal-message modal-error2",
                        ModalHeader: '<span><i class="material-icons">error</i><label>ERROR</label></span>',
                        ModalTitle: "",
                        ModalBody: "Ocurrió un error al subir el archivo: " + errorThrown + ". Verifica el tamaño y el formato.",
                        ModalButtonOk: ''
                    }, function () {
                        $(".modal-close").text("Cerrar");
                        $('#modal-error').modal({ dismissible: false }).modal('open');
                    });
                });

                requests.push(request);
            }
        }
    });

    if (hasFiles && requests.length > 0) {
        return $.when.apply($, requests);
    } else {
        return notificationsActionPlan();
    }
} //@AMENDEZ5
/*function insertAttachFile(meetingCode) {

    var data          = new FormData();
    $(".file-meeting-attached").each(function (index, value) {
        var files = $(this).get(0).files;
        if (files.length > 0) {
           data.append("AttachFileCode", getGeneratedCode("ATF"));
           data.append("MeetingCode", meetingCode);
           data.append("AttachFileTitle", $(".txt-attach-file-title").eq(index).val());
           data.append("AttachFileBase", files[0]);

            return $.ajax({
                type        : "POST",
                url         : "insertAttachFile",
                processData : false,
                contentType : false,
                data        : data,
                async       : true,
                error       : function(response) {
                }
            });
       }
    });

    return notificationsActionPlan();
}*/ //ANTES
/*================================================================================================================================================================================*/
function insertActionPlan(meetingCode) {
    var countActionPlan = datatableActionPlan.data().count();
    var dataActionPlan = datatableActionPlan.rows().data();

    if (countActionPlan > 0) {
        var entityList = [];
        $.each(dataActionPlan, function (i, item) {
            var obj = {};
            obj.ActionPlanCode = getGeneratedCode("M-AP");
            obj.MeetingCode = meetingCode;
            obj.ActionPlanWhat = item.ActionPlanWhat;
            obj.ResponsibleUserId = parseInt(item.ResponsibleUserId, 10);
            obj.ActionPlanScheduledDate = item.ActionPlanScheduledDate;
            //obj.ActionPlanStatus = parseInt(item.ActionPlanStatus, 10);
            var fechaProgramada = item.ActionPlanScheduledDate;
            var partes = fechaProgramada.split('/');
            var fechaPlan = new Date(partes[2], partes[1] - 1, partes[0]);
            var hoy = new Date();
            hoy.setHours(0, 0, 0, 0);

            if (fechaPlan < hoy) {
                obj.ActionPlanStatus = 2; // Fuera de Plazo
            } else {
                obj.ActionPlanStatus = 1; // En Proceso
            }

            obj.ActionPlanPriority = item.ActionPlanPriority;
            obj.ActionPlanCategoryId = parseInt(item.ActionPlanCategoryId, 10);

            entityList.push(obj);
        });

        var data = {};
        data.entityList = entityList;

        return $.ajax({
            type: "POST",
            url: baseUrl + "/insertActionPlan",
            data: JSON.stringify(data),
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            async: true
        });
    }

    return notificationsActionPlan();
} //@AMENDEZ5
/*function insertActionPlan(meetingCode) {
    var countActionPlan = datatableActionPlan.data().count();
    var dataActionPlan = datatableActionPlan.rows().data();


    if (countActionPlan > 0) {
        var entityList = [];
        $.each(dataActionPlan, function (i, item) {
            var obj = {};
            obj.ActionPlanCode = getGeneratedCode("M-AP");
            obj.MeetingCode = meetingCode;
            obj.ActionPlanWhat = item.ActionPlanWhat;
            obj.ResponsibleUserId = parseInt(item.ResponsibleUserId, 10);
            obj.ActionPlanScheduledDate = item.ActionPlanScheduledDate;
            obj.ActionPlanPriority = item.ActionPlanPriority;
            obj.ActionPlanCategoryId = parseInt(item.ActionPlanCategoryId, 10);
            obj.ActionPlanStatus = item.ActionPlanStatus;

            entityList.push(obj);
        });

        var data = {};
        data.entityList = entityList;

        return $.ajax({
            type: "POST",
            url: "insertActionPlan",
            data: JSON.stringify(data),
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            async: true
        });
    }

    return notificationsActionPlan();
}*/ //@AMENDEZ5
/*function insertActionPlan(meetingCode) {
    var countActionPlan = datatableActionPlan.data().count();
    var dataActionPlan  = datatableActionPlan.rows().data();
    if(countActionPlan > 0) {
        var entityList = [];
        $.each(dataActionPlan, function(i, item) {
            var obj                     = {};
            obj.MeetingCode             = meetingCode;
            obj.ActionPlanCode          = getGeneratedCode("M-AP");
            obj.ActionPlanWhat          = item.ActionPlanWhat;
            obj.ActionPlanWhy           = item.ActionPlanWhy;
            obj.ResponsibleUserId       = item.ResponsibleUserId;
            obj.ActionPlanScheduledDate = item.ActionPlanScheduledDate;
            entityList.push(obj);
        });

        var data = {};
        data.entityList =  entityList;
        return $.ajax({
            type        : "POST",
            url         : "insertActionPlan",
            data        : JSON.stringify(data),
            dataType    : 'json',
            contentType : 'application/json; charset=utf-8',
            async       : true,
            error       : function(response) {
            }
        });
    }
    return notificationsActionPlan();
}*/ // ANTES
/*================================================================================================================================================================================*/
function getMeetingByCodeSavePdf(meetingCode, isCheckedSendEmail) {
    if(isCheckedSendEmail === true) {
        return $.ajax({
            type        : "POST",
            url         : baseUrlPdf + "/getMeetingByCodeSavePdf/" + meetingCode,
            async       : true,
            error: function() {
            }
        });
    }
    else {
        return notificationsActionPlan();
    }
}
/*================================================================================================================================================================================*/