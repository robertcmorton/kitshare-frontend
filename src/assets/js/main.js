$(document).ready(function() {
    jQuery('.skdslider').skdslider({ delay: 5000, animationSpeed: 2000, showNextPrev: true, showPlayButton: false, autoSlide: true, animationType: 'fading' });
    $('.dropdown-submenu  .sub_show').on("click", function(e) {
        $(this).next('ul').toggle(300);
        $(this).toggleClass('open');
        e.stopPropagation();
        e.preventDefault();
    });
    $(".header_cat li a.cat_icon").click(function() { $(".header_show_icon img ").attr('src', $(this).attr('href')); return false; });
    $(".search_cat li a.cat_ch").click(function() { $(".caragory_search_icon img ").attr('src', $(this).attr('href')); return false; });

    if (window.screen.width < 767) {

        $(".ViewSearch").on("click", function() {
            //alert('mobile');
            console.log('mobile')
            $(".mViewSearch ").toggle();
        });

        $('#mapView').on("click", function() {
            console.log('mobile')
            $('.mapWrap').addClass('mobileMap');
        });
        $('.mapClose').on("click", function() {
            console.log('mobile')
            $('.mapWrap').removeClass('mobileMap');
        });
    }

});