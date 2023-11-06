$(document).ready(function(){
  var csvFormat = '<input class="csv-input" type="hidden" name="format" value="csv"></input>'
  $(".export-csv-link").click(function(){
    var parentForm = $(this).parent()
    parentForm.append(csvFormat)
    parentForm.submit()
    $(".csv-input").remove()
  })
})