'use strict';

module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        connect: {
            port: 1337,
            base: '.'
        }
    });
    grunt.loadNpmTasks('grunt-connect');
};

// grunt.loadNpmTasks('grunt-connect');

// grunt.registerTask('connect',['build']);