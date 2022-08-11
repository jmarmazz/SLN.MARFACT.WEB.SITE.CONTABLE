var CONTROLLER = null;
var minimumInputLengthCliente = 4;
var cant_maxima_formapago = 7;
var cant_maxima_adicional = 10;
var cant_maxima_subcantidad = 5;
var cant_maxima_dsctorecargo = 20;
var cant_maxima_subdescuento = 12;
var cant_maxima_subrecargo = 12;
var count_subcantidad = 0;
var count_subdescuento = 0;
var count_subrecargo = 0;
var indicadorNoFacturable = 0;
var indicadorFacturacion1 = 1;
var indicadorFacturacion2 = 2;
var indicadorFacturacion3 = 3;
var indicadorFacturacionExento = 4;
var indicadorSiFacturan = null;
var impSelectivoConsumoDesde = 6;
var impSelectivoConsumoHasta = 39;
var impAlcoholDesde = 6;
var impAlcoholHasta = 18;
var impSelectivoConsumoEspecificoDesde = 6;
var impSelectivoConsumoEspecificoHasta = 22;
var trAddProducto = null;
var indicadorServicio = 2;

var tblAddProducto = null;
var tblProducto = null;
var tblSubCantidad = null;
var tblDsctoRecargo = null;
var tblFormaPago = null;
var tblDatosAdicional = null;
var tblSubDescuento = null;
var tblSubRecargo = null;
var MontoTotalConsumo = 0.00;
var hidMaximoMontoConsumo = null;

checkControlRequeriedTABS();
EncerarDsctoRecargoGlobal(); 

