$(document).ready(function() {
  $('.button-unified.submit-modal-custom').on('click', function() {
    // Trigger a click event on the submit button
    $('input[type="submit"][name="commit"][value="Save changes"][data-disable-with="Save changes"]').click();
    });
  });