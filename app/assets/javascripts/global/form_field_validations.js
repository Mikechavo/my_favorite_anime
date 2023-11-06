$(document).ready(function(){
  $(".validate-form").on("submit", function(form){
    var alertString = ""
    $(".validate-form .validate-max-length").each(function(){
      var label = $("label[for='"+$(this).attr('id')+"']").text()
      var maxLength = $(this).data("max-length")
      if( $(this).val().length > maxLength ){
        alertString += label + " must be less than or equal to " + maxLength + " characters"
      }
    })

    if(alertString !== ""){
      alert(alertString)
      form.preventDefault(); form.stopImmediatePropagation();
    }
  })
})
