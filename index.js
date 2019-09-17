const fs = require('fs')
const fse = require('fs-extra')
const exif = require('jpeg-exif')
const moment = require('moment')
const sharp = require('sharp')

var sourceImages = './source-images/'
var template = './resources/html.html'
var htmlFile = fs.readFileSync(template, {encoding: 'utf-8'})

var html = ''

var photos = []

var random =  Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

fse.emptyDirSync('public/img/')

// Get images and metadata
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

// Sort by creation date
photos.sort((a,b) => (a.DateTimeOriginal > b.DateTimeOriginal) ? 1 : ((b.DateTimeOriginal > a.DateTimeOriginal) ? -1 : 0));

// Build the HTML
photos.forEach(photo => {
  html += '<a href="img/' + photo.file + '" data-gallery class="photo" style="background-image: url(img/' + photo.file +')" data-description="' + photo.date + '"></a>\n'
})

html += '</div>\n</body>\n</html>'

var doc = htmlFile + html

fs.writeFileSync('public/index.html', doc)

// Resize the images and copy to public folder
photos.forEach(photo => {

  var resized = sharp(sourceImages + photo.file).resize(1400).toBuffer().then(data => {
    fs.writeFileSync('public/img/' + photo.file, data);
  })
  .catch(err => {
    console.log(err)
  });

})





