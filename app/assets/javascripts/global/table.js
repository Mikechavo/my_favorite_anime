$(document).ready(function() {
    $(".upper-row").hover(function(){
        $(this).next().addClass('hover');
    }, function(){
        $(this).next().removeClass('hover');
    });
    $(".lower-row").hover(function(){
        $(this).prev().addClass('hover');
    }, function(){
        $(this).prev().removeClass('hover');
    });
    $(".multi-row-cell").hover(function(){
        $(this).siblings().addClass('no-hover');
        $(this).parent().next().children().addClass('no-hover')
    }, function() {
        $(this).siblings().removeClass('no-hover');
        $(this).parent().next().children().removeClass('no-hover')
    });
});
