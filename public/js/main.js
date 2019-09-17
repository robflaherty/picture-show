$(function() {

  $('#blueimp-gallery').on('slide', function(event, index, slide) {

    var photo = $('.container a')[index]
    var text = $(photo).data('description')
    console.log(text)

    $('#blueimp-gallery .description').html(text)

    // var text = this.list[index].getAttribute('data-description'),
    //   node = this.container.find('.description')
    // node.empty()
    // if (text) {
    //   node[0].appendChild(document.createTextNode(text))
    // }

  });

});