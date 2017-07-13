(function ($) {
  "use strict";

  var $apropos = $("#apropos");
  var $panelsBgs = $("div.panels", $apropos);
  var $panels = $('div.slice-wrapper', $apropos);
  var $images = $("div.images", $apropos);
  var $screenTab = $("#screens-tab");
  var $qrCodeBackdrop = $("#qr-code-lg");

  var currentSlide = "s1";

  // Activating the polyfill for object-fit 
  objectFitImages($('img', $images));

  /* ----- EVENTS ----- */
  $("div.slice").click(selectSlice);

  $('#screens-carousel', $screenTab).on('slid.bs.carousel', changeScreenLegend);

  $('ul.bs-tabs > li > a').click(scrollToApplication);

  $("#qr-code").click(function() {
    $qrCodeBackdrop.removeClass('hidden');
  });

  $qrCodeBackdrop.click(function() {
    $qrCodeBackdrop.addClass('hidden');
  });

  /* ----- FUNCTION ----- */

  /**
   * Scrolls the page so that the Application section is on top.
   */
  function scrollToApplication() {
    scrollTo('#ecrans');
  }

  /**
   * Changes the legend text to match the currently visible screen shot.
   * @param {*} e 
   */
  function changeScreenLegend(e) {
    var $activeLegend = $('.' + currentSlide, $screenTab);
    currentSlide = $(e.relatedTarget).attr('data-slide-id');
    var $newLegend = $('.' + currentSlide, $screenTab);
    $activeLegend.addClass('hidden');
    $newLegend.removeClass('hidden');
  }

  /**
   * Unselect the given slice in the "À propos" section.
   * This means hidding its content and collapsing the slice.
   * @param {*} slice
   */
  function unselectSlice($slice) {
    $slice.removeClass('selected');
    $('div.content', $slice).addClass('hidden');
    $("#slice-bg-" + $slice.attr('data-slice-id')).removeClass('selected');
  }

  /**
   * Select a clicked slice in the "À propos" section.
   */
  function selectSlice() {
    scrollTo('#apropos');

    var $slice = $(this);
    var $shown = $('img:not(.hidden)', $images);

    // If the user clicked an already opened slice, it will close iteself
    if ($slice.hasClass('selected')) {
      unselectSlice($slice);
      // Show the default image
      $('#aboutDef').removeClass('hidden');
      $shown.addClass('hidden');
    } else {
      var $selected = $panels.children('div.selected');
      unselectSlice($selected);
      $slice.addClass('selected');
      $("#slice-bg-" + $slice.attr('data-slice-id')).addClass('selected');

      // Show the adequate image depending on the slice clicked.
      // Wait for the slice to be completely open before showing its content.
      setTimeout(function () {
        $('div.content', $slice).removeClass('hidden');
        $("#about" + $slice.attr('data-slice-id')).removeClass('hidden');
        $shown.addClass('hidden');
      }, 200); // The 300 here corresponds to the 0.3s of transition in the CSS
    }
  }

  /**
   * Scrolls to the designated anchor so that it's on top.
   * @param {String} anchor 
   */
  function scrollTo(anchor) {
    $('html, body').stop().animate({
      scrollTop: ($(anchor).offset().top - 70)
    }, 700, 'easeInOutExpo');
  }
})(jQuery);
