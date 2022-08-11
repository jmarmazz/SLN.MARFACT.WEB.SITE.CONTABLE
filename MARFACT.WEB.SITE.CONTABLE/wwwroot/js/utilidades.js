    //LOADINNG
    function IniciarLoading() {
        $('body').append('<div class="overlay"><div class="opacity center"><div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div></div>');
        $('.overlay').fadeIn(300);
    };

    function DetenerLoading() {
        $('.overlay').fadeOut(300, function () {
            $(this).remove();
        });
    };

    //function ValResultExpiro(Mensaje) {
    //    if (Mensaje == "La sesión a expirado...") {
    //        MensajeGrowl("Su sesión a expirado, por favor inicie nuevamente con su usuario y clave");
    //        setTimeout(function () { top.location = "wfrmLoginNube.aspx"; }, 4000);
    //        setTimeout(function () { MensajeGrowl("Sera redireccionado en pocos segundos a inicio de sesión", 1); }, 100);
    //        return true;
    //    }
    //    return false;
    //}

    function MensajeGrowl(Mensaje, Tipo, Milisegundos) {
        DetenerLoading();
        //if (ValResultExpiro(Mensaje) == false) {
        if (Milisegundos === undefined || Milisegundos === null) { Milisegundos = 10000; }
            if (Tipo === undefined || Tipo === null) { Tipo = 0; }
            if (Tipo == 1) {
                $.jGrowl(Mensaje, { life: Milisegundos, theme: 'growl-success' });
            } else {
                $.jGrowl(Mensaje, { life: Milisegundos, theme: 'growl-error' });
            }
        //}
    };

    //NOTIFICACIONES
    function MsgActionResultError(error) {
        if (error == null) {
            var error = "Hubo un error, favor intentelo de nuevo.";
        }
        MensajeGrowl(error, 0, 10000);
    };

    function MensajeError(error) {
        var msg = "Hubo un error, favor intentelo de nuevo.";
        if (error.get_message()) {
            msg = error.get_message();
        }
        MensajeGrowl(msg, 0, 10000);
    };

    function MsgAjaxError(result) {
        var msg = "Hubo un error, favor intentelo de nuevo.";
        if (result.responseText.indexOf("Message") >= 0) {
            var RESULT_json = $.parseJSON(result.responseText);
            msg = RESULT_json.Message;
        }
        MensajeGrowl(msg);
};


const formatMoney = amount => {
    return amount.toString().replace(/\d(?=(\d{3})+\.)/g, "$&,");
};

const unformat = amount => {
    return amount.toString().replace(/[^0-9\.]+/g, "");
};

Number.prototype.countDecimals = function () {
    if (Math.floor(this.valueOf()) === this.valueOf()) return 0;
    return this.toString().split(".")[1].length || 0;
}

function changeHandlerPorcentaje(val) {

    if (Number(val.value) > 100)
        val.value = 100
    else if (Number(val.value) < 0)
        val.value = 1
    else if (Number(val.value).countDecimals() > 2)
        val.value = parseFloat(val.value).toFixed(2);
}