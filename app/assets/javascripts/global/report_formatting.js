function numberChangeClass(number){
  var result
  if(number < 0){
    result = 'danger-color'
  } else if(number > 0){
    result = 'success-color'
  } else {
    result = ''
  }
  return result
}

function formatReportString(string){
  return string ? string : "-"
}

function capitalizeSentence(string){
  if(string){
    var words = string.split(" ")
    var capitalized = []
    words.forEach(function(word, index){
      caplitalized[index] = caplitalize(word)
    })
    return caplitalized.join(" ")
  }
}

function caplitalize(string){
  if(string){
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
  }
}

function buildFirstNameWithInitial(object, name_key){
  var first_name_key = name_key + "_first_name"
  var last_name_key = name_key + "_last_name"
  return object && object[last_name_key] ? object[first_name_key] + " " + object[last_name_key][0].toUpperCase() : "-"
}

function formatReportFloat(float, blank){
  var jsFloat = parseFloat(float)
  if(isNaN(jsFloat) || jsFloat === 0){
    return blank || '-'
  }
  else {
    return jsFloat.toFixed(2)
  }
}
