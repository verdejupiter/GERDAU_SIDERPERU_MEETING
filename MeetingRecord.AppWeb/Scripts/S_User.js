/*================================================================================================================================================================================*/
/**
 * @fileOverview    Script Usuario
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
var nroInputText  = 0;
/*================================================================================================================================================================================*/
/**
 * Inicializa jquery eventos y funciones
 */
$(document).ready(function() {
	// Verificar si la sesión ah expirado
    checkSessionExpired();
    
	//validator = validateFormUser(); //ANTES
	datatable = getAllMEUser();
	//InitSelect2('#cbo-user-role','Seleccione...', null); //ANTES
	//initAutocompleteUser("#txt-user"); //ANTES

	//21/8
	initAutocompleteUser("#txt-user", null);
	$(document).on('keyup','#txt-user', function(){$(this).val($(this).val().toUpperCase()); });

	/*$("#btn-add-user").on("click", showFormAddMEUser)
	.tooltip({delay: 50, tooltip: "Agregar", position: "top"});*/ //ANTES

	$("#btn-add-user").on("click", showModalAddMEUser)
		.tooltip({ delay: 50, tooltip: "Agregar Administrador", position: "top" }); //@AMENDEZ5

	//$(document).on("click", "#btn-insert-user", showModalAddMEUser); //ANTES
	//$(document).on("click", "#btn-update-user", showModalEditMEUser); //ANTES

	//$(document).on("click", ".a-edit-user", showFormEditMEUser); //ANTES
	$(document).on("click", ".a-edit-user", showModalEditMEUser); //@AMENDEZ5
	$(document).on("click", ".a-delete-user", showModalDeleteMEUser); 

	/*$("#check-status").on("click", function() {
		$(".badge-status").html($(this).is(':checked') == true ?
			'<span class="new badge green">Activo</span>' : '<span class="new badge red">Inactivo</span>');		
	});*/
});
/*================================================================================================================================================================================*/
function validateFormUser() {
	return $("#form-modal").validate({
			errorClass: "error2", //@AMENDEZ5
			rules: {
				"txt-user": {required: true }
			},
			messages: {
				"txt-user":{required: "Nombre es obligatorio"}
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
}
/*================================================================================================================================================================================*/
function getAllMEUser() {
	return $("#datatable-user").DataTable({
		"bDestroy" : true,
        "responsive": true,
        "bAutoWidth": true, 
        "bFilter": false,
        "paging":   true,
        "ordering": false,
        "info":     false, 
        "bLengthChange" : false,
        "iDisplayLength": 50,        
        "language": {"url": "Content/library/datatable/language/Spanish.json"},
        "ajax":{
			dataSrc: function (json) {
				json = JSON.parse(json);
				return json.User;
			},
            "type"   : "POST",
            "url"    : 'getAllMEUser',
            "async"  : false,            
        },
        "aoColumns": [
			//{"data":"RowNumber", "title": "N°","sClass": "text-center-vh", "sWidth": "1%"}, //ANTES
            {"data":"UserName", "title": "Nombre","sClass": "text-center-vh", "sWidth": "35%"},
            {"data":"UserNetName", "title": "Usuario red","sClass": "text-center-vh", "sWidth": "20%"},
			{"data": "ME_UserRoleName", "title": "Rol",  "sClass": "text-center-vh", "sWidth": "20%",
				"mRender": function (data, type, full) {
					return '<div class="rol-label">' + data + '</div>';
				}
			}, //@AMENDEZ5
			{"data": null, "title": "Estado", "sClass": "text-center-vh", "sWidth": "7%",
				"mRender": function (data, type, full) {
					var isActive = data["UserStatus"] === true || data["UserStatus"] === "true" || data["UserStatus"] == 1;
					var badge = isActive
						? '<span class="new badge green">Activo</span>'
						: '<span class="new badge red">Inactivo</span>';
					return '<div style="display:flex;justify-content:center;align-items:center;height:100%;">' + badge + '</div>';
				}
			}, //@AMENDEZ5
			{"data": null, "title": "Opciones", "sClass": "text-center-vh", "sWidth": "7%",
				"mRender": function (data, type, full) {
					// Si es un administrador fijo (UserRole = 2), no mostrar opciones de editar/eliminar
					if (data["ME_UserRole"] == 2) {
						return '<div class="buttons-preview">' +
							'<span class="grey-text"><i class="material-icons" title="Administrador fijo">lock</i></span>' +
							'</div>';
					}
					return '<div class="buttons-preview">' +
						'<a href="javascript:void(0);" class="a-edit a-edit-user activator" data-UserId="' + data["UserId"] + '" ' +
						'data-UserName="' + data["UserName"] + '" data-UserRole="' + data["UserRole"] + '" data-UserStatus="' + data["UserStatus"] + '">' +
						'<i class="material-icons">mode_edit</i></a>' +
						'<a href="javascript:void(0);" class="a-delete a-delete-user" data-UserId="' + data["UserId"] + '"><i class="material-icons">delete_forever</i></a>' +
						'</div>';
				} //@AMENDEZ5
			}
        ],
		"fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
			// Aplica negro a todas las celdas excepto la última (opciones)
			$(nRow).find('td:not(:last-child)').addClass('black-text'); // @AMENDEZ5

            $('.a-edit-user', nRow).tooltip({delay: 50, tooltip: "Editar", position: "top"});
            $('.a-delete-user', nRow).tooltip({delay: 50, tooltip: "Eliminar", position: "top"});
        }
    });
}
/*================================================================================================================================================================================*/
function getUserModalBody() {
	return (
		'<div class="col s12">' +
		// Estado
		'<div class="row" style="padding-top: 8px;">' +
		'<label class="input-field-with-icon label" style="position:relative;top:-0.3rem;left:0;font-size:1.0rem !important;font-weight:bold !important;color:#9e9e9e;background-color:transparent;padding:0 0.5rem;">Estado: </label>' +
		'<label class="switch" style="margin-left:10px;">' +
		'<input id="check-status" type="checkbox" class="switch-option-check">' +
		'<span class="slider round"></span>' +
		'<div class="badge-status"></div>' +
		'</label>' +
		'</div>' +
		// Usuario
		'<div class="row" style="padding-top: 20px;">' +
		'<div class="input-field-with-icon col s12 m12 l12">' +
		'<input name="txt-user" id="txt-user" type="text" autocomplete="off">' +
		'<label for="txt-user" class="active">Nombre</label>' +
		'</div>' +
		'</div>' +
		// Rol
		'<div class="row" style="padding-top: 18px;">' +
		'<div class="input-field-with-icon col s12 m12 l6">' +
		'<input type="text" id="txt-user-role" name="txt-user-role" value="ADMINISTRADOR" readonly style="background-color: #f5f5f5 !important;">' +
		'<label for="txt-user-role" class="active">Rol</label>' +
		'</div>' +
		'</div>' +

		'</div>'
	);
} //@AMENDEZ5
/*================================================================================================================================================================================*/
/*function showFormAddMEUser() {
    validator.resetForm();
    setTimeout(function(){$("#txt-user").val("").removeAttr("disabled").focus(); }, 200);
	$(".title-user").text("Agregar usuario");
	$("#cbo-user-role").val(1).trigger("change");
	$("#check-status").prop("checked", true);
	$(".badge-status").html('<span class="new badge green">Activo</span>');
	$(".div-content-btn").html('<button type="submit" id="btn-insert-user" class="waves-effect waves-light btn blue gradient-shadow right" style="padding-left: 8px; padding-right: 10px;">'
                                    +'<i class="material-icons left" style="margin-right: 5px;">save</i> Guardar'
                                +'</button>');
}*/ //ANTES
/*================================================================================================================================================================================*/
/*function showFormEditMEUser() {
	var userId     = $(this).attr("data-UserId");
	var userName   = $(this).attr("data-UserName");
	var userStatus = $(this).attr("data-UserStatus");
	userStatus     = (userStatus == 'true');
	$(".title-user").text("Editar usuario");
	$("#cbo-user-role").val(1).trigger("change");
	$("#check-status").prop("checked", userStatus);
	if($("#check-status").is(':checked')) {
		$(".badge-status").html('<span class="new badge green">Activo</span>');
	}
	else {
		$(".badge-status").html('<span class="new badge red">Inactivo</span>');
	}
	
	$("#txt-user").val(userName).attr("disabled", "disabled")
	.attr("data-userid", userId);
	$("#label-user").addClass("active");
	
	$(".div-content-btn").html('<button type="submit" id="btn-update-user"'
								+'class="waves-effect waves-light btn blue gradient-shadow right" style="padding-left: 8px; padding-right: 10px;">'
								+'<i class="material-icons left" style="margin-right: 5px;">save</i> Guardar'
								+'</button>');
}*/ //ANTES
/*================================================================================================================================================================================*/
function showModalAddMEUser() { //21/8
	var body = getUserModalBody();
	$('.div-modal').load('Home/Modal',{
		ModalId: "modal-confirmation",
		ModalClass: "modal modal-info2",
		ModalHeader: '<div style="border-bottom:1px solid #e0e6ed; margin-bottom:18px;"><span><label>Agregar usuario</label></span></div>',
		ModalTitle: "",
		ModalBody: '<form id="form-modal" onsubmit="return false;">' + body + '</form>',
		ModalButtonOk:
			'<button type="submit" id="btn-modal-aceppt" class="modal-action waves-effect btn-flat blue white-text">GUARDAR</button>' 
	},
	function () {
		validator = validateFormUser();
		InitSelect2('#cbo-user-role', 'Seleccione...', null);
		initAutocompleteUser("#txt-user");
		//21/8
		// Validación en tiempo real de duplicados
		$("#txt-user").on("input", function () {
			var nuevoNombre = $(this).val().trim().toUpperCase();
			var existe = false;
			datatable.rows().every(function () {
				var data = this.data();
				if (data.UserName && data.UserName.trim().toUpperCase() === nuevoNombre) {
					existe = true;
					return false; // break
				}
			});
			$(this).next('.error2').remove();

			if (!nuevoNombre) {
				return;
			}

			if (existe) {
				$(this).after('<div class="error2" style="color:#d32f2f;">Este usuario ya es administrador</div>');
			}
		});

		$("#check-status").prop("checked", true);
		$(".badge-status").html('<span class="new badge green">Activo</span>');
		$("#check-status").on("click", function () {
			$(".badge-status").html($(this).is(':checked')
				? '<span class="new badge green">Activo</span>'
				: '<span class="new badge red">Inactivo</span>');
		});
		$('#modal-confirmation').modal({ dismissible: false }).modal('open');
		// Manejo del submit
		$('#btn-modal-aceppt').on('click', function (e) {
			e.preventDefault();

			// Validación de duplicado
			var nuevoNombre = $("#txt-user").val().trim().toUpperCase();
			var existe = false;
			datatable.rows().every(function () {
				var data = this.data();
				if (data.UserName && data.UserName.trim().toUpperCase() === nuevoNombre) {
					existe = true;
					return false; // break
				}
			});
			$("#txt-user").next('.error2').remove();
			if (existe) {
				$("#txt-user").after('<div class="error2" style="color:#d32f2f;">Este usuario ya es administrador</div>');
				return;
			}
			if ($("#form-modal").valid()) {
				insertMEUser();
			}
		});
	});
} //@AMENDEZ5
/*function showModalInsertMEUser() {
	if($("#form-user").valid()) {
	    $('.div-modal').load('Home/Modal',
	        { 
	            ModalId:        "modal-confirmation",
	            ModalClass:     "modal-message modal-info2",
	            ModalHeader:    '<span><i class="material-icons">help_outline</i><label>CONFIRMACIÓN</label></span>',
	            ModalTitle:     " ",
	            ModalBody:      "¿Desea guardar usuario?", 
	            ModalButtonOk:  '<button id="btn-modal-aceppt" class="modal-action waves-effect btn-flat blue white-text">Aceptar</button>'
	        },
	        function() {
	           $('#modal-confirmation').modal({dismissible: false}).modal('open')
	           .one('click', '#btn-modal-aceppt', function (e) {
	            	insertMEUser();
	            });
	        }
	    );
	}
}*/ //ANTES
/*================================================================================================================================================================================*/
function showModalEditMEUser() {
	var userId = $(this).attr("data-UserId");
	var userName = $(this).attr("data-UserName");
	var userRole = $(this).attr("data-UserRole");
	var userStatus = $(this).attr("data-UserStatus") == "true";

	var body = getUserModalBody();
	$('.div-modal').load('Home/Modal', {
		ModalId: "modal-confirmation",
		ModalClass: "modal modal-info2",
		ModalHeader: '<div style="border-bottom:1px solid #e0e6ed; margin-bottom:18px;"><span><label>Editar usuario</label></span></div>',
		ModalTitle: "",
		ModalBody: '<form id="form-modal" onsubmit="return false;">' + body + '</form>',
		ModalButtonOk: '<button type="submit" id="btn-modal-aceppt" class="modal-action waves-effect btn-flat blue white-text">Guardar</button>'
	}, function () {
		validator = validateFormUser();
		InitSelect2('#cbo-user-role', 'Seleccione...', null);
		initAutocompleteUser("#txt-user");
		$("#txt-user").val(userName).attr("data-userid", userId).attr("disabled", "disabled");
		$("#label-user").addClass("active");
		$("#cbo-user-role").val(userRole).trigger("change");
		$("#check-status").prop("checked", userStatus);
		$(".badge-status").html(userStatus
			? '<span class="new badge green">Activo</span>'
			: '<span class="new badge red">Inactivo</span>');
		$("#check-status").on("click", function () {
			$(".badge-status").html($(this).is(':checked')
				? '<span class="new badge green">Activo</span>'
				: '<span class="new badge red">Inactivo</span>');
		});
		$('#modal-confirmation').modal({ dismissible: false }).modal('open');
		$('#btn-modal-aceppt').on('click', function (e) {
			e.preventDefault();
			if ($("#form-modal").valid()) {
				updateMEUser();
			}
		});
	});
} //@AMENDEZ5
/*function showModalEditMEUser() {
	if($("#form-user").valid()) {
	    $('.div-modal').load('Home/Modal',
	        { 
	            ModalId:        "modal-confirmation",
	            ModalClass:     "modal-message modal-info2",
	            ModalHeader:    '<span><i class="material-icons">help_outline</i><label>CONFIRMACIÓN</label></span>',
	            ModalTitle:     " ",
	            ModalBody:      "¿Desea guardar usuario?", 
	            ModalButtonOk:  '<button id="btn-modal-aceppt" class="modal-action waves-effect btn-flat blue white-text">Aceptar</button>'
	        },
	        function() {
	           $('#modal-confirmation').modal({dismissible: false}).modal('open')
	           .one('click', '#btn-modal-aceppt', function (e) {
	            	updateMEUser();
	            });
	        }
	    );
	}
}*/ //ANTES
/*================================================================================================================================================================================*/
function showModalDeleteMEUser() {
	var userId          = $(this).attr("data-UserId");
	$('.div-modal').load('Home/Modal',
        { 
            ModalId:        "modal-confirmation",
            ModalClass:     "modal-message modal-info2",
			ModalHeader:    '<span><i class="blue-dark-text material-icons">help_outline</i><label>CONFIRMACIÓN</label></span>',
            ModalTitle:     " ",
            ModalBody:      "¿Desea eliminar usuario?", 
            ModalButtonOk:  '<button id="btn-modal-aceppt" class="modal-action waves-effect btn-flat blue white-text">Aceptar</button>'
        },
        function() {
           $('#modal-confirmation').modal({dismissible: false}).modal('open')
           .one('click', '#btn-modal-aceppt', function (e) {
            	deleteMEUser(userId);
            });
        }
    );
}
/*================================================================================================================================================================================*/
function getUsers() {
	var users = [];
	$.each(datatable.rows().data(), function(i, item) {
		var user      = {};
		user.UserId   = item.UserId;
		user.UserName = item.UserName;
		users.push(user);
	});
	return users;
}
/*================================================================================================================================================================================*/
function initAutocompleteUser(selector) {
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
}
/*================================================================================================================================================================================*/
function insertMEUser() {
	if($("#form-modal").valid()) {		
		var data = {};
		data.UserId             =  $("#txt-user").attr("data-UserId");
		data.RegisteredByUserId =  localStorage.getItem("UserId");
		data.UserRole = 1;
		//data.UserRole = $("#cbo-user-role").select2("val"); //ANTES
		data.UserStatus         =  $("#check-status").is(':checked');

		$.ajax({
			type        : "POST",
			url         : "insertMEUser",
			data        : JSON.stringify(data),
			dataType    : 'json',
			contentType : 'application/json; charset=utf-8',
			async       : true,
			success     : function (response) {
				$('#modal-confirmation').modal('close');
				$(".hide-form").trigger("click");
				datatable.ajax.reload();
				showAlertMessage($(".div-alert-message"), "light-green", "check", "Éxito :",
					"Se agregó satisfactoriamente", 3000);
			},
			error: function(response) {
			}
		});
	}
}
/*================================================================================================================================================================================*/
function updateMEUser() {
	if($("#form-modal").valid()) {
		var data = {};
		data.UserId          =  $("#txt-user").attr("data-UserId");
		data.UpdatedByUserId =  localStorage.getItem("UserId");
		//data.UserRole = $("#cbo-user-role").select2("val"); //ANTES
		data.UserRole = $("#cbo-user-role").val();
		data.UserStatus      =  $("#check-status").is(':checked');

		$.ajax({
			type        : "POST",
			url         : "updateMEUser",
			data        : JSON.stringify(data),
			dataType    : 'json',
			contentType : 'application/json; charset=utf-8',
			async       : true,
			success     : function (response) {
				$('#modal-confirmation').modal('close');
				$(".hide-form").trigger("click");
				datatable.ajax.reload();
				showAlertMessage($(".div-alert-message"), "light-green", "edit", "Éxito :", "Se editó satisfactoriamente", 3000);
			},
			error: function(response) {
			}
		});
	}
}
/*================================================================================================================================================================================*/
function deleteMEUser(userId) {
	var data    = {};
	data.UserId = userId;
	$.ajax({
		type        : "POST",
		url         : "deleteMEUser",
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
function initAutocompleteUser(selector, users) {
	$(selector).autoComplete({
		minChars: 1,
		autoFocus: true,
		source: function (term, suggest) {
			var selectedUserIds = '';
			if (users != null) {
				$.each(users, function (i, item) {
					if (item.UserId) {
						selectedUserIds += item.UserId + ",";
					}
				});
			}
			term = term.toLowerCase();
			$.ajax({
				type: "POST",
				url: baseUrl + '/getUserByUserName',
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
		onSelect: function (e, term, item) {
			$(selector).val(item.data('text'))
				.attr("data-userid", item.data('id'))
				.attr("data-username", item.data('text'))
				.attr("data-area", item.data('area'))
				.attr("data-cell", item.data('cell'))
				.attr("data-enterprise", item.data('enterprise'));

			// Validación de duplicado al seleccionar del autocomplete
			var nuevoNombre = item.data('text').trim().toUpperCase();
			var existe = false;
			datatable.rows().every(function () {
				var data = this.data();
				if (data.UserName && data.UserName.trim().toUpperCase() === nuevoNombre) {
					existe = true;
					return false; // break
				}
			});
			$(selector).next('.error2').remove();
			if (existe) {
				$(selector).after('<div class="error2" style="color:#d32f2f;">Este usuario ya es administrador</div>');
			}
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