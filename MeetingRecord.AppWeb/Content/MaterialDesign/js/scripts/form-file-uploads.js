$(document).ready(function () {
    // Función para inicializar el componente de carga de archivos
    function initBootstrapAttachedInput() {
        $('.file-meeting-attached').fileinput({
            theme: 'fa', // Tema visual para los iconos
            language: 'es', // Idioma español
            showUpload: false, // No mostrar botón de carga
            showCancel: false, // No mostrar botón de cancelar
            showRemove: true, // Mostrar botón de eliminar
            showPreview: true, // Mostrar previsualización
            showBrowse: true, // Mostrar botón de explorar
            browseOnZoneClick: true, // Permitir hacer clic en la zona para explorar
            allowedFileExtensions: ['png', 'jpg', 'jpeg', 'xlsx', 'xls', 'docx', 'pptx', 'pdf', 'rar', 'zip', '7zip', 'dwg'],
            maxFileSize: 15000, // 15 MB
            msgInvalidFileExtension: 'Tipo de archivo no válido "{name}". Solo se admiten archivos "{extensions}".',
            msgSizeTooLarge: 'El archivo "{name}" ({size} KB) excede el tamaño máximo permitido de {maxSize} KB.',
            initialPreviewAsData: true,
            overwriteInitial: false,
            // Plantillas simplificadas y adaptadas al estilo Material Design
            layoutTemplates: {
                actionDelete: '<button type="button" class="kv-file-remove btn btn-sm btn-default" title="{removeTitle}"{dataKey}><i class="material-icons">delete</i></button>',
                actionZoom: '<button type="button" class="kv-file-zoom btn btn-sm btn-default" title="{zoomTitle}"><i class="material-icons">zoom_in</i></button>'
            },
            // Configuración de los botones de acción para cada archivo
            fileActionSettings: {
                showRemove: true, // Mostrar botón de eliminar
                showUpload: false, // No mostrar botón de subir
                showZoom: true, // Mostrar botón de zoom
                showDrag: false, // No mostrar función de arrastrar
                removeIcon: '<i class="material-icons">delete</i>', // Icono de Material Design para eliminar
                zoomIcon: '<i class="material-icons">zoom_in</i>', // Icono de Material Design para zoom
                removeTitle: 'Eliminar archivo',
                zoomTitle: 'Ver detalles'
            },
            // Personalización adicional del área de carga de archivos
            dropZoneTitle: 'Arrastre y suelte aquí los archivos ...',
            browseLabel: 'EXAMINAR ...',
            previewZoomButtonIcons: {
                prev: '<i class="material-icons">chevron_left</i>',
                next: '<i class="material-icons">chevron_right</i>',
                toggleheader: '<i class="material-icons">expand_less</i>',
                fullscreen: '<i class="material-icons">fullscreen</i>',
                borderless: '<i class="material-icons">crop_free</i>',
                close: '<i class="material-icons">close</i>'
            }
        });
    }

    // Inicializar el componente de carga de archivos
    function addAttachFile() {
        // Contador para ID único
        var attachCount = $('.div-attached').length;

        var newAttachDiv =
            '<div class="div-attached input-field-with-icon label">' +
            '   <label>Anexo ' + (attachCount + 1) + '</label>' +
            '   <input type="text" class="txt-attach-file-title" placeholder="Título del anexo (opcional)">' +
            '   <input type="file" multiple class="file-meeting-attached" ' +
            '          data-allowed-file-extensions="png jpg jpeg xlsx xls docx pptx pdf rar zip 7zip dwg" ' +
            '          data-max-file-size="15M" />' +
            '</div>';

        $("#div-meeting-attached").append(newAttachDiv);

        // Importante: inicializar después de agregar al DOM
        setTimeout(function () {
            initBootstrapAttachedInput();
        }, 100);
    }

    // Inicializar los elementos existentes
    initBootstrapAttachedInput();

    // Agregar un manejador para el botón "Agregar anexo" si existe
    $('#btn-add-attached').on('click', function () {
        addAttachFile();
    });
});
