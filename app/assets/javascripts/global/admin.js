$(document).ready(function() {
    $("#days_processing").change(function() {
        var days = $(this).val();
        $(location).attr('href', '?days=' + days);
    });
});