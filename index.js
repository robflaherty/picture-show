const fs = require('fs')
const fse = require('fs-extra')
const exif = require('jpeg-exif')
var moment = require('moment')

var sourceImages = './source-images/'
var template = './resources/html.html'
var htmlFile = fs.readFileSync(template, {encoding: 'utf-8'})

var html = ''

var photos = []

var random =  Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

fse.emptyDirSync('public/img/')

fs.readdirSync(sourceImages).filter(file => (file !== '.DS_Store')).forEach((file) => {
  var cache = {}
  cache.file = file

  var metadata = exif.parseSync(sourceImages + file);

  if (metadata) {
    if (metadata.SubExif && metadata.SubExif.DateTimeOriginal) {
      cache.DateTimeOriginal = metadata.SubExif.DateTimeOriginal
      cache.date = moment(metadata.SubExif.DateTimeOriginal, 'YYYY:MM:DD HH:mm:ss').format('MMM Do, YYYY')
    }
  }

  photos.push(cache)

})

photos.sort((a,b) => (a.DateTimeOriginal > b.DateTimeOriginal) ? 1 : ((b.DateTimeOriginal > a.DateTimeOriginal) ? -1 : 0));

photos.forEach(photo => {
  html += '<a href="img/' + photo.file + '" data-gallery class="photo" style="background-image: url(img/' + photo.file +')" data-description="' + photo.date + '"></a>\n'
  fs.copyFileSync(sourceImages + photo.file, 'public/img/' + photo.file);
})

html += '</div>\n</body>\n</html>'

var doc = htmlFile + html

fs.writeFileSync('public/index.html', doc)




