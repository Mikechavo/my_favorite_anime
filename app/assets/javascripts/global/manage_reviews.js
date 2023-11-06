$(document).ready(function() {
    $('select.submit-filter#review_monitor_id').change(function() {
        event.preventDefault();
        $('select.submit-filter#review_profile_id option[value=""]').prop("selected", true);
        $(this).closest("form").submit();
    })
})