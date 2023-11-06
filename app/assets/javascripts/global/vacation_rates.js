$(document).ready(function(){
  $("#vacation-rates").on("click", ".delete-vacation-rate", function(){
    deleteVacationRate($(this))
  })

  $("#vacation-rates").on('click', '#add-vacation-rate span', function(){
    $.ajax({
      type: "GET",
      url: "/vacation_rates/user_options",
      dataType: 'json',
      success: function(results){
        $("#add-vacation-rate").addClass('hidden')
        $("#add-vacation-rate-fields").removeClass('hidden')
        var upgradeTierCell = $('<td></td>')
        upgradeTierCell.append(buildOptionsFromObjects(results["vacation_rates"], "new[upgrade_id]", "tier", "id", null))
        $("#upgrade_vacation_rate_options").append(upgradeTierCell)
      }
    })
  })

  $("#add-vacation-rate-fields").on("click", 'span', function(){
    clearAndHideForm($("#add-vacation-rate-fields"), $("#add-vacation-rate"))
  })
  $("#add-vacation-rate-form").submit(function(){
    newVacationRate($(this))
    return false;
  })
  $("#update-rates-form").submit(function(){
    updateVacationRate($(this))
    return false;
  })
  $("#vacation-rates").on("click", ".edit-vacation-rate", function(){
    createVacationRateFields($(this))
  })
  $("#vacation-rates").on("click", ".cancel-edit-rate", function(){
    toggleOffFormFieldsRow($(this).closest("tr"))
  })
})

function toggleOffFormFieldsRow(row){
  row.find("td:not(.hidden)").remove()
  row.find("td").removeClass("hidden")
}

function createVacationRateFields(clicked){
  if($(".cancel-edit-rate").length === 0){
    $.ajax({
      type: "GET",
      url: "/vacation_rates/user_options",
      dataType: 'json',
      success: function(results){
        row = clicked.closest("tr")
        var rateId = row.data("rate-id")
        var rateTier = readAttributeCell(row, "tier")
        var rateHours = readAttributeCell(row, "hours", "number")
        var rateCap = readAttributeCell(row, "cap", "number")
        var upgradeTier = readAttributeCell(row, "upgrade_tier")
        row.find("td").addClass("hidden")
        row.append('<td><input type="text" name="update[tier]" value="' + rateTier + '"></td>')
        row.append('<td><input type="number" name="update[hours]" value="' + rateHours + '" step="0.01"></td>')
        row.append('<td><input type="number" name="update[cap]" value="' + rateCap + '" step="0.01"></td>')
        var upgradeTierCell = $('<td></td>')
        upgradeTierCell.append(buildOptionsFromObjects(results["vacation_rates"], "update[upgrade_id]", "tier", "id", upgradeTier))
        row.append(upgradeTierCell)
        row.append('<td nowrap><input type="submit" class="button" value="Update"> <span class="button cancel-edit-rate">Cancel</span><input type="hidden" name="update[id]" value="' + rateId + '"></td>')
      }
    })
  }
}

function newVacationRate(rateForm){
  $.ajax({
    type: "POST",
    url: "/vacation_rates",
    data: rateForm.serialize(),
    success: function(newRate){
      if(newRate["errors"]){
        alert(newRate["errors"])
      }
      else {
        var newRow = $('<tr data-rate-id="' + newRate["id"] + '"></tr>')
        newRow.append('<td data-wants="tier"></td>')
        newRow.append('<td class="numbers" data-wants="hours"></td>')
        newRow.append('<td class="numbers" data-wants="cap"></td>')
        newRow.append('<td data-wants="upgrade_tier"></td>')
        newRow.append('<td><span class="fake-link edit-vacation-rate">Edit</span> | <span class="fake-link delete-vacation-rate" data-confirm="Please Confirm Delete">Delete</span></td>')
        updateVacationRateRow(newRate, newRow)
        $("#vacation-rates").append(newRow)
        clearAndHideForm($("#add-vacation-rate-fields"), $("#add-vacation-rate"))
      }
    }
  })
}

function updateVacationRate(rateForm){
  var submittedRow = rateForm.find('input[type="submit"]').closest("tr")
  $.ajax({
    type: "POST",
    url: "/vacation_rates/update_rates",
    data: rateForm.serialize(),
    success: function(updatedRate){
      if(updatedRate["errors"]){
        alert(updatedRate["errors"])
      }
      else {
        toggleOffFormFieldsRow(submittedRow)
        updateVacationRateRow(updatedRate, submittedRow)
      }
    }
  })
}

function updateVacationRateRow(newRate, row){
  fillAttributeCell(row, newRate, "string", "tier")
  fillAttributeCell(row, newRate, "float", "hours")
  fillAttributeCell(row, newRate, "float", "cap")
  fillAttributeCell(row, newRate, "string", "upgrade_tier")
}

function clearAndHideForm(formFields, toggleControl){
  formFields.find(':input:not(:submit)').each(function(){
    $(this).val('')
  })
  $("#upgrade_vacation_rate_options").empty()
  formFields.addClass('hidden')
  toggleControl.removeClass('hidden')
}

function deleteVacationRate(clicked){
  if(dataConfirmAlert(clicked)){
    var row = clicked.closest("tr")
    var rateId = row.data("rate-id")
    $.ajax({
      type: "DELETE",
      url: "/vacation_rates/" + rateId,
      success: function(rateDeleted){
        if(rateDeleted["errors"]){
          alert(rateDeleted["errors"])
        }
        else {
          clicked.closest("tr").remove()
        }
      }
    })
  }
}

function dataConfirmAlert(clicked){
  if(clicked.data("confirm") === undefined){
    return true
  }
  else {
    return confirm(clicked.data("confirm"))
  }
}
