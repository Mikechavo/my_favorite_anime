$(document).ready(function() {
	// Create custom input classes for jEditable//
	$.editable.addInputType('datepicker', {
  	element: function(settings, original) {
			var form = $(this);
    	var input = $('<input size="20" id="project[deadline]" class="smooth" />');
			console.log(settings); console.log(original);
      // Catch the blur event on month change and don't cancel inline editing onblur to allow clicking datepicker
      settings.onblur = function(e) { };
      input.datepicker({
        dateFormat: 'MM dd, yy',
        showOn: 'both',
      });
      input.datepicker('option', 'showAnim', 'slide');
      $(this).append(input);
      return (input);
    }
  });

	$.editable.addInputType('custom_input', {
  	element : function(settings, original) {
    	var input = $('<input size="20" id="project_deadline" class="smooth"/>');
			console.log(settings);
			console.log(original);
      if (settings.width  != 'none') { input.attr('width', settings.width);  }
      if (settings.height != 'none') { input.attr('height', settings.height); }
      /* https://bugzilla.mozilla.org/show_bug.cgi?id=236791 */
      //input[0].setAttribute('autocomplete','off');
      input.attr('autocomplete','off');
      $(this).append(input);
      return(input);
    }
  });

  $.editable.addInputType('password_input', {
  	element : function(settings, original) {
    	var input = jQuery('<input size="40" type="password" class="smooth"/>');
      if (settings.width  != 'none') { input.attr('width', settings.width);  }
      if (settings.height != 'none') { input.attr('height', settings.height); }
      /* https://bugzilla.mozilla.org/show_bug.cgi?id=236791 */
      //input[0].setAttribute('autocomplete','off');
      input.attr('autocomplete','off');
      input.appendTo(jQuery(this)).showPassword({'checkbox':'#checkbox'});
      return(input);
    }
  });

	$.editable.addInputType('ckeditor', {
	    /* Use default textarea instead of writing code here again. */
	    //element : $.editable.types.textarea.element,
	    element : function(settings, original) {
	        /* Hide textarea to avoid flicker. */
					console.log(settings); console.log(original);
					settings.onblur = function(e) { };
	        var textarea = $('<textarea>').css("opacity", "0").generateId();
	        if (settings.rows) {
	            textarea.attr('rows', settings.rows);
	        } else {
	            textarea.height(settings.height);
	        }
	        if (settings.cols) {
	            textarea.attr('cols', settings.cols);
	        } else {
	            textarea.width(settings.width);
	        }
	        $(this).append(textarea);
	        return(textarea);
	    },
	    content : function(string, settings, original) { 
	        /* jWYSIWYG plugin uses .text() instead of .val()        */
	        /* For some reason it did not work work with generated   */
	        /* textareas so I am forcing the value here with .text() */
	        $('textarea', this).text(string);
	    },
	    plugin : function(settings, original) {
	        var self = this;
	        if (settings.ckeditor) {
	            setTimeout(function() { CKEDITOR.replace($('textarea', self).attr('id'), settings.ckeditor); }, 0);
	        } else {
	            setTimeout(function() { CKEDITOR.replace($('textarea', self).attr('id')); }, 0);
	        }
	    },
	    submit : function(settings, original) {
	        $('textarea', this).val(CKEDITOR.instances[$('textarea', this).attr('id')].getData());
		      CKEDITOR.instances[$('textarea', this).attr('id')].destroy();
	    }
	});
  
});