/*================================================================================================================================================================================*/
/**
 * @fileOverview    Script ActionPlan
 * @author          ANGELY YAHAYRA MENDEZ CRUZ
 * @version         1.1.1
 * @updateAt        27/08/2025
*/
/*================================================================================================================================================================================*/
// Variables globales
var datatablePending;
var datatableExecuted;
var pickadateExecute;
var areaId = 0;
window.filesToDelete = [];
window.currentScope = "mine";      // Scope inicial mis planes
window.currentTabType = "scheduled"; // Tab inicial pendientes
/*================================================================================================================================================================================*/
/**
 * Inicializa jquery eventos y funciones
 */
$(document).ready(function () {
    // Inicialización de variables
    window.isSearchActive = false;

    var userId = localStorage.getItem("UserId");
    var userRole = parseInt(localStorage.getItem("UserRole")) || 0;

    //window.currentDateFilterType = "scheduled"; // "scheduled" o "executed"

    $("label[for='txt-start-date']").text("Fecha Programada Inicio");
    $("label[for='txt-end-date']").text("Fecha Programada Fin");

    initAutocompleteMeetingCode("#txt-cod-reunion");
    initAutocompleteUser("#txt-responsable", null);
    //21/8
    $(document).on('keyup', '#txt-responsable',
        function () { $(this).val($(this).val().toUpperCase()); });

    checkSessionExpired();
    initDateRange(false);

    $("#txt-start-date").val("");
    $("#txt-end-date").val("");

    initFormSelect2();
    $(document).on('change', '#cbo-area', function () {
        areaId = Number($(this).val()) || 0;
    });
    getAllActionPlanCategoryActive();

    completeSelectorMeetingScope();

    $("#ddl-meeting-scope").on("change", toggleResponsibleFieldVisibility);
    toggleResponsibleFieldVisibility();

    $("#tab-pending").show();
    $("#tab-executed").hide();

    datatablePending = getActionPlanPendingByArgs();
    datatableExecuted = getActionPlanExecutedByArgs();
    $("#ddl-meeting-scope").on("change", function () {
        window.currentScope = $(this).val();
        toggleResponsibleFieldVisibility();

        if (datatablePending) datatablePending.destroy();
        if (datatableExecuted) datatableExecuted.destroy();

        datatablePending = getActionPlanPendingByArgs();
        datatableExecuted = getActionPlanExecutedByArgs();

        // Recargar el datatable del tab activo
        if ($("#tab-pending").is(":visible") && datatablePending) {
            datatablePending.ajax.reload();
        }
        if ($("#tab-executed").is(":visible") && datatableExecuted) {
            datatableExecuted.ajax.reload();
        }
    });

    $("#cbo-estado").html(`
    <option value="" disabled selected>Seleccionar...</option>
    <option value="0">* Todos</option>
    <option value="1">En Proceso</option>
    <option value="2">Fuera de Plazo</option>
`);
    $("#cbo-estado").select2({ theme: "bootstrap", minimumResultsForSearch: 0 });


    $("#a-tab-pending").on("click", function () {
        window.currentTabType = "scheduled";
        if ($("#cbo-estado").parent().hasClass("select-wrapper")) {
            var $select = $("#cbo-estado");
            var $wrapper = $select.parent();
            $wrapper.after($select);
            $wrapper.remove();
        }
        if ($("#cbo-estado").data('select2')) {
            $("#cbo-estado").select2('destroy');
        }
        $("#cbo-estado").html(`
            <option value="" disabled selected>Seleccionar...</option>
            <option value="0">* Todos</option>
            <option value="1">En Proceso</option>
            <option value="2">Fuera de Plazo</option>
        `);
        $("#cbo-estado").select2({ theme: "bootstrap", minimumResultsForSearch: 0 });
        setTimeout(function () {
            $("#cbo-estado").next(".select2-container--bootstrap").find(".select2-selection--single").css({
                "background": "#fff",
                "border": "1px solid #ced4da",
                "height": "36px",
                "min-height": "36px",
                "color": "#555555",
                "padding-left": "12px",
                "display": "flex",
                "align-items": "center",
                "font-size": "14px",
                "box-shadow": "none"
            });
            $("#cbo-estado").next(".select2-container--bootstrap").find(".select2-selection__rendered").css({
                "color": "#555555",
                "line-height": "36px",
                "font-weight": "400"
            });
            $("#cbo-estado").next(".select2-container--bootstrap").find(".select2-selection__arrow").css({
                "height": "36px"
            });
        }, 0);

        window.currentDateFilterType = "scheduled";
        $("#txt-start-date").siblings("label").text("Fecha Programada Inicio");
        $("#txt-end-date").siblings("label").text("Fecha Programada Fin");

        $("#tab-pending").show();
        $("#tab-executed").hide();
        if (datatablePending) {
            datatablePending.ajax.reload(function () {
                $("#datatable-action-plan-pending_wrapper").show();
            });
        }
    });

    $("#a-tab-executed").on("click", function () {
        window.currentTabType = "executed";
        if ($("#cbo-estado").parent().hasClass("select-wrapper")) {
            var $select = $("#cbo-estado");
            var $wrapper = $select.parent();
            $wrapper.after($select);
            $wrapper.remove();
        }
        if ($("#cbo-estado").data('select2')) {
            $("#cbo-estado").select2('destroy');
        }
        $("#cbo-estado").html(`
            <option value="" disabled selected>Seleccionar...</option>
            <option value="0">* Todos</option>
            <option value="3">Cerrado</option>
            <option value="4">Cerrado Fuera de Plazo</option>
        `);
        $("#cbo-estado").select2({ theme: "bootstrap", minimumResultsForSearch: 0 });
        setTimeout(function () {
            $("#cbo-estado").next(".select2-container--bootstrap").find(".select2-selection--single").css({
                "background": "#fff",
                "border": "1px solid #ced4da",
                "height": "36px",
                "min-height": "36px",
                "color": "#555555",
                "padding-left": "12px",
                "display": "flex",
                "align-items": "center",
                "font-size": "14px",
                "box-shadow": "none"
            });
            $("#cbo-estado").next(".select2-container--bootstrap").find(".select2-selection__rendered").css({
                "color": "#555555",
                "line-height": "36px",
                "font-weight": "400"
            });
            $("#cbo-estado").next(".select2-container--bootstrap").find(".select2-selection__arrow").css({
                "height": "36px"
            });
        }, 0);
        window.currentDateFilterType = "executed";
        $("#txt-start-date").siblings("label").text("Fecha Ejecutada Inicio");
        $("#txt-end-date").siblings("label").text("Fecha Ejecutada Fin");

        $("#tab-executed").show();
        $("#tab-pending").hide();
        if (datatableExecuted) {
            datatableExecuted.ajax.reload(function () {
                $("#datatable-action-plan-executed_wrapper").show();
            });
        }
    });

    //validateExecuteActionPlan();
    $("#btn-add-file").on("click", addFile);

    //$(document).on("click", ".btn-delete-file", deleteFile); //ANTES
    //$(document).on("click", ".a-execute-ac", showFormExecuteActionPlan); //ANTES
    $(document).on("click", ".a-execute-ac", function () {
        var actionPlanCode = $(this).attr("data-ActionPlanCode");
        var actionPlanScheduledDate = $(this).attr("data-ActionPlanScheduledDate");
        showModalFormExecuteActionPlan(actionPlanCode, actionPlanScheduledDate);
    });

    $("#btn-execute-action-plan").on("click", showModalExecuteActionPlan);
    $("#btn-add-file").tooltip({ delay: 50, tooltip: "Agregar archivo", position: "right" });
    pickadateExecute = initPickadate($("#txt-executedate-ap"), ".header");
    $(document).on("click", ".a-view-action-plan", showModalViewActionPlanDetail);

    $(".btn-filter-meeting").on("click", searchActionPlans);

    $(".btn-clear-filters").on("click", function () {
        $("#txt-cod-reunion").val("");
        $("#cbo-type-meeting").val("").trigger('change');
        $("#cbo-area").val("").trigger('change');
        $("#cbo-estado").val("").trigger('change');
        $("#cbo-prioridad").val("").trigger('change');
        $("#txt-ap-category").val("").trigger('change');
        $("#txt-start-date").val("");
        $("#txt-end-date").val("");
        $("#txt-responsable").val("").attr("data-userid", "0");

        window.isSearchActive = false;
        if (datatablePending) datatablePending.ajax.reload();
        if (datatableExecuted) datatableExecuted.ajax.reload();
    });

    $("#datatable-action-plan-pending_wrapper").show();
    $("#datatable-action-plan-executed_wrapper").hide();

    $("#btn-export-to-excel").on("click", function () {
        reloadActiveTableAndExport(function () {
            const scope = window.currentScope;
            const tabType = window.currentTabType;

            const ajaxData = {
                meetingCode: $("#txt-cod-reunion").val() || "0",
                actionPlanStatus: $("#cbo-estado").val() || "0",
                actionPlanPriority: $("#cbo-prioridad").val() || "0",
                actionPlanCategoryId: $("#txt-ap-category").val() || "0",
                startDate: $("#txt-start-date").val() ? formatStrDate($("#txt-start-date").val(), 'dd/mm/yyyy', "/") : "1900-01-01",
                endDate: $("#txt-end-date").val() ? formatStrDate($("#txt-end-date").val(), 'dd/mm/yyyy', "/") : "1900-01-01",
                mineScope: scope === "mine",
                responsibleUserId: (scope === "mine" && userId) ? parseInt(userId) : 0,
                userId: (scope === "all") ? $("#txt-responsable").attr("data-userid") || "0" : "0",
                dateFilterType: tabType
            };

            let url = baseUrl + ( tabType === "executed" ?
                "/ActionPlan/getActionPlanExecutedExportToExcel?" :
                "/ActionPlan/getActionPlanPendingExportToExcel?" );

            url += "responsibleUserId=" + ajaxData.responsibleUserId;
            url += "&meetingCode=" + encodeURIComponent(ajaxData.meetingCode);
            url += "&startDate=" + encodeURIComponent(ajaxData.startDate);
            url += "&endDate=" + encodeURIComponent(ajaxData.endDate);
            url += "&userId=" + ajaxData.userId;
            url += "&mineScope=" + ajaxData.mineScope;
            url += "&actionPlanStatus=" + ajaxData.actionPlanStatus;
            url += "&actionPlanPriority=" + encodeURIComponent(ajaxData.actionPlanPriority);
            url += "&actionPlanCategoryId=" + ajaxData.actionPlanCategoryId;
            url += "&dateFilterType=" + encodeURIComponent(ajaxData.dateFilterType);

           window.location.href = url;
        });
    });

    $("#btn-export-to-excel").tooltip({ delay: 50, tooltip: "Exportar a excel", position: "left" });
});
/*================================================================================================================================================================================*/
function reloadActiveTableAndExport(callback) {
    const isExecutedTabActive = $("#tab-executed").hasClass("active");
    const datatable = isExecutedTabActive ? datatableExecuted : datatablePending;
    const alertIndex = isExecutedTabActive ? 1 : 0;

    datatable.ajax.reload(function () {

        if (typeof callback === "function") {
            if (datatable.data().length > 0) {

                showAlertMessage(
                    $(".div-alert-message").eq(alertIndex),
                    "light-green",
                    "insert_drive_file",
                    "Éxito:",
                    "Se exportó satisfactoriamente",
                    5000);

                callback()
            } else {
                showAlertMessage(
                    $(".div-alert-message").eq(alertIndex),
                    "yellow darken-3",
                    "insert_drive_file",
                    "Advertencia:",
                    "No se ha encontrado información, no se pudo exportar",
                    5000);
            }
        };
    });
}
/*================================================================================================================================================================================*/
function getAllActionPlanCategoryActive() {
    $.ajax({
        url: baseUrl + '/getAllActionPlanCategoryActive',
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            if (typeof response === "string") {
                response = JSON.parse(response);
            }
            var $select = $("#txt-ap-category");
            if ($select.hasClass("select2-hidden-accessible")) {
                $select.select2('destroy');
            }
            $select.empty();
            $select.append('<option value="" disabled selected>Seleccionar...</option>');
            $select.append('<option value="0">* Todos</option>');
            if (response.ActionPlanCategory && response.ActionPlanCategory.length > 0) {
                $.each(response.ActionPlanCategory, function (i, item) {
                    $select.append('<option value="' + item.ActionPlanCategoryId + '">' + item.ActionPlanCategoryName + '</option>');
                });
            }
            $select.attr("style", "background-color: white !important; border: 1px solid #ccc; height: 36px; color: #222;");

            if ($.fn.select2 && $select.is(':visible')) {
                $select.select2({
                    theme: "bootstrap",
                    minimumResultsForSearch: 0
                });
                $('.select2-container--bootstrap .select2-selection--single').css({
                    'background-color': '#fff',
                    'border': '1px solid #ccc',
                    'height': '36px',
                    'min-height': '36px',
                    'color': '#222',
                    'padding-left': '12px'
                });
            }
        },
        error: function (xhr, status, error) {
            console.error("Error al obtener categorías:", error);
        }
    });
}
/*================================================================================================================================================================================*/
function completeSelectorMeetingScope() {
    var userRole = parseInt(localStorage.getItem("UserRole")) || 0;
    var $ddl = $("#ddl-meeting-scope");

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
        $ddl.append('<option value="mine">Mis planes de acción</option>');
        $ddl.prop("disabled", true);
    } else if (userRole === 1 || userRole === 2) {
        $ddl.append('<option value="mine">Mis planes de acción</option>');
        $ddl.append('<option value="all">Todos los planes de acción</option>');
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
}
/*================================================================================================================================================================================*/
function toggleResponsibleFieldVisibility() {
    var scope = $("#ddl-meeting-scope").val();

    if (scope === "mine") {
        $(".div-responsable-field").hide();
    } else {
        $(".div-responsable-field").show();
    }
} //@AMENDEZ5
/*================================================================================================================================================================================*/
function searchActionPlans() {
    window.isSearchActive = true;

    $(".div-progress-bar").html('<div class="progress"><div class="indeterminate"></div></div>');

    if (datatablePending) {
        datatablePending.ajax.reload(function () {
            $("#datatable-action-plan-pending_wrapper").show();
        });
    }

    if (datatableExecuted) {
        datatableExecuted.ajax.reload(function () {
            $("#datatable-action-plan-executed_wrapper").show();
            $(".div-progress-bar").empty();
        });
    }
} //@AMENDEZ5
/*================================================================================================================================================================================*/
function selectTypeSearch() {
    if ($(this).is(':checked')) {
        $(".div-search-by-filter").fadeOut("slow", function () {
            $(".div-search-by-id").fadeIn("slow");
            $("#txt-meeting-id").val("").focus();
        });
    }
    else {
        $(".div-search-by-id").fadeOut("slow", function () {
            $("#txt-meeting-id").val("");
            $(".div-search-by-filter").fadeIn("slow");
        });
    }
} //@AMENDEZ5
/*================================================================================================================================================================================*/
function initFormSelect2() {
    //getAllTypeMeetingForRegister(false); //@AMENDEZ5

    //getAllTypeMeeting(true);
    getAllArea(true);
    //InitSelect2('#cbo-cell','Seleccione Célula...', null);
    //$("#cbo-cell").val(0).trigger("change");
    /*$(document).on('change', '#cbo-area', function (e) {
        var AreaId = parseInt($(this).val());
        //var AreaId = parseInt($(this).select2('val')); ANTES
        /*if(AreaId > 0) {
            $(".div-cell").html('<select id="cbo-cell" class="select-with-search pmd-select2 form-control"></select>');
        }
        getCellByAreaId(AreaId);
        $("#cbo-cell").val(0).trigger("change");
    });*/

    //setTimeout(function () { $("#cbo-type-meeting").val(0).trigger("change"); }, 300);

    // TODO: Establecer area y celula del usuario
    //$("#cbo-area").prop("disabled", true); @AMENDEZ5

    $("#cbo-area").val("0").trigger("change");

    /*setTimeout(function () {
        $("#cbo-cell").val(cellId).trigger("change");
    }, 800);*/

    getAllTypeMeetingActive(0); //@AMENDEZ5

    $('#cbo-type-meeting').select2({ theme: "bootstrap", minimumResultsForSearch: 0 }); //@AMENDEZ5
    $('#cbo-area').select2({ theme: "bootstrap", minimumResultsForSearch: 0 }); //@AMENDEZ5


    //$('#cbo-estado').select2({ theme: "bootstrap", minimumResultsForSearch: 0 });
    $('#cbo-prioridad').select2({ theme: "bootstrap", minimumResultsForSearch: 0 });
    setTimeout(function () {
        $('.select2-container--bootstrap .select2-selection--single').css({
            'background': '#fff',
            'border': '1px solid #ced4da',
            'padding-left': '12px'
        });
    }, 0); //@AMENDEZ5
}
/*================================================================================================================================================================================*/
/*function applyCustomFilter(table, filters) {
    // Quitar cualquier filtro anterior
    $.fn.dataTable.ext.search.pop();

    // Configurar la función de filtrado personalizada
    $.fn.dataTable.ext.search.push(function (settings, data, dataIndex) {
        // Verificar si los datos coinciden con los filtros

        // Filtro por código de reunión (primera columna)
        if (filters.meetingCode && filters.meetingCode !== "") {
            var meetingCode = data[1] ? data[1].toLowerCase() : '';
            if (meetingCode.indexOf(filters.meetingCode.toLowerCase()) === -1) {
                return false;
            }
        }

        // Si pasó todos los filtros, incluir la fila
        return true;
    });

    // Redibujar la tabla con el filtro aplicado
    table.draw();

    // Eliminar la función de filtrado para no afectar otras tablas
    $.fn.dataTable.ext.search.pop();
}*/ //ANTES
/*================================================================================================================================================================================*/
function getActionPlanPendingByArgs() { //21/8
    var userId = localStorage.getItem("UserId");
    var scope = $("#ddl-meeting-scope").val();

    // Definir columnas base
    var columns = [
        { "data": "MeetingCode", "title": "Cod. Reunión", "sClass": "text-center-vh", "sWidth": "20px" },
        { "data": "ActionPlanWhat", "title": "Acción", "sClass": "text-center-vh", "sWidth": "150px" },
        { "data": "ActionPlanCategoryName", "title": "Categoría", "sClass": "text-center-vh", "sWidth": "10px" }
    ];

    // Preparar columnDefs dinámicamente según el scope
    var columnDefs = [
        { "width": "20px", "targets": 0 },
        { "width": "10px", "targets": 1 },
        { "width": "10px", "targets": 2 }
    ];

    // Contador para los índices de targets
    var columnIndex = 3;

    if (scope === "all") {
        columns.push({
            "data": "ResponsibleUserName",
            "title": "Responsable",
            "sClass": "text-center-vh",
            "sWidth": "10px"
        });

        // Añadir definición para la columna Responsable
        columnDefs.push({ "width": "10px", "targets": columnIndex });
        columnIndex++;
    }

    // Añadir el resto de columnas
    columns = columns.concat([
        {
            "data": "ActionPlanScheduledDate",
            "title": "Fecha Programada",
            "sClass": "text-center-vh",
            "sWidth": "10px",
            "mRender": function (data) {
                if (!data) return '';
                return '<div style="display:flex;justify-content:center;align-items:center;">' + data + '</div>';
            }
        },
        {
            "data": "ActionPlanPriority",
            "title": "Prioridad",
            "sClass": "text-center-vh",
            "sWidth": "10px",
            "mRender": function (data) {
                var colorClass = "";
                var text = "";
                switch (data) {
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
                        colorClass = "grey lighten-1";
                        text = data || "";
                }
                var stylePrioridad = "font-size:12px;font-weight:bold;color:#fff;";
                return '<div style="display:flex;justify-content:center;align-items:center;height:100%;">'
                    + (text ? '<span class="text-center-vh new badge ' + colorClass + '" style="' + stylePrioridad + '">' + text + '</span>' : '')
                    + '</div>';
            }
        },
        {
            "data": null,
            "title": "Estado",
            "sClass": "text-center-vh",
            "sWidth": "10px",
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
                }
                return "<div style='display:flex;justify-content:center;align-items:center;height:100%;'>" + statusHtml + "</div>";
            }
        },
        {
            "data": null,
            "title": "Opción",
            "sClass": "text-center-vh",
            "sWidth": "5px",
            "mRender": function (data) {
                return '<div class="buttons-preview">'
                    + '<a href="javascript:void(0);" class="a-edit a-execute-ac activator" data-ActionPlanCode="' + data["ActionPlanCode"] + '" data-ActionPlanScheduledDate="' + data["ActionPlanScheduledDate"] + '"><i class="material-icons">flash_on</i></a>'
                    + '</div>';
            }
        }
    ]);

    columnDefs.push({ "width": "10px", "targets": columnIndex++ }); // Fecha Programada
    columnDefs.push({ "width": "10px", "targets": columnIndex++ }); // Prioridad
    columnDefs.push({ "width": "10px", "targets": columnIndex++ }); // Estado
    columnDefs.push({ "width": "5px", "targets": columnIndex }); // Opciones

    var headerHTML = '<thead><tr>';
    for (var i = 0; i < columns.length; i++) {
        headerHTML += '<th class="' + columns[i].sClass + '">' + columns[i].title + '</th>';
    }
    headerHTML += '</tr></thead><tbody></tbody>';

    $("#datatable-action-plan-pending").empty().html(headerHTML);

    return $("#datatable-action-plan-pending").DataTable({
        "bDestroy": true,
        "responsive": false,
        "scrollX": true,
        "autoWidth": false,
        "bFilter": true,
        "searching": false,
        "paging": true,
        "ordering": false,
        "info": false,
        "bLengthChange": false,
        "iDisplayLength": 10,
        "fixedHeader": true,
        "columnDefs": columnDefs,
        "language": { "url": baseUrl + "/Content/library/datatable/language/Spanish.json" },
        "ajax": {
            "dataSrc": function (json) {
                if (typeof json === "string") {
                    try {
                        json = JSON.parse(json);
                    } catch (e) {
                        console.error("Error al parsear JSON:", e);
                        return [];
                    }
                }

                if (json && json.ActionPlan && Array.isArray(json.ActionPlan)) {
                    return json.ActionPlan;
                } else if (json && json.Table && Array.isArray(json.Table)) {
                    return json.Table;
                } else if (json && json.Tables && json.Tables[0] && Array.isArray(json.Tables[0].Rows)) {
                    return json.Tables[0].Rows;
                } else if (Array.isArray(json)) {
                    return json;
                }

                return [];
            },
            "data": function (d) {
                var userId = localStorage.getItem("UserId");
                var scope = $("#ddl-meeting-scope").val();

                d.areaId = Number($("#cbo-area").val()) || 0;

                if (scope === "mine") {
                    d.responsibleUserId = userId != null ? parseInt(userId) : 0;
                    d.mineScope = true;
                    d.userId = 0;
                } else {
                    d.responsibleUserId = 0;
                    d.mineScope = false;
                    d.userId = $("#txt-responsable").attr("data-userid") || 0;
                }

                d.status = 0;

                d.meetingCode = "0";
                d.typeMeetingCode = "0";
                d.areaId = areaId || 0;
                d.startDate = "1900-01-01";
                d.endDate = "1900-01-01";
                d.priority = "0";
                d.categoryId = 0;

                d.dateFilterType = window.currentDateFilterType || "scheduled";

                if (window.isSearchActive) {
                    d.meetingCode = $("#txt-cod-reunion").val() || "0";
                    d.typeMeetingCode = $("#cbo-type-meeting").val() || "0";
                    d.areaId = Number($("#cbo-area").val()) || 0;

                    if ($("#txt-start-date").val()) {
                        try {
                            d.startDate = formatStrDate($("#txt-start-date").val(), 'dd/mm/yyyy', "/");
                        } catch (e) {
                            console.error("Error al formatear fecha inicio:", e);
                            d.startDate = "1900-01-01";
                        }
                    }

                    if ($("#txt-end-date").val()) {
                        try {
                            d.endDate = formatStrDate($("#txt-end-date").val(), 'dd/mm/yyyy', "/");
                        } catch (e) {
                            console.error("Error al formatear fecha fin:", e);
                            d.endDate = "1900-01-01";
                        }
                    }

                    if ($("#cbo-estado").val() && $("#cbo-estado").val() != "0") {
                        d.actionPlanStatus = $("#cbo-estado").val();
                    }

                    var priorityVal = $("#cbo-prioridad").val() || "0";
                    d.actionPlanPriority = priorityVal;

                    d.actionPlanCategoryId = $("#txt-ap-category").val() || 0;
                }

                return d;
            },
            "type": "POST",
            "url": baseUrl + '/ActionPlan/getActionPlanPendingByArgs',
            "async": true, "error": function (xhr, status, error) {
                console.error("Error en llamada AJAX:", status, error);
            },
            "complete": function () {
                $("#datatable-action-plan-pending_wrapper").show();
            }
        },
        "aoColumns": columns,
        "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            $(nRow).find('td:not(:last-child)').addClass('black-text');
            $('.a-execute-ac', nRow).tooltip({ delay: 50, tooltip: "Cerrar Plan de Acción", position: "top" });
        },
        "initComplete": function (settings) {
            var api = this.api();
            api.settings()[0].oLanguage.sEmptyTable = "No hay planes de acción pendientes";
            api.draw(false);
        }
    });
}
/*================================================================================================================================================================================*/
function getActionPlanExecutedByArgs() { //21/8
    var userId = localStorage.getItem("UserId");
    var scope = $("#ddl-meeting-scope").val();

    var columns = [
        { "data": "MeetingCode", "title": "Cod. Reunión", "sClass": "text-center-vh", "sWidth": "20px" },
        { "data": "ActionPlanWhat", "title": "Acción", "sClass": "text-center-vh", "sWidth": "150px" },
        { "data": "ActionPlanCategoryName", "title": "Categoría", "sClass": "text-center-vh", "sWidth": "10px" }
    ];

    var columnDefs = [
        { "width": "20px", "targets": 0 },
        { "width": "10px", "targets": 1 },
        { "width": "10px", "targets": 2 }
    ];

    var columnIndex = 3;

    if (scope === "all") {
        columns.push({
            "data": "ResponsibleUserName",
            "title": "Responsable",
            "sClass": "text-center-vh",
            "sWidth": "10px"
        });

        columnDefs.push({ "width": "10px", "targets": columnIndex });
        columnIndex++;
    }

    columns = columns.concat([
        {
            "data": "ActionPlanScheduledDate",
            "title": "Fecha Programada",
            "sClass": "text-center-vh",
            "sWidth": "10px",
            "mRender": function (data, type, full) {
                if (!data) return '';
                return '<div style="display:flex;justify-content:center;align-items:center;">' + data + '</div>';
            }
        },
        {
            "data": "ActionPlanExecutedDate",
            "title": "Fecha Ejecutada",
            "sClass": "text-center-vh",
            "sWidth": "10px",
            "mRender": function (data, type, full) {
                if (!data) return '';
                return '<div style="display:flex;justify-content:center;align-items:center;">' + data + '</div>';
            }
        },
        {
            "data": "ActionPlanPriority",
            "title": "Prioridad",
            "sClass": "text-center-vh",
            "sWidth": "10px",
            "mRender": function (data, type, full) {
                var colorClass = "";
                var text = "";
                switch (data) {
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
                        colorClass = "grey lighten-1";
                        text = data || "";
                }

                var stylePrioridad = "font-size:12px;font-weight:bold;color:#fff;";
                return '<div style="display:flex;justify-content:center;align-items:center;height:100%;">'
                    + (text ? '<span class="text-center-vh new badge ' + colorClass + '" style="' + stylePrioridad + '">' + text + '</span>' : '')
                    + '</div>';
            }
        },
        {
            "data": null,
            "title": "Estado",
            "sClass": "text-center-vh",
            "sWidth": "10px",
            "mRender": function (data, type, full) {
                var status = data["ActionPlanStatus"];
                var statusHtml = "";
                var styleEstado = "white-space:nowrap;min-width:90px;font-weight:bold;color:#fff;";

                switch (status) {
                    case 3:
                    case "3":
                        statusHtml = "<span class='new badge green' style='" + styleEstado + "'>Cerrado</span>";
                        break;
                    case 4:
                    case "4":
                        statusHtml = "<span class='new badge orange darken-1' style='" + styleEstado + "'>Cerrado Fuera de Plazo</span>";
                        break;
                    default:
                        statusHtml = "<span class='new badge blue' style='" + styleEstado + "'>Ejecutado</span>";
                }

                return "<div style='display:flex;justify-content:center;align-items:center;height:100%;'>" + statusHtml + "</div>";
            }
        },
        {
            "data": null,
            "title": "Opción",
            "sClass": "text-center-vh",
            "sWidth": "5px",
            "mRender": function (data, type, full) {
                return '<a href="javascript:void(0);" class="a-edit a-view-action-plan" data-ActionPlanCode="' + data['ActionPlanCode'] + '"'
                    + ' data-ActionPlanExecutedDesc="' + data['ActionPlanExecutedDesc'] + '"'
                    + ' data-ActionPlanExecutedDate="' + data['ActionPlanExecutedDate'] + '"><i class="material-icons">remove_red_eye</i></a>';
            }
        }
    ]);

    columnDefs.push({ "width": "10px", "targets": columnIndex++ }); // Fecha Programada
    columnDefs.push({ "width": "10px", "targets": columnIndex++ }); // Fecha Ejecutada
    columnDefs.push({ "width": "10px", "targets": columnIndex++ }); // Prioridad
    columnDefs.push({ "width": "10px", "targets": columnIndex++ }); // Estado
    columnDefs.push({ "width": "5px", "targets": columnIndex }); // Opciones

    var headerHTML = '<thead><tr>';
    for (var i = 0; i < columns.length; i++) {
        headerHTML += '<th class="' + columns[i].sClass + '">' + columns[i].title + '</th>';
    }
    headerHTML += '</tr></thead><tbody></tbody>';

    $("#datatable-action-plan-executed").empty().html(headerHTML);

    return $("#datatable-action-plan-executed").DataTable({
        "bDestroy": true,
        "responsive": false,
        "scrollX": true,
        "autoWidth": false,
        "bFilter": true,
        "searching": false,
        "paging": true,
        "ordering": false,
        "info": false,
        "bLengthChange": false,
        "iDisplayLength": 10,
        "fixedHeader": true,
        "columnDefs": columnDefs,
        "language": {
            "url": "Content/library/datatable/language/Spanish.json"
        },
        "ajax": {
            "dataSrc": function (json) {
                if (typeof json === "string") {
                    try {
                        json = JSON.parse(json);
                    } catch (e) {
                        console.error("Error al parsear JSON:", e);
                        return [];
                    }
                }

                if (json && json.ActionPlan && Array.isArray(json.ActionPlan)) {
                    return json.ActionPlan;
                } else if (json && json.Table && Array.isArray(json.Table)) {
                    return json.Table;
                } else if (json && json.Tables && json.Tables[0] && Array.isArray(json.Tables[0].Rows)) {
                    return json.Tables[0].Rows;
                } else if (Array.isArray(json)) {
                    return json;
                }

                return [];
            },
            "data": function (d) {
                var userId = localStorage.getItem("UserId");
                var scope = $("#ddl-meeting-scope").val();

                if (scope === "mine") {
                    d.responsibleUserId = userId != null ? parseInt(userId) : 0;
                    d.mineScope = true;
                    d.userId = 0;
                } else {
                    d.responsibleUserId = 0;
                    d.mineScope = false;
                    d.userId = $("#txt-responsable").attr("data-userid") || 0;
                }

                d.status = 0;

                d.meetingCode = "0";
                d.typeMeetingCode = "0";
                d.areaId = areaId || 0;
                d.startDate = "1900-01-01";
                d.endDate = "1900-01-01";
                d.priority = "0";
                d.categoryId = 0;

                d.dateFilterType = window.currentDateFilterType || "scheduled";

                if (window.isSearchActive) {
                    d.meetingCode = $("#txt-cod-reunion").val() || "0";
                    d.typeMeetingCode = $("#cbo-type-meeting").val() || "0";
                    d.areaId = Number($("#cbo-area").val()) || 0;


                    if ($("#txt-start-date").val()) {
                        try {
                            d.startDate = formatStrDate($("#txt-start-date").val(), 'dd/mm/yyyy', "/");
                        } catch (e) {
                            console.error("Error al formatear fecha inicio:", e);
                            d.startDate = "1900-01-01";
                        }
                    }

                    if ($("#txt-end-date").val()) {
                        try {
                            d.endDate = formatStrDate($("#txt-end-date").val(), 'dd/mm/yyyy', "/");
                        } catch (e) {
                            console.error("Error al formatear fecha fin:", e);
                            d.endDate = "1900-01-01";
                        }
                    }

                    if ($("#cbo-estado").val() && $("#cbo-estado").val() != "0") {
                        d.actionPlanStatus = $("#cbo-estado").val();
                    }

                    var priorityVal = $("#cbo-prioridad").val() || "0";
                    d.actionPlanPriority = priorityVal;

                    d.actionPlanCategoryId = $("#txt-ap-category").val() || 0;
                }

                return d;
            },
            "type": "POST",
            "url": baseUrl + '/ActionPlan/getActionPlanExecutedByArgs',
            "async": true,
            "error": function (xhr, status, error) {
                console.error("Error en llamada AJAX:", status, error);
            },
            "complete": function () {
                $("#datatable-action-plan-executed_wrapper").show();
                $(".div-progress-bar").empty();
            }
        },
        "aoColumns": columns,
        "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            $(nRow).find('td:not(:last-child)').addClass('black-text');
            $('.a-view-action-plan', nRow).tooltip({ delay: 50, tooltip: "Ver detalle", position: "top" });
        },
        "initComplete": function (settings) {
            var api = this.api();
            api.settings()[0].oLanguage.sEmptyTable = "No hay planes de acción ejecutados";
            api.draw(false);
        }
    });
}
/*================================================================================================================================================================================*/
function getActionPlanModalBody(plan, actionPlanScheduledDate, todayStr) {
    let estado = "";
    let estadoClass = "";
    let estadoValue = plan.ActionPlanStatus;

    switch (estadoValue) {
        case 1:
        case "1":
            estado = "En Proceso";
            estadoClass = "yellow darken-1";
            break;
        case 2:
        case "2":
            estado = "Fuera de Plazo";
            estadoClass = "red";
            break;
        case 3:
        case "3":
            estado = "Cerrado";
            estadoClass = "green";
            break;
        case 4:
        case "4":
            estado = "Cerrado Fuera de Plazo";
            estadoClass = "orange darken-1";
            break;
        default:
            estado = "Desconocido";
            estadoClass = "grey";
    }

    return `
        <form id="form-action-plan-execute" autocomplete="off">
            <div class="row">
                <div class="col s12 m6 l4">
                    <div class="input-field-with-icon">
                        <input id="txt-meeting-code" type="text" value="${plan.MeetingCode || ''}" disabled>
                        <label for="txt-meeting-code" class="active">Cod. Reunión</label>
                    </div>
                </div>
            <div class="col s12 m6 l4">
                <div class="input-field-with-icon">
                    <input id="txt-scheduled-date" type="text" value="${actionPlanScheduledDate}" disabled
                        style="background: #f5f5f5 !important; border: 1px solid #ccc; border-radius: 6px; color: #222; height: 36px;" />
                    <label for="txt-scheduled-date" class="active">Fecha Programada</label>
                </div>
            </div>
                <div class="col s12 m6 l4">
                    <div class="input-field-with-icon">
                        <span class="new badge ${estadoClass}" style="height:30px;width:100%;padding-top:4px;white-space:nowrap;font-weight:bold;color:#fff;">
                            ${estado}
                        </span>
                        <input type="hidden" id="txt-status" value="${estadoValue}">
                        <label for="status" style="margin-bottom: 8px;">Estado</label>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col s12" style="padding-top:10px;">
                    <div class="input-field-with-icon">
                        <textarea id="txt-action-detail" class="materialize-textarea" disabled
                            style="height: 38px; min-height: 38px; max-height: 60px; border-radius: 6px; resize: none; background: #f5f5f5; border: 1px solid #ccc; color: #222; text-align: center; display: flex; align-items: center; justify-content: center;">${plan.ActionPlanWhat || ''}</textarea>
                        <label for="txt-action-detail" class="active">Acción</label>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col s12" style="padding-top:10px;">
                    <div id="div-executedesc-ap" class="input-field-with-icon">
                        <input name="txt-executedesc-ap" id="txt-executedesc-ap" class="txt-executedesc-ap" type="text" autocomplete="off" aria-required="true" placeholder="Escribir comentarios">
                        <label for="txt-executedesc-ap">Comentarios</label>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col s12" style="padding-top:10px;">
                    <div class="input-field-with-icon">
                        <label class="active">Evidencia (Opcional)</label> <!-- 27/8 -->
                    </div>
                </div>
                <div class="col s12" >
                    <div class="div-input-file row"></div>
                    <a id="btn-add-file" class="btn-floating btn-large waves-effect grey lighten-3 gradient-shadow" style="margin-left:15px;">
                        <img style="padding-top: 10px;width: 35px;" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAL4SURBVGhD7ZpNaxNBHIeD30A8+QF8uYoHLx5stt1paQW1h1QPoh4E0WOlRcWgl0rfElHqISa7aRstTUFKlRy0JWqrJlZREURpGtQ0WFpFaZVEkowzdlp2y0zSbfOf9LA/+JGEnSXPk8nObCAOO3YqFG8s6yFNgDSe6XFjvIW9FWw88UzIG8/icvfGJHsey/ilyECJjKdz2Pfm79JrGTJQIq/n8vjDz7w8GUiRz78L8mSgRaTJyBCRIiNLBFxGpgiojGwRWhCZSojQGmU88exVhrP+QIk8SOTw41TxRpI5fJ2MpQwMZ/2BErFSW8QYW6SMtUWMsUXKWFvEGFukjLVFjLFFylhbxBiZIl0vfuHWR1F8crgbN4VbcePAWewabMaucMu0oqvHlaCyjWFZjwyRrtgCPhe5i2v7GrGiI3E19Q957Nwfqt/K8NYeaJFrEzP4yMAZPrigTh19UYK1exji2gIp0vYsjetDR7mwperU0OKB3pp9DLN0oETo1+mwYCYuj13B0eSTld6M9XDHka9aCvWh7Qy1eKBE6DXBhSP1vQpgY0YTY9xx/6uhAEMtHggRujrV9YovbCsiTk3NKcG6nQxXHAgRusTyoJZraUZIicxFhisOhMipYY8J5NKoG/sm/SuNp14yhaVMfZ8yHe+Y6DadT0SeMlxxIESahlpMIPQTt5LpH0nT+eSi/8pwxYEQWb1vbFSEzEiW4YoDIeIKnzeBbHhGdPSN4YoDIXLiXrsJhO4Txn2DghozuzhrOj74fsh0vlNX4wxXHAiR5ocRE8jqWl61dNTGcMWBEOl4Po/V4EEuFK1VkSpd3ctwxYEQoT09cosLRWttQ0QjDLV4oETorDT0H+PCtY934o/zn1ba//YOdxy9cay6jXYx1OLxAv6Fwx19l6oJNhR4kCWroQJZdg8xzMqH3oqTi3WGCyuqhhY2lcRy6K04kfGTZTTPBTeUjLmvaupudurmTHWgegcRukDvnehvDbpjk6bpPkGXWPHq5HD8A5nTwXS2WRcAAAAAAElFTkSuQmCC">
                    </a>
                </div>
            </div>
            <input type="hidden" id="action-plan-code" value="${plan.ActionPlanCode}">
        </form>
    `;
}
/*================================================================================================================================================================================*/
function showModalFormExecuteActionPlan(actionPlanCode, actionPlanScheduledDate) {
    $.ajax({
        type: "POST",
        url: baseUrl + "/ActionPlan/getActionPlanByCode",
        data: JSON.stringify({ actionPlanCode: actionPlanCode }),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (response) {
            if (response && response.ActionPlan && response.ActionPlan.length > 0) {
                var plan = response.ActionPlan[0];

                // Fecha de hoy
                var today = new Date();
                var dd = String(today.getDate()).padStart(2, '0');
                var mm = String(today.getMonth() + 1).padStart(2, '0');
                var yyyy = today.getFullYear();
                var todayStr = dd + '/' + mm + '/' + yyyy;

                // Estado
                var estado = "Cerrado";
                var estadoClass = "green";
                var estadoValue = 3;
                // Comparar fechas
                var arrProg = actionPlanScheduledDate.split('/');
                var arrEjec = todayStr.split('/');
                var fechaProg = new Date(arrProg[2], arrProg[1] - 1, arrProg[0]);
                var fechaEjec = new Date(arrEjec[2], arrEjec[1] - 1, arrEjec[0]);
                if (fechaEjec > fechaProg) {
                    estado = "Cerrado Fuera de Plazo";
                    estadoClass = "orange darken-1";
                    estadoValue = 4;
                }

                $('.div-modal').load('Home/Modal', {
                    ModalId: "modal-execute-action-plan",
                    ModalClass: "modal modal-info2",
                    ModalHeader: '<span><label>Cerrar Plan de Acción</label></span>',
                    ModalTitle: "",
                    ModalBody: getActionPlanModalBody(plan, actionPlanScheduledDate, estado, estadoClass, estadoValue, todayStr),
                    ModalButtonOk: '<button type="button" id="btn-modal-save-execute" class="modal-action waves-effect btn-flat blue white-text">Ejecutar</button>'
                }, function () {
                    $('#modal-execute-action-plan').modal({ dismissible: false }).modal('open');
                    $("#btn-add-file").on("click", addFile);
                    $(document).off("click", ".btn-delete-file").on("click", ".btn-delete-file", function () {
                        var $deleteBtn = $(this);
                        var fileId = $deleteBtn.data('fileid');
                        var $fileItem = $(`#${fileId}`);

                        if ($fileItem.length > 0) {
                            $fileItem.fadeOut(200, function () {
                                $(this).remove();

                                if ($(".file-item").length === 0) {
                                    $(".file-evidence-container").remove();

                                    //27/8

                                    /*if ($("#btn-add-file").next(".error2.evidencia-error").length === 0) {
                                        $("#btn-add-file").after('<div class="error2 evidencia-error" style="display:inline-block; margin-left:10px; vertical-align:middle;">Debe adjuntar al menos una evidencia.</div>');
                                    }*/
                                }
                            });
                        }


                        //27/8
                        /*
                        $('.error2.evidencia-error').remove();
                        setTimeout(function () {
                            if ($('.file-item').length === 0) {
                                if ($('.file-evidence-container').length > 0) {
                                    if ($('.file-evidence-container').next('.error2.evidencia-error').length === 0) {
                                        $('.file-evidence-container').after('<div class="error2 evidencia-error" style="margin-left:15px;">Debe adjuntar al menos una evidencia.</div>');
                                    }
                                } else {
                                    if ($('#btn-add-file').next('.error2.evidencia-error').length === 0) {
                                        $('#btn-add-file').after('<div class="error2 evidencia-error" style="display:inline-block; margin-left:10px; vertical-align:middle;">Debe adjuntar al menos una evidencia.</div>');
                                    }
                                }
                            }
                        }, 200); */
                    });


                    $("#btn-modal-save-execute").off("click").on("click", function () {
                        showModalExecuteActionPlan();
                    });

                    $(document).off('input', '#txt-executedesc-ap').on('input', '#txt-executedesc-ap', function () {
                        var $input = $(this);
                        $input.next('.error2').remove();
                        if ($input.val().trim() === "") {
                            $input.after('<div class="error2">Comentarios es obligatorio.</div>');
                        }
                    });

                    $(document).off('change', '.file-ap-detail').on('change', '.file-ap-detail', function () {
                        $('.error2.evidencia-error').remove();
                    });
                });
            }
        }
    });
}
/*================================================================================================================================================================================*/
function showModalExecuteActionPlan() {
    $(".error2").remove();

    var comentarios = $("#txt-executedesc-ap").val() || "";

    var files = [];
    $(".file-item").each(function () {
        var file = $(this).data('file');
        if (file) {
            files.push(file);
        }
    });

    //27/8
    //var tieneEvidencias = files.length > 0;

    var error = false;

    if (comentarios.trim() === "") {
        if ($("#txt-executedesc-ap").next(".error2").length === 0) {
            $("#txt-executedesc-ap").after('<div class="error2">Comentarios es obligatorio.</div>');
        }
        error = true;
    }

    // 27/8
    /*if (!tieneEvidencias) {
        if ($("#btn-add-file").next(".error2.evidencia-error").length === 0) {
            $("#btn-add-file").after('<div class="error2 evidencia-error" style="display:inline-block; margin-left:10px; vertical-align:middle;">Debe adjuntar al menos una evidencia.</div>');
        }
        error = true;
    }*/

    if (error) return;

    var actionPlanCode = $("#action-plan-code").val();
    var actionPlanScheduledDate = $("#txt-scheduled-date").val();
    var comentariosFinales = comentarios;

    var today = new Date();
    var formattedDate = formatStrDate(today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear(), 'dd/mm/yyyy', "/");

    var fechaProgramada = convertirFechaADate(actionPlanScheduledDate);
    var fechaActual = convertirFechaADate(formattedDate);

    var estadoFinal = (fechaActual <= fechaProgramada) ? 3 : 4;

    // Cerrar el anterior modal de registro de cierre de plan de acción
    $(".modal-close").trigger("click");

    $('.div-modal').load(baseUrl + '/Home/Modal', {
        ModalId: "modal-confirmation",
        ModalClass: "modal-message modal-info2",
        ModalHeader: '<span><i class="blue-dark-text material-icons">help_outline</i><label>CONFIRMACIÓN</label></span>',
        ModalTitle: " ",
        ModalBody: "¿Está seguro que desea cerrar este plan de acción?",
        ModalButtonOk: '<button type="button" id="btn-modal-aceppt" class="modal-action waves-effect btn-flat blue white-text">Aceptar</button>'
    }, function () {
        $('#modal-confirmation').modal({ dismissible: false }).modal('open')
            .one('click', '#btn-modal-aceppt', function () {
                var $confirmationModal = $('#modal-confirmation');
                var $executeModal = $('#modal-execute-action-plan');

                $("#btn-modal-aceppt").html(
                    '<img src="' + baseUrl + '/Content/MeetingRecordAppWeb/img/ic_spinner_50.svg" style="width:35px;">' +
                    '<span style="position: relative; float: right;">Aceptar</span>'
                );

                $(".modal-close").addClass("disabled");

                var data = {
                    ActionPlanCode: actionPlanCode,
                    ActionPlanExecutedDesc: comentariosFinales,
                    ActionPlanExecutedDate: formattedDate,
                    ActionPlanStatus: estadoFinal
                };

                $.ajax({
                    type: "POST",
                    url: baseUrl + "/ActionPlan/executeActionPlan",
                    data: JSON.stringify(data),
                    dataType: 'json',
                    contentType: 'application/json; charset=utf-8',
                    success: function (response) {

                        var completarProceso = function () {
                            setTimeout(function () {
                                if ($confirmationModal.hasClass('open')) {
                                    $confirmationModal.modal('close');
                                }

                                setTimeout(function () {
                                    if ($executeModal.hasClass('open')) {
                                        $executeModal.modal('close');
                                    }

                                    $(".modal-close").removeClass("disabled");

                                    notificationsActionPlan();
                                    datatablePending.ajax.reload();
                                }, 300);
                            }, 200);
                        };

                        if (files.length > 0) {
                            var ajaxApd = uploadFilesToServer(actionPlanCode, files);

                            if (ajaxApd) {
                                ajaxApd
                                    .always(function () {
                                        completarProceso();
                                        setTimeout(function () {
                                            $('.modal-overlay').remove();
                                            $('body').css('overflow', 'auto');
                                        }, 500);
                                    });
                            } else {
                                completarProceso();
                                setTimeout(function () {
                                    $('.modal-overlay').remove();
                                    $('body').css('overflow', 'auto');
                                }, 500);
                            }
                        } else {
                            completarProceso();
                            setTimeout(function () {
                                $('.modal-overlay').remove();
                                $('body').css('overflow', 'auto');
                            }, 500);
                        }

                    },
                    error: function (xhr, status, error) {

                        if ($confirmationModal.hasClass('open')) {
                            $confirmationModal.modal('close');
                        }
                        if ($executeModal.hasClass('open')) {
                            $executeModal.modal('close');
                        }
                        $(".modal-close").removeClass("disabled");

                        setTimeout(function () {
                            $('.div-modal').load(baseUrl + '/Home/Modal', {
                                ModalId: "modal-error",
                                ModalClass: "modal-message modal-error2",
                                ModalHeader: '<span><i class="material-icons">error</i><label>ERROR</label></span>',
                                ModalTitle: "",
                                ModalBody: "Ocurrió un error al cerrar el plan de acción",
                                ModalButtonOk: ''
                            }, function () {
                                $(".modal-close").text("CERRAR");
                                $('#modal-error').modal({ dismissible: false }).modal('open');
                            });
                        }, 300);
                    }
                });
            });
    });
}
/*================================================================================================================================================================================*/
function uploadFilesToServer(actionPlanCode, files) {

    var data = new FormData();
    var fileCount = 0;
    var totalFileSize = 0;

    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        if (file) {
            totalFileSize += file.size;
            var actionPlanDetailCode = getGeneratedCode("M-APD");


            data.append("entityList[" + fileCount + "].ActionPlanCode", actionPlanCode);
            data.append("entityList[" + fileCount + "].ActionPlanDetailCode", actionPlanDetailCode);
            data.append("entityList[" + fileCount + "].ActionPlanDetailNameFile", file.name);
            data.append("entityList[" + fileCount + "].ActionPlanDetailFile", file);
            fileCount++;
        }
    }


    if (fileCount > 0) {
        return $.ajax({
            type: "POST",
            url: baseUrl + "/ActionPlanDetail/insertActionPlanDetail",
            processData: false,
            contentType: false,
            data: data,
            async: true,
            success: function (response) {

                if (typeof response === "string") {
                    try {
                        response = JSON.parse(response);
                    } catch (e) {
                    }
                }
            }
        });
    }

    return null;
}
/*================================================================================================================================================================================*/
function addFile() {

    var fileInputId = "hidden-file-input-" + new Date().getTime();

    var inputFile = $('<input>', {
        type: 'file',
        id: fileInputId,
        accept: '.jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx',
        style: 'display:none;'
    });

    $("body").append(inputFile);

    inputFile.on('change', function (e) {
        var files = e.target.files;

        if (files && files.length > 0) {
            var file = files[0];

            var extension = file.name.split('.').pop().toLowerCase();
            var iconPath = getIconfile('.' + extension);
            var fileItemId = "file-item-" + new Date().getTime();

            if ($(".file-evidence-container").length === 0) {
                $(".div-input-file").after('<div class="file-evidence-container" style="display:flex;flex-wrap:wrap;margin-top:10px;"></div>');
            }

            var fileHtml = `
                <div class="file-item" id="${fileItemId}" style="width:160px;margin:5px;border:1px solid #e0e0e0;border-radius:6px;padding:8px;background-color:#fff;position:relative;">
                    <div style="position:absolute;top:5px;right:5px;display:flex;">
                        <a href="javascript:void(0);" class="btn-download" data-fileid="${fileItemId}" style="margin-right:5px;">
                            <img src="${baseUrl}/Content/MeetingRecordAppWeb/img/ic_download_file.svg" style="width:16px;height:16px;">
                        </a>
                        <a href="javascript:void(0);" class="btn-delete-file" data-fileid="${fileItemId}">
                            <i class="material-icons" style="color:#f44336;font-size:16px;">delete</i>
                        </a>
                    </div>
                    <div style="display:flex;justify-content:center;margin-top:10px;margin-bottom:8px;height:60px;align-items:center;">`;

            if (file.type.match('image.*')) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    $(`#${fileItemId} .file-preview`).html(`
                        <img src="${e.target.result}" style="max-height:50px;max-width:90%;">
                    `);
                };
                reader.readAsDataURL(file);
                fileHtml += `<div class="file-preview">
                    <div class="preloader-wrapper small active">
                        <div class="spinner-layer spinner-blue-only">
                            <div class="circle-clipper left"><div class="circle"></div></div>
                            <div class="gap-patch"><div class="circle"></div></div>
                            <div class="circle-clipper right"><div class="circle"></div></div>
                        </div>
                    </div>
                </div>`;
            } else {
                fileHtml += `<img src="${iconPath}" style="max-height:50px;max-width:50px;">`;
            }

            fileHtml += `
                    </div>
                    <div style="text-align:center;font-size:11px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
                        ${file.name}
                    </div>
                </div>
            `;

            $(".file-evidence-container").append(fileHtml);

            $(`#${fileItemId}`).data('file', file);

            $('.error2.evidencia-error').remove();

        }

        $(this).remove();
    });

    inputFile.click();
}
/*================================================================================================================================================================================*/
function getFileIconClass(extension) {
    switch (extension) {
        case 'pdf':
            return 'pdf-icon';
        case 'doc':
        case 'docx':
            return 'word-icon';
        case 'xls':
        case 'xlsx':
            return 'excel-icon';
        case 'jpg':
        case 'jpeg':
        case 'png':
            return 'image-icon';
        default:
            return 'file-icon';
    }
}
/*================================================================================================================================================================================*/
function insertActionPlanDetailWithFiles(actionPlanCode, files) {

    var data = new FormData();
    var validateImage = false;
    var fileCount = 0;
    var totalFileSize = 0;

    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        if (file) {
            validateImage = true;
            totalFileSize += file.size;

            var actionPlanDetailCode = getGeneratedCode("M-APD");

            data.append("entityList[" + fileCount + "].ActionPlanCode", actionPlanCode);
            data.append("entityList[" + fileCount + "].ActionPlanDetailCode", actionPlanDetailCode);
            data.append("entityList[" + fileCount + "].ActionPlanDetailNameFile", file.name);
            data.append("entityList[" + fileCount + "].ActionPlanDetailFile", file);
            fileCount++;
        }
    }


    if (validateImage) {
        return $.ajax({
            type: "POST",
            url: baseUrl + "/ActionPlanDetail/insertActionPlanDetail",
            processData: false,
            contentType: false,
            data: data,
            async: true,
            beforeSend: function () {
                $("#btn-modal-aceppt").html(
                    '<img src="' + baseUrl + '/Content/MeetingRecordAppWeb/img/ic_spinner_50.svg" style="width:35px;">' +
                    '<span style="position: relative; float: right;">Aceptar</span>'
                );
                $(".modal-close").addClass("disabled");
            },
            success: function (response) {

                if (typeof response === "string") {
                    try {
                        response = JSON.parse(response);
                    } catch (e) {
                        console.error('Error', e.message);
                    }
                }

            },
            complete: function () {
                $(".modal-close").removeClass("disabled");
            }
        });
    }

    return null;
}
/*================================================================================================================================================================================*/
function convertirFechaADate(fechaStr) {
    if (!fechaStr) return new Date();

    var partes = fechaStr.split('/');
    if (partes.length !== 3) return new Date();

    return new Date(partes[2], parseInt(partes[1]) - 1, partes[0]);
}
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
} //ANTES
/*================================================================================================================================================================================*/
/*function executeActionPlan(actionPlanCode) {
    var data = {};
    data.ActionPlanCode         =  actionPlanCode;
    data.ActionPlanExecutedDesc =  $("#txt-executedesc-ap").val();
    data.ActionPlanExecutedDate =  formatStrDate($("#txt-executedate-ap").val(), 'dd/mm/yyyy', "/");
    return $.ajax({
        type        : "POST",
        //url: "executeActionPlan", ANTES
        url: "/ActionPlan/executeActionPlan",
        data        : JSON.stringify(data),
        dataType    : 'json',
        contentType : 'application/json; charset=utf-8',
        async       : false,
        error: function(response) {
        }
    });
}*/ //ANTES
/*================================================================================================================================================================================*/
function insertActionPlanDetail(actionPlanCode) {

    var data = new FormData();
    var validateImage = false;
    var fileCount = 0;
    var totalFileSize = 0;

    $(".file-item").each(function () {
        var file = $(this).data('file');
        if (file) {
            validateImage = true;
            totalFileSize += file.size;

            var actionPlanDetailCode = getGeneratedCode("M-APD");

            data.append("entityList[" + fileCount + "].ActionPlanCode", actionPlanCode);
            data.append("entityList[" + fileCount + "].ActionPlanDetailCode", actionPlanDetailCode);
            data.append("entityList[" + fileCount + "].ActionPlanDetailNameFile", file.name); // Usar el nombre real del archivo
            data.append("entityList[" + fileCount + "].ActionPlanDetailFile", file);
            fileCount++;
        }
    });


    if (validateImage) {
        return $.ajax({
            type: "POST",
            url: baseUrl + "/ActionPlanDetail/insertActionPlanDetail",
            processData: false,
            contentType: false,
            data: data,
            async: true,
            beforeSend: function () {
                $("#btn-modal-aceppt").html(
                    '<img src="' + baseUrl + '/Content/MeetingRecordAppWeb/img/ic_spinner_50.svg" style="width:35px;">' +
                    '<span style="position: relative; float: right;">Aceptar</span>'
                );
                $(".modal-close").addClass("disabled");
            },
            success: function (response) {

                if (typeof response === "string") {
                    try {
                        response = JSON.parse(response);
                    } catch (e) {
                        console.error('Error', e.message);
                    }
                }

            },
            error: function (xhr, status, error) {
            },
            complete: function () {
                $(".modal-close").removeClass("disabled");
                setTimeout(function () {
                    $('#modal-confirmation').modal('close');
                    $('#modal-execute-action-plan').modal('close');
                }, 500);
            }
        });
    }

    return null;
}
/*================================================================================================================================================================================*/
function showModalViewActionPlanDetail() {
    var actionPlanCode = $(this).attr("data-ActionPlanCode");
    var actionPlanExecutedDesc = $(this).attr("data-ActionPlanExecutedDesc") || "";
    var actionPlanExecutedDate = $(this).attr("data-ActionPlanExecutedDate") || "";

    $(".div-progress-bar").html('<div class="progress"><div class="indeterminate"></div></div>');

    var userRole = parseInt(localStorage.getItem("UserRole")) || 0;

    var isEditable = (userRole === 1 || userRole === 2);


    $.ajax({
        type: "POST",
        url: baseUrl + "/ActionPlan/getActionPlanByCode",
        data: JSON.stringify({ actionPlanCode: actionPlanCode }),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (response) {
            if (response && response.ActionPlan && response.ActionPlan.length > 0) {
                var plan = response.ActionPlan[0];

                var actionPlanScheduledDate = "";
                if (plan.ActionPlanScheduledDate) {
                    if (typeof plan.ActionPlanScheduledDate === 'string' &&
                        plan.ActionPlanScheduledDate.indexOf('/Date(') === 0) {
                        try {
                            var timestamp = parseInt(plan.ActionPlanScheduledDate.replace(/\/Date\((\d+)\)\//, '$1'));
                            var date = new Date(timestamp);
                            actionPlanScheduledDate = ('0' + date.getDate()).slice(-2) + '/' +
                                ('0' + (date.getMonth() + 1)).slice(-2) + '/' +
                                date.getFullYear();
                        } catch (e) {
                            actionPlanScheduledDate = "Fecha no disponible";
                        }
                    } else {
                        actionPlanScheduledDate = plan.ActionPlanScheduledDate;
                    }
                }

                let estado = "";
                let estadoClass = "";
                let estadoValue = plan.ActionPlanStatus;

                switch (estadoValue) {
                    case 3:
                    case "3":
                        estado = "Cerrado";
                        estadoClass = "green";
                        break;
                    case 4:
                    case "4":
                        estado = "Cerrado Fuera de Plazo";
                        estadoClass = "orange darken-1";
                        break;
                    default:
                        estado = "Ejecutado";
                        estadoClass = "blue";
                        break;
                }

                var body = `
                <form id="form-action-plan-view" autocomplete="off">
                    <div class="row">
                        <div class="col s12 m6 l4">
                            <div class="input-field-with-icon">
                                <input id="txt-meeting-code" type="text" value="${plan.MeetingCode || ''}" disabled
                                    style="background: #f5f5f5 !important; border: 1px solid #ccc; border-radius: 6px; color: #222; height: 36px;">
                                <label for="txt-meeting-code" class="active">Cod. Reunión</label>
                            </div>
                        </div>
                        <div class="col s12 m6 l4">
                            <div class="input-field-with-icon">
                                <input id="txt-scheduled-date" type="text" value="${actionPlanScheduledDate}" disabled
                                    style="background: #f5f5f5 !important; border: 1px solid #ccc; border-radius: 6px; color: #222; height: 36px;">
                                <label for="txt-scheduled-date" class="active">Fecha Programada</label>
                            </div>
                        </div>
                        <div class="col s12 m6 l4">
                            <div class="input-field-with-icon">
                                <input id="txt-executed-date" type="text" value="${actionPlanExecutedDate}" disabled
                                    style="background: #f5f5f5 !important; border: 1px solid #ccc; border-radius: 6px; color: #222; height: 36px;">
                                <label for="txt-executed-date" class="active">Fecha Ejecutada</label>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col s12 m8" style="padding-top:10px;">
                            <div class="input-field-with-icon">
                                <textarea id="txt-action-detail" class="materialize-textarea" disabled
                                    style="height: 38px; min-height: 38px; max-height: 60px; border-radius: 6px; resize: none; background: #f5f5f5; border: 1px solid #ccc; color: #222; text-align: center; display: flex; align-items: center; justify-content: center;">${plan.ActionPlanWhat || ''}</textarea>
                                <label for="txt-action-detail" class="active">Acción</label>
                            </div>
                        </div>
                        <div class="col s12 m4" style="padding-top:10px;">
                            <div class="input-field-with-icon">
                                <span class="new badge ${estadoClass}" style="height:30px;width:100%;padding-top:4px;white-space:nowrap;font-weight:bold;color:#fff;">
                                    ${estado}
                                </span>
                                <input type="hidden" id="txt-status" value="${estadoValue}">
                                <label for="status" style="margin-bottom: 8px;">Estado</label>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col s12" style="padding-top:10px;">
                            <div id="div-executedesc-ap" class="input-field-with-icon">
                                <input name="txt-executedesc-ap" id="txt-executedesc-ap" class="txt-executedesc-ap ${!isEditable ? 'disabled' : ''}"
                                    type="text" autocomplete="off" aria-required="true"
                                    ${!isEditable ? 'disabled' : ''}
                                    style="${!isEditable ? 'background: #f5f5f5 !important; border: 1px solid #ccc;' : ''}"
                                    placeholder="${isEditable ? 'Modificar comentarios' : ''}"
                                    value="${actionPlanExecutedDesc}">
                                <label for="txt-executedesc-ap" class="${actionPlanExecutedDesc ? 'active' : ''}">Comentarios</label>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col s12" style="padding-top:10px;">
                            <div class="input-field-with-icon">
                                <label class="active">Evidencia</label>
                            </div>
                        </div>
                        <div class="col s12">
                            <div class="div-action-plan-detail row" style="display:flex;flex-wrap:wrap;padding:0 15px;"></div>
                            ${isEditable ? `
                            <div class="div-input-file row"></div>
                            <a id="btn-add-detail-file" class="btn-floating btn-large waves-effect grey lighten-3 gradient-shadow" style="margin-left:15px;">
                                <img style="padding-top: 10px;width: 35px;" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAL4SURBVGhD7ZpNaxNBHIeD30A8+QF8uYoHLx5stt1paQW1h1QPoh4E0WOlRcWgl0rfElHqISa7aRstTUFKlRy0JWqrJlZREURpGtQ0WFpFaZVEkowzdlp2y0zSbfOf9LA/+JGEnSXPk8nObCAOO3YqFG8s6yFNgDSe6XFjvIW9FWw88UzIG8/icvfGJHsey/ilyECJjKdz2Pfm79JrGTJQIq/n8vjDz7w8GUiRz78L8mSgRaTJyBCRIiNLBFxGpgiojGwRWhCZSojQGmU88exVhrP+QIk8SOTw41TxRpI5fJ2MpQwMZ/2BErFSW8QYW6SMtUWMsUXKWFvEGFukjLVFjLFFylhbxBiZIl0vfuHWR1F8crgbN4VbcePAWewabMaucMu0oqvHlaCyjWFZjwyRrtgCPhe5i2v7GrGiI3E19Q957Nwfqt/K8NYeaJFrEzP4yMAZPrigTh19UYK1exji2gIp0vYsjetDR7mwperU0OKB3pp9DLN0oETo1+mwYCYuj13B0eSTld6M9XDHka9aCvWh7Qy1eKBE6DXBhSP1vQpgY0YTY9xx/6uhAEMtHggRujrV9YovbCsiTk3NKcG6nQxXHAgRusTyoJZraUZIicxFhisOhMipYY8J5NKoG/sm/SuNp14yhaVMfZ8yHe+Y6DadT0SeMlxxIESahlpMIPQTt5LpH0nT+eSi/8pwxYEQWb1vbFSEzEiW4YoDIeIKnzeBbHhGdPSN4YoDIXLiXrsJhO4Txn2DghozuzhrOj74fsh0vlNX4wxXHAiR5ocRE8jqWl61dNTGcMWBEOl4Po/V4EEuFK1VkSpd3ctwxYEQoT09cosLRWttQ0QjDLV4oETorDT0H+PCtY934o/zn1ba//YOdxy9cay6jXYx1OLxAv6Fwx19l6oJNhR4kCWroQJZdg8xzMqH3oqTi3WGCyuqhhY2lcRy6K04kfGTZTTPBTeUjLmvaupudurmTHWgegcRukDvnehvDbpjk6bpPkGXWPHq5HD8A5nTwXS2WRcAAAAAAElFTkSuQmCC">
                            </a>
                            ` : ''}
                        </div>
                    </div>
                    <input type="hidden" id="action-plan-code" value="${actionPlanCode}">
                </form>`;

                var buttonOk = isEditable ?
                    '<button type="button" id="btn-save-action-plan-detail" class="modal-action waves-effect btn-flat blue white-text">Guardar cambios</button>'
                    : '';

                $('.div-modal').load('Home/Modal', {
                    ModalId: "modal-view-action-plan",
                    ModalClass: "modal modal-info2",
                    ModalHeader: '<span><label>Detalle Plan de Acción</label></span>',
                    ModalTitle: "",
                    ModalBody: body,
                    ModalButtonOk: buttonOk
                }, function () {
                    $(".modal-close").text("Cerrar");

                    $('#modal-view-action-plan').modal({ dismissible: false }).modal("open");

                    try {
                        if (typeof M !== 'undefined' && M.textareaAutoResize) {
                            M.textareaAutoResize($('#txt-executedesc-ap'));
                        } else {
                            $('#txt-executedesc-ap').css('height', 'auto');
                            $('#txt-executedesc-ap').css('height', $('#txt-executedesc-ap')[0].scrollHeight + 'px');
                        }
                    } catch (e) {
                        console.warn("Error al inicializar textarea:", e);
                    }

                    var ajax = getActionPlanDetailByActionPlanCode(actionPlanCode);
                    ajax.done(function (response) {
                        var responseJson;
                        try {
                            responseJson = typeof response === 'string' ? JSON.parse(response) : response;
                        } catch (e) {
                            console.error("Error al parsear respuesta:", e);
                            responseJson = response;
                        }

                        if (responseJson && responseJson.ActionPlanDetail && responseJson.ActionPlanDetail.length > 0) {
                            $.each(responseJson.ActionPlanDetail, function (index, item) {
                                var iconFile = "";
                                var isImage = false;

                                switch ((item.ActionPlanDetailExtFile || "").toLowerCase()) {
                                    case ".png":
                                    case ".jpg":
                                    case ".jpeg":
                                        iconFile = item.ActionPlanDetailPathFile;
                                        isImage = true;
                                        break;
                                    default:
                                        iconFile = getIconfile(item.ActionPlanDetailExtFile);
                                        break;
                                }

                                var divFile = `
                                    <div class="file-item" id="file-${item.ActionPlanDetailCode}" data-filecode="${item.ActionPlanDetailCode}"
                                        style="width:160px;margin:5px;border:1px solid #e0e0e0;border-radius:6px;padding:8px;background-color:#fff;position:relative;">
                                        <div style="position:absolute;top:5px;right:5px;display:flex;">
                                            <a href="${item.ActionPlanDetailPathFile}" target="_blank" class="file-download-link" title="Descargar archivo">
                                                <img src="${baseUrl}/Content/MeetingRecordAppWeb/img/ic_download_file.svg" style="width:16px;height:16px;">
                                            </a>
                                            ${isEditable ? `
                                            <a href="javascript:void(0);" class="btn-delete-detail-file" data-filecode="${item.ActionPlanDetailCode}"
                                                style="margin-left:5px;" title="Eliminar archivo">
                                                <i class="material-icons" style="color:#f44336;font-size:16px;">delete</i>
                                            </a>
                                            ` : ''}
                                        </div>
                                        <div style="display:flex;justify-content:center;margin-top:10px;margin-bottom:8px;height:60px;align-items:center;">
                                            <img src="${iconFile}" style="max-height:50px;max-width:${isImage ? '90%' : '50px'};">
                                        </div>
                                        <div style="text-align:center;font-size:11px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
                                            ${item.ActionPlanDetailCaptionFile}
                                        </div>
                                    </div>
                                `;

                                $(".div-action-plan-detail").append(divFile);
                                $(".btn-delete-detail-file").off("click").on("click", function () {
                                    var fileCode = $(this).data('filecode');
                                    deleteDetailFile(fileCode);
                                });
                            });

                            if ($(".div-action-plan-detail img").length > 0) {
                                $(".div-action-plan-detail img").not("[src*='ic_download_file.svg']").css("cursor", "pointer")
                                    .on("click", function () {
                                        if ($(this).attr('src').indexOf('data:image') !== -1 ||
                                            $(this).attr('src').indexOf('.jpg') !== -1 ||
                                            $(this).attr('src').indexOf('.png') !== -1 ||
                                            $(this).attr('src').indexOf('.jpeg') !== -1) {
                                            window.open($(this).attr("src"), "_blank");
                                        }
                                    });
                            }
                        } else {
                            $(".div-action-plan-detail").html('<div class="col s12 text-center" style="font-style:italic;color:#9f9b9b;padding:20px;">No hay archivos adjuntos</div>');
                        }

                        if (isEditable) {
                            $("#btn-add-detail-file").on("click", function () {
                                addDetailFile();
                            });

                            try {
                                if (typeof $.fn.tooltip === 'function') {
                                    $("#btn-add-detail-file").tooltip({ delay: 50, tooltip: "Agregar archivo", position: "right" });
                                }
                            } catch (e) {
                                console.warn("Error al inicializar tooltip:", e);
                            }

                            $(document).off("click", ".btn-delete-detail-file").on("click", ".btn-delete-detail-file", function () {
                                var fileCode = $(this).data('filecode');
                                deleteDetailFile(fileCode);
                            });

                            $("#btn-save-action-plan-detail").on("click", function () {
                                saveActionPlanChanges(actionPlanCode);
                            });
                        }
                    }).fail(function (xhr, status, error) {
                        $(".div-action-plan-detail").html('<div class="col s12 text-center" style="color:red;padding:20px;">Error al cargar archivos</div>');
                    });
                });
            }
        },
        error: function (xhr, status, error) {
            alert("Error al cargar los detalles del plan de acción");
        }
    });
}
/*================================================================================================================================================================================*/
function addDetailFile() {

    var fileInputId = "detail-file-input-" + new Date().getTime();

    var inputFile = $('<input>', {
        type: 'file',
        id: fileInputId,
        accept: '.jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx',
        style: 'display:none;'
    });

    $("body").append(inputFile);

    inputFile.on('change', function (e) {
        var files = e.target.files;

        if (files && files.length > 0) {
            var file = files[0];

            var extension = file.name.split('.').pop().toLowerCase();
            var iconPath = getIconfile('.' + extension);
            var fileItemId = "new-file-" + new Date().getTime();

            if ($(".new-file-container").length === 0) {
                $(".div-input-file").after('<div class="new-file-container" style="display:flex;flex-wrap:wrap;margin-top:10px;"></div>');
            }

            var fileHtml = `
                <div class="new-file-item" id="${fileItemId}" style="width:160px;margin:5px;border:1px solid #e0e0e0;border-radius:6px;padding:8px;background-color:#fff;position:relative;">
                    <div style="position:absolute;top:5px;right:5px;display:flex;">
                        <a href="javascript:void(0);" class="btn-delete-new-file" data-fileid="${fileItemId}" title="Eliminar archivo">
                            <i class="material-icons" style="color:#f44336;font-size:16px;">delete</i>
                        </a>
                    </div>
                    <div style="display:flex;justify-content:center;margin-top:10px;margin-bottom:8px;height:60px;align-items:center;">`;

            if (file.type.match('image.*')) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    $(`#${fileItemId} .file-preview`).html(`
                        <img src="${e.target.result}" style="max-height:50px;max-width:90%;">
                    `);
                };
                reader.readAsDataURL(file);
                fileHtml += `<div class="file-preview">
                    <div class="preloader-wrapper small active">
                        <div class="spinner-layer spinner-blue-only">
                            <div class="circle-clipper left"><div class="circle"></div></div>
                            <div class="gap-patch"><div class="circle"></div></div>
                            <div class="circle-clipper right"><div class="circle"></div></div>
                        </div>
                    </div>
                </div>`;
            } else {
                fileHtml += `<img src="${iconPath}" style="max-height:50px;max-width:50px;">`;
            }

            fileHtml += `
                    </div>
                    <div style="text-align:center;font-size:11px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
                        ${file.name}
                    </div>
                </div>
            `;

            $(".new-file-container").append(fileHtml);

            $(`#${fileItemId}`).data('file', file);

            $(document).off("click", `.btn-delete-new-file[data-fileid="${fileItemId}"]`).on("click", `.btn-delete-new-file[data-fileid="${fileItemId}"]`, function () {
                $(`#${fileItemId}`).fadeOut(200, function () {
                    $(this).remove();
                    if ($(".new-file-item").length === 0) {
                        $(".new-file-container").remove();
                    }
                });
            });
        }

        $(this).remove();
    });

    inputFile.click();
}
/*================================================================================================================================================================================*/
function deleteDetailFile(fileCode) {

    window.filesToDelete = window.filesToDelete || [];
    if (window.filesToDelete.indexOf(fileCode) === -1) {
        window.filesToDelete.push(fileCode);
    }

    $(`#file-${fileCode}`).attr('data-deleted', 'true')
        .css({
            'opacity': '0.5',
            'border': '1px dashed #ccc'
        })
        .find('.btn-delete-detail-file').hide();

    var $fileItem = $(`#file-${fileCode}`);
    if ($fileItem.length) {
        var originalBg = $fileItem.css('background-color');
        $fileItem.append('<div class="delete-indicator" style="position:absolute;top:0;left:0;width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:rgba(255,0,0,0.1);border-radius:5px;"><span style="color:#f44336;font-weight:bold;">Eliminado</span></div>');

        setTimeout(function () {
            $fileItem.find('.delete-indicator').fadeOut(200);
        }, 800);
    }
}
/*================================================================================================================================================================================*/
function saveActionPlanChanges(actionPlanCode) {

    var updatedComments = $("#txt-executedesc-ap").val().trim();

    if (updatedComments === "") {
        if ($("#txt-executedesc-ap").next(".error2").length === 0) {
            $("#txt-executedesc-ap").after('<div class="error2">Los comentarios son obligatorios.</div>');
        }
        return;
    } else {
        $("#txt-executedesc-ap").next(".error2").remove();
    }

    var filesToDelete = window.filesToDelete || [];

    $(".file-item[data-deleted='true']").each(function () {
        var fileCode = $(this).data("filecode");
        if (filesToDelete.indexOf(fileCode) === -1) {
            filesToDelete.push(fileCode);
        }
    });

    var newFiles = [];
    $(".new-file-item").each(function () {
        var file = $(this).data('file');
        if (file) {
            newFiles.push(file);
        }
    });

    $('.div-modal').load('/Home/Modal', {
        ModalId: "modal-save-confirmation",
        ModalClass: "modal-message modal-info2",
        ModalHeader: '<span><i class="blue-dark-text material-icons">help_outline</i><label>CONFIRMACIÓN</label></span>',
        ModalTitle: " ",
        ModalBody: "¿Está seguro que desea guardar los cambios realizados?",
        ModalButtonOk: '<button type="button" id="btn-confirm-save" class="modal-action waves-effect btn-flat blue white-text">Guardar</button>'
    }, function () {
        $('#modal-save-confirmation').modal({ dismissible: false }).modal('open')
            .one('click', '#btn-confirm-save', function () {
                $("#btn-confirm-save").html(
                    '<img src="' + baseUrl + '/Content/MeetingRecordAppWeb/img/ic_spinner_50.svg" style="width:35px;">' +
                    '<span style="position: relative; float: right;">Guardando...</span>'
                );

                $(".modal-close").addClass("disabled");

                var updateData = {
                    ActionPlanCode: actionPlanCode,
                    ActionPlanExecutedDesc: updatedComments
                };

                $.ajax({
                    type: "POST",
                    url: baseUrl + "/ActionPlan/updateActionPlanComments",
                    data: JSON.stringify(updateData),
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',
                    success: function (response) {

                        var promises = [];

                        filesToDelete.forEach(function (fileCode) {
                            var deletePromise = $.ajax({
                                type: "POST",
                                url: baseUrl + "/ActionPlanDetail/deleteActionPlanDetail",
                                data: JSON.stringify({ actionPlanDetailCode: fileCode }),
                                contentType: 'application/json; charset=utf-8',
                                dataType: 'json'
                            });
                            promises.push(deletePromise);
                        });

                        if (newFiles.length > 0) {
                            var data = new FormData();

                            for (var i = 0; i < newFiles.length; i++) {
                                var file = newFiles[i];
                                if (file) {
                                    var actionPlanDetailCode = getGeneratedCode("M-APD");
                                    data.append("entityList[" + i + "].ActionPlanCode", actionPlanCode);
                                    data.append("entityList[" + i + "].ActionPlanDetailCode", actionPlanDetailCode);
                                    data.append("entityList[" + i + "].ActionPlanDetailNameFile", file.name);
                                    data.append("entityList[" + i + "].ActionPlanDetailFile", file);
                                }
                            }

                            var uploadPromise = $.ajax({
                                type: "POST",
                                url: baseUrl + "/ActionPlanDetail/insertActionPlanDetail",
                                processData: false,
                                contentType: false,
                                data: data,
                                async: true
                            });
                            promises.push(uploadPromise);
                        }

                        Promise.all(promises)
                            .then(function () {
                                finishSaveProcess();
                                window.filesToDelete = [];
                            })
                            .catch(function (error) {
                            });
                    },
                    error: function (xhr, status, error) {
                        showErrorMessage("Ocurrió un error al guardar los cambios");
                    }
                });
            });
    });

    function finishSaveProcess() {
        $('#modal-save-confirmation').modal('close');

        setTimeout(function () {
            datatableExecuted.ajax.reload(function () {
                $('#modal-view-action-plan').modal('close');

                setTimeout(function () {
                    $('.modal-overlay').remove();
                    $('body').css('overflow', 'auto');
                    $('body').removeClass('modal-open');
                    window.filesToDelete = [];
                }, 300);
            });
        }, 300);
    }

    function showErrorMessage(message) {
        $('#modal-save-confirmation').modal('close');

        setTimeout(function () {
            $('.modal-overlay').not(':first').remove();

            $('.div-modal').load(baseUrl + '/Home/Modal', {
                ModalId: "modal-error",
                ModalClass: "modal-message modal-error2",
                ModalHeader: '<span><i class="material-icons">error</i><label>ERROR</label></span>',
                ModalTitle: "",
                ModalBody: message,
                ModalButtonOk: ''
            }, function () {
                $(".modal-close").text("CERRAR").removeClass("disabled");
                $('#modal-error').modal({ dismissible: false }).modal('open');

                $('#modal-error').one('modal:close', function () {
                    setTimeout(function () {
                        $('.modal-overlay').remove();
                        $('body').css('overflow', 'auto');
                    }, 300);
                });
            });
        }, 300);
    }
}
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
    +'<div class="row div-files"><div class="col s12" style="font-size:11px;color:#9f9b9b;padding-left:20px;">Archivos</div></div>'
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
            $('#modal-confirmation').modal({dismissible: false}).modal("open")
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
}*/ //ANTES
/*================================================================================================================================================================================*/
function getActionPlanDetailByActionPlanCode(actionPlanCode) {
    var data = {};
    data.actionPlanCode = actionPlanCode;
    return $.ajax({
        type: "POST",
        url: baseUrl + "/ActionPlanDetail/getActionPlanDetailByActionPlanCode",
        data: JSON.stringify(data),
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        async: true,
    });
}
/*================================================================================================================================================================================*/