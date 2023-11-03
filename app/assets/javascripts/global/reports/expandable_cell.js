$(document).ready(function(){
  $(".expandable-cell").on("click", function(){
    var hiddenDiv = $(this).children("div")
    var isHidden = hiddenDiv.attr("class").includes("hidden")
    if(isHidden){
      hiddenDiv.removeClass("hidden")
    } else {
      hiddenDiv.addClass("hidden")
    }
  })
})
