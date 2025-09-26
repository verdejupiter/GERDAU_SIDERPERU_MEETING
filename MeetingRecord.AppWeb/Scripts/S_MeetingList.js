/*================================================================================================================================================================================*/
/**
 * @fileOverview    Script Listado de actas de reunión
 * @author          ANGELY YAHAYRA MENDEZ CRUZ
 * @version         1.1.1
 * @updatedAt       27/08/2025
*/
/*================================================================================================================================================================================*/
// Var global
var datatable;
var drEventDropify;
let areaId = 0;
let cellId = 0;
var isInitialLoad = true; //@AMENDEZ5
/*================================================================================================================================================================================*/

/**
 * Inicializa jquery eventos y funciones
 */
$(document).ready(function () {

    areaId = localStorage.getItem('AreaId');

    // Verificar si la sesión ah expirado
    checkSessionExpired();

    initFormSelect2();

    initTooltip();

    //initDateRange();  //ANTES

    initDateRange(true);  //@AMENDEZ5

    isInitialLoad = true; //@AMENDEZ5

    datatable = getMeetingByArgs();

    initAutocompleteUser("#txt-user", null);

    //21/8
    $(document).on('keyup', '#txt-user',
        function () { $(this).val($(this).val().toUpperCase()); });

    $(".btn-filter-meeting").on("click", filterMeeting);

    $("#ddl-meeting-scope").on("change click", function () {
        isInitialLoad = true;
        $("#cbo-area").val(0).trigger("change");
        $("#cbo-cell").val(0).trigger("change");
        $("#cbo-type-meeting").val(0).trigger("change");
        $("#txt-start-date").val("");
        $("#txt-end-date").val("");
        $("#txt-description").val("");
        $("#txt-cod-reunion").val("");
        $("#txt-user").val("").attr("data-userid", "0");
        $("#txt-meeting-id").val("");
        $("#chck-type-search").prop("checked", false);
        $(".div-search-by-id").hide();
        $(".div-search-by-filter").show();
        datatable.ajax.reload();
    }); //@AMENDEZ5

    $(".btn-clear-filters").on("click", function () { //21/8
        $("#cbo-area").val("").trigger("change");
        $("#cbo-type-meeting").val("").trigger("change");
        $("#txt-start-date").val("");
        $("#txt-end-date").val("");
        $("#txt-description").val("");
        $("#txt-cod-reunion").val("");
        $("#txt-user").val("").attr("data-userid", "0");
        $("#txt-meeting-id").val("");
        $("#chck-type-search").prop("checked", false);
        $(".div-search-by-id").hide();
        $(".div-search-by-filter").show();

        isInitialLoad = true;

        datatable.ajax.reload();
    }); //@AMENDEZ5

    $("#btn-export-to-excel").on("click", getMeetingByArgsExportToExcel);

    $("#chck-type-search").on('click', selectTypeSearch);

    $("#txt-meeting-id").on("keypress", function(e) {return isNumber(e) });

    $(".btn-show-more-options").on("click", slideToggleMoreOptions);

    $(document).on("click", ".a-view-meeting", viewMeeting);

    $(document).on("click", ".a-edit-meeting", editMeeting);

    $(document).on("click", ".a-delete-meeting", showModalDeleteMeeting);

    $(document).on("click", ".a-attach-meeting", showModalAttachMeeting);

    $(document).on("click", "#btn-show-form-add-attach-file", showFormAddAttachFile);

    $(document).on("click", "#btn-insert-attach-file", insertAttachFile);

    $(document).on("click", ".a-delete-attach-file", showModalDeleteAttachFile);

    $(document).on("click", "#btn-delete-attach-file", deleteAttachFile);

    initAutocompleteMeetingCode("#txt-cod-reunion"); //@AMENDEZ5
    completeSelectorMeetingScope();  //@AMENDEZ5

});
/*================================================================================================================================================================================*/
function completeSelectorMeetingScope() {
    var userRole = parseInt(localStorage.getItem("UserRole")) || 0;
    var $ddl = $("#ddl-meeting-scope");

    // Limpia y elimina wrappers previos de Materialize si existen
    if ($ddl.parent().hasClass("select-wrapper")) {
        var $wrapper = $ddl.parent();
        $wrapper.after($ddl);
        $wrapper.remove();
    }
    if ($ddl.hasClass("initialized")) {
        try {
            var instance = M.FormSelect.getInstance($ddl[0]);
            if (instance) instance.destroy();
        } catch (e) { }
        $ddl.removeClass("initialized");
        $ddl.siblings("input.select-dropdown").remove();
        $ddl.siblings("ul.dropdown-content").remove();
    }

    $ddl.empty();

    if (userRole === 0) {
        $ddl.append('<option value="mine">Mis actas de reuniones</option>');
        $ddl.prop("disabled", true);
    } else if (userRole === 1 || userRole === 2) {
        $ddl.append('<option value="mine">Mis actas de reuniones</option>');
        $ddl.append('<option value="all">Todas las actas de reuniones</option>');
        $ddl.prop("disabled", false);
    }
    $ddl.val("mine");

    $ddl.select2({ theme: "bootstrap", minimumResultsForSearch: Infinity });

    setTimeout(function () {
        $('.select2-container--bootstrap .select2-selection--single').css({
            'background': '#fff',
            'border': '1px solid #ced4da'
        });
    }, 0);
} //@AMENDEZ5
/*================================================================================================================================================================================*/
function slideToggleMoreOptions() {
    $("#txt-description").val("").blur();
    $('.div-more-options').slideToggle(function() {
        if($(this).is(':visible')) {
            $(".btn-show-more-options").html('<i class="material-icons left" style="margin-right: 5px;">remove</i> Ocultar');                
        }
        else {
            $(".btn-show-more-options").html('<i class="material-icons left" style="margin-right: 5px;">add</i> Más opciones');
        }
    });
}
/*================================================================================================================================================================================*/
function selectTypeSearch() {
    if($(this).is(':checked')) {
        $(".div-search-by-filter").fadeOut("slow", function() {
            $(".div-search-by-id").fadeIn("slow");            
            $("#txt-meeting-id").val("").focus();
        });
    }
    else {
        $(".div-search-by-id").fadeOut("slow", function() {
            $("#txt-meeting-id").val("");
            $(".div-search-by-filter").fadeIn("slow");            
        });
    }
}
/*================================================================================================================================================================================*/
function initTooltip() {
    //$("#fab-show-meeting-register").tooltip({delay: 50, tooltip: "Nuevo", position: "top"}); //ANTES
    $("#btn-export-to-excel").tooltip({delay: 50, tooltip: "Exportar a excel", position: "left"});
}
/*================================================================================================================================================================================*/
function initFormSelect2() { //21/8
    getAllArea(true);

    // Inicializa los combos con select2
    $('#cbo-type-meeting').select2({ theme: "bootstrap", minimumResultsForSearch: 0 });
    $('#cbo-area').select2({ theme: "bootstrap", minimumResultsForSearch: 0 });
    $('#txt-meeting-location').select2({ theme: "bootstrap", minimumResultsForSearch: 0 });

    // Cuando se selecciona un área, carga los tipos de reunión de esa área
    $('#cbo-area').on('change', function () {
        var selectedAreaId = parseInt($(this).val()) || 0;
        getAllTypeMeetingActive(selectedAreaId, true); // true para mostrar "* Todos"
    });

    // Inicialización inicial (por ejemplo, con el área del usuario)
    getAllTypeMeetingActive(areaId, true);

    getAllLocationMeetingActive(areaId);
}
/*================================================================================================================================================================================*/
function getMeetingByArgs() {
    //const ME_UserRole = Number(localStorage.getItem("ME_UserRole")); //ANTES 
    return $("#datatable-meeting").DataTable({
        "bDestroy" : true,
        "responsive": true,
        "bAutoWidth": true, 
        "bFilter": false,
        "paging":   true,
        "ordering": false,
        "info":     false, 
        "bLengthChange" : false,
        "iDisplayLength": 10,
        "language": {"url": "Content/library/datatable/language/Spanish.json"},
        "ajax":{
            dataSrc: function (json) {json = JSON.parse(json); return json.Meeting; },
            "data": function (d) {
                /*const cboAreaId = Number($("#cbo-area").select2("val"));
                const cboCellId = Number($("#cbo-cell").select2("val"));*/
                const cboAreaId = Number($("#cbo-area").val()); //@AMENDEZ5
                const cboCellId = Number($("#cbo-cell").val()); //@AMENDEZ5
                var scope = $("#ddl-meeting-scope").val(); //@AMENDEZ5
                var userId = $("#txt-user").attr("data-userid"); //@AMENDEZ5
                var loggedUserId = localStorage.getItem("UserId"); //@AMENDEZ5

                // Scope
                if (scope === "mine") {
                    d.userId = loggedUserId;
                    d.mineScope = true;
                    // Agregar filtro por creador si hay usuario en txt-user
                    var creatorUserId = $("#txt-user").attr("data-userid");
                    d.creatorUserId = (creatorUserId && creatorUserId !== "0") ? creatorUserId : 0;
                } else if (scope === "all") {
                    d.userId = userId && userId !== "0" ? userId : 0;
                    d.mineScope = false;
                    d.creatorUserId = 0;
                } else {
                    d.userId = 0;
                    d.mineScope = false;
                    d.creatorUserId = 0;
                }

                // Código de reunión
                d.meetingCode = $("#txt-cod-reunion").val() == "" ? "" : $("#txt-cod-reunion").val();

                // Carga inicial: sin filtros, solo scope
                if (isInitialLoad) {
                    d.meetingId = 0;
                    d.areaId = 0;
                    d.cellId = 0;
                    d.typeMeetingCode = "0";
                    d.startDate = "01-01-1900";
                    d.endDate = "31-12-2100";
                    d.meetingDescription = "0";
                } else if ($("#chck-type-search").is(':checked')) {
                    // Búsqueda por ID
                    d.meetingId = $("#txt-meeting-id").val() == "" ? 0 : $("#txt-meeting-id").val();
                    d.areaId = 0;
                    d.cellId = 0;
                    d.typeMeetingCode = "0";
                    d.startDate = "01-01-1900";
                    d.endDate = "01-01-1900";
                    d.meetingDescription = "0";
                } else {
                    // Filtros aplicados por el usuario
                    d.meetingId = 0;
                    d.areaId = (cboAreaId > 0) ? cboAreaId : 0;
                    d.cellId = (cboCellId > 0) ? cboCellId : 0;
                    d.typeMeetingCode = $("#cbo-type-meeting").val();
                    var startDate = $("#txt-start-date").val();
                    var endDate = $("#txt-end-date").val();

                    d.startDate = startDate ? formatStrDate(startDate, 'dd/mm/yyyy', "/") : "1900-01-01";
                    d.endDate = endDate ? formatStrDate(endDate, 'dd/mm/yyyy', "/") : "2100-12-31";

                    d.meetingDescription = $("#txt-description").val() != "" ? $("#txt-description").val() : "0";
                } //@AMENDEZ5

                /*d.meetingId       = $("#txt-meeting-id").val() == "" ? "0" : $("#txt-meeting-id").val();
                if($("#chck-type-search").is(':checked')) {
                    d.areaId          = "0";
                    d.cellId          = "0";
                    d.typeMeetingCode = "0";
                    d.startDate       = "1900-01-01";
                    d.endDate         = "1900-01-01";
                    d.userId          = "0";
                    d.description     = "0";
                }
                else {
                    d.areaId          = ( cboAreaId > 0 ) ? cboAreaId : areaId;
                    d.cellId          = ( cboCellId > 0 ) ? cboCellId: cellId;
                    d.typeMeetingCode = $("#cbo-type-meeting").select2("val");
                    d.startDate       = formatStrDate($("#txt-start-date").val(), 'dd/mm/yyyy', "/");
                    d.endDate         = formatStrDate($("#txt-end-date").val(), 'dd/mm/yyyy', "/");
                    d.userId          = $("#txt-user").attr("data-userid");
                    d.description     = $("#txt-description").val() != "" ? $("#txt-description").val() : "0";
                }*/ //ANTES
            },
            "type"   : "POST",
            "url": 'getMeetingByArgs',
            "url": 'getMeetingByArgs',
            "async"  : true, 
            complete: function() {
                $("#datatable-meeting_wrapper").show();
            }
        },
        "aoColumns": [
            //21/8
            //{"data":"RowNumber", "title": "N°","sClass": "text-center-vh", "sWidth": "1%"}, //ANTES
            //{"data":"MeetingId", "title": "ID","sClass": "text-center-vh", "sWidth": "1%"}, //ANTES
            {"data": "MeetingCode", "title": "Cod. Reunión","sClass": "text-center-vh", "sWidth": "10%"},
            { "data": "TypeMeetingDescription", "title": "Tipo de reunión", "sClass": "text-center-vh", "sWidth": "15%" },
            {"data": "MeetingSubject", "title": "Nombre de reunión", "sClass": "text-center-vh", "sWidth": "20%" },           
            { "data": "MeetingDate", "title": "Fecha", "sClass": "text-center-vh", "sWidth": "7%" },
            { "data": "RegisteredByUserName", "title": "Creado por","sClass": "text-center-vh", "sWidth": "15%"},            
            {"data":"AreaName", "title": "Área","sClass": "text-center-vh", "sWidth": "1%"},
            //{ "data": "MeetingSubject", "title": "Asunto", "sClass": "text-center-vh", "sWidth": "20%" }, //ANTES
            //{"data":"MeetingLocation", "title": "Lugar","sClass": "text-center-vh", "sWidth": "20%"}, //ANTES
            //{"data":"CellName", "title": "Célula","sClass": "text-center-vh", "sWidth": "1%"}, //ANTES
            //{"data":"MeetingStartTime", "title": "Hora Inicio","sClass": "text-center-vh", "sWidth": "1%"}, //ANTES
            //{"data":"MeetingEndTime", "title": "Hora Fin","sClass": "text-center-vh", "sWidth": "1%"}, //ANTES
            {"data":null, "title": "Opciones","sClass": "text-center-vh","sWidth": "12%",
                "mRender": function (data, type, full) {
                    var userRole = Number(localStorage.getItem("UserRole"));
                    var loggedUserId = localStorage.getItem("UserId");
                    var isCreator = String(data["RegisteredByUserId"]) === String(loggedUserId);

                    var html = '';
                    // Botón ver (siempre)
                    html += '<a href="javascript:void(0);" class="a-view a-view-meeting" data-MeetingCode="' + data["MeetingCode"] + '"><i class="material-icons">find_in_page</i></a>';
                    // Botón editar: admin, creador o asistente
                    if (userRole === 1 || userRole === 2 || isCreator || userRole === 0) {
                        html += '<a href="javascript:void(0);" class="a-edit a-edit-meeting" data-MeetingCode="' + data["MeetingCode"] + '"><i class="material-icons">mode_edit</i></a>';
                    }
                    // Botón eliminar: solo admin o creador
                    if (userRole === 1 || userRole === 2 || isCreator) {
                        html += '<a href="javascript:void(0);" class="a-delete a-delete-meeting" data-MeetingCode="' + data["MeetingCode"] + '"><i class="material-icons">delete_forever</i></a>';
                    }
                    // Botón anexos (siempre)
                    // En el mRender de la columna Opciones:
                    //html += '<a href="javascript:void(0);" style="color:#e421f0;" class="a-attach-meeting" data-meetingcode="' + data["MeetingCode"] + '"><i class="material-icons">attach_file</i></a>';
                    html += '<a href="javascript:void(0);" style="color:#e421f0;" class="a-attach-meeting" data-meetingcode="' + data["MeetingCode"] + '" data-meetingcreator="' + data["RegisteredByUserId"] + '"><i class="material-icons">attach_file</i></a>';
                    return '<div class="buttons-preview">' + html + '</div>';
                } //@AMENDEZ5
                /*"mRender": function(data, type, full) {
                    var btnDelete =  UserRole == 1 ? '<a href="javascript:void(0);" class="a-delete a-delete-meeting" '
                    +'data-MeetingCode="'+ data["MeetingCode"]+'"><i class="material-icons">delete_forever</i></a>' : '';
                    return '<div class="buttons-preview">'
                    +'<a href="javascript:void(0);" class="a-view a-view-meeting" data-MeetingCode="'+ data["MeetingCode"]+'"><i class="material-icons">find_in_page</i></a>'
                    +'<a href="javascript:void(0);" class="a-edit a-edit-meeting" data-MeetingCode="'+ data["MeetingCode"]+'"><i class="material-icons">mode_edit</i></a>'
                    +'<a href="javascript:void(0);" style="color:#e421f0;" class="a-attach-meeting" data-meetingcode="'+ data["MeetingCode"]+'"><i class="material-icons">attach_file</i></a>'
                    + btnDelete                    
                    +'</div>';
                }*/ //ANTES
            }
        ],
        "fnRowCallback": function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {            
            // Aplica negro a todas las celdas excepto la última (opciones)
            $(nRow).find('td:not(:last-child)').addClass('black-text'); // @AMENDEZ5

            $('.a-view-meeting', nRow).tooltip({ delay: 50, tooltip: "Ver detalle", position: "top" });
            $('.a-edit-meeting', nRow).tooltip({delay: 50, tooltip: "Editar", position: "top"});
            $('.a-attach-meeting', nRow).tooltip({delay: 50, tooltip: "Anexos", position: "top"});
            $('.a-delete-meeting', nRow).tooltip({delay: 50, tooltip: "Eliminar", position: "top"});
        }
    });
}
/*================================================================================================================================================================================*/
function filterMeeting() {
    isInitialLoad = false;
    $("#datatable-meeting_wrapper").hide();
    /*$('.div-progress-bar').html('<div style="padding:50px;"><div class="preloader-wrapper big active">'
    +'<div class="spinner-layer spinner-blue-only">'
    +'<div class="circle-clipper left"> <div class="circle"></div> </div>'
    +'<div class="gap-patch"> <div class="circle"></div> </div>'
    +'<div class="circle-clipper right"> <div class="circle"></div></div>'
    +'</div></div></div>');*/ //ANTES

    datatable.ajax.reload();
}
/*================================================================================================================================================================================*/
function getMeetingByArgsExportToExcel() {
    // Antes de hacer la exportación, obtenemos los mismos datos que se están mostrando
    var scope = $("#ddl-meeting-scope").val();
    var loggedUserId = localStorage.getItem("UserId") || "0";
    var meetingId = "0";
    var areaId = "0";
    var cellId = "0";
    var typeMeetingCode = "0";
    var startDate = "1900-01-01";
    var endDate = "2100-12-31";
    var userId = "0";
    var description = "0"; // Valor por defecto para descripción
    var meetingCode = "0"; // Usamos "0" como valor por defecto para meetingCode
    var mineScope = false;

    // Configurar los parámetros según el scope seleccionado
    if (scope === "mine") {
        userId = loggedUserId;
        mineScope = true;
        // Agregar filtro por creador
        var selectedUserId = $("#txt-user").attr("data-userid");
        var creatorUserId = (selectedUserId && selectedUserId !== "0") ? selectedUserId : "0";
    } else {
        var selectedUserId = $("#txt-user").attr("data-userid");
        userId = (selectedUserId && selectedUserId !== "0") ? selectedUserId : "0";
        mineScope = false;
        var creatorUserId = "0";
    }

    // Código de reunión - asegurarse de que nunca sea undefined o vacío
    var codReunion = $("#txt-cod-reunion").val();
    meetingCode = (codReunion && codReunion !== "") ? codReunion : "0";

    // Determinar si estamos en carga inicial, búsqueda por ID o filtros avanzados
    if (isInitialLoad) {
        // En carga inicial, usar solo el scope
        meetingId = "0";
        areaId = "0";
        cellId = "0";
        typeMeetingCode = "0";
        startDate = "1900-01-01";
        endDate = "2100-12-31";
        description = "0";
    } else if ($("#chck-type-search").is(':checked')) {
        // Búsqueda por ID
        meetingId = $("#txt-meeting-id").val() || "0";
        areaId = "0";
        cellId = "0";
        typeMeetingCode = "0";
        startDate = "1900-01-01";
        endDate = "1900-01-01";
        description = "0";
    } else {
        // Filtros avanzados
        meetingId = "0";
        areaId = $("#cbo-area").val() || "0";
        cellId = $("#cbo-cell").val() || "0";
        typeMeetingCode = $("#cbo-type-meeting").val() || "0";

        var startDateValue = $("#txt-start-date").val();
        startDate = startDateValue ? formatStrDate(startDateValue, 'dd/mm/yyyy', "/") : "1900-01-01";

        var endDateValue = $("#txt-end-date").val();
        endDate = endDateValue ? formatStrDate(endDateValue, 'dd/mm/yyyy', "/") : "2100-12-31";

        description = $("#txt-description").val() || "0";
    }

    // Realizar la exportación verificando primero si hay datos
    $.ajax({
        type: "POST",
        url: "getMeetingByArgs",
        data: JSON.stringify({
            meetingId: meetingId,
            areaId: areaId,
            cellId: cellId,
            typeMeetingCode: typeMeetingCode,
            startDate: startDate,
            endDate: endDate,
            userId: userId,
            meetingDescription: description,
            mineScope: mineScope,
            meetingCode: meetingCode,
            creatorUserId: creatorUserId // @AMENDEZ5 4/08
        }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            var jsonData = JSON.parse(response);

            if (jsonData.Meeting && jsonData.Meeting.length > 0) {
                // Construir URL con los mismos parámetros para exportar
                var url = "getMeetingByArgsExportToExcel/";
                url += meetingId + "/";
                url += areaId + "/";
                url += cellId + "/";
                url += typeMeetingCode + "/";
                url += startDate + "/";
                url += endDate + "/";
                url += userId + "/";
                url += description + "/";
                url += meetingCode + "/";
                url += mineScope.toString() + "/"; // @AMENDEZ5 4/08
                url += creatorUserId; // @AMENDEZ5 4/08

                showAlertMessage($(".div-alert-message"), "light-green", "insert_drive_file", "Éxito:", "Se exportó satisfactoriamente", 5000);
                window.location.href = url;
            } else {
                showAlertMessage($(".div-alert-message"), "yellow darken-3", "insert_drive_file", "Advertencia:", "No se ha encontrado información, no se pudo exportar", 5000);
            }
        },
        error: function () {
            showAlertMessage($(".div-alert-message"), "red", "error", "Error:", "Ocurrió un error al intentar exportar", 5000);
        }
    });
}

