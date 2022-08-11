
$(".select2").select2();

$('.select2bs4').select2({
    theme: 'bootstrap4',
    minimumResultsForSearch: Infinity,
});

$('.select2bs4-nosearch').select2({
    allowClear: true,
    theme: 'bootstrap4',
    minimumResultsForSearch: Infinity,
    language: "es"
});

$('.datepicker').datepicker({
    format: 'dd-mm-yyyy',
    language: 'es',
    autoclose: 1,
    todayHighlight: true,
    clearBtn: true,
    /*todayBtn: "linked"*/
});


$('#DataTable').DataTable({
    "paging": true,
    "lengthChange": false,
    "searching": false,
    "ordering": true,
    "info": true,
    "autoWidth": false,
    "responsive": true,
});

function checkControlRequeriedTABS() {

    $('button[type="submit"].btn-primary , #btnSubmit').click(function () {
        $(':required:invalid').each(function () {

            // Find the tab-pane that this element is inside, and get the id
            var $closest = $(this).closest('.tab-pane');
            var id = $closest.attr('id');

            // Find the link that corresponds to the pane and have it show
            $('.nav a[href="#' + id + '"]').tab('show');

            // Only want to do it once
            return false;
        });
    });
}

function ConfirmacionCancelar(submit) {
    event.preventDefault();

    swal({
        title: "",
        text: "<b>Se borraran los datos ingresados.<br> ¿Está seguro de continuar?</b>",
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
                $("#" + submit).submit();
            }
            else {
                return false;
            }
        });
}


$('.isdecimal').maskMoney({
    thousands: ',',
    allowNegative: false,
    decimal: '.',
    precision: 0,
    allowZero: false
});

$('.isdecimal2').maskMoney({
    thousands: ',',
    allowNegative: false,
    decimal: '.',
    precision: 2,
    allowZero: false
});

$('.isdecimal4').maskMoney({
    thousands: ',',
    allowNegative: false,
    decimal: '.',
    precision: 4,
    allowZero: true
});

$.extend(true, $.fn.dataTable.defaults, {
    "responsive": true,
    "processing": true,
    "serverSide": true,
    "scrollX": true,
    "dom": "Btpir", //f para filtro
    "pageLength": 10,
    "data": null,
    "language": {
        "decimal": ",",
        "thousands": ".",
        "info": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
        "infoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
        "infoPostFix": "",
        "infoFiltered": "(filtrado de un total de _MAX_ registros)",
        "loadingRecords": "Cargando...",
        "lengthMenu": "Mostrar _MENU_ registros",
        "paginate": {
            "first": "Primero",
            "last": "Último",
            "next": "Siguiente",
            "previous": "Anterior"
        },
        "processing": "'<div><i class='glyphicon glyphicon-repeat fast-right-spinner'></i>Procesando...</div>",
        "search": "Buscar:",
        "searchPlaceholder": "Término de búsqueda",
        "zeroRecords": "No se encontraron resultados",
        "emptyTable": "Ningún dato disponible en esta tabla",
        "aria": {
            "sortAscending": ": Activar para ordenar la columna de manera ascendente",
            "sortDescending": ": Activar para ordenar la columna de manera descendente"
        },
        //only works for built-in buttons, not for custom buttons
        "buttons": {
            "create": "Nuevo",
            "edit": "Cambiar",
            "remove": "Borrar",
            "copy": "Copiar",
            "csv": "fichero CSV",
            "excel": "tabla Excel",
            "pdf": "documento PDF",
            "print": "Imprimir",
            "colvis": "Visibilidad columnas",
            "collection": "Colección",
            "upload": "Seleccione fichero...."
        },
        "select": {
            "rows": {
                _: '%d filas seleccionadas',
                0: 'clic fila para seleccionar',
                1: 'una fila seleccionada'
            }
        }
    }
});