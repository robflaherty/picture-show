$(function() {

  $('#blueimp-gallery').on('slide', function(event, index, slide) {

    var photo = $('.container a')[index]
    var text = $(photo).data('description')
    console.log(text)

    $('#blueimp-gallery .description').html(text)

  });

});