$(document).ready(function () { 
    
    $('#txtFechaDesde').datepicker({
        format: 'dd-mm-yyyy',
        language: 'es',
        autoclose: 1,
        todayHighlight: true,
        clearBtn: true,
    });
    $('#txtFechaHasta').datepicker({
        format: 'dd-mm-yyyy',
        language: 'es',
        autoclose: 1,
        todayHighlight: true,
        clearBtn: true,
    });
 
    $("#cboCliente").select2({
        formatInputTooShort: "",
        theme: "bootstrap",
        placeholder: "Buscar cliente",
        language: 'es', 
        allowClear: true, 
        minimumInputLength: minimumInputLengthCliente,
        ajax: {
            url: urlBase + CONTROLLER + '/ObtenerClientes',
            dataType: 'json',
            delay: 250,
            data: function (params) {
                this.data('term', params.term);
                return params;
            },
            processResults: function (data) {
                return {
                    results: $.map(data, function (obj) {
                        return {
                            id: obj.idUsuario,
                            text: obj.usuario + " - " + obj.nombre,
                            more: false
                        };
                    })
                };
            },
        }
    }); 
    
    $('#cboCliente').on('change', function () {
        if (hidMaximoMontoConsumo) {
            if (this.value) {
                $("#txtIdentificadorExtranjero").val(null);
                $("#txtRazonSocialComprador").prop("readonly", true);
            }

            if (MontoTotalConsumo >= hidMaximoMontoConsumo) {
                $("#txtIdentificadorExtranjero").prop("required", false);
                $("#cboCliente").prop("required", true);
                $("#txtRazonSocialComprador").prop("required", true);
            }
            else {
                $("#txtIdentificadorExtranjero").prop("required", false);
                $("#cboCliente").prop("required", false);
                $("#txtRazonSocialComprador").prop("required", false);
            }
        }

        $.ajax({
            url: urlBase + CONTROLLER + "/BuscarCliente?IdCliente=" + this.value,
            type: 'GET',
            dataType: 'json',
            success: function (result) {
                CargaCliente(result);
            },
            error: function (result) {
                if (result.status == 500)
                    MsgActionResultError(result.responseText);
                else
                    window.location.href = result.responseText;
            }
        });
    });

    var content = $("#popover_html").html();
    $("#infoCliente").popover({
        'html': true,
        'content': content,
        'trigger': 'hover',
        'placement': 'bottom'
    });

    tblProducto = $("#tblProducto").DataTable({
        "bInfo": false,
        "autoWidth": false,
        "bProcessing": false,
        "bServerSide": false,
        "searching": false,
        "paging": false,
        "scrollY": "280px",
        "scrollCollapse": true,
        "columnDefs": [
            { targets: [1], width: '2%' },
            { targets: [2], width: '30%' },
            { targets: [3], width: '10%' },
            { targets: [4], width: '10%' },
            { targets: [5], width: '5%' },
            { targets: [6], width: '10%' },
            { targets: [7], width: '5%' },
            { targets: [8], width: '4%' },
            { targets: [0, 9], className: "hide_column" },
            { targets: [3, 4, 5, 6, 7, 8], 'bSortable': false },
            { "type": "num", "targets": 0 }
        ]
    });

    tblAddProducto = $("#tblAddProducto").DataTable({
        "ajax": {
            "url": urlBase + CONTROLLER + "/ConsultarProductos",
            "type": "POST",
            "dataType": "json",
            "dataSrc": "data",
            "data":
                function (d) { 
                    d.TopConsultaEDOC = $("#cboConsulta").val();
                    d.Coincidencia = $("#txtCoincidencia").val();
                },
            "error": function (result) {
                if (result.status == 500) {
                    $("#tblAddProducto_processing").hide();
                    MsgActionResultError(result.responseText);
                }
                else
                    window.location.href = result.responseText || "";
            }
        },
        "columns": [
            { "data": "idProducto", "visible": false },
            { "data": "codigoProducto", "title": "Codigo", "width": "30px", "className": "text-left" },
            { "data": "nombre", "title": "Nombre", "width": "230px", "className": "text-left" },
            { "data": "indicadorFacturacionNombre", "title": "Ind. Fact.", "width": "50px", "className": "text-left" },
            {
                "render": function (data, type, row) {
                    var impAdic1 = "", impAdic2 = "";
                    if (row.impuestoAdicional1)
                        impAdic1 = parseFloat(row.tasaImpuestoAdicional1).toFixed(2);
                    if (row.impuestoAdicional2)
                        impAdic2 = (impAdic1 ? '<br/>' : '') + parseFloat(row.tasaImpuestoAdicional2).toFixed(2);
                    return impAdic1 + impAdic2;
                }, "width": "60px", "title": "% Imp. Adicional", "orderable": false
            },
            {
                "data": function (row, type, set) {
                    data = "<input id='txtPrecioUnitAdd' type='text' class='form-control input-sm isdecimal4' value='" + parseFloat(row.precioUnitario).toFixed(4) + "' />"
                    return data;
                }, "title": "Precio Unit.", "width": "70px", "orderable": false, "className": "text-center"
            },
            {
                "data": function (row, type, set) {
                    data = "<input id='txtCantidadAdd' type='text' class='form-control input-sm isdecimal2' value='' />"
                    return data;
                }, "title": "Cant.", "width": "60px", "orderable": false, "className": "text-center"
            },
            {
                "data": function (row, type, set) {
                    data = "<a class='btn btn-primary btn-sm' href='#' ><i class='glyphicon glyphicon-plus'></i></a>"
                    return data;
                }, "width": "5px", "orderable": false, "className": "text-center"
            }
        ],
        "bServerSide": false,
        "bProcessing": true,
        "bLengthChange": false,
        "bInfo": false,
        "searching": true,
        "paging": true,
        "pageLength": 6,
        "autoWidth": false,
        "scrollX": false,
        drawCallback: function () {
            $(".isdecimal2").maskMoney({
                thousands: '',
                allowNegative: false,
                decimal: '.',
                precision: 2,
                allowZero: false
            });

            $('.isdecimal4').maskMoney({
                thousands: '',
                allowNegative: false,
                decimal: '.',
                precision: 4,
                allowZero: true
            });
        }
    });

    tblSubCantidad = $("#tblSubCantidad").DataTable({
        "bInfo": false,
        "autoWidth": false,
        "bProcessing": false,
        "bServerSide": false,
        "searching": false,
        "paging": false,
        "scrollX": false,
        "columnDefs": [
            { targets: [0, 4], className: "hide_column" },
            { targets: [1, 2, 3], 'bSortable': false },
            { "type": "num", "targets": 0 }
        ]
    });

    tblSubDescuento = $("#tblSubDescuento").DataTable({
        "bInfo": false,
        "autoWidth": false,
        "bProcessing": false,
        "bServerSide": false,
        "searching": true,
        "paging": false,
        "scrollX": false,
        "columnDefs": [
            { targets: [0, 5], className: "hide_column" },
            { targets: [2, 4], 'bSortable': false },
            { "type": "num", "targets": 0 }
        ]
    });

    tblSubRecargo = $("#tblSubRecargo").DataTable({
        "bInfo": false,
        "autoWidth": false,
        "bProcessing": false,
        "bServerSide": false,
        "searching": true,
        "paging": false,
        "scrollX": false,
        "columnDefs": [
            { targets: [0, 5], className: "hide_column" },
            { targets: [2, 4], 'bSortable': false },
            { "type": "num", "targets": 0 }
        ]
    });

    $('#tblProducto tbody').on('click', 'a', function () {

        if ($(this).attr("data-accion") == "DEL") {
            var tr = $(this).parents('tr');
            tblProducto.row(tr).remove().draw(true);
            var idtblProducto = tr.find('.cssidtblProducto').attr("id"); 
            
            tblSubDescuento.rows().nodes().to$().find('.css' + idtblProducto).each(function () {
                tr = $(this).parents('tr');
                tblSubDescuento.row(tr).remove().draw();
            });
            tblSubRecargo.rows().nodes().to$().find('.css' + idtblProducto).each(function () {
                tr = $(this).parents('tr');
                tblSubRecargo.row(tr).remove().draw();
            });
            
            updateModelValuesDetallesItems();
            count_productos--;
            CalcularTotales();
        }
        if ($(this).attr("data-accion") == "D/R") {

            var countDescto = 0, countRecargo = 0;
            var descuentoMonto = 0, recargoMonto = 0;
            var tr = $(this).parents('tr');
            var idtblProducto = tr.find('.cssidtblProducto').attr("id");
            var rowIdx = tr.find('.cssidtblProducto').html();

            $("#hididtblProducto").val(idtblProducto);
            $("#rowIdxDetallesItems").val(rowIdx);
            $("#lblNombreItemDsctoRecargo").html(tr.find('.cssNombreItem').html());  

            $(".csshidMontoSubDescuento_" + rowIdx).each(function () {
                countDescto++;
                descuentoMonto += parseFloat($(this).val());
            });
            descuentoMonto = parseFloat(descuentoMonto).toFixed(2);
            count_subdescuento = countDescto;
            $("#totalSubDescuento").text(formatMoney(descuentoMonto));
            $(".csshidMontoSubRecargo_" + rowIdx).each(function () {
                countRecargo++;
                recargoMonto += parseFloat($(this).val());
            });
            recargoMonto = parseFloat(recargoMonto).toFixed(2);
            count_subrecargo = countRecargo;
            $("#totalSubRecargo").text(formatMoney(recargoMonto));

            tblSubDescuento.search(idtblProducto).draw();
            tblSubRecargo.search(idtblProducto).draw();
            $("#modal_DsctoRecargoLineal").modal("show");
        }
    });

    $('#btnAgregarSubcantidad').click(function (event) {
        var j = count_subcantidad;

        if (count_subcantidad >= cant_maxima_subcantidad) {
            MsgActionResultError("La cantidad máxima son: " + cant_maxima_subcantidad + " Subcantidades");
            return;
        }
        var subcantidad = parseFloat($("#txtSubcantidad").val() || 0);
        var unidadSubcantidad = $("#cboUnidadSubcantidad").val();
        var unidadSubcantidadNombre = $("#cboUnidadSubcantidad option:selected").text();

        if (subcantidad <= 0) {
            MsgActionResultError("La Subcantidad no es válida");
            return;
        }
        if (!unidadSubcantidad) {
            MsgActionResultError("Por favor seleccionar la Unidad de Medida Subcantidad");
            return;
        }

        tblSubCantidad.row.add([
            '<span id="idtblSubCantidad_' + j + '">' + j + '</span>',
            '<div align="right"><span>' + subcantidad + '</span></div>',
            '<span>' + unidadSubcantidadNombre + '</span>',
            '<div align="center"><a class="tooltip--triangle" title="Eliminar" style="cursor:pointer" data-accion="DEL"><span class="glyphicon glyphicon-trash" style="font-size:17px;"></span></a></div>',

            '<input class="csshidSubcantidad" type="hidden" id="hidSubcantidad" value="' + subcantidad + '"/>' +
            '<input class="csshidUnidadSubcantidad" type="hidden" id="hidUnidadSubcantidad" value="' + unidadSubcantidad + '"/>'
        ]).draw(false);

        count_subcantidad++;
        $("#txtSubcantidad").val(null);
        $("#cboUnidadSubcantidad").val(null).change();
    });

    $('#tblSubCantidad tbody').on('click', 'a', function () {

        if ($(this).attr("data-accion") == "DEL") {
            var tr = $(this).parents('tr');
            tblSubCantidad.row(tr).remove().draw(true);
            count_subcantidad--;
        }
    });

    $("#btnAgregarProductos").click(function (event) {
        event.preventDefault();

        $("#txtCoincidencia").val(null);
        tblAddProducto.search("").draw(true);
        $("#modalAddProducto").modal("show");
    });

    $("#txtCoincidencia").keyup(function () {
        event.preventDefault();
        tblAddProducto.search(this.value).draw(true); 
    });

    $("#txtCoincidencia").on("keydown", function (event) {
        if (event.which == 13) {
            event.preventDefault();
            tblAddProducto.ajax.reload();
        }
    });

    $("#btnBuscarProductos").click(function (event) {
        event.preventDefault();
        tblAddProducto.ajax.reload();
    });

    tblDatosAdicional = $("#tblDatosAdicional").DataTable({
        "bInfo": false,
        "autoWidth": false,
        "bProcessing": false,
        "bServerSide": false,
        "searching": false,
        "paging": false,
        "scrollX": false,
        "columnDefs": [
            { targets: [0], width: '5%' },
            { targets: [4], className: "hide_column" },
            { targets: [0, 3], 'bSortable': false },
            { "type": "num", "targets": 0 }
        ]
    });

    $("#btnAgregarAdicional").click(function (e) {
        e.preventDefault();
        var k = count_adicional;
        var numLinea = k + 1;
        var titulo = $("#txtTitulo").val();
        var dato = $("#txtDato").val();
        if (!dato) {
            MsgActionResultError("Por favor ingrese el dato");
            return;
        }
        if (count_adicional >= cant_maxima_adicional) {
            MsgActionResultError("La cantidad máxima a ingresar son: " + cant_maxima_adicional + " datos adicionales");
            $("#modalAdicional").modal("hide");
            return;
        }

        tblDatosAdicional.row.add([
            '<span id="idtblDatosAdicional_' + k + '">' + numLinea + '</span>',
            '<span>' + titulo + '</span>',
            '<span>' + dato + '</span>',
            '<div align="center"><a class="tooltip--triangle" title="Eliminar" style="cursor:pointer" data-accion="DEL"><span class="glyphicon glyphicon-trash" style="font-size:17px;"></span></a></div>',

            '<input type="hidden" id="hidId_' + k + '" name="CamposAdicionales[' + k + '].Id" value="' + numLinea + '"/>' +
            '<input type="hidden" id="hidTitulo_' + k + '" name="CamposAdicionales[' + k + '].Titulo" value="' + titulo + '"/>' +
            '<input type="hidden" id="hidDato_' + k + '" name="CamposAdicionales[' + k + '].Dato" value="' + dato + '"/>'
        ]).draw(false);

        count_adicional++;
        $("#txtTitulo").val(null);
        $("#txtDato").val(null);
    });

    $('#tblDatosAdicional tbody').on('click', 'a', function () {
        if ($(this).attr("data-accion") == "DEL") {
            tblDatosAdicional.row($(this).closest('tr')).remove().draw(true);
            updateModelValuesCamposAdicionales();
            count_adicional--;
        }
    });

    tblFormaPago = $("#tblFormaPago").DataTable({
        "bInfo": false,
        "autoWidth": false,
        "bProcessing": false,
        "bServerSide": false,
        "searching": false,
        "paging": false,
        "scrollX": false,
        "columnDefs": [
            { targets: [0, 4], className: "hide_column" },
            { targets: [3], 'bSortable': false },
            { "type": "num", "targets": 0 }
        ]
    });

    $("#btnAgregarFormaPago").click(function (e) {
        e.preventDefault();
        var x = count_formapago;
        var formaPago = $("#cboFormaPago").val();
        var formaPagoNombre = $("#cboFormaPago option:selected").text();
        var monto = $("#txtMontoPago").val();
        if (!formaPago) {
            MsgActionResultError("Por favor seleccione la forma de pago");
            return;
        }
        if (!monto) {
            MsgActionResultError("Por favor ingrese el monto a pagar");
            return;
        }
        if (count_formapago >= cant_maxima_formapago) {
            MsgActionResultError("La cantidad máxima a ingresar son: " + cant_maxima_formapago + " formas de pago");
            $("#modalFormaPago").modal("hide");
            return;
        }

        tblFormaPago.row.add([
            '<span id="idtblFormaPago_' + x + '">' + x + '</span>',
            '<span>' + formaPagoNombre + '</span>',
            '<span>' + monto + '</span>',
            '<div align="center"><a class="tooltip--triangle" title="Eliminar" style="cursor:pointer" data-accion="DEL"><span class="glyphicon glyphicon-trash" style="font-size:17px;"></span></a></div>',

            '<input type="hidden" id="hidCodigoPago_' + x + '" name="Encabezado.IdDoc.FormasPago[' + x + '].Codigo" value="' + formaPago + '"/>' +
            '<input type="hidden" id="hidMontoPago_' + x + '" name="Encabezado.IdDoc.FormasPago[' + x + '].MontoPago" value="' + monto + '"/>' +
            '<input type="hidden" id="hidNombrePago_' + x + '" name="Encabezado.IdDoc.FormasPago[' + x + '].Nombre" value="' + formaPagoNombre + '"/>'
        ]).draw(false);

        count_formapago++;
        $("#cboFormaPago").val(null).change();
        $("#txtMontoPago").val(null);
    });

    $('#tblFormaPago tbody').on('click', 'a', function () {
        if ($(this).attr("data-accion") == "DEL") {
            tblFormaPago.row($(this).closest('tr')).remove().draw(true);
            updateModelValuesFormaPago();
            count_formapago--;
        }
    });

    tblDsctoRecargo = $("#tblDsctoRecargo").DataTable({
        "bInfo": false,
        "autoWidth": false,
        "bProcessing": false,
        "bServerSide": false,
        "searching": false,
        "paging": false,
        "scrollX": false,
        "columnDefs": [
            { targets: [0, 7], className: "hide_column" },
            { targets: [2, 3, 5, 6], 'bSortable': false },
            { "type": "num", "targets": 0 }
        ]
    });

    $("#btnNuevoDsctoRecargoGlobal").click(function (e) {
        e.preventDefault();

        if (count_productos <= 0) {
            MsgActionResultError("Por favor agregar al menos un producto");
            return false;
        }
    });

    $("#btnAgregarDsctoRecargoGlobal").click(function (e) {
        e.preventDefault();
        var x = count_dsctorecargo;
        var numLineaDsctoRecargo = x + 1;
        var tipoDsctoRecargo = $("#cboTipoDsctoRecargo").val();
        var tipoDsctoRecargoNombre = $("#cboTipoDsctoRecargo option:selected").text();
        var tipoValorDsctoRecargo = $("#cboTipoValorDsctoRecargo").val();
        var descripcionDsctoRecargo = $("#txtDescripcionDsctoRecargo").val();
        var indicadorFactDsctoRecargo = $("#cboIndicadorFactDsctoRecargo").val();
        var indicadorFactDsctoRecargoNombre = $("#cboIndicadorFactDsctoRecargo option:selected").text();
        var valorDsctoRecargo = $("#txtValorDsctoRecargo").val();
        var montoDsctoRecargo = $("#txtMontoDsctoRecargo").val();
        var existeIndFact = false;

        if (!tipoDsctoRecargo) {
            MsgActionResultError("Por favor seleccione el Tipo");
            return;
        }
        if (!tipoValorDsctoRecargo) {
            MsgActionResultError("Por favor seleccione el Tipo Valor");
            return;
        }
        if (!$('#chkAplicaTodos').is(':checked') && !indicadorFactDsctoRecargo) {
            MsgActionResultError("Por favor ingrese el Indicador de Facturacion");
            return;
        }
        if (!valorDsctoRecargo && tipoValorDsctoRecargo == "%") {
            MsgActionResultError("Por favor ingrese el Valor %");
            return;
        } 
        if (count_dsctorecargo >= cant_maxima_dsctorecargo) {
            MsgActionResultError("La cantidad máxima a ingresar son: " + cant_maxima_dsctorecargo + " Descuentos o Recargos");
            $("#modalDsctoRecargoGlobal").modal("hide");
            return;
        }
        if (!$('#chkAplicaTodos').is(':checked')) {
            tblProducto.rows().nodes().to$().find('input.csshidIndicadorFacturacion').each(function () {
                if (indicadorFactDsctoRecargo == $(this).val()) {
                    existeIndFact = true;
                }
            });
            if (!existeIndFact) {
                MsgActionResultError("Por favor agregar al menos un producto con indicador facturación " + indicadorFactDsctoRecargoNombre + ", y volver a ingresar el descuento o recargo");
                return;
            }
        }
        if (!montoDsctoRecargo) {
            if (!$('#chkAplicaTodos').is(':checked')) {
                MsgActionResultError("Por favor ingrese el Monto");
                return;
            }
            else if (tipoValorDsctoRecargo == "$") {
                MsgActionResultError("Por favor ingrese el Monto");
                return;
            }
        }
        
        if ($('#chkAplicaTodos').is(':checked')) {
            $(".csshidMontoItem").each(function () {
                if (jQuery.inArray(parseInt($(this).attr("data-facturacion")), indicadorSiFacturan) != -1) {
                    if (tipoValorDsctoRecargo == "%") {
                        var porcdscto = parseFloat(valorDsctoRecargo) || 0;
                        var montoItem = parseFloat($(this).val()) || 0;
                        montoDsctoRecargo = parseFloat(parseFloat(montoItem * (porcdscto / 100)).toFixed(2));
                    }
                    indicadorFactDsctoRecargo = $(this).attr("data-facturacion");
                    indicadorFactDsctoRecargoNombre = $(this).attr("data-nombrefacturacion");
                    tblDsctoRecargo.row.add([
                        '<span id="idtblDsctoRecargo_' + x + '">' + x + '</span>',
                        '<span>' + tipoDsctoRecargoNombre + '</span>',
                        '<span>' + descripcionDsctoRecargo + '</span>',
                        '<div align="center"><span>' + tipoValorDsctoRecargo + ' ' + valorDsctoRecargo + '</span></div>',
                        '<div align="right"><span>' + montoDsctoRecargo + '</span></div>',
                        '<span>' + indicadorFactDsctoRecargoNombre + '</span>',
                        '<div align="center"><a class="tooltip--triangle" title="Eliminar" style="cursor:pointer" data-accion="DEL"><span class="glyphicon glyphicon-trash" style="font-size:17px;"></span></a></div>',

                        '<input type="hidden" id="hidNumeroLineaDsctoRecargo_' + x + '" name="DescuentosRecargos[' + x + '].NumeroLinea" value="' + numLineaDsctoRecargo + '"/>' +
                        '<input type="hidden" id="hidTipoAjusteDsctoRecargo_' + x + '" name="DescuentosRecargos[' + x + '].TipoAjuste" value="' + tipoDsctoRecargo + '"/>' +
                        '<input type="hidden" id="hidTipoValorDsctoRecargo_' + x + '" name="DescuentosRecargos[' + x + '].TipoValor" value="' + tipoValorDsctoRecargo + '"/>' +
                        '<input type="hidden" id="hidValorDsctoRecargo_' + x + '" name="DescuentosRecargos[' + x + '].ValorDescuentooRecargo" value="' + valorDsctoRecargo + '"/>' +
                        '<input type="hidden" class="csshidMontoDsctoRecargo" id="hidMontoDsctoRecargo_' + x + '" name="DescuentosRecargos[' + x + '].MontoDescuentooRecargo" value="' + montoDsctoRecargo + '" data-tipoAjuste="' + tipoDsctoRecargo + '" data-facturacion="' + indicadorFactDsctoRecargo + '" />' +
                        '<input type="hidden" id="hidDescripcionDsctoRecargo_' + x + '" name="DescuentosRecargos[' + x + '].DescripcionDescuentooRecargo" value="' + descripcionDsctoRecargo + '"/>' +
                        '<input type="hidden" id="hidIndicadorFacturacionDsctoRecargo_' + x + '" name="DescuentosRecargos[' + x + '].IndicadorFacturacionDescuentooRecargo" value="' + indicadorFactDsctoRecargo + '"/>' +
                        '<input type="hidden" id="hidTipoAjusteDsctoRecargoNombre_' + x + '" name="DescuentosRecargos[' + x + '].NombreTipoAjuste" value="' + tipoDsctoRecargoNombre + '"/>' +
                        '<input type="hidden" id="hidIndicadorFacturacionDsctoRecargoNombre_' + x + '" name="DescuentosRecargos[' + x + '].NombreIndicadorFacturacionDescuentooRecargo" value="' + indicadorFactDsctoRecargoNombre + '"/>'
                    ]).draw(false);

                    x++;
                    numLineaDsctoRecargo++;
                    count_dsctorecargo++;
                }
            });
            CalcularTotales();
            EncerarDsctoRecargoGlobal();
            $("#modalDsctoRecargoGlobal").modal("hide");
            return; 
        }

        tblDsctoRecargo.row.add([
            '<span id="idtblDsctoRecargo_' + x + '">' + x + '</span>',
            '<span>' + tipoDsctoRecargoNombre + '</span>',
            '<span>' + descripcionDsctoRecargo + '</span>',
            '<div align="center"><span>' + tipoValorDsctoRecargo + ' ' + valorDsctoRecargo + '</span></div>',
            '<div align="right"><span>' + montoDsctoRecargo + '</span></div>',
            '<span>' + indicadorFactDsctoRecargoNombre + '</span>',
            '<div align="center"><a class="tooltip--triangle" title="Eliminar" style="cursor:pointer" data-accion="DEL"><span class="glyphicon glyphicon-trash" style="font-size:17px;"></span></a></div>',

            '<input type="hidden" id="hidNumeroLineaDsctoRecargo_' + x + '" name="DescuentosRecargos[' + x + '].NumeroLinea" value="' + numLineaDsctoRecargo + '"/>' +
            '<input type="hidden" id="hidTipoAjusteDsctoRecargo_' + x + '" name="DescuentosRecargos[' + x + '].TipoAjuste" value="' + tipoDsctoRecargo + '"/>' +
            '<input type="hidden" id="hidTipoValorDsctoRecargo_' + x + '" name="DescuentosRecargos[' + x + '].TipoValor" value="' + tipoValorDsctoRecargo + '"/>' +
            '<input type="hidden" id="hidValorDsctoRecargo_' + x + '" name="DescuentosRecargos[' + x + '].ValorDescuentooRecargo" value="' + valorDsctoRecargo + '"/>' +
            '<input type="hidden" class="csshidMontoDsctoRecargo" id="hidMontoDsctoRecargo_' + x + '" name="DescuentosRecargos[' + x + '].MontoDescuentooRecargo" value="' + montoDsctoRecargo + '" data-tipoAjuste="' + tipoDsctoRecargo + '" data-facturacion="' + indicadorFactDsctoRecargo + '" />' +
            '<input type="hidden" id="hidDescripcionDsctoRecargo_' + x + '" name="DescuentosRecargos[' + x + '].DescripcionDescuentooRecargo" value="' + descripcionDsctoRecargo + '"/>' +
            '<input type="hidden" id="hidIndicadorFacturacionDsctoRecargo_' + x + '" name="DescuentosRecargos[' + x + '].IndicadorFacturacionDescuentooRecargo" value="' + indicadorFactDsctoRecargo + '"/>' +
            '<input type="hidden" id="hidTipoAjusteDsctoRecargoNombre_' + x + '" name="DescuentosRecargos[' + x + '].NombreTipoAjuste" value="' + tipoDsctoRecargoNombre + '"/>' +
            '<input type="hidden" id="hidIndicadorFacturacionDsctoRecargoNombre_' + x + '" name="DescuentosRecargos[' + x + '].NombreIndicadorFacturacionDescuentooRecargo" value="' + indicadorFactDsctoRecargoNombre + '"/>'
        ]).draw(false);

        count_dsctorecargo++;
        CalcularTotales();
        EncerarDsctoRecargoGlobal();
    });

    $('#tblDsctoRecargo tbody').on('click', 'a', function () {

        if ($(this).attr("data-accion") == "DEL") {
            var tr = $(this).parents('tr');
            tblDsctoRecargo.row(tr).remove().draw(true);
            updateModelValuesDetallesItems();
            count_dsctorecargo--;
            CalcularTotales();
        }
    }); 

    $('#btnAgregarSubDescuento').click(function (event) { 
        var j = count_subdescuento;

        if (count_subdescuento >= cant_maxima_subdescuento) {
            MsgActionResultError("La cantidad máxima son: " + cant_maxima_subdescuento + " Subdescuento");
            return;
        }
        var tipoSubDescuento = $("#cboTipoSubDescuento").val();
        var tipoSubDescuentoNombre = $("#cboTipoSubDescuento option:selected").text();
        var subDescuentoPorcentaje = parseFloat($("#txtSubDescuentoPorcentaje").val() || 0);
        var montoSubDescuento = parseFloat($("#txtMontoSubDescuento").val() || 0);

        if (!tipoSubDescuento) {
            MsgActionResultError("Por favor seleccionar el Tipo");
            return;
        }
        if (!montoSubDescuento || montoSubDescuento <= 0) {
            MsgActionResultError("El Monto Descuento no es válido");
            return;
        }
        if ((!subDescuentoPorcentaje || subDescuentoPorcentaje <= 0) && tipoSubDescuento == "%") {
            MsgActionResultError("Por favor ingrese el % Descuento");
            return;
        }
        
        var idtblProducto = $("#hididtblProducto").val();
        var rowIdx = $("#rowIdxDetallesItems").val();
        var descuentoMonto = 0;
        $(".csshidMontoSubDescuento_" + rowIdx).each(function () { descuentoMonto += parseFloat($(this).val()); });
        descuentoMonto += montoSubDescuento;
        descuentoMonto = parseFloat(parseFloat(descuentoMonto).toFixed(2));
        $("#hidDescuentoMonto_" + rowIdx).remove();
        var montoItemActual = parseFloat($("#hidMontoItem_" + rowIdx).val());
        if (montoItemActual < montoSubDescuento) {
            MsgActionResultError("El monto del item: " + montoItemActual + ", no puede ser inferior al descuento: " + montoSubDescuento);
            return;
        }

        tblSubDescuento.row.add([
            '<span id="idtblSubDescuento_' + j + '">' + j + '</span>',
            '<div align="center"><span class="csstipoSubDescuentoNombre_' + rowIdx + '">' + tipoSubDescuentoNombre + '</span></div>',
            '<div align="right"><span>' + subDescuentoPorcentaje + '</span></div>',
            '<div align="right"><span>' + montoSubDescuento + '</span></div>',
            '<div align="center"><a class="tooltip--triangle" title="Eliminar" style="cursor:pointer" data-accion="DEL"><span class="glyphicon glyphicon-trash" style="font-size:17px;"></span></a></div>',

            '<input class="csshidTipoSubDescuento_' + rowIdx + '" type="hidden" id="hidTipoSubDescuento_' + rowIdx + '_' + j + '" name="DetallesItems[' + rowIdx + '].SubDescuentos[' + j + '].TipoSubDescuento" value="' + tipoSubDescuento + '"/>' +
            '<input class="csshidSubDescuentoPorcentaje_' + rowIdx + '" type="hidden" id="hidSubDescuentoPorcentaje_' + rowIdx + '_' + j + '" name="DetallesItems[' + rowIdx + '].SubDescuentos[' + j + '].SubDescuentoPorcentaje" value="' + subDescuentoPorcentaje + '"/>' +
            '<input class="csshidMontoSubDescuento_' + rowIdx + '" type="hidden" id="hidMontoSubDescuento_' + rowIdx + '_' + j + '" name="DetallesItems[' + rowIdx + '].SubDescuentos[' + j + '].MontoSubDescuento" value="' + montoSubDescuento + '"/>' +
            '<input id="hidDescuentoMonto_' + rowIdx + '" type="hidden" name="DetallesItems[' + rowIdx + '].DescuentoMonto" value="' + descuentoMonto + '"/>' +
            '<span class="css' + idtblProducto + '">' + idtblProducto + '</span>'
        ]).draw(false);
         
        count_subdescuento++;
        AplicarDescuentoRecargoMontoItem();
        CalcularTotales();
        $("#cboTipoSubDescuento").val(null).change();
        $("#txtSubDescuentoPorcentaje").val(null);
        $("#txtMontoSubDescuento").val(null);
         
    });

    $('#tblSubDescuento tbody').on('click', 'a', function () {

        if ($(this).attr("data-accion") == "DEL") {
            var tr = $(this).parents('tr');
            tblSubDescuento.row(tr).remove().draw();
            updateModelValuesDetallesItemsSubDescuentos();
            count_subdescuento--;
            AplicarDescuentoRecargoMontoItem();
            CalcularTotales();
        }
    }); 

    function AplicarDescuentoRecargoMontoItem() {
        
        var descuentoMonto = 0, recargoMonto = 0;
        var rowIdx = $("#rowIdxDetallesItems").val();
        var montoItem = parseFloat($("#hidMontoItemNeto_" + rowIdx).val());

        $(".csshidMontoSubDescuento_" + rowIdx).each(function () { descuentoMonto += parseFloat($(this).val()); });
        descuentoMonto = parseFloat(parseFloat(descuentoMonto).toFixed(2)); 
        $("#totalSubDescuento").text(formatMoney(descuentoMonto));
        $("#hidDescuentoMonto_" + rowIdx).val(descuentoMonto);
          
        $(".csshidMontoSubRecargo_" + rowIdx).each(function () { recargoMonto += parseFloat($(this).val()); });
        recargoMonto = parseFloat(parseFloat(recargoMonto).toFixed(2));
        $("#totalSubRecargo").text(formatMoney(recargoMonto.toFixed(2)));
        $("#hidRecargoMonto_" + rowIdx).val(recargoMonto);

        var montoItemFinal = parseFloat(parseFloat(montoItem - descuentoMonto + recargoMonto).toFixed(2));
        $("#idMontoItem_" + rowIdx).text(montoItemFinal);
        $("#hidMontoItem_" + rowIdx).val(montoItemFinal);
        
    } 

    $('#btnAgregarSubRecargo').click(function (event) {
        var j = count_subrecargo;

        if (count_subrecargo >= cant_maxima_subrecargo) {
            MsgActionResultError("La cantidad máxima son: " + cant_maxima_subrecargo + " Subrecargo");
            return;
        }
        var tipoSubRecargo = $("#cboTipoSubRecargo").val();
        var tipoSubRecargoNombre = $("#cboTipoSubRecargo option:selected").text();
        var subRecargoPorcentaje = parseFloat($("#txtSubRecargoPorcentaje").val() || 0);
        var montoSubRecargo = parseFloat($("#txtMontoSubRecargo").val() || 0);

        if (!tipoSubRecargo) {
            MsgActionResultError("Por favor seleccionar el Tipo");
            return;
        }
        if (!montoSubRecargo || montoSubRecargo <= 0) {
            MsgActionResultError("El Monto Recargo no es válido");
            return;
        }
        if ((!subRecargoPorcentaje || subRecargoPorcentaje <= 0) && tipoSubRecargo == "%") {
            MsgActionResultError("Por favor ingrese el % Recargo");
            return;
        }

        var idtblProducto = $("#hididtblProducto").val();
        var rowIdx = $("#rowIdxDetallesItems").val();
        var recargoMonto = 0;
        $(".csshidMontoSubRecargo_" + rowIdx).each(function () { recargoMonto += parseFloat($(this).val()); });
        recargoMonto += montoSubRecargo;
        recargoMonto = parseFloat(parseFloat(recargoMonto).toFixed(2));
        $("#hidRecargoMonto_" + rowIdx).remove();

        tblSubRecargo.row.add([
            '<span id="idtblSubRecargo' + j + '">' + j + '</span>',
            '<div align="center"><span class="csstipoSubRecargoNombre_' + rowIdx + '">' + tipoSubRecargoNombre + '</span></div>',
            '<div align="right"><span>' + subRecargoPorcentaje + '</span></div>',
            '<div align="right"><span>' + montoSubRecargo + '</span></div>',
            '<div align="center"><a class="tooltip--triangle" title="Eliminar" style="cursor:pointer" data-accion="DEL"><span class="glyphicon glyphicon-trash" style="font-size:17px;"></span></a></div>',

            '<input class="csshidTipoSubRecargo_' + rowIdx + '" type="hidden" id="hidTipoSubRecargo_' + rowIdx + '_' + j + '" name="DetallesItems[' + rowIdx + '].SubRecargos[' + j + '].TipoSubRecargo" value="' + tipoSubRecargo + '"/>' +
            '<input class="csshidSubRecargoPorcentaje_' + rowIdx + '" type="hidden" id="hidSubRecargoPorcentaje_' + rowIdx + '_' + j + '" name="DetallesItems[' + rowIdx + '].SubRecargos[' + j + '].SubRecargoPorcentaje" value="' + subRecargoPorcentaje + '"/>' +
            '<input class="csshidMontoSubRecargo_' + rowIdx + '" type="hidden" id="hidMontoSubRecargo_' + rowIdx + '_' + j + '" name="DetallesItems[' + rowIdx + '].SubRecargos[' + j + '].MontoSubRecargo" value="' + montoSubRecargo + '"/>' +
            '<input id="hidRecargoMonto_' + rowIdx + '" type="hidden" name="DetallesItems[' + rowIdx + '].RecargoMonto" value="' + recargoMonto + '"/>' +
            '<span class="css' + idtblProducto + '">' + idtblProducto + '</span>'
        ]).draw(false);

        count_subrecargo++;
        AplicarDescuentoRecargoMontoItem();
        CalcularTotales();
        $("#cboTipoSubRecargo").val(null).change();
        $("#txtSubRecargoPorcentaje").val(null);
        $("#txtMontoSubRecargo").val(null);
    });

    $('#tblSubRecargo tbody').on('click', 'a', function () {

        if ($(this).attr("data-accion") == "DEL") {
            var tr = $(this).parents('tr');
            tblSubRecargo.row(tr).remove().draw(true);
            updateModelValuesDetallesItemsSubRecargos();
            count_subrecargo--;
            AplicarDescuentoRecargoMontoItem();
            CalcularTotales();
        }
    });
     
    $('#modal_DsctoRecargoLineal').on('hidden.bs.modal', function () {
        tblSubDescuento.search("").draw();
        tblSubRecargo.search("").draw();
    });

    $('#modal_RespuestaEmision').on('hidden.bs.modal', function () {
        if ($("#divRespuestaEmision").hasClass("alert-success")) {
            $("#formCancelarEmision").submit();
        }
    }); 

    $('#cboTipoPago').on('change', function () {
        if (this.value == 2) {
            $("#txtFechaLimitePago").prop("disabled", false).prop("required", true);
        }
        else {
            $("#txtFechaLimitePago").val(null);
            $("#txtFechaLimitePago").prop("disabled", true).prop("required", false);
        }
    });

    $('#cboMonedaCambio').on('change', function () {
        calcularOtraMoneda();
        if (this.value) {
            $("#txtTipoCambio").attr("readonly", false).prop("required", true);
        } else {
            $("#txtTipoCambio").val(null);
            $("#txtTipoCambio").attr("readonly", true).prop("required", false);
        }
    });

    $("#txtTipoCambio").keyup(function () {
        calcularOtraMoneda();
    });
    
    $("#txtSubDescuentoPorcentaje").keyup(function () {
        CalcularMontoDsctoLineal();
    });

    $("#txtSubDescuentoPorcentaje").change(function () {
        changeHandlerPorcentaje(this);
        CalcularMontoDsctoLineal();
    });

    $("#txtSubRecargoPorcentaje").keyup(function () {
        CalcularMontoRecargoLineal();
    });

    $("#txtSubRecargoPorcentaje").change(function () {
        changeHandlerPorcentaje(this);
        CalcularMontoRecargoLineal();
    });

    $("#cboTipoSubDescuento").on('change', function () {
        $("#txtSubDescuentoPorcentaje").val(null);
        if (this.value == "%") {
            $("#txtMontoSubDescuento").prop("disabled", true);
            $("#txtSubDescuentoPorcentaje").prop("disabled", false);
        }
        else {
            $("#txtMontoSubDescuento").prop("disabled", false);
            $("#txtSubDescuentoPorcentaje").prop("disabled", true);
        }
    });

    $("#cboTipoSubRecargo").on('change', function () {
        $("#txtSubRecargoPorcentaje").val(null);
        if (this.value == "%") {
            $("#txtMontoSubRecargo").prop("disabled", true);
            $("#txtSubRecargoPorcentaje").prop("disabled", false);
        }
        else {
            $("#txtMontoSubRecargo").prop("disabled", false);
            $("#txtSubRecargoPorcentaje").prop("disabled", true);
        }
    });

    $("#cboTipoValorDsctoRecargo").on('change', function () {
        $("#txtValorDsctoRecargo").val(null);
        if (this.value == "%") {
            $("#txtMontoDsctoRecargo").prop("disabled", true);
            $("#txtValorDsctoRecargo").prop("disabled", false);
            CalcularMontoDsctoRecargoGlobal();
        }
        else {
            $("#txtMontoDsctoRecargo").prop("disabled", false); 
            $("#txtValorDsctoRecargo").prop("disabled", true);
        }
    });
    
    $('#chkAplicaTodos').click(function (e) {
        $("#cboIndicadorFactDsctoRecargo").val(null).change();
        $("#cboIndicadorFactDsctoRecargo").prop("disabled", this.checked); 
    });

    $("#txtValorDsctoRecargo").keyup(function () {
        CalcularMontoDsctoRecargoGlobal();
    });

    $("#txtValorDsctoRecargo").change(function () {
        changeHandlerPorcentaje(this);
        CalcularMontoDsctoRecargoGlobal();
    });

    $("#cboIndicadorFactDsctoRecargo").on('change', function () {
        CalcularMontoDsctoRecargoGlobal();
    });

    $('#btnEliminarTodoDsctoRecargo').click(function (e) {
        tblDsctoRecargo.rows().remove().draw();
        count_dsctorecargo = 0;
        CalcularTotales();
    });

    $('#btnEliminarTodoProducto').click(function (e) {
        tblProducto.rows().remove().draw();
        count_productos = 0;
        CalcularTotales();
    });

    $('#btnEliminarTodoAdicional').click(function (e) {
        tblDatosAdicional.rows().remove().draw();
        count_adicional = 0;
    });

    $('#btnEliminarTodoFormaPago').click(function (e) {
        tblFormaPago.rows().remove().draw();
        count_formapago = 0;
    });

    $(".dataTables_scrollBody").css("overflow-x", "hidden");

    $("#btnBuscarFactura").click(function (event) {
        event.preventDefault();
        IniciarLoading();
        LimpiarFactura();
        BuscarFactura();
    });

    $("#txtNCFModificado").on("keydown", function (event) {
        if (event.which == 13) {
            event.preventDefault();
            IniciarLoading();
            LimpiarFactura();
            BuscarFactura();
        }
    });

    function BuscarFactura() {
        var numFactura = $("#txtNCFModificado").val();
        if (!numFactura) {
            MsgActionResultError("Por favor ingrese una factura válida");
            return;
        }
        $.ajax({
            url: urlBase + CONTROLLER + "/BuscarFactura?NumDocumento=" + numFactura,
            type: 'GET',
            dataType: 'json',
            success: function (result) {
                DetenerLoading();
                if (!result) {
                    MsgActionResultError("No se encontró la factura o no pertenece a esta compañia");
                    return;
                }
                CargarFactura(result);
            },
            error: function (result) {
                if (result.status == 500)
                    MsgActionResultError(result.responseText);
                else
                    window.location.href = result.responseText;
            }
        });
    }

    function LimpiarFactura() {
        $("#lblRNCComprador").html(null);
        $("#lblIdentificadorExtranjero").html(null);
        $("#lblRazonSocialComprador").html(null);
        $("#lblCorreoComprador").html(null);
        $("#lblFechaEmision").html(null);
        $(".lblTotalDetalleFactura").html(null);
        tblProductoFactura.clear().draw(true);
    }

    function CargarFactura(factura) {

        try {
            if (factura) {
                if (factura.encabezado.comprador) {
                    $("#lblRNCComprador").html(factura.encabezado.comprador.rncComprador);
                    $("#lblIdentificadorExtranjero").html(factura.encabezado.comprador.identificadorExtranjero);
                    $("#lblRazonSocialComprador").html(factura.encabezado.comprador.razonSocialComprador);
                    $("#lblCorreoComprador").html(factura.encabezado.comprador.correoComprador);
                }
                $("#lblFechaEmision").html(moment(factura.encabezado.emisor.fechaEmision).format("DD/MM/YYYY"));

                if (factura.detallesItems) {
                    $.each(factura.detallesItems, function (j, item) {
                        tblProductoFactura.row.add([
                            '<span id="idtblProducto">' + j + '</span>',
                            '<span>' + item.nombreItem + '</span>',
                            '<div align="right"><span>' + item.precioUnitarioItem + '</span></div>',
                            '<div align="right"><span>' + item.cantidadItem + '</span></div>',
                            '<div align="right"><span>' + item.montoItem + '</span></div>',
                            '<div></div>'

                        ]).draw(false);
                    });
                }
                $(".lblTotalDetalleFactura").html(formatMoney(parseFloat(factura.encabezado.totales.montoTotal).toFixed(2)));
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    var tblProductoFactura = $("#tblProductoFactura").DataTable({
        "bInfo": false,

        "autoWidth": false,
        "bProcessing": false,
        "bServerSide": false,
        "searching": false,
        "paging": false,
        "scrollY": "170px",
        "scrollCollapse": true,
        "columnDefs": [
            { targets: [1], width: '30%' },
            { targets: [2], width: '10%' },
            { targets: [3], width: '5%' },
            { targets: [4], width: '10%' },
            { targets: [5], width: '1%' },
            { targets: [0], className: "hide_column" },
            { targets: [2, 3, 4, 5], 'bSortable': false },
        ]
    });


});

function CalcularMontoDsctoRecargoGlobal() {
    $("#txtMontoDsctoRecargo").val(null);
    var indFactura = $("#cboIndicadorFactDsctoRecargo").val();
    if (!$('#chkAplicaTodos').is(':checked') && indFactura) {
        var montoItem = 0;
        var porcentaje = parseFloat($("#txtValorDsctoRecargo").val()) || 0;
        if (porcentaje > 0) {
            $(".csshidMontoItem").each(function () {
                if ($(this).attr("data-facturacion") == indFactura) {
                    montoItem += parseFloat($(this).val());
                }
            });
            if (montoItem > 0) {
                var dsctoRecargo = parseFloat(parseFloat(montoItem * (porcentaje / 100)).toFixed(2));
                $("#txtMontoDsctoRecargo").val(dsctoRecargo);
            }
        }
    }
}

function EncerarDsctoRecargoGlobal()
{
    $("#cboTipoDsctoRecargo").val(null).change();
    $("#cboTipoValorDsctoRecargo").val(null).change(); 
    $("#cboIndicadorFactDsctoRecargo").val(null).change();
    $("#txtValorDsctoRecargo").val(null);
    $("#txtMontoDsctoRecargo").val(null);
    $("#txtDescripcionDsctoRecargo").val(null);
    $("#chkAplicaTodos").prop('checked', false);
    $("#cboIndicadorFactDsctoRecargo").prop("disabled", false);
}

function CalcularMontoDsctoLineal() {
    var rowIdx = $("#rowIdxDetallesItems").val();
    var porcdscto = parseFloat(parseFloat($("#txtSubDescuentoPorcentaje").val() || 0).toFixed(2));
    var montoItem = parseFloat(parseFloat($("#hidMontoItemNeto_" + rowIdx).val() || 0).toFixed(2));
    var dscto = parseFloat(parseFloat(montoItem * (porcdscto / 100)).toFixed(2));

    $("#txtMontoSubDescuento").val(dscto);
}

function CalcularMontoRecargoLineal() {
    var rowIdx = $("#rowIdxDetallesItems").val();
    var porcrecargo = parseFloat(parseFloat($("#txtSubRecargoPorcentaje").val() || 0).toFixed(2));
    var montoItem = parseFloat(parseFloat($("#hidMontoItemNeto_" + rowIdx).val() || 0).toFixed(2));
    var recargo = parseFloat(parseFloat(montoItem * (porcrecargo / 100)).toFixed(2));

    $("#txtMontoSubRecargo").val(recargo);
}

function calcularOtraMoneda() {
    var montoExento = parseFloat(unformat($("#lblMontoExento").text()));
    var montoGravado = parseFloat(unformat($("#lblMontoGravado").text())); 
    var totalITBIS = parseFloat(unformat($("#lblTotalITBIS").text()));
    var montoTotal = parseFloat(unformat($("#lblMontoTotal").text()));
    var montoImpuestoAdicional = parseFloat(unformat($("#lblMontoImpuestoAdicional").text()));
        
    var tipoCambio = parseFloat($("#txtTipoCambio").val()) || 0;
    var montoExentoOtraMoneda = parseFloat((isFinite(montoExento / tipoCambio) ? montoExento / tipoCambio : 0) || 0).toFixed(2);
    var montoGravadoOtraMoneda = parseFloat((isFinite(montoGravado / tipoCambio) ? montoGravado / tipoCambio : 0) || 0).toFixed(2);
    var totalITBISOtraMoneda = parseFloat((isFinite(totalITBIS / tipoCambio) ? totalITBIS / tipoCambio : 0) || 0).toFixed(2);
    var montoTotalOtraMoneda = parseFloat((isFinite(montoTotal / tipoCambio) ? montoTotal / tipoCambio : 0) || 0).toFixed(2);
    var montoImpuestoAdicionalOtraMoneda = parseFloat((isFinite(montoImpuestoAdicional / tipoCambio) ? montoImpuestoAdicional / tipoCambio : 0) || 0).toFixed(2);

    $("#lblMontoExentoOtraMoneda").text(formatMoney(montoExentoOtraMoneda));
    $("#lblMontoGravadoOtraMoneda").text(formatMoney(montoGravadoOtraMoneda));
    $("#lblTotalITBISOtraMoneda").text(formatMoney(totalITBISOtraMoneda));
    $("#lblMontoImpuestoAdicionalOtraMoneda").text(formatMoney(montoImpuestoAdicionalOtraMoneda));
    $("#lblMontoTotalOtraMoneda").text(formatMoney(montoTotalOtraMoneda));
}

function CalcularTotales() {
    
    var MontoNoFacturable = 0.00;
    var MontoExento = 0.00;
    var MontoGravado1 = 0.00;
    var MontoGravado2 = 0.00;
    var MontoGravado3 = 0.00;
    var MontoGravadoTotal = 0.00;
    var TotalITBIS1 = 0.00;
    var TotalITBIS2 = 0.00;
    var TotalITBIS3 = 0.00;
    var TotalITBIS = 0.00;
    var ITBIS1_porc = 0;
    var ITBIS2_porc = 0;
    var ITBIS3_porc = 0;
    var ImpuestoAdicional = 0.00;
    var MontoTotal = 0.00;

    var DsctoMontoExento = 0.00;
    var DsctoMontoGravado1 = 0.00;
    var DsctoMontoGravado2 = 0.00;
    var DsctoMontoGravado3 = 0.00;
    var RecargoMontoExento = 0.00;
    var RecargoMontoGravado1 = 0.00;
    var RecargoMontoGravado2 = 0.00;
    var RecargoMontoGravado3 = 0.00;
    var DsctoTotal = 0.00;
    var RecargoTotal = 0.00;

    $(".csshidMontoItem").each(function () {

        switch (parseInt($(this).attr("data-facturacion"))) {
            case indicadorNoFacturable:
                MontoNoFacturable += parseFloat($(this).val());
                break;
            case indicadorFacturacion1:
                MontoGravado1 += parseFloat($(this).val());
                ITBIS1_porc = parseFloat($(this).attr("data-itbis"));
                break;
            case indicadorFacturacion2:
                MontoGravado2 += parseFloat($(this).val());
                ITBIS2_porc = parseFloat($(this).attr("data-itbis"));
                break;
            case indicadorFacturacion3:
                MontoGravado3 += parseFloat($(this).val());
                ITBIS3_porc = parseFloat($(this).attr("data-itbis"));
                break;
            case indicadorFacturacionExento:
                MontoExento += parseFloat($(this).val());
                break;
            default:
                break;
        }

        if ($(this).attr("data-tasa1")) {
            if ($(this).attr("data-impuesto1") >= impSelectivoConsumoEspecificoDesde && $(this).attr("data-impuesto1") <= impSelectivoConsumoEspecificoHasta)
                ImpuestoAdicional += parseFloat($(this).attr("data-cantidad1")) * (parseFloat($(this).attr("data-tasa1")));
            else
                ImpuestoAdicional += parseFloat($(this).val()) * (parseFloat($(this).attr("data-tasa1")) / 100);
        }

        if ($(this).attr("data-tasa2")) {
            if ($(this).attr("data-impuesto2") >= impSelectivoConsumoEspecificoDesde && $(this).attr("data-impuesto2") <= impSelectivoConsumoEspecificoHasta)
                ImpuestoAdicional += parseFloat($(this).attr("data-cantidad2")) * (parseFloat($(this).attr("data-tasa2")));
            else
                ImpuestoAdicional += parseFloat($(this).val()) * (parseFloat($(this).attr("data-tasa2")) / 100);
        }
    });
    
    $(".csshidMontoDsctoRecargo").each(function () {

        if ($(this).attr("data-tipoAjuste") == "D") {
            switch (parseInt($(this).attr("data-facturacion"))) {
                case indicadorFacturacion1:
                    DsctoMontoGravado1 += parseFloat($(this).val());
                    break;
                case indicadorFacturacion2:
                    DsctoMontoGravado2 += parseFloat($(this).val());
                    break;
                case indicadorFacturacion3:
                    DsctoMontoGravado3 += parseFloat($(this).val());
                    break;
                case indicadorFacturacionExento:
                    DsctoMontoExento += parseFloat($(this).val());
                    break;
                default:
                    break;
            }
        }
        else if ($(this).attr("data-tipoAjuste") == "R") {
            switch (parseInt($(this).attr("data-facturacion"))) {
                case indicadorFacturacion1:
                    RecargoMontoGravado1 += parseFloat($(this).val());
                    break;
                case indicadorFacturacion2:
                    RecargoMontoGravado2 += parseFloat($(this).val());
                    break;
                case indicadorFacturacion3:
                    RecargoMontoGravado3 += parseFloat($(this).val());
                    break;
                case indicadorFacturacionExento:
                    RecargoMontoExento += parseFloat($(this).val());
                    break;
                default:
                    break;
            }
        }
         
    });

    DsctoTotal = parseFloat(parseFloat(DsctoMontoGravado1 + DsctoMontoGravado2 + DsctoMontoGravado3 + DsctoMontoExento).toFixed(2));
    RecargoTotal = parseFloat(parseFloat(RecargoMontoGravado1 + RecargoMontoGravado2 + RecargoMontoGravado3 + RecargoMontoExento).toFixed(2));

    MontoGravado1 = (MontoGravado1 - DsctoMontoGravado1 + RecargoMontoGravado1);
    MontoGravado2 = (MontoGravado2 - DsctoMontoGravado2 + RecargoMontoGravado2);
    MontoGravado3 = (MontoGravado3 - DsctoMontoGravado3 + RecargoMontoGravado3);
    MontoExento = (MontoExento - DsctoMontoExento + RecargoMontoExento);

    TotalITBIS1 = MontoGravado1 * (ITBIS1_porc / 100);
    TotalITBIS2 = MontoGravado2 * (ITBIS2_porc / 100);
    TotalITBIS3 = MontoGravado3 * (ITBIS3_porc / 100);
    MontoGravadoTotal = MontoGravado1 + MontoGravado2 + MontoGravado3;
    TotalITBIS = TotalITBIS1 + TotalITBIS2 + TotalITBIS3;

    MontoNoFacturable = parseFloat(parseFloat(MontoNoFacturable).toFixed(2));
    MontoExento = parseFloat(parseFloat(MontoExento).toFixed(2));
    MontoGravadoTotal = parseFloat(parseFloat(MontoGravadoTotal).toFixed(2));
    TotalITBIS = parseFloat(parseFloat(TotalITBIS).toFixed(2));
    ImpuestoAdicional = parseFloat(parseFloat(ImpuestoAdicional).toFixed(2));
    MontoTotal = MontoGravadoTotal + MontoExento + TotalITBIS + ImpuestoAdicional;

    var strMontoNoFacturable = parseFloat(MontoNoFacturable).toFixed(2);
    var strMontoGravado = parseFloat(MontoGravadoTotal).toFixed(2);
    var strMontoExento = parseFloat(MontoExento).toFixed(2);
    var strITBIS = parseFloat(TotalITBIS).toFixed(2);
    var strImpuestoAdicional = parseFloat(ImpuestoAdicional).toFixed(2);
    var strMontoTotal = parseFloat(MontoTotal).toFixed(2);
    var strDescuentoTotal = parseFloat(DsctoTotal).toFixed(2);
    var strRecargoTotal = parseFloat(RecargoTotal).toFixed(2);
     
    $("#lblMontoNoFacturable").text(formatMoney(strMontoNoFacturable));
    $("#lblMontoExento").text(formatMoney(strMontoExento));
    $("#lblMontoGravado").text(formatMoney(strMontoGravado));
    $("#lblTotalITBIS").text(formatMoney(strITBIS));
    $("#lblMontoImpuestoAdicional").text(formatMoney(strImpuestoAdicional));
    $("#lblMontoTotal").text(formatMoney(strMontoTotal));
    
    $("#lblDescuentoTotal").text(formatMoney(strDescuentoTotal));
    $("#lblRecargoTotal").text(formatMoney(strRecargoTotal));
    $("#hidMontoTotal").val(MontoTotal);

    calcularOtraMoneda();

    if (hidMaximoMontoConsumo) {
        MontoTotalConsumo = MontoTotal;
        if (MontoTotalConsumo >= hidMaximoMontoConsumo) {
            if (!$("#cboCliente").val() && !$("#txtIdentificadorExtranjero").val()) {
                $("#cboCliente").prop("required", true);
                $("#txtIdentificadorExtranjero").prop("required", true);
            }
            $("#txtRazonSocialComprador").prop("required", true);
        }
        else {
            $("#cboCliente").prop("required", false);
            $("#txtIdentificadorExtranjero").prop("required", false);
            $("#txtRazonSocialComprador").prop("required", false);
        }
    }
}

function updateModelValuesCamposAdicionales() {
    var c = 0, numLinea = 0;

    for (var i = 0; i < count_adicional; i++) {
        if ($("#hidDato_" + i).length) {
            numLinea = c + 1;
            $("#idtblDatosAdicional_" + i).html(numLinea).attr("id", "idtblDatosAdicional_" + c);
            $("#hidId_" + i).removeAttr("name").attr("name", "CamposAdicionales[" + c + "].Id").val(numLinea).attr("id", "hidId_" + c);
            $("#hidTitulo_" + i).removeAttr("name").attr("name", "CamposAdicionales[" + c + "].Titulo").attr("id", "hidTitulo_" + c);
            $("#hidDato_" + i).removeAttr("name").attr("name", "CamposAdicionales[" + c + "].Dato").attr("id", "hidDato_" + c);

            c++;
        }
    }
}

function updateModelValuesFormaPago() {
    var c = 0;

    for (var i = 0; i < count_formapago; i++) {
        if ($("#hidCodigoPago_" + i).length) {
            $("#idtblFormaPago_" + i).html(c).attr("id", "idtblFormaPago_" + c);
            $("#hidCodigoPago_" + i).removeAttr("name").attr("name", "Encabezado.IdDoc.FormasPago[" + c + "].Codigo").attr("id", "hidCodigoPago_" + c);
            $("#hidMontoPago_" + i).removeAttr("name").attr("name", "Encabezado.IdDoc.FormasPago[" + c + "].MontoPago").attr("id", "hidMontoPago_" + c);
            $("#hidNombrePago_" + i).removeAttr("name").attr("name", "Encabezado.IdDoc.FormasPago[" + c + "].Nombre").attr("id", "hidNombrePago_" + c);

            c++;
        }
    }
}

$('#chkSecuenciaManual').click(function (e) { 
    $("#txtNumDocumento").prop("readonly", !this.checked); 
});

function popoverContent(data) {
    var content = '';
    content = $("#popover_html").html();
    content = content.replace(/info_rnc/g, data.usuario);
    content = content.replace(/info_nombre/g, data.nombre);
    content = content.replace(/info_correo/g, data.correo);
    return content;
}

function CargaCliente(cliente) {
    try {
        $("#hidRNCComprador").val(null);
        $("#txtRazonSocialComprador").val(null);
        $("#txtCorreoComprador").val(null);

        if (cliente) {
            $("#hidRNCComprador").val(cliente.usuario);
            $("#txtRazonSocialComprador").val(cliente.nombre);
            $("#txtCorreoComprador").val(cliente.correo);
            var contentHtml = popoverContent(cliente);
            $("#infoCliente").popover('destroy').popover({
                'html': true,
                'content': contentHtml,
                'trigger': 'hover',
                'placement': 'bottom'
            });

        }
    } catch (error) {
        console.log(error);
    }
}

function BuscarMunicipios(provincia) {
    $('#cboMunicipioComprador').empty().change();
    $("#cboMunicipioComprador").attr("disabled", "disabled");
    var selProvincia = provincia;
    if (!selProvincia) {
        return;
    }

    $.ajax({
        type: 'POST',
        url: urlBase + CONTROLLER + "/ConsultarMunicipios",
        data: { IdProvincia: selProvincia },
        success: function (result, statusText, status) {
            var Municipios = result;
            if (Municipios) {
                $.each(Municipios, function (i, item) {
                    $("#cboMunicipioComprador").append("<option value='" + item.idMunicipio + "'>" + item.nombre + "</option>");
                });
                $("#cboMunicipioComprador").removeAttr("disabled").val(null).change();
            }
            else {
                MsgActionResultError(status.responseJSON || "Ha ocurrido un error al obtener Municipios..", 1);
                return;
            }
        },
        error: function (result) {
            if (result.status == 500)
                MsgActionResultError(result.responseText);
            else
                window.location.href = result.responseText;
        }
    });
}

function updateModelValuesDetallesItems() {
    var c = 0, numLinea = 0;

    for (var i = 0; i < count_productos; i++) { 
        if ($("#hidNombreItem_" + i).length) {
            numLinea = c + 1;
            $("#idtblProducto_" + i).html(c).attr("id", "idtblProducto_" + c);
            $("#etiNumeroLinea_" + i).html(numLinea).attr("id", "etiNumeroLinea_" + c);
            $("#hidNumeroLinea_" + i).removeAttr("name").attr("name", "DetallesItems[" + c + "].NumeroLinea").val(numLinea).attr("id", "hidNumeroLinea_" + c);
            $("#hidNombreItem_" + i).removeAttr("name").attr("name", "DetallesItems[" + c + "].NombreItem").attr("id", "hidNombreItem_" + c);
            $("#hidDescripcionItem_" + i).removeAttr("name").attr("name", "DetallesItems[" + c + "].DescripcionItem").attr("id", "hidDescripcionItem_" + c);
            $("#hidCantidadItem_" + i).removeAttr("name").attr("name", "DetallesItems[" + c + "].CantidadItem").attr("id", "hidCantidadItem_" + c);
            $("#hidUnidadMedida_" + i).removeAttr("name").attr("name", "DetallesItems[" + c + "].UnidadMedida").attr("id", "hidUnidadMedida_" + c);
            $("#hidPrecioUnitarioItem_" + i).removeAttr("name").attr("name", "DetallesItems[" + c + "].PrecioUnitarioItem").attr("id", "hidPrecioUnitarioItem_" + c);
            $("#hidMontoItem_" + i).removeAttr("name").attr("name", "DetallesItems[" + c + "].MontoItem").attr("id", "hidMontoItem_" + c);
            $("#hidMontoItemNeto_" + i).attr("id", "hidMontoItemNeto_" + c);
            $("#hidIndicadorBienoServicio_" + i).removeAttr("name").attr("name", "DetallesItems[" + c + "].IndicadorBienoServicio").attr("id", "hidIndicadorBienoServicio_" + c);
            $("#hidIndicadorFacturacion_" + i).removeAttr("name").attr("name", "DetallesItems[" + c + "].IndicadorFacturacion").attr("id", "hidIndicadorFacturacion_" + c);
            $("#hidNombreIndicadorFacturacion_" + i).removeAttr("name").attr("name", "DetallesItems[" + c + "].NombreIndicadorFacturacion").attr("id", "hidNombreIndicadorFacturacion_" + c);

            if ($("#hidTipoCodigo_" + i).val() && $("#hidCodigo_" + i).val()) {
                $("#hidTipoCodigo_" + i).removeAttr("name").attr("name", "DetallesItems[" + c + "].CodigosItem[0].TipoCodigo");
                $("#hidCodigo_" + i).removeAttr("name").attr("name", "DetallesItems[" + c + "].CodigosItem[0].Codigo");
            }
            $("#hidTipoCodigo_" + i).attr("id", "hidTipoCodigo_" + c);
            $("#hidCodigo_" + i).attr("id", "hidCodigo_" + c);
            $("#hidITBIS_" + i).removeAttr("name").attr("name", "DetallesItems[" + c + "].ITBIS").attr("id", "hidITBIS_" + c);
            $("#hidIndicadorAgenteRetencionoPercepcion_" + i).removeAttr("name").attr("name", "DetallesItems[" + c + "].Retencion.IndicadorAgenteRetencionoPercepcion").attr("id", "hidIndicadorAgenteRetencionoPercepcion_" + c);
            $("#hidMontoITBISRetenido_" + i).removeAttr("name").attr("name", "DetallesItems[" + c + "].Retencion.MontoITBISRetenido").attr("id", "hidMontoITBISRetenido_" + c);
            $("#hidMontoITBISRetenido_" + i).removeAttr("name").attr("name", "DetallesItems[" + c + "].Retencion.MontoITBISRetenido").attr("id", "hidMontoITBISRetenido_" + c);

            if ($("#hidImpuestoAdicional1_" + i).val()) {
                $("#hidImpuestoAdicional1_" + i).removeAttr("name").attr("name", "DetallesItems[" + c + "].ImpuestosAdicionales1");
                $("#hidTasaImpuestoAdicional1_" + i).removeAttr("name").attr("name", "DetallesItems[" + c + "].TasaImpuestoAdicional1");
            }
            $("#hidImpuestoAdicional1_" + i).attr("id", "hidImpuestoAdicional1_" + c);
            $("#hidTasaImpuestoAdicional1_" + i).attr("id", "hidTasaImpuestoAdicional1_" + c);
            if ($("#hidImpuestoAdicional2_" + i).val()) {
                $("#hidImpuestoAdicional2_" + i).removeAttr("name").attr("name", "DetallesItems[" + c + "].ImpuestosAdicionales2");
                $("#hidTasaImpuestoAdicional2_" + i).removeAttr("name").attr("name", "DetallesItems[" + c + "].TasaImpuestoAdicional2");
            }
            $("#hidImpuestoAdicional2_" + i).attr("id", "hidImpuestoAdicional2_" + c);
            $("#hidTasaImpuestoAdicional2_" + i).attr("id", "hidTasaImpuestoAdicional2_" + c);

            if ($("#hidCantidadReferencia_" + i).length) {
                $("#hidCantidadReferencia_" + i).removeAttr("name").attr("name", "DetallesItems[" + c + "].CantidadReferencia").attr("id", "hidCantidadReferencia_" + c);
                $("#hidPrecioUnitarioReferencia_" + i).removeAttr("name").attr("name", "DetallesItems[" + c + "].PrecioUnitarioReferencia").attr("id", "hidPrecioUnitarioReferencia_" + c);
                $("#hidUnidadReferencia_" + i).removeAttr("name").attr("name", "DetallesItems[" + c + "].UnidadReferencia").attr("id", "hidUnidadReferencia_" + c);
                $("#hidGradosAlcohol_" + i).removeAttr("name").attr("name", "DetallesItems[" + c + "].GradosAlcohol").attr("id", "hidGradosAlcohol_" + c);

                $(".csshidSubCantidadesValor_" + i).each(function (rowIdx) {
                    $("#hidSubCantidadesValor_" + i + '_' + rowIdx).removeAttr("name").attr("name", "DetallesItems[" + c + "].SubCantidades[" + rowIdx + "].Valor").attr("id", "hidSubCantidadesValor_" + c + '_' + rowIdx);
                });
                $(".csshidSubCantidadesValor_" + i).removeClass("csshidSubCantidadesValor_" + i).addClass("csshidSubCantidadesValor_" + c);
                $(".csshidSubCantidadesCodigo_" + i).each(function (rowIdx) {
                    $("#hidSubCantidadesCodigo_" + i + '_' + rowIdx).removeAttr("name").attr("name", "DetallesItems[" + c + "].SubCantidades[" + rowIdx + "].CodigoSubCantidad").attr("id", "hidSubCantidadesCodigo_" + c + '_' + rowIdx);
                });
                $(".csshidSubCantidadesCodigo_" + i).removeClass("csshidSubCantidadesCodigo_" + i).addClass("csshidSubCantidadesCodigo_" + c);
            }

            tblSubDescuento.rows().nodes().to$().find(".cssidtblProducto_" + i).each(function (j) {
                var tr = $(this).parents('tr');
                var inputDsctoMonto;
                var tipoSubDescuentoNombre = tr.find(".csstipoSubDescuentoNombre_" + i).html();
                var tipoSubDescuento = tr.find(".csshidTipoSubDescuento_" + i).val();
                var subDescuentoPorcentaje = tr.find(".csshidSubDescuentoPorcentaje_" + i).val();
                var montoSubDescuento = tr.find(".csshidMontoSubDescuento_" + i).val();
                var descuentoMonto = tr.find("#hidDescuentoMonto_" + i).val();
                if (descuentoMonto)
                    inputDsctoMonto = '<input id="hidDescuentoMonto_' + c + '" type="hidden" name="DetallesItems[' + c + '].DescuentoMonto" value="' + descuentoMonto + '"/>';
                var idtblProducto = "idtblProducto_" + c;
                tblSubDescuento.row.add([
                    '<span id="idtblSubDescuento_' + j + '">' + j + '</span>', 
                    '<div align="center"><span class="csstipoSubDescuentoNombre_' + c + '">' + tipoSubDescuentoNombre + '</span></div>',
                    '<div align="right"><span>' + subDescuentoPorcentaje + '</span></div>',
                    '<div align="right"><span>' + montoSubDescuento + '</span></div>',
                    '<div align="center"><a class="tooltip--triangle" title="Eliminar" style="cursor:pointer" data-accion="DEL"><span class="glyphicon glyphicon-trash" style="font-size:17px;"></span></a></div>',

                    '<input class="csshidTipoSubDescuento_' + c + '" type="hidden" id="hidTipoSubDescuento_' + c + '_' + j + '" name="DetallesItems[' + c + '].SubDescuentos[' + j + '].TipoSubDescuento" value="' + tipoSubDescuento + '"/>' +
                    '<input class="csshidSubDescuentoPorcentaje_' + c + '" type="hidden" id="hidSubDescuentoPorcentaje_' + c + '_' + j + '" name="DetallesItems[' + c + '].SubDescuentos[' + j + '].SubDescuentoPorcentaje" value="' + subDescuentoPorcentaje + '"/>' +
                    '<input class="csshidMontoSubDescuento_' + c + '" type="hidden" id="hidMontoSubDescuento_' + c + '_' + j + '" name="DetallesItems[' + c + '].SubDescuentos[' + j + '].MontoSubDescuento" value="' + montoSubDescuento + '"/>' +
                    inputDsctoMonto +
                    '<span class="css' + idtblProducto + '">' + idtblProducto + '</span>'
                ]).draw(false);
                tblSubDescuento.row(tr).remove().draw();
            });

            tblSubRecargo.rows().nodes().to$().find(".cssidtblProducto_" + i).each(function (j) {
                var tr = $(this).parents('tr');
                var inputRecargoMonto;
                var tipoSubRecargoNombre = tr.find(".csstipoSubRecargoNombre_" + i).html();
                var tipoSubRecargo = tr.find(".csshidTipoSubRecargo_" + i).val();
                var subRecargoPorcentaje = tr.find(".csshidSubRecargoPorcentaje_" + i).val();
                var montoSubRecargo = tr.find(".csshidMontoSubRecargo_" + i).val();
                var recargoMonto = tr.find("#hidRecargoMonto_" + i).val();
                if (recargoMonto)
                    inputRecargoMonto = '<input id="hidRecargoMonto_' + c + '" type="hidden" name="DetallesItems[' + c + '].RecargoMonto" value="' + recargoMonto + '"/>';
                var idtblProducto = "idtblProducto_" + c;
                tblSubRecargo.row.add([
                    '<span id="idtblSubRecargo' + j + '">' + j + '</span>', 
                    '<div align="center"><span class="csstipoSubRecargoNombre_' + c + '">' + tipoSubRecargoNombre + '</span></div>',
                    '<div align="right"><span>' + subRecargoPorcentaje + '</span></div>',
                    '<div align="right"><span>' + montoSubRecargo + '</span></div>',
                    '<div align="center"><a class="tooltip--triangle" title="Eliminar" style="cursor:pointer" data-accion="DEL"><span class="glyphicon glyphicon-trash" style="font-size:17px;"></span></a></div>',

                    '<input class="csshidTipoSubRecargo_' + c + '" type="hidden" id="hidTipoSubRecargo_' + c + '_' + j + '" name="DetallesItems[' + c + '].SubRecargos[' + j + '].TipoSubRecargo" value="' + tipoSubRecargo + '"/>' +
                    '<input class="csshidSubRecargoPorcentaje_' + c + '" type="hidden" id="hidSubRecargoPorcentaje_' + c + '_' + j + '" name="DetallesItems[' + c + '].SubRecargos[' + j + '].SubRecargoPorcentaje" value="' + subRecargoPorcentaje + '"/>' +
                    '<input class="csshidMontoSubRecargo_' + c + '" type="hidden" id="hidMontoSubRecargo_' + c + '_' + j + '" name="DetallesItems[' + c + '].SubRecargos[' + j + '].MontoSubRecargo" value="' + montoSubRecargo + '"/>' +
                    inputRecargoMonto +
                    '<span class="css' + idtblProducto + '">' + idtblProducto + '</span>'
                ]).draw(false);
                tblSubRecargo.row(tr).remove().draw();
            });

            c++;
        }
    } 
}

function updateModelValuesDetallesItemsSubDescuentos() {
    var c = 0;
    var rowIdx = $("#rowIdxDetallesItems").val();

    for (var i = 0; i < count_subdescuento; i++) {
        if ($("#idtblSubDescuento_" + i).length) {
            $("#idtblSubDescuento_" + i).html(c).attr("id", "idtblSubDescuento_" + c);
            $("#hidTipoSubDescuento_" + rowIdx + '_' + i).removeAttr("name").attr("name", "DetallesItems[" + rowIdx + "].SubDescuentos[" + c + "].TipoSubDescuento").attr("id", "hidTipoSubDescuento_" + rowIdx + '_' + c);
            $("#hidSubDescuentoPorcentaje_" + rowIdx + '_' + i).removeAttr("name").attr("name", "DetallesItems[" + rowIdx + "].SubDescuentos[" + c + "].SubDescuentoPorcentaje").attr("id", "hidSubDescuentoPorcentaje_" + rowIdx + '_' + c);
            $("#hidMontoSubDescuento_" + + rowIdx + '_' + i).removeAttr("name").attr("name", "DetallesItems[" + rowIdx + "].SubDescuentos[" + c + "].MontoSubDescuento").attr("id", "hidMontoSubDescuento_" + rowIdx + '_' + c);
             
            c++;
        }
    }
}

function updateModelValuesDetallesItemsSubRecargos() {
    var c = 0;
    var rowIdx = $("#rowIdxDetallesItems").val();

    for (var i = 0; i < count_subrecargo; i++) {
        if ($("#idtblSubRecargo" + i).length) {
            $("#idtblSubRecargo" + i).html(c).attr("id", "idtblSubRecargo" + c);
            $("#hidTipoSubRecargo_" + rowIdx + '_' + i).removeAttr("name").attr("name", "DetallesItems[" + rowIdx + "].SubRecargos[" + c + "].TipoSubRecargo").attr("id", "hidTipoSubRecargo_" + rowIdx + '_' + c);
            $("#hidSubRecargoPorcentaje_" + rowIdx + '_' + i).removeAttr("name").attr("name", "DetallesItems[" + rowIdx + "].SubRecargos[" + c + "].SubRecargoPorcentaje").attr("id", "hidSubRecargoPorcentaje_" + rowIdx + '_' + c);
            $("#hidMontoSubRecargo_" + + rowIdx + '_' + i).removeAttr("name").attr("name", "DetallesItems[" + rowIdx + "].SubRecargos[" + c + "].MontoSubRecargo").attr("id", "hidMontoSubRecargo_" + rowIdx + '_' + c);

            c++;
        }
    }
}

function ConfirmarEmisionComprobante() {
    tblSubDescuento.search("").draw();
    tblSubRecargo.search("").draw();

    swal({
        title: "",
        text: "<b>Se emitirá el comprobante a la DGII.<br>¿Está seguro de continuar?</b>",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: '#5cb85c',
        cancelButtonColor: '#d9534f',
        confirmButtonText: 'SÍ',
        cancelButtonText: 'NO',
        html: true,
    },
        function (isConfirm) {
            if (isConfirm) {
                IniciarLoading();
                $("#formEmisionComprobante").submit();
            }
            else {
                return false;
            }
        });
}

$('#btnEmisionXML').click(function (event) {
    event.preventDefault();
    var tipoComprobanteEDOC = 1; //DOCUMENTO
    var tipoArchivoEDOC = 1;
    var numDocumento = $("#txtNumDocumento").val();
    var rncEmisor = $("#rncEmisor").val();
     
    MostrarArchivoEmision(numDocumento, rncEmisor, tipoComprobanteEDOC, tipoArchivoEDOC);
});

$('#btnEmisionPDF').click(function (event) {
    event.preventDefault();
    var tipoComprobanteEDOC = 1; //DOCUMENTO
    var tipoArchivoEDOC = 2;
    var numDocumento = $("#txtNumDocumento").val();
    var rncEmisor = $("#rncEmisor").val();
      
    MostrarArchivoEmision(numDocumento, rncEmisor, tipoComprobanteEDOC, tipoArchivoEDOC);
});

$('#btnCerrarRespEmision').click(function (event) {
    if ($("#divRespuestaEmision").hasClass("alert-success")) {
        $("#formCancelarEmision").submit();
    }
});

function onSuccess(result) {
    DetenerLoading();
    $("#rncEmisor").val(result.rncEmisor);
    $("#divRespuestaEmision").removeClass().addClass(result.cssEstado);
    $("#hidEstadoEmision").val(result.estadoEmisionEDOC);
    $("#etiEstadoEmisionEDOC").html(result.nombreEstadoEmisionEDOC);
    $("#etiFechaAutorizacion").html(result.fechaAutorizacion);
    $("#linkUrlConsultaQR").html(result.urlConsultaQR).attr("href", result.urlConsultaQR); 
    $("#etiMensajeRespuesta").html(result.mensajeRespuesta);
    if (result.numDocumento)
        $("#txtNumDocumento").val(result.numDocumento);
    if ($("#divRespuestaEmision").hasClass("alert-success")) {
        $("#btnEmisionPDF").show();
        $("#btnEmisionXML").show();
    }
    else {
        $("#btnEmisionPDF").hide();
        $("#btnEmisionXML").hide();
    }
    $('#modal_RespuestaEmision').modal('show');
}

function OnFailure(result) {
    if (result.status == 500)
        MsgActionResultError(result.responseText);
    else if (result.status == 400) {
        if (result.responseJSON.numDoc) {
            $("#txtNumDocumento").val(result.responseJSON.numDoc);
        }
        MsgActionResultError(result.responseJSON.mensaje);
    }
    else
        window.location.href = result.responseText; 
} 

$("#txtTipoCambio").keyup(function () {  
    if (this.value > 999.9999) {
        this.value = null;
        MsgActionResultError("Valor máximo permitido 999.9999");
    }
});

