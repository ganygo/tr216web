(function($) {
  "use strict"; // Start of use strict

  // Toggle the side navigation
  $("#sidebarToggle, #sidebarToggleTop").on('click', function(e) {
    $("body").toggleClass("sidebar-toggled");
    $(".sidebar").toggleClass("toggled");
    if ($(".sidebar").hasClass("toggled")) {
      $('.sidebar .collapse').collapse('hide');
    };
  });

  // Close any open menu accordions when window is resized below 768px
  $(window).resize(function() {
    if ($(window).width() < 768) {
      $('.sidebar .collapse').collapse('hide');
    };
  });

  // Prevent the content wrapper from scrolling when the fixed side navigation hovered over
  $('body.fixed-nav .sidebar').on('mousewheel DOMMouseScroll wheel', function(e) {
    if ($(window).width() > 768) {
      var e0 = e.originalEvent,
        delta = e0.wheelDelta || -e0.detail;
      this.scrollTop += (delta < 0 ? 1 : -1) * 30;
      e.preventDefault();
    }
  });

  // Scroll to top button appear
  $(document).on('scroll', function() {
    var scrollDistance = $(this).scrollTop();
    if (scrollDistance > 100) {
      $('.scroll-to-top').fadeIn();
    } else {
      $('.scroll-to-top').fadeOut();
    }
  });

  // Smooth scrolling using jQuery easing
  $(document).on('click', 'a.scroll-to-top', function(e) {
    var $anchor = $(this);
    $('html, body').stop().animate({
      scrollTop: ($($anchor.attr('href')).offset().top)
    }, 1000, 'easeInOutExpo');
    e.preventDefault();
  });

})(jQuery); // End of use strict

(function(){
            var originalAddClassMethod = jQuery.fn.addClass;
            var originalRemoveClassMethod = jQuery.fn.removeClass;
            jQuery.fn.addClass = function(){
                var result = originalAddClassMethod.apply( this, arguments );
                jQuery(this).trigger('classChanged');
                return result;
            }
            jQuery.fn.removeClass = function(){
                var result = originalRemoveClassMethod.apply( this, arguments );
                jQuery(this).trigger('classChanged');
                return result;
            }
        })();

  $(document).ready(function(){
        if(localStorage.getItem('accordionSidebar.toggled')=='true'){

            if($('#accordionSidebar').attr('class').indexOf('toggled')<0){
                $('#accordionSidebar').addClass('toggled');
                $('#page-top').attr('class','sidebar-toggled');
                
                
            }
        }else{
            if($('#accordionSidebar').attr('class').indexOf('toggled')>-1){
                $('#accordionSidebar').removeClass('toggled');
                $('#page-top').attr('class','');
            }
        }


        $('#accordionSidebar').on('classChanged',function(){
            if($('#accordionSidebar').attr('class').indexOf('toggled')>-1){
                localStorage.setItem('accordionSidebar.toggled',true);
            }else{
                localStorage.setItem('accordionSidebar.toggled',false);
            }
            
        });
    });

    

    

  
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
    // var target = this;
    // return target.replace(new RegExp(search, 'g'), replacement);
}