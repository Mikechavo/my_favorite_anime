$(document).ready(function(){
	bindOpenOverlays()
	bindCloseOverlays()
})

function bindOpenOverlays(element){
	var overlays
	var targetRel = "a[rel$='#overlay']"
	if(element === undefined){
		overlays = $(targetRel)
	} else {
		overlays = $(element + " " + targetRel)
	}
	overlays.overlay({
		effect: 'apple',
		top: '5%',
        left: '16%',
		onBeforeLoad: function() {
			//hide flash video thumbnails on some browsers (z-index conflict)
			if (!$.browser.mozilla) {$("div.vid_thumb").css({ visibility: "hidden" });}
			// grab wrapper element inside content
      if (this.getTrigger().attr("href").indexOf("preview") >= 0 || this.getTrigger().attr("href").indexOf("edit") >= 0) {
          // $(".apple_overlay").css({'height': 'auto'});
          // $(".contentWrap").css({'width':'auto'})
      } else {
          ''
      }
      var wrap = this.getOverlay().find(".contentWrap");
			// load the page specified in the trigger
			wrap.load(this.getTrigger().attr("href"));
		},
		closeOnClick: false,
		onBeforeClose: function () {
			$('div.contentWrap').html("<br/>");
		},
		onClose: function () {
			if (!$.browser.mozilla) {
				$("div.vid_thumb").css({ visibility: "visible" });
			}
		}
	});
}

function bindCloseOverlays(){
	$('#overlay').on('click', 'a.close-overlay', function(){
		$("a.close").click();
		return false
	})
}
