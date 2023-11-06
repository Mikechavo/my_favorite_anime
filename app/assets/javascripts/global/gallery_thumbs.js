$(document).ready(function(){
  var _URL = window.URL || window.webkitURL;
  $(".photo-form-container").on('change', 'form.gallery-thumb-photo-form .photo-file', function(){
    var photoForm = $(this).closest("form")
    photoForm.find(".photo_width").remove()
    photoForm.find(".photo_height").remove()
    var file, img;
    if ((file = this.files[0])) {
      img = new Image();
      img.onload = function () {
        photoForm.append('<input class="photo_width" type="hidden" name="photo[width]" value="' + this.width + '">')
        photoForm.append('<input class="photo_height" type="hidden" name="photo[height]" value="' + this.height + '">')
      };
      img.src = _URL.createObjectURL(file);
    }
  });

  $(".photo-form-container").on("submit", "form.gallery-thumb-photo-form", function(){
    if ($(this).find(".photo-file").val() == ""){
      alert("You have not chosen a file. \n");
      return false;
    }
  });
})