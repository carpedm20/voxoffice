$( document ).ready(function() {
  /* for front-end */
  $(".reply-btn").click(function() {
    if ($('#'+$(this).attr('name')).children().size() == 0) {
      var id = $(this).attr('name');
      var input = "<input type=\"hidden\" name=\"parent\" value=\"" + id + "\">";
      var form = $("<div>").append($(write_form).append(input).clone()).html();

      $('#'+$(this).attr('name')).append(form);
    }
  });

  /* for backend */
  $(this).find(".guide").twipsy({delayIn:1500,offset:1});

});
