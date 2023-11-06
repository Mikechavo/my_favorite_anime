function bindForceAccountNumber(){
  var accountField = $('#project_account_number');
  var projectAccountNumber = accountField.val()
  var onProjectView = projectAccountNumber === ''
  $('#project_type').on("change", function() {
    $.get("/projects/prefill_account_number", { type: $(this).val(), account: projectAccountNumber }, function(data){
      var newAccount = data["forced_account"] || data["account"]
      var setReadonly = newAccount ? 'readonly' : false
      accountField.attr('readonly', setReadonly)
      accountField.val(newAccount).trigger('change');
    });
  });
}

function bindFetchAccountSites(){
  $('#project_account_number').on('input change', function(){
    var url = "/projects/load_sites_field?account_number=" + $("#project_account_number").val() + "&"+"project_type=" + $('#project_type').val();
    $.get(url, function (data) {
      $('#sites-field').html(data);
    });
  });
  $('#project_account_number').trigger('change');
}
