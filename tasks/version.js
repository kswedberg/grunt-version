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
      replace: '[0-9a-zA-Z\\-_\\+\\.]+',
      pkg: 'package.json',
      release: ''
    });


    var log = function log(type, info) {
      var msgs = {
        notFound: [ 'Pattern not found in file', 'Pattern: ' + info.pattern ],
        skipped: [ 'File skipped.',  'Current version and new version are equal: ' + info.version ],
        updated: [
          'File updated.',
          'Old version: ' + info.fileVersion + '. New version: ' + info.version + '.'
        ]
      };
      grunt.log.subhead( msgs[type][0] );
      grunt.log.writeln('Path: ' + info.filePath);
      grunt.log.writeln( msgs[type][1] );
    };

    if (typeof options.pkg === 'string') {
      options.pkg = grunt.file.readJSON(options.pkg);
    }

    var newVersion,
        release = this.args && this.args[0] || options.release,
        semver = require('semver'),
        version = options.pkg.version,
        bump = /major|minor|patch|prerelease/.test(release),
        literal = semver.valid(release);

    if ( bump && semver.valid(version) ) {
      newVersion = semver.inc(version, release);
    } else if (literal) {
      newVersion = literal;
    } else if (release) {
      grunt.log.warn(release + ' must be a valid release name or semver version. Version will not be updated.');
    }

    version = newVersion || version;

    this.filesSrc.forEach(function(filepath) {
      // Warn if a source file/pattern was invalid.
      if (!grunt.file.exists(filepath)) {
        grunt.log.error('Source file "' + filepath + '" not found.');
        return '';
      }
      // Read file source.
      var fileInfo = {
        file: grunt.file.read(filepath),
        filePath: filepath,
        version: version,
        pattern: new RegExp('(' + options.prefix + ')(' + options.replace + ')', 'g')
      };
      var newfile,
          matches = fileInfo.pattern.exec(fileInfo.file);

      if (!matches) {
        log('notFound', fileInfo);
      } else {
        fileInfo.fileVersion = matches.pop();

        if (fileInfo.fileVersion === version) {
          log('skipped', fileInfo);
        } else {
          log('updated', fileInfo);
          newfile = fileInfo.file.replace(fileInfo.pattern, '$1' + version);
          grunt.file.write(filepath, newfile);
        }
      }
    });

  });

};
