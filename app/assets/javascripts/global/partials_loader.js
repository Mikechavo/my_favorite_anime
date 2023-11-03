function loadJsPartials(){
  setTimeout(function() {
    var target = $(".js-loader-link")[0];
    if(target !== undefined){
      target.click();
      target.remove();
      loadJsPartials();
    }
  }, 500)
}
