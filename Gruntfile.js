/*
 * grunt-version
 * https://github.com/kswedberg/grunt-version
 *
 * Copyright (c) 2013 Karl Swedberg
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>',
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp'],
    },
    copy: {
      tests: {
        files: [{
          src: ['test/fixtures/*'],
          dest: 'tmp/',
          filter: 'isFile',
          expand: true,
          flatten: true
        }]
      }
    },
    // Configuration to be run (and then tested).
    version: {
      options: {
        pkg: grunt.file.readJSON('test/fixtures/test-package.json')
      },
      prefix_option: {
        options: {
          prefix: 'version[\'"]?( *=|:) *[\'"]',
        },
        src: ['tmp/testing.js', 'tmp/testingb.js'],
      },
      release_option: {
        options: {
          release: 'patch'
        },
        src: [
          'tmp/123.js',
          'tmp/456.js',
          'tmp/test-package.json'
        ]
      },
      grunt_version: {
        options: {
          release: 'major',
          pkg: grunt.file.readJSON('test/fixtures/test-package-v.json')
        },
        src: [
          'tmp/test-package-v.json'
        ]
      },
      patch: {
        options: {
          release: 'patch',
          pkg: grunt.file.readJSON('package.json')
        },
        src: [
          'package.json'
        ]
      },
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js'],
    },

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-copy');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', [
    'clean',
    'copy',
    'version:prefix_option',
    'version:release_option',
    'version:grunt_version',
    'nodeunit'
  ]);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
