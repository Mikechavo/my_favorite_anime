// NOTE: sort stability (retaining previous order) varies by browser, IE6+ stable, FF 3+ stable, Chrome unstable, Opera 10+ stable, Safari 4 stable
// NOTE: if stability is needed, sort by previous index when elements are equal. (Not implemented due to potential performance problems)
$(document).ready(function(){
  let clickedRow
  let newSortArray;
  let previousIndex;
  let sortAscending
  let previousIndicator

  // ===============================================
  // Sorts with td or th, depending on which is used
  // -----------------------------------------------
  $(".sort-row td, .sort-row th").not(".skip-sort").on('click', function(){
    clickedRow = $(this).closest(".sort-row")
    previousIndex = clickedRow.data('previous-index')
    sortAscending = clickedRow.data('sort-ascending')
    previousIndicator = clickedRow.data('previous-indicator')
    newSortArray = sortColumn($(this), sortAscending, previousIndex, previousIndicator)
    clickedRow.data('previous-index', newSortArray[0])
    clickedRow.data('sort-ascending', newSortArray[1])
    clickedRow.data('previous-indicator', newSortArray[2])
    reNumberRows(clickedRow);
  })
  
  // sort on load using initial sort column
  $(".sort-row").each(function(){
    clickedRow = $(this)
    addSortIndicators(clickedRow)
    performInitialSorting(clickedRow)
  })
})

// =================== Updated Method ==========================================
// Allows the use of "th" or "td" to display sort indicator
function addSortIndicators(clickedRow) {
  let columnHeaders;

  if (clickedRow.children('td').length > 0) {
    columnHeaders = clickedRow.children('td');
  } else if (clickedRow.children('th').length > 0) {
    columnHeaders = clickedRow.children('th');
  }

  columnHeaders.each(function() {
    // do not put sort indicators on blank columns
    if ($(this).text() && $(this).attr('class') !== 'skip-sort') {
      $(this).append(UNSORTED_SORT_INDICATOR);
    }
  });
}





function performInitialSorting(clickedRow){
  let initialAscending = clickedRow.find("#initial-sort-ascending")
  let initialDescending = clickedRow.find("#initial-sort-descending")
  let firstColumn = clickedRow.children('td').first()
  if(clickedRow.closest("thead").find(".no-initial-sort").length === 0){
    if (initialAscending.length){
      initialAscending.click()
    } else if (initialDescending.length){
      initialDescending.click()
      initialDescending.click()
    } else {
      firstColumn.click()
    }
  }
}

function sortColumn(selectedColumn, sortAscending, previousIndex, previousIndicator){
  let currentIndex = selectedColumn.index()
  let newSortArray = toggleSortOrder(previousIndex, currentIndex, sortAscending)
  let newPreviousIndex = newSortArray[0]
  let newSortAscending = newSortArray[1]
  let newPreviousIndicator = toggleSortIndicator(selectedColumn, currentIndex, newSortAscending, previousIndicator)
  let rows
  let useTextSort
  selectedColumn.closest("thead").next("tbody").each(function(){
    rows = $(this).children("tr")
    useTextSort = $(rows).eq(0).children('td').eq(currentIndex).data('sort') === undefined
    sortRows(rows, currentIndex, useTextSort, newSortAscending)
  })
  
  return [newPreviousIndex, newSortAscending, newPreviousIndicator]
}

function toggleSortOrder(previousIndex, currentIndex, sortAscending){
  let newSortAscending = false
  let newPreviousIndex
  if(previousIndex !== currentIndex){
    newPreviousIndex = currentIndex;
  } else if(!sortAscending){
    newSortAscending = true;
  }
  return [newPreviousIndex, newSortAscending]
}

function toggleSortIndicator(selectedColumn, currentIndex, sortAscending, previousIndicator){
  let row = selectedColumn.closest("tr")
  row.find(".sort-indicator").remove()
  if(currentIndex !== previousIndicator){
    let previousColumn = row.children().eq(previousIndicator)
    // do not put sort indicators on blank columns
    if(previousColumn.text()){
      previousColumn.append(UNSORTED_SORT_INDICATOR)
    }
  }
  selectedColumn.children(".unsorted-sort-indicator").remove()
  // do not put sort indicators on blank columns
  if(selectedColumn.text()){
    if(sortAscending){
      selectedColumn.append(ASCENDING_SORT_INDICATOR)
    } else {
      selectedColumn.append(DESCENDING_SORT_INDICATOR)
    }
  }
  return currentIndex
}

function sortRows(rows, currentIndex, useTextSort, sortAscending){
  if(useTextSort){
    rows.sort(function(rowOne, rowTwo){
      return sortByText(rowOne, rowTwo, currentIndex, sortAscending)
    })
  } else {
    rows.sort(function(rowOne, rowTwo){
      return sortByDataSort(rowOne, rowTwo, currentIndex, sortAscending)
    })
  }
  let sortTable = rows.first().closest('tbody')
  $.each(rows, function(index, row){
    sortTable.append(row);
  })
}

function sortByText(rowOne, rowTwo, currentIndex, sortAscending){
  let first = $(rowOne).children('td').eq(currentIndex).text().toUpperCase()
  let second = $(rowTwo).children('td').eq(currentIndex).text().toUpperCase()
  return sortAscending ? ascendingLogic(first, second) : descendingLogic(first, second)
}

function sortByDataSort(rowOne, rowTwo, currentIndex, sortAscending){
  let first = $(rowOne).children('td').eq(currentIndex).data('sort')
  let second = $(rowTwo).children('td').eq(currentIndex).data('sort')
  return sortAscending ? ascendingLogic(first, second) : descendingLogic(first, second)
}

function ascendingLogic(first, second){
  if(first < second){
    return 1
  }
  if(first > second){
    return -1
  }
  return 0
}

function descendingLogic(first, second){
  // special logic to put blanks at end and maintain order
  if(first === second){
    return 0
  }
  if(isBlankForSort(first)){
    return 1
  }
  if(isBlankForSort(second)){
    return -1
  }
  return standardDescendingLogic(first, second)
}

function isBlankForSort(value){
  return (value === null || value === '-' || value === '')
}

function standardDescendingLogic(first, second){
  if(first < second){
    return -1
  }
  if(first > second){
    return 1
  }
  return 0
}

// this will need to be modified if used by two tables on the same page
function reNumberRows(clickedRow){
  clickedRow.find('.static-numbers').each(function(index, element) {
    $(element).text(index + 1);
  })
}
