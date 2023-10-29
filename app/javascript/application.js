// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
// import "@hotwired/turbo-rails"
// import "controllers"
//= require jquery
//= require popper
//= require bootstrap-sprockets

$(document).ready(function() {
  $(".title").click(function() {
    // Toggle a CSS class to flip the image
    $(this).toggleClass("flipped");
  });
  $("#myImage3").click(function() {
    var $img = $(this);

    // Check the current src attribute
    var currentSrc = $img.attr("src");

    // Define the paths for the two images you want to switch between
    var image1 = "https://static.bandainamcoent.eu/high/jujutsu-kaisen/jujutsu-kaisen-cursed-clash/00-page-setup/JJK-header-mobile2.jpg";
    var image2 = "https://static1.colliderimages.com/wordpress/wp-content/uploads/2022/08/Jujutsu-Kaisen.jpg";

    // Toggle between the two images
    if (currentSrc === image1) {
      $img.attr("src", image2);
    } else {
      $img.attr("src", image1);
    }
  });

  // berserk image
  $("#myImage2").click(function() {
    var $img = $(this);
  
    // Check the current src attribute
    var currentSrc = $img.attr("src");
  
    // Define the paths for the two images you want to switch between
    var image1 = "https://destroythecomics.com/wp-content/uploads/2017/06/berserk1280jpg-7586fc_1280w.jpg";
    var image2 = "https://images.immediate.co.uk/production/volatile/sites/3/2023/03/Untitled-375a1ce.jpg?resize=768,574";
  
    // Toggle between the two images
    if (currentSrc === image1) {
      $img.attr("src", image2);
    } else {
      $img.attr("src", image1);
    }
  });
   // GoblinSlayer image
   $("#myImage1").click(function() {
    var $img = $(this);
  
    // Check the current src attribute
    var currentSrc = $img.attr("src");
  
    // Define the paths for the two images you want to switch between
    var image1 = "https://i0.wp.com/news.qoo-app.com/en/wp-content/uploads/sites/3/2023/03/Goblin-Slayer-Another-Adventurer-Nightmare-Feast-008.jpeg?resize=900%2C506&ssl=1";
    var image2 = "https://platform-sc.g123.jp/h5-g123/game/goblinslayer/en/ogp.png";
  
    // Toggle between the two images
    if (currentSrc === image1) {
      $img.attr("src", image2);
    } else {
      $img.attr("src", image1);
    }
  });
});

$(document).ready(function() {

})






$(document).ready(function() {
  // When the "Open Modal" button is clicked
  $("#myModal").modal("hide");

  // When the "Open Modal" button is clicked
  $("#openModal").click(function() {
    $("#myModal").modal("");
  });

  // When the modal-trigger image is clicked
  $("#myImage3").click(function() {
    $("#myModal").modal("show");
  });
});