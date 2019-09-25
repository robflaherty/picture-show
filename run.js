#!/usr/bin/env node

const fs = require('fs')
const fse = require('fs-extra')
const exif = require('jpeg-exif')
const moment = require('moment')
const sharp = require('sharp')
const open = require("open")

var argv = require('minimist')(process.argv.slice(2));
var sourceDir = argv['_'][0]
var targetDir = argv['_'][1]
var widthArg = argv['w']

var sourceImages;
var exportDir;
var width;

if (sourceDir) {
  sourceImages = sourceDir.endsWith('/') ? sourceDir : sourceDir + '/'
} else {
  console.log('Can\'t run: Need to specify directory to parse')
  return
}

if (targetDir) {
  exportDir = targetDir.endsWith('/') ? targetDir : targetDir + '/'
} else {
  console.log('Can\'t run: Need to specify directory to export to')
  return
}

if (widthArg) {
  width = parseInt(widthArg, 10)
} else {
  width = 1400
}

var templateDir = __dirname + '/template'
var template = templateDir + '/index.html'
var htmlFile = fs.readFileSync(template, {encoding: 'utf-8'})
var container = exportDir + 'picture-show/'
var folder = container + Math.random().toString(36).substring(2, 8) + Math.random().toString(36).substring(2, 8);

var html = ''
var photos = []

//fse.emptyDirSync('public')

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

html += '</div>\n</div>\n</body>\n</html>'

var doc = htmlFile + html

// Create Picture Viewer parent dir
if (!fs.existsSync(container)){
    fs.mkdirSync(container);
}

// Create gallery folder
if (!fs.existsSync(folder)){
    fs.mkdirSync(folder);
}

// Create img folder
if (!fs.existsSync(folder + '/img/')){
    fs.mkdirSync(folder + '/img/');
}

// Copy Template
fse.copySync(templateDir, folder)

// Write index file
fs.writeFileSync(folder +'/index.html', doc)

// Resize the images and copy to public folder
async function resizePhotos() {
  for (let photo of photos) {
    let resized = await sharp(sourceImages + photo.file).resize(width).toBuffer()
    fs.writeFileSync(folder + '/img/' + photo.file, resized)
  }
}

resizePhotos().then(result => {
  console.log('Done: ' + folder + '/index.html')
  open(folder + '/index.html');
})

