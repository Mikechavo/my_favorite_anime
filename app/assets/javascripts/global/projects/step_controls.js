$(document).ready(function(){
  bindActionCandidateExpanders()
})

function bindActionCandidateExpanders(element){
  var actionCandidates
  var actionChoices
  if(element === undefined){
    actionCandidates = $(".action-candidates")
    actionChoices = $(".action-choice")
  } else {
    actionCandidates = $(element + " .action-candidates")
    actionChoices = $(element + " .action-choice")
  }
  actionCandidates.hide()
  actionChoices.find("input").prop("checked", false)
  actionChoices.click(function(){
    actionCandidates.hide()
    $(this).closest(".step-action").find(".action-candidates").show()
  })
}