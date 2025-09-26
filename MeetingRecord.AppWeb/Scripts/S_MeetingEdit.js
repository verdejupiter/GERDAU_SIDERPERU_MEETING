/*================================================================================================================================================================================*/
/**
 * @fileOverview    Script Edición de acta de reunión
 * @author          ANGELY YAHAYRA MENDEZ CRUZ
 * @version         1.1.1
 * @updatedAt       10/09/2025
*/
/*================================================================================================================================================================================*/
// Variables globales
var datatableAssistance;
var datatableActionPlan;
var nroPauta = 0;
var nroDev = 0;
var startPickatime;
var endPickatime;
// var baseUrl = window.location.pathname.substring(0, window.location.pathname.indexOf('/', 1)) || '';
var deletedActionPlanCodes = [];

/*================================================================================================================================================================================*/
/**
 * Inicializa jquery eventos y funciones
 */
$(document).ready(function () {
  checkSessionExpired();

  validateFormMeeting();

  initTooltipButtom();

  setFormMeetingEdit();

  datatableActionPlan = initDatatableActionPlan();
  // datatableAssistance = getUserByTypeMeeting(0); // Si lo necesitas, descomenta

  // Eventos de agregar acción, asistentes, etc.
  $("#btn-add-action").on("click", showModalAddActionPlan);
  $(document).on("click", ".i-delete-action", deleteAction);
  $("#btn-add-guest").on("click", showModalAddGuest);

  // Eliminar usuario(s) asistente(s) en la tabla
  $("#btn-delete-assistance").on("click", function () {
    var selectedRows = $('.row-select-assistance:checked');

    if (selectedRows.length === 0) {
      // Mostrar mensaje si no hay filas seleccionadas
      $('.div-modal').load(baseUrl + '/Home/Modal', {
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
    $('.div-modal').load(baseUrl + '/Home/Modal', {
      ModalId: "modal-delete-confirm",
      ModalClass: "modal-message modal-info2",
      ModalHeader: '<span><i class="blue-dark-text material-icons">help_outline</i><label>CONFIRMACIÓN</label></span>',
      ModalTitle: "",
      ModalBody: "¿Está seguro de eliminar los participantes seleccionados?",
      ModalButtonOk: '<button type="button" id="btn-modal-aceppt" class="modal-action waves-effect btn-flat blue white-text">Aceptar</button>'
    }, function () {
      $('#modal-delete-confirm').modal({ dismissible: false }).modal('open')
        .off('click', '#btn-modal-aceppt') // Eliminar eventos anteriores
        .one('click', '#btn-modal-aceppt', function () {
          // Primero obtenemos todos los índices a eliminar
          var rowsToRemove = [];
          selectedRows.each(function () {
            rowsToRemove.push($(this).closest('tr'));
          });

          // Eliminar las filas de atrás hacia adelante para evitar problemas de índices
          for (var i = rowsToRemove.length - 1; i >= 0; i--) {
            datatableAssistance.row(rowsToRemove[i]).remove();
          }

          // Redibujar la tabla una sola vez al final
          datatableAssistance.draw(false);

          // Desmarcar checkbox "seleccionar todos"
          $('#select-all-assistance').prop('checked', false);

          $('#modal-delete-confirm').modal('close');
        });
    });
  }); //@AMENDEZ5

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

  startPickatime = initPickatime($("#txt-meeting-start-time"), "0");
  endPickatime = initPickatime($("#txt-meeting-end-time"), "0");

  $("#txt-meeting-end-time, #txt-meeting-start-time").on("change", validateStartEndTime);

  $("#btn-edit-meeting").on("click", showModalUpdateMeeting);

  $(document).on("click", ".a-edit-action-plan", showModalEditActionPlan);
  $(document).on("click", ".a-delete-action-plan", showModalDeleteActionPlan);
  $(document).on("click", ".switch-option-check", checkJustificationAssistance);

  // Para cargar documentos en los anexos - Inicializa con Bootstrap FileInput
  initBootstrapAttachedInput(); //@AMENDEZ5

  // Refresca la previsualización de archivos al cambiar el input
  $('.file-meeting-attached').on('change', function (event) {
    console.log('event.target.files:', event.target.files);
    console.log('typeof event.target.files:', typeof event.target.files);
    console.log('isArray:', Array.isArray(event.target.files));
  }); //@AMENDEZ5


  $(document).on('fileloaded', '.file-meeting-attached', function (event, file, previewId) {
    if (window.CanEdit === "true") {
      var $frame = $('#' + previewId);
      var $btnContainer = $('<div class="file-custom-buttons" style="position:absolute;top:5px;right:5px;z-index:100;"></div>');

      // Para archivos nuevos solo necesitamos el botón de eliminar
      var $deleteBtn = $(
        '<button type="button" class="btn-delete-new-file" ' +
        'style="background-color:#00bcd4;color:white;border:none;width:35px;height:35px;border-radius:50%;">' +
        '<i class="material-icons">delete</i>' +
        '</button>'
      );

      $deleteBtn.on('click', function (e) {
        e.preventDefault();
        e.stopPropagation();

        // Eliminar el archivo del input (para archivos nuevos)
        var $input = $frame.closest('.file-input').find('input[type="file"]');
        var fileInput = $input.get(0);

        if (fileInput && fileInput.files) {
          var dt = new DataTransfer();
          var removeIndex = $frame.index();

          for (var i = 0; i < fileInput.files.length; i++) {
            if (i !== removeIndex) {
              dt.items.add(fileInput.files[i]);
            }
          }
          fileInput.files = dt.files;
        }

        $frame.remove();
      });

      $btnContainer.append($deleteBtn);
      $frame.append($btnContainer);
    }
  });
  $(document).on("click", ".check-justification", function () {
    var index = $(this).attr("data-index");
    $("#div-reason-justification-" + index).html($(this).is(":checked") ? '<textarea id="txt-reason-justification-' + index + '" class="txt-reason-justification" data-index="' + index + '" maxlength="500"></textarea>' : '');
    setTimeout(() => { $("#txt-reason-justification-" + index).focus(); }, 500);
  });
  $(document).on("keyup", ".txt-reason-justification", function () {
    if ($(this).val() != "") {
      $(".rj-error-" + $(this).attr("data-index")).remove();
    }
  });

  // Al dar clic en la tardanza check de asistencia
  $(document).on("click", ".check-delay", function () {
  }); //@AMENDEZ5

  //Desglosable de opcionales
  /*$('#btn-toggle-opcionales').on('click', function () {
      var $content = $('#opcionales-content');
      var $icon = $('#icon-toggle-opcionales');
      $content.slideToggle(200, function () {
          $icon.text($content.is(':visible') ? 'expand_less' : 'expand_more');

      });
  });*/ //@AMENDEZ5

  //Desglosable de opcionales
  $('#opcionales-header').on('click', function (e) {
    if ($(e.target).closest('#btn-toggle-opcionales').length > 0 || e.target.id === 'btn-toggle-opcionales') {
      return;
    }
    toggleOpcionalesContent();
  });

  $('#btn-toggle-opcionales').on('click', function (e) {
    e.stopPropagation();
    toggleOpcionalesContent();
  });//@AMENDEZ5

  initFormSelect2();

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
        }
                /* Hacer que los checkboxes deshabilitados mantengan su apariencia normal */
        div[style*="pointer-events: none"] input[type="checkbox"] {
            opacity: 1 !important;
        }

        /* Estilos para el header con el checkbox "seleccionar todos" */
        th .checkbox-native {
            opacity: 1 !important;
        }
    `)
    .appendTo("head");
  //@AMENDEZ5

  // Agregar pauta=agenda sólo si no es asistente
  $("#btn-add-pauta").on("click", function () {
    if (!isAssistant()) {
      addInputPautaAutoGrow("i-delete-pauta", "text-meeting-pauta", "text-meeting-pauta-" + nroPauta, "Agenda", $("#div-meeting-pauta"));
      //$("input[name=text-meeting-pauta-" + nroPauta + "]").rules("add", { required: true, messages: { required: "Agenda es obligatorio" } });
      nroPauta++;
    }
  });

  // Agregar descripción=comentarios sólo si no es asistente
  $("#btn-add-description").on("click", function () {
    if (!isAssistant()) {
      addInputTextAreaAutoGrow("i-delete-description", "text-meeting-description", "text-meeting-description-" + nroDev, "Comentarios", $("#div-meeting-development"));
      //$("input[name=text-meeting-description-" + nroDev + "]").rules("add", { required: true, messages: { required: "Comentarios es obligatorio" } });
      nroDev++;
    }
  });

  // Eliminar input text sólo si no es asistente
  if (!isAssistant()) {
    // Eliminar input text (pauta, descripción de desarrollo)
    $(document).on("click", ".i-delete-pauta", removeInputPauta);
    $(document).on("click", ".i-delete-description", removeInput);
  }


  $(document).on('click', '.icon-calendar', function () {
    $("#txt-meeting-date").focus();
  });

  //21/8
  $(document).on('click', '.icon-clock', function () {
    $(this).siblings('input[type="text"]').focus();
  });



  // Evento para cuando el usuario escribe
  $(document).on('input', '.text-meeting-pauta, .text-meeting-description', function () {
    autoGrowTextArea(this);
  });


  //21/8
  if (!$("#textarea-styles").length) {
    $("<style id='textarea-styles'>")
      .prop("type", "text/css")
      .html(`
                .input-field-with-icon textarea {
                    border: 1px solid #e0e0e0 !important;
                    border-radius: 4px !important;
                    box-shadow: none !important;
                    padding: 0.7rem 2.5rem 0.7rem 1rem !important;
                    box-sizing: border-box !important;
                    font-size: 14px !important;
                    color: #212121 !important;
                    resize: none !important;
                    transition: border-color 0.2s;
                    max-height: 200px !important;
                    min-height: 100PX !important;
                    overflow-y: auto !important;
                    background-color: #fff !important;
                    line-height: 1.4 !important;
                }

                .input-field-with-icon textarea:focus {
                    border-color: #2196f3 !important;
                    outline: none !important;
                }

                .input-field-with-icon textarea:focus + label {
                    color: #00bcd4 !important;
                    font-weight: bold !important;
                }

                .input-field-with-icon label {
                    position: absolute;
                    top: -1.2rem;
                    left: 0.75rem;
                    background: white;
                    padding: 0 0.5rem;
                    font-size: 0.9rem;
                    color: #666;
                    pointer-events: none;
                    z-index: 1;
                }
            `)
      .appendTo("head");
  }

});
/*================================================================================================================================================================================*/
// Función para ajustar la altura automáticamente
function autoGrowTextArea(textarea) {
  textarea.style.height = 'auto';
  textarea.style.height = (textarea.scrollHeight) + 'px';
}
// Ajuste automático al cargar datos por JS
function ajustarTextareas() {
  $('.text-meeting-pauta, .text-meeting-description').each(function () {
    autoGrowTextArea(this);
  });
}

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
function isAssistant() {
  return window.IsAssistant === true || window.IsAssistant === "true";
}
/*================================================================================================================================================================================*/
function addCustomButtons() {
  // Buscar cada frame de vista previa
  $('.file-preview-frame').each(function () {
    var $frame = $(this);

    // Evitar duplicación de botones
    if ($frame.find('.file-custom-buttons').length > 0) {
      return;
    }

    // Obtener los datos necesarios
    var key = $frame.data('key') || $frame.find('.kv-file-remove').attr('data-key');
    var downloadUrl = $frame.find('.kv-file-download').attr('href');

    // Crear contenedor de botones con posición absoluta
    var $buttonsContainer = $(
      '<div class="file-custom-buttons" style="position:absolute;top:5px;right:5px;z-index:100;"></div>'
    );

    // Añadir botón de descarga (siempre visible)
    var $downloadBtn = $(
      '<button type="button" class="btn-download-file" ' +
      'style="background-color:#00bcd4;color:white;border:none;width:35px;height:35px;border-radius:50%;margin-right:5px;">' +
      '<i class="material-icons">cloud_download</i>' +
      '</button>'
    );

    $downloadBtn.on('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (downloadUrl) {
        window.open(downloadUrl, '_blank');
      }
    });

    $buttonsContainer.append($downloadBtn);

    // Añadir botón de eliminar solo si CanEdit=true y hay una key
    if (window.CanEdit === "true" && key) {
      var $deleteBtn = $(
        '<button type="button" class="btn-delete-file" data-key="' + key + '" ' +
        'style="background-color:#00bcd4;color:white;border:none;width:35px;height:35px;border-radius:50%;">' +
        '<i class="material-icons">delete</i>' +
        '</button>'
      );

      $deleteBtn.on('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var fileKey = $(this).data('key');

        $('.div-modal').load(baseUrl + '/Home/Modal', {
          ModalId: "modal-delete-file",
          ModalClass: "modal-message modal-info2",
          ModalHeader: '<span><i class="blue-dark-text material-icons">help_outline</i><label>CONFIRMACIÓN</label></span>',
          ModalTitle: "",
          ModalBody: "¿Está seguro de eliminar este archivo?",
          ModalButtonOk: '<button type="button" id="btn-delete-file" class="modal-action waves-effect btn-flat blue white-text">Aceptar</button>'
        }, function () {
          $('#modal-delete-file').modal({ dismissible: false }).modal('open')
            .one('click', '#btn-delete-file', function () {
              $.ajax({
                type: "POST",
                url: baseUrl + '/Meeting/DeleteAttachFile',
                data: {
                  fileCode: fileKey,
                  meetingCode: local_meetingCode
                },
                success: function (data) {
                  $frame.remove();
                  $('#modal-delete-file').modal('close');
                },
                error: function (xhr, status, error) {
                  $('#modal-delete-file').modal('close');
                  $('.div-modal').load(baseUrl + '/Home/Modal', {
                    ModalId: "modal-error",
                    ModalClass: "modal-message modal-error2",
                    ModalHeader: '<span><i class="material-icons">error</i><label>ERROR</label></span>',
                    ModalTitle: "",
                    ModalBody: "Error al eliminar el archivo: " + error,
                    ModalButtonOk: ''
                  }, function () {
                    $(".modal-close").text("Cerrar");
                    $('#modal-error').modal({ dismissible: false }).modal('open');
                  });
                }
              });
            });
        });
      });

      $buttonsContainer.append($deleteBtn);
    }

    // Agregar los botones al frame
    $frame.append($buttonsContainer);
  });
}

function getFileType(extension) {
  extension = extension.toLowerCase();
  if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
    return 'image';
  } else if (['pdf'].includes(extension)) {
    return 'pdf';
  } else if (['xls', 'xlsx'].includes(extension)) {
    return 'office';
  } else if (['doc', 'docx'].includes(extension)) {
    return 'office';
  } else if (['ppt', 'pptx'].includes(extension)) {
    return 'office';
  } else {
    return 'other';
  }
}

function addAttachFile() {
  var attachCount = $('.div-attached').length;

  var newAttachDiv =
    '<div class="div-attached input-field-with-icon label">' +
    '   <label>Anexo ' + (attachCount + 1) + '</label>' +
    '   <input type="text" class="txt-attach-file-title" placeholder="Título del anexo (opcional)">' +
    '   <div class="file-loading">' +
    '       <input type="file" multiple class="file-meeting-attached" name="file_meeting_attached[]" ' +
    '           accept=".png,.jpg,.jpeg,.xlsx,.xls,.docx,.pptx,.pdf,.rar,.zip,.7z,.dwg" />' +
    '   </div>' +
    '</div>';

  $("#div-meeting-attached").append(newAttachDiv);

  // Inicializar con un timeout para asegurar que el DOM está actualizado
  setTimeout(function () {
    initBootstrapAttachedInput();
  }, 200);
}

function initBootstrapAttachedInput() {
  $('.file-meeting-attached').each(function () {
    var $input = $(this);

    // Destruir la instancia previa si existe
    if ($input.data('fileinput')) {
      $input.fileinput('destroy');
    }

    // Configuración básica común para todos los modos
    var options = {
      language: 'es',
      showUpload: false,
      showCaption: true,
      showClose: false,
      showRemove: false, // Controlado por nuestros botones personalizados
      showPreview: true,
      showBrowse: window.CanEdit === "true",
      browseOnZoneClick: window.CanEdit === "true",
      browseClass: 'btn blue',
      browseLabel: 'Examinar',
      browseIcon: '<i class="material-icons">folder_open</i>',
      allowedFileExtensions: ['png', 'jpg', 'jpeg', 'xlsx', 'xls', 'docx', 'pptx', 'pdf', 'rar', 'zip', '7z', 'dwg'],
      maxFileSize: 15000,
      initialPreviewAsData: true,
      initialPreview: getInitialPreviewArray(),
      initialPreviewConfig: getInitialPreviewConfigArray(),
      fileActionSettings: {
        showUpload: false,
        showDrag: false,
        showZoom: false,
        showRemove: false, // Desactivamos los botones predeterminados
        downloadIcon: '<i class="hidden"></i>', // Ocultar botón de descarga predeterminado
        downloadClass: 'hidden',
        downloadTitle: ''
      },
      layoutTemplates: {
        actionDelete: '', // Eliminamos el botón de eliminar predeterminado
        actionDownload: '' // Eliminamos el botón de descarga predeterminado
      },
      dropZoneEnabled: window.CanEdit === "true"
    };

    // Inicializar el plugin
    $input.fileinput(options)
      .on('fileerror', function (event, data, msg) {
        $('.div-modal').load(baseUrl + '/Home/Modal', {
          ModalId: "modal-error",
          ModalClass: "modal-message modal-error2",
          ModalHeader: '<span><i class="material-icons">error</i><label>ERROR</label></span>',
          ModalTitle: "",
          ModalBody: msg,
          ModalButtonOk: ''
        }, function () {
          $(".modal-close").text("Cerrar");
          $('#modal-error').modal({ dismissible: false }).modal('open');
        });
      })
      .on('fileuploaded fileloaded', function () {
        // Añadir botones personalizados después de cargar un archivo
        setTimeout(function () {
          addCustomButtons();
        }, 100);
      })
      .on('filecleared', function () {
        // Limpiar botones personalizados cuando se limpien los archivos
        $('.file-custom-buttons').remove();
      });
  });

  // Agregar botones personalizados después de inicializar
  setTimeout(function () {
    addCustomButtons();
  }, 300);

  // Si es editable, agregar el botón de "Agregar Anexo"
  if (window.CanEdit === "true" && $("#btn-add-attached").length === 0) {
    $("#div-meeting-attached").after(
      '<button id="btn-add-attached" type="button" class="btn blue waves-effect waves-light" style="margin-top:10px;">' +
      '<i class="material-icons left">add</i>Agregar Anexo</button>'
    );

    $("#btn-add-attached").on("click", function () {
      addAttachFile();
    });
  }

  // Añadir CSS para estilizar los botones
  if (!$('#custom-file-buttons-style').length) {
    $('<style id="custom-file-buttons-style">')
      .html(`
                .file-preview-frame {
                    position: relative;
                }
                .btn-download-file, .btn-delete-file {
                    transition: transform 0.2s, background-color 0.2s;
                }
                .btn-download-file:hover, .btn-delete-file:hover {
                    transform: scale(1.1);
                    background-color: #00a5b9 !important;
                }
                .file-custom-buttons {
                    z-index: 1000;
                }
                /* Ocultar botones nativos del componente */
                .kv-file-download, .kv-file-remove {
                    display: none !important;
                }
            `)
      .appendTo('head');
  }
}

function getInitialPreviewArray() {
  var previews = [];
  if (local_attachFiles && local_attachFiles.length > 0) {
    local_attachFiles.forEach(function (file) {
      previews.push(file.AttachFilePath);
    });
  }
  return previews;
}

function getInitialPreviewConfigArray() {
  var configs = [];
  if (local_attachFiles && local_attachFiles.length > 0) {
    local_attachFiles.forEach(function (file) {
      configs.push({
        type: getFileType(file.AttachFileExtension),
        caption: file.AttachFileTitle || file.AttachFileName,
        key: file.AttachFileCode,
        size: 0,
        // Es importante tener tanto la URL como extra para la eliminación
        url: baseUrl + '/Meeting/DeleteAttachFile',
        downloadUrl: file.AttachFilePath,
        filename: file.AttachFileName + '.' + file.AttachFileExtension,
        extra: {
          fileCode: file.AttachFileCode,
          meetingCode: local_meetingCode
        }
      });
    });
  }
  return configs;
}
/*================================================================================================================================================================================*/
function insertAttachFile(meetingCode) {
  var hasFiles = false;
  var requests = [];

  $(".file-meeting-attached").each(function (index) {
    var files = $(this).get(0).files;
    var title = $(".txt-attach-file-title").eq(index).val();

    if (files.length > 0) {
      hasFiles = true;
      for (var i = 0; i < files.length; i++) {
        var data = new FormData();
        data.append("AttachFileCode", getGeneratedCode("ATF"));
        data.append("MeetingCode", meetingCode);
        data.append("AttachFileTitle", title);
        data.append("AttachFileBase", files[i]);

        var req = $.ajax({
          type: "POST",
          url: "insertAttachFile",
          processData: false,
          contentType: false,
          data: data,
          async: true,
          error: function () { }
        });
        requests.push(req);
      }
    }
  });

  if (hasFiles) {
    return $.when.apply($, requests);
  } else {
    return notificationsActionPlan();
  }
}//@AMENDEZ5
/*================================================================================================================================================================================*/
function initAutocompleteUser(selector, users) { //21/8
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
    }
  });

  $(selector).on('blur', function () {
    var userName = $(this).attr("data-username");
    if ($(this).val() != userName) {
      $(this).val("");
      $(this).attr("data-userid", "0");
      $(this).attr("data-username", "0");
    }
  });
}
/*================================================================================================================================================================================*/

/**
 * Establece un evento de selección que se ejecuta cuando los elementos especificados estén listos.
 * Permite seleccionar una opción cuando los elementos estén preparados.

 * @param {string} selector - El selector del elemento HTML.
 * @param {*} value - El valor de la opción a seleccionar.
 * @param {(value: string) => void} [func] - Una función adicional que se ejecuta después de configurar el evento (opcional).
 */
function setSelectWhenReady(selector, value, func = () => { }) {
    setTimeout(function () {
        const select = $(selector);
        if (select.find('option').length > 1 &&
            select.find('option[value="' + value + '"]').length > 0) {
            select.val(value).trigger('change');
        }

        // Ejecuta una función (opcional)
        func();
    }, 800);
}
/*================================================================================================================================================================================*/

function validateStartEndTime() {
  var startTime12h = startPickatime.data().clockpicker;
  var endTime12h = endPickatime.data().clockpicker;
  var startTime24h = convertStringToTime(startTime12h);
  var endTime24h = convertStringToTime(endTime12h);

  if ($("#txt-meeting-end-time").val() != "") {
    $("#txt-meeting-end-time-error").empty();

    if (endTime24h <= startTime24h) {
      if (endTime24h < startTime24h) {
        $("#txt-meeting-end-time-error").text("La hora final tiene que ser mayor a la hora inicial");
      } else {
        $("#txt-meeting-end-time-error").text("La hora final no puede ser igual a la hora inicial");
      }

      if ($("#form-meeting").data("validator")) {
        var validator = $("#form-meeting").validate();
        validator.showErrors({
          "txt-meeting-end-time": endTime24h < startTime24h ?
            "La hora final tiene que ser mayor a la hora inicial" :
            "La hora final no puede ser igual a la hora inicial"
        });
        $("#txt-meeting-end-time").addClass("error");
      }
    }
  }
}
/*================================================================================================================================================================================*/

function getAllUserAssistance() {
  var users = [];
  $('.switch-option-check').each(function (index, value) {
    var user = {};
    user.UserId = $(this).attr("data-userid");
    user.UserAssistanceStatus = $(this).is(":checked");
    user.UserAssistanceGuestEmail = $(this).attr("data-email");
    users.push(user);
  });
  return users;
}
/*================================================================================================================================================================================*/

function initFormSelect2() {
  // Inicializar Select2 en los combos principales
  $('#cbo-type-meeting').select2({ theme: "bootstrap", minimumResultsForSearch: 0 });
  $('#cbo-area').select2({ theme: "bootstrap", minimumResultsForSearch: 0 });
  $('#cbo-cell').select2({ theme: "bootstrap", minimumResultsForSearch: 0 });
  $('#txt-meeting-location').select2({ theme: "bootstrap", minimumResultsForSearch: 0 });

  // Cargar áreas al iniciar
  getAllArea(false);

  // Evento: al cambiar el área
  $("#cbo-area").on("change", function () {
    var areaId = $(this).val();
    if (areaId) {
      getCellByAreaId(areaId, function () {
        limpiarComboCell();
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

  // Evento: al cambiar la célula
  $("#cbo-cell").on("change", function () {
    var areaId = $("#cbo-area").val();
    var cellId = $(this).val();
    if (areaId) {
      getAllTypeMeetingByArea(areaId, cellId);
    }
  });

  // Utilidad para limpiar el combo de células
  function limpiarComboCell(cellId) {
    var $cell = $("#cbo-cell");
    $cell.find("option").each(function () {
      var text = $(this).text().trim().toUpperCase();
      if (text === "TODAS" || text === "*TODAS" || $(this).val() === "0") {
        $(this).remove();
      }
    });
    $cell.find("option[value='']").remove();
    $cell.prepend('<option value="" selected>Seleccionar...</option>');
    $cell.prop("disabled", false);
    $cell.trigger('change.select2');
    if (cellId) {
      $cell.val(cellId).trigger("change");
    } else {
      $cell.val("").trigger("change");
    }
  }
}
/*================================================================================================================================================================================*/

function setFormMeetingEdit() {

    // Esta manera se asegura la selección de opciones sucesivamente como corresponde.
    //  1ro -> Área
    //  2do -> Lugar y célula
    //  3ro -> Tipo de reunión
    setSelectWhenReady("#cbo-area", local_areaId, () => {

        setSelectWhenReady("#txt-meeting-location", local_meetingLocation);

        setSelectWhenReady("#cbo-cell", local_cellId, () => {

            setSelectWhenReady("#cbo-type-meeting", local_typeMeetingCode);
        });
    });

    $("#txt-meeting-subject").val(local_meetingSubject);

    let pickadate = initPickadate($("#txt-meeting-date"), ".div-info-meeting");
    pickadate.set('select', local_meetingDate, { format: 'dd/mm/yyyy' });

    startPickatime = initPickatime($("#txt-meeting-start-time"), local_meetingStartTime24h);
    endPickatime = initPickatime($("#txt-meeting-end-time"), local_meetingEndTime24h);
    $("#txt-meeting-start-time").val(timeTo12HrFormat(local_meetingStartTime24h)).attr("data-time24h", local_meetingStartTime24h);
    $("#txt-meeting-end-time").val(timeTo12HrFormat(local_meetingEndTime24h)).attr("data-time24h", local_meetingEndTime24h);

    datatableAssistance = initDatatableAssistance();

    // Limpiar los contenedores
    $("#div-meeting-pauta").find("input:not(.text-meeting-pauta:first)").remove();
    $("#div-meeting-development").find("input:not(.text-meeting-description:first)").remove();

    // Establecer el primer valor (si existe)
    //21/8

    // Establecer el primer valor (si existe)
    setTimeout(function () {
        if (local_meeting_pautas && local_meeting_pautas.length > 0) {
            var $firstPauta = $(".text-meeting-pauta");
            $firstPauta.val(local_meeting_pautas[0]);
            // Aplicar crecimiento automático directamente
            if ($firstPauta.length > 0) {
            autoGrowTextArea($firstPauta[0]);
            }

            for (var i = 1; i < local_meeting_pautas.length; i++) {
            addInputPautaAutoGrow("i-delete-pauta", "text-meeting-pauta", "text-meeting-pauta-" + nroPauta, "Agenda", $("#div-meeting-pauta"));
            var $textarea = $("textarea[name='text-meeting-pauta-" + nroPauta + "']");
            $textarea.val(local_meeting_pautas[i]);
            // Aplicar crecimiento automático directamente
            if ($textarea.length > 0) {
                autoGrowTextArea($textarea[0]);
            }
            nroPauta++;
            }
        }

        if (local_meeting_descriptions && local_meeting_descriptions.length > 0) {
            var $firstDescription = $(".text-meeting-description");
            $firstDescription.val(local_meeting_descriptions[0]);
            // Aplicar crecimiento automático directamente
            if ($firstDescription.length > 0) {
            autoGrowTextArea($firstDescription[0]);
            }

            for (var i = 1; i < local_meeting_descriptions.length; i++) {
                addInputTextAreaAutoGrow("i-delete-description", "text-meeting-description", "text-meeting-description-" + nroDev, "Comentarios", $("#div-meeting-development"));
                var $textarea = $("textarea[name='text-meeting-description-" + nroDev + "']");
                $textarea.val(local_meeting_descriptions[i]);
                // Aplicar crecimiento automático directamente
                if ($textarea.length > 0) {
                    autoGrowTextArea($textarea[0]);
                }
                nroDev++;
            }
        }
    }, 300);


    // Inicializar componente FileInput con los anexos existentes
    initBootstrapAttachedInput();

    setTimeout(function () {
        if (datatableAssistance && typeof datatableAssistance.row === "function" &&
            typeof arrayUserAssistance !== "undefined" && arrayUserAssistance.length > 0) {

            $("#btn-delete-assistance").fadeIn("slow");
            $.each(arrayUserAssistance, function (i, item) {
                datatableAssistance.row.add({
                    "UserId": item.UserId,
                    "UserName": item.UserName !== "" ? item.UserName : item.UserAssistanceGuest,
                    "AreaName": item.AreaName,
                    "EnterpriseName": item.EnterpriseName,
                    "UserAssistanceGuest": item.UserAssistanceGuest,
                    "UserAssistanceGuestDesc": item.UserAssistanceGuestDesc === "" ? null : item.UserAssistanceGuestDesc,
                    "UserAssistanceGuestEmail": item.UserAssistanceGuestEmail === "" ? null : item.UserAssistanceGuestEmail,
                    "UserAssistanceStatus": item.UserAssistanceStatus,
                    "UserAssistanceJustification": item.UserAssistanceJustification,
                    "UserAssistanceReasonJustification": item.UserAssistanceReasonJustification,
                    "CellName": item.CellName,
                    "UserAssistanceDelay": item.UserAssistanceDelay
                }).draw();
            });
        }
    }, 100);

    if (typeof arrayActionPlan !== "undefined" && arrayActionPlan.length > 0) {
        setTimeout(function () {
            if (datatableActionPlan && typeof datatableActionPlan.row === "function") {
                $.each(arrayActionPlan, function (i, item) {
                    datatableActionPlan.row.add({
                    "RowNumber": i + 1,
                    "ActionPlanCode": item.ActionPlanCode,
                    "ActionPlanWhat": item.ActionPlanWhat,
                    "ResponsibleUserName": item.ResponsibleUserName,
                    "ResponsibleUserId": item.ResponsibleUserId,
                    "ActionPlanScheduledDate": item.ActionPlanScheduledDate,
                    "ActionPlanCategoryId": item.ActionPlanCategoryId,
                    "ActionPlanCategoryName": item.ActionPlanCategoryName,
                    "ActionPlanPriority": item.ActionPlanPriority,
                    "ActionPlanStatus": item.ActionPlanStatus,
                    "IsNew": false
                    }).draw();
                });
            }
        }, 100);
    }
}
/*================================================================================================================================================================================*/

/**
 * Inicializar titulos de botones con el plugin tooltip
 */
function initTooltipButtom() {
  $("#btn-add-guest").tooltip({ delay: 50, tooltip: "Agregar Asistentes", position: "left" });
  $("#btn-add-action").tooltip({ delay: 50, tooltip: "Agregar Acción", position: "left" });
  $("#btn-insert-meeting").tooltip({ delay: 50, tooltip: "Guardar Reunión", position: "left" });
}
/*================================================================================================================================================================================*/

function showModalAddGuest() {
  // Validar que la tabla de asistentes esté inicializada
  if (!datatableAssistance || typeof datatableAssistance.row !== "function") {
    $('.div-modal').load(baseUrl + '/Home/Modal', {
      ModalId: "modal-warning",
      ModalClass: "modal-message modal-warning2",
      ModalHeader: '<span><i class="material-icons">warning</i><label>ADVERTENCIA</label></span>',
      ModalTitle: "",
      ModalBody: "La tabla de asistentes aún no está lista. Por favor, espera unos segundos e inténtalo de nuevo.",
      ModalButtonOk: ''
    }, function () {
      $(".modal-close").text("Cerrar");
      $('#modal-warning').modal({ dismissible: false }).modal('open');
    });
    return;
  }

  var body = '<form id="form-modal">' +
    '<div class="col s12">' +
    '<div class="col s12" style="padding-bottom:20px;padding-left:7px;">' +
    '<div class="switch material">' +
    '<label>Interno<input type="checkbox" id="chck-type-user"><span class="lever"></span>Externo</label>' +
    '</div></div>' +
    '<div id="div-user-assistance"></div>' +
    '</div>' +
    '</form>';

  $('.div-modal').load(baseUrl + '/Home/Modal',
    {
      ModalId: "modal-confirmation",
      ModalClass: "modal modal-info2",
      ModalHeader: '<div style="border-bottom:1px solid #e0e6ed; margin-bottom:18px;"><span><label>Agregar Asistentes</label></span></div>',
      ModalTitle: "",
      ModalBody: body,
      ModalButtonOk: '<button type="submit" id="btn-modal-aceppt" class="modal-action waves-effect btn-flat blue white-text">Aceptar</button>'
    },
    function () {
      // Primero renderizar los campos sin validación
      showAddFormGuest();

      // Luego, con seguridad, inicializar el validador
      $("#form-modal").validate({
        errorClass: "error2",
        rules: {},
        messages: {},
        errorElement: 'div'
      });

      // Función auxiliar para agregar reglas solo después de que el DOM esté actualizado
      function addValidationRules() {
        if ($("#form-modal").length && $("#txt-user-assistance").length) {
          $("#txt-user-assistance").rules("add", {
            required: true,
            messages: { required: "Colaborador es obligatorio" }
          });

          if ($("#chck-type-user").is(':checked')) {
            if ($("#txt-desc-user-assistance").length) {
              $("#txt-desc-user-assistance").rules("add", {
                required: true,
                messages: { required: "Detalles es obligatorio" }
              });
            }

            if ($("#txt-email-user-assistance").length) {
              $("#txt-email-user-assistance").rules("add", {
                required: true,
                email: true,
                messages: {
                  required: "E-mail es obligatorio",
                  email: "Por favor, introduce un e-mail válido."
                }
              });
            }
          }
        }
      }

      // Agregar reglas después de un timeout mínimo
      setTimeout(addValidationRules, 50);

      // Evento del switch: actualizar los campos y sus reglas
      $(document).off("click", "#chck-type-user").on("click", "#chck-type-user", function () {
        // Primero limpiar el validador
        if ($("#form-modal").data('validator')) {
          $("#form-modal").validate().resetForm();
        }

        // Renderizar los campos
        showAddFormGuest();

        // Agregar las reglas después
        setTimeout(addValidationRules, 50);
      });

      $('#modal-confirmation').modal({ dismissible: false }).modal('open')
        .on('click', '#btn-modal-aceppt', function () {
          if ($("#form-modal").valid()) {
            var areaName = $("#txt-user-assistance").attr("data-area") == "" ? "--" : $("#txt-user-assistance").attr("data-area");
            var enterprise = $("#txt-user-assistance").attr("data-enterprise") == "" ? "--" : $("#txt-user-assistance").attr("data-enterprise");
            datatableAssistance.row.add({
              "UserName": $("#txt-user-assistance").val(),
              "AreaName": areaName,
              "UserId": $("#txt-user-assistance").attr("data-userid"),
              "EnterpriseName": enterprise,
              "UserAssistanceGuestDesc": $("#txt-desc-user-assistance").val(),
              "UserAssistanceGuestEmail": $("#txt-email-user-assistance").val(),
            }).draw();
            $('#modal-confirmation').modal('close');
            $(".card-content-assistance").animate({ scrollTop: $('.card-content-assistance').prop("scrollHeight") }, 1000);
          }
        });
    }
  );
}
/*================================================================================================================================================================================*/
function isTrue(val) {
  return val === true || val === "true" || val === "1" || val === 1;
}
/*================================================================================================================================================================================*/
function checkJustificationAssistance() {
  try {
    var $switch = $(this);
    var dataIndex = $switch.attr("data-index");

    if (!dataIndex || isNaN(dataIndex)) return;

    var rowData;
    try {
      rowData = datatableAssistance.row(dataIndex).data();
      if (!rowData) return; // Si no hay datos, salir
    } catch (err) {
      console.log("Error al obtener datos de la fila:", err);
      return;
    }

    var isChecked = $switch.is(":checked");
    var isAssistantMode = isAssistant();

    $("#div-delay-" + dataIndex).empty();
    $("#div-justification-" + dataIndex).empty();
    $("#div-reason-justification-" + dataIndex).empty();

    if (isChecked) {
      var delayChecked = isTrue(rowData.UserAssistanceDelay) ? 'checked' : '';

      var readonlyAttr = isAssistantMode ? 'style="pointer-events: none;"' : '';

      $("#div-delay-" + dataIndex).html(
        '<div ' + readonlyAttr + '>' +
        '<input type="checkbox" data-index="' + dataIndex + '" class="check-delay filled-in" id="check-delay-' + dataIndex + '" ' +
        delayChecked + ' />' +
        '<label for="check-delay-' + dataIndex + '">Tardanza</label>' +
        '</div>'
      );
    } else {
      var justificationChecked = isTrue(rowData.UserAssistanceJustification) ? 'checked' : '';

      var readonlyAttr = isAssistantMode ? 'style="pointer-events: none;"' : '';

      $("#div-justification-" + dataIndex).html(
        '<div ' + readonlyAttr + '>' +
        '<input type="checkbox" data-index="' + dataIndex + '" class="check-justification filled-in" id="check-justification-' + dataIndex + '" ' +
        justificationChecked + ' />' +
        '<label for="check-justification-' + dataIndex + '">Justificado</label>' +
        '</div>'
      );

      if (isTrue(rowData.UserAssistanceJustification)) {
        var readonlyTextarea = isAssistantMode ? 'readonly' : '';
        $("#div-reason-justification-" + dataIndex).html(
          '<textarea id="txt-reason-justification-' + dataIndex + '" class="txt-reason-justification" ' +
          'data-index="' + dataIndex + '" maxlength="500" ' + readonlyTextarea + '>' +
          (rowData.UserAssistanceReasonJustification || '') +
          '</textarea>'
        );
      }
    }
  } catch (e) {
    console.error("Error en checkJustificationAssistance:", e);
  }
}
/*================================================================================================================================================================================*/
function initDatatableAssistance() {
  return $("#datatable-user-assistance").DataTable({
    "bDestroy": true,
    "responsive": true,
    "bAutoWidth": false,
    "bFilter": false,
    "paging": false,
    "ordering": false,
    "info": false,
    "bLengthChange": false,
    "language": { "url": "/Content/library/datatable/language/Spanish.json" },
    "aoColumns": [
      {
        "data": null,
        "title": '<input type="checkbox" id="select-all-assistance" class="checkbox-native"/>',
        "orderable": false,
        "sClass": "text-center-vh checkbox-narrow-column",
        "sWidth": "2%",
        "render": function (data, type, full, meta) {
          var id = 'row-select-assistance-' + meta.row;
          // En lugar de usar disabled, creamos un contenedor con pointer-events: none cuando sea necesario
          var readonlyAttr = isAssistant() ? 'style="pointer-events: none;"' : '';

          return '<div ' + readonlyAttr + '>' +
            '<input type="checkbox" class="row-select-assistance checkbox-native" id="' + id + '" data-row="' + meta.row + '" />' +
            '</div>';
        }
      },
      { "data": "UserName", "title": "Colaborador", "sClass": "text-center-vh", "sWidth": "8%" },
      {
        "data": null,
        "title": "Asistencia",
        "sClass": "text-center-vh",
        "sWidth": "90%",
        "mRender": function (data, type, full, meta) {
          var email = data['UserAssistanceGuestEmail'] == null ? 0 : data['UserAssistanceGuestEmail'];
          var isPresent = isTrue(data['UserAssistanceStatus']);
          var disabled = isAssistant() ? "disabled" : "";
          return '<div class="row" style="margin-bottom: 0;">'
            + '<div class="col s4">'
            + '<div class="switch-preview">'
            + '<label class="switch black-text"> '
            + '<input type="checkbox" class="switch-option-check" data-userid="' + data['UserId'] + '" '
            + ' data-email="' + email + '" data-index="' + meta.row + '" ' + (isPresent ? 'checked' : '') + ' ' + disabled + '>'
            + '<span class="slider round"></span>'
            + '</label>'
            + '</div>'
            + '</div>'
            + '<div class="col s8" style="padding-top:5px; padding-left:9px;">'
            + '<div id="div-justification-' + meta.row + '" class="hidden-option justification-option"></div>'
            + '<div id="div-delay-' + meta.row + '" class="hidden-option delay-option"></div>'
            + '<div id="div-reason-justification-' + meta.row + '" style="margin-top:5px;"></div>'
            + '</div>'
            + '</div>';
        }
      }
    ],
    select: {
      style: 'os',
      selector: 'td'
    },
    "fnRowCallback": function (nRow, aData, iDisplayIndex) {
      $('td:eq(0)', nRow).removeClass("text-hv-center").addClass("text-left black-text").css("font-size", "11px");
      $('td:eq(1)', nRow).removeClass("text-hv-center").addClass("text-left black-text").css("font-size", "11px");

      // Si es asistente, agregar clase de fila deshabilitada
      if (isAssistant()) {
        $(nRow).addClass('row-disabled');
      }
    },
    "drawCallback": function () {
      // Inicializar los interruptores de asistencia
      $('.switch-option-check').each(function () {
        checkJustificationAssistance.call(this);
      });

      // Manejar la selección de filas con checkboxes
      $('.row-select-assistance').off('change').on('change', function () {
        var $row = $(this).closest('tr');
        if ($(this).is(':checked')) {
          $row.addClass('selected');
          $row.addClass('selected-row');
        } else {
          $row.removeClass('selected');
          $row.removeClass('selected-row');
        }
      });

      // Restaurar selecciones previas
      $('.row-select-assistance').each(function () {
        if ($(this).is(':checked')) {
          $(this).closest('tr').addClass('selected selected-row');
        }
      });

      // Manejar selección de todas las filas
      $('#select-all-assistance').off('change').on('change', function () {
        if (isAssistant()) return false; // Evitar cambios si es asistente

        var checked = $(this).is(':checked');
        $('.row-select-assistance').prop('checked', checked).trigger('change');
      });
    }
  });
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
      "cbo-area": { required: true }
    },
    messages: {
      "txt-meeting-subject": { required: "Nombre de reunión es obligatorio" },
      "txt-meeting-date": { required: "Día es obligatorio" },
      "txt-meeting-start-time": { required: "Hora inicio es obligatorio" },
      "txt-meeting-end-time": { required: "Hora fin es obligatorio" },
      "txt-meeting-location": { required: "Lugar es obligatorio" },
      "cbo-type-meeting": { required: "Tipo de reunión es obligatorio" },
      "cbo-area": { required: "Área es obligatorio" }
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
        console.log("Hola")
      return false;
    },
    // Forzar validación de campos Select2
    ignore: []
  });

  $("#txt-meeting-end-time, #txt-meeting-start-time").on("change", validateStartEndTime);

  // Agregar un evento especial para validar Select2 al hacer click en el botón de guardar
  $("#btn-insert-meeting").on("click", function () {
    if ($("#txt-meeting-start-time").val() !== "" && $("#txt-meeting-end-time").val() !== "") {
      validateStartEndTime();
    }

    if ($("#cbo-type-meeting").val() === "" || $("#cbo-type-meeting").val() === null) {
      $("#cbo-type-meeting-error").show().html('<div class="error2">Tipo de reunión es obligatorio</div>');
    } else {
      $("#cbo-type-meeting-error").empty();
    }

    if ($("#txt-meeting-location").val() === "" || $("#txt-meeting-location").val() === null) {
      $("#txt-meeting-location-error").show().html('<div class="error2">Lugar es obligatorio</div>');
    } else {
      $("#txt-meeting-location-error").empty();
    }
  });

  $("#cbo-type-meeting").on("change", function () {
    if ($(this).val() !== "" && $(this).val() !== null) {
      $("#cbo-type-meeting-error").empty();
    } else {
      $("#cbo-type-meeting-error").html('<div class="error2">Tipo de reunión es obligatorio</div>');
    }
  });

  $("#txt-meeting-location").on("change", function () {
    if ($(this).val() !== "" && $(this).val() !== null) {
      $("#txt-meeting-location-error").empty();
    } else {
      $("#txt-meeting-location-error").html('<div class="error2">Lugar es obligatorio</div>');
    }
  });

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
  if ($("#chck-type-user").is(':checked')) {
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
      );
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

  setTimeout(function () {
    $("input[name=txt-user-assistance]").focus();
  }, 200);
}
//@AMENDEZ5
/*================================================================================================================================================================================*/
function showModalUpdateMeeting() {
  var modalBody = '<div class="text-question">¿Desea actualizar esta acta de reunión?</div>'
    + '<div style="padding-top:15px;"><p><input type="checkbox" class="filled-in" id="check-send-email"/><label for="check-send-email">Enviar e-mail a los participantes</label></p></div>';

  var typeMeetingCode = $("#cbo-type-meeting").val();
  var validateJustification = true;

  if ($("#form-meeting").valid()) {
    if (typeMeetingCode != null) {
      var count = datatableAssistance.data().count();
      if (count > 0) {
        $(".txt-reason-justification-error").remove();
        $(".txt-reason-justification").each(function (index, item) {
          if ($(this).val() == '') {
            $("#div-reason-justification-" + index).append('<div class="error2 txt-reason-justification-error rj-error-' + index + '" style="padding-top:10px;text-align:left;">Motivo es obligatorio</div>');
            validateJustification = false;
          }
        });
        if (!validateJustification) {
          $('html, body').animate({ scrollTop: 0 }, 'slow');
          return false;
        }

        $('.div-modal').load(baseUrl + '/Home/Modal',
          {
            ModalId: "modal-confirmation",
            ModalClass: "modal-message-2 modal-info2",
            ModalHeader: '<span><i class="blue-dark-text material-icons">help_outline</i><label>CONFIRMACIÓN</label></span>',
            ModalTitle: " ",
            ModalBody: modalBody,
            ModalButtonOk: '<button type="button" id="btn-modal-aceppt" class="modal-action waves-effect btn-flat blue white-text">Aceptar</button>'
          },
          function () {
            $('#modal-confirmation').modal({ dismissible: false }).modal('open')
              .one('click', '#btn-modal-aceppt', function (e) {
                const isCheckedSendEmail = $("#check-send-email").is(":checked");
                $("#check-send-email").attr("disabled", "disabled");

                // Actualizar acta de reunion
                var ajax = updateMeeting(local_meetingCode, typeMeetingCode);
                ajax.done(function (response) {

                  // Eliminar todo el detalle del acta de reunion
                  var ajaxDeleteAll = deleteAllMeetingDetail(local_meetingCode);
                  ajaxDeleteAll.done(function (response) {

                    // Registrar plan de accion
                    var ajaxap = insertActionPlan(local_meetingCode);
                    ajaxap.done(function (response) {

                      // Registrar imagenes
                      var ajaxmdi = insertMeetingDevWithImage(local_meetingCode);
                      ajaxmdi.done(function (response) {

                        // Registrar asistencia
                        var ajaxu = insertUserAssistance(local_meetingCode);
                        ajaxu.done(function (response) {

                          // Registrar agenda
                          var ajaxg = insertGuide(local_meetingCode);
                          ajaxg.done(function (response) {

                            // Registrar desarrollo
                            var ajaxMD = insertMeetingDev(local_meetingCode);
                            ajaxMD.done(function (response) {

                              // Enviar acta en pdf al correo
                              var ajaxPdf = getMeetingByCodeSavePdf(local_meetingCode, isCheckedSendEmail);
                              ajaxPdf.done(function (response) {

                                // Archivos adjuntos
                                var ajaxAttach = insertAttachFile(local_meetingCode);
                                ajaxAttach.done(function () {
                                  window.location.href = "MeetingList";
                                });
                              });
                            });
                          });
                        });
                      });
                    });
                  });
                });
              });
          }
        );
      }
      else {
        $('.div-modal').load(baseUrl + '/Home/Modal',
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
            $('#modal-confirmation').modal({ dismissible: false }).modal('open')
              .on('click', '#btn-modal-aceppt', function (e) { $('#modal-confirmation').modal('close'); });
          });
      }
    }
    else {
      $("#cbo-type-meeting-error").text("Tipo de reunión es obligatorio");
    }
  }
  else {
    var countIndex = 0;
    $("div.error").each(function (index, item) {
      if ($(item).text() != "") {
        if (countIndex == 0) {
          $('html, body').animate({ scrollTop: $(item).offset().top - 150 }, 'slow');
          countIndex++;
        }
      }
    });

    if (typeMeetingCode == null) {
      $("#cbo-type-meeting-error").text("Tipo de reunión es obligatorio");
      $('html, body').animate({ scrollTop: 0 }, 100);
    }
  }
}
/*function showModalUpdateMeeting() {
    var modalBody = '<div class="text-question">¿Desea guardar esta acta de reunión?</div>'
    +'<div style="padding-top:15px;"><p><input type="checkbox" class="filled-in" id="check-send-email"/><label for="check-send-email">Enviar e-mail a los participantes</label></p></div>';

    var typeMeetingCode = $("#cbo-type-meeting").val();
    //var typeMeetingCode = $("#cbo-type-meeting").select2("val");ANTES
    if($("#form-meeting").valid()) {
        if(typeMeetingCode != null) {
            var count = datatableAssistance.data().count();
            if(count > 0) {
                $(".txt-reason-justification-error").remove();
                $(".txt-reason-justification").each(function(index, item) {
                    if($(this).val() == '') {
                        $("#div-reason-justification-"+index).append('<div class="error2 txt-reason-justification-error rj-error-'+index+'" style="padding-top:10px;text-align:left;">Motivo es obligatorio</div>');
                        validateJustification = false;
                    }
                });
                $('.div-modal').load(baseUrl + '/Home/Modal',
                    {
                        ModalId       :  "modal-confirmation",
                        ModalClass    :  "modal-message-2 modal-info2",
                        ModalHeader:  '<span><i class="blue-dark-text material-icons">help_outline</i><label>CONFIRMACIÓN</label></span>',
                        ModalTitle    :  " ",
                        ModalBody     :  modalBody,
                        ModalButtonOk :  '<button type="button" id="btn-modal-aceppt" class="modal-action waves-effect btn-flat blue white-text">Aceptar</button>'
                    },
                    function() {
                       $('#modal-confirmation').modal({dismissible: false}).modal('open')
                       .one('click', '#btn-modal-aceppt', function (e) {
                            var isCheckedSendEmail = $("#check-send-email").is(":checked");
                            $("#check-send-email").attr("disabled", "disabled");

                            // Actualizar acta de reunion
                            var ajax = updateMeeting(local_meetingCode, typeMeetingCode);
                            ajax.done(function(response) {

                                // Eliminar todo el detalle del acta de reunion
                                var ajaxDeleteAll = deleteAllMeetingDetail(local_meetingCode);
                                ajaxDeleteAll.done(function(response) {

                                    // Registrar plan de accion
                                    var ajaxap = insertActionPlan(local_meetingCode);
                                    ajaxap.done(function(response) {

                                        // Registrar imagenes
                                        var ajaxmdi = insertMeetingDevWithImage(local_meetingCode);
                                        ajaxmdi.done(function(response) {

                                            // Registrar asistencia
                                            var ajaxu = insertUserAssistance(local_meetingCode);
                                            ajaxu.done(function(response) {

                                                // Registrar agenda
                                                var ajaxg = insertGuide(local_meetingCode);
                                                ajaxg.done(function(response) {

                                                    // Registrar desarrollo
                                                    var ajaxMD = insertMeetingDev(local_meetingCode);
                                                    ajaxMD.done(function(response) {

                                                        // Enviar acta en pdf al correo
                                                        var ajaxPdf = getMeetingByCodeSavePdf(local_meetingCode, isCheckedSendEmail);
                                                        ajaxPdf.done(function(response) {
                                                            window.location.href = "MeetingList";
                                                        });
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    }
                );
            }
            else {
                $('.div-modal').load(baseUrl + '/Home/Modal',
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
                    .on('click', '#btn-modal-aceppt', function (e) {$('#modal-confirmation').modal('close'); });
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
}/*
/*================================================================================================================================================================================*/ //ANTES
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
                <input type="text" name="txt-ap-responsible" class="txt-ap-responsible" placeholder="Escribir el nombre">
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
  $('.div-modal').load(baseUrl + '/Home/Modal',
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

              var nuevoEstado = (fechaPlan < hoy) ? 2 : 1;

              datatableActionPlan.row.add({
                "RowNumber": count + 1,
                "ActionPlanWhat": $(".txt-ap-what").val(),
                "ActionPlanCategoryId": categoryId, //@AMENDEZ5
                "ActionPlanCategoryName": categoryName, //@AMENDEZ5
                "ResponsibleUserName": $(".txt-ap-responsible").val(), //@AMENDEZ5
                "ResponsibleUserId": $(".txt-ap-responsible").attr("data-userid"),
                "ActionPlanScheduledDate": $("#txt-ap-date").val(),
                "ActionPlanPriority": $("#txt-ap-priority").val(), //@AMENDEZ5
                "ActionPlanStatus": nuevoEstado,//@AMENDEZ5
                "IsNew": true
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
/*function showModalAddActionPlan() {
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

    $('.div-modal').load(baseUrl + '/Home/Modal',
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
                            "RowNumber": count + 1,
                            "ActionPlanWhat": $(".txt-ap-what").val(),
                            "ActionPlanCategoryId": $("#txt-ap-category").val(),
                            "ActionPlanCategoryName": $("#txt-ap-category option:selected").text(),
                            "ResponsibleUserName": $(".txt-ap-responsible").val(),
                            "ResponsibleUserId": $(".txt-ap-responsible").attr("data-userid"),
                            "ActionPlanScheduledDate": $("#txt-ap-date").val(),
                            "ActionPlanPriority": $("#txt-ap-priority").val()
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

  var originalCategoryId = actionPlan.ActionPlanCategoryId;
  var originalPriority = actionPlan.ActionPlanPriority;

  $('.div-modal').load(baseUrl + '/Home/Modal',
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

      initAutocompleteUser(".txt-ap-responsible", null);
      $(".txt-ap-what").val(actionPlan.ActionPlanWhat);
      $(".txt-ap-responsible").val(actionPlan.ResponsibleUserName);
      $(".txt-ap-responsible").attr("data-userid", actionPlan.ResponsibleUserId);

      var pickadate = initPickadate($("#txt-ap-date"), "body", function () {
        $('html, body').animate({ scrollTop: $(".div-actionplan").offset().top - 50 }, 'slow');
      });
      $("#txt-ap-date").val(actionPlan.ActionPlanScheduledDate);

      $.ajax({
        url: baseUrl + '/getAllActionPlanCategoryActive',
        type: 'GET',
        dataType: 'json',
        success: function (response) {
          if (typeof response === 'string') {
            response = JSON.parse(response);
          }

          var $categorySelect = $("#txt-ap-category");
          $categorySelect.empty();
          $categorySelect.append('<option value="" disabled>Seleccionar...</option>');

          var selectedIndex = -1;

          if (response.ActionPlanCategory && response.ActionPlanCategory.length > 0) {
            $.each(response.ActionPlanCategory, function (i, category) {
              if (category.ActionPlanCategoryId == originalCategoryId) {
                selectedIndex = i + 1; // +1 porque hay una opción inicial
              }

              $categorySelect.append('<option value="' + category.ActionPlanCategoryId + '">' +
                category.ActionPlanCategoryName + '</option>');
            });
          }

          $categorySelect.material_select();

          setTimeout(function () {
            if (selectedIndex >= 0) {
              $categorySelect.val(originalCategoryId);
              $categorySelect.material_select('refresh');
            } else {
              $("select#txt-ap-category option").each(function () {
                if ($(this).text() === actionPlan.ActionPlanCategoryName) {
                  $categorySelect.val($(this).val());
                }
              });
              $categorySelect.material_select('refresh');
            }
          }, 200);

          $('#txt-ap-priority').material_select();
          setTimeout(function () {
            $("#txt-ap-priority").val(originalPriority);
            $('#txt-ap-priority').material_select('refresh');
          }, 200);
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
              "ActionPlanCode": actionPlan.ActionPlanCode,
              "ActionPlanWhat": $(".txt-ap-what").val(),
              "ActionPlanCategoryId": categoryId,
              "ActionPlanCategoryName": categoryName,
              "ResponsibleUserName": $(".txt-ap-responsible").val(),
              "ResponsibleUserId": $(".txt-ap-responsible").attr("data-userid"),
              "ActionPlanScheduledDate": $("#txt-ap-date").val(),
              "ActionPlanPriority": $("#txt-ap-priority").val(),
              "ActionPlanStatus": nuevoEstado, // Asignar el estado basado en la fecha
              "IsNew": false
            }).draw();

            $('#modal-confirmation').modal('close');
          }
        });
    }
  );
} //@AMENDEZ5

/*function showModalEditActionPlan() {
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

    $('.div-modal').load(baseUrl + '/Home/Modal',
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

                    $(".txt-ap-what").val(actionPlan.ActionPlanWhat.replace("<br/>", "\n")).css("height", $(".txt-ap-what")[0].scrollHeight - 10);
                    $(".txt-ap-why").val(actionPlan.ActionPlanWhy.replace("<br/>", "\n")).css("height", $(".txt-ap-why")[0].scrollHeight - 10);
                    $(".txt-ap-responsible").val(actionPlan.ResponsibleUserName);
                    $(".txt-ap-responsible").attr("data-userid", actionPlan.ResponsibleUserId);
                    $("#txt-ap-date").val(actionPlan.ActionPlanScheduledDate);
                    validateFormModal();
                }
            })
            .modal('open')
            .on('click', '#btn-modal-aceppt', function (e) {
                if($("#form-modal").valid()) {
                    datatableActionPlan.row.add({
                        "RowNumber": count + 1,
                        "ActionPlanWhat": $(".txt-ap-what").val(),
                        "ActionPlanCategoryId": $("#txt-ap-category").val(),
                        "ActionPlanCategoryName": $("#txt-ap-category option:selected").text(),
                        "ResponsibleUserName": $(".txt-ap-responsible").val(),
                        "ResponsibleUserId": $(".txt-ap-responsible").attr("data-userid"),
                        "ActionPlanScheduledDate": $("#txt-ap-date").val(),
                        "ActionPlanPriority": $("#txt-ap-priority").val()
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
  var row = datatableActionPlan.row(index).data();

  $('.div-modal').load(baseUrl + '/Home/Modal', {
    ModalId: "modal-confirmation",
    ModalClass: "modal-message modal-info2",
    ModalHeader: '<span><i class="blue-dark-text material-icons">help_outline</i><label>CONFIRMACIÓN</label></span>',
    ModalTitle: "",
    ModalBody: "¿Desea eliminar este plan de acción?",
    ModalButtonOk: '<button type="button" id="btn-modal-aceppt" class="modal-action waves-effect btn-flat blue white-text">Aceptar</button>'
  }, function () {
    $('#modal-confirmation').modal({ dismissible: false }).modal('open')
      .one('click', '#btn-modal-aceppt', function () {
        // Si el plan ya existe en BD, guarda su código para eliminarlo en el backend
        if (row && row.ActionPlanCode) {
          deletedActionPlanCodes.push(row.ActionPlanCode);
        }
        datatableActionPlan.row(index).remove().draw(false);
        $('#modal-confirmation').modal('close');
      });
  });
} //@AMENDEZ5
/*function showModalDeleteActionPlan() {
    var index = $(this).attr("data-index");
    $('.div-modal').load(baseUrl + '/Home/Modal',
    {
        ModalId:        "modal-confirmation",
        ModalClass:     "modal-message modal-info2",
        ModalHeader:    '<span><i class="blue-dark-text material-icons">help_outline</i><label>CONFIRMACIÓN</label></span>',
        ModalTitle:     " ",
        ModalBody:      "¿Desea eliminar este plan de acción?",
        ModalButtonOk:  '<button type="button" id="btn-modal-aceppt" class="modal-action waves-effect btn-flat blue white-text">Aceptar</button>'
    },
    function() {
        $('#modal-confirmation').modal({dismissible: false}).modal('open')
        .on('click', '#btn-modal-aceppt', function (e) {

            //Redefinir el nro de fila
            $.each(datatableActionPlan.rows().data(), function(i, item) {
                datatableActionPlan.row(i).data({
                    "RowNumber"                 : i,
                    "ActionPlanWhat"            : item.ActionPlanWhat,
                    "ActionPlanWhy"             : item.ActionPlanWhy,
                    "ResponsibleUserName"       : item.ResponsibleUserName,
                    "ResponsibleUserId"         : item.ResponsibleUserId,
                    "ActionPlanScheduledDate"   : item.ActionPlanScheduledDate
                }).draw();
            });
            datatableActionPlan.row(index).remove().draw( false );
            $('#modal-confirmation').modal("close");
        });
    }
    );
}*/ //ANTES
/*================================================================================================================================================================================*/
function initDatatableActionPlan() {
  return $("#datatable-action-plan").DataTable({
    "bDestroy": true,
    "responsive": true,
    "bAutoWidth": true,
    "bFilter": false,
    "paging": false,
    "ordering": false,
    "info": false,
    "bLengthChange": false,
    "language": { "url": "/Content/library/datatable/language/Spanish.json" },
    "aoColumns": [
      //{"data":"RowNumber", "title": "N°","sClass": "text-center-vh", "sWidth": "1%"}, //ANTES
      {
        "data": "ActionPlanWhat", "title": "Acción", "sClass": "text-center-vh", "sWidth": "20%",
        "mRender": function (data) {
          return '<div style="display:flex;justify-content:center;align-items:center;height:100%;">' + (data || '') + '</div>';
        }
      }, //@AMENDEZ5
      //{"data":"ActionPlanWhy", "title": "¿Porque?","sClass": "text-center-vh", "sWidth": "20%"}, //ANTES
      {
        "data": "ActionPlanCategoryName", "title": "Categoría", "sClass": "text-center-vh", "sWidth": "5%",
        "mRender": function (data) {
          return '<div style="display:flex;justify-content:center;align-items:center;height:100%;">' + (data || '') + '</div>';
        }
      }, //@AMENDEZ5
      {
        "data": "ResponsibleUserName", "title": "Responsable", "sClass": "text-center-vh", "sWidth": "20%",
        "mRender": function (data) {
          return '<div style="display:flex;justify-content:center;align-items:center;height:100%;">' + (data || '') + '</div>';
        }
      }, //@AMENDEZ5
      {
        "data": "ActionPlanScheduledDate", "title": "Fecha Programada", "sClass": "text-center-vh", "sWidth": "3%",
        "mRender": function (data) {
          return '<div style="display:flex;justify-content:center;align-items:center;height:100%;">' + (data || '') + '</div>';
        }
      }, //@AMENDEZ5
      {
        "data": null,
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
      {
        "data": null,
        "title": "Estado",
        "sClass": "text-center-vh",
        "sWidth": "10%",
        "mRender": function (data) {
          var status = data["ActionPlanStatus"];
          var statusHtml = "";
          var styleEstado = "white-space:nowrap;min-width:90px;font-weight:bold;color:#fff;";

          status = status ? status.toString() : "";

          switch (status) {
            case "1":
              statusHtml = "<span class='new badge yellow darken-1' style='" + styleEstado + "'>En Proceso</span>";
              break;
            case "2":
              statusHtml = "<span class='new badge red' style='" + styleEstado + "'>Fuera de Plazo</span>";
              break;
            case "3":
              statusHtml = "<span class='new badge green' style='" + styleEstado + "'>Cerrado</span>";
              break;
            case "4":
              statusHtml = "<span class='new badge orange darken-1' style='" + styleEstado + "'>Cerrado Fuera de Plazo</span>";
              break;
          }

          return "<div style='display:flex;justify-content:center;align-items:center;height:100%;'>" + statusHtml + "</div>";
        }
      },  //@AMENDEZ5
      {
        "data": null,
        "title": "Opciones",
        "sClass": "text-center-vh",
        "sWidth": "5%",
        "mRender": function (data, type, row, meta) {
          if (isTrue(window.CanEdit)) {
            return '<div class="buttons-preview">'
              + '<a href="javascript:void(0);" class="a-edit a-edit-action-plan activator"><i class="material-icons">mode_edit</i></a>'
              + '<a href="javascript:void(0);" class="a-delete a-delete-action-plan"><i class="material-icons">delete_forever</i></a>'
              + '</div>';
          }
          if (data.IsNew === true) {
            return '<div class="buttons-preview">'
              + '<a href="javascript:void(0);" class="a-edit a-edit-action-plan activator"><i class="material-icons">mode_edit</i></a>'
              + '<a href="javascript:void(0);" class="a-delete a-delete-action-plan"><i class="material-icons">delete_forever</i></a>'
              + '</div>';
          }
          return '';
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
function updateMeeting(meetingCode, typeMeetingCode) {
  const data = {};
  data.MeetingCode = meetingCode;
  data.TypeMeetingCode = typeMeetingCode;
  data.AreaId = $("#cbo-area").val();
  data.CellId = $("#cbo-cell").val();
  data.UpdatedByUserId = localStorage.getItem("UserId");
  data.MeetingSubject = $("#txt-meeting-subject").val();
  data.LocationCode = $("#txt-meeting-location").val(); //@AMENDEZ5
  data.MeetingDate = formatStrDate($("#txt-meeting-date").val(), 'dd/mm/yyyy', "/");
  data.MeetingStartTime = $("#txt-meeting-start-time").attr("data-time24h");
  data.MeetingEndTime = $("#txt-meeting-end-time").attr("data-time24h");

  return $.ajax({
    type: "POST",
    url: baseUrl + "/updateMeeting",
    data: JSON.stringify(data),
    dataType: 'json',
    contentType: 'application/json; charset=utf-8',
    async: true,
    beforeSend: function () {
      $("#btn-modal-aceppt").html('<img src="' + baseUrl + '/Content/MeetingRecordAppWeb/img/ic_spinner_50.svg" style="width:35px;">'
        + '<span style="position:  relative;float: right;">Aceptar</span>');
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
  $.each(datatableAssistance.rows().data(), function (i, item) {
    var obj = {};
    obj.MeetingCode = meetingCode;
    obj.UserAssistanceCode = getGeneratedCode("M-AP");
    obj.UserId = item.UserId;
    obj.UserAssistanceGuest = item.UserId == 0 ? item.UserName : null;
    obj.UserAssistanceGuestDesc = item.UserId == 0 ? item.UserAssistanceGuestDesc : null;
    obj.UserAssistanceGuestEmail = item.UserId == 0 ? item.UserAssistanceGuestEmail : null;
    obj.UserAssistanceStatus = $('.switch-option-check').eq(i).is(":checked");
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
  data.entityList = entityList;

  return $.ajax({
    type: "POST",
    url: baseUrl + "/insertUserAssistance",
    data: JSON.stringify(data),
    dataType: 'json',
    contentType: 'application/json; charset=utf-8',
    async: true,
    error: function (response) {
    }
  });
}
/*================================================================================================================================================================================*/
function insertGuide(meetingCode) {
  var entityList = [];
  $(".text-meeting-pauta").each(function (index, value) {
    if ($(this).val() != "") {
      var obj = {}; // Solo una declaración
      obj.MeetingCode = meetingCode;
      obj.GuideCode = getGeneratedCode("M-G");
      obj.GuideDescription = $(this).val();
      entityList.push(obj);
    }
  });

  // Sin crear variable data
  return $.ajax({
    type: "POST",
    url: baseUrl + "/insertGuide",
    data: JSON.stringify(entityList), // Sigue enviando el array directamente
    dataType: 'json',
    contentType: 'application/json; charset=utf-8',
    async: true,
    error: function (response) {
      console.error("Error en insertGuide:", response);
    }
  });
}

/*================================================================================================================================================================================*/
function insertMeetingDev(meetingCode) {
  var entityList = [];
  $(".text-meeting-description").each(function (index, value) {
    if ($(this).val() != "") {
      var obj = {};
      obj.MeetingCode = meetingCode;
      obj.MeetingDevCode = getGeneratedCode("M-D");
      obj.MeetingDevDescription = $(this).val();
      entityList.push(obj);
    }
  });

  var data = {};
  data.entityList = entityList;

  return $.ajax({
    type: "POST",
    url: baseUrl + "/insertMeetingDev",
    data: JSON.stringify(data),
    dataType: 'json',
    contentType: 'application/json; charset=utf-8',
    async: true,
    error: function (response) {
    }
  });
}
/*================================================================================================================================================================================*/
function insertMeetingDevWithImage(meetingCode) {
  var data = new FormData();
  var validateImage = false;
  $(".file-meetingDevImage").each(function (index, value) {

    var meetingDevCode = $(this).attr("data-MeetingDevCode");
    var meetingDevImage = $(this).attr("data-MeetingDevImage");
    var meetingDevExtImage = $(this).attr("data-MeetingDevExtImage");
    var meetingDevNameImage = $(this).attr("data-MeetingDevNameImage");
    var files = $(this).get(0).files;
    if (files.length > 0 || meetingDevImage != null) {
      data.append("entityList[" + index + "].MeetingCode", meetingCode);
      data.append("entityList[" + index + "].MeetingDevCode", getGeneratedCode("M-D"));
      data.append("entityList[" + index + "].MeetingDevTitle", $(".txt-meeting-dev-title").eq(index).val());
      data.append("entityList[" + index + "].MeetingDevDescription", $(".txt-meeting-dev-description").eq(index).val());

      data.append("entityList[" + index + "].MeetingDevImage", meetingDevImage != null ? meetingDevImage : "");
      data.append("entityList[" + index + "].MeetingDevExtImage", meetingDevExtImage != null ? meetingDevExtImage : "");
      data.append("entityList[" + index + "].MeetingDevNameImage", meetingDevNameImage != null ? meetingDevNameImage : "");

      data.append("entityList[" + index + "].MeetingDevFileImage", files.length > 0 ? files[0] : "");
      validateImage = true;
    }
  });

  if (validateImage) {
    return $.ajax({
      type: "POST",
      url: baseUrl + "/insertMeetingDevWithImage",
      processData: false,
      contentType: false,
      data: data,
      async: true,
      error: function (response) {
      }
    });
  }
  return notificationsActionPlan();
}
/*================================================================================================================================================================================*/
function insertActionPlan(meetingCode) {
  var countActionPlan = datatableActionPlan.data().count();
  var dataActionPlan = datatableActionPlan.rows().data();

  if (countActionPlan > 0) {
    var newPlans = [];
    var existingPlans = [];

    $.each(dataActionPlan, function (i, item) {
      // Para planes nuevos
      if (item.IsNew === true || !item.ActionPlanCode) {
        var fechaProgramada = item.ActionPlanScheduledDate;
        var partes = fechaProgramada.split('/');
        var fechaPlan = new Date(partes[2], partes[1] - 1, partes[0]);
        var hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        var status = (fechaPlan < hoy) ? 2 : 1; // 2 = Fuera de Plazo, 1 = En Proceso

        var newPlan = {
          ActionPlanCode: getGeneratedCode("M-AP"),
          MeetingCode: meetingCode,
          ActionPlanWhat: item.ActionPlanWhat,
          ResponsibleUserId: parseInt(item.ResponsibleUserId, 10),
          ActionPlanScheduledDate: item.ActionPlanScheduledDate,
          ActionPlanStatus: status,
          ActionPlanPriority: item.ActionPlanPriority,
          ActionPlanCategoryId: parseInt(item.ActionPlanCategoryId, 10)
        };
        newPlans.push(newPlan);
      }
      // Para planes existentes
      else {
        var fechaProgramada = item.ActionPlanScheduledDate;
        var partes = fechaProgramada.split('/');
        var fechaPlan = new Date(partes[2], partes[1] - 1, partes[0]);
        var hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        var status = (fechaPlan < hoy) ? 2 : 1; // 2 = Fuera de Plazo, 1 = En Proceso

        var existingPlan = {
          ActionPlanCode: item.ActionPlanCode,
          MeetingCode: meetingCode,
          ActionPlanWhat: item.ActionPlanWhat,
          ResponsibleUserId: parseInt(item.ResponsibleUserId, 10),
          ActionPlanScheduledDate: item.ActionPlanScheduledDate,
          ActionPlanStatus: status, // Usar el estado calculado
          ActionPlanPriority: item.ActionPlanPriority,
          ActionPlanCategoryId: parseInt(item.ActionPlanCategoryId, 10)
        };
        existingPlans.push(existingPlan);
      }
    });

    var promises = [];

    // Insertar planes nuevos si hay alguno
    if (newPlans.length > 0) {
      var insertPromise = $.ajax({
        type: "POST",
        url: baseUrl + "/insertActionPlan",
        data: JSON.stringify({ entityList: newPlans }),
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        async: true,
        success: function (response) {
        },
        error: function (xhr, status, error) {
          console.error("❌ Error al insertar planes nuevos:", error, xhr.responseText);
        }
      });
      promises.push(insertPromise);
    }

    // Actualizar planes existentes uno por uno
    existingPlans.forEach(function (plan) {
      var updatePromise = $.ajax({
        type: "POST",
        url: baseUrl + "/ActionPlan/updateActionPlan",
        data: JSON.stringify(plan),
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        async: true,
        success: function (response) {
        },
        error: function (xhr, status, error) {
          console.error(`❌ Error al actualizar plan ${plan.ActionPlanCode}:`, error, xhr.responseText);
        }
      });
      promises.push(updatePromise);
    });

    if (deletedActionPlanCodes.length > 0) {
      deletedActionPlanCodes.forEach(function (code) {
        var deletePromise = $.ajax({
          type: "POST",
          url: baseUrl + "/ActionPlan/DeleteActionPlan",
          data: { actionPlanCode: code },
          async: true,
        });
        promises.push(deletePromise);
      });
      deletedActionPlanCodes = [];
    }

    return $.when.apply($, promises);
  }
  return notificationsActionPlan();
}


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
            obj.ActionPlanStatus = parseInt(item.ActionPlanStatus, 10);
            obj.ActionPlanPriority = item.ActionPlanPriority;
            obj.ActionPlanCategoryId = parseInt(item.ActionPlanCategoryId, 10);

            entityList.push(obj);
        });

        var data = {};
        data.entityList =  entityList;
        return $.ajax({
            type        : "POST",
            url         : "/insertActionPlan",
            data        : JSON.stringify(data),
            dataType    : 'json',
            contentType : 'application/json; charset=utf-8',
            async       : true,
            error       : function(response) {
            }
        });
    }
    return notificationsActionPlan();
}*/ //ANTES
/*================================================================================================================================================================================*/
function deleteAllMeetingDetail(meetingCode) {
  var data = {};
  data.meetingCode = window.btoa(meetingCode);
  return $.ajax({
    type: "POST",
    url: baseUrl + "/deleteAllMeetingDetail",
    data: JSON.stringify(data),
    dataType: 'json',
    contentType: 'application/json; charset=utf-8',
    async: true,
    error: function (response) {
    }
  });
}
/*================================================================================================================================================================================*/
function getMeetingByCodeSavePdf(meetingCode, isCheckedSendEmail) {
  if (isCheckedSendEmail === true) {
    return $.ajax({
      type: "POST",
      url: baseUrl + "/getMeetingByCodeSavePdf/" + meetingCode,
      async: true,
      error: function (response) {
      }
    });
  }
  else {
    return notificationsActionPlan();
  }
}
/*================================================================================================================================================================================*/
