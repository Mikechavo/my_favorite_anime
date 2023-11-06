$(document).ready(function(){
  // closed project report
  if($('#closed-project-time-totals').length > 0){
    $('#closed-project-time-totals').submitWithAjax()

    $('.button').click(function(){
      var fromMonth = parseInt($('#from_month').val())
      var toMonth = parseInt($('#to_month').val())
      var fromYear = parseInt($('#from_year').val())
      var toYear = parseInt($('#to_year').val())
      var checkedTypes = $('input:checked')

      if(checkedTypes.length === 0){
        alert('Please select at least one project type.');
        return false
      }

      if(fromYear > toYear){
        $('#small_loading').hide()
        alert('Invalid date range.')
        return false
      } else if((fromMonth > toMonth) && (fromYear === toYear)){
        $('#small_loading').hide()
        alert('Invalid date range.')
        return false
      } else {
        $('#small_loading').show()
      }
    })
  }
})

