'use strict';
var semver = require('semver');

var grunt = require('grunt');

/*
 ======== A Handy Little Nodeunit Reference ========
 https://github.com/caolan/nodeunit

 Test methods:
 test.expect(numAssertions)
 test.done()
 Test assertions:
 test.ok(value, [message])
 test.equal(actual, expected, [message])
 test.notEqual(actual, expected, [message])
 test.deepEqual(actual, expected, [message])
 test.notDeepEqual(actual, expected, [message])
 test.strictEqual(actual, expected, [message])
 test.notStrictEqual(actual, expected, [message])
 test.throws(block, [error], [message])
 test.doesNotThrow(block, [error], [message])
 test.ifError(value)
 */

exports.version = {
    setUp: function(done) {
        done();
    },
    prefix_option: function(test) {
        var files = grunt.config('version.prefix_option.src');
        test.expect(files.length);

        files.forEach(function(file) {
            var content = grunt.file.read(file);
            var actual = /version['"]?\s*[:=] ['"](\d\.\d\.\d)/.exec(content);
            actual = actual && actual[1];

            test.equal(actual, '0.1.0', 'Updates the file with version.');
        });
        test.done();
    },
    patch: function(test) {
        var files = grunt.config('version.patch.src');
        test.expect(files.length);

        files.forEach(function(file) {
            var content = grunt.file.read(file);
            var actual = /version['"]?\s*[:=] ['"](\d\.\d\.\d)/.exec(content);
            actual = actual && actual[1];

            test.equal(actual, '0.1.1', 'Increments the version and updates the file.');
        });

        test.done();
    },
    prerelease: function(test) {

        var file = grunt.config('version.prerelease.src');
        var content = grunt.file.read(file);
        var actual = /version['"]?\s*[:=] ['"](\d\.\d\.\d[\-\+a-zA-Z0-9\.]*)/.exec(content);
        actual = actual && actual[1];

        test.expect(1);
        test.equal(actual, '1.2.3-alpha.0', 'Increments the version and updates the file.');

        test.done();
    },
    minor: function(test) {
        var files = grunt.config('version.minor.src');
        test.expect(files.length);

        files.forEach(function(file) {
            var content = grunt.file.read(file);
            var actual = /version['"]?\s*[:=] ['"](\d\.\d\.\d)/.exec(content);
            actual = actual && actual[1];

            test.equal(actual, '1.3.0', 'Increments the version and updates the file.');
        });

        test.done();
    },
    literal: function(test) {
        test.expect(2);
        var pkg = grunt.file.readJSON('tmp/test-package-v.json');

        test.equal(pkg.version, '3.2.1', 'Sets package version to literal value');
        test.equal(pkg.devDependencies['grunt-version'], '>=0.1.0', 'Does NOT increment grunt-version');
        test.done();
    },
    prerelease_build: function(test) {
        var files = grunt.config('version.prerelease_build.src');
        test.expect(files.length);

        files.forEach(function(file) {
            var content = grunt.file.read(file);
            var actual = /version['"]?\s*[:=] ['"]([^'"]+)/.exec(content);
            actual = actual && actual[1];

            test.equal(actual, '1.0.0-beta.2', 'Increments the version and updates the file.');
        });

        test.done();
    },
    ignore_default: function (test) {
        var files = grunt.config('version.ignore_default.src');
        test.expect(files.length);

        files.forEach(function(file) {
            var content = grunt.file.read(file);
            var actual = /version['"]?\s*[:=] ['"]([^'"]+)/.exec(content);
            actual = actual && actual[1];

            console.log(file, actual);

            if (file.indexOf('node_modules') !== -1) {
                test.equal(actual, '0.1.0', 'Files containing node_modules in their path shouldn\'t be updated');
            } else {
                test.equal(actual, '0.1.1', 'Update the files to 0.1.0 except those containing node_modules/ in their path');
            }
        });

        test.done();
    },
    ignore_list: function (test) {
        var files = grunt.config('version.ignore_list.src');
        test.expect(files.length);

        files.forEach(function(file) {
            var content = grunt.file.read(file);
            var actual = /version['"]?\s*[:=] ['"]([^'"]+)/.exec(content);
            actual = actual && actual[1];

            if (file.indexOf('node_modules') !== -1 || file.indexOf('ignored_dir') !== -1) {
                test.equal(actual, '0.1.0', 'Files containing node_modules or ignored_dir in their path shouldn\'t be updated');
            } else {
                test.equal(actual, '0.1.1', 'Update the files to 0.1.1 except those containing node_modules/ & ignored_dir in their path');
            }
        });

        test.done();
    }
};
