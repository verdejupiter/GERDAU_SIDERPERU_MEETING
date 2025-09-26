/*================================================================================================================================================================================*/
/**
 * @fileOverview    Script Detalle de reunión
 * @author          ANGELY YAHAYRA MENDEZ CRUZ
 * @version         1.1.0
 * @updatedAt       26/07/2025
*/
/*================================================================================================================================================================================*/
/**
 * Inicializa jquery eventos y funciones
 */
$(document).ready(function() {
   $("#btn-send-email").on("click", showModalSendEmail);
});
/*================================================================================================================================================================================*/

/**
 * Mostrar modal de confirmación
 */
function showModalSendEmail() {
    var meetingCode = $(this).attr("data-meetingCode");
    $('.div-modal').load(baseUrl + '/Home/Modal',
    { 
        ModalId:        "modal-confirmation",
        ModalClass:     "modal-message modal-info2",
        ModalHeader:    '<span><i class="blue-dark-text material-icons">help_outline</i><label>CONFIRMACIÓN</label></span>',
        ModalTitle:     " ",
        ModalBody:      '<div class="text-body">¿Desea enviar e-mail a los participantes?</div>', 
        ModalButtonOk:  '<button type="button" id="btn-modal-aceppt" class="modal-action waves-effect btn-flat blue white-text">Aceptar</button>'
    },
    function() {
        $('#modal-confirmation').modal({dismissible: false}).modal('open')
        .one('click', '#btn-modal-aceppt', function (e) {
            var ajax = sendEmailByParticipants(meetingCode);
            ajax.done(function(response) {
                $('#modal-confirmation').modal("close");
                showAlertMessage($(".div-alert-message"), "light-green", "check", "Éxito :", "Se envió e-mail satisfactoriamente", 5000);
            });
        });
    });
}
/*================================================================================================================================================================================*/
/**
 * Enviar email a los participantes
 */
function sendEmailByParticipants(meetingCode) {
    return $.ajax({
        type        : "POST",
        url         : baseUrlPdf + "/getMeetingByCodeSavePdf/" + meetingCode,
        async       : true,
        beforeSend: function() {
            $("#btn-modal-aceppt").html('<img src="'+ baseUrl + '/Content/MeetingRecordAppWeb/img/ic_spinner_50.svg" style="width:35px;">' 
                +'<span style="position:  relative;float: right;">Aceptar</span>');
            $(".modal-close").addClass("disabled");
            $(".text-body").text("Enviando...");
        },
        error: function(response) {
        }
    }); 
}
/*================================================================================================================================================================================*/