function buildDateSelect(objectName, fieldName, currentDate){
  var selected
  var selectedMonth = parseInt(currentDate.slice(0, 2))
  var selectedDay = parseInt(currentDate.slice(3, 5))
  var selectedYear = parseInt("20" + currentDate.slice(6, 8))
  var dateContainer = $("<div></div>")
  var monthOptions = $('<select name="' + objectName + "[" + fieldName + '(2i)]"></select>')
  MONTH_NAMES.forEach(function(name, index){
    selected = index+1 === selectedMonth ? " selected" : ""
    monthOptions.append('<option value="' + (index+1) + '"' + selected + '>' + name + '</option>')
  })
  var dayOptions = $('<select name="' + objectName + "[" + fieldName + '(3i)]"></select>')
  for(i = 0; i < 31; ++i){
    selected = i+1 === selectedDay ? " selected" : ""
    dayOptions.append('<option value="' + (i + 1) + '"' + selected + '>' + (i + 1) + '</option>')
  }
  var yearOptions = $('<select name="' + objectName + "[" + fieldName + '(1i)]"></select>')
  for(i = 2005; i <= (new Date().getFullYear()); ++i){
    selected = i === selectedYear ? " selected" : ""
    yearOptions.append('<option value="' + i + '"' + selected + '>' + i + '</option>')
  }
  dateContainer.append(monthOptions)
  dateContainer.append(dayOptions)
  dateContainer.append(yearOptions)
  return dateContainer
}

function buildOptionsFromObjects(objects, name, textKey, valueKey, selected){
  var selectOptions = $('<select name="' + name + '"></select>')
  selectOptions.append('<option value>None</option>')
  objects.forEach(function(object){
    if(object[textKey] === selected){
      selectOptions.append('<option value="' + object[valueKey] + '" selected>' + object[textKey] + '</option>')
    } else {
      selectOptions.append('<option value="' + object[valueKey] + '">' + object[textKey] + '</option>')
    }
  })
  return selectOptions
}

function readAttributeCell(row, attributeName, dataType){
  var cellText = row.find('td[data-wants="' + attributeName + '"]').text()
  if(dataType === 'number'){
    cellText = parseFloat(cellText) || 0
  }
  return cellText
}

function fillAttributeCell(row, model, dataType, attributeName, prefix){
  var newData = model[attributeName]
  var formattedData = formatAttributeData(newData, dataType)
  if(formattedData === undefined){ formattedData = "-" }
  row.find('td[data-wants="' + getDataName(attributeName, prefix) + '"]').text(formattedData)
}

function formatAttributeData(newData, dataType){
  var formattedData
  if(dataType === "float"){
    formattedData = formatReportFloat(newData)
  } else if(dataType === "date"){
    formattedData = dateFromRailsDate(newData)
  } else {
    formattedData = formatReportString(newData)
  }
  return formattedData
}

function getDataName(attributeName, prefix){
  var dataName
  if(prefix === undefined){
    dataName = attributeName
  } else {
    dataName = prefix + "_" + attributeName
  }
  return dataName
}

// methods to add and remove <li> inputs for array processing in controllers
function bindAddListItem(target){
  $(target).on("click", ".add-list-item", function(){
    var fieldTimestamp = Date.now()
    var itemName = $(this).data('item-name')
    var fieldName = itemName + "[" + fieldTimestamp + "]"
    var itemField = "<li><input type='text' name='" + fieldName + "'><span class='fake-link remove-list-item'>Remove</span></li>"
    $(target).find("ul[data-item-name='" + itemName + "']").append(itemField)
    return false
  })
}

function bindRemoveListItem(target){
  $(target).on("click", ".remove-list-item", function(){
    $(this).closest("li").remove()
  })
}


function flashElem(flashTarget, color='yellow'){
    // clear any existing listener and transition style before trying new transition
    flashTarget.off('transitionend')
    flashTarget.css('transition', '')

    // after last transition is over
    flashTarget.on('transitionend', () => {
        // remove listener and transition style so flash can be refired
        flashTarget.off('transitionend')
        flashTarget.css('transition', '')
    })

    let flashStyles = [
        ['background-color', color],
        ['transition', 'background-color ease 1s'],
        ['background-color', '']
    ]

    let applyFlashStyle = (i, styles, target) => {
        let style = styles[i]
        target.css(...style)
        i++
        if(styles[i] != undefined) {
            setTimeout(() => {
                    applyFlashStyle(i, styles, target)
            }, 1)
        }
    }

    applyFlashStyle(0, flashStyles, flashTarget)
}

function replaceContentWithLoader(loaderTarget){
    loaderTarget.empty()
    loaderTarget.prepend('<div id="loader" class="flash important-color"><span class="color-text">Loading <i class="fa-solid fa-spinner fa-spin"></i></span></div>')
}
