
CONTROLLER = 'NotaDebito';
indicadorSiFacturan = [1, 2, 3, 4];


$(document).ready(function () {

    $('#tblAddProducto tbody').on('click', 'a', function () {

        var j = count_productos;
        var numLinea = j + 1;
        trAddProducto = null;
        trAddProducto = $(this).closest('tr');
        var data = tblAddProducto.row(trAddProducto).data();
        var cantidad = parseFloat(trAddProducto.find('#txtCantidadAdd').val() || 0);
        if (cantidad <= 0) {
            MsgActionResultError("La cantidad no es válida");
            return;
        }
        var precioUnit = parseFloat(trAddProducto.find('#txtPrecioUnitAdd').val() || 0);
        if (precioUnit <= 0) {
            MsgActionResultError("El precio unitario no es válido");
            return;
        }
        var monto = parseFloat(parseFloat(cantidad * precioUnit).toFixed(2));

        if (data["impuestoAdicional1"] >= impSelectivoConsumoDesde && data["impuestoAdicional1"] <= impSelectivoConsumoHasta ||
            data["impuestoAdicional2"] >= impSelectivoConsumoDesde && data["impuestoAdicional2"] <= impSelectivoConsumoHasta) {
            count_subcantidad = 0;
            $("#txtCantidadReferencia").val(null);
            $("#txtPrecioUnitarioReferencia").val(null);
            $("#cboUnidadMedidaReferencia").val(null).change();
            $("#txtGradosAlcohol").val(null);

            $("#txtSubcantidad").val(null);
            $("#cboUnidadSubcantidad").val(null).change();
            tblSubCantidad.rows().remove().draw(false);
            $("#modal_ReferenciaProducto").modal("show");
            return;
        }

        tblProducto.row.add([
            '<span class="cssidtblProducto" id="idtblProducto_' + j + '">' + j + '</span>',
            '<span id="etiNumeroLinea_' + j + '">' + numLinea + '</span>',
            '<span class="cssNombreItem">' + data["nombre"] + '</span>',
            '<span>' + data["indicadorFacturacionNombre"] + '</span>',
            '<div align="right"><span>' + precioUnit + '</span></div>',
            '<div align="right"><span class="cssCantidadItem">' + cantidad + '</span></div>',
            '<div align="right"><span class="cssMontoItem" id="idMontoItem_' + j + '" >' + monto + '</span></div>',
            '<div align="center"><a class="btn btn-primary btn-xs" title="Agregar Dscto/Recargo" style="cursor:pointer" data-accion="D/R"><span class="glyphicon glyphicon-plus"></span></a></div>',
            '<div align="center"><a class="tooltip--triangle" title="Eliminar" style="cursor:pointer" data-accion="DEL"><span class="glyphicon glyphicon-trash" style="font-size:17px;"></span></a></div>',

            '<input type="hidden" id="hidNumeroLinea_' + j + '" name="DetallesItems[' + j + '].NumeroLinea" value="' + numLinea + '"/>' +
            '<input type="hidden" id="hidNombreItem_' + j + '" name="DetallesItems[' + j + '].NombreItem" value="' + data["nombre"] + '"/>' +
            '<input type="hidden" id="hidDescripcionItem_' + j + '" name="DetallesItems[' + j + '].DescripcionItem" value="' + data["descripcion"] + '"/>' +
            '<input type="hidden" class="csshidCantidadItem" id="hidCantidadItem_' + j + '" name="DetallesItems[' + j + '].CantidadItem" value="' + cantidad + '"/>' +
            '<input type="hidden" id="hidUnidadMedida_' + j + '" name="DetallesItems[' + j + '].UnidadMedida" value="' + data["unidadMedida"] + '"/>' +
            '<input type="hidden" id="hidPrecioUnitarioItem_' + j + '" name="DetallesItems[' + j + '].PrecioUnitarioItem" value="' + precioUnit + '"/>' +
            '<input type="hidden" class="csshidMontoItem" id="hidMontoItem_' + j + '" name="DetallesItems[' + j + '].MontoItem" value="' + monto + '"/>' +
            '<input type="hidden" class="csshidMontoItemNeto" id="hidMontoItemNeto_' + j + '" value="' + monto + '"/>' +
            '<input type="hidden" id="hidIndicadorBienoServicio_' + j + '" name="DetallesItems[' + j + '].IndicadorBienoServicio" value="' + data["indicadorBienoServicio"] + '"/>' +
            '<input type="hidden" class="csshidIndicadorFacturacion" id="hidIndicadorFacturacion_' + j + '" name="DetallesItems[' + j + '].IndicadorFacturacion" value="' + data["indicadorFacturacion"] + '"/>' +
            '<input type="hidden" id="hidNombreIndicadorFacturacion_' + j + '" name="DetallesItems[' + j + '].NombreIndicadorFacturacion" value="' + data["indicadorFacturacionNombre"] + '"/>' +
            '<input type="hidden" id="hidTipoCodigo_' + j + '"/>' +
            '<input type="hidden" id="hidCodigo_' + j + '"/>' +
            '<input type="hidden" id="hidITBIS_' + j + '" name="DetallesItems[' + j + '].ITBIS" value="' + data["itbis"] + '"/>' +
            '<input type="hidden" id="hidImpuestoAdicional1_' + j + '"/>' +
            '<input type="hidden" id="hidTasaImpuestoAdicional1_' + j + '"/>' +
            '<input type="hidden" id="hidImpuestoAdicional2_' + j + '"/>' +
            '<input type="hidden" id="hidTasaImpuestoAdicional2_' + j + '"/>'

        ]).draw(false);

        $("#hidMontoItem_" + j).attr("data-facturacion", data["indicadorFacturacion"]).attr("data-nombrefacturacion", data["indicadorFacturacionNombre"]).attr("data-itbis", data["itbis"]);

        if (data["tipoCodigo"] && data["codigoProducto"]) {
            $("#hidTipoCodigo_" + j).removeAttr("name").attr("name", "DetallesItems[" + j + "].CodigosItem[0].TipoCodigo").val(data["tipoCodigo"]);
            $("#hidCodigo_" + j).removeAttr("name").attr("name", "DetallesItems[" + j + "].CodigosItem[0].Codigo").val(data["codigoProducto"]);
        }

        if (data["impuestoAdicional1"]) {
            $("#hidImpuestoAdicional1_" + j).removeAttr("name").attr("name", "DetallesItems[" + j + "].ImpuestosAdicionales1").val(data["impuestoAdicional1"]);
            $("#hidTasaImpuestoAdicional1_" + j).removeAttr("name").attr("name", "DetallesItems[" + j + "].TasaImpuestoAdicional1").val(data["tasaImpuestoAdicional1"]);
            $("#hidMontoItem_" + j).attr("data-tasa1", data["tasaImpuestoAdicional1"]).attr("data-impuesto1", data["impuestoAdicional1"]).attr("data-cantidad1", cantidad);
        }
        if (data["impuestoAdicional2"]) {
            $("#hidImpuestoAdicional2_" + j).removeAttr("name").attr("name", "DetallesItems[" + j + "].ImpuestosAdicionales2").val(data["impuestoAdicional2"]);
            $("#hidTasaImpuestoAdicional2_" + j).removeAttr("name").attr("name", "DetallesItems[" + j + "].TasaImpuestoAdicional2").val(data["tasaImpuestoAdicional2"]);
            $("#hidMontoItem_" + j).attr("data-tasa2", data["tasaImpuestoAdicional2"]).attr("data-impuesto2", data["impuestoAdicional2"]).attr("data-cantidad2", cantidad);
        }

        count_productos++;
        CalcularTotales();
    });

    $('#btnAgregarReferenciaProducto').click(function (event) {

        var j = count_productos;
        var numLinea = j + 1;
        var data = tblAddProducto.row(trAddProducto).data();
        var cantidadReferencia = parseFloat($("#txtCantidadReferencia").val() || 0);
        var precioUnitarioReferencia = parseFloat($("#txtPrecioUnitarioReferencia").val() || 0);
        var unidadReferencia = $("#cboUnidadMedidaReferencia").val();
        var gradosAlcohol = parseFloat($("#txtGradosAlcohol").val() || 0);

        if (!cantidadReferencia) {
            MsgActionResultError("Por favor ingresar la Cantidad de Referencia");
            return;
        }
        if (!precioUnitarioReferencia) {
            MsgActionResultError("Por favor ingresar el Precio Unitario Referencia");
            return;
        }
        if (!unidadReferencia) {
            MsgActionResultError("Por favor seleccionar la Unidad de Medida de Referencia");
            return;
        }
        if (!gradosAlcohol &&
            (data["impuestoAdicional1"] >= impAlcoholDesde && data["impuestoAdicional1"] <= impAlcoholHasta ||
             data["impuestoAdicional2"] >= impAlcoholDesde && data["impuestoAdicional2"] <= impAlcoholHasta))
        {
            MsgActionResultError("Por favor ingresar los Grados de Alcohol");
            return;
        }
        if (count_subcantidad <= 0) {
            MsgActionResultError("Por favor agregar al menos un item a la tabla Subcantidad");
            return false;
        }
        var tablaSubcantidades = "";
        $(".csshidSubcantidad").each(function (rowIdx) {
            var subcantidad = $(this).val();
            tablaSubcantidades += '<input type="hidden" class="csshidSubCantidadesValor_' + j + '" id="hidSubCantidadesValor_' + j + '_' + rowIdx + '" name="DetallesItems[' + j + '].SubCantidades[' + rowIdx + '].Valor" value="' + subcantidad + '" />'
        });
        $(".csshidUnidadSubcantidad").each(function (rowIdx) {
            var unidadSubcantidad = $(this).val();
            tablaSubcantidades += '<input type="hidden" class="csshidSubCantidadesCodigo_' + j + '" id="hidSubCantidadesCodigo_' + j + '_' + rowIdx + '" name="DetallesItems[' + j + '].SubCantidades[' + rowIdx + '].CodigoSubCantidad" value="' + unidadSubcantidad + '" />'
        });

        var cantidad = parseFloat(trAddProducto.find('#txtCantidadAdd').val() || 0);
        var precioUnit = parseFloat(trAddProducto.find('#txtPrecioUnitAdd').val() || 0);
        var monto = parseFloat(parseFloat(cantidad * precioUnit).toFixed(2));

        tblProducto.row.add([
            '<span class="cssidtblProducto" id="idtblProducto_' + j + '">' + j + '</span>',
            '<span id="etiNumeroLinea_' + j + '">' + numLinea + '</span>',
            '<span class="cssNombreItem">' + data["nombre"] + '</span>',
            '<span>' + data["indicadorFacturacionNombre"] + '</span>',
            '<div align="right"><span>' + precioUnit + '</span></div>',
            '<div align="right"><span class="cssCantidadItem">' + cantidad + '</span></div>',
            '<div align="right"><span class="cssMontoItem" id="idMontoItem_' + j + '">' + monto + '</span></div>',
            '<div align="center"><a class="btn btn-primary btn-xs" title="Agregar Dscto/Recargo" style="cursor:pointer" data-accion="D/R"><span class="glyphicon glyphicon-plus"></span></a></div>',
            '<div align="center"><a class="tooltip--triangle" title="Eliminar" style="cursor:pointer" data-accion="DEL"><span class="glyphicon glyphicon-trash" style="font-size:17px;"></span></a></div>',

            '<input type="hidden" id="hidNumeroLinea_' + j + '" name="DetallesItems[' + j + '].NumeroLinea" value="' + numLinea + '"/>' +
            '<input type="hidden" id="hidNombreItem_' + j + '" name="DetallesItems[' + j + '].NombreItem" value="' + data["nombre"] + '"/>' +
            '<input type="hidden" id="hidDescripcionItem_' + j + '" name="DetallesItems[' + j + '].DescripcionItem" value="' + data["descripcion"] + '"/>' +
            '<input type="hidden" class="csshidCantidadItem" id="hidCantidadItem_' + j + '" name="DetallesItems[' + j + '].CantidadItem" value="' + cantidad + '"/>' +
            '<input type="hidden" id="hidUnidadMedida_' + j + '" name="DetallesItems[' + j + '].UnidadMedida" value="' + data["unidadMedida"] + '"/>' +
            '<input type="hidden" id="hidPrecioUnitarioItem_' + j + '" name="DetallesItems[' + j + '].PrecioUnitarioItem" value="' + precioUnit + '"/>' +
            '<input type="hidden" class="csshidMontoItem" id="hidMontoItem_' + j + '" name="DetallesItems[' + j + '].MontoItem" value="' + monto + '"/>' +
            '<input type="hidden" class="csshidMontoItemNeto" id="hidMontoItemNeto_' + j + '" value="' + monto + '"/>' +
            '<input type="hidden" id="hidIndicadorBienoServicio_' + j + '" name="DetallesItems[' + j + '].IndicadorBienoServicio" value="' + data["indicadorBienoServicio"] + '"/>' +
            '<input type="hidden" class="csshidIndicadorFacturacion" id="hidIndicadorFacturacion_' + j + '" name="DetallesItems[' + j + '].IndicadorFacturacion" value="' + data["indicadorFacturacion"] + '"/>' +
            '<input type="hidden" id="hidNombreIndicadorFacturacion_' + j + '" name="DetallesItems[' + j + '].NombreIndicadorFacturacion" value="' + data["indicadorFacturacionNombre"] + '"/>' +
            '<input type="hidden" id="hidTipoCodigo_' + j + '"/>' +
            '<input type="hidden" id="hidCodigo_' + j + '"/>' +
            '<input type="hidden" id="hidITBIS_' + j + '" name="DetallesItems[' + j + '].ITBIS" value="' + data["itbis"] + '"/>' +
            '<input type="hidden" id="hidImpuestoAdicional1_' + j + '"/>' +
            '<input type="hidden" id="hidTasaImpuestoAdicional1_' + j + '"/>' +
            '<input type="hidden" id="hidImpuestoAdicional2_' + j + '"/>' +
            '<input type="hidden" id="hidTasaImpuestoAdicional2_' + j + '"/>' +
            '<input type="hidden" id="hidCantidadReferencia_' + j + '" name="DetallesItems[' + j + '].CantidadReferencia" value="' + cantidadReferencia + '"/>' +
            '<input type="hidden" id="hidPrecioUnitarioReferencia_' + j + '" name="DetallesItems[' + j + '].PrecioUnitarioReferencia" value="' + precioUnitarioReferencia + '"/>' +
            '<input type="hidden" id="hidUnidadReferencia_' + j + '" name="DetallesItems[' + j + '].UnidadReferencia" value="' + unidadReferencia + '"/>' +
            '<input type="hidden" id="hidGradosAlcohol_' + j + '" name="DetallesItems[' + j + '].GradosAlcohol" value="' + gradosAlcohol + '"/>' +
            tablaSubcantidades

        ]).draw(false);

        $("#hidMontoItem_" + j).attr("data-facturacion", data["indicadorFacturacion"]).attr("data-nombrefacturacion", data["indicadorFacturacionNombre"]).attr("data-itbis", data["itbis"]);

        if (data["tipoCodigo"] && data["codigoProducto"]) {
            $("#hidTipoCodigo_" + j).removeAttr("name").attr("name", "DetallesItems[" + j + "].CodigosItem[0].TipoCodigo").val(data["tipoCodigo"]);
            $("#hidCodigo_" + j).removeAttr("name").attr("name", "DetallesItems[" + j + "].CodigosItem[0].Codigo").val(data["codigoProducto"]);
        }

        if (data["impuestoAdicional1"]) {
            $("#hidImpuestoAdicional1_" + j).removeAttr("name").attr("name", "DetallesItems[" + j + "].ImpuestosAdicionales1").val(data["impuestoAdicional1"]);
            $("#hidTasaImpuestoAdicional1_" + j).removeAttr("name").attr("name", "DetallesItems[" + j + "].TasaImpuestoAdicional1").val(data["tasaImpuestoAdicional1"]);
            $("#hidMontoItem_" + j).attr("data-tasa1", data["tasaImpuestoAdicional1"]).attr("data-impuesto1", data["impuestoAdicional1"]).attr("data-cantidad1", cantidad);
        }
        if (data["impuestoAdicional2"]) {
            $("#hidImpuestoAdicional2_" + j).removeAttr("name").attr("name", "DetallesItems[" + j + "].ImpuestosAdicionales2").val(data["impuestoAdicional2"]);
            $("#hidTasaImpuestoAdicional2_" + j).removeAttr("name").attr("name", "DetallesItems[" + j + "].TasaImpuestoAdicional2").val(data["tasaImpuestoAdicional2"]);
            $("#hidMontoItem_" + j).attr("data-tasa2", data["tasaImpuestoAdicional2"]).attr("data-impuesto2", data["impuestoAdicional2"]).attr("data-cantidad2", cantidad);
        }

        count_productos++;
        CalcularTotales();
        $("#modal_ReferenciaProducto").modal("hide");
    });

});

