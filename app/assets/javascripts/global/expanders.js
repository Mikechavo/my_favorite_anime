// description: toggles associated "expandable" element visibility on click
// usage: add .expander class and data-expandable attribute to element that will be clicked
//        add .expandable class and data-expander attribute to element which will expand
// ex: <span class="expander" data-expandable="this">Expand This!</span>  <div class="expandable" data-expander="this">hello world</div>
function bindExpanders(element){
  var expanders
  var expandables
  if(element === undefined){
    expanders = $('.expander')
    expandables = $(".expandable")
  } else {
    expanders = $(element + " .expander")
    expandables = $(element + " .expandable")
  }
  if(expanders.length > 0){
      expanders.on('click', function(){
          var dataExpandable = $(this).data('expandable')
          expandables.each(function(){
              if($(this).data('expander') === dataExpandable){
                  $(this).toggle()
                  if($(this).is('td')){
                      if($(this).css('display') == 'block'){
                          $(this).css('display', 'table-cell')
                      }
                  } else if ($(this).is('tr')){
                      if($(this).css('display') == 'block'){
                          $(this).css('display', 'table-row')
                      }
                  }
              }
          })
      })
  }
}

$(document).ready(function(){
  bindExpanders()
})
