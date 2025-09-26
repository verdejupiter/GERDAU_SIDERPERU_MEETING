/*================================================================================================================================================================================*/
/**
 * @fileOverview    Script Tipo de reunión
 * @author          ANGELY YAHAYRA MENDEZ CRUZ
 * @version         1.1.1
 * @updatedAt       27/08/2025
*/
/*================================================================================================================================================================================*/
// Variables globales
var datatable;
var validator;
var heightContent = 0;
var height        = 0;
var nroInputText = 0;
var diasSemanaMap = {
	"L": "Lunes",
	"M": "Martes",
	"K": "Miércoles",
	"J": "Jueves",
	"V": "Viernes",
	"S": "Sábado",
	"D": "Domingo"
}; //@AMENDEZ5
var userRole = 0;  //21/8
//21/8
function isEmptyCell(val) {
	return val === undefined || val === null || val === "" || val === "0";
}
/*================================================================================================================================================================================*/
/**
 * Inicializa jquery eventos y funciones
 */
$(document).ready(function() {
	// Verificar si la sesión ah expirado
	checkSessionExpired();

	initFormSelect2();

	//validator = validateFormTypeMeeting(); //ANTES
	datatable = getAllTypeMeeting();

	$(document).on('keyup','#txt-type-meeting', function(){$(this).val($(this).val().toUpperCase()); });

	/* $("#btn-add-type-meeting").on("click", showFormAddTypeMeeting)
		.tooltip({ delay: 50, tooltip: "Agregar", position: "top" });
	*/ //ANTES

	// Evento para mostrar el modal al hacer click en el botón +
	$('#btn-add-type-meeting').on('click', function () {
		showModalAddTypeMeeting();
	}).tooltip({ delay: 50, tooltip: "Agregar Nuevo", position: "top" });
	// @AMENDEZ5

	$(document).on("click", "#btn-insert-type-meeting", showModalAddTypeMeeting);
	$(document).on("click", "#btn-update-type-meeting", showModalEditTypeMeeting);

	$(document).on("click", ".a-edit-type-meeting", showModalEditTypeMeeting); 
	//$(document).on("click", ".a-edit-type-meeting", showFormEditTypeMeeting); //ANTES
	$(document).on("click", ".a-delete-type-meeting", showModalDeleteTypeMeeting);

	userRole = parseInt(localStorage.getItem("UserRole")) || 0;

	//21/8
	// Botón Buscar
	$(".btn-filter-type-meeting").on("click", function () {
		if (datatable) {
			datatable.ajax.reload();
		}
	});

	// Botón Limpiar
	$(".btn-clear-filters-type-meeting").on("click", function () {
		if (userRole === 2) {
			$("#cbo-area").val("").trigger("change");
			$("#cbo-cell").val("").trigger("change");
		} else if (userRole === 1) {
			$("#cbo-cell").val("").trigger("change");
		}
		if (datatable) {
			datatable.ajax.reload();
		}
	});


	//21/8

	/*$("#check-status").on("click", function() {
		$(".badge-status").html($(this).is(':checked') == true ?
			'<span class="new badge green">Activo</span>' : '<span class="new badge red">Inactivo</span>');		
	});*/ //ANTES

	/* $("#btn-add-user").on("click", function() {
        nroInputText ++;
        addInputText("i-delete-user", "txt-username txt-username-"+ nroInputText,
        "txt-username-"+ nroInputText, "Colaborador", $("#div-content-user"));        
        if(heightContent < 500){
            height += 50;
            $(".div-content-type-meeting").height(height);           
        }  
        $("input[name=txt-username-" + nroInputText+"]").rules( "add",{
                required: true,         
                messages: {
                   required: "Colaborador es obligatorio"
                } 
           }      
        );
        InitAutocompleteUser(".txt-username-"+ nroInputText);
    });*/ //ANTES

    /* $(document).on("click", ".i-delete-user", removeInput)
    $(document).on("click", ".i-delete-user", function() {
        if(heightContent < 500){
            height -= 50;
            $(".div-content-type-meeting").height(height);
        }
    });	*/ //ANTES
});
/*================================================================================================================================================================================*/
function initFormSelect2() { //21/8
	userRole = parseInt(localStorage.getItem("UserRole")) || 0;
	const areaId = localStorage.getItem('AreaId');
	const cellId = localStorage.getItem('CellId');

	getAllArea(true, function () {
		if (userRole === 1) {
			// Selecciona el área del usuario y bloquea el combo
			$("#cbo-area").val(areaId).prop("disabled", true).trigger("change");
			// Carga las células de esa área y selecciona la del usuario
			getCellByAreaId(areaId, function () {
				$("#cbo-cell").val(0).prop("disabled", false).trigger("change");
				if (datatable) datatable.ajax.reload();
			});
		} else if (userRole === 2) {
			// Selecciona "Todos" (0) y deja ambos combos habilitados
			$("#cbo-area").val(0).prop("disabled", false).trigger("change");
			getCellByAreaId(0, function () {
				$("#cbo-cell").val(0).prop("disabled", false).trigger("change");
				if (datatable) datatable.ajax.reload();
			});
		} else {
			$("#cbo-area").prop("disabled", true);
			$("#cbo-cell").prop("disabled", true);
		}
	});

	$('#cbo-area').select2({ theme: "bootstrap", minimumResultsForSearch: 0 });
	$('#cbo-cell').select2({ theme: "bootstrap", minimumResultsForSearch: 0 });

	// Cuando cambie el área (solo userRole=2 puede cambiar), recarga las células y la tabla
	$("#cbo-area").off("change.initFormSelect2").on("change.initFormSelect2", function () {
		if (userRole === 2) {
			var selectedAreaId = $(this).val() || 0;
			getCellByAreaId(selectedAreaId, function () {
				$("#cbo-cell").val(0).trigger("change");
				if (datatable) datatable.ajax.reload();
			});
		}
	});

	// Cuando cambie la célula, recarga la tabla
	$("#cbo-cell").off("change.initFormSelect2").on("change.initFormSelect2", function () {
		if (datatable) datatable.ajax.reload();
	});
}
/*================================================================================================================================================================================*/
function removeInput() {
	$(this).parents(".input-field").hide("slow", function () {
		$(this).remove();
	});
}
/*================================================================================================================================================================================*/
function addInputText(iconDeleteClass, inputClass, inputId, placeholder, $container, useAppend) {
	var html =
		'<div class="input-field" style="display:flex; align-items:center; margin-top:0px; ">' +
		'<input type="text" class="' + inputClass + ' txt-username" id="' + inputId + '" name="' + inputId + '" autocomplete="off" placeholder="' + placeholder + '" style="margin-right:1px;"/>' +
		'<a href="javascript:void(0);" class="' + iconDeleteClass + '" title="Eliminar" style="display:flex;align-items:center;">' +
		'<i class="material-icons red-text">delete</i>' +
		'</a>' +
		'</div>';
	if (useAppend) {
		$container.append(html); // Para editar
	} else {
		$container.prepend(html); // Para agregar
	}
}
// @AMENDEZ5
/*================================================================================================================================================================================*/
function validateFormTypeMeeting() {
	// Añade un campo virtual para los días
	$.validator.addMethod("diasSeleccionados", function (value, element) {
		return getSelectedDays().length > 0;
	}, "Debe seleccionar al menos un día.");

	return $("#form-modal").validate({
		errorClass: "error2",
		rules: {
			"txt-type-meeting": { required: true },
			"txt-type-meeting-frequency": { required: true },
			"dias-group": { diasSeleccionados: true }, // campo virtual
			// === 21/08
			"cbo-area-modal": { required: true },
			//"cbo-cell-modal": { required: true }
			// === 21/08
		},
		messages: {
			"txt-type-meeting": { required: "El nombre de la reunión es obligatorio" },
			"txt-type-meeting-frequency": { required: "La frecuencia es obligatoria" },
			"dias-group": { diasSeleccionados: "Debe seleccionar al menos un día." },
			// === 16/08
			"cbo-area-modal": { required: "La área es obligatoria." },
			//"cbo-cell-modal": { required: "La célula es obligatoria." },
		},
		errorElement: 'div',
		errorPlacement: function (error, element) {
			if (element.attr("name") === "txt-type-meeting-frequency") {
				error.insertAfter(element.parent());
			} else if (element.attr("name") === "dias-group") {
				error.insertAfter($('#days-group'));
			// === 21/08
			} else if (element.attr("id") === "cbo-area-modal") {
				element.parent().append(error);
			} /*else if (element.attr("id") === "cbo-cell-modal") {
				element.parent().append(error);
			// === 21/08
			} */else {
				var placement = $(element).data('error');
				if (placement) {
					$(placement).append(error)
				} else {
					error.insertAfter(element);
				}
			}
		},
	});
} //@AMENDEZ5
/*function validateFormTypeMeeting() {
	return $("#form-type-meeting").validate({
		rules: {
			"txt-type-meeting": { required: true }
		},
		messages: {
			"txt-type-meeting": { required: "Grupo de usuarios es obligatorio" }
		},
		errorElement: 'div',
		errorPlacement: function (error, element) {
			var placement = $(element).data('error');
			if (placement) {
				$(placement).append(error)
			} else {
				error.insertAfter(element);
			}
		},
		submitHandler: function () {
		}
	}
	);
} */ //ANTES
/*================================================================================================================================================================================*/
function getAllTypeMeeting() {
	return $("#datatable-type-meeting").DataTable({
		"bDestroy" : true,
        "responsive": true,
		"bAutoWidth": true,
		//21/08
		"bFilter": false,
		//21/08
        "paging":   true,
        "ordering": false,
        "info":     false,
        "bLengthChange" : false,
        "iDisplayLength": 50,
        "language": {"url": "Content/library/datatable/language/Spanish.json"},
        "ajax":{
			dataSrc: function (json) {
				json = JSON.parse(json);
				return json.TypeMeeting;
			},
            "type"   : "POST",
            "url"    : 'getAllTypeMeeting',
			"async": false,
			//21/8
			"data": function (d) {
				const cboAreaId = Number($("#cbo-area").val());
				const cboCellId = Number($("#cbo-cell").val());
				d.areaId = (cboAreaId > 0) ? cboAreaId : 0;
				d.cellId = (cboCellId > 0) ? cboCellId : 0;
			}
			//21/8
        },
        "aoColumns": [
            //{"data":"RowNumber", "title": "N°","sClass": "text-center-vh", "sWidth": "1%"}, //ANTES
			{ "data": "TypeMeetingDescription", "title": "Tipo de la Reunión", "sClass": "text-center-vh", "sWidth": "40%" },
			//16/08
			{ "data": "AreaName", "title": "Área", "sClass": "text-center-vh", "sWidth": "20%" },
			//21/08
			{ "data": "CellName", "title": "Célula", "sClass": "text-center-vh", "sWidth": "20%" },
			//21/08
			{
				"data": "TypeMeetingScheduledDays", "title": "Días Programados", "sClass": "text-center-vh", "sWidth": "20%",
				"render": function (data, type, row) {
					if (!data) return "";
					return '<div style="display:flex;justify-content:center;align-items:center;height:100%;">'
					+ data.split(',').map(function (d) {
						return diasSemanaMap[d] || d;
					}).join(', ');
				}
			}, //@AMENDEZ5
			{ "data": "TypeMeetingFrequency", "title": "Frecuencia", "sClass": "text-center-vh", "sWidth": "20%" }, //@AMENDEZ5
			{ "data": null,	"title": "Estado", "sClass": "", "sWidth": "5%", "mRender": function (data, type, full) { //@AMENDEZ5
				return '<div style="display:flex;justify-content:center;align-items:center;height:100%;">' 
						+ (data["TypeMeetingStatus"] == true
							? '<span class="new badge green">Activo</span>'	: '<span class="new badge red">Inactivo</span>') + '</div>';
				}
			}, //@AMENDEZ5
			{	"data": null, "title": "Opciones", "sClass": "text-center-vh","sWidth": "10%", 
				"mRender": function (data, type, full) {
					//21/8
					return '<div class="buttons-preview">'
						+ '<a href="javascript:void(0);" class="a-edit a-edit-type-meeting activator" '
						+ 'data-TypeMeetingCode="' + data["TypeMeetingCode"] + '" '
						+ 'data-TypeMeetingDescription="' + data["TypeMeetingDescription"] + '" '
						+ 'data-TypeMeetingStatus="' + data["TypeMeetingStatus"] + '" '
						+ 'data-TypeMeetingScheduledDays="' + (data["TypeMeetingScheduledDays"] || '') + '" '
						+ 'data-TypeMeetingFrequency="' + (data["TypeMeetingFrequency"] || '') + '" '
						+ 'data-AreaId="' + (data["AreaId"] || '') + '" ' // <-- AGREGADO 21/8
						+ 'data-CellId="' + (data["CellId"] || '') + '">' // <-- AGREGADO 21/8
						+ '<i class="material-icons">mode_edit</i></a>'
						+ '<a href="javascript:void(0);" class="a-delete a-delete-type-meeting" data-TypeMeetingCode="' + data["TypeMeetingCode"] + '"><i class="material-icons">delete_forever</i></a>'
						+ '</div>';
					//21/8
                }
            }
        ],
		"fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
			// Aplica negro a todas las celdas excepto la última (opciones) 
			$(nRow).find('td:not(:nth-last-child(1)):not(:nth-last-child(2))').addClass('black-text'); //@AMENDEZ5

            $('.a-edit-type-meeting', nRow).tooltip({delay: 50, tooltip: "Editar", position: "top"});
			$('.a-delete-type-meeting', nRow).tooltip({ delay: 50, tooltip: "Eliminar", position: "top" });
			//16/8
			// $('td:eq(1)', nRow).removeClass("text-hv-center").addClass( "text-left");
			//16/8
        }
    });
}
/*================================================================================================================================================================================*/
function insertTypeMeeting(data) {
	data.TypeMeetingCode = getGeneratedCode("TM");
	data.RegisteredByUserId = localStorage.getItem("UserId");

	$.ajax({
		type: "POST",
		url: "insertTypeMeeting",
		data: JSON.stringify(data),
		dataType: 'json',
		contentType: 'application/json; charset=utf-8',
		async: true,
		success: function (response) {
			var ajax = insertTypeMeetingDetail(data.TypeMeetingCode, data.Users);
			ajax.done(function (response) {
				$('#modal-confirmation').modal('close');
				$(".hide-form").trigger("click");
				datatable.ajax.reload();
				showAlertMessage($(".div-alert-message"), "light-green", "check", "Éxito :",
					"Se agregó satisfactoriamente", 3000);
			});
		},
		error: function (response) {
			showAlertMessage($(".div-alert-message"), "red", "error", "Error :", "No se pudo guardar el tipo de reunión", 4000);
		}
	});
} //@AMENDEZ5
/*function insertTypeMeeting() {
	if($("#form-type-meeting").valid()) {		
		var data = {};
		data.TypeMeetingCode 			= getGeneratedCode("TM");
		data.RegisteredByUserId 		= localStorage.getItem("UserId");
		data.TypeMeetingDescription		= $("#txt-type-meeting").val();
		data.TypeMeetingStatus			= $("#check-status").is(':checked');
		data.TypeMeetingScheduledDays	= $("#txt-type-meeting-scheduled-days").val(); //@AMENDEZ5
		data.TypeMeetingFrequency		= $("#txt-type-meeting-frequency").val(); //@AMENDEZ5

		$.ajax({
			type        : "POST",
			url         : "insertTypeMeeting",
			data        : JSON.stringify(data),
			dataType    : 'json',
			contentType : 'application/json; charset=utf-8',
			async       : true,
			success     : function (response) {
				var ajax = insertTypeMeetingDetail(data.TypeMeetingCode, getUsers()); 
				//var ajax = insertTypeMeetingDetail(data.TypeMeetingCode, data.Users);

				ajax.done(function(response){
					$('#modal-confirmation').modal('close');
					$(".hide-form").trigger("click");
					datatable.ajax.reload();
					showAlertMessage($(".div-alert-message"), "light-green", "check", "Éxito :",
						"Se agregó satisfactoriamente", 3000);

				});
			},
			error: function(response) {
			}
		});
	}
}*/ //ANTES
/*================================================================================================================================================================================*/
function updateTypeMeeting(typeMeetingCode, typeMeetingDescription, typeMeetingStatus, typeMeetingScheduledDays, typeMeetingFrequency, areaId, cellId) { //@AMENDEZ5
	if($("#form-modal").valid()) {
		var data = {};
		data.TypeMeetingCode        = typeMeetingCode;
		data.RegisteredByUserId     = localStorage.getItem("UserId");
		data.TypeMeetingDescription = typeMeetingDescription;
		data.TypeMeetingStatus = typeMeetingStatus;
		data.TypeMeetingScheduledDays = typeMeetingScheduledDays; //@AMENDEZ5
		data.TypeMeetingFrequency = typeMeetingFrequency; //@AMENDEZ5
		data.TypeMeetingVersion = getCurrentDatetime(0);
		//16/8
		data.AreaId = areaId;
		//21/8
		data.CellId = cellId;

		$.ajax({
			type        : "POST",
			url         : "updateTypeMeeting",
			data        : JSON.stringify(data),
			dataType    : 'json',
			contentType : 'application/json; charset=utf-8',
			async       : true,
			success     : function (response) {								
				var ajaxDelete = deleteTypeMeetingDetail(typeMeetingCode);
				ajaxDelete.done(function(response) {
					var ajaxInsert = insertTypeMeetingDetail(typeMeetingCode, getUsers());
					ajaxInsert.done(function(response) {
						$('#modal-confirmation').modal('close');
						$(".hide-form").trigger("click");
						datatable.ajax.reload();
						showAlertMessage($(".div-alert-message"), "light-green", "edit", "Éxito :", "Se editó satisfactoriamente", 3000);
					});
				});
			},
			error: function(response) {
			}
		});
	}
}
/*================================================================================================================================================================================*/
function deleteTypeMeeting(typeMeetingCode) {
	var data = {};
	data.TypeMeetingCode = typeMeetingCode;
	$.ajax({
		type        : "POST",
		url         : "deleteTypeMeeting",
		data        : JSON.stringify(data),
		dataType    : 'json',
		contentType : 'application/json; charset=utf-8',
		async       : true,
		success     : function (response) {
			$('#modal-confirmation').modal('close');
			$(".hide-form").trigger("click");
			datatable.ajax.reload();
			showAlertMessage($(".div-alert-message"), "light-green", "delete", "Éxito :", "Se eliminó satisfactoriamente", 3000);
		},
		error: function(response) {
		}
	});
}
/*================================================================================================================================================================================*/
/*function showFormAddTypeMeeting() {
	nroInputText  = 0;
	heightContent = $(".div-content-type-meeting").height();
	height        = heightContent;

	$('html, body').animate({scrollTop: 0 }, 800);
	$(".title-type-meeting").text("Agregar tipo de reunión");
	$("#txt-type-meeting").val("");

	$("#check-status").prop("checked", true);
	$(".badge-status").html('<span class="new badge green">Activo</span>');
	
	$(".i-delete-user").parent(".input-field").remove();
	setTimeout(function(){
        $("#txt-type-meeting").focus();
        $("#btn-add-user").trigger("click");
    }, 200);

    validator.resetForm();

	$(".div-content-btn").html('<button type="submit" id="btn-insert-type-meeting" class="waves-effect waves-light btn blue gradient-shadow right" style="padding-left: 8px; padding-right: 10px;">'
                                    +'<i class="material-icons left" style="margin-right: 5px;">save</i> Guardar'
                                +'</button>');
}*/ //ANTES
/*================================================================================================================================================================================*/
/*function showFormEditTypeMeeting() {
	var typeMeetingCode          = $(this).attr("data-TypeMeetingCode");
	var typeMeetingDescription = $(this).attr("data-TypeMeetingDescription");
	var typeMeetingSatus       = $(this).attr("data-TypeMeetingStatus");
	typeMeetingSatus 		   = (typeMeetingSatus == 'true');
	$('html, body').animate({scrollTop: 0 }, 800);
	$(".title-type-meeting").text("Editar tipo de reunión");

	$("#check-status").prop("checked", typeMeetingSatus);
	if($("#check-status").is(':checked')) {
		$(".badge-status").html('<span class="new badge green">Activo</span>');

	}
	else {
		$(".badge-status").html('<span class="new badge red">Inactivo</span>');
	}
	
	setTimeout(function(){
        $("#txt-type-meeting").val(typeMeetingDescription).focus();
    }, 200);
	
	$(".div-content-btn").html('<button type="submit" id="btn-update-type-meeting" data-TypeMeetingCode="'+ typeMeetingCode+ '" '
								+'class="waves-effect waves-light btn blue gradient-shadow right" style="padding-left: 8px; padding-right: 10px;">'
								+'<i class="material-icons left" style="margin-right: 5px;">save</i> Guardar'
								+'</button>');

	getTypeMeetingDetailByCode(typeMeetingCode);
}*/ //ANTES
/*================================================================================================================================================================================*/
function getTypeMeetingModalBody() {
	return (
		// Contenedor principal del formulario modal
		'<div class="col s12">'
		// === 21/08
		// === Estado en una sola fila ===
		+ '<div class="row" style="padding-top: 0px !important;">'
		+ '<label class="input-field-with-icon label" style="position:relative;top:-0.3rem;left:0;font-size:1.0rem !important;font-weight:bold !important;color:#9e9e9e;background-color:transparent;padding:0 0.5rem;">Estado: </label>'
		+ '<label class="switch" style="margin-left:10px;">'
		+ '<input id="check-status" type="checkbox" class="switch-option-check">'
		+ '<span class="slider round"></span>'
		+ '<div class="badge-status"></div>'
		+ '</label>'
		+ '</div>'
		// === Área y Célula en la misma fila ===
		+ '<div class="row" style="padding-top: 16px !important; padding-left: 0px !important; padding-right: 0px !important;">'
		+ '<div class="col s12 m12 l7">'
		+ '<div class="input-field-with-icon">'
		+ '<label for="cbo-area-modal" class="active">Área</label>'
		+ '<select id="cbo-area-modal" name="cbo-area-modal" class="browser-default" style="background-color: white !important; border: 1px solid #ccc; height: 36px;"></select>'
		+ '</div>'
		+ '</div>'

		+ '<div class="col s12 m12 l5">'
		+ '<div class="input-field-with-icon">'
		+ '<label for="cbo-cell-modal" class="active">Célula</label>'
		+ '<select id="cbo-cell-modal" name="cbo-cell-modal" class="browser-default" style="background-color: white !important; border: 1px solid #ccc; height: 36px;"></select>'
		+ '</div>'
		+ '</div>'

		+ '</div>'
		// === 21/08

		// === Nombre de la reunión ===
		// === 16/08
		+ '<div class="row" style="padding-top: 15px;">'
		// === 16/08
		+ '<!-- Campo para el nombre de la reunión -->'
		+ '<div class="input-field-with-icon">'
		+ '<input name="txt-type-meeting" id="txt-type-meeting" type="text" autocomplete="off">'
		+ '<label for="txt-type-meeting" class="active">Tipo de la reunión: </label>'
		+ '</div>'
		+ '</div>'

		// === Asistentes ===
		+ '<div class="col s12 m12 l12" style="padding-top: 10px;">'
		+ '<div>'
		+ '<div>'
		+ '<!-- Sección para agregar asistentes -->'
		+ '<label class="input-field-with-icon label" style="position:relative;top:-0.1rem;left:0;font-size:1.0rem !important;font-weight:bold !important;color:#9e9e9e;background-color:transparent;padding:0 0.5rem;margin-bottom:0;">Asistentes:</label>'
		+ '<button type="button" id="btn-add-user" class="btn-floating btn-small btn-small-1 gradient-shadow waves-effect waves-light blue">'
		+ '<i class="material-icons">add</i>'
		+ '</button>'
		+ '</div>'
		+ '</div>'
		+ '</div>'

		// Contenedor dinámico para los inputs de usuario
		+ '<div id="div-content-user" '
		+ 'style="width:100%; min-height:60px; max-height:80px; overflow-y:auto; border-radius:8px; border:1px solid #e0e0e0; background:#fff; padding:8px 4px; margin-bottom:10px;">'
		+ '</div>'

		// === Días programados y Frecuencia ===
		+ '<div class="row" style="padding-top: 8px; padding-bottom:15px !important; margin-bottom:0 !important;">'

		// Días programados
		+ '<div class="col s12 m12 l7" style="margin-bottom:0 !important;">'
		+ '<!-- Selección de días programados -->'
		+ '<div style="font-size:1.0rem;font-weight:bold;color:#9e9e9e;padding:0 0.5rem 10px 0;">Días programados:</div>'
		+ '<div id="days-group" style="display:flex;gap:8px;flex-wrap:wrap;">'
		+ '<div class="chip day-chip" data-value="L">L</div>'
		+ '<div class="chip day-chip" data-value="M">M</div>'
		+ '<div class="chip day-chip" data-value="K">K</div>'
		+ '<div class="chip day-chip" data-value="J">J</div>'
		+ '<div class="chip day-chip" data-value="V">V</div>'
		+ '<div class="chip day-chip" data-value="S">S</div>'
		+ '<div class="chip day-chip" data-value="D">D</div>'
		+ '</div>'
		+ '<input type="hidden" name="dias-group" id="dias-group-hidden" />'
		+ '</div>'

		// Frecuencia
		+ '<div class="col s12 m12 l5" style="margin-bottom:0;">'
		+ '<!-- Selección de frecuencia de la reunión -->'
		+ '<div style="font-size:1.0rem;font-weight:bold;color:#9e9e9e;padding:0 0.5rem 4px 0;">Frecuencia:</div>'
		+ '<div class="input-field-with-icon" style="margin:0;">'
		+ '<select id="txt-type-meeting-frequency" name="txt-type-meeting-frequency" class="browser-default" style="background-color: white !important; border: 1px solid #ccc; height: 36px;">'
		+ '<option value="" disabled selected>Seleccione...</option>'
		+ '<option value="Diaria">Diaria</option>'
		+ '<option value="Semanal">Semanal</option>'
		+ '<option value="Quincenal">Quincenal</option>'
		+ '<option value="Trimestral">Trimestral</option>'
		+ '<option value="Mensual">Mensual</option>'
		+ '<option value="Anual">Anual</option>'
		+ '</select>'
		+ '</div>'
		+ '</div>'

		+ '</div>' // Cierra row días/frecuencia
		+ '</div>' // Cierra col s12 principal
	);
} //@AMENDEZ5
/*================================================================================================================================================================================*/
function initTypeMeetingModalEvents(options) {
	// options: { isEdit, data, onSave }
	validateFormTypeMeeting();

	// En tu función initTypeMeetingModalEvents (dentro del modal)
	$(document).off('input.duplicateTypeMeeting').on('input.duplicateTypeMeeting', '#txt-type-meeting', validarDuplicidadTypeMeeting);
	$('#cbo-area-modal, #cbo-cell-modal').off('change.duplicateTypeMeeting').on('change.duplicateTypeMeeting', function () {
		if ($('#txt-type-meeting').val().trim() !== "") {
			validarDuplicidadTypeMeeting();
		}
	});

	// Precarga datos si es edición
	if (options.isEdit && options.data) {
		$("#txt-type-meeting").val(options.data.TypeMeetingDescription);
		$("#check-status").prop("checked", options.data.TypeMeetingStatus);
		$(".badge-status").html(options.data.TypeMeetingStatus
			? '<span class="new badge green">Activo</span>'
			: '<span class="new badge red">Inactivo</span>');
		setTimeout(function () {
			$("#txt-type-meeting-frequency").val(options.data.TypeMeetingFrequency).trigger('change');
		}, 100);
		getAllAreaModal(false, function () {
			$("#cbo-area-modal").val(options.data.AreaId).trigger('change');
			// Llenar células de esa área y luego seleccionar la correcta
			getCellByAreaIdModal(options.data.AreaId, function () {
				$("#cbo-cell-modal").val(options.data.CellId).trigger('change');
			});
		});

		if (options.data.TypeMeetingScheduledDays) {
			var dias = options.data.TypeMeetingScheduledDays.split(',');
			setTimeout(function () {
				$('.chip.day-chip').each(function () {
					if (dias.indexOf($(this).data('value')) !== -1) {
						$(this).addClass('selected');
					}
				});
				$('#dias-group-hidden').val(dias.join(',')).trigger('change');
			}, 100);
		}
		getTypeMeetingDetailByCode(options.data.TypeMeetingCode);

	} else {
		// Por defecto, estado activo y badge verde
		$("#check-status").prop("checked", true);
		$(".badge-status").html('<span class="new badge green">Activo</span>');
		setTimeout(function () {
			$("#btn-add-user").trigger("click");
		}, 200);
	}
	if (!options.isEdit) {
		setTimeout(function () {
			if ($('.txt-username').length === 0) {
				$("#btn-add-user").trigger("click");
			}
		}, 200);
	}

	// Validación en tiempo real para usuarios
	$(document).off('input', '.txt-username').on('input', '.txt-username', function () {
		$('#error-users').remove();
		var userError = false;
		var users = [];
		$('.txt-username').each(function () {
			var val = $(this).val().trim();
			if (val === "") userError = true;
			users.push(val);
		});
		if (users.length === 0 || userError) {
			$('#div-content-user').after('<div id="error-users" class="error2" style="color:#d32f2f;margin-top:-10px;">Debe agregar al menos un asistente</div>');
		}
	});

	// Validación en tiempo real al eliminar usuario
	$(document).off('click', '.i-delete-user').on('click', '.i-delete-user', function () {
		$('#error-users').remove();
		setTimeout(function () {
			var userError = false;
			var users = [];
			$('.txt-username').each(function () {
				var val = $(this).val().trim();
				if (val === "") userError = true;
				users.push(val);
			});
			if (users.length === 0 || userError) {
				$('#div-content-user').after('<div id="error-users" class="error2" style="color:#d32f2f;margin-top:-10px;">Debe agregar al menos un asistente</div>');
			}
		}, 10);
	});

	// Validación en tiempo real para días
	$(document).off('click', '.chip.day-chip').on('click', '.chip.day-chip', function () {
		$(this).toggleClass('selected');
		var dias = getSelectedDays().join(',');
		$('#dias-group-hidden').val(dias).trigger('change');
		$('input[name="dias-group"]').valid();
		$('#error-days').remove();
		if (getSelectedDays().length === 0) {
			$('#days-group').after('<div id="error-days" class="error2" style="color:#d32f2f;margin-top:-10px;margin-bottom:10px;">Debe seleccionar al menos un día.</div>');
		}
	});

	$('#txt-type-meeting-frequency').on('change', function () {
		$(this).valid();
	});

	// Validación en tiempo real para área y célula (modal)
	$("#cbo-area-modal").on("change", function () {
		$(this).valid(); 
	});
	$("#cbo-cell-modal").on("change", function () {
		$(this).valid();
	});

	$("#check-status").on("click", function () {
		$(".badge-status").html($(this).is(':checked')
			? '<span class="new badge green">Activo</span>'
			: '<span class="new badge red">Inactivo</span>');
	});

	$("#btn-add-user").off("click").on("click", function () {
		nroInputText++;
		addInputText("i-delete-user", "txt-username txt-username-" + nroInputText,
			"txt-username-" + nroInputText, "Colaborador", $("#div-content-user"), false); // false = prepend
		InitAutocompleteUser(".txt-username-" + nroInputText);
	}).tooltip({ delay: 50, tooltip: "Agregar", position: "top" });

	$(document).off("click", ".i-delete-user").on("click", ".i-delete-user", removeInput);

	// Si no hay asistentes, agrega uno por defecto (solo para agregar)
	if (!options.isEdit) {
		setTimeout(function () {
			if ($('.txt-username').length === 0) {
				$("#btn-add-user").trigger("click");
			}
		}, 200);
	}

	getSelectedDays();

	// Modal y botón guardar
	$('#modal-confirmation').modal({ dismissible: false }).modal('open')
		.on('click', '#btn-modal-aceppt', function () {
			var isValid = $("#form-modal").valid();

			// Validación adicional de usuarios
			$('#error-users').remove();
			var userError = false;
			var users = [];
			$('.txt-username').each(function () {
				var val = $(this).val().trim();
				if (val === "") userError = true;
				users.push(val);
			});
			if (users.length === 0 || userError) {
				$('#div-content-user').after('<div id="error-users" class="error2" style="color:#d32f2f;margin-top:-10px;">Debe agregar al menos un asistente.</div>');
				isValid = false;
			}

			// Validación adicional de días
			$('#error-days').remove();
			if (getSelectedDays().length === 0) {
				$('#days-group').after('<div id="error-days" class="error2" style="color:#d32f2f;margin-top:-10px;margin-bottom:10px;">Debe seleccionar al menos un día.</div>');
				isValid = false;
			}

			if (isValid) {
				options.onSave();
			}
		});
} //@AMENDEZ5
/*================================================================================================================================================================================*/
function showModalAddTypeMeeting() {
	nroInputText = 0;
	var body = getTypeMeetingModalBody();
	$('.div-modal').load('Home/Modal', {
		ModalId: "modal-confirmation",
		ModalClass: "modal modal-info2",
		ModalHeader: '<div style="border-bottom:1px solid #e0e6ed; margin-bottom:18px;"><span><label>Agregar Tipo de Reunión</label></span></div>',
		ModalTitle: "",
		ModalBody: '<form id="form-modal" onsubmit="return false;">' + body + '</form>',
		ModalButtonOk: '<button type="submit" id="btn-modal-aceppt" class="modal-action waves-effect btn-flat blue white-text">Guardar</button>'
	}, function () {
		// === 16/08
		/*$("#cbo-area").empty();
		getAllArea(false);
		setTimeout(function () {
			$("#cbo-area option[value='0']").remove();
			if ($("#cbo-area option[value='']").length === 0) {
				$("#cbo-area").prepend('<option value="" selected disabled>Seleccione...</option>');
			}
			$("#cbo-area").on("change", function () {
				var $area = $(this);
				if ($area.val() !== "" && $area.val() != null && !$area.find("option:selected").prop("disabled")) {
					$area.next('.error2').remove();
					$area.removeClass("error");
				}
				$(this).valid();
			});
		}, 200);*/
		// === 16/08
		// === Mejora para cargar combos según el rol (MODAL) ===
		$("#cbo-area-modal").empty();
		$("#cbo-cell-modal").empty();

		userRole = parseInt(localStorage.getItem("UserRole")) || 0;
		const areaId = localStorage.getItem('AreaId');
		const cellId = localStorage.getItem('CellId');
		getAllAreaModal(false, function () {
			// Elimina opción "Todos" si existe
			$("#cbo-area-modal option[value='0']").remove();
			// Asegura opción "Seleccionar..."
			if ($("#cbo-area-modal option[value='']").length === 0) {
				$("#cbo-area-modal").prepend('<option value="" selected disabled>Seleccionar...</option>');
			}

			if (userRole === 1) {
				// Precarga área y deshabilita
				$("#cbo-area-modal").val(areaId).prop("disabled", true).trigger("change");
				// Carga células del área y precarga la del usuario, pero permite cambiar célula
				getCellByAreaIdModal(areaId, function () {
					$("#cbo-cell-modal option[value='0']").remove();
					if ($("#cbo-cell-modal option[value='']").length === 0) {
						$("#cbo-cell-modal").prepend('<option value="" selected>Seleccionar...</option>');
					}
					$("#cbo-cell-modal").val("").prop("disabled", false).trigger("change");
				});
			} else if (userRole === 2) {
				// Habilita ambos combos y deja en "Seleccionar..."
				$("#cbo-area-modal").val("").prop("disabled", false).trigger("change");
				getCellByAreaIdModal(0, function () {
					$("#cbo-cell-modal option[value='0']").remove();
					if ($("#cbo-cell-modal option[value='']").length === 0) {
						$("#cbo-cell-modal").prepend('<option value="" selected>Seleccionar...</option>');
					}
					$("#cbo-cell-modal").val("").prop("disabled", false).trigger("change");
				});
			} else {
				// Otros roles: deshabilita ambos
				$("#cbo-area-modal").prop("disabled", true);
				$("#cbo-cell-modal").prop("disabled", true);
			}

			// Validación visual al cambiar área (solo userRole=2)
			$("#cbo-area-modal").off("change.modalAddTypeMeeting").on("change.modalAddTypeMeeting", function () {
				if (userRole === 2) {
					var selectedAreaId = $(this).val();
					getCellByAreaIdModal(selectedAreaId, function () {
						$("#cbo-cell-modal option[value='0']").remove();
						if ($("#cbo-cell-modal option[value='']").length === 0) {
							$("#cbo-cell-modal").prepend('<option value="" selected>Seleccionar...</option>');
						}
						$("#cbo-cell-modal").val("").trigger("change");
					});
				}
			});
		});
		//21/8
		cargarTypeMeetingsCacheGlobal(function () {

		initTypeMeetingModalEvents({
			isEdit: false,
			onSave: function () {
				var data = {
					TypeMeetingDescription: $("#txt-type-meeting").val(),
					TypeMeetingStatus: $("#check-status").is(':checked'),
					Users: getUsers(),
					TypeMeetingScheduledDays: getSelectedDays().join(','),
					// === 21/08
					TypeMeetingFrequency: $("#txt-type-meeting-frequency").val(),
					AreaId: $("#cbo-area-modal").val(),
					CellId: $("#cbo-cell-modal").val()
					// === 21/08
				};
				insertTypeMeeting(data);
				$('#modal-confirmation').modal('close');
				showAlertMessage($(".div-alert-message"), "light-green", "check", "Éxito :", "Se agregó satisfactoriamente", 3000);
			}
		});
		});
	});
} //@AMENDEZ5
/* function showModalAddTypeMeeting() {
	if($("#form-type-meeting").valid()) {	 
		$('.div-modal').load('Home/Modal',
			{ 
				ModalId:        "modal-confirmation",
				ModalClass:     "modal-message modal-info2",
				ModalHeader:    '<span><i class="material-icons">help_outline</i><label>CONFIRMACIÓN</label></span>',
				ModalTitle:     " ",
				ModalBody:      "¿Desea guardar tipo de reunión?", 
				ModalButtonOk:  '<button id="btn-modal-aceppt" class="modal-action waves-effect btn-flat blue white-text">Aceptar</button>'
			},
			function() {
			   $('#modal-confirmation').modal({dismissible: false}).modal('open')
			   .one('click', '#btn-modal-aceppt', function (e) {
					insertTypeMeeting();
				});
			}
		);
	}
}*/ //ANTES
/*================================================================================================================================================================================*/
function showModalEditTypeMeeting() {
	var data = {
		TypeMeetingCode: $(this).attr("data-TypeMeetingCode"),
		TypeMeetingDescription: $(this).attr("data-TypeMeetingDescription"),
		TypeMeetingStatus: $(this).attr("data-TypeMeetingStatus") === "true",
		TypeMeetingScheduledDays: $(this).attr("data-TypeMeetingScheduledDays") || "",
		// === 16/08
		TypeMeetingFrequency: $(this).attr("data-TypeMeetingFrequency") || "",
		AreaId: $(this).attr("data-AreaId") || "",
		// === 16/08
		// === 21/08
		CellId: $(this).attr("data-CellId") || "",
		// === 21/08
	};
	nroInputText = 0;
	var body = getTypeMeetingModalBody();
	$('.div-modal').load('Home/Modal', {
		ModalId: "modal-confirmation",
		ModalClass: "modal modal-info2",
		ModalHeader: '<div style="border-bottom:1px solid #e0e6ed; margin-bottom:18px;"><span><label>Editar Tipo de Reunión</label></span></div>',
		ModalTitle: "",
		ModalBody: '<form id="form-modal" onsubmit="return false;">' + body + '</form>',
		ModalButtonOk: '<button type="submit" id="btn-modal-aceppt" class="modal-action waves-effect btn-flat blue white-text">Guardar</button>'
	}, function () {
		//16/8
		/*$("#cbo-area").empty();
		getAllArea(false, function () {
			$("#cbo-area option[value='0']").remove();
			if ($("#cbo-area option[value='']").length === 0) {
				$("#cbo-area").prepend('<option value="" selected disabled>Seleccione...</option>');
			}
			if (data.AreaId) {
				$("#cbo-area").val(data.AreaId).trigger('change');
			} else {
				$("#cbo-area").val("").trigger('change');
			}
			$("#cbo-area").on("change", function () {
				var $area = $(this);
				if ($area.val() !== "" && $area.val() != null && !$area.find("option:selected").prop("disabled")) {
					$area.next('.error2').remove();
					$area.removeClass("error");
				}
				$(this).valid();
			});
		});*/
		//16/8
		// === Mejora para cargar combos según el rol (MODAL) ===
		$("#cbo-area-modal").empty();
		$("#cbo-cell-modal").empty();

		userRole = parseInt(localStorage.getItem("UserRole")) || 0;

		getAllAreaModal(false, function () {
			$("#cbo-area-modal option[value='0']").remove();
			if ($("#cbo-area-modal option[value='']").length === 0) {
				$("#cbo-area-modal").prepend('<option value="" selected disabled>Seleccionar...</option>');
			}

			if (userRole === 1) {
				// Precarga área y deshabilita
				$("#cbo-area-modal").val(data.AreaId).prop("disabled", true).trigger("change");
				getCellByAreaIdModal(data.AreaId, function () {
					$("#cbo-cell-modal option[value='0']").remove();
					if ($("#cbo-cell-modal option[value='']").length === 0) {
						$("#cbo-cell-modal").prepend('<option value="" selected>Seleccionar...</option>');
					}
					$("#cbo-cell-modal").val(data.CellId).prop("disabled", false).trigger("change");
				});
			} else if (userRole === 2) {
				$("#cbo-area-modal").val(data.AreaId || "").prop("disabled", false).trigger("change");
				getCellByAreaIdModal(data.AreaId || "", function () {
					$("#cbo-cell-modal option[value='0']").remove();
					if ($("#cbo-cell-modal option[value='']").length === 0) {
						$("#cbo-cell-modal").prepend('<option value="" selected>Seleccionar...</option>');
					}
					$("#cbo-cell-modal").val(data.CellId || "").prop("disabled", false).trigger("change");
				});
			} else {
				$("#cbo-area-modal").prop("disabled", true);
				$("#cbo-cell-modal").prop("disabled", true);
			}

			// Validación visual al cambiar área (solo userRole=2)
			$("#cbo-area-modal").off("change.modalAddTypeMeeting").on("change.modalAddTypeMeeting", function () {
				if (userRole === 2) {
					var selectedAreaId = $(this).val();
					getCellByAreaIdModal(selectedAreaId, function () {
						$("#cbo-cell-modal option[value='0']").remove();
						if ($("#cbo-cell-modal option[value='']").length === 0) {
							$("#cbo-cell-modal").prepend('<option value="" selected>Seleccionar...</option>');
						}
						$("#cbo-cell-modal").val("").trigger("change");
					});
				}
			});
		});

		initTypeMeetingModalEvents({
			isEdit: true,
			data: data,
			onSave: function () {
				var updateData = {
					TypeMeetingCode: data.TypeMeetingCode,
					TypeMeetingDescription: $("#txt-type-meeting").val(),
					TypeMeetingStatus: $("#check-status").is(':checked'),
					Users: getUsers(),
					TypeMeetingScheduledDays: getSelectedDays().join(','),
					// === 16/08
					TypeMeetingFrequency: $("#txt-type-meeting-frequency").val(),
					AreaId: $("#cbo-area-modal").val(),
					// === 21/08
					CellId: $("#cbo-cell-modal").val(),
				};
				updateTypeMeeting(
					updateData.TypeMeetingCode,
					updateData.TypeMeetingDescription,
					updateData.TypeMeetingStatus,
					updateData.TypeMeetingScheduledDays,
					// === 16/08
					updateData.TypeMeetingFrequency,
					updateData.AreaId,
					// === 21/08
					updateData.CellId,
				);
				$('#modal-confirmation').modal('close');
			}
		});
	});
} //@AMENDEZ5
/*function showModalEditTypeMeeting() {
	var typeMeetingCode = $(this).attr("data-TypeMeetingCode");
	var typeMeetingDescription = $(this).attr("data-TypeMeetingDescription");
	var typeMeetingStatus = $(this).attr("data-TypeMeetingStatus") === "true";
	var typeMeetingScheduledDays = $(this).attr("data-TypeMeetingScheduledDays") || "";
	var typeMeetingFrequency = $(this).attr("data-TypeMeetingFrequency") || "";

	nroInputText = 0;

	var body = '<div class="col s12">'
		+ '<div class="row" style="padding-top: 8px;">'
		+ '<label class="input-field-with-icon label" style="position:relative;top:-0.3rem;left:0;font-size:1.0rem !important;font-weight:bold !important;color:#9e9e9e;background-color:transparent;padding:0 0.5rem;">Estado: </label>'
		+ '<label class="switch" style="margin-left:10px;">'
		+ '<input id="check-status" type="checkbox" class="switch-option-check">'
		+ '<span class="slider round"></span>'
		+ '<div class="badge-status"></div>'
		+ '</label>'
		+ '</div>'
		+ '<div class="row" style="padding-top: 20px;">'
		+ '<div class="input-field-with-icon">'
		+ '<input name="txt-type-meeting" id="txt-type-meeting" type="text" autocomplete="off">'
		+ '<label for="txt-type-meeting" class="active">Nombre de la reunión: </label>'
		+ '</div>'
		+ '</div>'
		+ '<div class="col s12 m12 l12" style="padding-top: 10px;">'
		+ '<div>'
		+ '<div>'
		+ '<label class="input-field-with-icon label" style="position:relative;top:-0.1rem;left:0;font-size:1.0rem !important;font-weight:bold !important;color:#9e9e9e;background-color:transparent;padding:0 0.5rem;margin-bottom:0;">Asistentes:</label>'
		+ '<button type="button" id="btn-add-user" class="btn-floating btn-small btn-small-1 gradient-shadow waves-effect waves-light blue">'
		+ '<i class="material-icons">add</i>'
		+ '</button>'
		+ '</div>'
		+ '</div>'
		+ '</div>'
		+ '<div id="div-content-user" '
		+ 'style="width:100%; min-height:60px; max-height:80px; overflow-y:auto; border-radius:8px; border:1px solid #e0e0e0; background:#fff; padding:8px 4px; margin-bottom:10px;">'
		+ '</div>'
		+ '<div class="row" style="padding-top: 8px; margin-bottom:0;">'
		+ '<div class="col s12 m12 l8" style="margin-bottom:0;">'
		+ '<div style="font-size:1.0rem;font-weight:bold;color:#9e9e9e;padding:0 0.5rem 4px 0;">Días programados:</div>'
		+ '<div id="days-group" style="display:flex;gap:8px;flex-wrap:wrap;">'
		+ '<div class="chip day-chip" data-value="L">L</div>'
		+ '<div class="chip day-chip" data-value="M">M</div>'
		+ '<div class="chip day-chip" data-value="K">K</div>'
		+ '<div class="chip day-chip" data-value="J">J</div>'
		+ '<div class="chip day-chip" data-value="V">V</div>'
		+ '<div class="chip day-chip" data-value="S">S</div>'
		+ '<div class="chip day-chip" data-value="D">D</div>'
		+ '</div>'
		+ '<input type="hidden" name="dias-group" id="dias-group-hidden" />'
		+ '</div>'
		+ '<div class="col s12 m12 l4" style="margin-bottom:0;">'
		+ '<div style="font-size:1.0rem;font-weight:bold;color:#9e9e9e;padding:0 0.5rem 4px 0;">Frecuencia:</div>'
		+ '<div class="input-field" style="margin:0;">'
		+ '<select id="txt-type-meeting-frequency" name="txt-type-meeting-frequency">'
		+ '<option value="" disabled>Seleccione...</option>'
		+ '<option value="Diaria">Diaria</option>'
		+ '<option value="Semanal">Semanal</option>'
		+ '<option value="Quincenal">Quincenal</option>'
		+ '<option value="Trimestral">Trimestral</option>'
		+ '<option value="Mensual">Mensual</option>'
		+ '<option value="Anual">Anual</option>'
		+ '</select>'
		+ '</div>'
		+ '</div>'
		+ '</div>'
		+ '</div>';

	$('.div-modal').load('Home/Modal',
		{
			ModalId: "modal-confirmation",
			ModalClass: "modal modal-info2",
			ModalHeader: '<div style="border-bottom:1px solid #e0e6ed; margin-bottom:18px;"><span><label>Editar Tipo de Reunión</label></span></div>',
			ModalTitle: "",
			ModalBody: '<form id="form-modal" onsubmit="return false;">' + body + '</form>',
			ModalButtonOk: '<button type="submit" id="btn-modal-aceppt" class="modal-action waves-effect btn-flat blue white-text">Guardar</button>'
		},
		function () {
			// Precarga los datos en los campos
			$("#txt-type-meeting").val(typeMeetingDescription);
			$("#check-status").prop("checked", typeMeetingStatus);
			$(".badge-status").html(typeMeetingStatus
				? '<span class="new badge green">Activo</span>'
				: '<span class="new badge red">Inactivo</span>');

			// Precarga frecuencia
			setTimeout(function () {
				$("#txt-type-meeting-frequency").val(typeMeetingFrequency).trigger('change');
			}, 100);

			// Precarga días seleccionados
			if (typeMeetingScheduledDays) {
				var dias = typeMeetingScheduledDays.split(',');
				setTimeout(function () {
					$('.chip.day-chip').each(function () {
						if (dias.indexOf($(this).data('value')) !== -1) {
							$(this).addClass('selected');
						}
					});
					$('#dias-group-hidden').val(dias.join(',')).trigger('change');
				}, 100);
			}

			// Precarga asistentes
			getTypeMeetingDetailByCode(typeMeetingCode);

			// Validaciones y eventos igual que en showModalAddTypeMeeting
			validateFormTypeMeeting();

			$(document).off('input', '.txt-username').on('input', '.txt-username', function () {
				$('#error-users').remove();
				var userError = false;
				var users = [];
				$('.txt-username').each(function () {
					var val = $(this).val().trim();
					if (val === "") userError = true;
					users.push(val);
				});
				if (users.length === 0 || userError) {
					$('#div-content-user').after('<div id="error-users" class="error2" style="color:#d32f2f;margin-top:-10px;">Debe agregar al menos un asistente</div>');
				}
			});

			$(document).off('click', '.i-delete-user').on('click', '.i-delete-user', function () {
				$('#error-users').remove();
				setTimeout(function () {
					var userError = false;
					var users = [];
					$('.txt-username').each(function () {
						var val = $(this).val().trim();
						if (val === "") userError = true;
						users.push(val);
					});
					if (users.length === 0 || userError) {
						$('#div-content-user').after('<div id="error-users" class="error2" style="color:#d32f2f;margin-top:-10px;">Debe agregar al menos un asistente</div>');
					}
				}, 10);
			});

			$(document).off('click', '.chip.day-chip').on('click', '.chip.day-chip', function () {
				$(this).toggleClass('selected');
				var dias = getSelectedDays().join(',');
				$('#dias-group-hidden').val(dias).trigger('change');
				$('input[name="dias-group"]').valid();

				$('#error-days').remove();
				if (getSelectedDays().length === 0) {
					$('#days-group').after('<div id="error-days" class="error2" style="color:#d32f2f;margin-top:-10px;margin-bottom:10px;">Debe seleccionar al menos un día.</div>');
				}
			});

			$('#txt-type-meeting-frequency').on('change', function () {
				$(this).valid();
			});

			if ($.fn.select2) {
				$('#txt-type-meeting-frequency').select2({
					dropdownParent: $('#modal-confirmation')
				});
			}

			$("#check-status").on("click", function () {
				$(".badge-status").html($(this).is(':checked')
					? '<span class="new badge green">Activo</span>'
					: '<span class="new badge red">Inactivo</span>');
			});

			$("#btn-add-user").off("click").on("click", function () {
				nroInputText++;
				addInputText("i-delete-user", "txt-username txt-username-" + nroInputText,
					"txt-username-" + nroInputText, "Colaborador", $("#div-content-user"));
				InitAutocompleteUser(".txt-username-" + nroInputText);
			}).tooltip({ delay: 50, tooltip: "Agregar", position: "top" });

			$(document).off("click", ".i-delete-user").on("click", ".i-delete-user", removeInput);

			// Si no hay asistentes, agrega uno por defecto
			setTimeout(function () {
				if ($('.txt-username').length === 0) {
					$("#btn-add-user").trigger("click");
				}
			}, 200);

			getSelectedDays();

			$('#modal-confirmation').modal({ dismissible: false }).modal('open')
				.on('click', '#btn-modal-aceppt', function () {
					var isValid = $("#form-modal").valid();

					$('#error-users').remove();
					var userError = false;
					var users = [];
					$('.txt-username').each(function () {
						var val = $(this).val().trim();
						if (val === "") userError = true;
						users.push(val);
					});
					if (users.length === 0 || userError) {
						$('#div-content-user').after('<div id="error-users" class="error2" style="color:#d32f2f;margin-top:-10px;">Debe agregar al menos un asistente.</div>');
						isValid = false;
					}

					$('#error-days').remove();
					if (getSelectedDays().length === 0) {
						$('#days-group').after('<div id="error-days" class="error2" style="color:#d32f2f;margin-top:-10px;margin-bottom:10px;">Debe seleccionar al menos un día.</div>');
						isValid = false;
					}

					if (isValid) {
						var data = {
							TypeMeetingCode: typeMeetingCode,
							TypeMeetingDescription: $("#txt-type-meeting").val(),
							TypeMeetingStatus: $("#check-status").is(':checked'),
							Users: getUsers(),
							TypeMeetingScheduledDays: getSelectedDays().join(','),
							TypeMeetingFrequency: $("#txt-type-meeting-frequency").val()
						};
						updateTypeMeeting(
							data.TypeMeetingCode,
							data.TypeMeetingDescription,
							data.TypeMeetingStatus
						);
						$('#modal-confirmation').modal('close');
					}
				});
		}
	);
}

/*function showModalEditTypeMeeting() {
	if($("#form-type-meeting").valid()) {
		var typeMeetingCode        = $(this).attr("data-TypeMeetingCode");
		var typeMeetingDescription = $("#txt-type-meeting").val();
		var typeMeetingStatus 	   = $("#check-status").is(':checked');	
	 
	    $('.div-modal').load('Home/Modal',
	        { 
	            ModalId:        "modal-confirmation",
	            ModalClass:     "modal-message modal-info2",
	            ModalHeader:    '<span><i class="material-icons">help_outline</i><label>CONFIRMACIÓN</label></span>',
	            ModalTitle:     " ",
	            ModalBody:      "¿Desea editar tipo de reunión?", 
	            ModalButtonOk:  '<button id="btn-modal-aceppt" class="modal-action waves-effect btn-flat blue white-text">Aceptar</button>'
	        },
	        function() {
	           $('#modal-confirmation').modal({dismissible: false}).modal('open')
	           .one('click', '#btn-modal-aceppt', function (e) {
	            	updateTypeMeeting(typeMeetingCode, typeMeetingDescription, typeMeetingStatus);
	            });
	        }
	    );
	}
}*/ //ANTES
/*================================================================================================================================================================================*/
function showModalDeleteTypeMeeting() {
	var typeMeetingCode          = $(this).attr("data-TypeMeetingCode");
	$('.div-modal').load('Home/Modal',
        { 
            ModalId:        "modal-confirmation",
            ModalClass:     "modal-message modal-info2",
			ModalHeader:    '<span><i class="blue-dark-text material-icons">help_outline</i><label>CONFIRMACIÓN</label></span>',
            ModalTitle:     " ",
            ModalBody:      "¿Desea eliminar tipo de reunión?", 
            ModalButtonOk:  '<button id="btn-modal-aceppt" class="modal-action waves-effect btn-flat blue white-text">Aceptar</button>'
        },
        function() {
           $('#modal-confirmation').modal({dismissible: false}).modal('open')
           .one('click', '#btn-modal-aceppt', function (e) {
            	deleteTypeMeeting(typeMeetingCode);
            });
        }
    );
}
/*================================================================================================================================================================================*/
function getUsers() {
	var users = [];
	$('.txt-username').each(function (index, value) {
		var user = {};
		user.UserId = $(this).attr("data-userid");
		user.UserName = $(this).val();
		users.push(user);
	});
	return users;
} //@AMENDEZ5
/*function getUsers($container) {
	var users = [];
	$container.find('.txt-username').each(function () {
		var user = {};
		user.UserId = $(this).attr("data-userid");
		user.UserName = $(this).val();
		users.push(user);
	});
	return users;
}*/ //ANTES
/*================================================================================================================================================================================*/
function getTypeMeetingDetailByCode(typeMeetingCode) {
	var data = {};
	data.TypeMeetingCode =  typeMeetingCode;
	$.ajax({
		type        : "POST",
		url         : "getTypeMeetingDetailByCode",
		data        : JSON.stringify(data),
		dataType    : 'json',
		contentType : 'application/json; charset=utf-8',
		async       : true,
		success     : function (response) {
			var responseJson = $.parseJSON(response);
			if(responseJson.TypeMeetingDetail) {
				$(".i-delete-user").parent(".input-field").remove();
				nroInputText = 0; // <-- Reinicia el contador //@AMENDEZ5

				for (var i = 0; i < responseJson.TypeMeetingDetail.length; i++) {
					nroInputText++;
					addInputText(
						"i-delete-user",
						"txt-username txt-username-" + nroInputText,
						"txt-username-" + nroInputText,
						"Colaborador",
						$("#div-content-user"),
						true // true = append
					);
					$(".txt-username").eq(i)
						.val(responseJson.TypeMeetingDetail[i].UserName)
						.attr("data-userid", responseJson.TypeMeetingDetail[i].UserId);
					InitAutocompleteUser(".txt-username-" + nroInputText);
				} //@AMENDEZ5

				setTimeout(function () {
					$('input.txt-username').trigger('input');
				}, 300); //@AMENDEZ5
			}			
		},
		error: function(response) {
		}
	});
}
/*================================================================================================================================================================================*/
function insertTypeMeetingDetail(typeMeetingCode, userEntityList) {
	var data = {};
	data.typeMeetingCode 	=  typeMeetingCode;
	data.userEntityList		=  userEntityList;
	return $.ajax({
		type        : "POST",
		url         : "insertTypeMeetingDetail",
		data        : JSON.stringify(data),
		dataType    : 'json',
		contentType : 'application/json; charset=utf-8',
		async       : true,
		error: function(response) {
		}
	});
}
/*================================================================================================================================================================================*/
function deleteTypeMeetingDetail(typeMeetingCode) {
	var data = {};
	data.TypeMeetingCode =  typeMeetingCode;	
	return $.ajax({
		type        : "POST",
		url         : "deleteTypeMeetingDetail",
		data        : JSON.stringify(data),
		dataType    : 'json',
		contentType : 'application/json; charset=utf-8',
		async       : true
	});
}
/*================================================================================================================================================================================*/
function getSelectedDays() {
	var dias = [];
	$('.chip.day-chip.selected').each(function () {
		dias.push($(this).data('value'));
	});
	return dias;
} //@AMENDEZ5
/*================================================================================================================================================================================*/
function InitAutocompleteUser(selector) {
	$(selector).autoComplete({
		minChars: 1,
		autoFocus: true,
		source: function (term, suggest) {
			var selectedUserIds = '';
			$.each(getUsers(), function (i, item) {
				if (item.UserId) {
					selectedUserIds += item.UserId + ",";
				}
			});
			term = term.toLowerCase();
			$.ajax({
				type: "POST",
				url: 'getUserByUserName',
				data: {
					UserName: term,
					selectedUserIds: selectedUserIds == '' ? 0 : selectedUserIds + "0"
				},
				timeout: (60 * 1000),
				success: function (response) {
					var responseJson = $.parseJSON(response);
					var UserArray = [];
					if (responseJson.User && responseJson.User.length > 0) {
						$.each(responseJson.User, function (i, item) {
							// Incluye todos los datos necesarios para el render
							var itemArray = [
								item.UserName,
								item.UserId,
								item.AreaName,
								item.CellName,
								item.EnterpriseName
							];
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
         data-area="${item[2] || ''}"
         data-cell="${item[3] || ''}"
         data-enterprise="${item[4] || ''}"
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
		onSelect: function (e, term, item) {
			$(selector).val(item.data('text'))
				.attr("data-userid", item.data('id'))
				.attr("data-username", item.data('text'))
				.attr("data-area", item.data('area'))
				.attr("data-cell", item.data('cell'))
				.attr("data-enterprise", item.data('enterprise'));
		}
	});

	$(selector).on('blur', function () {
		var userId = $(this).attr("data-userid");
		var userName = $(this).attr("data-username");
		if ($(this).val() != userName) {
			$(this).val("");
			$(this).attr("data-userid", "0");
			$(this).attr("data-username", "0");
		}
	});
}
/*function InitAutocompleteUser(selector) {
	$(selector).autoComplete({
		minChars: 1,
		autoFocus: true,
		source: function(term, suggest){
			var selectedUserIds = '';
			$.each(getUsers(), function(i, item) {
				if(item.UserId) {
					selectedUserIds += item.UserId + ",";
				}
			});
			term = term.toLowerCase();
			$.ajax({
				type: "POST",
				url: 'getUserByUserName',
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
							var itemArray = [item.UserName, item.UserId];
							UserArray.push(itemArray);
						});
						var choices = UserArray;
						var suggestions = [];
						for (i=0;i<choices.length;i++)
							if (~(choices[i][0]+' '+choices[i][1]).toLowerCase().indexOf(term)) suggestions.push(choices[i]);
						suggest(suggestions);
					}
				}
			})
		},
		renderItem: function (item, search){
			search = search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
			var re = new RegExp("(" + search.split(' ').join('|') + ")", "gi");
			return '<div class="autocomplete-suggestion" data-text="'+item[0]+'" data-id="'+item[1]+'" data-val="'+search+'">'+item[0].replace(re, "<b>$1</b>")+'</div>';
		},
		onSelect: function(e, term, item){
			$(selector).val(item.data('text')).attr("data-userid", item.data('id'));
		}
	});

	$(selector).on('blur', function() {
		var userId = $(this).attr("data-userid");
		if(userId == null) {
			$(this).val("")
		}
	});
}*/
/*================================================================================================================================================================================*/
function getAllAreaModal(withAll, callback) {
	$.ajax({
		url: baseUrl + '/getAllArea',
		type: 'GET',
		dataType: 'json',
		success: function (response) {
			var $select = $("#cbo-area-modal");
			if ($select.parent().hasClass("select-wrapper")) {
				var $wrapper = $select.parent();
				$wrapper.after($select);
				$wrapper.remove();
			}
			$select.empty();
			$select.append('<option value="" disabled selected>Seleccionar...</option>');
			if (withAll) {
				$select.append('<option value="0">* Todos</option>');
			}
			if (response.Area && response.Area.length > 0) {
				$.each(response.Area, function (i, item) {
					$select.append('<option value="' + item.AreaId + '">' + item.AreaName + '</option>');
				});
			}
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
			console.error("Error al obtener áreas (modal):", error);
		}
	});
}
/*================================================================================================================================================================================*/
function getCellByAreaIdModal(areaId, callback) {
	$.ajax({
		url: UrlApi + '/getCellByAreaId/' + areaId,
		type: 'GET',
		dataType: 'json',
		headers: headersApi,
		success: function (response) {
			var $select = $("#cbo-cell-modal");
			if ($select.parent().hasClass("select-wrapper")) {
				var $wrapper = $select.parent();
				$wrapper.after($select);
				$wrapper.remove();
			}
			$select.empty();
			$select.append('<option value="" selected>Seleccionar...</option>');
			if (response.Cell && response.Cell.length > 0) {
				$.each(response.Cell, function (i, item) {
					$select.append('<option value="' + item.CellId + '">' + item.CellName + '</option>');
				});
			}
			// Si el área es "GERENCIA INDUSTRIAL", elimina la opción "DESMONTAJE DE ACTIVOS"
			var areaText = $("#cbo-area-modal option:selected").text().trim().toUpperCase();
			if (areaText === "GERENCIA INDUSTRIAL") {
				$("#cbo-cell-modal option").filter(function () {
					return $(this).text().trim().toUpperCase() === "DESMONTAJE DE ACTIVOS";
				}).remove();
			}

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
			console.error("Error al obtener células (modal):", error);
		}
	});
}
/*================================================================================================================================================================================*/
function cargarTypeMeetingsCacheGlobal(callback) {
	$.ajax({
		type: "POST",
		url: "getAllTypeMeeting",
		data: JSON.stringify({ areaId: 0, cellId: 0 }), // sin filtros
		dataType: 'json',
		contentType: 'application/json; charset=utf-8',
		success: function (response) {
			var json = typeof response === "string" ? JSON.parse(response) : response;
			window.typeMeetingsCacheGlobal = json.TypeMeeting || [];
			if (typeof callback === "function") callback();
		}
	});
} //21/8
/*================================================================================================================================================================================*/
function validarDuplicidadTypeMeeting() { //21/8
	var $input = $('#txt-type-meeting');
	var value = $input.val().trim().toUpperCase();
	var areaId = $('#cbo-area-modal').val();
	var cellId = $('#cbo-cell-modal').val();

	$('#error-duplicate-type-meeting').remove();

	if (!value) return;

	// Usa la caché global completa
	var cache = window.typeMeetingsCacheGlobal || [];
	if (!Array.isArray(cache) || cache.length === 0) return;

	var isDuplicate = cache.some(function (item) {
		var itemDesc = (item.TypeMeetingDescription || '').trim().toUpperCase();
		var itemArea = (item.AreaId != null ? String(item.AreaId) : '');
		var itemCell = (item.CellId != null ? String(item.CellId) : '');

		var editingCode = $('#form-modal').data('editing-code');
		if (editingCode && item.TypeMeetingCode === editingCode) return false;

		if (itemDesc === value) {
			if (isEmptyCell(cellId) && isEmptyCell(itemCell) && itemArea === areaId) {
				return true;
			}
			if (!isEmptyCell(cellId) && !isEmptyCell(itemCell) && itemArea === areaId && itemCell === cellId) {
				return true;
			}
		}
		return false;
	});

	if (isDuplicate) {
		$input.after('<div id="error-duplicate-type-meeting" class="error2" style="color:#d32f2f;margin-top:0px;">Este tipo de reunión ya existe en el área y célula seleccionados.</div>');
	}
}
/*================================================================================================================================================================================*/

