$(".submit-search-button").on("click", function() {
    var searchQuery = $(this).closest('.horizontal-grid').find("input[type='text']").val().trim().toLowerCase();
    $(".index-row").each(function() {
        var divContent = $(this).find(".horizontal-grid.divider-row");
        if (divContent.text().toLowerCase().includes(searchQuery)) {
            $(this).show();
        } else {
            $(this).hide();
        }

    })
});

$(".clear-search-bar").on("click", function() {
    $(".index-row").each(function () {
        $(this).show();
        $("input[type='text']").val("")
    })
})
  