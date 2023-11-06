$(document).ready(function() {
    $('#review_widget_all_procedures').change(function() {
        allProcedures = this.value === 'true';
        $('#review-widget-procedures').css('display', allProcedures ? 'none' : 'initial');
    });
    $('form#new_review_widget').on('submit', function(e) {
        if (CKEDITOR.instances.account_log_note.getData().indexOf("To escape the textile markup") > 0) {
            CKEDITOR.instances.account_log_note.setData('');
        }
    });
    $(document).on('change', '#widget_location_procedure_set_id', function() {
        if (this.value == '') {
            $(".new-procedure-set-fields").css( "display", "table-row" );
        } else {
            $(".new-procedure-set-fields").css( "display", "none" );
        }
    })
});