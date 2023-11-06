$(document).ready(function(){
  $(".request-day.show-form").click(function(){
    $(this).parent().children("form").removeClass('hidden')
    $(this).parent().children(".request-day.hide-form").removeClass('hidden')
    $(this).addClass('hidden')
  })

  $(".request-day.hide-form").click(function(){
    $(this).parent().children("form").addClass('hidden')
    $(this).parent().children(".request-day.show-form").removeClass('hidden')
    $(this).addClass('hidden')
  })

  $(".request-time-off").submit(function(){
    requestTimeOff($(this))
    return false
  })

  $("#single-employee-vacation-request").on("click", ".cancel", function(){
    cancelTimeOff($(this))
  })

  $(".request-approval").click(function(){
    emailApprovalRequest($(this))
  })
})

function requestTimeOff(submitted){
  var timeOffList = submitted.parent().find(".timesheet_times")
  $.ajax({
    type: "POST",
    url: "/vacation_requests/submit_request",
    data: submitted.serialize(),
    success: function(newSheet){
      if(newSheet["errors"]){
        alert(newSheet["errors"])
      } else {
        var sheetDiv = $("<div />", {
          'class': "timesheet_time " + STATUS_ID_TO_CLASS[newSheet["status_id"]]
        })
        var sheetText = "<div>" + newSheet['timesheet_type'] + ": " + formatReportFloat(newSheet['interval']/60) + " Hours</div>"
        var sheetCancel = '<i class="fa-solid fa-circle-xmark cancel" data-id="' + newSheet['id'] + '" data-type="' + newSheet['timesheet_type'].toLowerCase() + '" data-confirm="Cancel your time off request"></i>'
        sheetDiv.append(sheetText)
        sheetDiv.append(sheetCancel)
        timeOffList.append(sheetDiv)
      }
      submitted.parent().children(".request-day.hide-form").addClass('hidden')
      submitted.parent().children(".request-day.show-form").removeClass('hidden')
      submitted.addClass('hidden')
      updateTotalUserHours(newSheet["user_id"])
      toggleApprovalLink()
    }
  })
}

function cancelTimeOff(clicked){
  if(dataConfirmAlert(clicked)){
    var sheetId = clicked.data("id")
    var userId = clicked.closest("table").data("user-id")
    $.ajax({
      type: "DELETE",
      url: "/vacation_requests/cancel_request",
      data: { sheet_id: sheetId },
      dataType: 'json',
      success: function(deletedSheet){
        if(deletedSheet["errors"]){
          alert(deletedSheet["errors"])
        } else {
          clicked.parent().remove()
          updateTotalUserHours(userId)
          toggleApprovalLink()
        }
      }
    })
  }
}

function toggleApprovalLink(){
  var userId = $("#single-employee-vacation-request").data("user-id")
  var year   = $("#single-employee-vacation-request").data("year")
  var month  = $("#single-employee-vacation-request").data("month")
  $.ajax({
    type: "GET",
    url: "/vacation_requests/requested_count",
    data: { user_id: userId, year: year, month: month },
    success: function(count){
      if(count > 0){
        $(".request-approval").removeClass("hidden")
      } else {
        $(".request-approval").addClass("hidden")
      }
    }
  })
}

function emailApprovalRequest(clicked){
  if(dataConfirmAlert(clicked)){
    var userId = $("#single-employee-vacation-request").data("user-id")
    var year   = $("#single-employee-vacation-request").data("year")
    var month  = $("#single-employee-vacation-request").data("month")
    $.ajax({
      type: "GET",
      url: "/vacation_requests/email_pending_requests",
      data: { user_id: userId },
      success: function(manager){
        alert(manager["first_name"] + " " + manager["last_name"] + " has been emailed.")
      },
      error: function(){
        alert("Error: email not sent.")
      }
    })
  }
}

function updateTotalUserHours(userId){
  $.get(
    "/vacation_requests/total_user_hours",
    { user_id: userId },
    function(totalHours){
      $("." + userId + "-available-vacation-hours").text(formatReportFloat(totalHours['available']['vacation']))
      $("." + userId + "-available-sick-hours").text(formatReportFloat(totalHours['available']['sick']))
      $("." + userId + "-approved-vacation-hours").text(formatReportFloat(totalHours['approved']['vacation']))
      $("." + userId + "-approved-sick-hours").text(formatReportFloat(totalHours['approved']['sick']))
      $("." + userId + "-approved-lwop-hours").text(formatReportFloat(totalHours['approved']['lwop']))
      $("." + userId + "-requested-vacation-hours").text(formatReportFloat(totalHours['requested']['vacation']))
      $("." + userId + "-requested-sick-hours").text(formatReportFloat(totalHours['requested']['sick']))
      $("." + userId + "-requested-lwop-hours").text(formatReportFloat(totalHours['requested']['lwop']))
    }
  )
}
