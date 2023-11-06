$(document).ready(function(){
  $(".vacation-requests-day-manager").on("click", "#show-new-sheet", function(){
    $(this).closest("div").addClass("hidden")
    $("#new-vacation-request-form").removeClass("hidden")
  })
  $(".vacation-requests-day-manager").on("click", "#hide-new-sheet", function(){
    hideNewSheetForm()
  })
  $(".vacation-requests-day-manager").on("click", "#day-vacation-requests .toggle-sheet", function(){
    toggleVacationSheet($(this))
  })
  $(".vacation-requests-day-manager").on("submit", "#new-vacation-request", function(){
    createVacationSheet($(this))
    return false
  })
  $(".vacation-requests-day-manager").on("submit", "#update-vacation-request", function(){
    updateVacationSheet($(this))
    return false
  })
  $(".vacation-requests-day-manager").on("click", "#day-vacation-requests .delete-sheet", function(){
    deleteVacationSheet($(this))
  })
  $(".vacation-requests-day-manager").on("click", "#day-vacation-requests .edit-sheet", function(){
    createVacationSheetFields($(this))
  })
  $(".vacation-requests-day-manager").on("click", "#day-vacation-requests .cancel-edit-sheet", function(){
    removeVacationSheetFields($(this))
  })
})

function toggleVacationSheet(clicked){
  var row = clicked.closest("tr")
  var sheetId = row.data("sheet-id")
  var status = row.find("td").eq(2).text()
  var scheduleAppointments = false
  if(status === 'Not Approved'){
    scheduleAppointments = requestAppointment()
  }
  $.ajax({
    type: "PUT",
    url: "/vacation_requests/toggle_request",
    data: { sheet_id: sheetId, schedule_appointments: scheduleAppointments },
    dataType: "json",
    success: function(updatedSheet){
      updateVacationSheetRow(updatedSheet, row)
      updateMainTimeOffTableRow(row.data("user-id"))
    }
  })
}

function hideNewSheetForm(){
  $("#show-new-sheet").closest("div").removeClass("hidden")
  $("#new-vacation-request-form").addClass("hidden")
}

function createVacationSheet(submitted){
  $.ajax({
    type: "POST",
    url: "/vacation_requests/submit_request",
    data: submitted.serialize(),
    dataType: "json",
    success: function(newSheet){
      newRow = createNewVacationSheetRow(newSheet)
      updateVacationSheetRow(newSheet, newRow)
      updateMainTimeOffTableRow(newRow.data("user-id"))
    }
  })
}

function updateVacationSheet(submitted){
  var formSubmit = submitted.find('input[type="submit"]')
  var row = formSubmit.closest("tr")
  var sheetId = row.data("sheet-id")
  $.ajax({
    type: "PUT",
    url: "/vacation_requests/update_request",
    data: submitted.serialize(),
    dataType: "json",
    success: function(updatedSheet){
      removeVacationSheetFields(formSubmit)
      updateVacationSheetRow(updatedSheet, row)
      updateMainTimeOffTableRow(row.data("user-id"))
    }
  })
}

function deleteVacationSheet(clicked){
  if(dataConfirmAlert(clicked)){
    var row = clicked.closest("tr")
    var sheetId = row.data("sheet-id")
    $.ajax({
      type: "DELETE",
      url: "/vacation_requests/cancel_request",
      data: { sheet_id: sheetId },
      dataType: "json",
      success: function(deletedSheet){
        removeVacationSheetRow(deletedSheet, row)
        updateMainTimeOffTableRow(row.data("user-id"))
      }
    })
  }
}

