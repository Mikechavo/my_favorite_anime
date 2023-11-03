$(document).ready(function() {
  bindSubmitFilters()
  bindDatepicker()
});

function bindSubmitFilters(element){
  var submitFilters
  
  if(element === undefined){
    submitFilters = $(".submit-filter")
  } else {
    submitFilters = $(element + " " + ".submit-filter")
  }
  
  submitFilters.each(function(index, filter){
    var filter_status = $(filter)
    displaySortFilterLabel(filter_status, filter_status[0].options)
  })
  
  submitFilters.change(function() {
    $(this).closest("form").submit();
  });
}

function displaySortFilterLabel(filter, filterOptions) {
  if(filterOptions){
    for (var i = 0; i < filterOptions.length; i++) {
      if (filter.find('option:selected').text() === filterOptions[i].text) {
        filterOptions[i].text = filter.data("label") + filter.find('option:selected').text();
      }
    }
  }
}

function bindDatepicker(element){
  var datepickers
  if(element === undefined){
    datepickers = $(".jsDatepicker")
  } else {
    datepickers = $(element + " .jsDatepicker")
  }
  var railsDate
  var datepickerDate
  datepickers.each(function(){
    // format rails formatted date for datepicker
    railsDate = $(this).val()
    if(railsDate.includes("/")){
      datepickerDate = datePickerFromMDY(railsDate)
      $(this).val(datepickerDate)
    }
    // disable autocomplete
    $(this).attr("autocomplete", "off")
  })
  datepickers.datepicker({ dateFormat: "M dd, yy", changeMonth: true, changeYear: true, yearRange: "2004:+10" }).val()
}
