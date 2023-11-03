$(document).ready(function(){
  $("#new-holiday-form #date").datepicker({ dateFormat: 'M dd, yy' }).val()
  $("#new-holiday-form .expander").click(function(){
    $("#date").val('')
    $("#name").val('')
  })
  $("#new-holiday-form").submit(function(){
    createHoliday($(this))
    return false
  })
  $("#holidays").on("click", ".edit", function(){
    generateEditHolidayForm($(this))
  })
  $("#holidays").on("click", ".cancel", function(){
    removeEditHolidayForm($(this))
  })
  $("#holidays").on("click", ".submit", function(){
    updateHoliday($(this))
  })
  $("#holidays").on("click", ".delete", function(){
    deleteHoliday($(this))
  })
})

function createHoliday(submitted){
  submitted.find(".expandable").hide()
  $.ajax({
    type: "POST",
    url: submitted.attr("action"),
    data: submitted.serialize(),
    success: function(newHoliday){
      if(newHoliday["errors"]){
        alert(newHoliday["errors"])
      } else {
        addNewHolidayRow(newHoliday)
      }
    }
  })
}

function generateEditHolidayForm(clicked){
  var row = clicked.closest("tr")
  var cells = row.find("td")
  row.find("td").addClass("hidden")
  row.append('<td><input name="name" type="text" value="' + cells.eq(0).text() + '"></td>')
  row.append('<td><input class="date" name="date" readonly="readonly" type="text" value="' + datePickerFromMDY(cells.eq(1).text()) + '"></td>')
  row.append('<td><span class="button submit">Submit</span> <span class="button cancel">Cancel</span></td>')
  row.find(".date").datepicker({ dateFormat: 'M dd, yy' }).val()
}

function removeEditHolidayForm(clicked){
  var row = clicked.closest("tr")
  row.find("td:not(.hidden)").remove()
  row.find("td").removeClass("hidden")
}

function updateHoliday(clicked){
  var row = clicked.closest("tr")
  var holidayId = row.data("holiday-id")
  $.ajax({
    type: "PUT",
    url: "/holidays/" + holidayId,
    data: row.find("input").serialize(),
    success: function(updatedHoliday){
      if(updatedHoliday["errors"]){
        alert(updatedHoliday["errors"])
      } else {
        removeEditHolidayForm(clicked)
        updateHolidayRow(row, updatedHoliday)
      }
    }
  })
}

function deleteHoliday(clicked){
  if(dataConfirmAlert(clicked)){
    var row = clicked.closest("tr")
    var holidayId = row.data("holiday-id")
    $.ajax({
      type: "DELETE",
      url: "/holidays/" + holidayId,
      success: function(deleted){
        if(deleted){
          row.remove()
        }
      }
    })
  }
}

function addNewHolidayRow(newHoliday){
  var newRow = $('<tr data-holiday-id="' + newHoliday["id"] + '"></tr>')
  newRow.append($("<td>" + newHoliday["name"] + "</td>"))
  newRow.append($("<td>" + dateFromRailsDate(newHoliday["date"]) + "</td>"))
  var controlCell = $("<td></td>")
  controlCell.append($('<span class="fake-link edit">Edit</span>'))
  controlCell.append(" | ")
  controlCell.append($('<span class="fake-link delete" data-confirm="Please confirm delete">Delete</span>'))
  newRow.append(controlCell)
  $("#holidays tbody").append(newRow)
}

function updateHolidayRow(row, updatedHoliday){
  var cells = row.find("td")
  cells.eq(0).text(updatedHoliday["name"])
  cells.eq(1).text(dateFromRailsDate(updatedHoliday["date"]))
}
