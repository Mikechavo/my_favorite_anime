$(document).ready(function() {
    $("#page_status").change(function() {
        var status = $(this).val();
        $(location).attr('href', '?status=' + status);
    });
});