$(document).ready(function () {
    $("#txtUser").keyup(function (event) {
        if (event.keyCode === 13) {
            $("#txtPassword").focus();
        }
    });
    $("#txtPassword").keyup(function (event) {
        if (event.keyCode === 13) {
            $("#btnLogin").click();
        }
    });

    $("#btnLogin").click(function (e) {
        e.preventDefault();
        //IniciarLoading();
        debugger
        var txtUser = $.trim($("#txtUser").val());
        var txtPassword = $.trim($("#txtPassword").val());

        if (!txtUser) { toastr.error("Ingrese su usuario");  $("#txtUser").focus(); return; }
        if (!txtPassword) { toastr.error("Ingrese su contraseña"); $("#txtPassword").focus(); return; }
         

        $.ajax({
            type: 'POST',
            url: urlBase + "Login/Login",
            data: { Usuario: txtUser, Clave: txtPassword },
            success: function (result) {
                window.location.href = urlBase + result;
            },
            error: function (result) {
                if (result.status == 500)
                    MsgActionResultError(result.responseText);
                else
                    window.location.href = result.responseText;
            }
        });
    });
});

function Recuperar() {
    IniciarLoading();

    var txtUser = $.trim($("#txtUser").val());

    if (!txtUser) { MensajeGrowl("Ingrese su usuario"); $("#txtUser").focus(); return; }

    $.ajax({
        type: 'POST',
        url: urlBase + "Login/Recuperar",
        data: { Usuario: txtUser },
        success: function (result) {
            $("#txtUser").val("");
            MensajeGrowl(result, 1, 5000);
        },
        error: function (result) {
            if (result.status == 500)
                MsgActionResultError(result.responseText);
            else
                window.location.href = result.responseText;
        }
    });
};