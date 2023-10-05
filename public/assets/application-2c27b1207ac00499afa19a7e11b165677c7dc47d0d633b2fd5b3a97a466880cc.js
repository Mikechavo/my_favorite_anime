// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails"
import "controllers"
//= require jquery
$(document).ready(function() {
  $("#goblinslayer").click(function() {
    // Toggle a CSS class to flip the image
    $(this).toggleClass("flipped");
  });
});
