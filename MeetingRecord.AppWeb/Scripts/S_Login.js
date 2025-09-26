/*================================================================================================================================================================================*/
/**
 * @fileOverview    Script Login
 * @author          ANGELY YAHAYRA MENDEZ CRUZ
 * @version         1.1.1
 * @updatedAt       27/08/2025
*/
/*================================================================================================================================================================================*/
/**
 * Inicializa jquery eventos y funciones
 */

var baseUrl = "";

$(document).ready(function () {
    localStorage.clear();
    $("#txt-username").focus();
    $("#form-login").on("submit", loginUser);
});
/*================================================================================================================================================================================*/
/**
 * Autentificación de usuario.
 */
function loginUser() {
    var data = {};
    data.UserNetName = $("#txt-username").val();
    data.UserPassword = $("#txt-password").val();

    if (data.UserNetName != "" || data.UserPassword != "") {
        $.ajax({
            type: "POST",
            url: "getUserByLoginAD",
            data: JSON.stringify(data),
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            async: true,
            beforeSend: function() {
                $('.div-alert-message').html(`<div style="padding:10px;">
                    <div class="preloader-wrapper small active">
                    <div class="spinner-layer spinner-blue-only">
                    <div class="circle-clipper left"> <div class="circle"></div> </div>
                    <div class="gap-patch"> <div class="circle"></div> </div>
                    <div class="circle-clipper right"> <div class="circle"></div></div>
                    </div></div></div>`);
                $("#txt-username").attr("disabled", "disabled");
                $("#txt-password").attr("disabled", "disabled");
                $("#btn-login").attr("disabled", "disabled");
            },
            success: function (response) {
                try {
                    const responseJson = $.parseJSON(response);
                    if (responseJson?.Message) {
                        showAlertMessage($(".div-alert-message"), "red", "cancel", "", responseJson.Message[0].Description, 0);
                    } else if (responseJson?.User) {
                        localStorage.setItem("UserId", responseJson.User[0].UserId);
                        localStorage.setItem("UserName", responseJson.User[0].UserName);
                        localStorage.setItem("UserNetName", responseJson.User[0].UserNetName);
                        localStorage.setItem("AreaId", responseJson.User[0].AreaId);
                        localStorage.setItem("CellId", responseJson.User[0].CellId);
                        localStorage.setItem("UserRole", responseJson.User[0].UserRole);
                        window.location.href = "MeetingRegister";
                    } else {
                        showAlertLoginError();
                    }
                } catch (e) {
                    showAlertLoginError(e.message);
                }
            },
            error: function (response) {
                showAlertLoginError();
            }
        });
    }
    else {
        showAlertMessage($(".div-alert-message"), "orange", "warning", "", "Complete los campos", 3000);
    }
}
/*================================================================================================================================================================================*/
function showAlertLoginError(message = "Error en la autentificación del usuario") {
    $("#txt-username").removeAttr("disabled");
    $("#txt-password").removeAttr("disabled");
    $("#btn-login").removeAttr("disabled");
    showAlertMessage($(".div-alert-message"), "red", "cancel", "", "Error en la autentificación", 0);
}
/*================================================================================================================================================================================*/
$(document).on('click', '.visibility-icon', function() {
    const isPasswordVisible = $('#txt-password').attr('type') === 'text';
    const type              = isPasswordVisible ? 'password' : 'text';
    const iconText          = isPasswordVisible ? 'visibility_off': 'visibility';

    // Establecer el tipo de contraseña y el texto del icono
    $('#txt-password').attr('type', type);
    $(this).text(iconText);
});
/*================================================================================================================================================================================*/