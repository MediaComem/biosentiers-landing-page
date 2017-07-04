(function ($) {
  "use strict";

  console.log('Bonjour');
  
  var $apropos = $("#apropos");
  var $panels = $("div.panels", $apropos);
  var $images = $("div.images", $apropos);

  /* ----- EVENTS ----- */
  $("div.slice").click(selectSlice);

  /* ----- FUNCTION ----- */

  /**
   * Unselect the given slice in the "À propos" section.
   * This means hidding its content and collapsing the slice.
   * @param {*} slice 
   */
  function unselectSlice($slice) {
    $slice.removeClass('selected');
    $('div.content', $slice).addClass('hidden');
  }

  /**
   * Select a clicked slice in the "À propos" section.
   */
  function selectSlice() {
    var $slice = $(this);
    var $shown = $('img:not(.hidden)', $images);

    // If the user clicked an already opened slice, it will close iteself
    if ($slice.hasClass('selected')) {
      unselectSlice($slice);
      // Show the default image
      $('#aboutDef').removeClass('hidden');
    } else {
      var $selected = $panels.children('div.selected')
      unselectSlice($selected);
      $slice.addClass('selected');
      // Show the adequate image depending on the slice clicked.
      $slice.hasClass('red') && $("#about1").removeClass('hidden');
      $slice.hasClass('orange') && $("#about2").removeClass('hidden');
      $slice.hasClass('blue') && $("#about3").removeClass('hidden');
      // Wait for the slice to be completely open before showing its content.
      setTimeout(function () {
        $('div.content', $slice).removeClass('hidden');
      }, 300); // The 300 here corresponds to the 0.3s of transition in the CSS
    }
    $shown.addClass('hidden');
  }
})(jQuery);