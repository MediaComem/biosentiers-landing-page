(function ($) {
  $('.panel').click(function () {
    var imgs = $('.img-accord');
    for (i = 0; i < imgs.length; i++) {
      imgs[i].style.visibility = 'hidden';
    }

    $("#" + $(this).attr("target-id")).css("visibility", "visible")

    var currentItemClass = this.className;

    var child = $(this).children(".panel-heading1");
    var Expandables = ($(child).attr("aria-expanded") == "true");
    console.log("1", Expandables, typeof (Expandables));

    var panels = $('.panel');

    for (var i = 0; i < panels.length; i++) {
      var className = panels[i].className;
      var child = $(panels[i]).children(".panel-heading1");
      if (currentItemClass == className) {
        child.css({
          "padding-top": "10%",
          "padding-bottom": "10%",
        })
      } else {
        if (Expandables) {
          console.log("5%", Expandables);
          child.css({
            "padding-top": "5%",
            "padding-bottom": "5%",
          })
        } else {
          console.log("10%", Expandables);
          child.css({
            "padding-top": "10%",
            "padding-bottom": "10%",
          })
        }
      }
    }
  })
})(jQuery);
