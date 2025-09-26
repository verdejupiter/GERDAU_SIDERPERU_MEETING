/*================================================================================================================================================================================*/
/**
 * @fileOverview    Script Home
 * @author          ANGELY YAHAYRA MENDEZ CRUZ
 * @version         1.1.0
 * @updatedAt       26/07/2025
*/
/*================================================================================================================================================================================*/
// Variables globales
var datatableMeeting;
var datatableActionPlanPending;
var pickadateExecute;
/*================================================================================================================================================================================*/
/**
 * Inicializa jquery eventos y funciones
 */
$(document).ready(function() {
    // Verificar si la sesión ah expirado
    checkSessionExpired();

	//initFormSelect2();
    //initPickaDate(); 
    //datatableMeeting = getMeetingByArgs(); ANTES
    /*setTimeout(function () {
        datatableMeeting = getMeetingByArgs();
    }, 300);*/
    /*initAutocompleteUser("#txt-user", null);
    $(".btn-filter-meeting").on("click", filterMeeting);
    $(document).on("click", ".a-view-meeting", viewMeeting);
	$("#btn-search-meeting").on("click", showMoreOptionsFilter);
    
    validateExecuteActionPlan();*/
    datatableActionPlanPending = getActionPlanByUserId();
	$("#btn-add-file").on("click", addFile);
	$(document).on("click", ".btn-delete-file", deleteFile);
    $(document).on("click", ".a-execute-ac", showFormExecuteActionPlan);
    $("#btn-execute-action-plan").on("click", showModalExecuteActionPlan);
    $("#btn-add-file").tooltip({delay: 50, tooltip: "Agregar archivo", position: "right"});
    pickadateExecute = initPickadate($("#txt-executedate-ap"), ".header");   
    $(document).on("click", ".a-view-action-plan", showModalViewActionPlanDetail);

    // Add event listener for opening and closing details
    /*$('#datatable-meeting tbody').on('click', 'td.details-control', addChildTable);

    $("#chck-type-search").on('click', selectTypeSearch);
    $("#txt-meeting-id").on("keypress", function(e) {return isNumber(e) });

    $(".btn-show-more-options").on("click", slideToggleMoreOptions);*/
});
/*================================================================================================================================================================================*/
/*function slideToggleMoreOptions() {
    $("#txt-description").val("").blur();
    $('.div-more-options').slideToggle(function() {
        if($(this).is(':visible')) {
            $(".btn-show-more-options").html('<i class="material-icons left" style="margin-right: 5px;">remove</i> Ocultar');                
        }
        else {
            $(".btn-show-more-options").html('<i class="material-icons left" style="margin-right: 5px;">add</i> Más opciones');
        }
    });
}*/
/*================================================================================================================================================================================*/
/*function selectTypeSearch() {
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
}*/
/*================================================================================================================================================================================*/
/*function addChildTable() {
    var tr = $(this).closest('tr');
    var row = datatableMeeting.row( tr );
    if ( row.child.isShown() ) {
        row.child.hide();
        tr.removeClass('shown');
    }
    else {
        row.child(tableChildActionPlan(row.data())).show();
        tr.addClass('shown');
        $('.a-view-action-plan').tooltip({delay: 50, tooltip: "Ver detalle", position: "top"});
    }
}*/
/*================================================================================================================================================================================*/
function showFormExecuteActionPlan() {
    $(".div-file-dropify").empty();
    $("#btn-add-file").trigger("click");
    $("#txt-executedesc-ap").val("");
    pickadateExecute.set('select', getCurrentDatetime(1), { format: 'dd/mm/yyyy' });
    setTimeout(function() {$("#txt-executedesc-ap").focus();}, 300);
    $("#btn-execute-action-plan").attr("data-ActionPlanCode", $(this).attr("data-ActionPlanCode"));
}
/*================================================================================================================================================================================*/
/*function showMoreOptionsFilter() {
    $('.div-filter-meeting, .div-table-meeting').slideToggle(function() {
        if($(this).is(':visible')) {
            $('.span-more-options').text('Ocultar Búsqueda');
            $('html, body').animate({scrollTop: $(".div-table-meeting").offset().top - 150 }, 'slow');
        }
        else {            
            $('.span-more-options').text('Búsqueda de reunión');            
        }
    });
}*/
/*================================================================================================================================================================================*/
/*function initPickaDate() {
    var pickaStartDate = initPickadate($("#txt-start-date"), ".container");
    pickaStartDate.set('select', getCurrentDatetime(1), { format: 'dd/mm/yyyy' });

    pickaStartDate.on({
        set: function(thingSet) {
            pickaEndDate.set('min', $("#txt-start-date").val(), { format: 'dd/mm/yyyy' });
            var date = getCurrentDatetime(1);
            if(date < $("#txt-start-date").val()) {
                pickaEndDate.set('select', $("#txt-start-date").val(), { format: 'dd/mm/yyyy' });
            }
        }
    });

    var pickaEndDate = initPickadate($("#txt-end-date"), ".container");
    pickaEndDate.set('select', getCurrentDatetime(1), { format: 'dd/mm/yyyy' });
    pickaEndDate.set('min', getCurrentDatetime(1), { format: 'dd/mm/yyyy' });
}*/
/*================================================================================================================================================================================*/
/*function initFormSelect2() {
    //getAllTypeMeetingForRegister(false); //@AMENDEZ5
    //getAllTypeMeeting(true); //ANTES
    /*getAllArea();
    //############################################# @AMENDEZ5
    //InitSelect2('#cbo-cell','Seleccione Célula...', null);
    //$("#cbo-cell").val(0).trigger("change");
    $(document).on('change','#cbo-area', function(e){
        var AreaId = parseInt($(this).val());
        //var AreaId = parseInt($(this).select2('val')); ANTES
        //############################################# @AMENDEZ5
        /*if(AreaId > 0) {
            $(".div-cell").html('<select id="cbo-cell" class="select-with-search pmd-select2 form-control"></select>');
        }
        getCellByAreaId(AreaId);
        $("#cbo-cell").val(0).trigger("change");
    });
    $("#cbo-area").val(areaId).trigger("change");

    //setTimeout(function () { $("#cbo-type-meeting").val(0).trigger("change"); }, 300);
//} */
/*================================================================================================================================================================================*/
/*function getMeetingByArgs() {
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
            "data": function(d) {
                d.meetingId       = $("#txt-meeting-id").val() == "" ? "0" : $("#txt-meeting-id").val();
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
                    d.areaId = $("#cbo-area").val();
                    //d.cellId = $("#cbo-cell").val(); //ANTES
                    d.typeMeetingCode = $("#cbo-type-meeting").val();
                    //d.areaId          = $("#cbo-area").select2("val"); //ANTES
                    //d.cellId          = $("#cbo-cell").select2("val"); //ANTES
                    //d.typeMeetingCode = $("#cbo-type-meeting").select2("val"); //ANTES
                    d.startDate       = formatStrDate($("#txt-start-date").val(), 'dd/mm/yyyy', "/");
                    d.endDate         = formatStrDate($("#txt-end-date").val(), 'dd/mm/yyyy', "/");
                    d.userId          = $("#txt-user").attr("data-userid");
                    d.description     = $("#txt-description").val() != "" ? $("#txt-description").val() : "0";
                }
            },
            "type"   : "POST",
            //"url": 'getMeetingByArgs', ANTES
            "url": '/Meeting/getMeetingByArgs',
            "async"  : true, 
            complete: function() {
               $("#datatable-meeting_wrapper").show();
               //$('.div-progress-bar').empty() //ANTES
            }           
        },
        "aoColumns": [
            {"data":null, "title": "","sClass": "details-control", "defaultContent": '',"sWidth": "1%"},
            {"data":"RowNumber", "title": "Cod. Reunión","sClass": "text-center-vh", "sWidth": "1%"},
            {"data":"TypeMeetingDescription", "title": "Tipo de reunión","sClass": "text-center-vh", "sWidth": "20%"},
            {"data":"MeetingId", "title": "ID","sClass": "text-center-vh", "sWidth": "1%"},
            {"data":"MeetingLocation", "title": "Lugar","sClass": "text-center-vh", "sWidth": "20%"},
            {"data":"AreaName", "title": "Área","sClass": "text-center-vh", "sWidth": "1%"},
            {"data":"CellName", "title": "Célula","sClass": "text-center-vh", "sWidth": "1%"},
            {"data":"MeetingDate", "title": "Fecha","sClass": "text-center-vh", "sWidth": "10%"},            
            {"data":"MeetingStartTime", "title": "Hora Inicio","sClass": "text-center-vh", "sWidth": "10%"},
            {"data":"MeetingEndTime", "title": "Hora Fin","sClass": "text-center-vh", "sWidth": "10%"},
            {"data":null, "title": "Opción","sClass": "text-center-vh","sWidth": "10%", 
                "mRender": function(data, type, full) {
                    return '<div class="buttons-preview">'
                    +'<a href="javascript:void(0);" class="a-view a-view-meeting" data-MeetingCode="'+ data["MeetingCode"]+'"><i class="material-icons">find_in_page</i></a>'
                    +'</div>';
                }
            }
        ],
        "fnRowCallback": function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
            $('.a-view-meeting', nRow).tooltip({delay: 50, tooltip: "Ver detalle", position: "top"});
            $('.a-view-ac-meeting', nRow).tooltip({delay: 50, tooltip: "Ver plan de acción", position: "top"});
        },
        "preDrawCallback": function( settings ) {
        }
    });
}*/
/*================================================================================================================================================================================*/
function getActionPlanByUserId() {
    return $("#datatable-action-plan-pending-user").DataTable({
        "bDestroy": true,
        "responsive": false, // Cambiar a false para evitar problemas de renderizado
        "scrollX": true,     // Agregar desplazamiento horizontal
        "autoWidth": false,  // Deshabilitar ajuste automático
        "bFilter": false,
        "paging": true,
        "ordering": false,
        "info": false,
        "bLengthChange": false,
        "iDisplayLength": 10,
        "language": { "url": "Content/library/datatable/language/Spanish.json" },
        "ajax": {
            "dataSrc": function (json) {
                if (typeof json === "string") {
                    try {
                        json = JSON.parse(json);
                    } catch (e) {
                        console.error("Error al parsear JSON:", e);
                    }
                }

                if (json && json.ActionPlan) {
                    return json.ActionPlan;
                } else if (json && Array.isArray(json)) {
                    return json;
                }

                return [];
            },
            "data": function (d) {
                var userId = localStorage.getItem("UserId");
                d.responsibleUserId = userId != null ? parseInt(userId) : 0;
            },
            "type": "POST",
            "url": baseUrl + '/ActionPlan/getActionPlanByUserId',
            "async": true,
            "error": function (xhr, status, error) {
                console.error("Error en llamada AJAX:", error);
            },
            "complete": function () {
                $("#datatable-action-plan-pending-user_wrapper").show();
                $('.div-progress-bar').empty();
            }
        },
        "aoColumns": [
            { "data": "MeetingCode", "title": "Cod. Reunión", "sClass": "text-center-vh", "sWidth": "10%" },
            { "data": "ActionPlanWhat", "title": "Acción", "sClass": "text-center-vh", "sWidth": "30%" },
            { "data": "ActionPlanScheduledDate", "title": "Fecha Programada", "sClass": "text-center-vh", "sWidth": "15%" },
            { "data": "ActionPlanCategoryName", "title": "Categoría", "sClass": "text-center-vh", "sWidth": "15%" },
            {
                "data": null, "title": "Prioridad", "sClass": "text-center-vh", "sWidth": "10%",
                "mRender": function (data, type, full) {
                    var colorClass = "";
                    var text = "";
                    switch (data.ActionPlanPriority) {
                        case "ALTA":
                            colorClass = "red";
                            text = "ALTA";
                            break;
                        case "MEDIA":
                            colorClass = "orange darken-1";
                            text = "MEDIA";
                            break;
                        case "BAJA":
                            colorClass = "green";
                            text = "BAJA";
                            break;
                        default:
                            colorClass = "grey";
                            text = data.ActionPlanPriority || "N/A";
                    }

                    var stylePrioridad = "font-size:12px;font-weight:bold;color:#fff;";
                    return '<div style="display:flex;justify-content:center;align-items:center;height:100%;">'
                        + '<span class="text-center-vh new badge ' + colorClass + '" style="' + stylePrioridad + '">' + text + '</span>'
                        + '</div>';
                }
            },
            {
                "data": null, "title": "Estado", "sClass": "text-center-vh", "sWidth": "10%",
                "mRender": function (data, type, full) {
                    var statusHtml = "";
                    var styleEstado = "white-space:nowrap;min-width:90px;font-weight:bold;color:#fff;";

                    if (data.ActionPlanStatus == 1) {
                        statusHtml = "<span class='new badge yellow darken-1' style='" + styleEstado + "'>En Proceso</span>";
                    } else if (data.ActionPlanStatus == 2) {
                        statusHtml = "<span class='new badge red' style='" + styleEstado + "'>Fuera de Plazo</span>";
                    }

                    return "<div style='display:flex;justify-content:center;align-items:center;height:100%;'>" + statusHtml + "</div>";
                }
            },
            {
                "data": null, "title": "Opciones", "sClass": "text-center-vh", "sWidth": "10%",
                "mRender": function (data, type, full) {
                    return '<div class="buttons-preview">'
                        + '<a href="javascript:void(0);" class="a-edit a-execute-ac activator" data-ActionPlanCode="' + data.ActionPlanCode + '" data-ActionPlanScheduledDate="' + data.ActionPlanScheduledDate + '"><i class="material-icons">flash_on</i></a>'
                        + '</div>';
                }
            }
        ],
        "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            $(nRow).find('td').addClass('black-text');
            $('.a-execute-ac', nRow).tooltip({ delay: 50, tooltip: "Ejecutar Plan de Acción", position: "top" });
        },
        "drawCallback": function (settings) {
            var api = this.api();
            if (api.rows().count() === 0) {
                $('.dataTables_empty').html('No hay planes de acción pendientes');
            }
        }
    });
}