function createNewVacationSheetRow(newSheet){
  if(newSheet["errors"]){
    alert(newSheet["errors"])
  } else {
    var newRow = $('<tr class="' + STATUS_ID_TO_CLASS[newSheet["status_id"]] + '" data-sheet-id="' + newSheet["id"] + '" data-user-id="' + newSheet["user_id"] + '"></tr>')
    newRow.append("<td></td>")
    newRow.append("<td></td>")
    newRow.append("<td></td>")
    newRow.append('<td><span class="fake-link toggle-sheet"></span> | <span class="fake-link delete-sheet" data-confirm="Please Confirm Reject">Reject</span></td>')
    $("#day-vacation-requests tbody").append(newRow)
    hideNewSheetForm()
    return newRow
  }
}

function createVacationSheetFields(clicked){
  // do not generate fields if already present
  if($(".cancel-edit-sheet").length === 0){
    var row         = clicked.closest("tr")
    var sheetId     = row.data("sheet-id")
    var sheetCells  = row.find("td")
    var sheetHours  = sheetCells.eq(0).text()
    var sheetType   = sheetCells.eq(1).text()
    var sheetStatus = sheetCells.eq(2).text()
    row.find("td").addClass("hidden")
    row.append('<td><input type="number" min="0" name="hours" value="' + sheetHours + '" step="0.01"></td>')
    var typeOptions = $("<td></td>")
    typeOptions.append(buildSelectOptions("timesheet_type", [["Vacation", "Vacation"], ["Sick", "Sick"], ["LWOP", "LWOP"]], sheetType))
    row.append(typeOptions)
    var statusOptions = $("<td></td>")
    statusOptions.append(buildSelectOptions("status_id", [["Approved", 7], ["Not Approved", 8]], sheetStatus))
    row.append(statusOptions)
    var formControls = $("<td></td>")
    formControls.append('<input type="hidden" value="' + sheetId + '" name="sheet_id">')
    formControls.append('<input class="button" name="commit" type="submit" value="Update">')
    formControls.append('<span class="button cancel-edit-sheet">Cancel</span>')
    row.append(formControls)
  }
}

function removeVacationSheetFields(clicked){
  var row = clicked.closest("tr")
  row.find("td:not(.hidden)").remove()
  row.find("td").removeClass("hidden")
}

function buildSelectOptions(name, options, selected){
  var select = $('<select name="' + name + '"></select>')
  options.forEach(function(option){
    if(selected === option[0] || selected === option[1]){
      select.append('<option value="' + option[1] + '" selected>' + option[0] + '</option>')
    } else {
      select.append('<option value="' + option[1] + '">' + option[0] + '</option>')
    }
  })
  return select
}

function removeVacationSheetRow(sheet, row){
  if(sheet["errors"]){
    alert(sheet["errors"])
  } else {
    row.remove()
  }
}

function updateVacationSheetRow(sheet, row){
  if(sheet["errors"]){
    alert(sheet["errors"])
  } else {
    var toggleName = "Approve"
    var rowClass = STATUS_ID_TO_CLASS[sheet["status_id"]]
    if(sheet["status_id"] === 7){
      toggleName = "Revert"
    }
    if(row.find("td.hidden").length > 0){
      row.find("td:not(.hidden)").remove()
    }
    row.removeClass()
    row.addClass(rowClass)
    var rowCells = row.find("td")
    rowCells.removeClass("hidden")
    rowCells.eq(0).text(formatReportFloat(sheet["interval"]/60))
    rowCells.eq(1).text(sheet["timesheet_type"])
    rowCells.eq(2).text(sheet["status_name"])
    rowCells.eq(3).find(".toggle-sheet").text(toggleName)
  }
}

function updateMainTimeOffTableRow(userId){
  if($("#vacation-requests-manager").length > 0){
    var year   = $("#vacation-requests-manager").data("year")
    var month  = $("#vacation-requests-manager").data("month")
    $.ajax({
      type: "GET",
      url: "/vacation_requests/manage_user_row",
      data: { user_id: userId, year: year, month: month },
      dataType: "script"
    })
  }
}

function requestAppointment(){
  return confirm('Send Outlook Appointment?')
}
