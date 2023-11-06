$(document).ready(function() {
  if ($(".scrollable-table .scroll-row").length){
    setScrollingHeaders();
    setInitialRowOffset();
  }
});

// description: displays fixed table header on selected elements
function setScrollingHeaders(){
  var scrollingHeaders = $('.scroll-row')
  scrollingHeaders.first().addClass('first-scroll-row')
  var headersOffset = scrollingHeaders.offset()
  var headersTop = 0
  if(headersOffset !== null){
    headersTop = headersOffset.top
  }
  $(window).scroll(function(){
    var documentTop = $(this).scrollTop()
    if(documentTop > headersTop){
      attachScrollingHeaders(scrollingHeaders)
    }
    else {
      detachScrollingHeaders(scrollingHeaders)
    }
  })
}

function setInitialRowOffset(){
  var firefoxOffset = IS_FIREFOX ? 2 : 1
  $(window).resize(function(){ positionTableHeader(firefoxOffset) });
  $(window).scroll(function(){ positionTableHeader(firefoxOffset) });
}

function positionTableHeader(firefoxOffset){
  var extraHeadersOffset = $('.first-scroll-row').offset().top - firefoxOffset
  var topScreenOffset = parseFloat($(document).scrollTop())
  $('.scrolled td').css('top', topScreenOffset-extraHeadersOffset + "px");
  $('.scrolled th').css('top', topScreenOffset-extraHeadersOffset + "px");
}

function attachScrollingHeaders(scrollingHeaders){
  scrollingHeaders.addClass(SCROLLED_CLASS)
}

function detachScrollingHeaders(scrollingHeaders){
  scrollingHeaders.removeClass(SCROLLED_CLASS)
  scrollingHeaders.children('td').css('top', '')
  scrollingHeaders.children('th').css('top', '')
}
