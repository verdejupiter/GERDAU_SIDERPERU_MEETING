/*================================================================================================================================================================================*/
/**
 * @fileOverview    Script Access Web
 * @author          ANGELY YAHAYRA MENDEZ CRUZ 'AMENDEZ5'
 * @version         1.1.0
 * @updatedAt       19/08/2025
*/
/*================================================================================================================================================================================*/

var gs_urlHome = "http://intsider/Weblogin/Home";
var gs_urlSistem = "http://intsider/MeetingAppWeb/";

var gbool_isReady = false;
var gbool_isRefresh = false;
/*================================================================================================================================================================================*/
gf_readyDocument();
loginMeetingAppWeb();
/*================================================================================================================================================================================*/
/* Functions to Get and Value Session from SistemaWebSeguridad */
function gf_readyDocument() {
    gf_onlineHome();
    var ljson_sys;
    var ls_sistema = sessionStorage.getItem("SISW-Sistema") === undefined ? null : sessionStorage.getItem("SISW-Sistema");
    if (ls_sistema !== null) {
        ljson_sys = JSON.parse(localStorage.getItem(ls_sistema));
        ljson_sys.activo = "1";
        ljson_sys.bk_activo = "1";
        localStorage.setItem(ls_sistema, JSON.stringify(ljson_sys));
        sessionStorage.setItem("SISW-Perfil", ljson_sys.perfil);
        sessionStorage.setItem("SISW-User", ljson_sys.user);
    }
    gbool_isReady = true;
}
/*================================================================================================================================================================================*/
function gf_changePerfil(ps_perfil) {
    var ls_sistema = sessionStorage.getItem("SISW-Sistema");
    var ljson_sys = JSON.parse(localStorage.getItem(ls_sistema));
    ljson_sys.perfil = ps_perfil;
    localStorage.setItem(ls_sistema, JSON.stringify(ljson_sys));
    gbool_isRefresh = true;
    location.reload(true);
}
/*================================================================================================================================================================================*/
function gf_returnHome() {
    var ls_isOpen = sessionStorage.getItem("SISW-Open");
    if (ls_isOpen !== undefined && ls_isOpen !== null && parseInt(ls_isOpen) === 1) {
        window.close();
    } else {
        sessionStorage.removeItem("SISW-Sistema");
        sessionStorage.removeItem("SISW-User");
        sessionStorage.removeItem("SISW-Perfil");
        location.href = gs_urlHome;
    }
}
/*================================================================================================================================================================================*/
function gf_onlineHome() {
    var ls_SISW = localStorage.getItem("SISW-Login") === undefined ? null : (localStorage.getItem("SISW-Login") === null ? null : localStorage.getItem("SISW-Login").toString());
    if (ls_SISW === null || ls_SISW === "0") {
        /**/
        //gf_returnHome();
    }
}
/*================================================================================================================================================================================*/
function gf_CloseSession() {
    sessionStorage.removeItem("SISW-Sistema");
    sessionStorage.removeItem("SISW-User");
    sessionStorage.removeItem("SISW-Perfil");
    window.close();
}
/*================================================================================================================================================================================*/
function loginMeetingAppWeb() { 
    var userNetName = sessionStorage.getItem("SISW-User");
    $.ajax({
        type: "GET",
        url: "getUserByUserNetName/" + userNetName,
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        async: true,
        success: function (response) {
            var responseJson = $.parseJSON(response);
            localStorage.setItem("UserId", responseJson.User[0].UserId);
            localStorage.setItem("UserName", responseJson.User[0].UserName);
            localStorage.setItem("UserNetName", responseJson.User[0].UserNetName);
            localStorage.setItem("AreaId", responseJson.User[0].AreaId);
            localStorage.setItem("CellId", responseJson.User[0].CellId);
            localStorage.setItem("UserRole", responseJson.User[0].UserRole);
            window.location.href="MeetingRegister";
        },
    });
}
/*================================================================================================================================================================================*/