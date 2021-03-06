module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        wiredep: {
            task: {
                // Point to the files that should be updated when
                // you run `grunt wiredep`
                src: [
                    'views/**/*.html',   // .html support...
                    'views/*.html',
                    'views/**/*.ejs',   // .ejs support...
                    'views/*.ejs'
                ],
                options: {
                    exclude: [/ratchet/]
                    // See wiredep's configuration documentation for the options
                    // you may pass:

                    // https://github.com/taptapship/wiredep#configuration
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-wiredep');
        
    //  // Load the plugin that provides the "uglify" task.
    //  grunt.loadNpmTasks('grunt-contrib-uglify');
    //
    //  // Default task(s).
    //  grunt.registerTask('default', ['uglify']);

};