function ValidarFormulario() {
    if (count_productos <= 0) {
        MsgActionResultError("Por favor agregar al menos un producto");
        return false;
    }
    if (!$("#txtNumDocumento").val()) {
        MsgActionResultError("Por favor ingresar el Número de Documento");
        return false;
    }
    if (!$("#txtNCFModificado").val()) {
        MsgActionResultError("Por favor seleccionar el NCF Aplica");
        return false;
    }
    if (!$("#cboTipoIngresos").val()) {
        MsgActionResultError("Por favor seleccionar el Tipo de Ingreso");
        return false;
    }
    if (!$("#cboTipoPago").val()) {
        MsgActionResultError("Por favor seleccionar el Tipo de Pago");
        return false;
    }
    if ($("#cboTipoPago").val() == 2 && !$("#txtFechaLimitePago").val()) //Credito: 2
    {
        MsgActionResultError("Por favor ingresar la Fecha Limite de Pago");
        return false;
    }
    if ($("#txtFechaDesde").val() && $("#txtFechaHasta").val()) {
        var fecini = moment($("#txtFechaDesde").val(), "DD/MM/YYYY");
        var fecfin = moment($("#txtFechaHasta").val(), "DD/MM/YYYY");
        if (fecini > fecfin) {
            MsgActionResultError("Fecha Hasta no puede ser inferior a Fecha Desde");
            $('a[href = "#tabEmi2"]').tab('show');
            return false;
        }
    }
    if (!$("#cboCodigoModificacion").val()) {
        MsgActionResultError("Por favor seleccionar el Tipo de Motivo");
        return false;
    }
    if ($("#cboMonedaCambio").val() && parseFloat($("#txtTipoCambio").val() || 0) == 0) {
        MsgActionResultError("Ha seleccionado una Moneda de Cambio, por favor ingresar la tasa de cambio");
        $('.nav a[href="#tabEmi3"]').tab('show');
        return false;
    }

    ConfirmarEmisionComprobante();
}