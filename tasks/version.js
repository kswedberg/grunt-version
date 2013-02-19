/*
 * grunt-version
 * https://github.com/kswedberg/grunt-version
 *
 * Copyright (c) 2013 Karl Swedberg
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  grunt.registerMultiTask('version', 'Update version number in all the files.', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      prefix: '[^\\-]version[\'"]?\\s*[:=]\\s*[\'"]',
      pkg: grunt.config('pkg'),
      release: ''
    });

    var newVersion,
        semver = require('semver'),
        version = options.pkg.version;

    if ( options.release ) {
      if ( !/major|minor|patch|build/.test(options.release) ) {
        grunt.log.warn(options.release + ' is not a valid semver release. Version will not be incremented');
      } else {
        newVersion = semver.inc(version, options.release);
      }
    }
    version = newVersion || version;

    // Iterate over all specified file groups.
    this.files.forEach(function(fileObj) {
      // The source files to be modified. The "nonull" option is used
      // to retain invalid files/patterns so they can be warned about.
      var files = grunt.file.expand({nonull: true}, fileObj.src);

      files.forEach(function(filepath) {
        // Warn if a source file/pattern was invalid.
        if (!grunt.file.exists(filepath)) {
          grunt.log.error('Source file "' + filepath + '" not found.');
          return '';
        }
        // Read file source.
        var pattern = new RegExp('(' + options.prefix + ')[0-9a-zA-Z\\-_\\.]+', 'g'),
            file = grunt.file.read(filepath),
            newfile = file.replace(pattern, '$1' + version);

        if (!pattern.test(file)) {
          grunt.log.subhead('Pattern not found');
          grunt.log.writeln('Path: ' + filepath);
          grunt.log.writeln('Pattern: ' + pattern);
        } else {

          grunt.log.subhead('File updated');
          grunt.log.writeln('Path: ' + filepath);
          grunt.log.writeln('Version: ' + version);

        }
        grunt.file.write(filepath, newfile);
      });

    });
  });

};
