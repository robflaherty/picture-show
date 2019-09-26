# Picture Show
A command line tool for generating a photo gallery from a folder of images.

[Demo Gallery](https://major9th.s3.amazonaws.com/picture-show/dyc56nxw2949/index.html)

## Installation
`npm install -g picture-show`

## Usage
Pass Picture Show a folder of images and tell it where to export the gallery to. Picture Show will resize the images to a set width (default is 1400px) and copy them into a new folder, named with a random string, along with the gallery HTML/CSS/JS. The original images will not be modified.

The image resizing library does not support HEIC so if exporting from Apple Photos make sure to export JPGs.

The script checks the Exif data for creation date (using `DateTimeOriginal`) and sorts by date.

`$ picture-show [source images dir] [export dir]`

Example: `$ picture-show ~/Desktop/photoFolder ~/Desktop`

### Options
`--show-date` : add this flag to display the photo creation date in the gallery

`-w [width in px]` : sets the width of the photos. default is 1400

Example with options: `$ picture-show ~/Desktop/photoFolder ~/Desktop -w 2000 --show-date`

### Credits
[blueimp Gallery](https://github.com/blueimp/Gallery) for the front end. [Sharp](https://github.com/lovell/sharp) for image resizing. [jpeg-exif](https://github.com/zhso/jpeg-exif) for reading exif data. [minimist](https://github.com/substack/minimist) for parsing command line arguments. [fs-extra](https://github.com/jprichardson/node-fs-extra) for file manipulation.