/*function getMeetingByArgsExportToExcel() {
    datatable.ajax.reload(function () {
        var count = datatable.data().count();
        if (count > 0) {
            var meetingId = $("#txt-meeting-id").val() === "" ? "0" : $("#txt-meeting-id").val();
            var areaId, cellId, typeMeetingCode, startDate, endDate, userId, description;

            if ($("#chck-type-search").is(':checked')) {
                areaId = "0";
                cellId = "0";
                typeMeetingCode = "0";
                startDate = "1900-01-01";
                endDate = "1900-01-01";
                userId = "0";
                description = "0";
            } else {
                areaId = $("#cbo-area").val();
                cellId = $("#cbo-cell").val() || "0";
                typeMeetingCode = $("#cbo-type-meeting").val();
                startDate = $("#txt-start-date").val() ? formatStrDate($("#txt-start-date").val(), 'dd/mm/yyyy', "/") : "1900-01-01";
                endDate = $("#txt-end-date").val() ? formatStrDate($("#txt-end-date").val(), 'dd/mm/yyyy', "/") : "2100-12-31";
                userId = $("#txt-user").attr("data-userid") || "0";
                description = $("#txt-description").val() !== "" ? $("#txt-description").val() : "0";
            }

            showAlertMessage($(".div-alert-message"), "light-green", "insert_drive_file", "Éxito :", "Se exportó satisfactoriamente", 5000);

            window.location.href = "getMeetingByArgsExportToExcel/"
                + meetingId + "/" + areaId + "/" + cellId + "/" + typeMeetingCode + "/"
                + startDate + "/" + endDate + "/" + userId + "/" + description;
        } else {
            showAlertMessage($(".div-alert-message"), "yellow darken-3", "insert_drive_file", "Advertencia :", "No se ha encontrado información, no se pudo exportar", 5000);
        }
    });
}*/
/*function getMeetingByArgsExportToExcel() {
    datatable.ajax.reload(function() {
        var count = datatable.data().count();
        if(count > 0) { 
            var meetingId       = $("#txt-meeting-id").val() == "" ? "0" : $("#txt-meeting-id").val();
            if($("#chck-type-search").is(':checked')) {       
                var areaId          = "0";
                var cellId          = "0";
                var typeMeetingCode = "0";
                var startDate       = "1900-01-01";
                var endDate         = "1900-01-01";
                var userId          = "0";
                var description     = "0";
            }
            else {
                var areaId = $("#cbo-area").val();
                //var cellId = $("#cbo-cell").val();
                //var areaId = $("#cbo-area").select2("val"); //ANTES
                //var cellId = $("#cbo-cell").select2("val"); //ANTES
                //var typeMeetingCode = $("#cbo-type-meeting").select2("val"); //ANTES
                var typeMeetingCode = $("#cbo-type-meeting").val();

                var startDate       = formatStrDate($("#txt-start-date").val(), 'dd/mm/yyyy', "/");
                var endDate         = formatStrDate($("#txt-end-date").val(), 'dd/mm/yyyy', "/");
                var userId          = $("#txt-user").attr("data-userid");
                var description     = $("#txt-description").val() != "" ? $("#txt-description").val() : "0";
            }
            showAlertMessage($(".div-alert-message"), "light-green", "insert_drive_file", "Éxito :", "Se exportó satisfactoriamente", 5000);

            window.location.href = "getMeetingByArgsExportToExcel/" + meetingId + "/" + areaId + "/" + cellId + "/" + typeMeetingCode + "/"
            + startDate + "/" + endDate + "/" + userId + "/" + description;
        }
        else {
            showAlertMessage($(".div-alert-message"), "yellow darken-3", "insert_drive_file", "Advertencia :", "No se ha encontrado información, no se pudo exportar", 5000);
        }       
    }); 
}*/ //ANTES
/*================================================================================================================================================================================*/
function viewMeeting() {
    var meetingCode = window.btoa($(this).attr("data-MeetingCode"));
    window.open('MeetingDetail/' + meetingCode, '_blank');
}
/*================================================================================================================================================================================*/
function editMeeting() {
    var meetingCode = window.btoa($(this).attr("data-MeetingCode"));
    window.location.href="MeetingEdit/" + meetingCode; //@AMENDEZ5
    // window.open('MeetingEdit/' + meetingCode, '_blank'); //ANTES
}
/*================================================================================================================================================================================*/
function showModalDeleteMeeting() {
    var meetingCode = window.btoa($(this).attr("data-MeetingCode"));
    $('.div-modal').load('Home/Modal',
        { 
            ModalId:        "modal-confirmation",
            ModalClass:     "modal-message modal-info2",
            ModalHeader:    '<span><i class="blue-dark-text material-icons">help_outline</i><label>CONFIRMACIÓN</label></span>',
            ModalTitle:     " ",
            ModalBody:      "¿Desea eliminar esta acta de reunión?", 
            ModalButtonOk:  '<button type="button" id="btn-modal-aceppt" class="modal-action waves-effect btn-flat blue white-text">Aceptar</button>'
        },
        function() {
           $('#modal-confirmation').modal({dismissible: false}).modal('open')
           .one('click', '#btn-modal-aceppt', function (e) {
                deleteMeeting(meetingCode);
            });
        }
    );
}
/*================================================================================================================================================================================*/
function deleteMeeting(meetingCode) {
    var data             = {};
    data.meetingCode     = meetingCode;
    data.deletedByUserId = localStorage.getItem("UserId");
    $.ajax({
        type        : "POST",
        url         : "deleteMeeting",
        data        : JSON.stringify(data),
        dataType    : 'json',
        contentType : 'application/json; charset=utf-8',
        async       : true,
        success     : function (response) {
            notificationsActionPlan();
            $('#modal-confirmation').modal('close');
            datatable.ajax.reload();
            showAlertMessage($(".div-alert-message"), "light-green", "delete", "Éxito :", "Se eliminó satisfactoriamente", 5000);
        },
        error: function(response) {
        }
    });
}
/*================================================================================================================================================================================*/
function showModalAttachMeeting() {
    var meetingCode = $(this).attr("data-meetingcode");
    var meetingCreatorId = $(this).attr("data-meetingcreator");

    var body = '<div class="card">'
        + '<div class="card-content" style="overflow-y: auto;height: 300px;position:relative;">'
        + '<div class="div-alert-message"></div>'
        + '<div class="div-question-delete"></div>'
        // Botón flotante para agregar anexo
        + '<div style="text-align:right; margin-bottom:10px;">'
        + '<a id="btn-show-form-add-attach-file" class="btn-floating waves-effect waves-light blue" title="Agregar anexo">'
        + '<i class="material-icons">add</i>'
        + '</a>'
        + '</div>'
        + '<div class="div-attach-files row"></div>'
        + '</div>'
        + '</div>';

    $('.div-modal').load('Home/Modal',
        {
            ModalId: "modal-confirmation",
            ModalClass: "modal modal-info2",
            ModalHeader: '<span style="padding-bottom: 65px;"><i class="blue-dark-text material-icons">attach_file</i><label style="margin-left: 8px;">ANEXOS</label></span>',
            ModalTitle: "",
            ModalBody: body,
            ModalButtonOk: ''
        },
        function () {
            $(".modal-overlay").css({
                "opacity": "0.8",
                "background-color": "#000",
                "z-index": "1003"
            });

            $("#modal-confirmation").css({
                "z-index": "1004",
                "background-color": "white",
                "opacity": "1"
            });

            $(".modal-close").text("Cerrar");
            $(".modal-content").css("padding", "0px");
            $(".card").css("box-shadow", "0 0 0 0");

            $(".modal-header").css({
                "padding-bottom": "35px"
            });

            $("#modal-confirmation").attr("data-current-meeting", meetingCode);

            $('#modal-confirmation').modal({ dismissible: false }).modal("open");
            getAttachFileByMeetingCode(meetingCode, meetingCreatorId);
        });
}
 //@AMENDEZ5
