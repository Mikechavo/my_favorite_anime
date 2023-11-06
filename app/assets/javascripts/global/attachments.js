$(document).ready(function() {
  // removes existing attachments
  $(document).on('click', 'form.asset_fogs-form .remove-attachment', function(e){
    $(this).prev('input[type=hidden]').val('1');
    $(this).closest('tr').hide();
    e.preventDefault();
  });

  // removes new files to be attached
  $(document).on('click', 'form.asset_fogs-form .remove-field', function(e){
    $(this).prev('input[type=hidden]').val('1');
    $(this).closest('table').remove();
    e.preventDefault();
  });

  // adds new attachment to form
  $(document).on('click', 'form.asset_fogs-form .add_fields', function(e){
    var parentForm = $(this).parents('form')
    var time = new Date().getTime();
    var regexp = new RegExp($(this).data('id'), 'g');
    parentForm.find('.manage-attachments').after( $(this).data('fields').replace(regexp, time));
    e.preventDefault();
  });

  $(document).on("submit", "form.asset_fogs-form", function(e){
    if (!all_attachments_valid(this)) {
      e.preventDefault(); e.stopImmediatePropagation();
    }
  })
});

function all_attachments_valid(form){
  var valid_files = 0
  var total_files = 0
  $(form).find("input:file").each(function(){
    total_files += 1
    if( $(this).val() !== ''){
      valid_files += 1
    }
  })
  var missing_files = total_files - valid_files
  if(valid_files !== total_files){
    if(missing_files > 1){
      alert(missing_files + ' files are missing attachments')
    } else {
      alert(missing_files + ' file is missing an attachment')
    }
  }
  return valid_files === total_files
}
