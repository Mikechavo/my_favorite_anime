$(document).ready(function(){
  if($(".scrollable-table .scroll-column").length){
    setScrollingColumns();
    setInitialColumnOffset();
  }
})

function setScrollingColumns(){
  var scrollingColumns = $(".scroll-column")
  var columnsOffset = scrollingColumns.offset()
  var columnsLeft = 0
  if(columnsOffset !== null){
    columnsLeft = columnsOffset.left
  }

  $(window).scroll(function(){
    var documentLeft = $(this).scrollLeft()
    if(documentLeft > columnsLeft){
      attachScrollingColumns(scrollingColumns)
    }
    else {
      detachScrollingColumns(scrollingColumns)
    }
  })
}

function setInitialColumnOffset(){
  var firstScrollColumn = $('table.scrollable-table tr td.scroll-column').first()
  var extraColumnOffset = 0
  var firstScrollColumnIndex = firstScrollColumn.index()
  if(firstScrollColumnIndex === 0){
    extraColumnOffset += firstScrollColumn.parent().offset().left
  } else {
    var placeHolderColumn = firstScrollColumn.parent().children().eq(firstScrollColumnIndex - 1)
    extraColumnOffset += placeHolderColumn.offset().left
    extraColumnOffset += placeHolderColumn.outerWidth()
  }
  $(window).resize(function(){ positionTableColumn(extraColumnOffset) });
  $(window).scroll(function(){ positionTableColumn(extraColumnOffset) });
}

function positionTableColumn(extraColumnOffset){
  var leftScreenOffset = parseFloat($(document).scrollLeft()) - 1
  $('.scroll-column.scrolled').css('left', leftScreenOffset-extraColumnOffset + "px");
}

function attachScrollingColumns(scrollingColumns){
  scrollingColumns.addClass(SCROLLED_CLASS)
}

function detachScrollingColumns(scrollingColumns){
  scrollingColumns.removeClass(SCROLLED_CLASS)
  scrollingColumns.css('left', '')
}
