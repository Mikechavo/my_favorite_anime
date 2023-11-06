function bindDbUserValidations(){
  $(".dashboard-user-record").on('submit', function() {
    if(!dbUserEmailValid()){
      alert('Email must be valid')
      return false;
    }
  });
}

function bindDbUserPermissionValidations(){
  $(".dashboard-user-permissions").closest("form").on("submit", function(){
    if(!permissionsCheckedValid()) {
      alert('A review group or review monitor must be selected')
      return false
    }
  })
}

function dbUserEmailValid(){
  var email = $('#dashboard_user_email').val()
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

function permissionsCheckedValid(){
  // for each dashboard user permission section
  // fail if there are no permissions
  var isValid = $(".dashboard-user-permissions").length > 0
  // not checking specific permissions if admin is checked
  var permissionNotRequired = $(".account-admin:checked").length > 0
  if(!permissionNotRequired){
    var groupOrMonitorChecked
    $(".dashboard-user-permissions").each(function(){
      // fail if no groups or monitors are checked
      groupOrMonitorChecked = $(this).find(".group-permissions, .monitor-permissions").find("input:checked").length > 0 
      if(!groupOrMonitorChecked){
        isValid = false
      }
    })
  }
  return isValid
}

function bindDbUserPermissionsControls(element_id){
  bindAdminToggling(element_id)
  bindClientToggling(element_id)
  bindSubPermissionToggling(element_id)
  bindPermissionRemoval(element_id)
}

function bindAdminToggling(element_id){
  $("#" + element_id + " " + ".account-admin").change(function(){
    var isChecked = this.checked
    // when admin is toggled, match other inputs to it
    $(this).closest(".dashboard-user-permissions").find('.group-permissions input, .monitor-permissions input').prop("checked", isChecked)
    if(isChecked){
      // turn off client if admin is on
      $(this).closest(".account-permissions").find(".account-client").prop("checked", false)
    }
  })
}

function bindClientToggling(element_id){
  $("#" + element_id + " " + ".account-client").change(function(){
    var isChecked = this.checked
    if(isChecked){
      // when client is turned on, turn off admin
      $(this).closest(".account-permissions").find(".account-admin").prop("checked", false)
    } else {
      // when client is turned off, if admin is also off, turn off all sub permissions
      var adminIsOn = $(this).closest(".account-permissions").find(".account_admin").checked
      if(!adminIsOn){
        $(this).closest(".dashboard-user-permissions").find('.group-permissions input, .monitor-permissions input').prop("checked", false)
      }
    }
  })
}

function bindSubPermissionToggling(element_id){
  $("#" + element_id + " " + ".group-permissions input, .monitor-permissions input").change(function(){
    var admin = $(this).closest(".dashboard-user-permissions").find(".account-admin")
    var client = $(this).closest(".dashboard-user-permissions").find(".account-client")
    if(this.checked){
      // when sub option is turned on, if admin and client are both off turn on client
      if(!admin.checked && !client.checked){
        client.prop("checked", true)
      }
    } else {
      // when sub option is turned off, turn off admin and turn on client
      admin.prop("checked", false)
      client.prop("checked", true)
    }
  })
}

function bindPermissionRemoval(element_id){
  $("#" + element_id + " " + ".remove-permissions" ).click(function(){
    $(this).closest(".dashboard-user-permissions").remove()
    return false
  })
}