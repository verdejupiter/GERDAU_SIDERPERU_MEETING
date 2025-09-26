/*================================================================================================================================================================================*/
/**
 * @fileOverview    Script LocationMeeting
 * @author          ANGELY YAHAYRA MENDEZ CRUZ
 * @version         1.1.1
 * @updateAt        27/08/2025
*/
/*================================================================================================================================================================================*/
// Variables globales
var datatable;
var validator;
/*================================================================================================================================================================================*/
/**
 * Inicializa jquery eventos y funciones
 */
$(document).ready(function () {
    checkSessionExpired();

    datatable = getAllLocationMeeting();

    $("#btn-add-location").on("click", showModalAddLocationMeeting)
        .tooltip({ delay: 50, tooltip: "Agregar Lugar", position: "top" });

    $(document).on("click", ".a-edit-location", showModalEditLocationMeeting);
    $(document).on("click", ".a-delete-location", showModalDeleteLocationMeeting);

    //21/8
    $(document).on('keyup', '#txt-location-name', function () { $(this).val($(this).val().toUpperCase()); });

    var userRole = parseInt(localStorage.getItem("UserRole")) || 0;
    const areaId = localStorage.getItem('AreaId');

    if (userRole === 2) {
        $(".btn-clear-filters-location-meeting").show();
    } else {
        $(".btn-clear-filters-location-meeting").hide();
    }

    initAreaCellFilters();

    $(".btn-clear-filters-location-meeting").off("click").on("click", function () {
        // Solo userRole 2 puede limpiar
        getAllArea(true, function () {
            $("#cbo-area").val("").prop("disabled", false).trigger("change");
            if (datatable) datatable.ajax.reload();
        });
    });

    $("#cbo-area").off("change.initFormSelect2").on("change.initFormSelect2", function () {
        if (datatable) datatable.ajax.reload();
    });
    //21/8

});
/*================================================================================================================================================================================*/
function initAreaCellFilters() { //21/8
    var userRole = parseInt(localStorage.getItem("UserRole")) || 0;
    const areaId = localStorage.getItem('AreaId');

    getAllArea(true, function () {
        if (userRole === 1) {
            // Solo su área, combo deshabilitado
            $("#cbo-area").val(areaId).prop("disabled", true).trigger("change");
        } else if (userRole === 2) {
            // Selecciona "Todos" y combo habilitado
            $("#cbo-area").val(0).prop("disabled", false).trigger("change");
        } else {
            $("#cbo-area").val("").prop("disabled", true);
        }
    });

    $('#cbo-area').select2({ theme: "bootstrap", minimumResultsForSearch: 0 });
}
/*================================================================================================================================================================================*/
function validateFormLocation() {
    return $("#form-modal").validate({
        errorClass: "error2",
        rules: {
            "txt-location-name": { required: true },
            "cbo-area-modal": { required: true }
        },
        messages: {
            "txt-location-name": { required: "Nombre de la sala es obligatorio" },
            "cbo-area-modal": { required: "Área es obligatoria" }
        },
        errorElement: 'div',
        errorPlacement: function (error, element) {
            if (element.attr("id") === "cbo-area") {
                element.parent().append(error);
            } else {
                error.insertAfter(element);
            }
        }
    });
}
/*================================================================================================================================================================================*/
function getAllLocationMeeting() {
    return $("#datatable-location").DataTable({
        "bDestroy": true,
        "responsive": true,
        "bAutoWidth": true,
        "bFilter": false,
        "paging": true,
        "ordering": false,
        "info": false,
        "bLengthChange": false,
        "iDisplayLength": 50,
        "language": { "url": "Content/library/datatable/language/Spanish.json" },
        "ajax": {
            dataSrc: function (json) {
                json = JSON.parse(json);
                return json.LocationMeeting;
            },
            "type": "POST",
            "url": 'getAllLocationMeeting',
            "async": false,
            "data": function (d) {
                const cboAreaId = Number($("#cbo-area").val());
                d.areaId = (cboAreaId > 0) ? cboAreaId : 0;
            }
        },
        "aoColumns": [
            { "data": "LocationName", "title": "Nombre de la Sala", "sClass": "text-center-vh", "sWidth": "40%" },
            { "data": "AreaName", "title": "Área", "sClass": "text-center-vh", "sWidth": "30%" },
            {
                "data": "LocationStatus", "title": "Estado", "sClass": "text-center-vh", "sWidth": "10%",
                "mRender": function (data) {
                    var isActive = data === true || data === "true" || data == 1;
                    var badge = isActive
                        ? '<span class="new badge green">Activo</span>'
                        : '<span class="new badge red">Inactivo</span>';
                    return '<div style="display:flex;justify-content:center;align-items:center;height:100%;">' + badge + '</div>';
                }
            },
            {
                "data": null, "title": "Opciones", "sClass": "text-center-vh", "sWidth": "10%",
                "mRender": function (data) {
                    return '<div class="buttons-preview">'
                        + '<a href="javascript:void(0);" class="a-edit a-edit-location activator" data-LocationCode="' + data["LocationCode"] + '" data-LocationName="' + data["LocationName"] + '" data-AreaId="' + data["AreaId"] + '" data-LocationStatus="' + data["LocationStatus"] + '">'
                        + '<i class="material-icons">mode_edit</i></a>'
                        + '<a href="javascript:void(0);" class="a-delete a-delete-location" data-LocationCode="' + data["LocationCode"] + '"><i class="material-icons">delete_forever</i></a>'
                        + '</div>';
                }
            }
        ],
        "fnRowCallback": function (nRow) {
            $(nRow).find('td:not(:last-child)').addClass('black-text');
            $('.a-edit-location', nRow).tooltip({ delay: 50, tooltip: "Editar", position: "top" });
            $('.a-delete-location', nRow).tooltip({ delay: 50, tooltip: "Eliminar", position: "top" });
        }
    });
}
/*================================================================================================================================================================================*/
function getLocationModalBody() {
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
        // Nombre de la sala
        '<div class="row" style="padding-top: 20px;">' +
        '<div class="input-field-with-icon col s12 m12 l12">' +
        '<input name="txt-location-name" id="txt-location-name" type="text" autocomplete="off">' +
        '<label for="txt-location-name" class="active">Nombre de la Sala</label>' +
        '</div>' +
        '</div>' +
        // Área
        '<div class="row" style="padding-top: 18px;">' +
        '<div class="input-field-with-icon col s12 m12 l8">' +
        '<label for="cbo-area-modal" class="active">Área</label>' +
        '<select id="cbo-area-modal" name="cbo-area-modal" class="browser-default" style="background-color: white !important; border: 1px solid #ccc; height: 36px;"></select>' +
        '</div>' +
        '</div>' +
        '</div>'
    );
}
/*================================================================================================================================================================================*/
function showModalAddLocationMeeting() {
    var body = getLocationModalBody();
    $('.div-modal').load('Home/Modal', {
        ModalId: "modal-confirmation",
        ModalClass: "modal modal-info2",
        ModalHeader: '<div style="border-bottom:1px solid #e0e6ed; margin-bottom:18px;"><span><label>Agregar Lugar</label></span></div>',
        ModalTitle: "",
        ModalBody: '<form id="form-modal" onsubmit="return false;">' + body + '</form>',
        ModalButtonOk:
            '<button type="submit" id="btn-modal-aceppt" class="modal-action waves-effect btn-flat blue white-text">GUARDAR</button>'
    }, function () {
        $("#cbo-area-modal").empty();

        userRole = parseInt(localStorage.getItem("UserRole")) || 0;
        const areaId = localStorage.getItem('AreaId');

        getAllAreaModal(false, function () {
            // Elimina opción "Todos" si existe
            $("#cbo-area-modal option[value='0']").remove();
            // Asegura opción "Seleccionar..."
            if ($("#cbo-area-modal option[value='']").length === 0) {
                $("#cbo-area-modal").prepend('<option value="" selected disabled>Seleccionar...</option>');
            }

            if (userRole === 1) {
                // Precarga área y deshabilita solo el combo de área
                $("#cbo-area-modal").val(areaId).prop("disabled", true).trigger("change");
            } else if (userRole === 2) {
                // Habilita el combo de área y deja en "Seleccionar..."
                $("#cbo-area-modal").val("").prop("disabled", false).trigger("change");
            } else {
                // Otros roles: deshabilita solo el combo de área
                $("#cbo-area-modal").prop("disabled", true);
            }
        });

        /*$("#cbo-area").empty();
        //getAllArea(false);*/
        setTimeout(function () {
            /*$("#cbo-area option[value='0']").remove();
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
            });*/

            validator = validateFormLocation();

            $('#btn-modal-aceppt').off('click').on('click', function (e) {
                e.preventDefault();
                var isValid = $("#form-modal").valid();
                if (!isValid) return;
                insertLocationMeeting();
            });

        }, 200);

        loadLocationMeetingsCacheGlobal(function () {
            $(document).off('input.duplicateLocationName').on('input.duplicateLocationName', '#txt-location-name', validateLocationNameDuplicate);
            $(document).off('change.duplicateLocationName').on('change.duplicateLocationName', '#cbo-area-modal', function () {
                if ($('#txt-location-name').val().trim() !== "") {
                    validateLocationNameDuplicate();
                }
            });
        });


        $("#check-status").prop("checked", true);
        $(".badge-status").html('<span class="new badge green">Activo</span>');
        $("#check-status").on("click", function () {
            $(".badge-status").html($(this).is(':checked')
                ? '<span class="new badge green">Activo</span>'
                : '<span class="new badge red">Inactivo</span>');
        });
        $('#modal-confirmation').modal({ dismissible: false }).modal('open');
    });
}
/*================================================================================================================================================================================*/
function showModalEditLocationMeeting() {
    var locationCode = $(this).attr("data-LocationCode");
    var locationName = $(this).attr("data-LocationName");
    var areaId = $(this).attr("data-AreaId");
    var locationStatus = $(this).attr("data-LocationStatus") == "true" || $(this).attr("data-LocationStatus") == 1;

    var body = getLocationModalBody();
    $('.div-modal').load('Home/Modal', {
        ModalId: "modal-confirmation",
        ModalClass: "modal modal-info2",
        ModalHeader: '<div style="border-bottom:1px solid #e0e6ed; margin-bottom:18px;"><span><label>Editar Lugar</label></span></div>',
        ModalTitle: "",
        ModalBody: '<form id="form-modal" onsubmit="return false;">' + body + '</form>',
        ModalButtonOk: '<button type="submit" id="btn-modal-aceppt" class="modal-action waves-effect btn-flat blue white-text">Guardar</button>'
    }, function () {
        /*$("#cbo-area").empty();
        getAllArea(false);*/
        /*setTimeout(function () {
            /*$("#cbo-area option[value='0']").remove();
            if ($("#cbo-area option[value='']").length === 0) {
                $("#cbo-area").prepend('<option value="" selected disabled>Seleccione...</option>');
            }
            $("#cbo-area").val(areaId).trigger("change");

            $("#cbo-area").attr("required", "required");

            $("#cbo-area").on("change", function () {
                var $area = $(this);
                var $select2 = $area.next('.select2');
                if ($area.val() !== "" && $area.val() != null && !$area.find("option:selected").prop("disabled")) {
                    $select2.next('.error2').remove();
                    $area.removeClass("error");
                }
                $(this).valid();
            });*/

            $("#cbo-area-modal").empty();

            var userRole = parseInt(localStorage.getItem("UserRole")) || 0;

            getAllAreaModal(false, function () {
                // Elimina opción "Todos" si existe
                $("#cbo-area-modal option[value='0']").remove();
                // Asegura opción "Seleccionar..."
                if ($("#cbo-area-modal option[value='']").length === 0) {
                    $("#cbo-area-modal").prepend('<option value="" selected disabled>Seleccionar...</option>');
                }

                if (userRole === 1) {
                    // Precarga área y deshabilita solo el combo de área
                    $("#cbo-area-modal").val(areaId).prop("disabled", true).trigger("change");
                } else if (userRole === 2) {
                    // Precarga área seleccionada y combo habilitado
                    $("#cbo-area-modal").val(areaId).prop("disabled", false).trigger("change");
                } else {
                    // Otros roles: deshabilita solo el combo de área
                    $("#cbo-area-modal").prop("disabled", true);
                }

                validator = validateFormLocation();

                $('#btn-modal-aceppt').off('click').on('click', function (e) {
                    e.preventDefault();
                    var isValid = $("#form-modal").valid();
                    if (!isValid) return;
                    updateLocationMeeting(locationCode);
                });

            $('#form-modal').data('editing-code', locationCode); // para evitar autocomparación

                loadLocationMeetingsCacheGlobal(function () {
                    $(document).off('input.duplicateLocationName').on('input.duplicateLocationName', '#txt-location-name', validateLocationNameDuplicate);
                    $(document).off('change.duplicateLocationName').on('change.duplicateLocationName', '#cbo-area-modal', function () {
                        if ($('#txt-location-name').val().trim() !== "") {
                            validateLocationNameDuplicate();
                        }
                    });
                });

            $("#txt-location-name").val(locationName);
            $("#check-status").prop("checked", locationStatus);
            $(".badge-status").html(locationStatus
                ? '<span class="new badge green">Activo</span>'
                : '<span class="new badge red">Inactivo</span>');
            $("#check-status").on("click", function () {
                $(".badge-status").html($(this).is(':checked')
                    ? '<span class="new badge green">Activo</span>'
                    : '<span class="new badge red">Inactivo</span>');
            });
            $('#modal-confirmation').modal({ dismissible: false }).modal('open');
        }, 200);
    });
}
/*================================================================================================================================================================================*/
function showModalDeleteLocationMeeting() {
    var locationCode = $(this).attr("data-LocationCode");
    $('.div-modal').load('Home/Modal',
        {
            ModalId: "modal-confirmation",
            ModalClass: "modal-message modal-info2",
            ModalHeader: '<span><i class="blue-dark-text material-icons">help_outline</i><label>CONFIRMACIÓN</label></span>',
            ModalTitle: " ",
            ModalBody: "¿Desea eliminar el lugar?",
            ModalButtonOk: '<button id="btn-modal-aceppt" class="modal-action waves-effect btn-flat blue white-text">Aceptar</button>'
        },
        function () {
            $('#modal-confirmation').modal({ dismissible: false }).modal('open')
                .one('click', '#btn-modal-aceppt', function (e) {
                    deleteLocationMeeting(locationCode);
                });
        }
    );
}
/*================================================================================================================================================================================*/
function insertLocationMeeting() {
    if ($("#form-modal").valid()) {
        var data = {};
        data.LocationCode = getGeneratedCode("TM");
        data.RegisteredByUserId = localStorage.getItem("UserId");
        data.LocationName = $("#txt-location-name").val();
        data.LocationStatus = $("#check-status").is(':checked');
        data.AreaId = $("#cbo-area-modal").val();

        $.ajax({
            type: "POST",
            url: "insertLocationMeeting",
            data: JSON.stringify(data),
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            async: true,
            success: function (response) {
                $('#modal-confirmation').modal('close');
                $(".hide-form").trigger("click");
                datatable.ajax.reload();
                showAlertMessage($(".div-alert-message"), "light-green", "check", "Éxito :", "Se agregó satisfactoriamente", 3000);
            },
            error: function (xhr, status, error) {
                // Muestra el error en consola y en pantalla
                console.error("Error en insertLocationMeeting:", xhr.responseText);
                //showAlertMessage($(".div-alert-message"), "red", "error", "Error :", "No se pudo guardar. " + xhr.responseText, 5000);
            }
        });
    }
}
/*================================================================================================================================================================================*/
function updateLocationMeeting(locationCode) {
    if ($("#form-modal").valid()) {
        var data = {};
        data.LocationCode = locationCode;
        data.RegisteredByUserId = localStorage.getItem("UserId");
        data.LocationName = $("#txt-location-name").val();
        data.LocationStatus = $("#check-status").is(':checked');
        data.AreaId = $("#cbo-area-modal").val();

        $.ajax({
            type: "POST",
            url: "updateLocationMeeting",
            data: JSON.stringify(data),
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            async: true,
            success: function (response) {
                $('#modal-confirmation').modal('close');
                $(".hide-form").trigger("click");
                datatable.ajax.reload();
                showAlertMessage($(".div-alert-message"), "light-green", "edit", "Éxito :", "Se editó satisfactoriamente", 3000);
            },
            error: function (response) {
            }
        });
    }
}
/*================================================================================================================================================================================*/
function deleteLocationMeeting(locationCode) {
    var data = {};
    data.LocationCode = locationCode;
    $.ajax({
        type: "POST",
        url: "deleteLocationMeeting",
        data: JSON.stringify(data),
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        async: true,
        success: function (response) {
            $('#modal-confirmation').modal('close');
            $(".hide-form").trigger("click");
            datatable.ajax.reload();
            showAlertMessage($(".div-alert-message"), "light-green", "delete", "Éxito :", "Se eliminó satisfactoriamente", 3000);
        },
        error: function (response) {
        }
    });
}
/*================================================================================================================================================================================*/
function getAllAreaModal(withAll, callback) { //21/8
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
function loadLocationMeetingsCacheGlobal(callback) {
    $.ajax({
        type: "POST",
        url: "getAllLocationMeeting",
        data: JSON.stringify({ areaId: 0 }),
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            var json = typeof response === "string" ? JSON.parse(response) : response;
            window.locationMeetingsCacheGlobal = json.LocationMeeting || [];
            if (typeof callback === "function") callback();
        }
    });
}
/*================================================================================================================================================================================*/
function validateLocationNameDuplicate() {
    var $input = $('#txt-location-name');
    var value = $input.val().trim().toUpperCase();
    var areaId = $('#cbo-area-modal').val();
    var editingCode = $('#form-modal').data('editing-code'); // para edición

    // Elimina SIEMPRE el mensaje antes de validar
    $('#error-duplicate-location-name').remove();

    // Si no hay nombre o área, no valida duplicidad
    if (!value || !areaId) return;

    // Validar duplicidad en el área seleccionada
    var cache = window.locationMeetingsCacheGlobal || [];
    if (!Array.isArray(cache) || cache.length === 0) return;

    var isDuplicate = cache.some(function (item) {
        var itemName = (item.LocationName || '').trim().toUpperCase();
        var itemArea = (item.AreaId != null ? String(item.AreaId) : '');
        if (editingCode && item.LocationCode === editingCode) return false;
        return itemName === value && itemArea === areaId;
    });

    if (isDuplicate) {
        $input.after('<div id="error-duplicate-location-name" class="error2" style="color:#d32f2f;margin-top:0px;">Una sala con ese nombre ya existe en el área seleccionada.</div>');
    }
}


