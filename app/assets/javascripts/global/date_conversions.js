const MONTH_NAMES = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ]

function dateFromRailsDate(string, options){
  var results
  if(string === null){
    results = '-'
  } else {
    var year  = string.slice(2,4)
    var month = string.slice(5,7)
    var day   = string.slice(8,10)
    var results = month + "/" + day + "/" + year
    if(options){
      if(options["withTime"]){
        results = results + " " + militaryToStandardTime(string.slice(11, 16))
      }
    }
  }
  return results
}

function militaryToStandardTime(string){
  if(string){
    var minutes = string.slice(3, 5)
    var hoursMilitary = parseInt(string.slice(0, 2))
    var hours   = hoursMilitary % 12 === 0 ? 12 : hoursMilitary % 12
    var hoursString = hours < 10 ? "0" + hours : hours
    var amPm    = hoursMilitary > 11 ? 'PM' : 'AM'
    return hoursString + ":" + minutes + " " + amPm
  }
}

function datePickerFromMDY(string){
  var year  = "20" + string.slice(6,8)
  var month = parseInt(string.slice(0,2))-1
  var day   = string.slice(3,5)
  return MONTH_NAMES[month].substr(0,3) + " " + day + ", " + year
}
