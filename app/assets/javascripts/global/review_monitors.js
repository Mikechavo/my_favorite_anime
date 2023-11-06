$(document).ready( function() {
    $('body').on('click', '.open-results', function() {
        index = $(this).data('index');
        showResults($(this).data('index'));
    }).on('click', '.hide-results', function() {
        index = $(this).data('index');
        hideResults(index);
    }).on('mouseover', '.manual-address-flag-checked', function() {
        $(this).css('color', 'red').addClass('fa-square').removeClass('fa-square-check');
    }).on('mouseout', '.manual-address-flag-checked', function() {
        $(this).css('color', 'green').addClass('fa-square-check').removeClass('fa-square');
    }).on('mouseover', '.manual-address-flag-unchecked', function() {
        $(this).css('color', 'green').addClass('fa-square-check').removeClass('fa-square');
    }).on('mouseout', '.manual-address-flag-unchecked', function() {
        $(this).css('color', 'red').addClass('fa-square').removeClass('fa-square-check');
    }).on('click', '.manual-address-flag-checked', function() {
        account_id = $(this).data('account-id');
        profile_id = $(this).data('profile-id');
        $.ajax({
            type: "PUT",
            dataType: "json",
            url: '/accounts/'+account_id+'/review_profiles/'+profile_id+'/flag_address',
            contentType: 'application/json',
            data: JSON.stringify({ correct_address_manual: false, _method:'put' })
        });
        $(this).css('color', 'red').addClass('manual-address-flag-unchecked fa-square').removeClass('manual-address-flag-checked fa-square-check')
    }).on('click', '.manual-address-flag-unchecked', function() {
        account_id = $(this).data('account-id');
        profile_id = $(this).data('profile-id');
        $.ajax({
            type: "PUT",
            dataType: "json",
            url: '/accounts/'+account_id+'/review_profiles/'+profile_id+'/flag_address',
            contentType: 'application/json',
            data: JSON.stringify({ correct_address_manual: true, _method:'put' })
        });
        $(this).css('color', 'green').addClass('manual-address-flag-checked fa-square-check').removeClass('manual-address-flag-unchecked fa-square')
    });
    $('.results-count').click( function(event) {
        event.preventDefault();
        index = $(this).data('index');
        if ($(this).hasClass('closed')) {
            showResults(index);
        } else {
            hideResults(index);
        }
    });
    function showResults(index) {
        $("#result" + index).show();
        plus = $("#plus" + index);
        plus.removeClass('fa-plus');
        plus.removeClass('open-results');
        plus.addClass('fa-minus');
        plus.addClass('hide-results');
        $('.results-count').addClass('opened').removeClass('closed');
        $("#profiles" + index).css('border-bottom', 'none');
    }
    function hideResults(index) {
        $("#result" + index).hide();
        plus = $("#plus" + index);
        plus.removeClass('fa-minus');
        plus.removeClass('hide-results');
        plus.addClass('fa-plus');
        plus.addClass('open-results');
        $('.results-count').addClass('closed').removeClass('opened');
        $("#profiles" + index).css('border-bottom', '1px solid #ccc');
    }
    $(".social-media-dropdown").change( function() {
        sm_type = $(this).attr('data-sm-type');
        hidden_field = $("#" + sm_type + "-hidden-field");
        if ($(this).val() === 'true') {
            hidden_field.attr('name', 'services[' + sm_type + '][included][]');
        } else {
            hidden_field.attr('name', 'services[' + sm_type + '][not_included][]');
        }
    });
    // editing qc status on review_monitors/list
    $('.qc-status.selectable_field').dblclick(function() {
        if($(this).children(".qc-status-form").is(':hidden')) {
            $(this).children(".qc-status-text").hide();
            $(this).children(".qc-status-form").show();
        }
    });
    $('form.edit_review_monitor').on("ajax:success", function(){
        var newStatus = $(this).find('option:selected').text();
        $(this).closest('td').find('.qc-status-text').text(newStatus);
        $(this).closest('td').find(".qc-status-text").show();
        $(this).closest('td').find(".qc-status-form").hide();
    });
    $('.cancel-edit-qc-status').click(function(event) {
        event.preventDefault();
        $(this).closest('td').find(".qc-status-text").show();
        $(this).closest('td').find(".qc-status-form").hide();
    });
});