/*function showModalAttachMeeting() {
    var meetingCode = $(this).attr("data-meetingcode");
    var meetingCreatorId = $(this).attr("data-meetingcreator");

    var body = '<div class="card">'
        + '<div class="card-content" style="overflow-y: auto;height: 350px;">'
        + '<div class="div-alert-message"></div>'
        + '<div class="div-question-delete"></div>'
        // Botón flotante para agregar anexo
        + '<div style="text-align:right; margin-bottom:10px;">'
        + '<a id="btn-show-form-add-attach-file" class="btn-floating waves-effect waves-light blue" title="Agregar anexo">'
        + '<i class="material-icons">add</i>'
        + '</a>'
        + '</div>'
        + '<div class="div-attach-files row"></div>'
        + '</div>'
        + '<div class="card-reveal" style="display: none; transform: translateY(0px);">'
        + '<span class="card-title grey-text text-darken-4 hide-form">'
        + '<span class="title-user">Agregar Anexo</span>'
        + '<i class="material-icons right">close</i>'
        + '</span>'
        + '<div class="divider mt-1"></div><div class="dam-add-attach-file"></div>'
        + '<div class="div-attach-preview row" style="margin-top:10px;"></div>' 
        + '<div class="row" style="padding-top: 20px;">'
        + '<div class="col s12 m6 l6">'
        + '<div class="input-field">'
        + '<i class="material-icons prefix">title</i>'
        + '<textarea class="materialize-textarea textarea-material-normal txt-attach-file-title"></textarea>'
        + '<label>Título del anexo</label>'
        + '</div>'
        + '</div>'
        + '<div class="col s12 m6 l6">'
        + '<input type="file" accept="*" class="file-meeting-attached" data-allowed-file-extensions="xlsx xls docx pptx pdf rar zip 7zip dwg" data-max-file-size="10M"/>'
        + '</div>'
        + '<div class="col s12" style="padding-top:30px;">'
        + '<div class="right">'
        + '<button type="button" id="btn-insert-attach-file" data-meetingcode="' + meetingCode + '" class="waves-effect btn-flat blue white-text">'
        + '<i class="material-icons left" style="margin-right: 5px;">save</i> Guardar</button>'
        + '</div>'
        + '</div>'
        + '</div>'
        + '</div>'
        + '</div>';

    $('.div-modal').load('Home/Modal',
        {
            ModalId: "modal-confirmation",
            ModalClass: "modal modal-info2",
            ModalHeader: '<span style="padding-bottom: 65px;"><i class="blue-dark-text material-icons">attach_file</i><label style="margin-left: 8px;">ANEXOS</label></span>',
            ModalTitle: "",
            ModalBody: body,
            ModalButtonOk: ''
        },
        function () {
            $(".modal-close").text("Cerrar");
            $(".modal-content").css("padding", "0px");
            $(".card").css("box-shadow", "0 0 0 0");

            $(".modal-header").css({
                "padding-bottom": "35px"
            });

            // Pasa el creatorId como parámetro
            $('#modal-confirmation').modal({ dismissible: false }).modal("open");
            getAttachFileByMeetingCode(meetingCode, meetingCreatorId);
        });
}*/ //ANTES
/*================================================================================================================================================================================*/
function getAttachFileByMeetingCode(meetingCode, meetingCreatorId) {

    var UserRole = parseInt(localStorage.getItem("UserRole"));
    var loggedUserId = localStorage.getItem("UserId");
    var data = {};
    data.meetingCode = meetingCode;

    $("#modal-confirmation").attr("data-current-meeting", meetingCode);

    return $.ajax({
        type: "POST",
        url: "getAttachFileByMeetingCode",
        data: JSON.stringify(data),
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        async: true,
        beforeSend: function () {
            $(".div-attach-files").empty();
        },
        success: function (response) {
            var responseJson = $.parseJSON(response);

            if (responseJson.AttachFile && responseJson.AttachFile.length > 0) {
                var filteredAttachFiles = responseJson.AttachFile.filter(function (item) {
                    return item.MeetingCode === meetingCode;
                });


                if (filteredAttachFiles.length > 0) {
                    $.each(filteredAttachFiles, function (index, item) {
                        var iconfile = getIconfile(item.AttachFileExtension);
                        var size = (item.AttachFileExtension === ".pdf") ? "width:40px;height:50px;" : "width:50px;height:50px;";
                        var isCreator = meetingCreatorId && String(meetingCreatorId) === String(loggedUserId);
                        var isUploader = item.RegisteredByUserId && String(item.RegisteredByUserId) === String(loggedUserId);
                        var canDelete = (UserRole === 1 || UserRole === 2 || isCreator || isUploader);

                        var buttonDelete = canDelete
                            ? '<a href="javascript:void(0);" class="a-delete-attach-file" data-attachfilecode="' + item.AttachFileCode + '" '
                            + 'data-attachfiletitle="' + item.AttachFileTitle + '" data-attachfileext="' + item.AttachFileExtension + '" data-meetingcode="' + meetingCode + '" title="Eliminar" style="padding-left:5px;">'
                            + '<i class="material-icons red-text" style="font-size:24px;">delete_forever</i>'
                            + '</a>'
                            : '';

                        var divFile = '<div class="col s3 row">'
                            + '<div style="padding:5px;border:1px #cabebe solid;border-radius:15px;height:150px;display:flex;flex-direction:column;align-items:center;justify-content:space-between;">'
                            + '<div style="width:100%;text-align:right;">'
                            + '<a href="' + item.AttachFilePath + '"  title="' + item.AttachFileTitle + '" target="_blank">'
                            + '<img class="responsive-img" style="width:25px;height:25px;" src="' + baseUrl + '/Content/MeetingRecordAppWeb/img/ic_download_file.svg">'
                            + '</a>'
                            + buttonDelete
                            + '</div>'
                            + '<div class="text-center-vh" style="flex:1;display:flex;align-items:center;justify-content:center;width:100%;">'
                            + '<img class="responsive-img" style="' + size + 'max-height:90px;" src="' + iconfile + '" title="' + item.AttachFileTitle + '">'
                            + '</div>'
                            + '<div class="text-center-vh" style="font-size:12px;font-weight:bold;color:#333;margin-top:5px;width:100%;word-break:break-all;white-space:normal;text-align:center;max-width:100%;overflow-wrap:break-word;">'
                            + item.AttachFileName
                            + '</div>'
                            + '</div>'
                            + '</div>';

                        $(".div-attach-files").append(divFile);
                    });
                } else {
                    $(".div-attach-files").html('<div style="text-align:center;font-size:14px;">No se encontraron anexos en esta reunión</div>');
                }
            }
            else {
                $(".div-attach-files").html('<div style="text-align:center;font-size:14px;">No se encontraron anexos en esta reunión</div>');
            }
        },
        error: function (response) {
            $(".div-attach-files").html('<div style="text-align:center;font-size:14px;">Ocurrió un error al cargar los anexos</div>');
        }
    });
}

