jQuery.fn.submitWithAjax = function() {
  this.submit(function() {
    $.post(this.action, $(this).serialize(), null, "script");
    return false;
  })
  return this;
};

$(document).ready(function(){
  bindGetFormWithAjax()
})

function bindDeleteWithAjax(element){
  var deleteLinks
  var targetClass = ".delete-with-ajax"
  if(element === undefined){
    deleteLinks = $(targetClass)
  } else {
    deleteLinks = $(element + " " + targetClass)
  }
  deleteLinks.click(function(){
    var confirmMessage = $(this).data('confirm-delete') || 'Confirm delete'
    if(confirm(confirmMessage)){
      fireReloader(this)
      $.ajax({ type: "DELETE", url: $(this).attr("href"), dataType: "script" })
    }
    return false
  })
}

function bindGetFormWithAjax(element){
  var getForms
  var targetClass = "form.get-with-ajax"
  if(element === undefined){
    getForms = $(targetClass)
  } else {
    getForms = $(element + " " + targetClass)
  }
  getForms.submit(function(){
    fireReloader(this)
    $.get(this.action, $(this).serialize(), null, "script")
    return false
  })
}

function bindPostFormWithAjax(element){
  var postForms
  var targetClass = "form.post-with-ajax"
  if(element === undefined){
    postForms = $(targetClass)
  } else {
    postForms = $(element + " " + targetClass)
  }
  postForms.submit(function(){
    fireReloader(this)
    $.post(this.action, $(this).serialize(), null, "script")
    return false
  })
}

function bindPutFormWithAjax(element){
  var putForms
  var targetClass = "form.put-with-ajax"
  if(element === undefined){
    putForms = $(targetClass)
  } else {
    putForms = $(element + " " + targetClass)
  }
  putForms.submit(function(){
    fireReloader(this)
    $.ajax({ type: "PUT", url: this.action, data: $(this).serialize(), dataType: "script" })
    return false
  })
}

function bindGetLinkWithAjax(element){
  var getLinks
  var targetClass = "a.get-with-ajax"
  if(element === undefined){
    getLinks = $(targetClass)
  } else {
    getLinks = $(element + " " + targetClass)
  }
  getLinks.click(function(){
    fireReloader(this)
    $.get($(this).attr("href"), null, null, "script")
    return false
  })
}

function bindPutLinkWithAjax(element){
  var getLinks
  var targetClass = "a.put-with-ajax"
  if(element === undefined){
    getLinks = $(targetClass)
  } else {
    getLinks = $(element + " " + targetClass)
  }
  getLinks.click(function(){
    var confirmMessage = $(this).data("confirm-put")
    if(confirmMessage === undefined || confirm(confirmMessage)){
      fireReloader(this)
      $.ajax({ type: "PUT", url: $(this).attr("href"), data: $(this).serialize(), dataType: "script" })
    }
    return false
  })
}

function fireReloader(target){
  var reloadTarget = $(target).data('reloader')
  if(reloadTarget !== null){
    var reloadContainer = $('[data-reloadable="' + reloadTarget + '"]')
    reloadContainer.children().hide()
    reloadContainer.append('<div id="loader" class="flash important-color"><span class="color-text">Loading <i class="fa-solid fa-spinner fa-spin"></i></span></div>')
  }
}