/*================================================================================================================================================================================*/
/*function filterMeeting() {
    $("#datatable-meeting_wrapper").hide();
    $('.div-progress-bar').html('<div style="padding:50px;"><div class="preloader-wrapper big active">'
    +'<div class="spinner-layer spinner-blue-only">'
    +'<div class="circle-clipper left"> <div class="circle"></div> </div>'
    +'<div class="gap-patch"> <div class="circle"></div> </div>'
    +'<div class="circle-clipper right"> <div class="circle"></div></div>'
    +'</div></div></div>');

    datatableMeeting.ajax.reload();    
}*/
/*================================================================================================================================================================================*/
/*function viewMeeting() {
    var meetingCode = window.btoa($(this).attr("data-MeetingCode"));
    window.open('MeetingDetail/' + meetingCode, '_blank');
}*/
/*================================================================================================================================================================================*/
/*function showModalExecuteActionPlan() {
    if($("#form-action-plan").valid()) {
        var actionPlanCode = $(this).attr("data-ActionPlanCode");
        $('.div-modal').load('Home/Modal',
            { 
                ModalId:        "modal-confirmation",
                ModalClass:     "modal-message modal-info2",
                ModalHeader:    '<span><i class="blue-dark-text material-icons">help_outline</i><label>CONFIRMACIÓN</label></span>',
                ModalTitle:     " ",
                ModalBody:      "¿Desea ejecutar este plan de acción?", 
                ModalButtonOk:  '<button type="button" id="btn-modal-aceppt" class="modal-action waves-effect btn-flat blue white-text">Aceptar</button>'
            },
            function() {
               $('#modal-confirmation').modal({dismissible: false}).modal('open')
               .one('click', '#btn-modal-aceppt', function (e) {
                    var ajax = executeActionPlan(actionPlanCode);
                    ajax.done(function(response) {
                        var ajaxApd = insertActionPlanDetail(actionPlanCode);
                        if(ajaxApd != null) {
                            ajaxApd.done(function() {
                               $(".hide-form").trigger("click");
                               $('#modal-confirmation').modal('close'); 
                               notificationsActionPlan();
                               datatableActionPlanPending.ajax.reload();
                            });
                        }
                        else {
                           $(".hide-form").trigger("click");
                           $('#modal-confirmation').modal('close'); 
                           notificationsActionPlan();
                           datatableActionPlanPending.ajax.reload();
                        }
                    });
                });
            }
        );
    }
}*/
/*================================================================================================================================================================================*/
/*function validateExecuteActionPlan() {
    return $("#form-action-plan").validate({
            rules: {
                "txt-executedesc-ap": {required: true },
                "txt-executedate-ap": {required: true }
            },
            messages: {
                "txt-executedesc-ap":{required: "Descripción es obligatorio"},
                "txt-executedate-ap":{required: "Fecha es obligatorio"}
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
}*/
/*================================================================================================================================================================================*/
/*function executeActionPlan(actionPlanCode) {
    var data = {};
    data.ActionPlanCode         =  actionPlanCode;
    data.ActionPlanExecutedDesc =  $("#txt-executedesc-ap").val();
    data.ActionPlanExecutedDate =  formatStrDate($("#txt-executedate-ap").val(), 'dd/mm/yyyy', "/");
    return $.ajax({
        type        : "POST",
        url         : "executeActionPlan",
        data        : JSON.stringify(data),
        dataType    : 'json',
        contentType : 'application/json; charset=utf-8',
        async       : false,
        error: function(response) {
        }
    });
}*/
/*================================================================================================================================================================================*/
/*function insertActionPlanDetail(actionPlanCode) {
    var data          = new FormData();
    var validateImage = false;
    $(".file-ap-detail").each(function (index, value) {       
        var files = $(this).get(0).files;
        if (files.length > 0) {
            validateImage = true;
            var actionPlanDetailCode = getGeneratedCode("M-APD");
            data.append("entityList[" + index + "].ActionPlanCode", actionPlanCode);
            data.append("entityList[" + index + "].ActionPlanDetailCode", actionPlanDetailCode);
            data.append("entityList[" + index + "].ActionPlanDetailNameFile",actionPlanDetailCode);
            data.append("entityList[" + index + "].ActionPlanDetailFile", files[0]);
       }       
    });
    if(validateImage) {
        return $.ajax({
            type        : "POST",
            //url         : "insertActionPlanDetail",
            url: "/ActionPlanDetail/insertActionPlanDetail",
            processData : false,
            contentType : false,
            data        : data,
            async       : true,
            beforeSend: function() {
                $("#btn-modal-aceppt").html('<img src="'+ baseUrl + '/Content/MeetingRecordAppWeb/img/ic_spinner_50.svg" style="width:35px;">' 
                        +'<span style="position:  relative;float: right;">Aceptar</span>');
                $(".modal-close").addClass("disabled");
            },
            error       : function(response) {
            }
        });        
    }
    return null;
}*/
/*================================================================================================================================================================================*/
/*function tableChildActionPlan(dataParent) {
    var tableChild   = "";
    var dataRows     = "";
    var data         = {};
    data.meetingCode = dataParent.MeetingCode;
    $.ajax({
        type        : "POST",
        url         : "getActionPlanByMeetingCode",
        data        : JSON.stringify(data),
        dataType    : 'json',
        contentType : 'application/json; charset=utf-8',
        async       : false,
        success     : function(response) {
            var responseObj = $.parseJSON(response);
            $.each(responseObj.ActionPlan, function(index, item) {
                var status     = "";
                var optionView = "";
                if(item.ActionPlanStatus == 0) {
                    switch(item.ActionPlanScheduledDateStatus) {
                        case 0:
                            status = '<span class="new badge red">Atrasado</span>';
                            break;
                        case 1:
                            status = '<span class="new badge orange darken-1">Por vencer</span>';
                            break;
                        case 2:
                            status = '<span class="new badge green">Dentro de plazo</span>';
                            break;
                    }                    
                }
                else {
                    status     = '<span class="new badge blue">Ejecutado</span>';
                    optionView = '<a href="javascript:void(0);" class="a-edit a-view-action-plan" data-ActionPlanCode="' + item.ActionPlanCode + '"'
                    +' data-ActionPlanExecutedDesc="' + item.ActionPlanExecutedDesc + '"'
                    +' data-ActionPlanExecutedDate="' + item.ActionPlanExecutedDate + '"><i class="material-icons">remove_red_eye</i></a>';
                }

                dataRows+='<tr>'
                +'<td class="text-center-vh">' + (index + 1) +'</td>'
                +'<td>' + item.ActionPlanWhat + '</td>'
                +'<td>' + item.ActionPlanWhy + '</td>'
                +'<td class="text-center-vh">' + item.ActionPlanScheduledDate + '</td>'
                +'<td>' + item.ResponsibleUserName + '</td>'
                +'<td class="text-center-vh">' + status +'</td>'
                +'<td class="text-center-vh">' + optionView + '</td>'
                +'</tr>'
            });
        },
        error       : function(response) {
        }
    });
    if(dataRows != "") {
        tableChild =  '<table style="width: 100%;margin-top:10px;margin-bottom:10px;border:1px #ddd solid;">'
           +'<thead>'
               +'<tr role="row">'
                   +'<th class="text-center-vh" style="width:1%">N°</th>'
                   +'<th class="text-center-vh" style="width:25%">¿Qué?</th>'
                   +'<th class="text-center-vh" style="width:20%">¿Porqué?</th>'
                   +'<th class="text-center-vh" style="width:15%">Fecha programada</th>'
                   +'<th class="text-center-vh" style="width:23%">Responsable</th>'
                   +'<th class="text-center-vh" style="width:15%">Status</th>'
                   +'<th class="text-center-vh" style="width:1%">Opción</th>'
               +'</tr>'
           +'</thead>'
           +'<tbody>' + dataRows + '</tbody>'
        +'</table>';        
    }
    else {
        tableChild = '<div class="center black-text" style="padding:15px;"> No tiene plan de acción </div>';
    }
    return tableChild; 
}*/
/*================================================================================================================================================================================*/
/*function showModalViewActionPlanDetail() {
    var actionPlanCode = $(this).attr("data-ActionPlanCode");
    var body = '<div class="row" style="margin-bottom: -10px;"><div class="col s9"><div class="input-field withicon">'
    +'<i class="material-icons prefix">person</i>'
    +'<textarea class="materialize-textarea black-text disabled" disabled style="overflow-y: auto;">' + $(this).attr("data-ActionPlanExecutedDesc") + '</textarea>'
    +'<label for="txt-user-assistance" class="active">Descripción</label></div></div>'

    +'<div class="col s12 m12 l3"><div class="input-field withicon">'
    +'<i class="material-icons prefix">today</i>'
    +'<input id="txt-user-assistance" class="black-text disabled" type="text" value="' + $(this).attr("data-ActionPlanExecutedDate") + '" disabled>'
    +'<label for="txt-user-assistance" class="active">Fecha ejecutada</label></div></div></div>'
    +'<div class="row div-files"></div>'
    +'<div class="div-action-plan-detail row"></div>';

    $('.div-modal').load('Home/Modal',
        {
            ModalId       :    "modal-confirmation",
            ModalClass    :    "modal modal-info2",
            ModalHeader   :    '<span><i class="material-icons">assignment</i><label>DETALLE DE PLAN DE ACCIÓN</label></span>',
            ModalTitle    :    "",
            ModalBody     :    body, 
            ModalButtonOk :    ''
        },
        function() {
            $(".modal-close").text("Cerrar");
            $('#modal-confirmation').modal({dismissible: false}).modal("open");
           
            var ajax = getActionPlanDetailByActionPlanCode(actionPlanCode);
            ajax.done(function(response) {
                var responseJson = $.parseJSON(response);
                if(responseJson.ActionPlanDetail.length > 0) {
                     $(".div-files").html('<div class="col s12" style="font-size:11px;color:#9f9b9b;padding-left:20px;">Archivos</div>');
                    $.each(responseJson.ActionPlanDetail, function(index, item) {
                        var iconfile = "";
                        var size = "width:50px;height:50px;"
                        switch(item.ActionPlanDetailExtFile) {
                            case ".png":
                            case ".jpg":
                            case ".jpeg":
                                iconfile = item.ActionPlanDetailPathFile;
                                size="";
                                break;
                            case ".pdf":
                                iconfile = getIconfile(item.ActionPlanDetailExtFile);
                                var size = "width:40px;height:50px;"
                                break;    
                            default:
                                iconfile = getIconfile(item.ActionPlanDetailExtFile);
                                break;
                        }
                        var divFile = '<div class="col s3"><div style="padding:15px;border:1px #cabebe solid;border-radius:30px;height:160px;">'
                        +'<div style="text-align:right;">'
                        +'<a href="' + item.ActionPlanDetailPathFile + '"  title="' + item.ActionPlanDetailCaptionFile + '" target="_blank">'                        
                        +'<img class="responsive-img" style="width:25px;height:25px;" src="'+ baseUrl + '/Content/MeetingRecordAppWeb/img/ic_download_file.svg">'
                        +'</a>'
                        +'</div>'
                        +'<div class="text-center-vh">'
                        +'<img class="responsive-img" style="' + size + 'max-height:90px;" src="' + iconfile + '" title="' + item.ActionPlanDetailCaptionFile + '">'
                        +'</div>'
                        +'<div class="text-center-vh truncate" style="font-size:10px;font-style:italic;color:#444444;">' + item.ActionPlanDetailCaptionFile
                        +'</div>'
                        +'</div></div>';

                        $(".div-action-plan-detail").append(divFile);
                    });
                }
                else {
                     $(".div-files").empty();
                }
            });
    });
}*/
/*================================================================================================================================================================================*/
/*function getActionPlanDetailByActionPlanCode(actionPlanCode) {
    var data         = {};
    data.actionPlanCode = actionPlanCode;
    return $.ajax({
        type        : "POST",
        //url: "getActionPlanDetailByActionPlanCode", ANTES
        url: "/ActionPlan/getActionPlanByMeetingCode",
        data        : JSON.stringify(data),
        dataType    : 'json',
        contentType : 'application/json; charset=utf-8',
        async       : false,
        error     : function(response) {
        }
    });
}*/
/*================================================================================================================================================================================*/