/*================================================================================================================================================================================*/
/*function insertAttachFile() {
    var meetingCode = $("#btn-insert-attach-file").attr("data-meetingcode");
    var files = $("#file-meeting-attached-list").get(0).files;
    if (files.length > 0) {
        var requests = [];
        for (var i = 0; i < files.length; i++) {
            var data = new FormData();
            data.append("AttachFileCode", getGeneratedCode("ATF"));
            data.append("MeetingCode", meetingCode);
            data.append("AttachFileTitle", ""); // No se envía título
            data.append("AttachFileBase", files[i]);
            var request = $.ajax({
                type: "POST",
                url: "insertAttachFile",
                processData: false,
                contentType: false,
                data: data,
                async: true
            });
            requests.push(request);
        }
        $.when.apply($, requests).done(function () {
            getAttachFileByMeetingCode(meetingCode);
            $(".hide-form").trigger("click");
            showAlertMessage($(".div-alert-message"), "light-green", "check", "Éxito :", "Se agregó(n) satisfactoriamente", 5000);
        });
    } else {
        showAlertMessage($(".dam-add-attach-file"), "orange", "warning", " Advertencia: ", "Selecciona al menos un archivo", 3000);
    }
    return notificationsActionPlan();
}*/ //ANTES
/*================================================================================================================================================================================*/
function showModalDeleteAttachFile() {
    var meetingCode     = $(this).attr("data-meetingcode");
    var attachFileCode  = $(this).attr("data-attachfilecode");
    var attachFileTitle = $(this).attr("data-attachfiletitle");
    var attachFileExtension = $(this).attr("data-attachfileext");

    $(".div-question-delete").html('<div id="card-alert" class="card red lighten-5">'
    +'<div class="card-content red-text">'
    +'<p><i class="material-icons">help_outline</i> ¿Desea eliminar <b> ' + attachFileTitle + ' </b> ? </p>'
    +'</div>'
    +'<button type="button" id="btn-delete-attach-file" class="red-text" style="padding-right:35px;" '
    +'data-attachfilecode="' + attachFileCode + '" data-attachfileext="' + attachFileExtension + '" data-meetingcode="' + meetingCode +'">'
    +'<span aria-hidden="true" style="font-size:14px;">&#x2714;</span>'
    +'</button>'
    +'<button type="button" class="close red-text" aria-label="Close">'
    +'<span aria-hidden="true">×</span>'
    +'</button>'
    +'</div>');

    $('.card-content').animate({scrollTop: $('.card-content').prop("scrollHeight") - 100 }, 2000);
}
/*================================================================================================================================================================================*/
function deleteAttachFile() {
    var data                 = {};
    data.meetingCode         = $(this).attr("data-meetingcode");
    data.attachFileCode      = $(this).attr("data-attachfilecode");
    data.attachFileExtension = $(this).attr("data-attachfileext");
    $.ajax({
        type        : "POST",
        url         : "deleteAttachFile",
        data        : JSON.stringify(data),
        dataType    : 'json',
        contentType : 'application/json; charset=utf-8',
        async       : true,
        success     : function (response) {            
            var ajax = getAttachFileByMeetingCode(data.meetingCode);
            ajax.done(function(response) {
                $(".div-question-delete").empty();
                showAlertMessage($(".div-alert-message"), "light-green", "delete", "Éxito :", "Se eliminó satisfactoriamente", 5000);
            });
        },
        error: function(response) {
        }
    });
}
/*================================================================================================================================================================================*/
function showFormAddAttachFile() {

    $(".div-question-delete").empty();
    $(".div-new-file-upload").remove();
    $("#modal-footer-custom").remove();

    $("#file-meeting-attached-list").remove();

    var $fileInput = $('<input id="file-meeting-attached-list" type="file" multiple accept=".png,.jpg,.jpeg,.xlsx,.xls,.docx,.pptx,.pdf,.rar,.zip,.7z,.dwg" style="display:none;">');
    $("body").append($fileInput);

    $fileInput.trigger("click");

    $fileInput.on("change", function () {
        var files = this.files;

        if (files && files.length > 0) {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];

                var extension = file.name.split('.').pop().toLowerCase();
                var icon = getIconfile('.' + extension);
                var size = (extension === "pdf") ? "width:40px;height:50px;" : "width:50px;height:50px;";

                var divFile = '<div class="col s3 row new-attach-file">' +
                    '<div style="padding:5px;border:1px #4285f4 solid;border-radius:15px;height:150px;display:flex;flex-direction:column;align-items:center;justify-content:space-between;">' +
                    '<div style="width:100%;text-align:right;">' +
                    '<span class="new-file-badge blue white-text" style="padding:2px 8px;border-radius:10px;font-size:10px;">Nuevo</span>' +
                    '<a href="javascript:void(0);" class="remove-new-file" style="padding-left:5px;"><i class="material-icons red-text" style="font-size:24px;">delete_forever</i></a>' +
                    '</div>' +
                    '<div class="text-center-vh" style="flex:1;display:flex;align-items:center;justify-content:center;width:100%;">' +
                    '<img class="responsive-img" style="' + size + 'max-height:90px;" src="' + icon + '" title="' + file.name + '">' +
                    '</div>' +
                    '<div class="text-center-vh" style="font-size:12px;font-weight:bold;color:#333;margin-top:5px;width:100%;word-break:break-all;white-space:normal;text-align:center;max-width:100%;overflow-wrap:break-word;">' +
                    file.name +
                    '</div>' +
                    '</div>' +
                    '</div>';

                $(".div-attach-files").append(divFile);
            }

            var meetingCode = $("#modal-confirmation").attr("data-current-meeting");

            var actionButtons = '<div id="modal-footer-custom" class="modal-footer" style="text-align:right; border-top:1px solid #ddd; padding-top:4px; padding-right:120px; background-color:#fff;">' +
                '<button type="button" id="btn-insert-attach-file" data-meetingcode="' + meetingCode +
                '" class="waves-effect btn-flat blue white-text"><i class="material-icons left" style="margin-right:5px;">save</i>Guardar</button>' +
                '</div>';

            $("#modal-confirmation").append(actionButtons);

            $(document).off("click", ".remove-new-file").on("click", ".remove-new-file", function () {
                $(this).closest(".new-attach-file").remove();

                if ($(".new-attach-file").length === 0) {
                    $("#modal-footer-custom").remove();
                }
            });
        }
    });
}
/*================================================================================================================================================================================*/
function insertAttachFile() {
    var meetingCode = $(this).attr("data-meetingcode");

    var fileInputElement = $("#file-meeting-attached-list")[0];

    if (!fileInputElement) {
        showAlertMessage($(".div-alert-message"), "orange", "warning", "Advertencia:", "No se encontró el selector de archivos", 3000);
        return;
    }

    var allFiles = fileInputElement.files;

    var newFiles = [];

    $(".new-attach-file").each(function () {
        var fileName = $(this).find(".text-center-vh:last").text().trim();

        for (var i = 0; i < allFiles.length; i++) {
            if (allFiles[i].name === fileName) {
                newFiles.push(allFiles[i]);
                break;
            }
        }
    });


    if (newFiles.length > 0) {
        var $loadingIndicator = $('<div class="progress blue lighten-4"><div class="indeterminate blue"></div></div>');
        $("#modal-footer-custom").prepend($loadingIndicator);
        $("#btn-insert-attach-file").prop("disabled", true);

        var requests = [];
        for (var i = 0; i < newFiles.length; i++) {
            var data = new FormData();
            data.append("AttachFileCode", getGeneratedCode("ATF"));
            data.append("MeetingCode", meetingCode);
            data.append("AttachFileTitle", "");
            data.append("AttachFileBase", newFiles[i]);


            var request = $.ajax({
                type: "POST",
                url: "insertAttachFile",
                processData: false,
                contentType: false,
                data: data,
                async: true
            });
            requests.push(request);
        }

        $.when.apply($, requests)
            .done(function () {
                getAttachFileByMeetingCode(meetingCode);
                $(".new-attach-file").remove();
                $loadingIndicator.remove();
                $("#btn-insert-attach-file").prop("disabled", false);
                $("#modal-footer-custom").remove();
                showAlertMessage($(".div-alert-message"), "light-green", "check", "Éxito:", "Se agregaron los archivos satisfactoriamente", 5000);
            })
            .fail(function (error) {
                $loadingIndicator.remove();
                $("#btn-insert-attach-file").prop("disabled", false);
                showAlertMessage($(".div-alert-message"), "red", "error", "Error:", "No se pudieron cargar algunos archivos", 5000);
            });
    } else {
        showAlertMessage($(".div-alert-message"), "orange", "warning", "Advertencia:", "No hay archivos para guardar", 3000);
    }

    return notificationsActionPlan();
}
 //@AMENDEZ5
