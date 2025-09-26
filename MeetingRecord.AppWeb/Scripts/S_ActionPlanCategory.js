/*================================================================================================================================================================================*/
/**
 * @fileOverview    Script ActionPlanCategory
 * @author          ANGELY YAHAYRA MENDEZ CRUZ
 * @version         1.1.1
 * @updateAt        27/08/2025
*/
/*====================================================================================================================w============================================================*/
// Variables globales
var datatable;
var validator;
/*================================================================================================================================================================================*/
/**
 * Inicializa jquery eventos y funciones
 */
$(document).ready(function () {
    checkSessionExpired();

    datatable = getAllActionPlanCategory();

    $("#btn-add-category").on("click", showModalAddActionPlanCategory)
        .tooltip({ delay: 50, tooltip: "Agregar Categoría", position: "top" });

    $(document).on("click", ".a-edit-category", showModalEditActionPlanCategory);
    $(document).on("click", ".a-delete-category", showModalDeleteActionPlanCategory);

    // Mostrar el botón solo si UserRole == 2
    var userRole = parseInt(localStorage.getItem("UserRole")) || 0;
    if (userRole === 2) {
        $("#btn-add-category").show();
    } else {
        $("#btn-add-category").hide();
    }
});
/*================================================================================================================================================================================*/
function validateFormCategory() {
    return $("#form-modal").validate({
        errorClass: "error2",
        rules: {
            "txt-category-name": { required: true },
        },
        messages: {
            "txt-category-name": { required: "Nombre de la categoría es obligatorio" },
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
function getAllActionPlanCategory() { //21/8
        var userRole = parseInt(localStorage.getItem("UserRole")) || 0;

        var columns = [
            { "data": "ActionPlanCategoryName", "title": "Nombre de la Categoría", "sClass": "text-center-vh", "sWidth": "40%" },
            {
                "data": "ActionPlanCategoryStatus", "title": "Estado", "sClass": "text-center-vh", "sWidth": "10%",
                "mRender": function (data) {
                    var isActive = data === true || data === "true" || data == 1;
                    var badge = isActive
                        ? '<span class="new badge green">Activo</span>'
                        : '<span class="new badge red">Inactivo</span>';
                    return '<div style="display:flex;justify-content:center;align-items:center;height:100%;">' + badge + '</div>';
                }
            }
        ];

        // Solo agrega la columna Opciones si es userRole 2
        if (userRole === 2) {
            columns.push({
                "data": null, "title": "Opciones", "sClass": "text-center-vh", "sWidth": "10%",
                "mRender": function (data) {
                    return '<div class="buttons-preview">'
                        + '<a href="javascript:void(0);" class="a-edit a-edit-category activator" data-ActionPlanCategoryId="' + data["ActionPlanCategoryId"] + '" data-ActionPlanCategoryName="' + data["ActionPlanCategoryName"] + '" data-ActionPlanCategoryStatus="' + data["ActionPlanCategoryStatus"] + '">'
                        + '<i class="material-icons">mode_edit</i></a>'
                        + '<a href="javascript:void(0);" class="a-delete a-delete-category" data-ActionPlanCategoryId="' + data["ActionPlanCategoryId"] + '"><i class="material-icons">delete_forever</i></a>'
                        + '</div>';
                }
            });
        }

        return $("#datatable-category").DataTable({
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
                    return json.ActionPlanCategory;
                },
                "type": "GET",
                "url": 'getAllActionPlanCategory',
                "async": false,
            },
            "aoColumns": columns,
            "fnRowCallback": function (nRow) {
                $(nRow).find('td:not(:last-child)').addClass('black-text');
                $('.a-edit-category', nRow).tooltip({ delay: 50, tooltip: "Editar", position: "top" });
                $('.a-delete-category', nRow).tooltip({ delay: 50, tooltip: "Eliminar", position: "top" });
            }
        });
    }

/*================================================================================================================================================================================*/
function getCategoryModalBody() {
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
        // Nombre de la categoría
        '<div class="row" style="padding-top: 20px;">' +
        '<div class="input-field-with-icon col s12 m12 l12">' +
        '<input name="txt-category-name" id="txt-category-name" type="text" autocomplete="off">' +
        '<label for="txt-category-name" class="active">Nombre de la Categoría</label>' +
        '</div>' +
        '</div>' +
        '</div>'
    );
}
/*================================================================================================================================================================================*/
function showModalAddActionPlanCategory() {
    var body = getCategoryModalBody();
    $('.div-modal').load('Home/Modal', {
        ModalId: "modal-confirmation",
        ModalClass: "modal modal-info2",
        ModalHeader: '<div style="border-bottom:1px solid #e0e6ed; margin-bottom:18px;"><span><label>Agregar Categoría</label></span></div>',
        ModalTitle: "",
        ModalBody: '<form id="form-modal" onsubmit="return false;">' + body + '</form>',
        ModalButtonOk:
            '<button type="submit" id="btn-modal-aceppt" class="modal-action waves-effect btn-flat blue white-text">GUARDAR</button>'
    }, function () {
        validator = validateFormCategory();

        $('#btn-modal-aceppt').off('click').on('click', function (e) {
            e.preventDefault();
            var isValid = $("#form-modal").valid();
            if (!isValid) return;
            insertActionPlanCategory();
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
function showModalEditActionPlanCategory() {
    var actionPlanCategoryId = $(this).attr("data-ActionPlanCategoryId");
    var actionPlanCategoryName = $(this).attr("data-ActionPlanCategoryName");
    var actionPlanCategoryStatus = $(this).attr("data-ActionPlanCategoryStatus") == "true" || $(this).attr("data-ActionPlanCategoryStatus") == 1;

    var body = getCategoryModalBody();
    $('.div-modal').load('Home/Modal', {
        ModalId: "modal-confirmation",
        ModalClass: "modal modal-info2",
        ModalHeader: '<div style="border-bottom:1px solid #e0e6ed; margin-bottom:18px;"><span><label>Editar Categoría</label></span></div>',
        ModalTitle: "",
        ModalBody: '<form id="form-modal" onsubmit="return false;">' + body + '</form>',
        ModalButtonOk: '<button type="submit" id="btn-modal-aceppt" class="modal-action waves-effect btn-flat blue white-text">Guardar</button>'
    }, function () {
        validator = validateFormCategory();

        $('#btn-modal-aceppt').off('click').on('click', function (e) {
            e.preventDefault();
            var isValid = $("#form-modal").valid();
            if (!isValid) return;
            updateActionPlanCategory(actionPlanCategoryId);
        });

        $("#txt-category-name").val(actionPlanCategoryName);

        $("#check-status").prop("checked", actionPlanCategoryStatus);
        $(".badge-status").html(actionPlanCategoryStatus
            ? '<span class="new badge green">Activo</span>'
            : '<span class="new badge red">Inactivo</span>');

        $("#check-status").on("click", function () {
            $(".badge-status").html($(this).is(':checked')
                ? '<span class="new badge green">Activo</span>'
                : '<span class="new badge red">Inactivo</span>');
        });

        $('#modal-confirmation').modal({ dismissible: false }).modal('open');
    });
}
/*================================================================================================================================================================================*/
function showModalDeleteActionPlanCategory() {
    var actionPlanCategoryId = $(this).attr("data-ActionPlanCategoryId");
    $('.div-modal').load('Home/Modal',
        {
            ModalId: "modal-confirmation",
            ModalClass: "modal-message modal-info2",
            ModalHeader: '<span><i class="blue-dark-text material-icons">help_outline</i><label>CONFIRMACIÓN</label></span>',
            ModalTitle: " ",
            ModalBody: "¿Desea eliminar esta categoría?",
            ModalButtonOk: '<button id="btn-modal-aceppt" class="modal-action waves-effect btn-flat blue white-text">Aceptar</button>'
        },
        function () {
            $('#modal-confirmation').modal({ dismissible: false }).modal('open')
                .one('click', '#btn-modal-aceppt', function (e) {
                    deleteActionPlanCategory(actionPlanCategoryId);
                });
        }
    );
}
/*================================================================================================================================================================================*/
function insertActionPlanCategory() {
    if ($("#form-modal").valid()) {
        var data = {};
        data.ActionPlanCategoryId = 0; // Será asignado por la base de datos
        data.ActionPlanCategoryName = $("#txt-category-name").val();
        data.RegisteredByUserId = localStorage.getItem("UserId");
        data.ActionPlanCategoryStatus = $("#check-status").is(':checked'); // Siempre debe ser true

        $.ajax({
            type: "POST",
            url: "insertActionPlanCategory",
            data: JSON.stringify(data),
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            async: true,
            success: function (response) {
                $('#modal-confirmation').modal('close');
                $(".hide-form").trigger("click");
                datatable.ajax.reload();
                showAlertMessage($(".div-alert-message"), "light-green", "check", "Éxito :", "Categoría agregada satisfactoriamente", 3000);
            },
            error: function (xhr, status, error) {
                console.error("Error en insertActionPlanCategory:", xhr.responseText);
                showAlertMessage($(".div-alert-message"), "red", "error", "Error :", "No se pudo guardar la categoría", 5000);
            }
        });
    }
}
/*================================================================================================================================================================================*/
function updateActionPlanCategory(actionPlanCategoryId) {
    if ($("#form-modal").valid()) {
        var data = {};
        data.ActionPlanCategoryId = actionPlanCategoryId;
        data.ActionPlanCategoryName = $("#txt-category-name").val();
        data.RegisteredByUserId = localStorage.getItem("UserId");
        data.ActionPlanCategoryStatus = $("#check-status").is(':checked');

        $.ajax({
            type: "POST",
            url: "updateActionPlanCategory",
            data: JSON.stringify(data),
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            async: true,
            success: function (response) {
                $('#modal-confirmation').modal('close');
                $(".hide-form").trigger("click");
                datatable.ajax.reload();
                showAlertMessage($(".div-alert-message"), "light-green", "edit", "Éxito :", "Categoría actualizada satisfactoriamente", 3000);
            },
            error: function (xhr, status, error) {
                console.error("Error en updateActionPlanCategory:", xhr.responseText);
                showAlertMessage($(".div-alert-message"), "red", "error", "Error :", "No se pudo actualizar la categoría", 5000);
            }
        });
    }
}
/*================================================================================================================================================================================*/
function deleteActionPlanCategory(actionPlanCategoryId) {
    var data = {};
    data.actionPlanCategoryId = actionPlanCategoryId;
    $.ajax({
        type: "POST",
        url: "deleteActionPlanCategory",
        data: JSON.stringify(data),
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        async: true,
        success: function (response) {
            $('#modal-confirmation').modal('close');
            $(".hide-form").trigger("click");
            datatable.ajax.reload();
            showAlertMessage($(".div-alert-message"), "light-green", "delete", "Éxito :", "Categoría eliminada satisfactoriamente", 3000);
        },
        error: function (xhr, status, error) {
            console.error("Error en deleteActionPlanCategory:", xhr.responseText);
            showAlertMessage($(".div-alert-message"), "red", "error", "Error :", "No se pudo eliminar la categoría", 5000);
        }
    });
}
/*================================================================================================================================================================================*/
