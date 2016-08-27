//https://semaphoreci.com/community/tutorials/setting-up-an-end-to-end-testing-workflow-with-gulp-mocha-and-webdriverio
var gulp = require('gulp');
var selenium = require('selenium-standalone')
var webdriver = require('gulp-webdriver');

var seleniumServer;

var spawn = require('child_process').spawn;
var serverProcess = undefined;

gulp.task('http', function(done) {
    serverProcess = spawn('node', ['.']);
    done();
//    serverProcess = exec('node .', function(error, stdout, stderr) {
//        done();
//    });
});

gulp.task('selenium', function(done) {
    selenium.install({logger: console.log}, () => {
        selenium.start((err, child) => {
            if (err) { return done(err); }
            seleniumServer = child;
            done();
        });
    });
});

gulp.task('e2e', ['http', 'selenium'], () => {
  return gulp.src('wdio.conf.js')
    .pipe(webdriver()).on('error', () => {
      seleniumServer.kill();
      process.exit(1);
    });
});

gulp.task('test', ['e2e'], () => {
  serverProcess.kill();
  seleniumServer.kill();
});