/*================================================================================================================================================================================*/

// Función para previsualizar los archivos seleccionados
function previewSelectedFiles(files) {
    var $preview = $(".div-new-attach-preview");
    $preview.empty();

    if (files.length > 0) {
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            var extension = file.name.split('.').pop().toLowerCase();
            var icon = getIconfile('.' + extension);
            var size = (extension === "pdf") ? "width:40px;height:50px;" : "width:50px;height:50px;";

            var divFile = '<div class="col s3 row">' +
                '<div style="padding:5px;border:1px #cabebe solid;border-radius:15px;height:150px;display:flex;flex-direction:column;align-items:center;justify-content:space-between;">' +
                '<div style="width:100%;text-align:right;">' +
                '<span class="new-file-badge blue white-text" style="padding:2px 8px;border-radius:10px;font-size:10px;">Nuevo</span>' +
                '</div>' +
                '<div class="text-center-vh" style="flex:1;display:flex;align-items:center;justify-content:center;width:100%;">' +
                '<img class="responsive-img" style="' + size + 'max-height:90px;" src="' + icon + '" title="' + file.name + '">' +
                '</div>' +
                '<div class="text-center-vh" style="font-size:12px;font-weight:bold;color:#333;margin-top:5px;width:100%;word-break:break-all;white-space:normal;text-align:center;max-width:100%;overflow-wrap:break-word;">' +
                file.name +
                '</div>' +
                '</div>' +
                '</div>';

            $preview.append(divFile);
        }
    }
} //@AMENDEZ5
/*================================================================================================================================================================================*/
